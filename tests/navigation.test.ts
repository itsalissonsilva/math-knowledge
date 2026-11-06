import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {spiralOffsets,centeredCamera,project,spiralCurve,motionFrame,branchProgress,FOCUS_MS,SPROUT_MS,BRANCH_STAGGER_MS} from '../src/layout.ts';
const snapshot=JSON.parse(await readFile(new URL('../public/wikipedia-catalog.json',import.meta.url),'utf8'));
const learning=JSON.parse(await readFile(new URL('../public/wikipedia-learning.json',import.meta.url),'utf8'));
const previousFetch=globalThis.fetch;
globalThis.fetch=async(url)=>new Response(JSON.stringify(String(url).includes('wikipedia-learning')?learning:snapshot));
const atlas=await import('../src/atlas-data.ts');
const nav=await import('../src/dive-model.ts');
const scene=await import('../src/dive-scene.ts');
globalThis.fetch=previousFetch;

test('main areas allow five choices while every deeper subject has at most four',()=>{
  for(const node of nav.diveEntries()){
    const max=node.id==='mathematics'?9:!node.browsingGroup&&atlas.domainOrder.includes(node.id)?5:4;
    assert.ok(node.children.length<=max,node.title+' has too many choices: '+node.children.length);
  }
  assert.deepEqual(new Set(nav.diveChildren('algebra').map(node=>node.id)),new Set(['elementary-algebra','abstract-algebra','algebraic-geometry','linear-algebra']));
  assert.equal(nav.diveChildren('computation').length,5);
  assert.equal(nav.diveChildren('number').length,5);
  assert.equal(nav.diveChildren('probability').length,5);
});
test('small browsing groups retain every Wikipedia concept without creating navigation cycles',()=>{
  const reached=new Set<string>(),stack=['mathematics'];
  while(stack.length){const id=stack.pop()!;if(reached.has(id))continue;reached.add(id);const node=nav.getDiveNode(id);assert.ok(node,'Missing navigation node '+id);stack.push(...node.children);}
  for(const node of atlas.concepts){
    assert.ok(reached.has(node.id),'Lost Wikipedia concept '+node.title);
    const path=nav.diveAncestors(node.id);
    assert.equal(path[0].id,'mathematics',node.title+' has no navigation ancestry');
    assert.equal(path[path.length-1].id,node.id);
    assert.equal(path.length,new Set(path.map(part=>part.id)).size);
  }
});
test('all four algebra branches and the linear-algebra subgroups have representative formulas with conditions',()=>{
  for(const parent of ['algebra','linear-algebra','abstract-algebra'])for(const node of nav.diveChildren(parent)){
    assert.ok(node.formulas.length,node.title+' has no formula');
    assert.ok(node.formulas[0].condition,node.title+' needs formula conditions');
  }
});

test('distance branches show their own typeset definitions, examples, and metric hypotheses',()=>{
  const nodes=nav.diveChildren('distance');
  assert.deepEqual(new Set(nodes.map(n=>n.id)),new Set(['wp-taxicab-geometry','wp-euclidean-distance','wp-hausdorff-distance']));
  for(const node of nodes){
    assert.ok(node.formulas[0].mathml?.includes('<math'),node.title+' needs a visible typeset formula');
    assert.ok(node.formulas[0].condition&&node.example,node.title+' needs assumptions and an example');
  }
  const hausdorff=nav.getDiveNode('wp-hausdorff-distance')!;
  assert.match(hausdorff.formulas[0].condition,/nonempty compact/);
  assert.ok(hausdorff.formulas[0].previewMathml,'The branch preview must retain a compact Hausdorff definition.');
  assert.ok(nav.diveAncestors('distance').some(n=>n.id==='metric-geometry'));
  assert.ok(nav.diveAncestors('wp-imaginary-unit').some(n=>n.id==='complex'));
});

test('calculus opens into its main subjects and related examples have precise homes',()=>{
  assert.deepEqual(nav.diveChildren('calculus').map(node=>node.id),[
    'single-variable','multivariable','vector-calculus','calculus-variations',
  ]);
  assert.deepEqual(nav.diveChildren('single-variable').map(node=>node.id),[
    'limits','derivatives','integrals','series',
  ]);
  for(const [child,parent] of [
    ['wp-table-of-limits','limits'],['wp-natural-logarithm','logarithms'],
    ['wp-gabriel-s-horn','improper-integrals'],['wp-gauss-hermite-quadrature','wp-gaussian-quadrature'],
    ['wp-gaussian-quadrature','numerical-integration'],['wp-heston-model','stochastic-de'],
    ['wp-chain-algebraic-topology','homology'],['wp-topological-abelian-group','wp-topological-group'],
  ]){
    const path=nav.diveAncestors(child).map(node=>node.id);
    assert.ok(path.includes(parent),child+' should be under '+parent);
    assert.deepEqual(scene.validPath(path,child),path);
  }
  assert.equal(scene.validPath(['mathematics','analysis','calculus','wp-table-of-limits'],'wp-table-of-limits'),null);
});

