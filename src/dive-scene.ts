import {domainOrder} from './atlas-data.ts';
import {diveChildren,getDiveNode} from './dive-model.ts';
import {rootPoint,spiralOffsets,stageUnit,type Point} from './layout.ts';

export type DivePath=string[];
export const pathKey=(path:DivePath)=>JSON.stringify(path);
export interface Stage {path:DivePath}
export interface SceneNode {key:string;id:string;path:DivePath;position:Point;unit:number;root:boolean;parentKey:string|null}
export interface SceneEdge {source:string;target:string;stage:string|null;index:number;trunk:boolean}
export function includePath(stages:Stage[],path:DivePath){
  const next=[...stages],known=new Set(stages.map(stage=>pathKey(stage.path)));
  for(let length=2;length<=path.length;length++){
    const prefix=path.slice(0,length),key=pathKey(prefix);
    if(!known.has(key)){known.add(key);next.push({path:prefix});}
  }
  return next;
}
export function buildScene(stages:Stage[],compact=false){
  const nodes=new Map<string,SceneNode>(),edges:SceneEdge[]=[];
  for(const id of domainOrder){
    const path=['mathematics',id],key=pathKey(path);
    nodes.set(key,{key,id,path,position:rootPoint(id),unit:1,root:true,parentKey:id==='foundations'?null:pathKey(['mathematics','foundations'])});
  }
  for(const id of domainOrder.filter(id=>id!=='foundations'))edges.push({source:pathKey(['mathematics','foundations']),target:pathKey(['mathematics',id]),stage:null,index:0,trunk:true});
  for(const stage of [...stages].sort((a,b)=>a.path.length-b.path.length)){
    const key=pathKey(stage.path);let parent=nodes.get(key);
    if(!parent&&stage.path[stage.path.length-1].startsWith('r/')){
      const parentKey=pathKey(stage.path.slice(0,-1)),source=nodes.get(parentKey);
      if(source){parent={key,id:stage.path[stage.path.length-1],path:stage.path,position:{...source.position},unit:stageUnit(stage.path.length-2),root:false,parentKey};nodes.set(key,parent);}
    }
    if(!parent)continue;
    const children=diveChildren(parent.id),offsets=spiralOffsets(children.length,compact);
    children.forEach((child,index)=>{
      const path=[...stage.path,child.id],childKey=pathKey(path),offset=offsets[index];
      nodes.set(childKey,{key:childKey,id:child.id,path,position:{x:parent.position.x+offset.x*parent.unit,y:parent.position.y+offset.y*parent.unit},unit:stageUnit(path.length-2),root:false,parentKey:key});
      edges.push({source:key,target:childKey,stage:key,index,trunk:false});
    });
  }
  return {nodes,edges};
}
export function validPath(path:DivePath|undefined,id:string){
  if(path?.[0]!=='mathematics'||path.at(-1)!==id)return null;
  for(let index=1;index<path.length;index++){
    const parent=getDiveNode(path[index-1]),child=getDiveNode(path[index]);
    if(!parent||!child)return null;
    if(!parent.children.includes(child.id)&&child.id!=='r/'+parent.sourceId)return null;
  }
  return path;
}
