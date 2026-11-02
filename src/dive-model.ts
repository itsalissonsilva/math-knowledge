import {byId,concepts,connections,domainOrder,type Concept,type Formula} from './atlas-data.ts';
import {semanticBuckets,subjectLabel} from './semantic-branches.ts';
import {subjectRules} from './subject-rules.ts';
import {navigationOwner,navigationChildren} from './navigation-ownership.ts';

export interface DiveNode extends Concept {browsingGroup:boolean;sourceId:string}
type Rule={title:string;match:RegExp;formula?:string;condition?:string};
const registry=new Map<string,DiveNode>();
const primaryOwner=(id:string)=>navigationOwner.get(id);
const rules:Record<string,Rule[]>={
  foundations:[
    {title:'Sets & functions',match:/set|function|relation/i},
    {title:'Logic',match:/logic/i},
    {title:'Proof & reasoning',match:/proof|axiom/i},
    {title:'Categories & types',match:/.*/}],
  'linear-algebra':[
    {title:'Vectors & linear maps',match:/vector|linear transformation|linear system|coordinate|scalar|galilean/i,formula:'T(αu + βv) = αT(u) + βT(v)',condition:'A linear map preserves vector addition and scalar multiplication.'},
    {title:'Matrices & decompositions',match:/matri|determinant|row|woodbury|householder/i,formula:'A = UΣV*',condition:'Every finite complex matrix has a singular value decomposition with unitary U and V and nonnegative singular values.'},
    {title:'Geometry & inner products',match:/inner product|orthonormal|euclidean|quadratic|unit vector/i,formula:'⟨u, v⟩ = Σ uᵢvᵢ',condition:'This is the standard Euclidean inner product on real coordinate vectors.'},
    {title:'Tensors & spectral ideas',match:/.*/,formula:'Av = λv, v ≠ 0',condition:'An eigenvector of a square matrix is nonzero and changes by a scalar factor.'}],
  'abstract-algebra':[
    {title:'Groups & symmetry',match:/group|semigroup|binary operation/i,formula:'(ab)c = a(bc)',condition:'Associativity is one of the group axioms.'},
    {title:'Rings & fields',match:/ring|field|cayley/i,formula:'a(b + c) = ab + ac',condition:'Multiplication distributes over addition in rings and fields.'},
    {title:'Modules & representations',match:/module|representation|homological/i,formula:'ρ(gh) = ρ(g)ρ(h)',condition:'A group representation preserves multiplication as composition of linear maps.'},
    {title:'Operations & structures',match:/.*/,formula:'φ(a ⋆ b) = φ(a) ⋆ φ(b)',condition:'A homomorphism preserves the specified algebraic operation; the two operations belong to their respective structures.'}],
  geometry:[
    {title:'Shape & measurement',match:/euclidean|affine|projective|metric/i},
    {title:'Curvature & manifolds',match:/differential/i},
    {title:'Topology & continuity',match:/topology|fractal/i},
    {title:'Algebraic & discrete geometry',match:/.*/}],
  analysis:[
    {title:'Calculus & real analysis',match:/calculus|real analysis/i},
    {title:'Complex & harmonic analysis',match:/complex|harmonic/i},
    {title:'Measure & functional analysis',match:/measure|functional/i},
    {title:'Equations & mathematical physics',match:/.*/}],
  number:[
    {title:'Arithmetic & elementary theory',match:/arithmetic|elementary/i},
    {title:'Analytic number theory',match:/analytic/i},
    {title:'Algebraic number theory',match:/algebraic/i},
    {title:'Additive & geometric methods',match:/.*/}],
  probability:[
    {title:'Events & distributions',match:/foundation|distribution/i},
    {title:'Limit theorems',match:/limit/i},
    {title:'Stochastic processes',match:/process/i},
    {title:'Stochastic calculus',match:/.*/}],
  statistics:[
    {title:'Data & experimental design',match:/descriptive|multivariate|experimental/i},
    {title:'Inference & evidence',match:/inference|hypothesis|bayesian|theory/i},
    {title:'Models & regression',match:/model|regression|equation/i},
    {title:'Learning & computation',match:/.*/}],
  computation:[
    {title:'Algorithms',match:/algorithm/i},
    {title:'Computability & complexity',match:/computability|complexity/i},
    {title:'Information & coding',match:/information|coding/i},
    {title:'Optimization',match:/optimization/i},
    {title:'Numerical & computational methods',match:/.*/}],
  sets:[
    {title:'Sets, relations & maps',match:/operation|relation|function|union|intersection|complement|product|empty|subset|multiset/i},
    {title:'Infinity & cardinality',match:/cardinal|countab|ordinal|continuum|cantor|aleph|uncount/i},
    {title:'Axioms & foundations',match:/axiom|zfc|choice|paradox|class|theor/i},
    {title:'Universes & set constructions',match:/.*/}],
  logic:[
    {title:'Statements & quantifiers',match:/proposition|first.order|quantif|truth|connective|conjunction|disjunction|negation|implication|formula|sentence|variable|constant|biconditional/i},
    {title:'Proof, models & limits',match:/proof|model|complete|incomplete|gödel|semantic|syntactic|deduction|soundness/i},
    {title:'Nonclassical logics',match:/modal|temporal|nonclassical|intuition|many.valued|fuzzy|linear logic|paraconsistent/i},
    {title:'Logical systems & applications',match:/.*/}],
  categories:[
    {title:'Objects, morphisms & functors',match:/morphism|functor|definition|monomorphism|epimorphism|subobject|image/i},
    {title:'Universal constructions',match:/universal|limit|adjoint|yoneda|initial|terminal|product|exponential/i},
    {title:'Structured categories',match:/additive|abelian|enriched|monoidal|braided|closed|ribbon|compact|derived|triangulated/i},
    {title:'Toposes & higher categories',match:/.*/}],
  matrices:[
    {title:'Operations & transformations',match:/multiplication|addition|transpose|coordinate|inverse/i},
    {title:'Rank & decompositions',match:/rank|decomposition/i},
    {title:'Determinants & invariants',match:/determinant|trace|adjugate|pfaffian|polynomial/i},
    {title:'Matrix theorems & structure',match:/.*/}],
  calculus:[
    {title:'Single-variable calculus',match:/single.variable|logarithm|hyperbolic|limit/i},
    {title:'Multivariable & vector calculus',match:/multivariable|vector/i},
    {title:'Integration & approximation',match:/integr|sum|simpson|quadrature|newton.cotes|horn|method/i},
    {title:'Differential methods & variations',match:/.*/}],
  'differential-geometry':[
    {title:'Curves & surfaces',match:/curve|surface|winding|envelope|sine.gordon|liouville|tzitzeica/i},
    {title:'Manifolds & tangent spaces',match:/manifold|tangent|jet|bundle|hypercomplex|calabi|k3|stein/i},
    {title:'Forms & geometric structures',match:/form|symplectic|structure|connection|pseudogroup|parabolic|klein/i},
    {title:'Curvature & geometric analysis',match:/.*/}],
  groups:[
    {title:'Subgroups & quotients',match:/subgroup|quotient|coset|normal|sylow|transversal/i},
    {title:'Actions & representations',match:/action|representation|permutation|conjug|schur/i},
    {title:'Families of groups',match:/cyclic|abelian|finite|simple|solvable|nilpotent|lie|classical|borel|conway/i},
    {title:'Products & group structure',match:/.*/}],
  rings:[
    {title:'Ideals & quotient constructions',match:/ideal|quotient|radical|socle|localization/i},
    {title:'Polynomials & algebra',match:/polynomial|algebra|power series|characteristic|graded/i},
    {title:'Domains & factorization',match:/domain|factor|unit|noether|artinian/i},
    {title:'Ring structures & families',match:/.*/}],
  ...subjectRules
};
function originalChildren(id:string){
  if(id==='mathematics')return [...byId[id].children];
  if(id==='algebra')return ['elementary-algebra','abstract-algebra','algebraic-geometry','linear-algebra'];
  return [...(navigationChildren.get(id)??[])];
}
for(const node of concepts){
  let owner=node.id;const seen=new Set<string>();while(navigationOwner.get(owner)&&navigationOwner.get(owner)!=='mathematics'&&!seen.has(owner)){seen.add(owner);owner=navigationOwner.get(owner)!;}
  registry.set(node.id,{...node,parentId:primaryOwner(node.id)??null,domain:owner,children:[],browsingGroup:false,sourceId:node.id});
}
function representative(ids:string[],rule?:Rule):Formula[]{
  if(rule?.formula)return [{text:rule.formula,condition:rule.condition!}];
  const members=ids.map(id=>byId[id]),direct=members.find(node=>node?.origin==='curated'&&node.formulas.length)??members.find(node=>node?.formulas.length);
  const nested=direct??ids.flatMap(id=>byId[id]?.children??[]).map(id=>byId[id]).find(node=>node?.formulas.length);
  return nested?[{...nested.formulas[0],condition:'Representative idea from '+nested.title+'. '+nested.formulas[0].condition}]:[];
}
function registerGroup(id:string,parent:DiveNode,title:string,ids:string[],rule?:Rule){
  const formulas=representative(ids,rule);
  const group:DiveNode={...parent,id,title,parentId:parent.id,sourceId:parent.sourceId,children:[],browsingGroup:true,origin:'curated',summary:'Explore '+ids.slice(0,4).map(child=>byId[child]?.title??child).join(', ')+(ids.length>4?', and related concepts.':'.'),formulas,formula:formulas[0]?.text,condition:formulas[0]?.condition,example:undefined,question:undefined,sourceOutline:undefined,sourceSection:undefined,descendants:ids.length,level:'Topic group'};
  registry.set(id,group);return group;
}
function attach(parent:DiveNode,ids:string[],primary:boolean){
  parent.children=ids;
  if(primary)for(const id of ids){const child=registry.get(id)!;if(child.browsingGroup||primaryOwner(id)===parent.sourceId)child.parentId=parent.id;}
}
function organize(parent:DiveNode,ids:string[],prefix:string,primary:boolean,allowThemes=true){
  const limit=!parent.browsingGroup&&domainOrder.includes(parent.id)&&parent.id!=='algebra'?5:4;
  if(ids.length<=limit){attach(parent,ids,primary);return;}
  let buckets:Array<{title:string;ids:string[];rule?:Rule}>=[];
  const availableThemes=allowThemes?rules[parent.sourceId]:undefined;
  const themes=availableThemes&&availableThemes.length>limit?[...availableThemes.slice(0,limit-1),{title:'Optimization & numerical methods',match:/.*/}]:availableThemes;
  if(themes){
    buckets=themes.map(rule=>({title:rule.title,ids:[] as string[],rule}));
    for(const id of ids){const title=byId[id].title;const index=themes.findIndex(rule=>rule.match.test(title));buckets[index<0?buckets.length-1:index].ids.push(id);}
    buckets=buckets.filter(bucket=>bucket.ids.length);
  }
  if(buckets.length<2){
    const avoid:string[]=[];let ancestor:DiveNode|undefined=parent;
    while(ancestor){avoid.push(ancestor.title);ancestor=ancestor.parentId?registry.get(ancestor.parentId):undefined;}
    buckets=semanticBuckets(ids,avoid,Math.min(limit,4));
  }
  const usedLabels:string[]=[];
  const groupIds=buckets.map((bucket,index)=>{
    if(bucket.ids.length===1)return bucket.ids[0];
    const title=usedLabels.includes(bucket.title)?subjectLabel(bucket.ids,[parent.title,...usedLabels]):bucket.title;usedLabels.push(title);
    const id=prefix+(index?'.'+index:'.0'),group=registerGroup(id,parent,title,bucket.ids,bucket.rule);
    organize(group,bucket.ids,id,primary,false);return id;
  });
  attach(parent,groupIds,primary);
}
for(const node of concepts){const copy=registry.get(node.id)!;if(node.id==='mathematics')copy.children=originalChildren(node.id);else organize(copy,originalChildren(node.id),'v/'+node.id,true);}
for(const node of registry.values())if(!node.browsingGroup&&!node.formulas.length&&node.children.length){const formulas=representative(originalChildren(node.id));if(formulas.length)node.formulas=formulas;}
const referenceRoots=new Map<string,string>();
export function referenceNode(id:string){
  const source=getDiveNode(id)?.sourceId??id,known=referenceRoots.get(source);if(known)return known;
  const original=registry.get(source);if(!original)return null;
  const seen=new Set<string>(),ids=connections(source,['foundation','connection','reference','classification']).map(edge=>edge.source===source?edge.target:edge.source).filter(target=>{if(target==='mathematics'||target===source||seen.has(target))return false;seen.add(target);return true;});
  if(!ids.length)return null;
  const rootId='r/'+source,root=registerGroup(rootId,original,'Connections to '+original.title,ids);
  root.parentId=id;root.summary='Wikipedia references and mathematical bridges connected to '+original.title+'. A connection does not necessarily mean a prerequisite.';
  referenceRoots.set(source,rootId);organize(root,ids,'rv/'+source,false);return rootId;
}
export function getDiveNode(id:string):DiveNode|undefined{
  if(registry.has(id))return registry.get(id);
  if(id.startsWith('r/'))referenceNode(id.slice(2));
  else if(id.startsWith('rv/'))referenceNode(id.slice(3).split('.')[0]);
  return registry.get(id);
}
export function diveChildren(id:string){return getDiveNode(id)?.children.map(child=>getDiveNode(child)!).filter(Boolean)??[];}
export function diveAncestors(id:string){
  const result:DiveNode[]=[],seen=new Set<string>();let node=getDiveNode(id);
  while(node&&!seen.has(node.id)){seen.add(node.id);result.unshift(node);node=node.parentId?getDiveNode(node.parentId):undefined;}
  return result;
}
export function diveEntries(){return [...registry.values()];}
