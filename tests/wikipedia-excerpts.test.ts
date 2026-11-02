import {test} from 'node:test';
import assert from 'node:assert/strict';
import {pageExcerpt,sentenceExcerpt} from '../scripts/wikipedia-excerpts.mjs';

const source=(content:string,title='Fixture')=>({title,revisions:[{slots:{main:{content}}}]});

test('a definition stops at a complete sentence instead of a 20-word cutoff',()=>{
  const definition='In mathematics, a topological abelian group, or TAG, is a topological group that is also an abelian group.';
  assert.equal(pageExcerpt(source(definition+' That is, a TAG is both a group and a topological space.')),definition);
  const longer='In mathematics, an axiom schema is a rule or template that specifies a family of axioms, with placeholders and conditions describing their permitted replacements.';
  assert.ok(longer.split(/\s+/).length>20);
  assert.equal(pageExcerpt(source(longer+' More background follows.')),longer);
  assert.equal(sentenceExcerpt('In mathematics, a group is a'),'');
});

test('sentence boundaries respect abbreviations, decimals, and parentheses',()=>{
  const text='A value, e.g. 3.14 (an approximation), can be used here.';
  assert.equal(sentenceExcerpt(text+' The next sentence is outside the excerpt.'),text);
  assert.equal(sentenceExcerpt('A theorem due to Charles G. Broyden applies. More follows.'),'A theorem due to Charles G. Broyden applies.');
  assert.equal(sentenceExcerpt('This axiom was proposed by W. Hugh Woodin. More follows.'),'This axiom was proposed by W. Hugh Woodin.');
  assert.equal(sentenceExcerpt('The equation holds on U. This is followed by unfinished prose'),'The equation holds on U.');
});

test('inline mathematics and punctuation inside math tags survive in definitions',()=>{
  assert.equal(pageExcerpt(source('Two matrices <math>A</math> and <math>B</math> are similar if <math>B=P^{-1}AP.</math> Next sentence.')),'Two matrices A and B are similar if B=P^(−1)AP.');
  assert.equal(pageExcerpt(source('A pair satisfies <math>x &lt; y</math>. More follows.')),'A pair satisfies x<y.');
  assert.equal(pageExcerpt(source('An estimator <math>\\delta^M \\,\\!</math> minimizes the worst-case risk. Next sentence.')),'An estimator δ^(M) minimizes the worst-case risk.');
});

test('nested image links and infobox notation cannot replace the definition',()=>{
  assert.equal(pageExcerpt(source('{{Infobox|notation={{math|{x}×{ }}}}}\n[[File:Picture.svg|thumb|A [[caption]].]]\nA prism is a polyhedron.\n\n==Examples==\nOther text.')),'A prism is a polyhedron.');
  assert.equal(pageExcerpt(source('An {{math|1=\'\'n\'\'}}-gon has n sides.')),'An n-gon has n sides.');
  assert.equal(pageExcerpt(source('<div style="float: right"><div>A caption.</div><div>Another caption.</div></div>\nA likelihood ratio compares two densities.')),'A likelihood ratio compares two densities.');
});

test('complete introductory lists are retained, and unfinished source prose is rejected',()=>{
  assert.equal(pageExcerpt(source('A term may refer to:\n*First meaning\n*Second meaning')),'A term may refer to: First meaning; Second meaning.');
  assert.equal(pageExcerpt(source('This theorem states the following:')),'');
});
