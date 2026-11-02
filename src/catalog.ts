/** Curated hierarchy. A parent means “study within”, never “must learn before”. */
export interface Entry { id: string; title: string; wiki: string; summary: string; parentId: string | null; formula?: string; condition?: string }
export const catalog: Entry[] = [];
function add(parentId: string | null, id: string, title: string, wiki: string, summary: string, formula?: string, condition?: string) {
  catalog.push({ parentId,id,title,wiki,summary,formula,condition });
}
function children(parent: string, text: string) {
  for (const line of text.trim().split('\n').map(s=>s.trim()).filter(Boolean)) {
    const [id,title,wiki,summary,formula,condition] = line.split('|');
    add(parent,id,title,wiki,summary,formula,condition);
  }
}
function section(parent: string, id: string, title: string, wiki: string, summary: string, text: string) {
  add(parent,id,title,wiki,summary); children(id,text);
}
add(null,'mathematics','Mathematics','Mathematics','The study of quantity, structure, space, change, and mathematical reasoning. Foundations sit inside this map; the other fields unfold around them.');
children('mathematics',`
foundations|Foundations|Foundations_of_mathematics|The languages, assumptions, and methods that let mathematics make precise claims.
arithmetic|Arithmetic|Arithmetic|Numbers, operations, and the passage from counting to general numerical systems.
algebra|Algebra|Algebra|Equations and structures governed by operations, symmetry, and transformations.
number|Number theory|Number_theory|Divisibility, prime numbers, and arithmetic patterns in integers and larger number systems.
analysis|Analysis|Mathematical_analysis|Limits, continuity, differentiation, integration, and infinite processes.
geometry|Geometry|Geometry|Shapes and spaces, from Euclidean measurements to curved and algebraic spaces.
topology|Topology|Topology|Continuity, connectedness, holes, and properties invariant under homeomorphism.
discrete|Discrete mathematics|Discrete_mathematics|Counting, finite structures, networks, order, and combinatorial existence.
probability|Probability|Probability_theory|Mathematical models of randomness, distributions, and stochastic evolution.
statistics|Statistics|Statistics|Learning about populations and models from incomplete, variable observations.
dynamics|Differential equations|Differential_equation|Equations for unknown functions and the evolving systems they describe.
optimization|Optimization|Mathematical_optimization|Finding best feasible choices and understanding the geometry of decisions.
computation|Computation|Computational_mathematics|Algorithms, computability, complexity, and reliable numerical approximation.
information|Information & coding|Information_theory|Quantifying uncertainty, transmitting information, and protecting mathematical communication.
math-physics|Mathematical physics|Mathematical_physics|Mathematical structures for mechanics, fields, quantum theory, and spacetime.
`);

section('foundations','sets','Set theory','Set_theory','Collections, membership, constructions, and the sizes of infinite sets.',`
set-operations|Set operations|Algebra_of_sets|Union, intersection, difference, and complement construct new sets from given sets.|A ∩ B = {x : x ∈ A and x ∈ B}|Intersection keeps precisely the common elements.
relations|Relations|Binary_relation|A relation records which ordered pairs satisfy a specified condition.|R ⊆ A × B|A binary relation from A to B is a subset of their Cartesian product.
functions|Functions & relations|Function_(mathematics)|Functions assign one output to every input in their domain.
equivalence-relations|Equivalence relations|Equivalence_relation|Reflexive, symmetric, transitive relations partition a set into equivalence classes.
cardinality|Cardinality|Cardinality|Bijections compare the sizes of finite and infinite sets.|A ∼ B ⇔ there exists a bijection A → B|Equal cardinality does not require the sets to have identical elements.
countability|Countability|Countable_set|A set is countable when it is finite or can be listed by the natural numbers.
ordinals|Ordinals|Ordinal_number|Ordinals describe order types of well-ordered sets and support transfinite induction.
zfc|ZFC axioms|Zermelo–Fraenkel_set_theory|A widely used axiomatic framework specifies which set constructions are available.
choice|Axiom of choice|Axiom_of_choice|A choice function selects an element from each member of a family of nonempty sets.
continuum-hypothesis|Continuum hypothesis|Continuum_hypothesis|The question asks whether a cardinal size lies strictly between the integers and the real numbers.
`);
section('foundations','logic','Mathematical logic','Mathematical_logic','Formal languages and the relationships between truth, proofs, and mathematical models.',`
propositional-logic|Propositional logic|Propositional_calculus|Combine truth-valued statements using connectives such as conjunction and implication.
first-order-logic|First-order logic|First-order_logic|Quantifiers range over individuals in a structure, while predicates express their properties.
quantifiers|Quantifiers|Quantifier_(logic)|Universal and existential quantifiers distinguish claims about every object from claims about some object.
model-theory|Model theory|Model_theory|Study structures satisfying formal theories and what their languages can express.
proof-theory|Proof theory|Proof_theory|Treat formal proofs as mathematical objects and study their transformations and strength.
completeness|Gödel’s completeness theorem|Gödel%27s_completeness_theorem|Every logically valid first-order sentence is provable in a complete proof system.
incompleteness|Incompleteness theorems|Gödel%27s_incompleteness_theorems|Sufficiently expressive consistent effectively axiomatized arithmetic theories cannot decide every arithmetic sentence.
nonclassical-logic|Nonclassical logics|Non-classical_logic|Alternative logical systems change principles such as excluded middle or the treatment of modality.
`);
section('foundations','proof','Proof methods','Mathematical_proof','Ways to establish a statement from assumptions, rather than infer it from a few examples.',`
direct-proof|Direct proof|Direct_proof|Deduce a conclusion by applying definitions and known results to the assumptions.
contradiction|Proof by contradiction|Proof_by_contradiction|Assume the negation of a claim and derive a contradiction with accepted assumptions.
contraposition|Contrapositive|Contraposition|Prove an implication by showing that the failure of its conclusion forces failure of its premise.|(p ⇒ q) ⇔ (¬q ⇒ ¬p)|This equivalence uses classical propositional logic.
induction|Mathematical induction|Mathematical_induction|A base case and an inductive step establish a statement over the natural numbers.
strong-induction|Strong induction|Mathematical_induction|An inductive step may use all earlier cases rather than just the immediately previous one.
structural-induction|Structural induction|Structural_induction|Prove properties of recursively built objects by following their construction rules.
counterexample|Counterexamples|Counterexample|One example violating a universal statement disproves that statement.
constructive-proof|Constructive proof|Constructive_proof|Establish existence by giving a construction or an effective way to obtain the object.
`);
section('foundations','categories','Category theory','Category_theory','Objects and composable arrows reveal common structure across different mathematical fields.',`
categories-definition|Categories & morphisms|Category_(mathematics)|A category has objects, identity arrows, and associative composition of arrows.
functors|Functors|Functor|A functor maps objects and arrows between categories while preserving identities and composition.
natural-transformations|Natural transformations|Natural_transformation|Compatible arrow families compare two functors without choosing coordinates.
universal-properties|Universal properties|Universal_property|Characterize an object through the unique ways other objects map to or from it.
limits-colimits|Limits & colimits|Limit_(category_theory)|Universal constructions collect compatible diagrams or glue their data together.
adjunctions|Adjoint functors|Adjoint_functors|An adjunction relates two functors through a natural correspondence between morphism sets.
yoneda|Yoneda lemma|Yoneda_lemma|An object can be understood through all morphisms into it, in a precise functorial sense.
topos-theory|Topos theory|Topos|Categories with set-like structure connect geometry, sheaves, and internal logic.
`);
section('foundations','type-theory','Type theory','Type_theory','Types organize mathematical expressions and support foundations based on construction and computation.',`
simple-types|Simple type theory|Simply_typed_lambda_calculus|Assign types to expressions so function application respects input and output types.
dependent-types|Dependent types|Dependent_type|A type may depend on a value, allowing statements and their evidence to be encoded together.
curry-howard|Curry–Howard correspondence|Curry–Howard_correspondence|Proofs correspond to programs, and propositions to types, in suitable formal systems.
lambda-calculus|Lambda calculus|Lambda_calculus|Function abstraction and application form a minimal language of computation.
homotopy-type-theory|Homotopy type theory|Homotopy_type_theory|Interpret identities as paths and relate dependent types to homotopy-theoretic spaces.
formal-verification|Proof assistants|Proof_assistant|Computer systems check formal proof steps against explicitly specified logical rules.
axioms|Axiomatic systems|Axiomatic_system|Axioms and inference rules specify the starting points and allowed deductions of a theory.
`);
children('set-operations',`
power-set|Power sets|Power_set|The power set contains every subset of a given set.|A ⊆ B ⇒ A ∈ P(B)|A subset of B is an element of B’s power set.
cartesian-product|Cartesian products|Cartesian_product|Ordered pairs let two sets form a common product space.|A × B = {(a,b) : a ∈ A, b ∈ B}|Order matters: (a,b) need not equal (b,a).
`);
children('functions',`
injective|Injective functions|Injective_function|Different inputs always produce different outputs.
surjective|Surjective functions|Surjective_function|Every element of the declared codomain is attained by some input.
bijective|Bijections & inverses|Bijection|A function is bijective when it is both injective and surjective, and then has an inverse.
composition|Function composition|Function_composition|The output of one function becomes the input of another.|(g ∘ f)(x) = g(f(x))|The image of f must lie in the domain of g.
`);

section('arithmetic','number-systems','Number systems','Number','Extend counting numbers to systems that support subtraction, division, limits, and algebraic equations.',`
naturals|Natural numbers|Natural_number|Counting numbers support addition, multiplication, and mathematical induction.
integers|Integers & divisibility|Integer|Adjoin negative numbers so subtraction is always possible.
rationals|Rational numbers|Rational_number|Ratios of integers support division by nonzero elements.|ℚ = {a/b : a,b ∈ ℤ, b ≠ 0}|Different ratios can represent the same rational number.
reals|Real numbers|Real_number|A complete ordered field models a continuous number line.
complex|Complex numbers|Complex_number|Adjoin i with i² = −1, and represent numbers as points of a plane.
quaternions|Quaternions|Quaternion|A four-dimensional real algebra has noncommutative multiplication and represents spatial rotations.
p-adics|p-adic numbers|P-adic_number|A number system uses divisibility by a fixed prime to define closeness.
`);
section('arithmetic','operations','Arithmetic operations','Arithmetic','Operations on numbers and the rules that govern their manipulation.',`
addition|Addition|Addition|Combine quantities using an operation whose neutral element is zero.
subtraction|Subtraction|Subtraction|Subtracting b reverses adding b when additive inverses exist.
multiplication|Multiplication|Multiplication|Repeated addition extends to a distributive operation on broader number systems.
division|Division|Division_(mathematics)|Division by a nonzero number reverses multiplication where a multiplicative inverse exists.
exponentiation|Exponentiation|Exponentiation|Repeated multiplication extends through roots, real powers, and complex exponentials.
logarithms|Logarithms|Logarithm|A logarithm recovers an exponent from the corresponding power.|logₐ(xy) = logₐ x + logₐ y|For real logarithms require a > 0, a ≠ 1, x > 0, and y > 0.
fractions|Fractions & ratios|Fraction|Fractions express equal parts or ratios, while equivalent fractions describe the same quantity.
absolute-value|Absolute value|Absolute_value|The magnitude of a real number is its distance from zero.|abs(x) = √(x²)|This identity is for real x.
`);
section('arithmetic','elementary-algebra','Elementary algebra','Elementary_algebra','Use variables, equations, inequalities, and functions to generalize arithmetic.',`
expressions|Algebraic expressions|Algebraic_expression|Variables and operations describe quantities without necessarily asserting an equality.
equations|Equations & polynomials|Equation|A solution makes the expressions on both sides of an equality agree.
inequalities|Inequalities|Inequality_(mathematics)|Order relations compare quantities and restrict sets of possible values.
linear-equations|Linear equations|Linear_equation|An equation is linear when unknowns appear only to the first degree without products between unknowns.
quadratic-equations|Quadratic equations|Quadratic_equation|Second-degree equations have roots governed by their discriminant.|x = (−b ± √(b² − 4ac))/(2a)|For ax² + bx + c = 0 with a ≠ 0.
polynomials|Polynomials|Polynomial|Finite sums of nonnegative integer powers support evaluation, factorization, and division.
rational-functions|Rational functions|Rational_function|A quotient of polynomials is defined where its denominator is nonzero.
exponential-functions|Exponential functions|Exponential_function|Constant proportional growth produces an exponential dependence on the input.
`);

