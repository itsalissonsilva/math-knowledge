import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import { catalog } from '../src/catalog.ts';

const API = 'https://en.wikipedia.org/w/api.php';
const headers = { 'User-Agent':'MapOfMathematics/2.0 (local educational mathematics atlas; read-only Wikipedia indexing)' };
const cacheDirectory=path.join(os.tmpdir(),'mapofmathematics-wikipedia-read-cache');
await fs.mkdir(cacheDirectory,{recursive:true});
let lastRequest=0;
const decode = s => {try{return decodeURIComponent(s);}catch{return s;}};
const normalize = s => decode(s.replaceAll('_',' ')).replaceAll('’',"'").toLowerCase().trim();
const slug = s => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,100);
const sources = [
  ['Outline_of_set_theory','sets'],['List_of_set_theory_topics','sets'],['Outline_of_logic','logic'],['List_of_mathematical_logic_topics','logic'],['List_of_category_theory_topics','categories'],['Type_theory','type-theory'],
  ['Outline_of_algebra','algebra'],['List_of_linear_algebra_topics','linear-algebra'],['List_of_abstract_algebra_topics','abstract-algebra'],['List_of_group_theory_topics','groups'],['Glossary_of_ring_theory','rings'],['Glossary_of_field_theory','fields'],['List_of_representation_theory_topics','representations'],['List_of_commutative_algebra_topics','commutative-algebra'],['List_of_homological_algebra_topics','homological-algebra'],
  ['Outline_of_arithmetic','arithmetic'],['List_of_number_theory_topics','number'],['Prime_number','primes'],['List_of_algebraic_number_theory_topics','algebraic-number'],['Analytic_number_theory','analytic-number'],
  ['List_of_calculus_topics','calculus'],['List_of_real_analysis_topics','real-analysis'],['List_of_complex_analysis_topics','complex-analysis'],['List_of_functional_analysis_topics','functional-analysis'],['List_of_harmonic_analysis_topics','harmonic-analysis'],['Measure_theory','measure'],['List_of_differential_equations','dynamics'],['List_of_dynamical_systems_topics','dynamical-systems'],['Mathematical_physics','math-physics'],
  ['List_of_geometry_topics','geometry'],['List_of_differential_geometry_topics','differential-geometry'],['List_of_algebraic_geometry_topics','algebraic-geometry'],['List_of_topology_topics','topology'],['List_of_algebraic_topology_topics','algebraic-topology'],['Glossary_of_Riemannian_and_metric_geometry','riemannian'],
  ['Outline_of_discrete_mathematics','discrete'],['List_of_combinatorics_topics','combinatorics'],['List_of_graph_theory_topics','graphs'],['List_of_order_theory_topics','order-theory'],
  ['Outline_of_probability','probability'],['List_of_probability_topics','probability'],['List_of_probability_distributions','distributions'],['Stochastic_process','stochastic-processes'],
  ['Outline_of_statistics','statistics'],['List_of_statistical_topics','statistics'],['Statistical_inference','inference'],
  ['List_of_numerical_analysis_topics','numerical'],['Theory_of_computation','computation'],['Computational_mathematics','computation'],['Mathematical_optimization','optimization'],['Operations_research','operations-research'],['Information_theory','information-theory'],['Coding_theory','coding-theory'],['Cryptography','cryptography'],
  ['Glossary_of_graph_theory','graphs'],['Glossary_of_general_topology','topology'],['Glossary_of_algebraic_topology','algebraic-topology'],['Glossary_of_algebraic_geometry','algebraic-geometry'],['Glossary_of_linear_algebra','linear-algebra'],['Glossary_of_functional_analysis','functional-analysis'],['Glossary_of_number_theory','number'],
];

