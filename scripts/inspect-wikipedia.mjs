import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
const wanted=new Set(process.argv.slice(2).map(s=>s.toLowerCase()));
const directory=path.join(os.tmpdir(),'mapofmathematics-wikipedia-read-cache');
for(const file of await fs.readdir(directory)){
  let data;try{data=JSON.parse(await fs.readFile(path.join(directory,file),'utf8'));}catch{continue;}
  for(const page of data.query?.pages??[]){if(!wanted.has(page.title.toLowerCase()))continue;wanted.delete(page.title.toLowerCase());const text=page.revisions?.[0]?.slots?.main?.content??'';console.log(JSON.stringify({title:page.title,length:text.length,templates:[...new Set([...text.matchAll(/\{\{\s*([^|}\n]+)/g)].map(m=>m[1]))].slice(0,25),sample:text.split('\n').filter(s=>/\[\[|\{\{term|\{\{defn/.test(s)).slice(0,15)},null,2));}
  if(!wanted.size)break;
}