section('algebra','linear-algebra','Linear algebra','Linear_algebra','Vector spaces, linear maps, matrices, and the structures that preserve addition and scaling.',`
vector-spaces|Vector spaces|Vector_space|Vectors admit addition and scalar multiplication over a field.
linear-maps|Linear transformations|Linear_map|Linear maps preserve every linear combination.|T(au + bv) = aT(u) + bT(v)|This must hold for all vectors u,v and scalars a,b.
matrices|Matrices|Matrix_(mathematics)|A matrix represents a linear map after input and output bases are chosen.
linear-systems|Linear systems|System_of_linear_equations|Simultaneous linear equations describe an affine solution set when consistent.
inner-products|Inner product spaces|Inner_product_space|An inner product adds notions of angle and length to a vector space.
determinants|Determinants|Determinant|An alternating multilinear scalar detects invertibility and oriented volume scaling.
spectral-theory|Spectral theory|Spectral_theory|Eigenvalues and related decompositions reveal the action of linear operators.
tensors|Tensors|Tensor|Tensor products encode multilinear objects whose coordinate arrays depend on bases.
`);
children('vector-spaces',`
linear-combinations|Linear combinations|Linear_combination|Add scalar multiples of vectors to construct new vectors.
span|Linear span|Linear_span|The span is the smallest vector subspace containing a specified set of vectors.
linear-independence|Linear independence|Linear_independence|No vector in an independent finite list is a linear combination of the others.
basis|Bases & dimension|Basis_(linear_algebra)|A basis is an independent spanning family; its cardinality is the dimension.
subspaces|Subspaces|Linear_subspace|A nonempty subset closed under addition and scalar multiplication is itself a vector space.
dual-spaces|Dual spaces|Dual_space|The dual consists of scalar-valued linear functions on a vector space.
change-of-basis|Change of basis|Change_of_basis|A coordinate change alters a representation while leaving the underlying vector or map unchanged.
`);
children('linear-maps',`
kernel-image|Kernel & image|Kernel_(linear_algebra)|The kernel records vectors mapped to zero; the image records attainable outputs.
rank-nullity|Rank–nullity theorem|Rank–nullity_theorem|The dimensions of the kernel and image add to the input dimension.|dim ker T + dim im T = dim V|V must be finite-dimensional.
isomorphism|Linear isomorphisms|Isomorphism|An invertible linear map identifies vector spaces while preserving their linear structure.
`);
children('matrices',`
matrix-product|Matrix multiplication|Matrix_multiplication|Multiplication represents composition and requires compatible dimensions.
transpose|Transpose & adjoint|Conjugate_transpose|Transpose swaps matrix indices; the complex adjoint also conjugates entries.
matrix-inverse|Matrix inverses|Invertible_matrix|A square matrix is invertible exactly when its linear map is bijective.
matrix-rank|Matrix rank|Rank_(linear_algebra)|Row rank and column rank agree and measure the dimension of the associated image.
matrix-decompositions|Matrix decompositions|Matrix_decomposition|Factor a matrix into structured components for understanding or computation.
`);
children('matrix-decompositions',`
lu|LU decomposition|LU_decomposition|Triangular factors support repeated solutions of linear systems, often with pivoting.
qr|QR decomposition|QR_decomposition|An orthogonal or unitary factor separates geometry from triangular coordinates.
svd|Singular value decomposition|Singular_value_decomposition|Orthogonal input and output directions expose stretching factors of any rectangular matrix.|A = UΣV*|U and V are unitary; Σ has nonnegative singular values.
cholesky|Cholesky decomposition|Cholesky_decomposition|A positive-definite Hermitian matrix factors as a triangular matrix times its adjoint.
jordan|Jordan normal form|Jordan_normal_form|Over an algebraically closed field, generalized eigenvectors organize an operator into Jordan blocks.
`);
children('inner-products',`
vectors|Euclidean vectors|Euclidean_vector|A Euclidean vector represents a direction and magnitude in a flat inner product space.
orthogonality|Orthogonality|Orthogonality|Two vectors are orthogonal when their inner product is zero.
norms|Norms|Norm_(mathematics)|A norm assigns a length compatible with scaling and the triangle inequality.
projections|Orthogonal projections|Projection_(linear_algebra)|A closest-point projection splits a vector into a subspace component and an orthogonal remainder.
gram-schmidt|Gram–Schmidt process|Gram–Schmidt_process|Successive orthogonalization turns an independent list into an orthonormal one.
`);
children('spectral-theory',`
eigenvalues|Eigenvalues|Eigenvalues_and_eigenvectors|An eigenvalue is a scalar by which an operator stretches a nonzero eigenvector.
eigenvectors|Eigenvectors|Eigenvalues_and_eigenvectors|An eigenvector preserves its direction under a linear map.|Av = λv, v ≠ 0|The zero vector is excluded from eigenvectors.
diagonalization|Diagonalization|Diagonalizable_matrix|A basis of eigenvectors makes the matrix of a linear operator diagonal.
spectral-theorem|Spectral theorem|Spectral_theorem|Self-adjoint operators admit especially strong spectral decompositions under the relevant hypotheses.
positive-definite|Positive-definite matrices|Definite_matrix|A Hermitian matrix is positive definite when its quadratic form is positive on every nonzero vector.
`);
children('tensors',`
tensor-product|Tensor products|Tensor_product|A universal construction linearizes bilinear maps and combines vector spaces.
tensor-contraction|Tensor contraction|Tensor_contraction|Pair a vector index with a dual index and sum to reduce tensor order.
tensor-eigenvalues|Tensor eigenvalues|Tensor_eigenvalue|Higher-order tensors admit several inequivalent nonlinear spectral notions.
cp-decomposition|CP decomposition|Tensor_rank_decomposition|Express a tensor as a sum of rank-one outer products.
tucker|Tucker decomposition|Tucker_decomposition|A core tensor links one factor space or matrix for each tensor mode.
`);
children('tensor-eigenvalues',`
h-eigenvalues|H-eigenvalues|Tensor_eigenvalue|For a real tensor, the eigen-equation uses componentwise powers on its right side.
z-eigenvalues|Z-eigenvalues|Tensor_eigenvalue|A normalized real eigenvector defines a different tensor eigenproblem from H-eigenvalues.
m-eigenvalues|M-eigenvalues|Tensor_eigenvalue|Coupled unit vectors produce spectral values for certain fourth-order elasticity tensors.
`);
section('algebra','abstract-algebra','Abstract algebra','Abstract_algebra','Study operations through axioms rather than through particular numerical representations.',`
groups|Group theory|Group_theory|Groups capture associative composition with identities and inverses.
rings|Ring theory|Ring_theory|Rings combine addition and multiplication linked by distributivity.
fields|Field theory|Field_(mathematics)|Fields allow addition, subtraction, multiplication, and division by nonzero elements.
modules|Module theory|Module_(mathematics)|Modules generalize vector spaces by allowing scalars from a ring instead of a field.
representations|Representation theory|Representation_theory|Represent abstract structures by linear transformations that preserve their operations.
universal-algebra|Universal algebra|Universal_algebra|Study algebraic operations and identities in a common language spanning many kinds of structures.
homological-algebra|Homological algebra|Homological_algebra|Chain complexes and derived constructions study algebraic information hidden in maps and relations.
`);
children('groups',`
subgroups|Subgroups|Subgroup|A subgroup is a subset that forms a group under the inherited operation.
group-homomorphisms|Group homomorphisms|Group_homomorphism|Maps preserving multiplication compare groups and expose kernels and images.
normal-subgroups|Normal subgroups|Normal_subgroup|Invariance under conjugation is exactly what permits a quotient group construction.
quotient-groups|Quotient groups|Quotient_group|Cosets of a normal subgroup form a group whose operation is induced from the original group.
group-actions|Group actions|Group_action|A group acts by transformations on a set, organizing orbits and stabilizers.
permutation-groups|Permutation groups|Permutation_group|Groups of bijections encode symmetries of finite or infinite sets.
cyclic-groups|Cyclic groups|Cyclic_group|One element generates every group element by integer powers.
sylow|Sylow theorems|Sylow_theorems|Prime-power subgroup sizes constrain the structure of finite groups.
lie-groups|Lie groups|Lie_group|A smooth manifold and a group structure coexist with smooth multiplication and inversion.
`);
children('lie-groups',`
lie-algebras|Lie algebras|Lie_algebra|An antisymmetric bracket with the Jacobi identity describes infinitesimal symmetry.
exponential-map|Exponential map|Exponential_map_(Lie_theory)|The exponential map relates a Lie algebra to one-parameter subgroups of its Lie group.
classical-groups|Classical groups|Classical_group|Matrix groups preserve structures such as determinants, inner products, or symplectic forms.
`);
children('rings',`
ideals|Ideals|Ideal_(ring_theory)|An ideal is an additive subgroup closed under multiplication by arbitrary ring elements on the appropriate side.
quotient-rings|Quotient rings|Quotient_ring|Identify elements whose difference lies in an ideal to obtain a new ring.
polynomial-rings|Polynomial rings|Polynomial_ring|Adjoining formal variables extends coefficient arithmetic to polynomials.
integral-domains|Integral domains|Integral_domain|A commutative ring with unity and no zero divisors supports cancellation of nonzero factors.
ufd|Unique factorization domains|Unique_factorization_domain|Irreducible factorizations are unique up to order and multiplication by units.
noetherian|Noetherian rings|Noetherian_ring|Ascending ideal chains stabilize, equivalently every ideal is finitely generated.
commutative-algebra|Commutative algebra|Commutative_algebra|Commutative rings and their modules supply the algebraic language of algebraic geometry.
`);
children('fields',`
field-extensions|Field extensions|Field_extension|A larger field containing a smaller one can be studied as a vector space over the smaller field.
finite-fields|Finite fields|Finite_field|Finite fields have prime-power size and tightly constrained multiplicative structure.
algebraic-extensions|Algebraic extensions|Algebraic_extension|Every element of the larger field satisfies a polynomial equation over the base field.
galois|Galois theory|Galois_theory|Automorphisms of field extensions translate polynomial questions into group-theoretic questions.
splitting-fields|Splitting fields|Splitting_field|A splitting field is generated by all roots of a polynomial over its coefficient field.
`);
children('representations',`
group-representations|Group representations|Group_representation|A group acts by invertible linear transformations on a vector space.
irreducible-representations|Irreducible representations|Irreducible_representation|A nonzero representation has no nontrivial invariant subspace.
characters|Characters|Character_theory|Traces of representation matrices provide functions constant on conjugacy classes.
direct-sums|Direct sums|Direct_sum|Separate components combine into a larger algebraic object without interactions between summands.
dual-representations|Dual representations|Dual_representation|The induced action on linear functionals reverses how vectors are transformed.
`);
children('homological-algebra',`
chain-complexes|Chain complexes|Chain_complex|A sequence of boundary maps has consecutive composites equal to zero.
exact-sequences|Exact sequences|Exact_sequence|At every stage, the image of the incoming map equals the kernel of the outgoing map.
derived-functors|Derived functors|Derived_functor|Measure the failure of a functor to preserve exactness using resolutions.
ext-tor|Ext & Tor|Derived_functor|Important derived functors detect extension classes and failures of tensor-product exactness.
`);