async function query(params) {
  const cacheFile=path.join(cacheDirectory,createHash('sha256').update(JSON.stringify(params)).digest('hex')+'.json');
  try{return JSON.parse(await fs.readFile(cacheFile,'utf8'));}catch{}
  for (let attempt=0;attempt<8;attempt++) {
    try {
      const delay=Math.max(0,1600-(Date.now()-lastRequest));if(delay)await new Promise(r=>setTimeout(r,delay));lastRequest=Date.now();
      const url = new URL(API); for (const [k,v] of Object.entries({ action:'query',format:'json',formatversion:2,redirects:1,maxlag:5,...params })) url.searchParams.set(k,String(v));
      const response = await fetch(url,{headers,signal:AbortSignal.timeout(45000)});
      if(response.status===429){const seconds=Math.max(30,Math.min(90,Number(response.headers.get('retry-after'))||60));console.log(`Wikipedia rate limit: respecting a ${seconds}s cooldown.`);await new Promise(r=>setTimeout(r,seconds*1000));continue;}
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json(); if (result.error) throw new Error(result.error.info);
      await fs.writeFile(cacheFile,JSON.stringify(result));return result;
    } catch(error) { if (attempt===7) throw error; await new Promise(r=>setTimeout(r,3000*(attempt+1))); }
  }
  throw new Error('Wikipedia remained rate-limited after the bounded cooldowns.');
}
async function concurrent(list,fn,count=1) {
  let cursor=0; await Promise.all(Array.from({length:count},async()=>{while(cursor<list.length){ const index=cursor++; await fn(list[index],index); }}));
}
function stripTemplates(text) {
  let depth=0,out=''; for(let i=0;i<text.length;i++) {
    if(text.slice(i,i+2)==='{{'){depth++;i++;continue;}
    if(depth&&text.slice(i,i+2)==='}}'){depth--;i++;continue;}
    if(!depth)out+=text[i];
  } return out.replace(/<ref\b[^>]*>[\s\S]*?<\/ref>/gi,'').replace(/<!--[\s\S]*?-->/g,'');
}
const entries = catalog.map(n=>({...n,origin:'curated'}));
const byId = new Map(entries.map(n=>[n.id,n]));
const byWiki = new Map(); const byTitle = new Map();
for (const n of entries) { if(!byWiki.has(normalize(n.wiki))) byWiki.set(normalize(n.wiki),n); byTitle.set(normalize(n.title),n); }
const sourceResults=[]; const classification=[]; const outlinePages=new Map();
const ignored = /history|historical|biograph|mathematicians|contributors|people|journals|publications|external links|references|further reading|organizations|software|see also|bibliograph|timeline|prizes|lists of|mathematics education/i;
const headingAliases={sets:'sets',functions:'functions',relations:'relations','proofs':'proof','proof techniques':'proof','basic algebra':'elementary-algebra','elementary algebra':'elementary-algebra','matrix theory':'matrices','matrices and determinants':'matrices','linear mappings':'linear-maps','eigenvalues and eigenvectors':'spectral-theory','representations':'representations','rings':'rings','fields':'fields','groups':'groups','differentiation':'derivatives','differential calculus':'derivatives','integration':'integrals','integral calculus':'integrals','integration techniques':'integrals','limits':'limits','infinite series':'series','sequences and series':'series','functions of several variables':'multivariable','random variables':'distributions','probability distributions':'distributions','distributions':'distributions','discrete distributions':'discrete-distributions','continuous distributions':'continuous-distributions','sampling theory':'sampling','estimation theory':'inference','hypothesis tests':'hypothesis','bayesian inference':'bayesian-statistics','graphs':'graphs','counting':'counting','combinatorial enumeration':'enumerative-combinatorics','partial orders':'partial-orders','number systems':'number-systems'};

