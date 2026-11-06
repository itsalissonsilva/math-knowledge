import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import katex from 'katex';
import {plainIntro, sentenceExcerpt} from './wikipedia-excerpts.mjs';

const root = new URL('../public/', import.meta.url);
const snapshot = JSON.parse(await fs.readFile(new URL('wikipedia-catalog.json', root), 'utf8'));
const learningFile = new URL('wikipedia-learning.json', root);
const learning = JSON.parse(await fs.readFile(learningFile, 'utf8'));
const cache = process.argv[2] ?? path.join(os.tmpdir(), 'mapofmathematics-wikipedia-read-cache');
function wikiKey(title) {
  try { title = decodeURIComponent(title); } catch {}
  return title.split('#')[0].replaceAll('_', ' ').toLowerCase();
}
const articles = new Map();

function readPages(payload) {
  for (const page of payload.query?.pages ?? []) {
    const revision = page.revisions?.[0];
    const raw = revision?.slots?.main?.content;
    if (raw) articles.set(wikiKey(page.title), {title: page.title, raw, revision: page.lastrevid ?? revision.revid});
  }
}
for (const file of await fs.readdir(cache)) {
  if (file.endsWith('.json')) readPages(JSON.parse(await fs.readFile(path.join(cache, file), 'utf8')));
}
if (process.argv[3]) readPages(JSON.parse(await fs.readFile(process.argv[3], 'utf8')));