section('number','elementary-number','Elementary number theory','Elementary_number_theory','Arithmetic structure visible through divisibility, congruences, and prime factorization.',`
divisibility|Divisibility|Divisibility|An integer divides another when the latter is an integer multiple of the former.
primes|Prime numbers|Prime_number|A prime exceeds one and has exactly two positive divisors.
gcd|Greatest common divisors|Greatest_common_divisor|The largest positive common divisor organizes integer linear combinations.
euclidean-algorithm|Euclidean algorithm|Euclidean_algorithm|Repeated remainders efficiently compute a greatest common divisor.
modular|Modular arithmetic|Modular_arithmetic|Congruence identifies integers whose difference is divisible by a fixed modulus.
arithmetic-functions|Arithmetic functions|Arithmetic_function|Functions on positive integers record divisor counts, totients, and related arithmetic information.
diophantine|Diophantine equations|Diophantine_equation|Seek integer or rational solutions rather than arbitrary real solutions of polynomial equations.
`);
children('modular',`
chinese-remainder|Chinese remainder theorem|Chinese_remainder_theorem|Congruences with pairwise coprime moduli combine into one congruence modulo their product.
fermat-little|Fermat’s little theorem|Fermat%27s_little_theorem|Exponentiation modulo a prime has a uniform constraint on nonzero residues.|aᵖ⁻¹ ≡ 1 (mod p)|p is prime and p does not divide a.
euler-totient|Euler’s totient theorem|Euler%27s_theorem|The totient counts units modulo an integer and controls a generalization of Fermat’s theorem.
quadratic-residues|Quadratic residues|Quadratic_residue|Ask which congruence classes can be expressed as squares modulo a given modulus.
quadratic-reciprocity|Quadratic reciprocity|Quadratic_reciprocity|Relate quadratic solvability modulo two distinct odd primes.
primitive-roots|Primitive roots|Primitive_root_modulo_n|A primitive root generates the multiplicative group of units when that group is cyclic.
`);
children('diophantine',`
linear-diophantine|Linear Diophantine equations|Diophantine_equation|Integer solutions of ax + by = c exist exactly when gcd(a,b) divides c.
pell|Pell equations|Pell%27s_equation|Integer solutions of x² − Dy² = 1 connect quadratic irrationals to continued fractions.
pythagorean-triples|Pythagorean triples|Pythagorean_triple|Integer side lengths of right triangles satisfy a² + b² = c².
elliptic-curves|Elliptic curves|Elliptic_curve|Nonsingular cubic curves with a specified point support a geometric group law.
fermat-last|Fermat’s last theorem|Fermat%27s_Last_Theorem|No positive integer solutions of xⁿ + yⁿ = zⁿ exist for integer n > 2.
`);
section('number','analytic-number','Analytic number theory','Analytic_number_theory','Use limits, series, and complex functions to study arithmetic patterns.',`
prime-number-theorem|Prime number theorem|Prime_number_theorem|The number of primes up to x is asymptotic to x/log x.|π(x) ∼ x/log x|The ratio tends to 1 as x tends to infinity.
zeta|Riemann zeta function|Riemann_zeta_function|A Dirichlet series links complex analysis to the distribution of primes.
dirichlet-series|Dirichlet series|Dirichlet_series|Series indexed by n⁻ˢ encode arithmetic functions and convergence information.
dirichlet-theorem|Primes in progressions|Dirichlet%27s_theorem_on_arithmetic_progressions|Every arithmetic progression with coprime starting term and step contains infinitely many primes.
riemann-hypothesis|Riemann hypothesis|Riemann_hypothesis|A major open conjecture places the nontrivial zeros of the zeta function on a vertical line.
sieve-theory|Sieve methods|Sieve_theory|Estimate sizes of sets after excluding integers with specified divisibility properties.
`);
section('number','algebraic-number','Algebraic number theory','Algebraic_number_theory','Study arithmetic in fields extending the rational numbers.',`
algebraic-numbers|Algebraic numbers|Algebraic_number|An algebraic number is a root of a nonzero polynomial with rational coefficients.
number-fields|Number fields|Algebraic_number_field|Finite extensions of the rationals supply new arithmetic environments.
algebraic-integers|Algebraic integers|Algebraic_integer|Roots of monic integer polynomials generalize ordinary integers inside number fields.
ideal-factorization|Prime ideal factorization|Dedekind_domain|Ideals can recover unique factorization when individual elements no longer factor uniquely.
class-groups|Ideal class groups|Ideal_class_group|The class group measures the failure of principal ideals to account for all ideals.
valuation|Valuations|Valuation_(algebra)|Valuations assign sizes or orders compatible with multiplication and addition.
local-fields|Local fields|Local_field|Locally compact fields include real, complex, and nonarchimedean examples used in arithmetic.
`);
section('number','additive-number','Additive & geometric number theory','Additive_number_theory','Integer sets, sums, lattice points, and geometric methods in arithmetic.',`
additive-combinatorics|Additive combinatorics|Additive_combinatorics|Analyze how sumsets and additive patterns constrain subsets of groups.
partitions-integers|Integer partitions|Partition_(number_theory)|Write an integer as a sum of positive integers while ignoring summand order.
diophantine-approximation|Diophantine approximation|Diophantine_approximation|Measure how accurately real numbers can be approximated by rational numbers.
continued-fractions|Continued fractions|Continued_fraction|Nested reciprocals generate rational approximations with strong optimality properties.
geometry-of-numbers|Geometry of numbers|Geometry_of_numbers|Use convex bodies and lattices to solve arithmetic problems.
lattices|Lattices|Lattice_(group)|Discrete additive subgroups organize integer combinations of linearly independent vectors.
`);