test('reference lists reveal source entries through the normal graph paths',()=>{
  const leaves=(id:string):ReturnType<typeof nav.diveChildren>=>{
    const children=nav.diveChildren(id);
    return children.length?children.flatMap(node=>leaves(node.id)):[nav.getDiveNode(id)!];
  };
  for(const id of Object.keys(atlas.wikipediaLists))assert.ok(nav.diveChildren(id).length,id);
  assert.ok(nav.diveChildren('wp-table-of-limits').some(node=>node.title==='Limits of elementary functions'));
  const sineLimit=leaves('wp-table-of-limits').find(node=>node.formulas[0]?.text.includes('\\frac{\\sin x}{x} = 1'));
  assert.ok(sineLimit?.formulas[0].mathml?.includes('<math'));
  const path=nav.diveAncestors(sineLimit.id).map(node=>node.id);
  assert.ok(path.includes('wp-table-of-limits'));
  assert.ok(scene.buildScene(scene.includePath([],path)).nodes.has(scene.pathKey(path)));
  assert.ok(leaves('wp-table-of-integrals').some(node=>node.wiki.startsWith('List of integrals of rational functions#')&&node.formulas[0]?.mathml));
  const divisors=leaves('wp-table-of-divisors');
  assert.equal(divisors.length,1000);
  assert.match(divisors.find(node=>node.title==='12')!.summary,/1, 2, 3, 4, 6, 12/);
  assert.ok(leaves('wp-alternative-set-theory').some(node=>node.title==='Morse–Kelley set theory'));
});

test('subject branches have meaningful distinct labels instead of alphabetic or unnamed overflow buckets',()=>{
  for(const node of nav.diveEntries()){
    if(node.browsingGroup)assert.ok(!/further concepts|further .*ideas|^[A-Z][–-][A-Z] topics|…/i.test(node.title),node.title);
    const groups=nav.diveChildren(node.id).filter(child=>child.browsingGroup);
    assert.equal(new Set(groups.map(child=>child.title)).size,groups.length,node.title+' has indistinguishable branch labels');
  }
});
test('three, four, and five spiral branches are balanced around the centered node on desktop and phone',()=>{
  for(const compact of [false,true])for(const count of [3,4,5]){
    const offsets=spiralOffsets(count,compact);
    assert.equal(offsets.length,count);
    assert.ok(Math.abs(offsets.reduce((sum,point)=>sum+point.x,0))<1e-8);
    assert.ok(Math.abs(offsets.reduce((sum,point)=>sum+point.y,0))<1e-8);
    assert.ok(offsets.some(point=>point.x>1)&&offsets.some(point=>point.x<-1));
    assert.ok(offsets.some(point=>point.y>1)&&offsets.some(point=>point.y<-1));
    if(count===4)for(let index=0;index<2;index++){
      assert.equal(offsets[index].x+offsets[index+2].x,0);
      assert.equal(offsets[index].y+offsets[index+2].y,0);
    }
  }
});
test('recursive dives center the exact selected node at every level and preserve the visited scene',()=>{
  const path=nav.diveAncestors('svd').map(node=>node.id),stages=scene.includePath([],path);
  for(const compact of [false,true]){
    const map=scene.buildScene(stages,compact);
    assert.equal([...map.nodes.values()].filter(node=>node.root).length,9);
    for(let index=2;index<=path.length;index++){
      const prefix=path.slice(0,index),point=map.nodes.get(scene.pathKey(prefix));assert.ok(point,'Missing dive '+prefix.join(' / '));
      const camera=centeredCamera(point.position,point.unit,nav.diveChildren(point.id).length,compact?390:1280,compact?786:652);
      assert.deepEqual(project(point.position,camera),{x:0,y:0});
      assert.ok(Number.isFinite(camera.zoom)&&camera.zoom>0);
    }
  }
});
test('camera focus finishes before any branches sprout and child stems animate in sequence',()=>{
  for(const count of [3,4,5]){
    const early=motionFrame(FOCUS_MS-1,count);assert.equal(early.phase,'focusing');assert.equal(early.bloom,0);
    for(let index=0;index<count;index++)assert.equal(branchProgress(early.bloom,index),0);
    assert.equal(motionFrame(FOCUS_MS,count).phase,'sprouting');
    const middle=motionFrame(FOCUS_MS+SPROUT_MS/2,count);
    assert.ok(branchProgress(middle.bloom,0)>branchProgress(middle.bloom,1));
    const end=motionFrame(FOCUS_MS+SPROUT_MS+(count-1)*BRANCH_STAGGER_MS,count);
    assert.equal(end.phase,'settled');assert.equal(end.focus,1);
    for(let index=0;index<count;index++)assert.equal(branchProgress(end.bloom,index),1);
  }
});
test('partial spiral geometry moves the branch tip along the same curve as the growing stem',()=>{
  const a={x:0,y:0},b={x:300,y:-180};
  const start=spiralCurve(a,b,0),middle=spiralCurve(a,b,.5),end=spiralCurve(a,b,1);
  assert.ok(start.path.includes(' C ')&&middle.path.includes(' C '));
  assert.deepEqual(end.end,b);
  assert.notDeepEqual(start.end,middle.end);assert.notDeepEqual(middle.end,b);
  for(const frame of [start,middle,end,spiralCurve(a,a,1)])assert.ok(!/NaN|Infinity/.test(frame.path));
});
test('sourced connections use small groups and can be entered without losing the source path',()=>{
  const computation=nav.referenceNode('computation');assert.ok(computation);assert.ok(nav.diveChildren(computation).length<=4);
  const root=nav.referenceNode('linear-algebra');assert.ok(root);
  assert.ok(nav.diveChildren(root).length<=4);
  const path=[...nav.diveAncestors('linear-algebra').map(node=>node.id),root];
  const map=scene.buildScene(scene.includePath([],path));
  assert.ok(map.nodes.has(scene.pathKey(path)));
  assert.equal(nav.getDiveNode(root)!.sourceId,'linear-algebra');
});
