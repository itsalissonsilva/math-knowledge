import {byId,references,subjectMetadata} from './atlas-data.ts';

type Subject={categories:string[];links:string[]};
const subjects=subjectMetadata as Record<string,Subject>;
const words=(text:string)=>text.toLocaleLowerCase('en').normalize('NFKD').replace(/\p{Diacritic}/gu,'').match(/[a-z]{3,}/g)??[];
const stop=new Set('the and for with from mathematical mathematics general basic theory concepts properties types topics introduction overview related other applications foundations'.split(' '));
const normal=(s:string)=>words(s.replace(/\((?:mathematics|statistics|graph theory)\)/gi,'')).filter(w=>!stop.has(w)).join(' ');
const categoryAllowed=(category:string)=>category.length<63&&!/^(?:theorems|lemmas|inequalities|conjectures) in |^basic concepts|^properties of |^types of |^mathematical |^statistical terminology|^fields of |^equations$|^functions and mappings$|^generalizations$|^structures on /i.test(category)&&!/^[\p{Lu}][\p{L}’'-]+ [\p{Lu}][\p{L}’'-]+$/u.test(category);
const related=new Map<string,Set<string>>();
for(const edge of references){
  if(edge.type==='classification')continue;
  const a=related.get(edge.source)??new Set<string>();a.add(edge.target);related.set(edge.source,a);
}
const featureCache=new Map<string,Map<string,number>>();
function features(id:string){
  const known=featureCache.get(id);if(known)return known;
  const node=byId[id],subject=subjects[id],map=new Map<string,number>();
  const add=(key:string,weight:number)=>map.set(key,(map.get(key)??0)+weight);
  for(const word of words(node.title))if(!stop.has(word))add('w:'+word,4);
  for(const category of subject?.categories??[]){
    add('c:'+normal(category),6);
    for(const word of words(category))if(!stop.has(word))add('w:'+word,1.5);
  }
  for(const part of (node.sourceSection??'').split(' › '))if(part.length>3&&!/general|miscellaneous|other|further/i.test(part)){
    add('s:'+normal(part),2.5);
    for(const word of words(part))if(!stop.has(word))add('w:'+word,.8);
  }
  for(const link of subject?.links??[])add('l:'+normal(link),.8);
  featureCache.set(id,map);return map;
}
export function subjectAffinity(a:string,b:string){
  const fa=features(a),fb=features(b);let dot=0,na=0,nb=0;
  for(const [key,value]of fa){na+=value*value;dot+=value*(fb.get(key)??0);}
  for(const value of fb.values())nb+=value*value;
  const lexical=dot/Math.sqrt(na*nb||1),link=related.get(a)?.has(b)||related.get(b)?.has(a);
  return lexical+(link ? .12 : 0);
}
function representative(ids:string[]){
  const central=new Map(ids.map(id=>[id,ids.reduce((sum,other)=>sum+(other===id?0:subjectAffinity(id,other)),0)]));
  return [...ids].sort((a,b)=>central.get(b)!-central.get(a)!||Number(byId[b].origin==='curated')-Number(byId[a].origin==='curated')||byId[a].title.length-byId[b].title.length);
}
/** Labels are real subject categories, or explicit names of member concepts.
 * No alphabetic ranges, unnamed overflow nodes, or invented prerequisite claims. */
export function subjectLabel(ids:string[],avoid:string[]=[]){
  if(ids.length===1)return byId[ids[0]].title;
  const forbidden=new Set(avoid.map(normal)),counts=new Map<string,number>();
  for(const id of ids)for(const category of new Set(subjects[id]?.categories??[])){
    if(!categoryAllowed(category)||forbidden.has(normal(category)))continue;
    counts.set(category,(counts.get(category)??0)+1);
  }
  const category=[...counts].filter(([,count])=>count===ids.length).sort((a,b)=>a[0].length-b[0].length)[0]?.[0];
  if(category)return category.replace(/ \((?:mathematics|statistics|graph theory)\)/g,'');
  const ranked=representative(ids),a=ranked[0],b=ranked.slice(1).find(id=>normal(byId[id].title)!==normal(byId[a].title))??ranked[1];
  return byId[a].title+' & '+byId[b].title;
}
export interface SubjectBucket{title:string;ids:string[]}
/** Average-link clustering keeps source categories, vocabulary, and article
 * connections together. Repeating this partition creates genuine dive levels. */