section('analysis','calculus','Calculus','Calculus','Differentiate to study local change, integrate to study accumulation, and use limits to connect the two.',`
single-variable|Single-variable calculus|Calculus|Functions of one real variable reveal rates of change, accumulated quantities, and infinite expansions.
multivariable|Multivariable calculus|Multivariable_calculus|Generalize differentiation and integration to functions with several inputs.
vector-calculus|Vector calculus|Vector_calculus|Study scalar and vector fields through gradient, divergence, curl, and integral theorems.
calculus-variations|Calculus of variations|Calculus_of_variations|Optimize functionals whose unknowns are entire curves or functions.
`);
children('single-variable',`
limits|Limits & continuity|Limit_of_a_function|A limit describes nearby behavior; continuity matches that limit to the actual function value.
derivatives|Derivatives|Derivative|A derivative is the limiting rate of output change per unit input change.
integrals|Integrals|Integral|A definite integral measures signed accumulation and connects to antiderivatives.
series|Infinite series|Series_(mathematics)|A series converges when the sequence of its partial sums approaches a finite value.
taylor|Taylor series|Taylor_series|Local derivative information forms polynomial approximations and, under convergence conditions, infinite expansions.
`);
children('limits',`
epsilon-delta|Epsilon–delta definition|Limit_of_a_function|Specify a tolerance on outputs and find an input neighborhood that guarantees it.
one-sided-limits|One-sided limits|One-sided_limit|Left and right approaches may behave differently near the same point.
squeeze|Squeeze theorem|Squeeze_theorem|A function trapped between two functions with the same limit shares that limit.
continuity|Continuous functions|Continuous_function|Small changes of input produce controlled changes of output near each point.
intermediate-value|Intermediate value theorem|Intermediate_value_theorem|A continuous function on an interval takes every value between two of its values.
extreme-value|Extreme value theorem|Extreme_value_theorem|A continuous real function on a compact nonempty interval attains a minimum and maximum.
`);
children('derivatives',`
differentiation-rules|Differentiation rules|Differentiation_rules|Power, product, quotient, and composition rules turn derivatives into reusable calculations.
chain-rule|Chain rule|Chain_rule|Differentiate a composition by composing the outer derivative and multiplying by the inner derivative.|(f ∘ g)′(x) = f′(g(x))g′(x)|Both derivatives must exist at the relevant points.
implicit-differentiation|Implicit differentiation|Implicit_function|Differentiate a relation involving several variables to obtain a derivative of an implicitly defined function.
higher-derivatives|Higher derivatives|Derivative|Repeated differentiation measures how rates of change themselves vary.
mean-value|Mean value theorem|Mean_value_theorem|Under continuity and differentiability assumptions, an average slope occurs as a tangent slope.
lhopital|L’Hôpital’s rule|L%27Hôpital%27s_rule|Certain indeterminate quotient limits can be evaluated through derivative ratios under specific hypotheses.
`);
children('integrals',`
antiderivatives|Antiderivatives|Antiderivative|An antiderivative differentiates to a specified function on an interval.
fundamental-calculus|Fundamental theorem of calculus|Fundamental_theorem_of_calculus|Differentiation and integration undo one another under appropriate regularity conditions.
substitution|Integration by substitution|Integration_by_substitution|A change of variable transforms an integral using the chain rule in reverse.
integration-parts|Integration by parts|Integration_by_parts|Transfer a derivative from one factor to another using the product rule.
improper-integrals|Improper integrals|Improper_integral|Infinite endpoints or unbounded integrands require an additional convergence limit.
riemann-integration|Riemann integration|Riemann_integral|Limits of partition-based sums define an integral for suitable bounded functions.
`);
children('series',`
sequences|Sequences & recurrences|Sequence|Ordered terms can approach a limit, oscillate, or diverge according to their defining rule.
series-tests|Convergence tests|Convergence_tests|Comparison, ratio, root, and alternating-series tests distinguish different convergence behaviors.
absolute-convergence|Absolute convergence|Absolute_convergence|Convergence of the sum of absolute values is stronger than convergence of a signed series.
power-series|Power series|Power_series|An infinite polynomial-like expansion converges within a radius and needs separate checks at boundary points.
uniform-convergence|Uniform convergence|Uniform_convergence|One approximation threshold works simultaneously over the entire domain.
`);
children('multivariable',`
partial-derivatives|Partial derivatives|Partial_derivative|Vary one input coordinate while holding the others fixed.
gradient|Gradient|Gradient|The gradient collects partial derivatives and represents directional change through an inner product.
jacobian|Jacobian|Jacobian_matrix_and_determinant|The derivative of a vector-valued map is represented by its matrix of first partial derivatives.
hessian|Hessian|Hessian_matrix|Second partial derivatives form a matrix that describes local quadratic behavior.
multiple-integrals|Multiple integrals|Multiple_integral|Accumulate quantities over planar, spatial, or higher-dimensional regions.
change-variables|Change of variables|Integration_by_substitution|A Jacobian determinant corrects volume when coordinates are transformed.
implicit-function|Implicit function theorem|Implicit_function_theorem|A nondegenerate derivative condition lets a relation locally define some variables as functions of others.
`);
children('vector-calculus',`
divergence|Divergence|Divergence|The divergence measures local net flux per unit volume of a vector field.
curl|Curl|Curl_(mathematics)|In three dimensions, curl measures local infinitesimal circulation.
line-integrals|Line integrals|Line_integral|Integrate a scalar or vector field along a parametrized curve.
surface-integrals|Surface integrals|Surface_integral|Integrate scalar density or oriented flux across a surface.
green-theorem|Green’s theorem|Green%27s_theorem|Relate a planar boundary circulation to an integral over the enclosed region.
stokes-theorem|Stokes’ theorem|Stokes%27_theorem|Integration of an exterior derivative over a manifold matches integration over its oriented boundary.
divergence-theorem|Divergence theorem|Divergence_theorem|Net outward flux through a boundary equals the integral of divergence over its interior.
`);
section('analysis','real-analysis','Real analysis','Real_analysis','Prove precise results about real functions, completeness, convergence, differentiation, and integration.',`
completeness-reals|Completeness of the reals|Least-upper-bound_property|Every nonempty bounded-above set of real numbers has a real least upper bound.
metric-spaces|Metric spaces|Metric_space|A distance function supports limits, continuity, and Cauchy sequences without assuming coordinates.
cauchy-sequences|Cauchy sequences|Cauchy_sequence|Terms eventually become arbitrarily close to one another, whether or not a limit exists in the ambient space.
bolzano-weierstrass|Bolzano–Weierstrass theorem|Bolzano–Weierstrass_theorem|Every bounded sequence in finite-dimensional Euclidean space has a convergent subsequence.
heine-borel|Heine–Borel theorem|Heine–Borel_theorem|In finite-dimensional Euclidean space, compactness is equivalent to being closed and bounded.
function-sequences|Sequences of functions|Pointwise_convergence|Pointwise and uniform convergence impose different controls on limiting functions.
`);
section('analysis','measure','Measure theory','Measure_(mathematics)','Assign sizes to sets and build an integration theory that handles limits and probability robustly.',`
sigma-algebras|Sigma-algebras|Σ-algebra|Collections of measurable sets are closed under complements and countable unions.
measures|Measures|Measure_(mathematics)|Countable additivity assigns consistent sizes to disjoint measurable sets.
lebesgue-measure|Lebesgue measure|Lebesgue_measure|Lebesgue measure extends ordinary length, area, and volume to a broad class of sets.
measurable-functions|Measurable functions|Measurable_function|Preimages of measurable target sets must be measurable in the source space.
lebesgue-integral|Lebesgue integration|Lebesgue_integration|Approximate measurable functions through simple functions rather than partitioning the input axis alone.
dominated-convergence|Dominated convergence|Dominated_convergence_theorem|An integrable dominating function allows passage of a pointwise almost-everywhere limit through an integral.
fubini|Fubini & Tonelli theorems|Fubini%27s_theorem|Under integrability or nonnegativity hypotheses, product-space integrals can be iterated.
radon-nikodym|Radon–Nikodym theorem|Radon–Nikodym_theorem|An absolutely continuous measure has a density relative to another measure under suitable finiteness assumptions.
`);
section('analysis','complex-analysis','Complex analysis','Complex_analysis','Complex differentiability links local power series, contour integrals, and global geometry.',`
holomorphic|Holomorphic functions|Holomorphic_function|Complex differentiability on an open set imposes much stronger structure than real differentiability.
cauchy-riemann|Cauchy–Riemann equations|Cauchy–Riemann_equations|The real and imaginary parts of a holomorphic function satisfy coupled partial differential equations.
contour-integration|Contour integration|Contour_integration|Integrate a complex-valued function along an oriented path in the complex plane.
cauchy-integral|Cauchy integral formula|Cauchy%27s_integral_formula|Boundary values determine interior values and derivatives of a holomorphic function.
laurent|Laurent series|Laurent_series|Allow negative as well as nonnegative powers to describe functions near isolated singularities.
residues|Residue theorem|Residue_theorem|Contour integrals around isolated singularities are determined by their residue coefficients.
conformal-maps|Conformal maps|Conformal_map|Locally angle-preserving maps connect complex analysis to planar geometry.
analytic-continuation|Analytic continuation|Analytic_continuation|Extend a holomorphic function beyond its initial domain through overlapping analytic representations.
`);
section('analysis','functional-analysis','Functional analysis','Functional_analysis','Treat spaces of functions as geometric objects and study continuous linear operators on them.',`
normed-spaces|Normed spaces|Normed_vector_space|A vector space with a norm combines algebraic structure with a notion of length.
banach|Banach spaces|Banach_space|A complete normed space contains limits of all its Cauchy sequences.
hilbert|Hilbert spaces|Hilbert_space|A complete inner product space extends Euclidean geometry to infinite dimensions.
lp-spaces|Lp spaces|Lp_space|Integrability of a power of absolute value defines important families of function spaces.
bounded-operators|Bounded operators|Bounded_operator|A linear map between normed spaces is continuous exactly when its operator norm is finite.
weak-convergence|Weak convergence|Weak_convergence_(Hilbert_space)|Convergence is tested through continuous linear functionals rather than through the norm directly.
hahn-banach|Hahn–Banach theorem|Hahn–Banach_theorem|Extend controlled linear functionals from subspaces to larger normed spaces.
sobolev|Sobolev spaces|Sobolev_space|Control functions together with selected weak derivatives through integrability conditions.
`);
section('analysis','harmonic-analysis','Harmonic analysis','Harmonic_analysis','Resolve functions into oscillatory components and study transformations between position and frequency.',`
fourier|Fourier analysis|Fourier_analysis|Periodic and nonperiodic functions can be analyzed through trigonometric or exponential frequency components.
fourier-series|Fourier series|Fourier_series|Expand a periodic function in harmonically related frequencies.
fourier-transform|Fourier transform|Fourier_transform|An integral transform expresses a function in terms of continuous frequencies.
convolution|Convolution|Convolution|Shift, multiply, and integrate two functions to describe smoothing and linear responses.
distributions-generalized|Generalized functions|Distribution_(mathematics)|Distributions act on smooth test functions and allow differentiation beyond ordinary functions.
wavelets|Wavelets|Wavelet|Localized scale-and-position building blocks capture features at multiple resolutions.
special-functions|Special functions|Special_functions|Named function families arise repeatedly as solutions and kernels in analysis and physics.
`);
children('special-functions',`
gamma|Gamma function|Gamma_function|An integral-defined function extends factorial values to a wider domain.
bessel|Bessel functions|Bessel_function|Radial wave and diffusion equations in cylindrical coordinates lead to Bessel functions.
orthogonal-polynomials|Orthogonal polynomials|Orthogonal_polynomials|Polynomial families are orthogonal with respect to a specified weighted inner product.
elliptic-functions|Elliptic functions|Elliptic_function|Meromorphic functions with two independent complex periods connect analysis to elliptic curves.
`);