console.log(`Reading ${sources.length} Wikipedia subject outlines…`);
await concurrent(sources,async([article,parentId])=>{
  const response=await query({titles:article,prop:'revisions',rvprop:'content',rvslots:'main'});
  const page=response.query?.pages?.[0];
  if(!page||page.missing){sourceResults.push({article,parentId,status:'missing'});return;}
  outlinePages.set(normalize(page.title),page);
  // Keep columns-list and glossary templates: their contents are the subject
  // index, rather than navigation boilerplate. Only references/comments leave.
  const text=(page.revisions?.[0]?.slots?.main?.content??'').replace(/<ref\b[^>]*>[\s\S]*?<\/ref>/gi,'').replace(/<!--[\s\S]*?-->/g,'');
  let sectionParent=parentId,sectionTitle='',skip=false,added=0; const stack=[],headingStack=[];
  for(const line of text.split('\n')) {
    const heading=line.match(/^(={2,6})\s*(.*?)\s*\1\s*$/);
    if(heading){
      const title=heading[2].replace(/\[\[([^\]|]*)(?:\|([^\]]*))?\]\]/g,(_,a,b)=>b||a).replace(/'''?/g,'');
      const level=heading[1].length;while(headingStack.length&&headingStack.at(-1).level>=level)headingStack.pop();
      const inherited=headingStack.at(-1);skip=ignored.test(title)||(inherited?.skip??false);stack.length=0;
      const matched=byId.get(headingAliases[normalize(title)])||byTitle.get(normalize(title))||byWiki.get(normalize(title));
      sectionParent=matched?.id??inherited?.parent??parentId;
      if(sectionParent==='mathematics')sectionParent=parentId;
      headingStack.push({level,title,parent:sectionParent,skip});sectionTitle=headingStack.map(h=>h.title).join(' › ');
      // Only actual article subjects become nodes; headings remain source provenance.
      continue;
    }
    if(skip)continue;
    let bullet=line.match(/^([*#;]+)\s*(.*)$/);
    if(!bullet&&/^\s*(?:'{2,3})?\[\[/.test(line))bullet=['','*',line.replace(/^\s*'{2,3}/,'')];
    if(!bullet&&/^\s*\{\{(?:term|defn)\b/i.test(line))bullet=['',';',line.replace(/^\s*\{\{(?:term|defn)\s*\|\s*(?:1\s*=)?/i,'')];
    if(!bullet&&/^\|\s*\[\[/.test(line))bullet=['','*',line.replace(/^\|\s*/,'')];
    if(!bullet)continue;
    const content=bullet[2], match=content.match(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/);
    if(!match||match.index>85)continue;
    const articleTitle=match[1].trim(),label=(match[2]||articleTitle).replace(/'''?/g,'').trim();
    if(articleTitle.includes(':')||ignored.test(articleTitle)||/^(list |outline |glossary |portal |category |index )/i.test(articleTitle)||label.length<2||label.length>110)continue;
    const depth=bullet[1].length; while(stack.length&&stack.at(-1).depth>=depth)stack.pop();
    const rawParent=stack.at(-1)?.id||sectionParent;const parent=rawParent==='mathematics'?parentId:rawParent;
    let node=byWiki.get(normalize(articleTitle));
    if(!node){
      let id=`wp-${slug(articleTitle)}`; let suffix=2; while(byId.has(id))id=`wp-${slug(articleTitle)}-${suffix++}`;
      node={id,title:label,wiki:articleTitle.replaceAll(' ','_'),summary:'',parentId:parent,origin:'wikipedia',sourceOutline:page.title,sourceSection:sectionTitle};
      entries.push(node);byId.set(id,node);byWiki.set(normalize(articleTitle),node);byTitle.set(normalize(label),node);added++;
    } else if(node.id!==parent) classification.push({source:parent,target:node.id,type:'classification',label:`Listed in ${page.title}`,sourceArticle:page.title});
    if(node.id!==parent)stack.push({depth,id:node.id});
  }
  sourceResults.push({article:page.title,parentId,status:'read',added});
});
console.log(`Outline pass: ${entries.length} concepts. Resolving article identities and body links…`);
const titles=[...new Map(entries.map(n=>[normalize(n.wiki),decode(n.wiki.replaceAll('_',' '))])).values()];
const pages=new Map(),canonical=new Map(),missing=new Set(),disambiguations=new Set();
function plainIntro(body){
  const cleaned=body.replace(/\{\|[\s\S]*?\|\}/g,'').replace(/<ref\b[^>]*\/>/gi,'').replace(/<math\b[^>]*>[\s\S]*?<\/math>/gi,'').replace(/<[^>]+>/g,'');
  const paragraph=cleaned.split(/\n\s*\n/).map(s=>s.trim()).find(s=>s.length>60&&!/^(?:\[\[(?:File|Image)|[*#;:{|}=])/i.test(s))??'';
  return paragraph.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,(_,a,b)=>b||a).replace(/\[https?:[^\s\]]+\s*([^\]]*)\]/g,'$1').replace(/'{2,5}/g,'').replace(/&nbsp;/g,' ').replace(/&[^;]+;/g,' ').replace(/\s+/g,' ').trim();
}
function ingest(response){
  for(const item of response.query?.normalized??[])canonical.set(normalize(item.from),normalize(item.to));
  for(const item of response.query?.redirects??[])canonical.set(normalize(item.from),normalize(item.to));
  for(const page of response.query?.pages??[]) {
    if(page.missing){missing.add(normalize(page.title));continue;}
    if(page.pageprops&&'disambiguation'in page.pageprops)disambiguations.add(normalize(page.title));
    const rawText=page.revisions?.[0]?.slots?.main?.content??'';
    const categories=[...rawText.matchAll(/\[\[Category:([^\]|]+)(?:\|[^\]]*)?\]\]/g)].map(m=>m[1]);
    const body=stripTemplates(rawText).split(/\n==\s*(References|Notes|Bibliography|External links)/i)[0];
    const words=(page.extract||plainIntro(body)).trim().split(/\s+/);
    const excerpt=words.slice(0,20).join(' ')+(words.length>20?'…':'');
    const links=[...body.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/g)].map(m=>normalize(m[1])).filter(s=>!s.includes(':'));
    const introLinks=[...body.split(/\n==/)[0].matchAll(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/g)].map(m=>normalize(m[1])).filter(s=>!s.includes(':'));
    if(!pages.has(normalize(page.title))||page.extract)pages.set(normalize(page.title),{title:page.title,pageid:page.pageid,revision:page.lastrevid??page.revisions?.[0]?.revid,url:page.canonicalurl||`https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replaceAll(' ','_'))}`,excerpt,categories,introLinks,links:[...new Set(links)]});
  }
}
for(const file of await fs.readdir(cacheDirectory)){try{ingest(JSON.parse(await fs.readFile(path.join(cacheDirectory,file),'utf8')));}catch{}}
function resolve(key){const seen=new Set();while(canonical.has(key)&&!seen.has(key)){seen.add(key);key=canonical.get(key);}return key;}
const remaining=titles.filter(t=>!pages.has(resolve(normalize(t)))&&!missing.has(resolve(normalize(t))));
const batches=Array.from({length:Math.ceil(remaining.length/50)},(_,i)=>remaining.slice(i*50,i*50+50));
console.log(`Reused ${pages.size} cached public articles; ${remaining.length} remaining in ${batches.length} full-size batches.`);
let completed=0;
await concurrent(batches,async batch=>{
  const response=await query({titles:batch.join('|'),prop:'revisions|info|pageprops',rvprop:'content|ids',rvslots:'main',inprop:'url',ppprop:'disambiguation'});
  ingest(response);
  completed++;if(completed%10===0||completed===batches.length)console.log(`Wikipedia articles: ${completed}/${batches.length} batches`);
});
const removed=new Set();
const offTopic=new Set(['Academic discipline','Science','Formal science','Mathematical sciences','Natural science','Social science','Humanities','Professor','Mathematician','Physicist','Statistician','Computer scientist','Logician','University','Scientific journal','Knowledge','Education','Mathematics education','Higher education','Academic journal','Peer review','Research','List','Theorem prover','Computer software','Software','Classical physics','Description','Chemistry','Biology','Astronomy','Engineering','Communication','Literature','Politics','Economics','Epistemology','SQL']);
for(const n of entries){
  const key=resolve(normalize(n.wiki)),page=pages.get(key);
  const biography=page&&/\b(?:was|is) an? (?:[\w-]+ ){0,3}(?:mathematician|physicist|statistician|logician|professor|computer scientist)\b/i.test(page.excerpt);
  const irrelevantCategory=page?.categories?.some(c=>/software|programming languages|computer libraries|spreadsheet|\bbirths$|\bdeaths$|living people|\bmathematicians$|\bstatisticians$|\bphysicists$/i.test(c));
  if((!page||disambiguations.has(key)||!page.excerpt||biography||irrelevantCategory||offTopic.has(page.title))&&n.origin==='wikipedia'){removed.add(n.id);continue;}
  if(page){n.wiki=page.title.replaceAll(' ','_');n.pageId=page.pageid;n.sourceTitle=page.title;if(n.origin==='wikipedia'){n.summary=page.excerpt;n.title=page.title;}}
}
let valid=entries.filter(n=>!removed.has(n.id));
function rootOf(n){const seen=new Set();while(n?.parentId&&n.parentId!=='mathematics'&&!seen.has(n.id)){seen.add(n.id);n=byId.get(n.parentId);}return n?.id;}
function depthOf(n){let depth=0;const seen=new Set();while(n?.parentId&&!seen.has(n.id)){seen.add(n.id);n=byId.get(n.parentId);depth++;}return depth;}
// Article categories refine broad outline buckets, staying within the same major area.
const categoryRules=[
  [/normal distribution/i,'normal'],[/order statistics/i,'order-statistics'],[/statistical data types|levels of measurement/i,'statistical-data'],[/statistical dispersion|statistical variance/i,'dispersion'],[/averages|means|central tendency/i,'central-tendency'],[/robust statistics/i,'nonparametric'],
  [/probability distributions|continuous distributions|discrete distributions|multivariate distributions|stable distributions/i,'distributions'],
  [/statistical hypothesis|statistical tests|multiple comparisons|statistical significance|analysis of variance/i,'hypothesis'],
  [/bayesian|bayes estimat|bayes factor/i,'bayesian-statistics'],
  [/regression|least squares|linear models|generalized linear/i,'regression'],
  [/statistical learning|machine learning|classification algorithms|cluster analysis|ensemble learning|neural networks|pattern recognition/i,'statistical-learning'],
  [/computational statistics|statistical algorithms|resampling|monte carlo/i,'computational-statistics'],
  [/estimation theory|estimators|sufficient statistics|likelihood|confidence intervals/i,'inference'],
  [/survey methodology|sampling techniques|sampling (statistics)|sampling theory/i,'sampling'],
  [/experimental design|design of experiments|multivariate statistics/i,'statistical-design'],
  [/time series|autocorrelation|spectral density/i,'time-series'],
  [/nonparametric statistics|non-parametric statistics|rank statistics/i,'nonparametric'],
  [/descriptive statistics|statistical charts|statistical diagrams|statistical graphics|statistical terminology|data visualization|summary statistics/i,'descriptive'],
  [/statistical models|parametric models/i,'statistical-models'],
  [/information theory|coding theory|information entropy/i,'information'],
  [/random graphs/i,'random-graphs'],[/queueing theory/i,'queueing'],[/control theory|linear filters|signal processing/i,'control-theory'],
  [/markov chains|markov processes/i,'markov'],[/stochastic calculus|stochastic differential/i,'stochastic-calculus'],[/stochastic processes|point processes|random processes/i,'stochastic-processes'],
  [/probability inequalities|concentration inequalities|probabilistic inequalities/i,'concentration'],
  [/prime numbers|primality tests/i,'primes'],[/diophantine equations|diophantine approximation/i,'diophantine'],[/algebraic number theory/i,'algebraic-number'],[/analytic number theory/i,'analytic-number'],[/additive number theory|additive combinatorics/i,'additive-number'],
  [/riemannian geometry|curvature/i,'riemannian'],[/differential geometry|differential forms/i,'differential-geometry'],[/algebraic geometry/i,'algebraic-geometry'],[/projective geometry|affine geometry|conic sections/i,'affine-projective'],[/convex geometry|discrete geometry/i,'convex-discrete-geometry'],[/euclidean geometry|elementary geometry/i,'euclidean'],[/hyperbolic geometry/i,'hyperbolic-geometry'],[/spherical geometry/i,'spherical-geometry'],[/fractal|fractals/i,'fractals'],[/metric geometry/i,'metric-geometry'],[/algebraic topology|homotopy theory/i,'algebraic-topology'],[/differential topology/i,'differential-topology'],[/general topology|topological spaces/i,'point-set-topology'],
  [/mathematical logic|formal logic/i,'logic'],[/set theory/i,'sets'],[/category theory/i,'categories'],[/type theory/i,'type-theory'],
];
const allSubjects=new Map(),canonicalSubjects=new Map();for(const n of valid){const key=normalize(n.title);if(!allSubjects.has(key)||n.origin==='curated')allSubjects.set(key,n);const wikiKey=resolve(normalize(n.wiki));if(!canonicalSubjects.has(wikiKey)||n.origin==='curated')canonicalSubjects.set(wikiKey,n);}
function containsAncestor(n,id){const seen=new Set();while(n&&!seen.has(n.id)){if(n.id===id)return true;seen.add(n.id);n=byId.get(n.parentId);}return false;}
for(const n of valid.filter(n=>n.origin==='wikipedia')){
  const page=pages.get(resolve(normalize(n.wiki)));const parent=byId.get(n.parentId);
  if(!parent||parent.origin==='wikipedia')continue;
  const matches=(page?.categories??[]).map(c=>({category:c,node:allSubjects.get(normalize(c))||byWiki.get(normalize(c))})).filter(c=>c.node&&c.node.id!==n.id&&rootOf(c.node)===rootOf(parent)&&depthOf(c.node)>depthOf(parent)&&!containsAncestor(c.node,n.id));
  matches.sort((a,b)=>depthOf(b.node)-depthOf(a.node));
  if(matches[0]){n.parentId=matches[0].node.id;n.sourceCategory=matches[0].category;}
  else if(depthOf(parent)<=2){const categoryText=(page?.categories??[]).join('; ');const rule=categoryRules.find(([pattern,target])=>pattern.test(categoryText)&&target!==n.id&&!containsAncestor(byId.get(target),n.id));if(rule){classification.push({source:n.parentId,target:n.id,type:'classification',label:`Indexed in ${n.sourceOutline}`,sourceArticle:n.sourceOutline});n.parentId=rule[1];n.sourceCategory=categoryText;}}
}
const childCounts=new Map();for(const n of valid)childCounts.set(n.parentId,(childCounts.get(n.parentId)??0)+1);
const areas=new Set(catalog.filter(n=>n.parentId==='mathematics').map(n=>n.id));
for(const n of valid.filter(n=>n.origin==='wikipedia'&&areas.has(n.parentId))){
  const page=pages.get(resolve(normalize(n.wiki)));const candidates=(page?.introLinks??[]).map(title=>canonicalSubjects.get(resolve(title))).filter(p=>p&&p.id!==n.id&&!areas.has(p.id)&&p.id!=='mathematics'&&!containsAncestor(p,n.id)&&p.origin==='curated'&&depthOf(p)>=2);
  const sameArea=candidates.filter(p=>rootOf(p)===rootOf(n));
  const candidate=sameArea[0]??candidates.find(p=>p.id==='distributions'||p.id==='normal'||p.id==='stochastic-processes');
  if(candidate){classification.push({source:n.parentId,target:n.id,type:'classification',label:`Indexed in ${n.sourceOutline}`,sourceArticle:n.sourceOutline});n.parentId=candidate.id;n.sourceRelationship='The article introduction links this subject.';}
}
for(const n of valid){
  let p=n.parentId;const seen=new Set([n.id]);
  while(p&&removed.has(p)&&!seen.has(p)){seen.add(p);p=byId.get(p)?.parentId??'mathematics';}
  if(p&&seen.has(p))p='mathematics';
  if(p==='mathematics'&&n.origin==='wikipedia')p=sourceResults.find(s=>s.article===n.sourceOutline)?.parentId??'foundations';
  n.parentId=p;
  if(!n.pageId){let ancestor=byId.get(n.parentId);while(ancestor&&!ancestor.pageId)ancestor=byId.get(ancestor.parentId);if(ancestor){n.wiki=ancestor.wiki;n.sourceTitle=ancestor.sourceTitle;n.pageId=ancestor.pageId;n.sourceFallback=true;}}
}
// Canonicalize true duplicate outline entries while retaining deliberately distinct curated concepts.
const canonicalNodes=new Map(),redirectIds=new Map();
for(const n of valid.sort((a,b)=>(a.origin==='curated'?0:1)-(b.origin==='curated'?0:1))){
  if(n.origin==='wikipedia'&&canonicalNodes.has(n.pageId)){redirectIds.set(n.id,canonicalNodes.get(n.pageId).id);continue;}
  if(!canonicalNodes.has(n.pageId))canonicalNodes.set(n.pageId,n);
}
valid=valid.filter(n=>!redirectIds.has(n.id));
for(const n of valid)if(redirectIds.has(n.parentId))n.parentId=redirectIds.get(n.parentId);
// Redirects can identify an outline parent with its own child. Restore the
// original subject-outline parent in that case rather than retaining a cycle.
const validMap=new Map(valid.map(n=>[n.id,n]));
// Broad alphabetical lists are useful for coverage, but poor navigation. Give
// their remaining entries a mathematical browsing home among the named subfields.
const browsingRules={
  algebra:[[/equation|pre.algebra|elementary|polynomial|inequalit/i,'elementary-algebra'],[/linear|matrix|vector|tensor/i,'linear-algebra'],[/.*/,'abstract-algebra']],
  statistics:[[/regress|least.squares|logit|probit|multicollinear|residual|r.squared|heteros[ck]ed/i,'regression'],[/hypothes|significan|\btest\b|p.value|\bpower\b|\bwald\b|anova/i,'hypothesis'],[/bayes|\bprior\b|posterior|credible/i,'bayesian-statistics'],[/time.series|autoregress|kalman|\bfilter\b|spectral|forecast|volatility|stationar|autocorr/i,'time-series'],[/classif|cluster|neural|discriminant|machine.learning|feature.selection|regulariz|support.vector|predict/i,'statistical-learning'],[/sample|sampling|survey/i,'sampling'],[/randomiz|replicat|experiment|design|treatment|control.group/i,'statistical-design'],[/estim|likelihood|confidence|asymptot|consisten|efficien|sufficien|\bbias\b|fisher.information|nuisance/i,'inference'],[/mean\b|median|moment|quantil|variance|deviation|dispersion|correlation|covariance|skew|kurtos|\brank\b|\bscale\b|\bindex\b|\bratio\b|outlier|distance/i,'descriptive'],[/bootstrap|monte.carlo|simulation|algorithm|numerical|resampl/i,'computational-statistics'],[/data.type|measurement|nominal|ordinal|categorical|binary.data/i,'statistical-data'],[/.*/,'statistical-theory']],
  geometry:[[/topolog|homolog|homotop|\bknot/i,'topology'],[/fractal|hausdorff.dimension/i,'fractals'],[/algebraic|variet|scheme|birational|bezout/i,'algebraic-geometry'],[/differential|riemann|curvature|tensor|manifold|symplect|contact.geometry|k[aä]hler|finsler/i,'differential-geometry'],[/convex|discrete|polytope|packing|voronoi|delaunay|computational.geometry|combinatorial.geometry|lattice/i,'convex-discrete-geometry'],[/projective|affine|incidence|perspective|desargue/i,'affine-projective'],[/hyperbolic|non.euclid|spherical/i,'non-euclidean'],[/distance|metric|geodes|busemann|alexandrov|integral.geometry/i,'metric-geometry'],[/.*/,'euclidean']],
  probability:[[/it[oô]|stochastic.integr|diffusion/i,'stochastic-calculus'],[/markov|martingale|brownian|stochastic|random.walk|random.field|poisson.process|renewal|\bprocess\b/i,'stochastic-processes'],[/large.deviation|concentration|inequalit|limit.theorem|central.limit|law.of|convergence/i,'probability-limits'],[/random.variable|distribution|density|copula|expect|moment|variance|covariance|characteristic.function/i,'distributions'],[/.*/,'probability-foundations']],
  number:[[/algebraic|number.field|\bideal\b|galois|diophantine.geometry|p.adic|arithmetic.geometry|local.field/i,'algebraic-number'],[/analytic|zeta|l.function|modular.form|dirichlet|sieve/i,'analytic-number'],[/additive|combinator|partition|geometry.of.numbers|lattice|diophantine.approx|continued.fraction/i,'additive-number'],[/number.system|numeral|arithmetic.operation/i,'arithmetic'],[/.*/,'elementary-number']],
};
for(const n of valid.filter(n=>n.origin==='wikipedia'&&browsingRules[n.parentId])){
  const oldParent=n.parentId;const rule=browsingRules[oldParent].find(([pattern])=>pattern.test(n.title));
  if(rule&&validMap.has(rule[1])){n.parentId=rule[1];n.browsingParentBasis='A mathematical browsing home, organized from the Wikipedia subject index; article connections and original outline classification are retained.';classification.push({source:oldParent,target:n.id,type:'classification',label:`Originally listed in ${n.sourceOutline}`,sourceArticle:n.sourceOutline});}
}
let repairedCycles=0;
for(const start of valid){const order=[],seen=new Map();let n=start;while(n?.parentId){if(seen.has(n.id)){const cycle=order.slice(seen.get(n.id));const victim=cycle.find(n=>n.origin==='wikipedia');if(!victim)throw new Error('A curated hierarchy cycle cannot be reconciled.');const fallback=sourceResults.find(s=>s.article===victim.sourceOutline)?.parentId??'foundations';victim.parentId=fallback;victim.sourceRelationship='Placed under its Wikipedia subject outline after canonical redirect reconciliation.';repairedCycles++;break;}seen.set(n.id,order.length);order.push(n);n=validMap.get(n.parentId);}}
const validIds=new Set(valid.map(n=>n.id));
const links=[];const linkSet=new Set();
for(const n of valid){
  const page=pages.get(resolve(normalize(n.wiki)));if(!page)continue;
  for(const targetTitle of page.links){const targetPage=pages.get(resolve(targetTitle));const target=targetPage&&canonicalNodes.get(targetPage.pageid);if(!target||target.id===n.id||target.id===n.parentId||target.parentId===n.id)continue;
    const key=`${n.id}:${target.id}`;if(linkSet.has(key))continue;linkSet.add(key);
    links.push({source:n.id,target:target.id,type:'reference',label:`${n.sourceTitle} links to ${target.sourceTitle}`,sourceArticle:n.sourceTitle});
  }
}
const usedPages=new Set(valid.map(n=>n.pageId));
const pageRows=[...pages.values()].filter(page=>usedPages.has(page.pageid)).map(({links,categories,introLinks,...page})=>page);
const indices=new Map(valid.map((n,i)=>[n.id,i]));
const compactLinks=[...classification.filter(e=>validIds.has(e.source)&&validIds.has(e.target)&&e.source!==e.target).map(e=>[indices.get(e.source),indices.get(e.target),1,e.sourceArticle]),...links.map(e=>[indices.get(e.source),indices.get(e.target),0])];
const uniqueSources=[...new Map(sourceResults.map(s=>[`${s.article}:${s.parentId}`,s])).values()];
const result={generatedAt:new Date().toISOString(),license:'Wikipedia text excerpts: CC BY-SA 4.0. Each excerpt is at most 20 words; see the linked article and its revision history.',sources:uniqueSources,pages:pageRows,entries:valid,links:compactLinks};
await fs.writeFile(new URL('../public/wikipedia-catalog.json',import.meta.url),JSON.stringify(result));
await fs.writeFile(new URL('../wikipedia-coverage.json',import.meta.url),JSON.stringify({generatedAt:result.generatedAt,concepts:valid.length,articleReferences:links.length,verifiedPages:pages.size,includedMathPages:pageRows.length,removedRedlinks:removed.size,repairedRedirectCycles:repairedCycles,sources:uniqueSources,missing:[...missing],disambiguations:[...disambiguations]},null,2));
console.log(JSON.stringify({concepts:valid.length,references:links.length,verifiedPages:pages.size,removedRedlinks:removed.size,sourcesRead:sourceResults.filter(s=>s.status==='read').length}));
