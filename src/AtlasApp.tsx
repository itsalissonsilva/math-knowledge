import {useEffect,useMemo,useRef,useState,type CSSProperties,type ReactNode} from 'react';
import {ArrowLeft,ArrowRight,ArrowUpRight,BookOpen,ChevronRight,Info,Moon,Search,Sun,X} from 'lucide-react';
import ExplorerGraph,{type GraphRequest} from './ExplorerGraph';
import MathExpression from './MathExpression';
import {diveAncestors,getDiveNode} from './dive-model';
import {articleUrl,byId,colors,concepts,connections,search,sourceOutlines,type Concept,type Relation} from './atlas-data';

function routeId(){try{const id=decodeURIComponent(location.hash.replace(/^#\/?/,''));return getDiveNode(id)?id:'mathematics';}catch{return 'mathematics';}}
function Fraction({top,bottom}:{top:ReactNode;bottom:ReactNode}){return <span className="math-fraction"><span>{top}</span><span>{bottom}</span></span>;}
function Formula({node}:{node:Concept}){
  const formula=node.formulas[0];if(!formula)return null;
  let display:ReactNode=<MathExpression formula={formula}/>;
  if(node.id==='derivatives')display=<><span>f′(x) =</span><span className="math-limit">lim<sub>h → 0</sub></span><Fraction top="f(x + h) − f(x)" bottom="h"/></>;
  if(node.id==='equations'||node.id==='quadratic-equations')display=<><span>x =</span><Fraction top="−b ± √(b² − 4ac)" bottom="2a"/></>;
  if(node.id==='bayes')display=<><span>P(H ∣ E) =</span><Fraction top="P(E ∣ H)P(H)" bottom="P(E)"/></>;
  return <div className="note-formula"><div className="math-display" role="math" aria-label={formula.text}>{display}</div><p>{formula.condition}</p></div>;
}

function Notes({id,onClose,onNavigate,onConnections}:{id:string;onClose:()=>void;onNavigate:(id:string)=>void;onConnections:()=>void}){
  const node=getDiveNode(id)!,scroll=useRef<HTMLDivElement>(null);
  const[filter,setFilter]=useState(''),[limit,setLimit]=useState(25);
  const all=useMemo(()=>connections(node.sourceId,['foundation','connection','reference','classification']),[id]);
  const bridges=all.filter(e=>e.type==='connection'||e.type==='foundation').slice(0,5);
  const filtered=all.filter(e=>byId[e.source===node.sourceId?e.target:e.source].title.toLowerCase().includes(filter.toLowerCase()));
  useEffect(()=>{setFilter('');setLimit(25);scroll.current?.scrollTo(0,0);},[id]);
  function other(edge:Relation){return byId[edge.source===node.sourceId?edge.target:edge.source];}
  return <aside className="concept-notes" aria-label={'Notes for '+node.title} style={{'--accent':colors[node.domain]} as CSSProperties}>
    <div className="notes-top"><span>{byId[node.domain]?.title??'Mathematics'}</span><button className="icon-button" aria-label="Close notes" onClick={onClose}><X size={18}/></button></div>
    <div className="notes-scroll" ref={scroll}>
      <h1>{node.title}</h1>
      <p className="note-summary">{node.origin==='wikipedia'?'“'+node.summary+'”':node.summary}</p>
      {node.origin==='wikipedia'&&<a className="excerpt-credit" href={articleUrl(node)} target="_blank" rel="noreferrer">Wikipedia · CC BY-SA <ArrowUpRight size={10}/></a>}
      <Formula node={node}/>
      {node.example&&<section className="note-section"><h2>Example</h2><p>{node.example}</p></section>}
      {!!bridges.length&&<section className="note-section"><h2>Related ideas</h2>{bridges.map((edge,i)=><div className="learning-bridge" key={i}><button onClick={()=>onNavigate(other(edge).id)}>{other(edge).title}<ChevronRight size={12}/></button><p>{edge.label}</p></div>)}</section>}
      <a className="wikipedia-link" href={articleUrl(node)} target="_blank" rel="noreferrer">Read on Wikipedia <ArrowUpRight size={14}/></a>
      {node.sourceOutline&&<a className="outline-credit" href={articleUrl(node.sourceOutline)} target="_blank" rel="noreferrer">From {node.sourceOutline}<ArrowUpRight size={10}/></a>}
      {node.sourceFallback&&<p className="source-footnote">The linked article covers this concept within its parent subject.</p>}
      {!!all.length&&<details className="note-connections" key={id}><summary>Connections <span>{all.length}</span></summary><button className="text-button" onClick={onConnections}>Explore on the map <ArrowRight size={12}/></button><input value={filter} onChange={e=>{setFilter(e.target.value);setLimit(25);}} aria-label="Filter concept connections" placeholder="Filter connections…"/><div>{filtered.slice(0,limit).map((edge,i)=><div className="source-connection" key={i}><button onClick={()=>onNavigate(other(edge).id)}>{other(edge).title}<ChevronRight size={12}/></button><small>{edge.type==='reference'?'Wikipedia reference':edge.type==='classification'?'Subject classification':'Learning connection'}</small>{edge.sourceArticle&&<a href={articleUrl(edge.sourceArticle)} target="_blank" rel="noreferrer" aria-label={'Source for '+other(edge).title}><ArrowUpRight size={11}/></a>}</div>)}</div>{filtered.length>limit&&<button className="text-button" onClick={()=>setLimit(n=>n+50)}>Show more <ArrowRight size={12}/></button>}</details>}
    </div>
  </aside>;
}

export default function AtlasApp(){
  const[focusId,setFocusId]=useState(routeId),[readingId,setReadingId]=useState<string|null>(null);
  const[trailIds,setTrailIds]=useState(()=>diveAncestors(routeId()).map(node=>node.id));
  const[theme,setTheme]=useState(document.documentElement.dataset.theme==='light'?'light':'dark');
  const[graphRequest,setGraphRequest]=useState<GraphRequest>(()=>({id:routeId(),kind:routeId()==='mathematics'?'home':'reveal',serial:0}));
  const[searchOpen,setSearchOpen]=useState(false),[guide,setGuide]=useState(false),[query,setQuery]=useState(''),[limit,setLimit]=useState(40);
  const searchInput=useRef<HTMLInputElement>(null),dialog=useRef<HTMLElement>(null),lastFocus=useRef<HTMLElement|null>(null);
  const focus=getDiveNode(focusId)!,trail=trailIds.slice(1).map(id=>getDiveNode(id)!).filter(Boolean),results=useMemo(()=>search(query),[query]);
  const sources=[...new Map(sourceOutlines.map(source=>[source.article,source])).values()];
  useEffect(()=>{document.documentElement.dataset.theme=theme;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#1b211c':'#fafbf7');try{localStorage.setItem('mom-theme',theme);}catch{}},[theme]);
  useEffect(()=>{const pop=()=>{const id=routeId(),stored=history.state?.mathTrail,path=Array.isArray(stored)&&stored.every((part:string)=>!!getDiveNode(part))?stored:diveAncestors(id).map(node=>node.id);setFocusId(id);setTrailIds(path);setReadingId(null);setGraphRequest(current=>({id,kind:'reveal',path,serial:current.serial+1}));setSearchOpen(false);};window.addEventListener('popstate',pop);window.addEventListener('hashchange',pop);return()=>{window.removeEventListener('popstate',pop);window.removeEventListener('hashchange',pop);};},[]);
  useEffect(()=>{const keys=(event:KeyboardEvent)=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();setSearchOpen(v=>!v);setGuide(false);}if(event.key==='Escape'){setSearchOpen(false);setGuide(false);setReadingId(null);}};window.addEventListener('keydown',keys);return()=>window.removeEventListener('keydown',keys);},[]);
  useEffect(()=>{
    if(!searchOpen&&!guide)return;
    lastFocus.current=document.activeElement as HTMLElement;
    (searchOpen?searchInput.current:dialog.current?.querySelector<HTMLButtonElement>('button'))?.focus();
    const trap=(event:KeyboardEvent)=>{if(event.key!=='Tab')return;const controls=dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]),input,a[href],summary');if(!controls?.length)return;const first=controls[0],last=controls[controls.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}};
    document.addEventListener('keydown',trap);return()=>{document.removeEventListener('keydown',trap);lastFocus.current?.focus();};
  },[searchOpen,guide]);
  function select(id:string,path?:string[]){if(!getDiveNode(id))return;const next=path??diveAncestors(id).map(node=>node.id);setFocusId(id);setTrailIds(next);setReadingId(null);if(location.hash!=='#'+id)history.pushState({mathTrail:next},'','#'+id);else history.replaceState({mathTrail:next},'','#'+id);}
  function navigate(id:string,position?:number){const index=position??trailIds.lastIndexOf(id),path=index>=0?trailIds.slice(0,index+1):diveAncestors(id).map(node=>node.id);select(id,path);setSearchOpen(false);setGraphRequest(current=>({id,path,kind:id==='mathematics'?'home':'reveal',serial:current.serial+1}));}
  function read(id:string){setReadingId(current=>current===id?null:id);}
  function openSearch(){setQuery('');setLimit(40);setSearchOpen(true);setGuide(false);}
  return <div className="math-atlas">
    <a className="skip-link" href="#atlas-main">Skip to map</a>
    <header className="map-header"><nav aria-label="Mathematics breadcrumbs"><button className="map-brand" title="Reset the map" onClick={()=>navigate('mathematics')}>map of mathematics</button>{focusId!=='mathematics'&&<><span className="header-separator"/><button className="icon-button back-button" aria-label="Back to parent subgraph" onClick={()=>navigate(trailIds[trailIds.length-2]??'mathematics')}><ArrowLeft size={16}/></button><div className="breadcrumbs">{trail.map((node,i)=><span key={node.id+"-"+i}>{i>0&&<ChevronRight size={11}/>}<button onClick={()=>navigate(node.id,i+1)} aria-current={node.id===focusId?'page':undefined}>{node.title}</button></span>)}</div></>}</nav><div className="map-tools"><button className="icon-button" aria-label="Search the complete mathematics graph" title="Search · Ctrl K" onClick={openSearch}><Search size={18}/></button><button className="icon-button" aria-label={'Switch to '+(theme==='light'?'dark':'light')+' theme'} onClick={()=>setTheme(theme==='light'?'dark':'light')} title="Change theme">{theme==='light'?<Moon size={18}/>:<Sun size={18}/>}</button><button className="icon-button" aria-label={focusId==='mathematics'?'About the atlas':'About this concept'} onClick={()=>focusId==='mathematics'?setGuide(true):read(focusId)} title={focusId==='mathematics'?'About the atlas':'Read notes'}>{focusId==='mathematics'?<Info size={18}/>:<BookOpen size={18}/>}</button></div></header>
    <div className="map-body"><main id="atlas-main"><ExplorerGraph focusId={focusId} onSelect={select} onRead={read} readingId={readingId} request={graphRequest}/></main>{readingId&&<Notes id={readingId} onClose={()=>setReadingId(null)} onNavigate={navigate} onConnections={()=>{const id=readingId;setReadingId(null);setGraphRequest(current=>({id,path:trailIds,kind:'connections',serial:current.serial+1}));}}/>}</div>
    {(searchOpen||guide)&&<div className="modal-shade" onClick={event=>{if(event.target===event.currentTarget){setSearchOpen(false);setGuide(false);}}}><section ref={dialog} className={'map-dialog '+(guide?'about-dialog':'search-dialog')} role="dialog" aria-modal="true" aria-label={searchOpen?'Search all mathematics concepts':'About the mathematics atlas'}>
      {searchOpen?<><div className="search-input"><Search size={18}/><input ref={searchInput} value={query} onChange={event=>{setQuery(event.target.value);setLimit(40);}} onKeyDown={event=>{if(event.key==='Enter'&&results.length)navigate(results[0].id);}} placeholder="Find a concept…" aria-label="Search all concepts"/><button className="icon-button" aria-label="Close search" onClick={()=>setSearchOpen(false)}><X size={18}/></button></div><div className="search-results">{results.slice(0,limit).map(node=><button key={node.id} onClick={()=>navigate(node.id)}><i style={{background:colors[getDiveNode(node.id)?.domain??node.domain]}}/><span><strong>{node.title}</strong><small>{diveAncestors(node.id).slice(1,-1).map(n=>n.title).join(' / ')}</small></span><ArrowUpRight size={13}/></button>)}{!results.length&&<p className="empty-results">No matching concept.</p>}{results.length>limit&&<button className="text-button" onClick={()=>setLimit(n=>n+80)}>Show more results <ArrowRight size={12}/></button>}</div></>:<><button className="icon-button dialog-close" aria-label="Close atlas guide" onClick={()=>setGuide(false)}><X size={18}/></button><h1>Map of mathematics</h1><p>Click a subject to zoom in and center it. Its spiral branches then unfold with representative formulas. Main areas may have five choices; deeper levels have at most four. Keep choosing a branch to dive further. The book icon opens definitions and Wikipedia.</p><p>{(concepts.length-1).toLocaleString('en')} concepts. All concepts remain reachable through smaller subject groups. Connections explores sourced relationships; a connection is not necessarily a prerequisite.</p><div className="keyboard-hints"><span>Search <kbd>Ctrl / ⌘ K</kbd></span><span>Pan <kbd>Drag / arrows</kbd></span><span>Zoom <kbd>Scroll / + −</kbd></span><span>Fit map <kbd>0</kbd></span><span>Read a node <kbd>Shift + click</kbd></span></div><details className="source-list"><summary>Wikipedia sources</summary>{sources.map(source=><a key={source.article} href={articleUrl(source.article)} target="_blank" rel="noreferrer">{source.article}<ArrowUpRight size={11}/></a>)}</details><p className="source-footnote">Short Wikipedia excerpts link to their source and are attributed under <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>.</p></>}
    </section></div>}
  </div>;
}