section('geometry','euclidean','Euclidean geometry','Euclidean_geometry','Flat spaces, straight lines, angles, congruence, and metric constructions.',`
lines|Lines & incidence|Line_(geometry)|Incidence describes which points belong to which lines and how lines intersect.
triangles|Triangles|Triangle|Three-sided polygons link angle constraints, congruence, similarity, and area.
polygons|Polygons|Polygon|Closed chains of straight segments bound planar figures.
circles|Circles|Circle|Points at one fixed distance from a center form a circle.
solids|Polyhedra & solids|Polyhedron|Flat polygonal faces meet along edges to form three-dimensional polyhedral surfaces.
trigonometry|Trigonometry|Trigonometry|Trigonometric functions connect angular position, ratios, and periodic behavior.
isometries|Isometries|Isometry|Distance-preserving maps express rigid geometric symmetries.
`);
children('lines',`
distance|Distance|Distance|A metric turns separation between points or sets into a numerical quantity.
angles|Angles|Angle|An angle measures relative direction and may be described in radians.
parallel-lines|Parallel lines|Parallel_(geometry)|Coplanar Euclidean lines with the same direction never intersect.
intersections|Intersections|Line–line_intersection|Simultaneous coordinate constraints determine where geometric objects meet.
`);
children('triangles',`
pythagoras|Pythagorean theorem|Pythagorean_theorem|Squared lengths in a right triangle obey a fundamental Euclidean identity.|a² + b² = c²|c is the hypotenuse of a Euclidean right triangle.
similarity|Similarity & congruence|Similarity_(geometry)|Similarity preserves shape up to scale; congruence also preserves all distances.
triangle-centers|Triangle centers|Triangle_center|Centroid, circumcenter, incenter, and orthocenter arise from different canonical constructions.
law-cosines|Law of cosines|Law_of_cosines|An included angle determines the relation between all three side lengths.|c² = a² + b² − 2ab cos γ|γ is the angle between sides a and b.
`);
children('circles',`
arcs-sectors|Arcs & sectors|Circular_sector|Angle and radius determine circular arc length and sector area.
tangents|Tangents to circles|Tangent_lines_to_circles|A tangent line meets a circle once and is perpendicular to its radius at the contact point.
circle-theorems|Inscribed angles|Inscribed_angle|Central and inscribed angles subtending the same arc are related by a factor of two.
`);
children('solids',`
prisms|Prisms|Prism_(geometry)|Congruent parallel polygonal bases are connected by parallelogram faces.
pyramids|Pyramids|Pyramid_(geometry)|A polygonal base joins to an apex through triangular faces.
platonic-solids|Platonic solids|Platonic_solid|Five convex regular polyhedra have congruent regular faces and identical vertex figures.
hypercubes|Hypercubes|Hypercube|The Cartesian product of intervals generalizes a square and cube to any finite dimension.
simplices|Simplices|Simplex|An n-simplex is the convex hull of n + 1 affinely independent points.
hyperspheres|Hyperspheres|N-sphere|Points at a fixed distance from a center form a sphere in higher-dimensional Euclidean space.
`);
section('geometry','affine-projective','Affine & projective geometry','Projective_geometry','Study properties preserved by affine or projective changes of coordinates.',`
affine-spaces|Affine spaces|Affine_space|Differences of points are vectors, while no origin is distinguished.
projective-spaces|Projective spaces|Projective_space|One-dimensional linear subspaces become points in a space that incorporates directions at infinity.
homogeneous-coordinates|Homogeneous coordinates|Homogeneous_coordinates|Coordinates differing by a nonzero common factor describe the same projective point.
conic-sections|Conic sections|Conic_section|Quadratic plane curves include ellipses, parabolas, and hyperbolas.
cross-ratio|Cross-ratio|Cross-ratio|A ratio built from four collinear points is preserved by projective transformations.
projective-duality|Projective duality|Duality_(projective_geometry)|Points and hyperplanes can exchange roles in incidence statements.
`);
section('geometry','non-euclidean','Non-Euclidean geometry','Non-Euclidean_geometry','Replace Euclid’s parallel postulate and examine geometries with different curvature and incidence behavior.',`
hyperbolic-geometry|Hyperbolic geometry|Hyperbolic_geometry|Constant negative curvature leads to distinctive triangles, distances, and parallel lines.
spherical-geometry|Spherical geometry|Spherical_geometry|Great-circle arcs supply natural geodesics on a sphere.
geodesics|Geodesics|Geodesic|A geodesic is a locally straight path relative to a space’s metric connection.
parallel-postulate|Parallel postulates|Parallel_postulate|Changing the Euclidean parallel condition produces fundamentally different geometries.
tessellations|Tessellations|Tessellation|Tiles cover a surface without gaps or overlaps in their interiors.
`);
children('hyperbolic-geometry',`
poincare-disk|Poincaré disk|Poincaré_disk_model|A disk models the hyperbolic plane with angle-preserving coordinates.
hyperbolic-triangles|Hyperbolic triangles|Hyperbolic_triangle|A hyperbolic triangle has angle sum smaller than π radians.
horocycles|Horocycles|Horocycle|A limit of suitable hyperbolic circles shares a point at infinity.
hyperbolic-space|Hyperbolic spaces|Hyperbolic_space|Complete simply connected spaces of constant negative sectional curvature generalize the hyperbolic plane.
`);
children('spherical-geometry',`
great-circles|Great circles|Great_circle|A plane through the sphere’s center cuts out its geodesic circles.
spherical-triangles|Spherical triangles|Spherical_trigonometry|A nondegenerate spherical geodesic triangle has angle sum larger than π radians.
spherical-space|Spherical spaces|Spherical_geometry|Positive constant-curvature spaces provide the spherical counterpart of Euclidean and hyperbolic geometry.
`);
section('geometry','differential-geometry','Differential geometry','Differential_geometry','Use derivatives and smooth coordinates to study the local and global geometry of spaces.',`
curves-surfaces|Curves & surfaces|Differential_geometry_of_surfaces|Tangents, normals, and curvature describe smooth embedded geometric objects.
manifolds|Smooth manifolds|Differentiable_manifold|Compatible charts make a space locally resemble Euclidean space with smooth coordinate changes.
tangent-spaces|Tangent spaces|Tangent_space|Velocities of curves through a point form its linear space of infinitesimal directions.
differential-forms|Differential forms|Differential_form|Alternating covariant tensors provide coordinate-independent objects for integration.
riemannian|Riemannian geometry|Riemannian_geometry|A smoothly varying positive-definite inner product measures lengths and angles on a manifold.
symplectic-geometry|Symplectic geometry|Symplectic_geometry|A closed nondegenerate two-form supplies the geometry of Hamiltonian phase spaces.
`);
children('riemannian',`
metric-tensor|Metric tensors|Metric_tensor|A metric assigns a bilinear measurement rule to each tangent space.
connections|Connections & covariant derivatives|Connection_(mathematics)|A connection differentiates vector fields and compares directions at nearby points.
levi-civita|Levi-Civita connection|Levi-Civita_connection|A Riemannian metric determines a unique torsion-free metric-compatible connection.
curvature|Curvature tensors|Riemann_curvature_tensor|Curvature measures the failure of successive covariant derivatives to commute.
parallel-transport|Parallel transport|Parallel_transport|A connection carries tangent vectors along paths while preserving a notion of parallelism.
gauss-bonnet|Gauss–Bonnet theorem|Gauss–Bonnet_theorem|Integrated curvature relates to the topology of a compact surface.
geometric-flows|Geometric flows|Geometric_flow|Evolution equations deform metrics, embeddings, or connections according to geometric quantities.
`);
children('geometric-flows',`
ricci-flow|Ricci flow|Ricci_flow|A metric evolves in a direction controlled by its Ricci curvature.|∂ₜg = −2 Ric(g)|This is the unnormalized Ricci flow; singularities may develop.
mean-curvature-flow|Mean curvature flow|Mean_curvature_flow|An immersed submanifold moves in the direction of its mean curvature vector.
`);
section('geometry','algebraic-geometry','Algebraic geometry','Algebraic_geometry','Translate polynomial equations into geometric spaces and geometric questions into algebra.',`
varieties|Algebraic varieties|Algebraic_variety|Common zeros of polynomial equations form algebraic geometric objects.
coordinate-rings|Coordinate rings|Coordinate_ring|Polynomial functions on an affine algebraic set form a ring encoding its geometry.
nullstellensatz|Hilbert’s Nullstellensatz|Hilbert%27s_Nullstellensatz|Over an algebraically closed field, ideals and common zero sets are linked through radicals.
morphisms-varieties|Morphisms & rational maps|Morphism_of_algebraic_varieties|Regular and rational maps express different notions of algebraic geometric transformation.
schemes|Schemes|Scheme_(mathematics)|Glue spectra of commutative rings to generalize varieties and retain arithmetic information.
sheaves|Sheaves|Sheaf_(mathematics)|Compatible local data can be glued into global data on a topological space or site.
singularities|Singularities|Singular_point_of_an_algebraic_variety|Algebraic spaces can fail to be smooth at points with degenerate local behavior.
`);
children('varieties',`
affine-varieties|Affine varieties|Affine_variety|Polynomial zero sets live inside affine space over a chosen field.
projective-varieties|Projective varieties|Projective_variety|Homogeneous polynomial equations define zero sets in projective space.
algebraic-curves|Algebraic curves|Algebraic_curve|One-dimensional algebraic varieties connect polynomial equations to complex and arithmetic geometry.
`);
section('geometry','convex-discrete-geometry','Convex & discrete geometry','Convex_geometry','Study convex bodies, finite configurations, arrangements, and extremal geometric structures.',`
convex-sets|Convex sets|Convex_set|Every line segment between two points of a convex set stays in the set.
convex-hulls|Convex hulls|Convex_hull|The smallest convex set containing given points consists of their convex combinations.
polytopes|Polytopes|Polytope|Higher-dimensional convex polytopes connect geometry, inequalities, and combinatorics.
voronoi|Voronoi diagrams|Voronoi_diagram|Partition a metric space according to which designated site is nearest.
sphere-packing|Sphere packing|Sphere_packing|Arrange nonoverlapping equal spheres and ask how dense the arrangement can be.
`);

section('topology','point-set-topology','General topology','General_topology','Open sets define continuity and local structure without requiring a distance formula.',`
topological-spaces|Topological spaces|Topological_space|A collection of open sets satisfies closure rules for unions and finite intersections.
open-closed|Open & closed sets|Open_set|Openness is part of a topology, while a closed set has an open complement.
neighborhoods|Neighborhoods & bases|Base_(topology)|A basis generates all open sets from simpler local pieces.
topological-continuity|Continuity & homeomorphism|Homeomorphism|A continuous bijection with continuous inverse identifies topological spaces.
compactness|Compactness|Compact_space|Every open cover of a compact space has a finite subcover.
connectedness|Connectedness|Connected_space|A connected space cannot be split into two disjoint nonempty open pieces.
separation-axioms|Separation axioms|Separation_axiom|Axioms such as Hausdorffness specify how points and sets can be distinguished by neighborhoods.
product-quotient-topology|Products & quotients|Quotient_space_(topology)|Product and quotient constructions create topologies compatible with specified maps.
`);
section('topology','algebraic-topology','Algebraic topology','Algebraic_topology','Algebraic invariants detect and organize topological shapes and their holes.',`
homotopy|Homotopy|Homotopy|A continuous deformation between maps compares them without demanding exact equality.
fundamental-group|Fundamental groups|Fundamental_group|Loops based at a point form a group under concatenation up to homotopy.
covering-spaces|Covering spaces|Covering_space|A map locally resembles several separate copies of its target neighborhood.
homology|Homology|Homology_(mathematics)|Cycles modulo boundaries encode holes in different dimensions.
cohomology|Cohomology|Cohomology|Dual algebraic constructions add operations and further structure to topological invariants.
euler-characteristic|Euler characteristic|Euler_characteristic|An alternating count of cells or homological ranks is a fundamental topological invariant.
homotopy-groups|Higher homotopy groups|Homotopy_group|Maps from higher-dimensional spheres extend the loop-based idea of the fundamental group.
`);
children('homology',`
simplicial-complexes|Simplicial complexes|Simplicial_complex|Vertices, edges, triangles, and their higher-dimensional analogues assemble into combinatorial spaces.
singular-homology|Singular homology|Singular_homology|Continuous maps from simplices define chains on very general topological spaces.
persistent-homology|Persistent homology|Persistent_homology|Track topological features across a changing scale or filtration.
`);
section('topology','differential-topology','Differential topology','Differential_topology','Study smooth manifolds and maps through properties unaffected by smooth coordinate changes.',`
tangent-bundles|Tangent bundles|Tangent_bundle|All tangent spaces of a manifold assemble into a larger smooth space.
vector-bundles|Vector bundles|Vector_bundle|A family of vector spaces varies locally like a product over a base space.
transversality|Transversality|Transversality_(mathematics)|Submanifolds or maps meet with tangent directions in sufficiently general position.
sard|Sard’s theorem|Sard%27s_theorem|Critical values of a sufficiently differentiable map form a measure-zero set.
morse-theory|Morse theory|Morse_theory|Critical points of smooth functions reveal how a manifold is assembled.
cobordism|Cobordism|Cobordism|Two manifolds can be related as boundary components of a higher-dimensional manifold.
`);
section('topology','geometric-topology','Geometric topology','Geometric_topology','Study manifolds, embeddings, knots, and low-dimensional geometric structure.',`
surfaces-classification|Classification of surfaces|Surface_(topology)|Compact surfaces are classified through orientability and genus with appropriate boundary data.
knot-theory|Knot theory|Knot_theory|Embeddings of circles in three-dimensional space can be distinguished by topological invariants.
three-manifolds|Three-manifolds|3-manifold|Three-dimensional spaces admit particularly rich decomposition and geometric theories.
geometrization|Geometrization|Geometrization_conjecture|Closed three-manifolds can be decomposed into pieces with canonical geometric structures.
fixed-point-theorems|Fixed-point theorems|Fixed-point_theorem|Topological conditions can guarantee a map has a point that it leaves unchanged.
`);

