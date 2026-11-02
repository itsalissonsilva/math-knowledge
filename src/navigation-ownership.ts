import {byId,concepts,subjectMetadata} from './atlas-data.ts';

/** An outline's bullet indentation is source provenance, not always a useful
 * teaching hierarchy. Concrete Wikipedia categories refine browsing ownership. */
const destinations:Array<[RegExp,string]>=[
  [/cohomology theories|cohomology operations/i,'cohomology'],
  [/homology theory/i,'homology'],[/homotopy theory|spectra \(topology\)/i,'homotopy'],
  [/general topology|properties of topological spaces/i,'point-set-topology'],
  [/compactness \(mathematics\)/i,'compactness'],[/separation axioms/i,'separation-axioms'],
  [/knot theory|knots and links/i,'knot-theory'],[/differential topology/i,'differential-topology'],
  [/hyperbolic geometry/i,'hyperbolic-geometry'],[/spherical geometry/i,'spherical-geometry'],
  [/riemannian manifolds|riemannian geometry/i,'riemannian'],
  [/curvature \(mathematics\)/i,'curvature'],[/differential forms/i,'differential-forms'],
  [/metric spaces|uniform spaces/i,'metric-spaces'],[/norms \(mathematics\)/i,'norms'],
  [/inner product spaces|orthogonality/i,'inner-products'],
  [/matrix decompositions/i,'matrix-decompositions'],[/determinants/i,'determinants'],
  [/matrices|matrix theory/i,'matrices'],[/eigenvalues|spectral theory/i,'spectral-theory'],
  [/tensor|multilinear algebra/i,'tensors'],[/vector spaces|linear maps/i,'vector-spaces'],
  [/complex numbers|complex number systems/i,'complex'],
  [/group representations|representation theory of finite groups/i,'representations'],
  [/lie algebras/i,'lie-algebras'],[/lie groups/i,'lie-groups'],
  [/group actions/i,'group-actions'],[/subgroup properties/i,'subgroups'],
  [/group products|combinatorial group theory|properties of groups/i,'groups'],
  [/field extensions|galois theory/i,'galois'],[/finite fields/i,'finite-fields'],
  [/commutative algebra/i,'commutative-algebra'],[/ring theory/i,'rings'],
  [/polynomials/i,'polynomials'],[/algebraic curves/i,'algebraic-curves'],
  [/algebraic surfaces/i,'algebraic-geometry'],
  [/homological algebra/i,'homological-algebra'],[/category theory/i,'categories'],
  [/ordinal numbers/i,'ordinals'],[/cardinal numbers/i,'cardinality'],
  [/operations on sets/i,'set-operations'],[/model theory/i,'model-theory'],
  [/proof theory/i,'proof-theory'],[/type theory/i,'type-theory'],
  [/prime numbers|primality tests/i,'primes'],[/diophantine equations/i,'diophantine'],
  [/algebraic number theory/i,'algebraic-number'],[/analytic number theory/i,'analytic-number'],
  [/sequences and series/i,'series'],[/integration|integral calculus/i,'integrals'],
  [/differential calculus|derivatives/i,'derivatives'],[/measure theory/i,'measure'],
  [/banach spaces/i,'banach'],[/hilbert spaces/i,'hilbert'],
  [/operator theory/i,'operator-theory'],[/harmonic analysis|fourier analysis/i,'harmonic-analysis'],
  [/complex analysis|analytic functions|meromorphic functions/i,'complex-analysis'],
  [/graph coloring/i,'graph-coloring'],[/trees \(graph theory\)/i,'trees'],
  [/graph algorithms/i,'graph-algorithms'],[/graph invariants/i,'graph-basics'],
  [/graph operations/i,'graphs'],[/lattice theory/i,'lattices-order'],
  [/combinatorial designs/i,'designs-matroids'],[/matroid theory/i,'matroids'],
  [/generating functions/i,'generating-functions'],
  [/markov chains|markov processes/i,'markov'],[/martingale theory/i,'martingales'],
  [/wiener process/i,'brownian'],[/stochastic calculus/i,'stochastic-calculus'],
  [/single queueing nodes|queueing theory/i,'queueing'],
  [/normal distribution/i,'normal'],[/continuous distributions/i,'continuous-distributions'],
  [/discrete distributions/i,'discrete-distributions'],
  [/statistical deviation and dispersion/i,'dispersion'],[/means|averages/i,'central-tendency'],
  [/order statistics/i,'order-statistics'],[/statistical data types/i,'statistical-data'],
  [/bayesian statistics|bayesian inference/i,'bayesian-statistics'],
  [/regression analysis|least squares/i,'regression'],
  [/experimental design/i,'experimental-design'],
  [/medical statistics/i,'wp-medical-statistics'],[/spatial data analysis|geostatistics/i,'wp-geostatistics'],
  [/statistical hypothesis testing|statistical tests/i,'hypothesis'],
  [/estimation theory|estimators/i,'inference'],[/time series analysis/i,'time-series'],
  [/statistical classification|cluster analysis/i,'statistical-learning'],
  [/computational complexity/i,'complexity'],[/computability theory/i,'computability'],
  [/numerical integration/i,'numerical-integration'],[/numerical linear algebra/i,'numerical-linear'],
  [/numerical differential equations/i,'numerical-de'],
  [/convex optimization/i,'convex-optimization'],[/linear programming/i,'linear-programming'],
  [/coding theory/i,'coding-theory'],[/information theory/i,'information-theory']
];
const explicit:Record<string,string>={
  'wp-manifold':'differential-geometry',distance:'metric-geometry',
  'wp-euclidean-distance':'distance','wp-taxicab-geometry':'distance','wp-hausdorff-distance':'distance',
  'wp-imaginary-unit':'complex','wp-split-complex-number':'number-systems',
  'wp-polynomial-equation':'polynomials','wp-galilean-group':'lie-groups',
  'wp-cartesian-coordinate-system':'vector-spaces','wp-scalar-mathematics':'vector-spaces',
  'wp-poincare-half-plane-model':'hyperbolic-geometry','wp-poincare-metric':'hyperbolic-geometry',
  'wp-parametric-curve':'curves-surfaces','wp-parametric-surface':'curves-surfaces',
  'wp-monotone-convergence-theorem':'measure','wp-lagrange-inversion-theorem':'power-series',
  'wp-normal-convergence':'function-sequences','wp-radius-of-convergence':'power-series',
  'wp-0-999':'reals','wp-fixed-point-mathematics':'metric-spaces'
};
export const navigationOwner=new Map(concepts.map(node=>[node.id,node.parentId]));
for(const node of concepts){
  const proposed=explicit[node.id]??(node.origin==='wikipedia'?destinations.find(([pattern,target])=>target!==node.id&&byId[target]&&subjectMetadata[node.id]?.categories.some(category=>pattern.test(category)))?.[1]:undefined);
  if(!proposed||!byId[proposed]||proposed===node.id)continue;
  // Neither source ancestors nor category refinements may make a browsing cycle.
  let cursor:string|null=proposed;const seen=new Set<string>();
  while(cursor&&!seen.has(cursor)&&cursor!==node.id){seen.add(cursor);cursor=navigationOwner.get(cursor)??null;}
  if(cursor)continue;
  navigationOwner.set(node.id,proposed);
}
export const navigationChildren=new Map<string,string[]>();
for(const node of concepts){const owner=navigationOwner.get(node.id);if(owner){const ids=navigationChildren.get(owner)??[];ids.push(node.id);navigationChildren.set(owner,ids);}}
