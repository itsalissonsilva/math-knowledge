import type {Formula} from './atlas-data';
import {useLayoutEffect,useRef,useState} from 'react';

/** Source MathML is generated locally by KaTeX with trust:false, never page HTML. */
export default function MathExpression({formula,compact=false}:{formula:Formula;compact?:boolean}){
  const frame=useRef<HTMLSpanElement>(null),content=useRef<HTMLSpanElement>(null),[scale,setScale]=useState(1),html=compact?(formula.previewMathml??formula.mathml):formula.mathml;
  useLayoutEffect(()=>{
    if(!html||!frame.current||!content.current)return;
    const fit=()=>{const available=frame.current!.clientWidth,natural=Math.max(content.current!.scrollWidth,content.current!.getBoundingClientRect().width)/scale;if(available>0&&natural>0){const next=Math.max(compact?.45:.8,Math.min(1,(available-2)/natural));if(Math.abs(next-scale)>.015)setScale(next);}};
    fit();const observer=new ResizeObserver(fit);observer.observe(frame.current);return()=>observer.disconnect();
  },[html,scale,compact]);
  return <span ref={frame} className={'math-expression'+(html?' typeset-math':'')}>{html?<span ref={content} style={{fontSize:scale+'em'}} dangerouslySetInnerHTML={{__html:html}}/>:formula.text}</span>;
}
