/** Reuse the public Wikipedia article cache; this pass makes no network requests. */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import katex from 'katex';
import {definitions} from '../src/formula-definitions.ts';

const root=new URL('../',import.meta.url);
const snapshot=JSON.parse(await fs.readFile(new URL('public/wikipedia-catalog.json',root),'utf8'));
const cache=process.argv[2]??path.join(os.tmpdir(),'mapofmathematics-wikipedia-read-cache');
const pages=new Map();
const normalize=s=>decodeURIComponent(s).replaceAll('_',' ').replaceAll('’',"'").toLowerCase();
for(const file of await fs.readdir(cache)){
  if(!file.endsWith('.json'))continue;
  const data=JSON.parse(await fs.readFile(path.join(cache,file),'utf8'));
  for(const page of data.query?.pages??[]){
    const raw=page.revisions?.[0]?.slots?.main?.content;
    if(raw)pages.set(normalize(page.title),{raw,revision:page.lastrevid??page.revisions?.[0]?.revid});
  }
}
const subjects={},formulas={};
const generic=/articles|wikipedia|webarchive|cs1|pages|births|deaths|people|mathematicians|scientists|introduced|named|discovered|century|history|education|proofs|conjectures that|eponym/i;
for(const node of snapshot.entries){
  const page=pages.get(normalize(node.wiki));if(!page)continue;
  const {raw}=page;
  const categories=[...raw.matchAll(/\[\[Category:([^\]|]+)(?:\|[^\]]*)?\]\]/g)].map(m=>m[1].trim()).filter(c=>c.length<80&&!generic.test(c));
  const intro=raw.split(/\n==/)[0];
  const links=[...intro.matchAll(/\[\[([^\]|#:]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/g)].map(m=>m[1]).filter(t=>t.length<70);
  subjects[node.id]={categories:[...new Set(categories)],links:[...new Set(links)].slice(0,20)};
  const candidates=[];
  // Prefer short displayed definitions/identities. Proof calculations and examples
  // are not treated as definitions. Curated annotations override this source layer.
  const body=raw.replace(/<ref\b[^>]*>[\s\S]*?<\/ref>/gi,'').replace(/<!--[\s\S]*?-->/g,'');
  for(const match of body.matchAll(/<math\b([^>]*)>([\s\S]*?)<\/math>/g)){
    const before=body.slice(0,match.index),headings=[...before.matchAll(/^={2,6}\s*(.*?)\s*={2,6}\s*$/gm)];
    const section=headings.at(-1)?.[1].replace(/\[\[|\]\]|'{2,3}/g,'')??'Introduction';
    if(/proof|example|application|history|reference|note|derivation|computation|algorithm/i.test(section))continue;
    const tex=match[2].trim().replace(/\\(?:displaystyle|qquad|quad)\b/g,' ').replace(/\s+/g,' ').replace(/[.,;]$/,'');
    if(tex.length<12||tex.length>230||!/(?:=|\\(?:leq?|geq?|equiv|sim|cong)\b)/.test(tex))continue;
    // A numeric worked example or a declaration such as f:I→R is not a
    // representative defining equation for the whole article.
    if(!/[a-zA-Z\u0370-\u03ff]/.test(tex.replace(/\\[a-zA-Z]+/g,'')))continue;
    if(/\\(?:begin|end|html|href|url|includegraphics|tag|label|gdef|def|newcommand|color)\b|<|\{\{/.test(tex))continue;
    if((tex.match(/=/g)??[]).length>3||(tex.match(/\\(?:frac|sum|int|prod)/g)??[]).length>4)continue;
    const display=/display\s*=/.test(match[1])||/[:]\s*$/.test(before.slice(-30));
    const score=(display?8:0)+(/definition|formula|density|mass function|metric|axiom/i.test(section)?10:0)+(section==='Introduction'?4:0)+(/=|:=/.test(tex)?3:0)-tex.length/90-match.index/body.length*2;
    candidates.push({tex,section,score});
  }
  candidates.sort((a,b)=>b.score-a.score);
  for(const candidate of candidates){
    try{
      const mathml=katex.renderToString(candidate.tex,{output:'mathml',displayMode:false,throwOnError:true,trust:false,strict:'ignore',maxExpand:1000,macros:{'\\R':'\\mathbb{R}','\\N':'\\mathbb{N}','\\Z':'\\mathbb{Z}','\\C':'\\mathbb{C}','\\Q':'\\mathbb{Q}'}});
      const visible=mathml.replace(/<annotation[\s\S]*?<\/annotation>/g,'').replace(/<[^>]*>/g,'');
      // Fit an actual mathematical relation on a branch, rather than suppressing
      // long TeX strings by source-code length in the renderer.
      if(visible.length>95)continue;
      formulas[node.id]={text:candidate.tex,mathml,condition:`From “${candidate.section}” in ${node.title}; notation and hypotheses follow the linked article.`,sourceSection:candidate.section,sourceRevision:page.revision};
      break;
    }catch{/* Unsupported source notation is omitted, never displayed as raw TeX. */}
  }
}
for(const[id,definition]of Object.entries(definitions)){
  if(!snapshot.entries.some(n=>n.id===id))continue;
  const render=tex=>katex.renderToString(tex,{output:'mathml',displayMode:false,throwOnError:true,trust:false,strict:'ignore'});
  formulas[id]={text:definition.text,condition:definition.condition,mathml:render(definition.tex),...(definition.previewTex?{previewMathml:render(definition.previewTex)}:{})};
}
const result={subjects,formulas};
await fs.writeFile(new URL('public/wikipedia-learning.json',root),JSON.stringify(result));
console.log(JSON.stringify({subjects:Object.keys(subjects).length,sourceEquations:Object.keys(formulas).length,bytes:JSON.stringify(result).length}));