export function semanticBuckets(ids:string[],avoid:string[]=[],count=4):SubjectBucket[]{
  if(ids.length<=count)return ids.map(id=>({title:byId[id].title,ids:[id]}));
  // Keep complete, named Wikipedia subject families intact before applying
  // affinity clustering. A common category is never split to fill four slots.
  const remaining=new Set(ids),families:SubjectBucket[]=[],forbidden=new Set(avoid.map(normal));
  while(families.length<count-1){
    const candidates=new Map<string,string[]>();
    for(const id of remaining){
      const labels=[...(subjects[id]?.categories??[]),...(byId[id].sourceSection??'').split(' › ').filter(s=>s.length>4&&!/general|other|miscellaneous|further|overview/i.test(s))];
      for(const label of new Set(labels))if(categoryAllowed(label)&&!forbidden.has(normal(label))){const members=candidates.get(label)??[];members.push(id);candidates.set(label,members);}
    }
    const winner=[...candidates].filter(([,members])=>members.length>=3&&members.length<ids.length*.86).sort((a,b)=>b[1].length-a[1].length||a[0].length-b[0].length)[0];
    if(!winner)break;
    const[title,members]=winner;families.push({title:title.replace(/ \((?:mathematics|statistics|graph theory)\)/g,''),ids:members});members.forEach(id=>remaining.delete(id));forbidden.add(normal(title));
    if(remaining.size<=1)break;
  }
  if(families.length){
    const rest=[...remaining];
    if(rest.length)families.push({title:subjectLabel(rest,[...avoid,...families.map(f=>f.title)]),ids:rest});
    return families;
  }
  // Connection collections can contain thousands of articles. Seeded assignment
  // bounds their work; ordinary subject lists use the more precise dendrogram.
  if(ids.length>260){
    const anchors=[ids[0]];
    while(anchors.length<count){
      const next=ids.filter(id=>!anchors.includes(id)).sort((a,b)=>Math.max(...anchors.map(x=>subjectAffinity(a,x)))-Math.max(...anchors.map(x=>subjectAffinity(b,x))))[0];
      anchors.push(next);
    }
    const groups=anchors.map(id=>[id]);
    for(const id of ids.filter(id=>!anchors.includes(id))){
      let best=0,score=-Infinity;
      for(let index=0;index<count;index++){const value=subjectAffinity(id,anchors[index])-.015*groups[index].length/Math.ceil(ids.length/count);if(value>score){best=index;score=value;}}
      groups[best].push(id);
    }
    return groups.map(members=>({title:subjectLabel(members,avoid),ids:members}));
  }
  const members=ids.map(id=>[id]),active=new Set(ids.map((_,index)=>index)),scores=new Map<string,number>();
  const key=(a:number,b:number)=>a<b?a+':'+b:b+':'+a;
  for(let a=0;a<ids.length;a++)for(let b=a+1;b<ids.length;b++)scores.set(key(a,b),subjectAffinity(ids[a],ids[b]));
  while(active.size>count){
    const indices=[...active];let pair:[number,number]=[indices[0],indices[1]],best=-Infinity;
    for(let a=0;a<indices.length;a++)for(let b=a+1;b<indices.length;b++){
      const i=indices[a],j=indices[b],size=members[i].length+members[j].length;
      const score=(scores.get(key(i,j))??0)-.08*Math.pow(size/Math.ceil(ids.length/count),2);
      if(score>best){best=score;pair=[i,j];}
    }
    const[a,b]=pair,la=members[a].length,lb=members[b].length;
    for(const c of active)if(c!==a&&c!==b)scores.set(key(a,c),((scores.get(key(a,c))??0)*la+(scores.get(key(b,c))??0)*lb)/(la+lb));
    members[a].push(...members[b]);active.delete(b);
  }
  const used=[...avoid];
  return [...active].map(index=>{const title=subjectLabel(members[index],used);used.push(title);return {title,ids:members[index]};});
}