section('discrete','combinatorics','Combinatorics','Combinatorics','Count configurations, prove they exist, and understand how discrete structures fit together.',`
counting|Counting principles|Rule_of_sum|Addition and multiplication rules count alternatives and successive choices.
permutations|Permutations|Permutation|An ordered arrangement differs from an unordered selection.
combinations|Combinations|Combination|Count subsets of a prescribed size without regard to order.
inclusion-exclusion|Inclusion–exclusion|Inclusion–exclusion_principle|Alternating intersection counts correct overcounting in a union.
pigeonhole|Pigeonhole principle|Pigeonhole_principle|More objects than containers force at least one container to contain multiple objects.
generating-functions|Generating functions|Generating_function|Coefficients of formal or convergent power series encode combinatorial sequences.
recurrences|Recurrence relations|Recurrence_relation|Later terms depend on earlier terms through a specified relation and initial data.
extremal-combinatorics|Extremal combinatorics|Extremal_combinatorics|Ask how large a discrete structure can be while avoiding a forbidden configuration.
ramsey|Ramsey theory|Ramsey_theory|Sufficiently large structures force organized substructures despite arbitrary colorings.
probabilistic-method|Probabilistic method|Probabilistic_method|Show a desired object exists by proving a randomly chosen object can have the required property.
`);
section('discrete','graphs','Graph theory','Graph_theory','Vertices and edges describe connectivity, routes, constraints, and finite networks.',`
graph-basics|Graphs & degree|Degree_(graph_theory)|A vertex’s degree counts incident edges, with loops counted twice in undirected graphs.
paths-cycles|Paths & cycles|Path_(graph_theory)|Paths follow successive edges; cycles return to their starting point without repeated intermediate vertices.
trees|Trees & forests|Tree_(graph_theory)|Connected acyclic graphs are trees; collections of trees form forests.
graph-connectivity|Graph connectivity|Connectivity_(graph_theory)|Connectivity measures whether and how robustly vertices remain linked by paths.
graph-coloring|Graph coloring|Graph_coloring|Assign colors subject to adjacency constraints on vertices, edges, or other graph objects.
planar-graphs|Planar graphs|Planar_graph|A planar graph can be drawn in the plane with no edge crossings except at shared endpoints.
matching|Matchings|Matching_(graph_theory)|A matching chooses edges without shared endpoints.
network-flows|Network flows|Flow_network|Flows satisfy capacity constraints and conservation through an oriented network.
random-graphs|Random graphs|Random_graph|Probability models on graphs reveal typical and threshold behavior of networks.
spectral-graph|Spectral graph theory|Spectral_graph_theory|Matrix spectra reveal connectivity, expansion, and other graph properties.
`);
children('trees',`
spanning-trees|Spanning trees|Spanning_tree|A spanning tree connects every vertex of a connected graph using no cycles.
rooted-trees|Rooted trees|Tree_(graph_theory)|Distinguishing a root turns a tree into a hierarchy with parent and child directions.
minimum-spanning|Minimum spanning trees|Minimum_spanning_tree|Choose a spanning tree whose total edge weight is as small as possible.
`);
section('discrete','order-theory','Order theory','Order_theory','Comparability, hierarchy, and lattice structure organize discrete and continuous mathematical objects.',`
partial-orders|Partial orders|Partially_ordered_set|Reflexive, antisymmetric, transitive relations permit some pairs to remain incomparable.
hasse-diagrams|Hasse diagrams|Hasse_diagram|Show cover relations of a finite partial order while omitting relations forced by transitivity.
order-lattices|Order lattices|Lattice_(order)|Pairs of elements have greatest lower bounds and least upper bounds.
boolean|Boolean algebra|Boolean_algebra|Complement, meet, and join abstract the algebra of logical truth and set operations.
mobius-inversion|Möbius inversion|Möbius_inversion_formula|Invert cumulative sums on divisibility orders or more general locally finite partial orders.
`);
section('discrete','designs-matroids','Designs & matroids','Combinatorial_design','Study balanced incidence patterns and abstract notions of independence.',`
design-theory|Combinatorial designs|Combinatorial_design|Arrange subsets so that specified incidences occur in a balanced, controlled way.
latin-squares|Latin squares|Latin_square|Each symbol appears exactly once in each row and column of a square array.
finite-geometries|Finite geometries|Finite_geometry|Incidence geometries with finitely many points link combinatorics to finite fields.
matroids|Matroids|Matroid|Independence axioms generalize linear independence and cycle-free subsets of graph edges.
enumerative-combinatorics|Enumerative combinatorics|Enumerative_combinatorics|Count structures using recurrences, bijections, generating functions, and algebraic methods.
`);

section('probability','probability-foundations','Probability foundations','Probability_space','A probability space combines possible outcomes, measurable events, and a normalized measure.',`
probability-basics|Events & probability|Probability|Events are measurable sets of outcomes; their probabilities obey countable additivity.
probability-axioms|Probability axioms|Probability_axioms|Nonnegativity, normalization, and countable additivity constrain every probability model.
independence|Independence|Independence_(probability_theory)|Joint probabilities factor when events or variables are independent.
conditional|Conditional probability|Conditional_probability|Restrict probability to outcomes consistent with an event of positive probability.
bayes|Bayes’ theorem|Bayes%27_theorem|Reverse conditional probabilities by combining likelihoods, priors, and marginal probabilities.
conditional-expectation|Conditional expectation|Conditional_expectation|A measurable projection expresses the best available expectation given specified information.
`);
section('probability','distributions','Random variables & distributions','Random_variable','Random variables turn outcomes into numbers; distributions describe their probabilities.',`
discrete-distributions|Discrete distributions|Discrete_probability_distribution|Probability masses assign weights to countably many possible values.
continuous-distributions|Continuous distributions|Probability_density_function|A density describes probability through integrals over sets rather than values at isolated points.
expectation|Expectation|Expected_value|An integrable random variable has a probability-weighted average.
variance|Variance & covariance|Variance|Second moments quantify spread and joint linear variation.
joint-distributions|Joint distributions|Joint_probability_distribution|Describe several random variables together, retaining their dependence.
characteristic-functions|Characteristic functions|Characteristic_function_(probability_theory)|Expected complex exponentials uniquely encode probability distributions.
`);
children('discrete-distributions',`
bernoulli|Bernoulli distribution|Bernoulli_distribution|One binary trial assigns probabilities p and 1 − p to two outcomes.
binomial|Binomial distribution|Binomial_distribution|Count successes in a fixed number of independent Bernoulli trials with common success probability.
poisson|Poisson distribution|Poisson_distribution|A nonnegative count distribution models independent events at a fixed average rate in standard Poisson settings.
geometric-distribution|Geometric distribution|Geometric_distribution|Count trials until a first success, or failures before it, depending on the stated convention.
`);
children('continuous-distributions',`
uniform-distribution|Uniform distribution|Continuous_uniform_distribution|A constant density assigns equal probability to equal-length subintervals within its support.
normal|Normal distribution|Normal_distribution|A mean and positive variance specify the familiar symmetric bell-shaped density.
exponential-distribution|Exponential distribution|Exponential_distribution|A memoryless positive waiting time is parametrized by a positive rate.
gamma-distribution|Gamma distribution|Gamma_distribution|Shape and rate or scale parameters generalize exponential waiting-time distributions.
beta-distribution|Beta distribution|Beta_distribution|A flexible density on the unit interval is useful for uncertain proportions.
`);
section('probability','probability-limits','Limit theorems','Limit_theorem','Different modes of convergence explain stable averages and universal limiting distributions.',`
probability-convergence|Modes of convergence|Convergence_of_random_variables|Almost sure, in-probability, distributional, and Lp convergence express different limiting requirements.
law-large-numbers|Law of large numbers|Law_of_large_numbers|Under suitable assumptions, sample averages converge to an expected value.
central-limit|Central limit theorem|Central_limit_theorem|Properly centered and scaled sums often approach a normal distribution under suitable conditions.
concentration|Concentration inequalities|Concentration_inequality|Bounds quantify how unlikely a random variable is to deviate far from its typical value.
large-deviations|Large deviations|Large_deviations_theory|Study exponential-scale probabilities of unusually large fluctuations.
`);
section('probability','stochastic-processes','Stochastic processes','Stochastic_process','Collections of random variables describe evolving random systems across time or another index.',`
markov|Markov chains|Markov_chain|Given the present state, earlier states provide no additional information about the next transition.
poisson-process|Poisson processes|Poisson_point_process|Independent increments with Poisson counts model arrivals under a constant-rate homogeneous model.
martingales|Martingales|Martingale_(probability_theory)|Conditional expected future value equals the current value under the defining integrability assumptions.
brownian|Brownian motion|Wiener_process|A continuous process with independent Gaussian increments is a central model of random fluctuation.
stationary-processes|Stationary processes|Stationary_process|Distributional properties are invariant under shifts of the time index in the relevant sense of stationarity.
ergodic-theory|Ergodic theory|Ergodic_theory|Invariant measures connect long-time averages with space averages for suitable dynamical systems.
`);
section('probability','stochastic-calculus','Stochastic calculus','Stochastic_calculus','Develop integration and differential equations driven by irregular random processes.',`
ito-integral|Itô integral|Itô_calculus|Construct stochastic integrals of adapted integrands against processes such as Brownian motion.
ito-lemma|Itô’s lemma|Itô%27s_lemma|A stochastic chain rule includes a second-derivative correction from quadratic variation.
stochastic-de|Stochastic differential equations|Stochastic_differential_equation|Differential models combine drift with a stochastic driving term.
diffusion-processes|Diffusion processes|Diffusion_process|Continuous random evolution connects stochastic equations to second-order differential operators.
`);

