import {topics as originalLessons} from './data.ts';
import {bridges} from './learning-relations.ts';
import {formulaLibrary} from './formula-library.ts';

type RawConcept=Pick<Concept,'id'|'title'|'wiki'|'summary'|'parentId'> & Partial<Concept>;
interface Snapshot {entries:RawConcept[];links:Array<[number,number,number,string?]>;sources:Array<{article:string;parentId:string;status:string;added?:number}>;pages:Array<{title:string;pageid:number;revision:number;url:string;excerpt:string}>;generatedAt:string}
const [response,learningResponse]=await Promise.all([fetch('/wikipedia-catalog.json'),fetch('/wikipedia-learning.json')]);
if(!response.ok||!learningResponse.ok)throw new Error(`The mathematics index could not load (${!response.ok?response.status:learningResponse.status}).`);
interface LearningIndex {
  subjects:Record<string,{categories:string[];links:string[]}>;
  formulas:Record<string,Formula>;
  lists?:Record<string,WikipediaListEntry[]>;
}
const [wikiData,learningIndex]=await Promise.all([response.json() as Promise<Snapshot>,learningResponse.json() as Promise<LearningIndex>]);
export const subjectMetadata=learningIndex.subjects;
export const wikipediaLists=learningIndex.lists??{};

export interface Formula { text:string; condition:string; mathml?:string; previewMathml?:string; sourceSection?:string; sourceRevision?:number }
export interface WikipediaListEntry {
  title:string;
  wiki:string;
  concept?:string;
  summary?:string;
  formula?:Formula;
  children?:WikipediaListEntry[];
}
export interface Concept {
  id:string; title:string; wiki:string; summary:string; parentId:string|null;
  origin:string; sourceOutline?:string; sourceSection?:string; sourceTitle?:string; sourceFallback?:boolean;
  pageId?:number; children:string[]; domain:string; depth:number; descendants:number;
  formula?:string; condition?:string; example?:string; question?:{prompt:string;answer:string};
  level:string; formulas:Formula[];
}
export type RelationType='hierarchy'|'foundation'|'connection'|'reference'|'classification';
export interface Relation {source:string;target:string;type:RelationType;label:string;sourceArticle?:string}
export const domainOrder=['foundations','algebra','analysis','geometry','number','discrete','probability','statistics','computation'];
export const colors:Record<string,string>={foundations:'#788c65',algebra:'#9c85b3',analysis:'#749db3',geometry:'#be9a6c',number:'#b38980',discrete:'#8a9d6c',probability:'#b2a16a',statistics:'#78a69b',computation:'#8c8eae',mathematics:'#85927e'};
export const symbols:Record<string,string>={foundations:'∀',algebra:'𝑥',analysis:'∫',geometry:'△',number:'ℤ',discrete:'⋮',probability:'P',statistics:'σ',computation:'λ'};
const decode=(s:string)=>{try{return decodeURIComponent(s);}catch{return s;}};
const normalized=(s:string)=>decode(s).toLowerCase().replaceAll('_',' ').replaceAll('’',"'");
const byLessonWiki=new Map(originalLessons.map(t=>[normalized(t.wiki),t]));
export const concepts:Concept[]=wikiData.entries.map(entry=>{
  // This redirect lands on a history of the web. The relevant source is the PrimePages entry.
  const e=entry.id==='wp-prime-pages'&&entry.wiki==='List_of_websites_founded_before_1995'
    ? {...entry,title:'PrimePages',wiki:entry.wiki+'#PrimePages',
        summary:'PrimePages is a website about prime numbers originally created by Chris Caldwell at the University of Tennessee at Martin.'}
    : entry;
  const lesson=byLessonWiki.get(normalized(e.wiki as string))??originalLessons.find(t=>t.id===e.id);
  const annotation=formulaLibrary[e.id];
  const formula=annotation?.text||(e.formula as string|undefined)||lesson?.formula;
  const sourced=(learningIndex.formulas as Record<string,Formula>)[e.id];
  return {...e,origin:e.origin??'curated',children:[],domain:'mathematics',depth:0,descendants:0,level:lesson?.level??'Concept',
    formulas:formula?[{text:formula,condition:annotation?.condition||(e.condition as string|undefined)||lesson?.meaning||'',...(annotation?.tex&&sourced?.mathml?{mathml:sourced.mathml,previewMathml:sourced.previewMathml}:{})}]:sourced?[sourced]:[],example:annotation?.example||lesson?.example,question:lesson?.question} as Concept;
});
export const byId=Object.fromEntries(concepts.map(n=>[n.id,n])) as Record<string,Concept>;
for(const n of concepts)if(n.parentId&&byId[n.parentId])byId[n.parentId].children.push(n.id);
const visited=new Set<string>();
function decorate(id:string,domain='mathematics',depth=0):number {
  if(visited.has(id))throw new Error(`A duplicate or circular browsing path reaches ${id}.`);visited.add(id);
  const n=byId[id]; n.depth=depth;n.domain=n.parentId==='mathematics'?id:domain;
  n.descendants=n.children.reduce((sum,c)=>sum+1+decorate(c,n.domain,depth+1),0);return n.descendants;
}
decorate('mathematics');
if(visited.size!==concepts.length)throw new Error('The mathematics hierarchy contains an unreachable subject.');
export const domains=domainOrder.map(id=>byId[id]);
export const hierarchy:Relation[]=concepts.filter(n=>n.parentId).map(n=>({source:n.parentId!,target:n.id,type:'hierarchy',label:`${n.title} is studied within ${byId[n.parentId!]?.title??'mathematics'}`}));
export const teaching:Relation[]=bridges.trim().split('\n').map(line=>{const[source,target,type,label]=line.split('|');return{source,target,type:type as RelationType,label};});
for(const edge of teaching)if(!byId[edge.source]||!byId[edge.target])throw new Error(`Invalid learning bridge ${edge.source} → ${edge.target}`);
export const references:Relation[]=wikiData.links.map(([a,b,kind,article])=>({source:concepts[a]?.id,target:concepts[b]?.id,type:kind===1?'classification' as const:'reference' as const,label:kind===1?'Classified in a Wikipedia subject outline':'Linked in the Wikipedia article',sourceArticle:article??concepts[a]?.sourceTitle})).filter(e=>byId[e.source]&&byId[e.target]&&e.source!==e.target);
export const relations=[...hierarchy,...teaching,...references];
const adjacency=new Map<string,Relation[]>();
for(const edge of relations){for(const id of [edge.source,edge.target]){const list=adjacency.get(id)??[];list.push(edge);adjacency.set(id,list);}}
export function connections(id:string,types?:RelationType[]) {
  const found=adjacency.get(id)??[];const seen=new Set<string>();
  return found.filter(e=>(!types||types.includes(e.type))).filter(e=>{const other=e.source===id?e.target:e.source;const key=other+e.type;if(seen.has(key))return false;seen.add(key);return true;});
}
export function ancestors(id:string):Concept[]{const result:Concept[]=[];const seen=new Set<string>();let n=byId[id];while(n&&!seen.has(n.id)){seen.add(n.id);result.unshift(n);if(!n.parentId)break;n=byId[n.parentId];}return result;}
export function articleUrl(n:Concept|string){const title=typeof n==='string'?n:n.wiki;return 'https://en.wikipedia.org/wiki/'+title.split('#').map(p=>encodeURIComponent(decode(p.replaceAll(' ','_')))).join('#');}
export function search(query:string,domain?:string):Concept[]{
  const words=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if(!words.length)return domains;
  return concepts.filter(n=>n.id!=='mathematics'&&(!domain||n.domain===domain)&&words.every(w=>`${n.title} ${n.wiki.replaceAll('_',' ')} ${n.summary}`.toLowerCase().includes(w)))
    .sort((a,b)=>Number(b.title.toLowerCase()===query.toLowerCase())-Number(a.title.toLowerCase()===query.toLowerCase())||a.depth-b.depth||a.title.localeCompare(b.title));
}
export const sourceOutlines=wikiData.sources as Array<{article:string;parentId:string;status:string;added?:number}>;
export const sourcePages=wikiData.pages as Array<{title:string;pageid:number;revision:number;url:string;excerpt:string}>;
export const sourceDate=wikiData.generatedAt;
