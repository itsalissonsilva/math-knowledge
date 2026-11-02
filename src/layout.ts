export interface Point {x:number;y:number}
export interface Camera {center:Point;zoom:number}
export const overviewPositions:Record<string,Point>={foundations:{x:0,y:0},algebra:{x:-330,y:-200},analysis:{x:330,y:-200},geometry:{x:0,y:-270},number:{x:-330,y:260},discrete:{x:430,y:35},probability:{x:330,y:260},statistics:{x:0,y:330},computation:{x:-430,y:35}};
export const FOCUS_MS=650,SPROUT_MS=700,BRANCH_STAGGER_MS=75;
export const rootPoint=(id:string):Point=>({x:overviewPositions[id].x*1.65,y:overviewPositions[id].y*1.65});
export const stageUnit=(depth:number)=>Math.max(1e-9,Math.pow(.38,Math.max(0,depth)));
export function spiralOffsets(count:number,compact=false):Point[]{
  if(!count)return [];
  if(count===1)return [{x:0,y:compact?-210:-210}];
  if(count===2)return [{x:compact?-110:-315,y:0},{x:compact?110:315,y:0}];
  if(count===4){
    if(compact)return [{x:0,y:-215},{x:110,y:0},{x:0,y:215},{x:-110,y:0}];
    return [{x:-300,y:-180},{x:300,y:-180},{x:300,y:180},{x:-300,y:180}];
  }
  const rx=compact?(count===5?125:145):(count===5?350:365),ry=compact?225:225;
  return Array.from({length:count},(_,index)=>{const angle=-Math.PI/2+index*Math.PI*2/count;return {x:Math.cos(angle)*rx,y:Math.sin(angle)*ry};});
}
export function centeredCamera(point:Point,unit:number,count:number,width:number,height:number):Camera{
  const compact=width<600,offsets=spiralOffsets(Math.max(1,count),compact);
  const maxX=Math.max(1,...offsets.map(p=>Math.abs(p.x))),maxY=Math.max(1,...offsets.map(p=>Math.abs(p.y)));
  const marginX=compact?(count===5?76:85):140,marginY=compact?100:105;
  const scale=Math.max(.15,Math.min(1.05,(width/2-marginX)/maxX,(height/2-marginY)/maxY));
  return {center:{...point},zoom:scale/unit};
}
export function project(point:Point,camera:Camera):Point{return {x:(point.x-camera.center.x)*camera.zoom,y:(point.y-camera.center.y)*camera.zoom};}
export function smooth(t:number){const p=Math.max(0,Math.min(1,t));return p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;}
export function cameraBetween(start:Camera,end:Camera,t:number):Camera{
  const eased=smooth(t);return {center:{x:start.center.x+(end.center.x-start.center.x)*eased,y:start.center.y+(end.center.y-start.center.y)*eased},zoom:start.zoom*Math.exp(Math.log(end.zoom/start.zoom)*eased)};
}
export function branchProgress(elapsed:number,index:number){return smooth((elapsed-index*BRANCH_STAGGER_MS)/SPROUT_MS);}
export function motionFrame(elapsed:number,count:number){
  const duration=FOCUS_MS+(count?SPROUT_MS+(count-1)*BRANCH_STAGGER_MS:0);
  return {phase:elapsed<FOCUS_MS?'focusing' as const:elapsed<duration?'sprouting' as const:'settled' as const,focus:Math.min(1,elapsed/FOCUS_MS),bloom:Math.max(0,elapsed-FOCUS_MS),duration};
}
const lerp=(a:Point,b:Point,t:number):Point=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
export function spiralCurve(a:Point,b:Point,t=1,startRadius=12,curl=.82){
  const dx=b.x-a.x,dy=b.y-a.y,distance=Math.hypot(dx,dy),angle=Math.atan2(dy,dx),startAngle=angle+curl,endAngle=angle-curl*.55;
  const start={x:a.x+Math.cos(startAngle)*Math.min(startRadius,distance/3),y:a.y+Math.sin(startAngle)*Math.min(startRadius,distance/3)};
  const c1={x:start.x+Math.cos(startAngle)*distance*.43,y:start.y+Math.sin(startAngle)*distance*.43};
  const c2={x:b.x-Math.cos(endAngle)*distance*.43,y:b.y-Math.sin(endAngle)*distance*.43};
  const p=Math.max(0,Math.min(1,t)),q0=lerp(start,c1,p),q1=lerp(c1,c2,p),q2=lerp(c2,b,p),r0=lerp(q0,q1,p),r1=lerp(q1,q2,p),end=lerp(r0,r1,p);
  return {end,path:'M '+start.x+' '+start.y+' C '+q0.x+' '+q0.y+' '+r0.x+' '+r0.y+' '+end.x+' '+end.y};
}
