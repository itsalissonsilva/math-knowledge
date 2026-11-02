import {useEffect,useLayoutEffect,useMemo,useRef,useState,type CSSProperties,type PointerEvent} from 'react';
import {Expand,LocateFixed,Minus,Network,Plus} from 'lucide-react';
import {colors,symbols} from './atlas-data';
import MathExpression from './MathExpression';
import {diveAncestors,diveChildren,getDiveNode,referenceNode} from './dive-model';
import {buildScene,includePath,pathKey,validPath,type DivePath,type Stage} from './dive-scene';
import {branchProgress,cameraBetween,centeredCamera,motionFrame,project,spiralCurve,type Camera,type Point} from './layout';

export interface GraphRequest {id:string;kind:'home'|'reveal'|'connections';serial:number;path?:DivePath}
type Motion='overview'|'focusing'|'sprouting'|'settled';
const clampZoom=(zoom:number)=>Math.max(.002,Math.min(1e11,zoom));
export default function ExplorerGraph({focusId,onSelect,onRead,readingId,request}:{focusId:string;onSelect:(id:string,path?:DivePath)=>void;onRead:(id:string)=>void;readingId:string|null;request:GraphRequest}){
  const viewport=useRef<HTMLDivElement>(null);
  const[size,setSize]=useState({width:1280,height:650}),[stages,setStages]=useState<Stage[]>([]),[activePath,setActivePath]=useState<DivePath>(['mathematics']);
  const[camera,setCamera]=useState<Camera>({center:{x:0,y:0},zoom:.5}),[motion,setMotion]=useState<Motion>('overview'),[bloom,setBloom]=useState(0),[dragging,setDragging]=useState(false);
  const compact=size.width<600,scene=useMemo(()=>buildScene(stages,compact),[stages,compact]),activeKey=pathKey(activePath);
  const latest=useRef({scene,stages,activePath,camera,motion,size});latest.current={scene,stages,activePath,camera,motion,size};
  const animation=useRef<number|null>(null),generation=useRef(0),suppressClick=useRef(0);
  function stop(){generation.current++;if(animation.current!==null)cancelAnimationFrame(animation.current);animation.current=null;}
  function overviewCamera(nodes=latest.current.scene.nodes):Camera{
    const points=[...nodes.values()].map(node=>node.position),rect=viewport.current?.getBoundingClientRect()??latest.current.size;
    const minX=Math.min(...points.map(point=>point.x)),maxX=Math.max(...points.map(point=>point.x)),minY=Math.min(...points.map(point=>point.y)),maxY=Math.max(...points.map(point=>point.y));
    return {center:{x:(minX+maxX)/2,y:(minY+maxY)/2},zoom:Math.max(.03,Math.min((rect.width-150)/(maxX-minX+1),(rect.height-160)/(maxY-minY+1),.7))};
  }
  function fitMap(){
    stop();setMotion('overview');setBloom(Infinity);
    const begin=performance.now(),start=latest.current.camera,target=overviewCamera(),token=generation.current;
    const tick=(now:number)=>{if(token!==generation.current)return;const t=Math.min(1,(now-begin)/500);setCamera(cameraBetween(start,target,t));if(t<1)animation.current=requestAnimationFrame(tick);else animation.current=null;};
    animation.current=requestAnimationFrame(tick);
  }
  function dive(id:string,providedPath?:DivePath,readAfter=false){
    const node=getDiveNode(id);if(!node)return;
    const path=validPath(providedPath,id)??diveAncestors(id).map(parent=>parent.id);
    const rect=viewport.current?.getBoundingClientRect()??latest.current.size;
    const nextStages=includePath(latest.current.stages,path),nextScene=buildScene(nextStages,rect.width<600),point=nextScene.nodes.get(pathKey(path));
    if(!point)return;
    stop();const token=generation.current,start=latest.current.camera,count=diveChildren(id).length,target=centeredCamera(point.position,point.unit,count,rect.width,rect.height);
    setStages(nextStages);setActivePath(path);setBloom(0);setMotion('focusing');onSelect(id,path);
    const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if(reduced){setCamera(target);setBloom(Infinity);setMotion('settled');if(readAfter||!count)onRead(id);return;}
    const begin=performance.now();
    const tick=(now:number)=>{
      if(token!==generation.current)return;
      const frame=motionFrame(now-begin,count);
      setCamera(frame.focus<1?cameraBetween(start,target,frame.focus):target);
      setMotion(frame.phase);setBloom(frame.bloom);
      if(frame.phase!=='settled')animation.current=requestAnimationFrame(tick);
      else {animation.current=null;if(readAfter||!count)onRead(id);}
    };
    animation.current=requestAnimationFrame(tick);
  }
  useEffect(()=>{
    if(request.kind==='home'||request.id==='mathematics'){
      stop();const next=buildScene([],compact);setStages([]);setActivePath(['mathematics']);setMotion('overview');setBloom(0);setCamera(overviewCamera(next.nodes));return;
    }
    if(request.kind==='connections'){
      const id=referenceNode(request.id);if(id)dive(id,[...(request.path??latest.current.activePath),id]);return;
    }
    dive(request.id,request.path);
  },[request.serial]);
  useEffect(()=>{
    const element=viewport.current;if(!element)return;
    const observer=new ResizeObserver(()=>{const rect=element.getBoundingClientRect();setSize(current=>current.width===rect.width&&current.height===rect.height?current:{width:rect.width,height:rect.height});});
    observer.observe(element);return()=>observer.disconnect();
  },[]);
  useLayoutEffect(()=>{
    const current=latest.current;
    if(current.motion==='overview'){setCamera(overviewCamera());return;}
    const point=current.scene.nodes.get(pathKey(current.activePath));if(!point)return;
    stop();setCamera(centeredCamera(point.position,point.unit,diveChildren(point.id).length,size.width,size.height));setBloom(Infinity);setMotion('settled');
  },[size.width,size.height,compact]);
  useEffect(()=>()=>stop(),[]);
  function manual(){stop();setMotion('settled');setBloom(Infinity);}
  function zoomAt(factor:number,x=0,y=0){
    manual();setCamera(current=>{const zoom=clampZoom(current.zoom*factor),anchor={x:current.center.x+x/current.zoom,y:current.center.y+y/current.zoom};return {center:{x:anchor.x-x/zoom,y:anchor.y-y/zoom},zoom};});
  }
  useEffect(()=>{
    const element=viewport.current;if(!element)return;
    const wheel=(event:WheelEvent)=>{event.preventDefault();const rect=element.getBoundingClientRect();if(event.shiftKey){manual();setCamera(current=>({...current,center:{x:current.center.x+event.deltaY/current.zoom,y:current.center.y+event.deltaX/current.zoom}}));}else zoomAt(Math.exp(-event.deltaY*.0018),event.clientX-rect.left-rect.width/2,event.clientY-rect.top-rect.height/2);};
    element.addEventListener('wheel',wheel,{passive:false});return()=>element.removeEventListener('wheel',wheel);
  },[]);
  const pointers=useRef(new Map<number,Point>()),gesture=useRef<{camera:Camera;mid:Point;distance:number;blocked:boolean}|null>(null);
  function beginGesture(blocked=false){
    const points=[...pointers.current.values()];if(!points.length){gesture.current=null;return;}
    gesture.current={camera:latest.current.camera,mid:points.length>1?{x:(points[0].x+points[1].x)/2,y:(points[0].y+points[1].y)/2}:points[0],distance:points.length>1?Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y):0,blocked};
  }
  function down(event:PointerEvent<HTMLDivElement>){
    if(event.button!==0)return;const control=!!(event.target as HTMLElement).closest('button,a');if(control&&event.pointerType!=='touch')return;
    pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY});beginGesture(control&&pointers.current.size===1);
    if(!control){manual();setDragging(true);event.currentTarget.setPointerCapture(event.pointerId);}
  }
  function move(event:PointerEvent<HTMLDivElement>){
    if(!pointers.current.has(event.pointerId)||!gesture.current)return;pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY});
    const points=[...pointers.current.values()],start=gesture.current;
    if(points.length>1&&start.distance){
      manual();event.preventDefault();suppressClick.current=Date.now()+350;
      const rect=event.currentTarget.getBoundingClientRect(),mid={x:(points[0].x+points[1].x)/2-rect.left-rect.width/2,y:(points[0].y+points[1].y)/2-rect.top-rect.height/2},old={x:start.mid.x-rect.left-rect.width/2,y:start.mid.y-rect.top-rect.height/2};
      const zoom=clampZoom(start.camera.zoom*Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y)/start.distance);
      setCamera({zoom,center:{x:start.camera.center.x+old.x/start.camera.zoom-mid.x/zoom,y:start.camera.center.y+old.y/start.camera.zoom-mid.y/zoom}});
    }else if(!start.blocked){const dx=points[0].x-start.mid.x,dy=points[0].y-start.mid.y;if(Math.hypot(dx,dy)>5)suppressClick.current=Date.now()+200;setCamera({...start.camera,center:{x:start.camera.center.x-dx/start.camera.zoom,y:start.camera.center.y-dy/start.camera.zoom}});}
  }
  function finish(event:PointerEvent<HTMLDivElement>){pointers.current.delete(event.pointerId);if(pointers.current.size)beginGesture();else{gesture.current=null;setDragging(false);}}
  const isOverview=motion==='overview'||activePath.length<2,currentChildren=new Set(scene.edges.filter(edge=>edge.stage===activeKey).map(edge=>edge.target));
  const ancestry=new Set(activePath.slice(0,-1).map((_,index)=>pathKey(activePath.slice(0,index+1))));
  const activeCount=diveChildren(activePath[activePath.length-1]??'mathematics').length;
  const geometry=new Map<string,{screen:Point;progress:number}>();
  for(const point of scene.nodes.values()){
    const edge=scene.edges.find(edge=>edge.target===point.key&&edge.stage===activeKey);
    const progress=edge?(motion==='focusing'?0:motion==='sprouting'?branchProgress(bloom,edge.index):1):1;
    const screen=project(point.position,camera);
    if(edge&&!isOverview&&progress<1){const parent=project(scene.nodes.get(edge.source)!.position,camera);geometry.set(point.key,{screen:spiralCurve(parent,screen,progress,scene.nodes.get(edge.source)!.root?20:9).end,progress});}
    else geometry.set(point.key,{screen,progress});
  }
  const visibleNodes=[...scene.nodes.values()].filter(point=>{
    if(!isOverview&&currentChildren.has(point.key)&&motion==='focusing')return false;
    const screen=geometry.get(point.key)!.screen;
    if(!isOverview&&point.key!==activeKey&&!currentChildren.has(point.key)&&Math.hypot(screen.x,screen.y)<90)return false;
    return Math.abs(screen.x)<size.width/2+240&&Math.abs(screen.y)<size.height/2+200;
  });
  return <div className="explorer-graph" aria-label="Mathematics spiral explorer" data-motion={motion} data-focused-node={activePath[activePath.length-1]}>
    <div ref={viewport} className={'infinite-canvas '+(dragging?'is-dragging':'')} role="region" aria-label="Pan and zoom mathematics canvas" tabIndex={0} onPointerDown={down} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} onDoubleClick={event=>{if(!(event.target as HTMLElement).closest('button'))fitMap();}} onKeyDown={event=>{if(event.target!==event.currentTarget)return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key)){event.preventDefault();manual();setCamera(current=>({...current,center:{x:current.center.x+(event.key==='ArrowLeft'?-45:event.key==='ArrowRight'?45:0)/current.zoom,y:current.center.y+(event.key==='ArrowUp'?-45:event.key==='ArrowDown'?45:0)/current.zoom}}));}if(event.key==='+'||event.key==='=')zoomAt(1.25);if(event.key==='-')zoomAt(.8);if(event.key==='0')fitMap();}}>
      <svg className="spiral-lines" width={size.width} height={size.height} viewBox={(-size.width/2)+' '+(-size.height/2)+' '+size.width+' '+size.height} aria-hidden="true">
        {scene.edges.map(edge=>{
          const active=edge.stage===activeKey&&!isOverview,ancestor=ancestry.has(edge.target)||edge.target===activeKey;
          if(!isOverview&&!active&&!ancestor)return null;
          if(active&&motion==='focusing')return null;
          const a=project(scene.nodes.get(edge.source)!.position,camera),b=project(scene.nodes.get(edge.target)!.position,camera),progress=active&&motion==='sprouting'?branchProgress(bloom,edge.index):1;
          if(Math.max(a.x,b.x)<-size.width/2-400||Math.min(a.x,b.x)>size.width/2+400||Math.max(a.y,b.y)<-size.height/2-400||Math.min(a.y,b.y)>size.height/2+400)return null;
          const owner=getDiveNode(scene.nodes.get(edge.trunk?edge.target:edge.source)!.id)!,color=colors[owner.domain]??colors.foundations;
          return <path key={edge.source+edge.target} data-branch-domain={owner.domain} d={spiralCurve(a,b,progress,edge.trunk?16:active?(scene.nodes.get(edge.source)!.root?20:9):5).path} className={active?'active-spiral':edge.trunk?'root-spiral':'context-spiral'} style={{stroke:color,opacity:active?1:isOverview?edge.trunk?0.85:0.55:.16}}/>;
        })}
      </svg>
      <div className="spiral-nodes">{visibleNodes.map(point=>{
        const node=getDiveNode(point.id)!,center=point.key===activeKey&&!isOverview,child=currentChildren.has(point.key)&&!isOverview,root=point.root;
        const {screen,progress}=geometry.get(point.key)!,ready=!child||progress>.9,context=!isOverview&&!center&&!child,detail=center||child;
        const showLabel=detail||root||isOverview&&camera.zoom*(point.unit/.38)>.45;
        const formula=detail?node.formulas[0]:undefined,above=!center&&(child?screen.y<=10:point.position.y<0),width=compact?(child&&activeCount===5?120:center?180:root?120:145):center?290:root&&!detail?210:250;
        const opacity=child?Math.min(1,Math.max(0,(progress-.6)/.4)):context?0.16:1;
        return <div className={'spiral-node '+(center?'center-node ':'')+(root?'major-node ':'')+(detail?'detail-node ':'')+(above?'label-above ':'')+(context?'archived-node':'')} key={point.key} data-node-id={point.id} data-node-role={center?'center':child?'branch':'context'} style={{left:'calc(50% + '+screen.x+'px)',top:'calc(50% + '+screen.y+'px)','--node-color':colors[node.domain]??colors.foundations,'--node-width':width+'px',opacity} as CSSProperties} aria-hidden={!ready||context?true:undefined}>
          <button className="spiral-node-button" tabIndex={ready&&!context?0:-1} aria-label={(center?'Read notes: ':'Explore: ')+node.title} title={node.title} onClick={event=>{if(!ready||suppressClick.current>Date.now())return;if(center&&motion==='settled'){onRead(point.id);return;}dive(point.id,point.path,event.shiftKey);}}>
            <span className="spiral-orb">{root&&<span>{symbols[point.id]}</span>}</span>
            {showLabel&&<span className="spiral-label"><span className="spiral-title">{node.title}</span>{formula&&<span className="spiral-formula" role="math"><MathExpression formula={formula} compact/></span>}</span>}
          </button>
        </div>;
      })}</div>
    </div>
    <div className="map-bottom"><div className="graph-mode">{focusId!=='mathematics'&&!focusId.startsWith('r/')&&!focusId.startsWith('rv/')&&<button className="quiet-button" aria-label="Explore sourced connections" onClick={()=>{const id=referenceNode(focusId);if(id)dive(id,[...activePath,id]);}}><Network size={14}/><span>Connections</span></button>}</div><div className="canvas-controls"><button className="icon-button" aria-label="Zoom out" onClick={()=>zoomAt(.8)}><Minus size={17}/></button><button className="icon-button" aria-label="Zoom in" onClick={()=>zoomAt(1.25)}><Plus size={17}/></button>{focusId!=='mathematics'&&<button className="icon-button" aria-label="Center selected node" onClick={()=>dive(focusId,activePath)}><LocateFixed size={17}/></button>}<button className="icon-button" aria-label="Fit entire map" onClick={fitMap}><Expand size={16}/></button></div></div>
  </div>;
}