section('statistics','descriptive','Descriptive statistics','Descriptive_statistics','Summarize the center, variation, and shape of observed data without hiding the data-generating context.',`
central-tendency|Mean, median & mode|Central_tendency|Different notions of a typical value react differently to skew, outliers, and data type.
dispersion|Variance & spread|Statistical_dispersion|Spread summaries compare the variability of observations around a center.
quantiles|Quantiles|Quantile|Quantiles split an ordered distribution into prescribed probability portions.
correlation|Correlation|Correlation|Correlation measures selected forms of association and does not by itself establish causation.
empirical-distribution|Empirical distributions|Empirical_distribution_function|A sample defines a distribution by placing equal mass on each observed value.
`);
section('statistics','inference','Statistical inference','Statistical_inference','Use sample data and assumptions to estimate unknown features of a population or model.',`
sampling|Sampling & estimation|Sampling_(statistics)|A sampling mechanism determines how observations represent a target population.
estimators|Estimators|Estimator|An estimator is a statistic used to infer an unknown parameter.
bias-variance|Bias & variance of estimators|Bias_of_an_estimator|Bias and sampling variability capture different sources of estimation error.
likelihood|Likelihood|Likelihood_function|Treat the probability model of observed data as a function of its unknown parameters.
maximum-likelihood|Maximum likelihood|Maximum_likelihood_estimation|Choose parameter values that maximize the observed-data likelihood.
confidence-intervals|Confidence intervals|Confidence_interval|Repeated-sampling coverage is a property of the interval-producing procedure.
sufficiency|Sufficient statistics|Sufficient_statistic|A statistic retains all information in the sample about a parameter under a specified model.
`);
children('sampling',`
sampling-bias|Sampling bias|Sampling_bias|Systematic differences between inclusion and exclusion can distort an estimate regardless of sample size.
bootstrap|Bootstrap methods|Bootstrapping_(statistics)|Resampling from an empirical distribution approximates selected sampling properties of a statistic.
standard-error|Standard errors|Standard_error|A standard error describes the sampling variability of an estimator, rather than the spread of individual data values.
`);
section('statistics','hypothesis','Hypothesis testing','Statistical_hypothesis_test','Evaluate how observations compare with predictions of a specified null model.',`
null-alternative|Null & alternative hypotheses|Null_hypothesis|State the competing model claims before choosing a test and interpreting its result.
p-values|P-values|P-value|A p-value evaluates a specified extremeness event under the null model, not the probability that the null is true.
type-errors|Type I & II errors|Type_I_and_type_II_errors|Rejecting a true null and failing to reject a false null are distinct errors.
power|Statistical power|Power_(statistics)|Power is the rejection probability under a specified alternative data-generating process.
t-tests|t-tests|Student%27s_t-test|Studentized statistics compare means under the assumptions of the chosen test variant.
chi-square|Chi-squared tests|Chi-squared_test|Observed and expected counts can be compared with a chi-squared reference approximation under suitable assumptions.
multiple-testing|Multiple testing|Multiple_comparisons_problem|Performing many tests requires an explicit choice of familywise or false-discovery error control.
`);
section('statistics','regression','Regression & models','Regression_analysis','Model conditional outcomes, estimate relationships, and examine the assumptions behind predictions.',`
linear-regression|Linear regression|Linear_regression|A response is modeled as a linear combination of predictors with an error structure.
least-squares|Least squares|Least_squares|Minimize squared residuals to fit an approximation or a statistical model.
logistic-regression|Logistic regression|Logistic_regression|A logistic link relates predictors to the probability of a binary outcome.
generalized-linear|Generalized linear models|Generalized_linear_model|A link function and exponential-family response model extend ordinary linear regression.
regularization|Regularization|Regularization_(mathematics)|Penalties or constraints control model complexity and stabilize estimation.
model-selection|Model selection|Model_selection|Compare candidate models using predictive assessment, information criteria, or other justified objectives.
`);
section('statistics','bayesian-statistics','Bayesian statistics','Bayesian_statistics','Combine a prior distribution with a likelihood to obtain a posterior distribution.',`
priors-posteriors|Priors & posteriors|Posterior_probability|The posterior describes uncertainty about model quantities after conditioning on the observed data.
conjugacy|Conjugate priors|Conjugate_prior|A conjugate prior family retains its functional form after a specified likelihood update.
credible-intervals|Credible intervals|Credible_interval|A credible region contains a stated amount of posterior probability under a Bayesian model.
mcmc|Markov chain Monte Carlo|Markov_chain_Monte_Carlo|A suitably designed Markov chain supplies samples for approximating a target distribution.
bayes-factors|Bayes factors|Bayes_factor|Ratios of marginal likelihoods compare how models predict the observed data.
`);
section('statistics','statistical-design','Multivariate & experimental methods','Multivariate_statistics','Study interacting variables, dependence over time, and designs that support interpretable comparisons.',`
anova|Analysis of variance|Analysis_of_variance|Partition variation to compare model components or group means under an explicit error model.
experimental-design|Experimental design|Design_of_experiments|Randomization, blocking, and replication determine what comparisons data can support.
causal-inference|Causal inference|Causal_inference|Causal claims need assumptions or designs beyond observed association alone.
pca|Principal component analysis|Principal_component_analysis|Orthogonal directions capture successive amounts of variance in centered multivariate data.
time-series|Time series|Time_series|Temporal ordering introduces serial dependence, trends, and dynamic structure into observations.
nonparametric|Nonparametric statistics|Nonparametric_statistics|Statistical procedures avoid restricting the model to a fixed finite-dimensional parameter family.
`);

section('dynamics','differential-equations','Ordinary differential equations','Ordinary_differential_equation','Unknown functions of one independent variable are constrained by their derivatives.',`
first-order-ode|First-order ODEs|Ordinary_differential_equation|The highest derivative is first order, with a derivative prescribed through the current state and input.
linear-ode|Linear ODEs|Linear_differential_equation|The unknown function and its derivatives appear linearly, enabling superposition for homogeneous equations.
ode-systems|Systems of ODEs|Ordinary_differential_equation|Several coupled unknown functions evolve together as a vector-valued system.
existence-uniqueness|Existence & uniqueness|Picard–Lindelöf_theorem|Regularity assumptions give local existence and uniqueness for initial-value problems.
boundary-value|Boundary-value problems|Boundary_value_problem|Constraints at different endpoints replace or supplement initial data.
laplace-transform|Laplace transform|Laplace_transform|An integral transform turns many linear differential equations into algebraic relations.
`);
children('first-order-ode',`
separable-ode|Separable equations|Separation_of_variables|Separate dependent and independent factors, integrate, and check excluded equilibrium solutions.
integrating-factors|Integrating factors|Integrating_factor|Multiplying by a suitable function turns certain equations into an exact derivative.
exact-equations|Exact differential equations|Exact_differential_equation|A differential form comes from a potential function when the relevant exactness conditions hold.
`);
section('dynamics','pde','Partial differential equations','Partial_differential_equation','Derivatives with respect to several independent variables describe fields and spatial evolution.',`
pde-classification|PDE classification|Partial_differential_equation|Elliptic, parabolic, and hyperbolic types indicate different geometric and propagation behavior.
laplace-equation|Laplace & Poisson equations|Laplace%27s_equation|Elliptic equations describe harmonic potentials and responses to source terms.
heat-equation|Heat equation|Heat_equation|A parabolic equation models diffusion and the smoothing of spatial variation.
wave-equation|Wave equation|Wave_equation|A hyperbolic equation models finite-speed propagation of disturbances.
transport-equation|Transport equations|Advection_equation|First-order field equations carry quantities along a prescribed flow.
navier-stokes|Navier–Stokes equations|Navier–Stokes_equations|Velocity and pressure fields describe viscous fluid motion under continuum assumptions.
weak-solutions|Weak solutions|Weak_solution|An integral or distributional formulation permits solutions lacking classical derivatives.
characteristics|Method of characteristics|Method_of_characteristics|Follow special curves that reduce suitable first-order PDEs to ordinary differential equations.
`);
section('dynamics','dynamical-systems','Dynamical systems','Dynamical_system','Maps and flows organize the qualitative behavior of evolving states.',`
phase-space|Phase space|Phase_space|Each point records a complete state; trajectories trace its evolution.
equilibria|Equilibria & fixed points|Equilibrium_point|An equilibrium state does not change under the governing evolution.
stability|Stability theory|Stability_theory|Ask whether small perturbations remain small, decay, or grow.
lyapunov|Lyapunov functions|Lyapunov_function|A scalar function with controlled change along trajectories can establish stability.
bifurcations|Bifurcation theory|Bifurcation_theory|Qualitative dynamics change as model parameters cross special values.
chaos|Chaos theory|Chaos_theory|Deterministic evolution can show complex long-term behavior and sensitivity to initial conditions.
attractors|Attractors|Attractor|Trajectories from a surrounding region approach an invariant set in a specified sense.
`);
section('dynamics','control-theory','Control theory','Control_theory','Design inputs and feedback to influence the behavior of dynamical systems.',`
state-space|State-space models|State-space_representation|Matrices describe linear state dynamics, inputs, and observed outputs.
controllability|Controllability|Controllability|Ask which states can be reached by suitable admissible inputs.
observability|Observability|Observability|Ask whether internal states can be reconstructed from output information.
feedback|Feedback control|Control_theory|Use measured behavior to adjust an input and influence future system evolution.
optimal-control|Optimal control|Optimal_control|Choose a time-dependent input minimizing a cost while obeying dynamical constraints.
`);

section('optimization','convex-optimization','Convex optimization','Convex_optimization','Convex feasible sets and convex objectives permit strong global guarantees and useful dual problems.',`
convex-functions|Convex functions|Convex_function|The function’s value on a segment lies below the corresponding weighted average of endpoint values.
convex-programs|Convex programs|Convex_optimization|Minimize a convex objective over a convex feasible set.
lagrange-multipliers|Lagrange multipliers|Lagrange_multiplier|At a regular constrained extremum, objective and constraint gradients satisfy a compatibility condition.
kkt|Karush–Kuhn–Tucker conditions|Karush–Kuhn–Tucker_conditions|Stationarity, feasibility, and complementary slackness describe constrained candidates under suitable assumptions.
duality|Optimization duality|Duality_(optimization)|A related optimization problem produces bounds and sometimes exactly the same optimal value.
gradient-descent|Gradient descent|Gradient_descent|Take iterative steps against the gradient to reduce a differentiable objective under appropriate step-size conditions.
interior-point|Interior-point methods|Interior-point_method|Barrier-based iterations solve constrained programs while approaching an optimum through the interior.
`);
section('optimization','mathematical-programming','Mathematical programming','Mathematical_optimization','Express optimization tasks through variables, an objective, and explicit constraints.',`
linear-programming|Linear programming|Linear_programming|Optimize a linear function over a set described by linear equality and inequality constraints.
simplex-method|Simplex method|Simplex_algorithm|Move between vertices of a feasible polyhedron to improve a linear objective.
integer-programming|Integer programming|Integer_programming|Require some decision variables to be integers, introducing discrete feasibility constraints.
quadratic-programming|Quadratic programming|Quadratic_programming|A quadratic objective is optimized under prescribed constraints.
nonlinear-programming|Nonlinear programming|Nonlinear_programming|Objectives or constraints may be nonlinear, so local and global solutions must be distinguished.
dynamic-programming|Dynamic programming|Dynamic_programming|Decompose an optimization problem into overlapping subproblems with reusable optimal values.
`);
section('optimization','game-theory','Game theory','Game_theory','Study decisions whose outcomes depend on the interacting choices of several agents.',`
strategic-games|Strategic-form games|Normal-form_game|Specify agents, strategy sets, and payoffs for every joint strategy choice.
nash|Nash equilibrium|Nash_equilibrium|No player can improve its payoff by changing strategy alone while the others hold theirs fixed.
zero-sum|Zero-sum games|Zero-sum_game|One player’s gain exactly offsets the other player’s loss.
minimax|Minimax theorem|Minimax_theorem|Under suitable assumptions, optimal worst-case and best-response values coincide.
cooperative-games|Cooperative games|Cooperative_game_theory|Coalitions and transferable or nontransferable payoffs describe cooperation among agents.
mechanism-design|Mechanism design|Mechanism_design|Design interaction rules so agents’ incentives support a desired outcome.
`);
section('optimization','operations-research','Operations research','Operations_research','Allocate scarce resources and coordinate systems using mathematical models and algorithms.',`
queueing|Queueing theory|Queueing_theory|Random arrivals, service, and congestion determine waiting times and system occupancy.
scheduling|Scheduling theory|Scheduling_(computing)|Allocate jobs to resources across time under precedence and capacity constraints.
inventory|Inventory theory|Inventory_theory|Balance ordering, holding, and shortage costs under uncertainty and demand constraints.
transportation|Transportation problems|Transportation_theory_(mathematics)|Find efficient assignments of mass or goods from sources to destinations.
optimal-transport|Optimal transport|Transportation_theory_(mathematics)|Compare and transform probability measures by minimizing a transport cost.
decision-theory|Decision theory|Decision_theory|Evaluate actions through preferences, information, uncertainty, and a loss or utility model.
`);