const linkPattern = /\[\[([^|\]]+)(?:\|([^\]]+))?\]\]/g;
const cleanup = text => text.replace(/<!--[\s\S]*?-->|<ref\b[^>]*?\/>|<ref\b[^>]*>[\s\S]*?<\/ref>/gi, '');
const plain = text => plainIntro(text).replace(/^\s*['|!]+/, '').trim();
const wikiSection = (article, heading) => heading ? article.title + '#' + heading : article.title;
const conceptByWiki = new Map(snapshot.entries.map(node => [wikiKey(node.wiki), node.id]));

function linkedEntry(text, wiki, title = '') {
  const link = [...text.matchAll(linkPattern)].find(match => !/^(file|image|category):/i.test(match[1]));
  const name = title || (link && plain(link[2] ?? link[1])) || plain(text);
  if (!name) return null;
  const concept = link && conceptByWiki.get(wikiKey(link[1]));
  const summary = sentenceExcerpt(plain(text));
  return {title: name, wiki: link?.[1] ?? wiki, ...(concept && {concept}), ...(summary && {summary})};
}

function sourceSections(article) {
  const sections = [];
  let current = {title: '', depth: 1, wiki: article.title, body: ''};
  for (const line of cleanup(article.raw).split(/\r?\n/)) {
    const heading = /^(={2,6})\s*(.+?)\s*\1\s*$/.exec(line);
    if (!heading) {
      current.body += line + '\n';
      continue;
    }
    sections.push(current);
    const anchor = plain(heading[2]);
    const title = plain(heading[2].replace(/<sup>(.*?)<\/sup>/gi, '^($1)').replace(/<sub>(.*?)<\/sub>/gi, '_($1)'));
    if (/^(see also|notes|references|bibliography|further reading|external links)\b/i.test(title)) return sections;
    current = {title, depth: heading[1].length, wiki: wikiSection(article, anchor), body: ''};
  }
  sections.push(current);
  return sections;
}

// Keep source order. Long sections get a browsable index with at most four branches per step.
function bounded(entries, wiki, start = 1) {
  if (entries.length <= 4) return entries;
  const width = Math.ceil(entries.length / 4);
  const groups = [];
  for (let offset = 0; offset < entries.length; offset += width) {
    const slice = entries.slice(offset, offset + width);
    if (slice.length === 1) {
      groups.push(slice[0]);
      continue;
    }
    const first = start + offset;
    const numeric = slice.every(entry => /^\d+(?: to \d+)?$/.test(entry.title));
    groups.push({
      title: numeric
        ? slice[0].title.split(' to ')[0] + '–' + slice.at(-1).title.split(' to ').at(-1)
        : 'Entries ' + first + '–' + (first + slice.length - 1),
      wiki,
      children: bounded(slice, wiki, first),
    });
  }
  return groups;
}

function sectionTree(sections, entriesFor, includeEmpty = false) {
  const root = {depth: 0, children: []};
  const stack = [root];
  for (const section of sections) {
    const entries = entriesFor(section);
    if (!section.title) {
      root.children.push(...entries);
      continue;
    }
    while (stack.at(-1).depth >= section.depth) stack.pop();
    const branch = {...section, children: entries};
    stack.at(-1).children.push(branch);
    stack.push(branch);
  }
  function finish({title, wiki, body, depth, children, ...entry}) {
    if (depth === undefined) return {title, wiki, ...entry, ...(children && {children})};
    const visible = children.map(finish).filter(Boolean);
    if (!visible.length && !includeEmpty) return null;
    const summary = includeEmpty ? sentenceExcerpt(plain(body)) : '';
    return {title, wiki, ...(summary && {summary}), ...(visible.length && {children: bounded(visible, wiki)})};
  }
  return root.children.map(finish).filter(Boolean);
}

function formulaEntries(article, section, kind) {
  const entries = [];
  const seen = new Set();
  for (const match of section.body.matchAll(/<math\b[^>]*>([\s\S]*?)<\/math>/g)) {
    const text = match[1].trim().replace(/[.,;]$/, '');
    const relation = text.replace(/_\{[^}]*\}/g, '');
    if (!/[=<>]|\\(?:leq?|geq?|sim|equiv|implies|to|ll|gg|asymp)\b/.test(relation) || seen.has(text)) continue;
    try {
      const mathml = katex.renderToString(text, {output: 'mathml', throwOnError: true, strict: 'ignore', trust: false});
      const lineEnd = section.body.indexOf('\n', match.index + match[0].length);
      const tail = section.body.slice(match.index + match[0].length, lineEnd < 0 ? undefined : lineEnd);
      const condition = /^\s*[,;]?\s*(?:if|when|where|for|provided)\b/i.test(tail) && plain(tail);
      entries.push({
        title: kind + ' ' + (entries.length + 1),
        wiki: section.wiki,
        formula: {
          text, mathml,
          condition: condition || 'See the source section for notation and conditions.',
          sourceSection: section.title || article.title,
          sourceRevision: article.revision,
        },
      });
      seen.add(text);
    } catch {
      // A raw TeX expression is not useful on a branch. The source section is linked.
    }
  }
  return entries;
}

const bullets = section => section.body.split('\n').filter(line => /^\s*[*#]+[^*#]/.test(line))
  .map(line => line.replace(/^\s*[*#]+\s*/, ''));

const integrals = articles.get('lists of integrals');
const integralIndex = integrals && sourceSections(integrals).find(section => section.title === 'Lists of integrals');
const additionalTables = integralIndex ? bullets(integralIndex)
  .map(line => [...line.matchAll(linkPattern)][0]?.[1])
  .filter(title => title && !articles.has(wikiKey(title))) : [];
if (additionalTables.length) {
  const query = new URLSearchParams({
    action:'query',format:'json',formatversion:'2',redirects:'1',
    prop:'revisions',rvprop:'ids|content',rvslots:'main',titles:additionalTables.join('|'),
  });
  const response = await fetch('https://en.wikipedia.org/w/api.php?'+query, {
    headers:{'User-Agent':'MathKnowledge/2.0 (math-knowledge.org; public Wikipedia list index)'},
    signal:AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error('Wikipedia integral tables returned '+response.status);
  readPages(await response.json());
}

function integralTables(article) {
  const sections = sourceSections(article).filter(section => section.title !== 'Historical development of integrals');
  return sectionTree(sections, section => {
    if (section.title !== 'Lists of integrals') return formulaEntries(article, section, 'Integral');
    return bullets(section).map(line => {
      const entry = linkedEntry(line, section.wiki);
      const table = articles.get(wikiKey(entry.wiki));
      if (!table) throw new Error('Missing cached integral table: ' + entry.wiki);
      const children = sectionTree(sourceSections(table), part => formulaEntries(table, part, 'Integral'));
      return {...entry, title: entry.title.replace(/^List of integrals of /i, 'Integrals of '), children: bounded(children, entry.wiki)};
    });
  }).map(entry => entry.title === 'Lists of integrals' ? {...entry, title: 'Tables by function type'} : entry);
}

function limitTables(article) {
  const entries = sectionTree(sourceSections(article), section => formulaEntries(article, section, 'Limit'));
  const buckets = [
    ['Limits for general functions', /general functions/i],
    ['Limits of elementary functions', /polynomials|exponential|logarithmic|trigonometric/i],
    ['Sums & special limits', /sums|notable special/i],
    ['Limiting behavior', /.*/],
  ].map(([title, match]) => ({title, match, children: []}));
  for (const entry of entries) buckets.find(bucket => bucket.match.test(entry.title)).children.push(entry);
  return buckets.filter(bucket => bucket.children.length).map(({title, children}) =>
    children.length === 1 ? children[0] : {title, wiki: article.title, children: bounded(children, article.title)});
}

function numberTable(article, divisors) {
  const pattern = divisors ? /^\|-\s*\n!([^\n]+)\n\|([^\n]*)/gm : /^\|([^\n]+?)\|\|([^\n]*)/gm;
  const seen = new Set();
  return sectionTree(sourceSections(article).filter(section => /^\d+ to \d+$/.test(section.title)), section =>
    [...section.body.matchAll(pattern)].flatMap(([, first, value]) => {
      const title = plain(first);
      if (!/^\d+$/.test(title) || seen.has(title)) return [];
      seen.add(title);
      const content = plain(value.replace(/<sup>(\d+)<\/sup>/gi, '^$1'));
      const summary = divisors ? 'Positive divisors of ' + title + ' are ' + content + '.'
        : content ? 'The prime factorization of ' + title + ' is ' + content + '.'
        : title === '1' ? 'The integer 1 has no prime factors.' : '';
      return summary ? [{title, wiki: section.wiki, summary}] : [];
    }),
  );
}

function constantTable(article) {
  const section = sourceSections(article).find(part => part.title === 'List');
  if (!section) return [];
  return section.body.split(/^\|-[^\n]*\n/gm).flatMap(row => {
    const [name, , decimal] = row.trimStart().split('\n').filter(line => /^\|[^}|]/.test(line));
    if (!name || !decimal || !name.includes('[[')) return [];
    const entry = linkedEntry(name, section.wiki);
    const value = plain(decimal.replace(/^\|(?:[^|]*=.+?\|)?\s*/, ''));
    if (!entry) return [];
    if (value && value.length < 90) entry.summary = 'The source table gives a decimal value of ' + value.replace(/\.$/, '') + '.';
    return [entry];
  });
}

function topicList(article) {
  const theories = article.title === 'List of first-order theories';
  const metaheuristics = article.title === 'List of metaphor-based metaheuristics';
  const sections = sourceSections(article).filter(section =>
    (!theories || section.title !== 'Preliminaries') &&
    (!metaheuristics || section.depth > 2 || section.title === 'Algorithms'));
  const entries = sectionTree(sections, section => {
    if (theories) {
      const boldTerms = [...section.body.matchAll(/^'''(.+?)'''/gm)].map(match => match[1]);
      return [...bullets(section), ...boldTerms]
        .filter(line => line.startsWith("'''") || boldTerms.includes(line) || /^\[\[/.test(line))
        .map(line => linkedEntry(line, section.wiki, plain(line.split(/:\s|[.;]\s/)[0]).slice(0, 85)))
        .filter(Boolean);
    }
    if (metaheuristics) return [];
    return bullets(section).map((line, index) => {
      const entry = linkedEntry(line, section.wiki);
      if (entry && entry.title.length > 90) entry.title = 'Problem ' + (index + 1);
      return entry;
    }).filter(Boolean);
  }, theories || metaheuristics);
  return entries.length === 1 && entries[0].children ? entries[0].children : entries;
}

const lists = {};
for (const node of snapshot.entries.filter(entry => /^(?:lists?|tables?) of\b/i.test(entry.title) && entry.id !== 'wp-prime-pages')) {
  const article = articles.get(wikiKey(node.wiki));
  if (!article) throw new Error('Missing cached source for ' + node.title);
  const entries = {
    'wp-table-of-limits': limitTables,
    'wp-table-of-integrals': integralTables,
    'wp-table-of-divisors': source => numberTable(source, true),
    'wp-table-of-prime-factors': source => numberTable(source, false),
    'wp-mathematical-constant-sorted-by-continued-fraction-representation': constantTable,
  }[node.id]?.(article) ?? topicList(article);
  if (!entries.length) throw new Error('No list entries found for ' + node.title);
  lists[node.id] = bounded(entries, article.title);
}
learning.lists = lists;
await fs.writeFile(learningFile, JSON.stringify(learning));
const count = entries => entries.reduce((sum, entry) => sum + (entry.children?.length ? count(entry.children) : 1), 0);
console.log(Object.fromEntries(Object.entries(lists).map(([id, entries]) => [id, count(entries)])));
