import katex from 'katex';

export const excerptLicense='Wikipedia introduction excerpts: CC BY-SA 4.0. Excerpts retain complete sentences; see the linked article and its revision history.';

const entities={nbsp:' ',thinsp:' ',ensp:' ',emsp:' ',amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",ndash:'–',mdash:'—',minus:'−',times:'×',hellip:'…',le:'≤',ge:'≥',ne:'≠',infin:'∞',prime:'′',alpha:'α',beta:'β',gamma:'γ',delta:'δ',epsilon:'ε',pi:'π',sigma:'σ',omega:'ω',shy:'',lang:'⟨',rang:'⟩',kappa:'κ',rarr:'→',sube:'⊆',sub:'⊂',Delta:'Δ',fnof:'ƒ',isin:'∈',tau:'τ',mu:'μ',xi:'ξ',Gamma:'Γ',lambda:'λ',and:'∧',lowast:'∗'};
function decodeEntities(text){
  return text.replace(/&(#x[\da-f]+|#\d+|\w+);/gi,(all,key)=>{
    if(key[0]==='#'){const code=key[1].toLowerCase()==='x'?parseInt(key.slice(2),16):Number(key.slice(1));return code>0&&code<=0x10ffff?String.fromCodePoint(code):all;}
    return entities[key]??all;
  });
}

// Keep inline notation when removing wiki markup: dropping it can turn a
// complete definition into "two matrices and are similar if".
function mathText(tex){
  try{
    tex=decodeEntities(tex).trim().replace(/\\+$/,'').trim().replace(/\\mbox\b/g,'\\text').replace(/\\(begin|end)\{align\*?\}/g,'\\$1{aligned}');
    let markup=katex.renderToString(tex,{output:'mathml',throwOnError:true,trust:false,strict:'ignore',maxExpand:1000,macros:{'\\R':'\\mathbb{R}','\\N':'\\mathbb{N}','\\Z':'\\mathbb{Z}','\\C':'\\mathbb{C}','\\Q':'\\mathbb{Q}','\\sgn':'\\operatorname{sgn}'}});
    markup=markup.replace(/<annotation\b[^>]*>[\s\S]*?<\/annotation>/g,'');
    const tree={name:'root',children:[]},stack=[tree];
    for(const token of markup.match(/<[^>]*>|[^<]+/g)??[]){
      if(token.startsWith('</')){stack.pop();continue;}
      if(token.startsWith('<')){
        const name=/^<([\w-]+)/.exec(token)?.[1];if(!name)continue;
        const node={name,children:[]};stack.at(-1).children.push(node);
        if(!token.endsWith('/>'))stack.push(node);
      }else stack.at(-1).children.push(decodeEntities(token));
    }
    function render(node){
      if(typeof node==='string')return node;
      const parts=node.children.map(render),[a='',b='',c='']=parts;
      if(node.name==='mfrac')return '('+a+')/('+b+')';
      if(node.name==='msub'||node.name==='munder')return a+'_('+b+')';
      if(node.name==='msup')return a+'^('+b+')';
      if(node.name==='mover')return /[¯ˉ‾]/.test(b)?'overline('+a+')':'overset('+b+','+a+')';
      if(node.name==='msubsup'||node.name==='munderover')return a+'_('+b+')^('+c+')';
      if(node.name==='msqrt')return '√('+parts.join('')+')';
      if(node.name==='mroot')return 'root['+b+']('+a+')';
      if(node.name==='mspace')return ' ';
      if(node.name==='mtable')return '['+parts.join('; ')+']';
      if(node.name==='mtr')return parts.join(', ');
      return parts.join('');
    }
    return render(tree).replace(/\s+/g,' ').trim();
  }catch{
    // Leave unsupported notation visible instead of deleting part of a sentence.
    return decodeEntities(tex).replace(/\\(?:displaystyle|textstyle)\b/g,'').replace(/\s+/g,' ').trim();
  }
}

export function stripTemplates(text){
  let out='';
  for(let i=0;i<text.length;i++){
    if(text.slice(i,i+2)!=='{{'){out+=text[i];continue;}
    let depth=1,end=i+2;const literalBraces=[0];
    for(;end<text.length&&depth;end++){
      if(text.slice(end,end+2)==='{{'){depth++;literalBraces.push(0);end++;}
      else if(text[end]==='{' )literalBraces[literalBraces.length-1]++;
      else if(text[end]==='}'&&literalBraces.at(-1)>0)literalBraces[literalBraces.length-1]--;
      else if(text.slice(end,end+2)==='}}'){depth--;literalBraces.pop();end++;}
    }
    const inside=text.slice(i+2,end-2),[name,...rawArgs]=inside.split('|'),key=name.trim().toLowerCase();
    const render=()=>{
      const args=rawArgs.map(a=>stripTemplates(a).replace(/^\s*\d+\s*=/,''));
      if(/^(?:math|mvar|mvar2|mvar3|mvar4|var|nowrap|nobr|small|larger|smaller|italic|bold|sup|sub|overline|overbar|serif|sans-serif|monospace)$/.test(key))return args.filter(a=>!/^\w+=/.test(a)).join(key.startsWith('mvar')?', ':'');
      if(/^(?:tmath|mvarf|maths)$/.test(key))return args[0]?mathText(args[0]):'';
      if(key==='lang'||key==='langx')return args[1]??'';
      if(key==='lang for')return (args[1]??'')+' ('+(args[2]??'')+(rawArgs.includes('paren=left')?'':')');
      if(key==='ipa')return args[1]??'';
      if(key==='harvs'){
        const fields=Object.fromEntries(args.filter(a=>a.includes('=')).map(a=>{const at=a.indexOf('=');return [a.slice(0,at).trim(),a.slice(at+1).trim()];}));
        const names=[fields.last,fields.last1,fields.last2,fields.last3].filter(Boolean);
        return names.join(', ')+(fields.year?' ('+fields.year+')':'');
      }
      if(/^harv(?:nb|txt|p)?$/.test(key)){const values=args.filter(a=>!a.includes('='));return values.slice(0,-1).join(', ')+' ('+values.at(-1)+')';}
      if(key==='math_theorem'||key==='math theorem')return (args.find(a=>/^\s*math_statement\s*=/.test(a))??'').replace(/^\s*math_statement\s*=/,'');
      if(key==='frac')return args.length>=2?'('+args[0]+')/('+args[1]+')':'1/('+args[0]+')';
      if(key==='sqrt')return '√('+(args[0]??'')+')';
      if(key==='nbsp'||key==='snd'||key==='spaced ndash')return ' ';
      if(key==='!')return '|';
      if(key==='=')return '=';
      return '';
    };
    out+=render();i=end-1;
  }
  return out;
}

function wikiLinks(text){
  let out='';
  for(let i=0;i<text.length;i++){
    if(text.slice(i,i+2)!=='[['){out+=text[i];continue;}
    let depth=1,end=i+2;
    for(;end<text.length&&depth;end++){
      if(text.slice(end,end+2)==='[['){depth++;end++;}
      else if(text.slice(end,end+2)===']]'){depth--;end++;}
    }
    const inside=text.slice(i+2,end-2),[target,...label]=inside.split('|');
    if(!/^(?:file|image|category):/i.test(target.trim()))out+=wikiLinks(label.length?label.join('|'):target.replace(/#.*$/,''));
    i=end-1;
  }
  return out;
}

function readIntro(raw){
  const math=[];
  // A few source revisions accidentally format the definition itself as a
  // heading. Keep that prose, while still excluding ordinary section headings.
  raw=raw.replace(/^\s*={2,6}\s*([^\n]{100,}?)\s*={2,6}\s*$/gm,'$1');
  raw=raw.split(/^\s*={2,6}[^\n]*={2,6}\s*$/m)[0];
  let text=raw.replace(/<!--[\s\S]*?-->/g,'').replace(/<ref\b[^>]*\/>/gi,'').replace(/<ref\b[^>]*>[\s\S]*?<\/ref>/gi,'').replace(/\{\|[\s\S]*?\|\}/g,'');
  // Floating HTML figures may contain their own sentences. They are captions,
  // not the article's introduction, just like [[File:...]] captions.
  const floating=/<div\b[^>]*(?:float\s*:\s*(?:right|left)|class\s*=\s*"(?:thumb|tright|tleft))[^>]*>/i;
  for(let match;(match=floating.exec(text));){
    const tags=/<\/?div\b[^>]*>/gi;tags.lastIndex=match.index;
    let depth=0,end=match.index;
    for(let tag;(tag=tags.exec(text));){depth+=tag[0].startsWith('</')?-1:1;if(!depth){end=tags.lastIndex;break;}}
    if(end===match.index)break;
    text=text.slice(0,match.index)+text.slice(end);
  }
  text=text.replace(/<math\b[^>]*>([\s\S]*?)<\/math>/gi,(_,tex)=>{
    // Wikipedia often places the sentence's punctuation inside the math tag.
    tex=tex.trim().replace(/(?:\\[,!;:]|\\(?:quad|qquad))\s*$/g,'').replace(/\\+$/,'').trim();
    const punctuation=/(?<![.\\])[.,;:!?]$/.exec(tex)?.[0]??'';
    const content=punctuation?tex.trim().slice(0,-1):tex;
    return '\uE000'+(math.push(mathText(content))-1)+'\uE001'+punctuation;
  });
  text=wikiLinks(text);
  text=stripTemplates(text);
  // Leading diagrams and maintenance templates are removed before deciding
  // where the introduction starts. Headings cannot become part of a definition.
  text=text.replace(/<\/?(?:span|small|sup|sub|br|div|p|i|b|u|s|var|section|nowiki|code|syntaxhighlight|pre|blockquote|center|em|strong|abbr)\b[^>]*>/gi,'').replace(/__[A-Z_]+__/g,'').replace(/'{2,5}/g,'').replace(/\[https?:[^\s\]]+\s*([^\]]*)\]/g,'$1');
  const list=/^\s*[*#]+/m.test(text);
  text=decodeEntities(text).replace(/^\s*:+[ \t]*/gm,'').replace(/^\s*[*#]+[ \t]*/gm,'; ').replace(/^\s*={2,6}[^\n]*={2,6}\s*$/gm,'').replace(/\(\s*\)/g,'').replace(/\s+/g,' ').replace(/:\s*; /g,': ').replace(/\s+([,;:.!?])/g,'$1').trim();
  text=text.replace(/(\d)\.{3}\s*\./g,'$1….'); // a decimal expansion, followed by its sentence's period
  if(list&&!/[.!?:;]$/.test(text))text+='.';
  return {text,math};
}
const restoreMath=(text,math)=>text.replace(/\uE000(\d+)\uE001/g,(_,index)=>math[Number(index)]);
export function plainIntro(raw){const {text,math}=readIntro(raw);return restoreMath(text,math);}

const segmenter=new Intl.Segmenter('en',{granularity:'sentence'});
const abbreviation=/\b(?:e\.g|i\.e|etc|vs|cf|resp|approx|Dr|Mr|Mrs|Prof|St|No|Vol|Fig)\.$/;
export function sentenceExcerpt(text){
  text=text.replace(/\s+/g,' ').trim();
  let sentence='';
  for(const part of segmenter.segment(text)){
    sentence+=part.segment;
    const candidate=sentence.trim();
    if(!/[.!?]["”’')\]]*$/.test(candidate)||/(?:…|\.{2,})["”’')\]]*$/.test(candidate))continue;
    const rest=text.slice(part.index+part.segment.length).trim();
    if(rest&&abbreviation.test(candidate))continue;
    if(rest&&/\b[A-Z]\.$/.test(candidate)&&!/^(?:A|An|As|At|Both|By|For|Here|However|If|In|It|Let|More|Note|On|One|Since|Such|The|Then|There|These|This|Thus|When|With)\b/.test(rest))continue;
    const prose=candidate.replace(/\[[^\[\]()]*\)|\([^\[\]()]*\]/g,''); // half-open intervals
    if((prose.match(/\(/g)??[]).length!==(prose.match(/\)/g)??[]).length)continue;
    if((prose.match(/\[/g)??[]).length!==(prose.match(/\]/g)??[]).length)continue;
    return candidate;
  }
  return '';
}

export function pageExcerpt(page){
  const raw=page.revisions?.[0]?.slots?.main?.content??'';
  // Render the cached revision when available, so inline formulas survive and
  // the source revision remains the one already recorded in the snapshot.
  if(!raw)return sentenceExcerpt(page.extract??'');
  let {text,math}=readIntro(raw);
  // Reviewed source punctuation, not a generic "add a dot" fallback: both
  // introductions already contain a complete independent clause.
  if(page.title==='SPIKE algorithm'&&text.endsWith('Ahmed Sameh'))text+='.';
  if(page.title==='Sum of squares'&&text.endsWith('occur in a number of contexts:'))text=text.slice(0,-1)+'.';
  return restoreMath(sentenceExcerpt(text),math);
}
