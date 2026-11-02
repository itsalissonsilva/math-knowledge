/** Explicit educational bridges; Wikipedia article references are stored separately. */
export const bridges = `
sets|probability-foundations|foundation|Events and sample spaces are sets with an additional measure.
logic|proof|foundation|Proof methods rely on precise statements and inference.
functions|calculus|foundation|Limits and derivatives describe the behavior of functions.
relations|partial-orders|foundation|A partial order is a relation with specified axioms.
equivalence-relations|quotient-groups|foundation|A quotient identifies elements through an equivalence relation.
cardinality|countability|foundation|Countability distinguishes specific infinite cardinalities.
categories|algebraic-topology|connection|Functorial invariants compare spaces through algebraic objects.
categories|homological-algebra|connection|Chain complexes and derived functors are organized categorically.
type-theory|formal-verification|connection|Typed proof systems support machine-checked deductions.
lambda-calculus|computability|connection|Lambda calculus and Turing machines formalize equivalent notions of computation.
boolean|propositional-logic|connection|Boolean operations model classical truth-functional reasoning.
induction|recurrences|foundation|Induction proves claims about recursively defined sequences.
induction|algorithm-correctness|connection|Induction and invariants support algorithm correctness proofs.
integers|divisibility|foundation|Divisibility concerns integer multiples.
divisibility|primes|foundation|Prime factorization refines the divisibility structure of integers.
gcd|euclidean-algorithm|connection|The Euclidean algorithm computes greatest common divisors.
modular|finite-fields|connection|Integers modulo a prime form a finite field.
groups|galois|foundation|Galois theory studies automorphism groups of field extensions.
fields|galois|foundation|Field extensions provide the objects of Galois theory.
groups|group-actions|foundation|Actions express groups through transformations of other objects.
group-actions|permutation-groups|connection|An action on a finite set yields a permutation representation.
group-actions|isometries|connection|Isometry groups encode geometric symmetries.
lie-groups|differential-geometry|connection|A Lie group is both a smooth manifold and an algebraic group object.
lie-algebras|differential-equations|connection|One-parameter flows relate infinitesimal generators to continuous evolution.
linear-algebra|representations|foundation|Representations realize abstract structures by linear maps.
linear-algebra|functional-analysis|foundation|Functional analysis extends linear geometry to infinite-dimensional spaces.
inner-products|hilbert|foundation|Hilbert spaces are complete inner product spaces.
norms|banach|foundation|Banach spaces are complete normed vector spaces.
metric-spaces|point-set-topology|connection|Every metric induces a topology, although not every topology is metrizable.
compactness|extreme-value|connection|Continuous real functions attain extrema on nonempty compact spaces.
topological-continuity|limits|connection|Topological continuity generalizes metric and real-variable definitions.
linear-maps|matrices|foundation|Matrices represent linear maps after bases are chosen.
linear-independence|basis|foundation|A basis combines independence with spanning.
basis|change-of-basis|foundation|Changing coordinates compares two bases of the same space.
inner-products|projections|foundation|Orthogonal projection uses an inner product to measure the remainder.
projections|least-squares|connection|Least-squares residuals are orthogonal to the fitted subspace in the standard linear setting.
matrix-decompositions|numerical-linear|connection|Numerical solvers exploit structured matrix factorizations.
svd|pca|connection|The SVD of a centered data matrix gives principal component directions.
eigenvalues|spectral-graph|connection|Adjacency and Laplacian spectra reveal graph structure.
matrices|markov|connection|Transition matrices encode finite-state Markov chain probabilities.
eigenvalues|stability|connection|Linearization eigenvalues give local stability information under the relevant hypotheses.
tensor-product|quantum-mathematics|connection|Composite quantum state spaces use tensor products of Hilbert spaces.
ideals|algebraic-geometry|connection|Polynomial ideals encode algebraic zero sets.
commutative-algebra|schemes|foundation|Commutative rings supply local coordinate data for schemes.
algebraic-geometry|algebraic-number|connection|Schemes and algebraic curves also encode arithmetic problems.
elliptic-curves|elliptic-crypto|connection|Finite-field elliptic curve groups support cryptographic constructions.
primes|rsa|foundation|RSA arithmetic uses a modulus built from suitable large primes.
complex-analysis|analytic-number|connection|Complex functions and their zeros encode arithmetic information.
zeta|prime-number-theorem|connection|The analytic behavior of the zeta function controls prime-counting asymptotics.
geometry-of-numbers|convex-sets|connection|Convex geometry supplies existence arguments for lattice points.
linear-algebra|lattices|foundation|A lattice uses integer combinations of linearly independent vectors.
counting|combinations|foundation|Counting principles distinguish unordered selections from ordered arrangements.
combinations|binomial|connection|Binomial coefficients count the success arrangements in a binomial distribution.
generating-functions|partitions-integers|connection|Generating function coefficients count integer partitions.
probability-basics|probabilistic-method|connection|A positive probability of success proves that a combinatorial object exists.
graphs|network-flows|foundation|Flow models add capacities and conservation to directed graphs.
network-flows|linear-programming|connection|A maximum-flow problem has a linear-programming formulation and dual cut problem.
graphs|planar-graphs|foundation|Planarity adds an embedding constraint to an abstract graph.
planar-graphs|euler-characteristic|connection|Planar embeddings connect vertex–edge–face counts to surface topology.
matroids|greedy-algorithms|connection|Matroid structure explains when a standard greedy optimization scheme is guaranteed to work.
trees|minimum-spanning|foundation|A minimum spanning tree optimizes weight among spanning trees.
homotopy|fundamental-group|foundation|The fundamental group identifies loops up to based homotopy.
chain-complexes|homology|foundation|Homology is computed as cycles modulo boundaries in a chain complex.
homology|persistent-homology|foundation|Persistent homology tracks homology classes through a filtration.
graphs|simplicial-complexes|connection|Simplicial complexes extend vertices and edges to higher-dimensional simplices.
differential-geometry|differential-topology|connection|Both study smooth manifolds, with different emphasis on geometric structure.
curvature|gauss-bonnet|connection|Gauss–Bonnet relates curvature integrals to topological invariants.
ricci-flow|geometrization|connection|Ricci flow with surgery played a central role in the proof of geometrization.
vector-bundles|gauge-theory|connection|Connections on bundles provide the geometric language of gauge fields.
limits|derivatives|foundation|The derivative is defined by a limit of difference quotients.
derivatives|integrals|connection|The fundamental theorem of calculus links differentiation and integration.
derivatives|taylor|foundation|Taylor approximations use derivatives of increasing orders.
series|power-series|foundation|Power series are series whose terms depend on powers of a variable.
uniform-convergence|function-sequences|connection|Uniform convergence supports stronger interchange results than pointwise convergence alone.
measure|probability|connection|A probability measure is a measure with total mass one.
lebesgue-integral|expectation|connection|Expectation is integration with respect to a probability measure when defined.
dominated-convergence|probability-limits|connection|Domination can justify exchanging limits and expectations.
multiple-integrals|joint-distributions|connection|Joint densities assign probabilities through integrals over multivariable regions.
conditional|bayes|foundation|Bayes’ theorem rearranges conditional probability identities.
bayes|bayesian-statistics|foundation|Bayesian inference uses conditional updates of probability distributions.
expectation|law-large-numbers|connection|Laws of large numbers relate averages to expected values under their assumptions.
normal|central-limit|connection|Normal distributions occur as limits of many centered, scaled sums.
markov|mcmc|foundation|MCMC constructs a Markov chain with the desired invariant distribution.
martingales|stochastic-calculus|foundation|Martingales are central to the definition and analysis of stochastic integrals.
brownian|ito-integral|foundation|Brownian motion is a principal integrator in Itô calculus.
stochastic-de|diffusion-processes|connection|Suitable stochastic differential equations generate diffusion processes.
diffusion-processes|heat-equation|connection|Diffusion transition densities are related to parabolic partial differential equations.
sampling|inference|foundation|The sampling model controls what inferential conclusions are justified.
likelihood|maximum-likelihood|foundation|Maximum-likelihood estimation optimizes the likelihood as a parameter function.
conditional|p-values|connection|P-values are probabilities computed under a specified null model.
regression|causal-inference|connection|A regression model alone does not establish a causal interpretation.
least-squares|optimization|connection|Least squares is an optimization objective with useful algebraic structure.
regularization|convex-optimization|connection|Many common regularized estimation problems are convex programs.
entropy|information-theory|connection|Shannon entropy is a central measure of source uncertainty.
expectation|entropy|foundation|Discrete entropy is the expectation of information content when finite.
finite-fields|linear-codes|foundation|Linear codes are vector subspaces over finite fields.
polynomials|reed-solomon|foundation|Reed–Solomon codes use evaluations of finite-field polynomials.
fourier|signal-processing|connection|Frequency representations expose filtering and periodic structure in signals.
complex|fourier-transform|foundation|Complex exponentials provide Fourier frequency kernels.
fourier-transform|convolution|connection|Fourier transforms turn suitable convolutions into products.
fourier-series|wave-equation|connection|Fourier expansions can solve wave equations with suitable domains and boundary conditions.
sobolev|weak-solutions|foundation|Weak derivatives and Sobolev spaces provide natural settings for many weak PDE formulations.
differential-forms|stokes-theorem|foundation|Stokes’ theorem integrates exterior derivatives of differential forms.
calculus-variations|lagrangian-mechanics|connection|Stationary action leads to Euler–Lagrange equations.
symplectic-geometry|hamiltonian-mechanics|connection|Hamiltonian dynamics are generated by a symplectic structure and a Hamiltonian function.
groups|noether|connection|Continuous symmetry groups yield conservation laws through Noether’s theorem.
hilbert|self-adjoint|foundation|Self-adjoint operators act on Hilbert spaces with careful domain conditions.
spectral-theorem|quantum-mathematics|connection|Spectral decompositions describe quantum observables in the operator formulation.
curvature|einstein-equations|connection|Einstein’s equations compare spacetime curvature with stress-energy.
convex-sets|convex-optimization|foundation|Convex feasible sets are part of a convex optimization problem.
gradient|gradient-descent|foundation|Gradient descent chooses a direction from first derivative information.
lagrange-multipliers|kkt|connection|KKT conditions extend multiplier ideas to inequality-constrained problems.
duality|linear-programming|connection|Linear programming has a particularly strong and useful primal–dual theory.
game-theory|linear-programming|connection|Finite two-player zero-sum games can be solved through linear programs.
probability|queueing|foundation|Queueing models require distributions for arrivals and service mechanisms.
dynamic-programming|optimal-control|connection|Bellman’s principle relates dynamic programming to sequential optimal control.
control-theory|ode-systems|connection|State-space control models are often systems of differential equations.
algorithms|complexity|foundation|Complexity measures the resources needed to solve computational problems.
computability|incompleteness|connection|Computability and formal provability have related limitations, although the theorems make distinct claims.
derivatives|newton-method|foundation|Newton’s method uses a local derivative to compute its tangent correction.
conditioning|numerical-linear|connection|Sensitivity of linear systems affects achievable numerical accuracy.
numerical-integration|integrals|connection|Quadrature approximates definite integrals through weighted evaluations.
finite-elements|weak-solutions|connection|Finite elements discretize variational or weak formulations of differential equations.
discrete-fourier|fft|connection|The FFT is an algorithm for evaluating a discrete Fourier transform.
`;
