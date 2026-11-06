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
  [/^Sequences and series$/i,'series'],
  [/^Numerical integration$/i,'numerical-integration'],
  [/^(?:Integral calculus|Definitions of mathematical integration)$/i,'integrals'],
  [/^(?:Differential calculus|Derivatives \(mathematics\))$/i,'derivatives'],
  [/measure theory/i,'measure'],
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
  'wp-0-999':'reals','wp-fixed-point-mathematics':'metric-spaces',

  // Use the mathematical subject as the primary home for examples and tables.
  'wp-table-of-limits':'limits',
  'wp-table-of-integrals':'integrals',
  'wp-natural-logarithm':'logarithms',
  'wp-prime-pages':'primes',
  'wp-mathematical-constant-sorted-by-continued-fraction-representation':'number-systems',
  'wp-gabriel-s-horn':'improper-integrals',
  'wp-archimedes-use-of-infinitesimals':'integrals',
  'wp-indeterminate-form':'limits',
  'wp-orders-of-approximation':'numerical-errors',
  'wp-darboux-s-theorem-analysis':'derivatives',
  'wp-hyperbolic-angle':'wp-hyperbolic-function',
  'wp-tangent-half-angle-substitution':'substitution',
  'wp-trigonometric-substitution':'substitution',
  'wp-quadratic-integral':'wp-partial-fractions-in-integration',
  'wp-disk-integration':'wp-solid-of-revolution',
  'wp-shell-integration':'wp-solid-of-revolution',
  'wp-iterated-integral':'multiple-integrals',
  'wp-anderson-s-theorem':'measure',
  'wp-square-integrable-function':'lp-spaces',
  'wp-chain-algebraic-topology':'homology',
  'wp-differentiable-structure':'differential-topology',
  'wp-submersion-mathematics':'differential-topology',
  'wp-directional-derivative':'multivariable',
  'wp-regiomontanus-angle-maximization-problem':'optimization',
  'wp-laplace-transform-applied-to-differential-equations':'differential-equations',
  'wp-euler-poisson-darboux-equation':'pde',
  'wp-several-complex-variables':'complex-analysis',

  // Keep specialist numerical methods, stochastic calculus, and their examples together.
  'wp-eigenvalue-perturbation':'eigenvalue-algorithms',
  'wp-linear-approximation':'derivatives',
  'wp-numerical-differentiation':'numerical',
  'wp-adaptive-simpson-s-method':'wp-simpson-s-rule',
  'wp-bulirsch-stoer-algorithm':'numerical-de',
  'wp-euler-maclaurin-formula':'wp-asymptotic-analysis',
  'wp-asymptotic-analysis':'real-analysis',
  'wp-malliavin-calculus':'stochastic-calculus',
  'wp-stratonovich-integral':'stochastic-calculus',
  'wp-risk-neutral-measure':'martingales',
  'wp-local-volatility':'stochastic-de',
  'wp-heston-model':'stochastic-de',
  'wp-topological-group':'groups',
  'wp-topological-abelian-group':'wp-topological-group',

  taylor:'power-series',
  'uniform-convergence':'function-sequences',
  'wp-integral-test-for-convergence':'series-tests',
  'wp-limit-of-a-sequence':'sequences',
  'wp-subsequential-limit':'wp-limit-of-a-sequence',
  'wp-farey-sequence':'fractions',
  'wp-low-discrepancy-sequence':'wp-quasi-monte-carlo-method',
  'wp-halton-sequences':'wp-low-discrepancy-sequence',
  'wp-random-sequence':'stochastic-processes',
  'wp-stationary-sequence':'stationary-processes',
  'wp-sequence-space':'wp-function-space',
  'wp-function-space':'functional-analysis',
  'wp-pade-approximant':'wp-approximation-theory'
};
export const navigationOwner=new Map(concepts.map(node=>[node.id,node.parentId]));
for(const node of concepts){
  const reviewedParent=explicit[node.id];
  const proposed=reviewedParent??(node.origin==='wikipedia'?destinations.find(([pattern,target])=>target!==node.id&&byId[target]&&subjectMetadata[node.id]?.categories.some(category=>pattern.test(category)))?.[1]:undefined);
  if(!proposed||!byId[proposed]||proposed===node.id)continue;
  // Keep precise quadrature families, such as Gauss–Hermite under Gaussian quadrature.
  if(!reviewedParent&&proposed==='numerical-integration'&&node.parentId&&
    subjectMetadata[node.parentId]?.categories.includes('Numerical integration'))continue;
  // Neither source ancestors nor category refinements may make a browsing cycle.
  let cursor:string|null=proposed;const seen=new Set<string>();
  while(cursor&&!seen.has(cursor)&&cursor!==node.id){seen.add(cursor);cursor=navigationOwner.get(cursor)??null;}
  if(cursor)continue;
  navigationOwner.set(node.id,proposed);
}
export const navigationChildren=new Map<string,string[]>();
for(const node of concepts){const owner=navigationOwner.get(node.id);if(owner){const ids=navigationChildren.get(owner)??[];ids.push(node.id);navigationChildren.set(owner,ids);}}
