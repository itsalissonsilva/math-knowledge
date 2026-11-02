/** Refresh only descriptions from the cached Wikipedia revisions, offline. */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {pageExcerpt,plainIntro,excerptLicense} from './wikipedia-excerpts.mjs';

const cache=process.argv[2]??path.join(os.tmpdir(),'mapofmathematics-wikipedia-read-cache');
const target=new URL('../public/wikipedia-catalog.json',import.meta.url);
const snapshot=JSON.parse(await fs.readFile(target,'utf8'));
const pages=new Map();
for(const file of await fs.readdir(cache)){
  if(!file.endsWith('.json'))continue;
  const response=JSON.parse(await fs.readFile(path.join(cache,file),'utf8'));
  for(const page of response.query?.pages??[]){
    if(page.missing)continue;
    if(page.revisions?.[0]?.slots?.main?.content||!pages.has(page.pageid))pages.set(page.pageid,page);
  }
}
const missing=[],excerpts=new Map();
for(const source of snapshot.pages){
  const page=pages.get(source.pageid);
  const excerpt=page&&pageExcerpt(page);
  if(!excerpt){missing.push({title:source.title,intro:page?plainIntro(page.revisions?.[0]?.slots?.main?.content??page.extract??''):null});continue;}
  excerpts.set(source.pageid,excerpt);
}
if(missing.length){
  await fs.mkdir(new URL('../test-results/',import.meta.url),{recursive:true});
  await fs.writeFile(new URL('../test-results/incomplete-descriptions.json',import.meta.url),JSON.stringify(missing,null,2));
  throw new Error(`${missing.length} source descriptions need review; see test-results/incomplete-descriptions.json. No snapshot was changed.`);
}
let changed=0;
for(const page of snapshot.pages)page.excerpt=excerpts.get(page.pageid);
for(const node of snapshot.entries){
  if(node.origin!=='wikipedia')continue;
  const excerpt=excerpts.get(node.pageId);
  if(!excerpt)throw new Error('Missing source description for '+node.id);
  if(node.summary!==excerpt)changed++;
  node.summary=excerpt;
}
snapshot.license=excerptLicense;
await fs.writeFile(target,JSON.stringify(snapshot));
console.log(JSON.stringify({changedDescriptions:changed,sourcePages:excerpts.size,concepts:snapshot.entries.length-1,references:snapshot.links.length}));