section('computation','algorithms','Algorithms','Algorithm','Finite procedures need precise inputs, outputs, correctness arguments, and resource bounds.',`
algorithm-correctness|Correctness & invariants|Loop_invariant|An invariant stays true through an iteration and can support a proof of algorithmic correctness.
divide-conquer|Divide & conquer|Divide-and-conquer_algorithm|Split a task into smaller instances, solve them, and combine the results.
greedy-algorithms|Greedy algorithms|Greedy_algorithm|Choose locally favorable actions; special structure is needed for global optimality.
graph-algorithms|Graph algorithms|Graph_traversal|Traverse and analyze finite networks to answer reachability, distance, and structural questions.
randomized-algorithms|Randomized algorithms|Randomized_algorithm|Random choices can simplify a procedure or improve expected resource use.
symbolic-computation|Symbolic computation|Computer_algebra|Manipulate exact expressions such as polynomials and rational functions rather than only numeric approximations.
`);
section('computation','complexity','Computational complexity','Computational_complexity_theory','Study resource requirements of computational problems as input size grows.',`
asymptotic-notation|Asymptotic notation|Big_O_notation|Upper, lower, and tight asymptotic bounds compare growth while suppressing fixed constants.
p-np|P, NP & NP-completeness|NP-completeness|Distinguish efficiently solvable problems from efficiently verifiable ones and the hardest problems within NP.
reductions|Computational reductions|Reduction_(complexity)|Transform one problem into another to compare their computational difficulty.
space-complexity|Space complexity|Space_complexity|Memory requirements provide a different resource measure from execution time.
approximation-algorithms|Approximation algorithms|Approximation_algorithm|Prove quantitative quality guarantees when an exact optimum is computationally difficult to obtain.
`);
section('computation','computability','Computability','Computability_theory','Some precisely described decision problems cannot be solved by any general terminating algorithm.',`
turing-machines|Turing machines|Turing_machine|An idealized machine formalizes a general notion of effective symbolic computation.
halting-problem|Halting problem|Halting_problem|No algorithm can decide termination correctly for every program and input.
decidability|Decidability|Decidability_(logic)|A decision problem is decidable when one algorithm always halts with the correct yes-or-no answer.
automata|Automata theory|Automata_theory|Finite and other restricted machines characterize classes of formal languages.
recursive-functions|Recursive functions|General_recursive_function|Function-building rules provide a formal model equivalent in power to Turing computation.
`);
section('computation','numerical','Numerical analysis','Numerical_analysis','Approximate mathematical problems while controlling discretization, conditioning, stability, and rounding error.',`
numerical-errors|Errors & floating point|Floating-point_arithmetic|Finite representations introduce rounding; numerical errors must be distinguished from modeling and truncation errors.
conditioning|Conditioning & stability|Condition_number|Conditioning concerns sensitivity of a problem; stability concerns the behavior of a chosen algorithm.
root-finding|Root finding|Root-finding_algorithms|Iterative methods locate values at which a function vanishes.
interpolation|Interpolation|Interpolation|Construct a function matching prescribed values at specified nodes.
numerical-integration|Numerical integration|Numerical_integration|Weighted function evaluations approximate an integral with a quantifiable error model.
numerical-linear|Numerical linear algebra|Numerical_linear_algebra|Stable factorizations and iterative methods solve large linear algebra problems.
numerical-de|Numerical differential equations|Numerical_methods_for_ordinary_differential_equations|Time stepping or spatial discretization turns differential models into finite computations.
`);
children('root-finding',`
bisection|Bisection method|Bisection_method|A sign-changing interval for a continuous function is repeatedly halved to enclose a root.
newton-method|Newton’s method|Newton%27s_method|A tangent-line correction refines a root estimate when the derivative and convergence conditions cooperate.
secant-method|Secant method|Secant_method|Approximate a derivative from previous function values to generate a root-finding iteration.
`);
children('numerical-linear',`
gaussian-elimination|Gaussian elimination|Gaussian_elimination|Elementary row operations reduce a linear system; pivoting helps manage numerical stability.
iterative-solvers|Iterative linear solvers|Iterative_method|Successive approximations solve systems without requiring an explicit matrix inverse.
conjugate-gradient|Conjugate gradients|Conjugate_gradient_method|Exploit positive-definite symmetric structure through mutually conjugate search directions.
eigenvalue-algorithms|Eigenvalue algorithms|Eigenvalue_algorithm|Numerical iterations approximate spectral values and invariant subspaces.
`);
children('numerical-de',`
euler-method|Euler method|Euler_method|A first-order step follows the current derivative over a short interval.
runge-kutta|Runge–Kutta methods|Runge–Kutta_methods|Several derivative evaluations combine into a higher-order time step.
finite-differences|Finite differences|Finite_difference_method|Approximate derivatives by differences on a grid to obtain algebraic equations.
finite-elements|Finite elements|Finite_element_method|Piecewise basis functions approximate weak formulations on a partitioned domain.
spectral-methods|Spectral methods|Spectral_method|Global basis expansions approximate functions and differential operators with high accuracy for smooth problems.
`);

section('information','information-theory','Information theory','Information_theory','Quantify uncertainty and the limits of communication and lossless or lossy representation.',`
entropy|Shannon entropy|Entropy_(information_theory)|Expected information content quantifies uncertainty in a discrete random variable.
mutual-information|Mutual information|Mutual_information|Measure how much a joint distribution departs from independence.
kl-divergence|Kullback–Leibler divergence|Kullback–Leibler_divergence|A directional divergence compares probability distributions and is not a distance metric.
channel-capacity|Channel capacity|Channel_capacity|A communication channel has a maximum achievable reliable transmission rate under its stated constraints.
source-coding|Source coding|Source_coding_theorem|Entropy limits asymptotically efficient lossless representation under a specified source model.
rate-distortion|Rate–distortion theory|Rate–distortion_theory|Quantify the least coding rate needed when a specified average distortion is allowed.
`);
section('information','coding-theory','Coding theory','Coding_theory','Build redundancy into representations so transmission errors can be detected or corrected.',`
error-correcting|Error-correcting codes|Error_correction_code|Redundant codewords permit recovery from a bounded or modeled pattern of corruption.
linear-codes|Linear codes|Linear_code|A linear subspace over a finite field provides algebraic structure for encoding and decoding.
hamming-distance|Hamming distance|Hamming_distance|Count positions at which equal-length strings differ.
reed-solomon|Reed–Solomon codes|Reed–Solomon_error_correction|Polynomial evaluation over finite fields produces codes with strong erasure and error-correction properties.
ldpc|LDPC codes|Low-density_parity-check_code|Sparse parity constraints support efficient iterative decoding of long blocks.
`);
section('information','cryptography','Mathematical cryptography','Cryptography','Algebra, number theory, and computational assumptions underlie encryption, signatures, and protocols.',`
public-key|Public-key cryptography|Public-key_cryptography|Separate public verification or encryption information from private signing or decryption information.
rsa|RSA arithmetic|RSA_cryptosystem|Modular exponentiation and integer factorization underpin a major public-key construction.
discrete-log|Discrete logarithms|Discrete_logarithm|Recovering an exponent from a group element is difficult in suitable carefully chosen groups.
elliptic-crypto|Elliptic-curve cryptography|Elliptic-curve_cryptography|Finite groups of points on elliptic curves support public-key operations.
cryptographic-hashes|Cryptographic hashes|Cryptographic_hash_function|Compress inputs into fixed-length outputs with specific computational resistance properties.
zero-knowledge|Zero-knowledge proofs|Zero-knowledge_proof|Convince a verifier of a claim without revealing additional information under a defined security model.
`);
section('information','signal-processing','Mathematical signal processing','Signal_processing','Model signals as functions or sequences and transform them to expose their structure.',`
sampling-theorem|Sampling theorem|Nyquist–Shannon_sampling_theorem|Band-limited signals can be recovered from sufficiently frequent ideal samples under the theorem’s assumptions.
discrete-fourier|Discrete Fourier transform|Discrete_Fourier_transform|A finite sequence is decomposed into discrete periodic frequency components.
fft|Fast Fourier transform|Fast_Fourier_transform|Exploit factorization to compute a discrete Fourier transform more efficiently.
linear-filters|Linear filters|Linear_filter|Linear systems transform signals, often through convolution with an impulse response.
`);

section('math-physics','analytical-mechanics','Analytical mechanics','Analytical_mechanics','Variational principles and geometric state spaces reformulate classical motion.',`
lagrangian-mechanics|Lagrangian mechanics|Lagrangian_mechanics|Stationary action yields equations for generalized coordinates.
hamiltonian-mechanics|Hamiltonian mechanics|Hamiltonian_mechanics|Position and momentum evolve through a Hamiltonian function and symplectic structure.
noether|Noether’s theorem|Noether%27s_theorem|Continuous variational symmetries yield conserved quantities under appropriate conditions.
poisson-brackets|Poisson brackets|Poisson_bracket|A bracket on observables expresses Hamiltonian evolution and algebraic relations between quantities.
`);
section('math-physics','quantum-mathematics','Quantum mathematics','Mathematical_formulation_of_quantum_mechanics','Hilbert spaces, operators, and spectral structures describe quantum models.',`
self-adjoint|Self-adjoint operators|Self-adjoint_operator|An operator equals its adjoint with the required domain conditions, supporting real spectral measurements.
schrodinger-equation|Schrödinger equation|Schrödinger_equation|A quantum state evolves according to a Hamiltonian operator.
quantum-probability|Quantum probability|Quantum_probability|Noncommutative observables generalize aspects of classical probabilistic structure.
operator-algebras|Operator algebras|Operator_algebra|Algebras of operators connect functional analysis to quantum observables and symmetry.
`);
section('math-physics','geometric-physics','Geometry & fields','Mathematical_physics','Manifolds, connections, and differential equations provide a language for spacetime and fields.',`
pseudo-riemannian|Pseudo-Riemannian manifolds|Pseudo-Riemannian_manifold|A nondegenerate metric may have mixed signs rather than being positive definite.
einstein-equations|Einstein field equations|Einstein_field_equations|Spacetime curvature is related to stress-energy through tensor field equations.
gauge-theory|Gauge theory|Gauge_theory|Connections and local symmetries organize classical and quantum field models.
statistical-mechanics|Statistical mechanics|Statistical_mechanics|Probability distributions over microstates connect microscopic models to macroscopic thermodynamic quantities.
`);

// Eight outer areas and the central foundations core form one atlas.
children('statistics',`
statistical-models|Statistical models|Statistical_model|Probability models specify families of possible data-generating processes and their unknown quantities.
statistical-learning|Statistical learning|Statistical_learning_theory|Study prediction and generalization from finite data through probabilistic models and complexity control.
computational-statistics|Computational statistics|Computational_statistics|Simulation, resampling, and numerical algorithms support statistical inference and model assessment.
statistical-theory|Statistical theory|Statistical_theory|The mathematical foundations of inference study statistical models, estimation, information, and decision rules.
`);
children('descriptive',`
order-statistics|Order statistics|Order_statistic|An order statistic is an observation selected by its rank in an ordered sample.
statistical-data|Statistical data types|Statistical_data_type|Measurement scales and data structures determine which statistical operations and models are appropriate.
`);
children('geometry',`
fractals|Fractal geometry|Fractal|Scale-sensitive structures can have dimensions differing from their ordinary topological dimension.
metric-geometry|Metric geometry|Metric_geometry|Study spaces through distances and their geometric consequences without assuming smooth coordinates.
`);
const moves: Record<string,string> = { arithmetic:'number',topology:'geometry',dynamics:'analysis',optimization:'computation',information:'computation','math-physics':'analysis' };
for (const entry of catalog) if (moves[entry.id]) entry.parentId = moves[entry.id];
catalog.find(n=>n.id==='geometry')!.title = 'Geometry & topology';
catalog.find(n=>n.id==='analysis')!.title = 'Calculus & analysis';
catalog.find(n=>n.id==='number')!.title = 'Numbers & number theory';
catalog.find(n=>n.id==='computation')!.title = 'Computation & optimization';
