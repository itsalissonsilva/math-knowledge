import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {overviewPositions} from '../src/layout.ts';
const snapshot=JSON.parse(await readFile(new URL('../public/wikipedia-catalog.json',import.meta.url),'utf8'));
const learning=JSON.parse(await readFile(new URL('../public/wikipedia-learning.json',import.meta.url),'utf8'));
const previousFetch=globalThis.fetch;
globalThis.fetch=async(url)=>new Response(JSON.stringify(String(url).includes('wikipedia-learning')?learning:snapshot));
const atlas=await import('../src/atlas-data.ts');
globalThis.fetch=previousFetch;

test('eight outer areas surround a foundations core, with substantial coverage in every area',()=>{
  assert.equal(atlas.domains.length,9);
  assert.deepEqual(new Set(atlas.byId.mathematics.children),new Set(atlas.domainOrder));
  assert.ok(atlas.concepts.length>5000,'Wikipedia coverage must not regress to a small hand-picked catalogue.');
  for(const domain of atlas.domains)assert.ok(domain.descendants>100,domain.title+': insufficient coverage');
  assert.deepEqual(overviewPositions.foundations,{x:0,y:0});
  for(const id of atlas.domainOrder.filter(id=>id!=='foundations'))assert.ok(Math.hypot(overviewPositions[id].x,overviewPositions[id].y)>=270);
});
test('every concept is reachable with a unique identifier, a valid parent, and no hierarchy cycle',()=>{
  assert.equal(new Set(atlas.concepts.map(node=>node.id)).size,atlas.concepts.length);
  for(const node of atlas.concepts){
    assert.ok(node.title&&node.summary&&node.wiki,node.id+': incomplete source record');
    const chain=atlas.ancestors(node.id);assert.equal(chain[0].id,'mathematics');
    assert.equal(chain.length,new Set(chain.map(parent=>parent.id)).size);
    if(node.parentId)assert.ok(atlas.byId[node.parentId].children.includes(node.id));
    assert.equal(new URL(atlas.articleUrl(node)).origin,'https://en.wikipedia.org');
  }
  assert.equal(atlas.byId.mathematics.descendants,atlas.concepts.length-1);
  assert.ok(Math.max(...atlas.concepts.map(node=>node.depth))>=6);
});
test('Wikipedia references and educational bridges are distinct, traceable, and cross all major areas',()=>{
  assert.ok(atlas.references.length>100000);
  for(const edge of atlas.relations){assert.ok(atlas.byId[edge.source]);assert.ok(atlas.byId[edge.target]);assert.notEqual(edge.source,edge.target);}
  for(const edge of atlas.references)assert.ok(edge.sourceArticle,'A source reference needs article provenance.');
  const cross=new Set(atlas.references.filter(edge=>atlas.byId[edge.source].domain!==atlas.byId[edge.target].domain).flatMap(edge=>[atlas.byId[edge.source].domain,atlas.byId[edge.target].domain]));
  for(const domain of atlas.domainOrder)assert.ok(cross.has(domain));
  assert.ok(atlas.teaching.some(edge=>edge.source==='svd'&&edge.target==='pca'));
  assert.ok(atlas.teaching.some(edge=>edge.source==='complex-analysis'&&edge.target==='analytic-number'));
});
test('deep subjects, annotated formulas, source excerpts, and search remain available',()=>{
  assert.ok(atlas.ancestors('svd').some(node=>node.id==='matrix-decompositions'));
  assert.ok(atlas.ancestors('h-eigenvalues').some(node=>node.id==='tensors'));
  assert.ok(atlas.ancestors('ricci-flow').some(node=>node.id==='geometry'));
  assert.ok(atlas.search('Reed–Solomon').length);assert.ok(atlas.search('Radon–Nikodym').length);
  assert.deepEqual(atlas.search('notamathematicalconceptrandomxyz'),[]);
  assert.ok(atlas.concepts.filter(node=>node.formulas.length).length>=4500,'Source equation coverage must remain substantial.');
  for(const node of atlas.concepts)for(const formula of node.formulas)assert.ok(formula.condition,node.id+': missing formula conditions');
  for(const page of atlas.sourcePages){
    assert.ok(/[.!?][\u201d"')\]]*$/.test(page.excerpt),page.title+': excerpt must finish a sentence');
    assert.ok(!/(?:…|\.{2,})[\u201d"')\]]*$/.test(page.excerpt),page.title+': excerpt must not be cut off');
  }
  assert.ok(atlas.sourceOutlines.every(source=>source.status==='read'),'Every selected subject source must resolve.');
});

test('every concept description is complete and the reported TAG note has no dangling clause',()=>{
  for(const node of atlas.concepts){
    assert.ok(/[.!?][\u201d"')\]]*$/.test(node.summary),node.title+': incomplete description');
    assert.ok(!/(?:…|\.{2,})[\u201d"')\]]*$/.test(node.summary),node.title+': truncated description');
    assert.ok(!/\{\{[a-z]|\[\[[a-z][^\[\]]*\||\uE000|\uE001/i.test(node.summary),node.title+': source markup leaked into the description');
  }
  const tag=atlas.byId['wp-topological-abelian-group'];
  assert.equal(tag.summary,'In mathematics, a topological abelian group, or TAG, is a topological group that is also an abelian group.');
  assert.ok(atlas.concepts.some(node=>node.origin==='wikipedia'&&node.summary.split(/\s+/).length>20),'A long definition must finish rather than stop at a word budget.');
});
