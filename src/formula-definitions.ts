/** Reviewed definitions take precedence over automatically selected source
 * equations. Both compact notation and the mathematical hypotheses are kept. */
export interface Definition{text:string;tex:string;condition:string;example?:string;previewTex?:string}
export const definitions:Record<string,Definition>=Object.fromEntries(String.raw`
distance|d(x,z) ≤ d(x,y) + d(y,z)|d(x,z)\le d(x,y)+d(y,z)|The triangle inequality is one of the metric axioms, alongside symmetry, nonnegativity, and d(x,y)=0 exactly when x=y.
metric-spaces|d: X × X → [0,∞)|d:X\times X\longrightarrow[0,\infty)|A metric is symmetric, separates distinct points, and satisfies the triangle inequality.
metric-geometry|L(γ) = ∫ ‖γ′(t)‖ dt|L(\gamma)=\int_a^b\lVert\gamma'(t)\rVert\,dt|This length formula applies to a piecewise continuously differentiable curve in Euclidean space; general metric spaces define length by suprema of partition sums.
wp-euclidean-distance|d₂(x,y) = √Σᵢ(xᵢ − yᵢ)²|d_2(x,y)=\sqrt{\sum_{i=1}^n(x_i-y_i)^2}|For x,y in real n-dimensional Euclidean space with orthonormal coordinates.|Between (0,0) and (3,4), the Euclidean distance is 5.
wp-taxicab-geometry|d₁(x,y) = Σᵢ ∣xᵢ − yᵢ∣|d_1(x,y)=\sum_{i=1}^n\lvert x_i-y_i\rvert|For real coordinate vectors, taxicab distance adds the absolute displacement along each axis.|Between (0,0) and (3,4), the taxicab distance is 7.
wp-hausdorff-distance|dH(A,B) = max{supₐ∈A infᵦ∈B d(a,b), supᵦ∈B infₐ∈A d(a,b)}|d_H(A,B)=\max\!\left\{\sup_{a\in A}\inf_{b\in B}d(a,b),\;\sup_{b\in B}\inf_{a\in A}d(a,b)\right\}|For nonempty compact subsets A,B of a metric space, this defines a finite metric. On arbitrary nonempty subsets it can be infinite or fail to distinguish a set from its closure.|The Hausdorff distance between the intervals [0,1] and [0,2] in ℝ is 1.
wp-complete-metric-space|Cauchy sequence ⇒ convergent in X|\text{Cauchy in }X\implies\text{converges in }X|This is the defining completeness property: every Cauchy sequence has a limit belonging to the metric space.
wp-pseudometric-space|x ≠ y may still have d(x,y) = 0|x\ne y\ \text{may have}\ d(x,y)=0|A pseudometric satisfies nonnegativity, symmetry, and the triangle inequality but may assign distance zero to distinct points.
wp-ball-mathematics|B(x,r) = {y : d(x,y) < r}|B(x,r)=\{y\in X:d(x,y)<r\}|This is the open radius-r ball centered at x in a metric space, with r>0.
wp-contraction-mapping|d(Tx,Ty) ≤ q d(x,y), 0 ≤ q < 1|d(Tx,Ty)\le q\,d(x,y),\quad 0\le q<1|A contraction has one uniform contraction factor q for all x,y in its domain.
wp-banach-fixed-point-theorem|T(x*) = x*; xₙ₊₁ = T(xₙ) → x*|T(x^*)=x^*,\qquad T^n(x_0)\to x^*|A contraction from a nonempty complete metric space into itself has a unique fixed point, and iteration from any point converges to it.
cauchy-sequences|∀ε>0 ∃N: m,n≥N ⇒ d(xₘ,xₙ)<ε|\forall\varepsilon>0\ \exists N:\ m,n\ge N\Rightarrow d(x_m,x_n)<\varepsilon|Terms of a Cauchy sequence eventually become arbitrarily close to each other; convergence inside the space additionally requires completeness.
norms|‖x + y‖ ≤ ‖x‖ + ‖y‖|\lVert x+y\rVert\le\lVert x\rVert+\lVert y\rVert|A norm is nonnegative, vanishes only at zero, is absolutely homogeneous, and satisfies this triangle inequality.
inner-products|‖x‖ = √⟨x,x⟩|\lVert x\rVert=\sqrt{\langle x,x\rangle}|Every real or complex inner product induces a norm and hence a distance d(x,y)=‖x−y‖.
wp-mahalanobis-distance|dM(x,y) = √((x−y)ᵀΣ⁻¹(x−y))|d_M(x,y)=\sqrt{(x-y)^\mathsf{T}\Sigma^{-1}(x-y)}|Σ is a symmetric positive-definite covariance matrix; the inverse weights differences according to scale and correlation.
wp-hellinger-distance|H²(P,Q) = ½∫(√p − √q)² dμ|H^2(P,Q)=\tfrac12\int(\sqrt p-\sqrt q)^2\,d\mu|P,Q have densities p,q with respect to a common dominating measure μ. This convention puts H between zero and one.
wp-bhattacharya-coefficient|DB(P,Q) = −log∫√pq dμ|D_B(P,Q)=-\log\int\sqrt{pq}\,d\mu|For probability densities p,q relative to a common measure. Unlike Hellinger distance, this divergence need not satisfy the triangle inequality.
wp-earth-mover-s-distance|W₁(P,Q) = infπ∈Π(P,Q) ∫d(x,y) dπ|W_1(P,Q)=\inf_{\pi\in\Pi(P,Q)}\int d(x,y)\,d\pi|Π(P,Q) is the set of couplings with marginals P and Q; finite first moments give a finite Wasserstein-1 distance.
wp-total-variation-distance-of-probability-measures|TV(P,Q) = supA ∣P(A) − Q(A)∣|\operatorname{TV}(P,Q)=\sup_A\lvert P(A)-Q(A)\rvert|The supremum is over measurable events. For densities this equals one half of the integral of their absolute difference.
wp-bregman-divergence|DF(x,y) = F(x)−F(y)−⟨∇F(y),x−y⟩|D_F(x,y)=F(x)-F(y)-\langle\nabla F(y),x-y\rangle|F is differentiable and strictly convex on a convex domain. Bregman divergence is generally asymmetric and is not a metric.
wp-probability-metric|TV(P,Q) = ½∫∣p−q∣ dμ|\operatorname{TV}(P,Q)=\tfrac12\int\lvert p-q\rvert\,d\mu|Total variation is one example of a statistical distance. Statistical divergences are not all metrics.
sets|A ∪ B = {x : x∈A or x∈B}|A\cup B=\{x:x\in A\ \text{or}\ x\in B\}|Union contains the elements belonging to at least one of the two sets.
logic|P ⇒ Q ≡ ¬P ∨ Q|(P\Rightarrow Q)\equiv(\neg P\lor Q)|Material implication has this truth-functional equivalence in classical propositional logic.
propositional-logic|¬(P ∧ Q) ≡ ¬P ∨ ¬Q|\neg(P\land Q)\equiv\neg P\lor\neg Q|De Morgan's law is an equivalence of classical propositions.
first-order-logic|∀x P(x); ∃x P(x)|\forall x\,P(x)\qquad\exists x\,P(x)|The quantifiers range over the domain of the structure: respectively every element and at least one element.
categories|g ∘ f: A → C|A\xrightarrow{f}B\xrightarrow{g}C\quad\leadsto\quad g\circ f:A\to C|Composable morphisms in a category have an associative composite and identity morphisms at every object.
type-theory|Γ ⊢ t : A|\Gamma\vdash t:A|A typing judgment states that term t has type A under assumptions in context Γ.
lambda-calculus|(λx.M)N →β M[x := N]|(\lambda x.M)N\ \longrightarrow_\beta\ M[x:=N]|Beta reduction uses capture-avoiding substitution of N for free occurrences of x in M.
elementary-algebra|a(x + y) = ax + ay|a(x+y)=ax+ay|The distributive law is valid for ordinary real and complex arithmetic and in rings.
linear-independence|Σᵢaᵢvᵢ=0 ⇒ a₁=⋯=aₙ=0|\sum_i a_i v_i=0\implies a_1=\cdots=a_n=0|A finite list of vectors is linearly independent exactly when its only zero linear combination is the trivial one.
basis|v = a₁e₁ + ⋯ + aₙeₙ|v=a_1e_1+\cdots+a_ne_n|In a finite-dimensional vector space, a basis gives each vector a unique coordinate expansion.
linear-maps|T(αx + βy) = αT(x) + βT(y)|T(\alpha x+\beta y)=\alpha T(x)+\beta T(y)|This identity must hold for all input vectors and scalars over the common field.
matrix-decompositions|A = QR|A=QR|Every real m×n matrix with m≥n admits a QR factorization with Q having orthonormal columns and R upper triangular.
subgroups|H ≤ G|H\le G|A subgroup contains the identity and is closed under products and inverses of its elements.
normal-subgroups|gNg⁻¹ = N for every g∈G|gNg^{-1}=N\quad(g\in G)|A subgroup N is normal precisely when conjugation by each group element preserves N.
polynomials|p(x) = Σₖ₌₀ⁿaₖxᵏ|p(x)=\sum_{k=0}^n a_kx^k|A polynomial has finitely many terms with nonnegative integer exponents and coefficients in a specified ring.
modular|a ≡ b (mod n) ⇔ n divides a−b|a\equiv b\pmod n\iff n\mid(a-b)|The modulus n is a positive integer; congruence identifies integers with the same remainder.
divisibility|a ∣ b ⇔ b = ak for some k∈ℤ|a\mid b\iff b=ak\text{ for some }k\in\mathbb Z|This defines integer divisibility.
primes|p ≥ 2; positive divisors are 1,p|p\ge2,\qquad d\mid p\Rightarrow d\in\{1,p\}\ (d>0)|A prime is an integer at least two having exactly two positive divisors.
prime-number-theorem|π(x) ∼ x/log x|\pi(x)\sim\frac{x}{\log x}|As x tends to infinity, the ratio of the prime-counting function π(x) to x/log x tends to one.
arithmetic|a + b = b + a|a+b=b+a|Ordinary addition is commutative in the integer, rational, real, and complex number systems.
calculus|d/dx ∫ₐˣf(t)dt = f(x)|\frac{d}{dx}\int_a^x f(t)\,dt=f(x)|For continuous f, differentiation recovers the integrand from its variable-upper-limit integral.
derivatives|f′(x) = limₕ→₀(f(x+h)−f(x))/h|f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}h|The derivative exists when this limit exists as a finite value.
integrals|∫ₐᵇ f(x)dx = lim Σᵢf(ξᵢ)Δxᵢ|\int_a^b f(x)\,dx=\lim_{\lVert P\rVert\to0}\sum_i f(\xi_i)\Delta x_i|For a Riemann-integrable f, tagged partition sums converge as the maximum subinterval length tends to zero.
series|Sₙ = Σₖ₌₁ⁿaₖ; Sₙ → S|S_n=\sum_{k=1}^n a_k,\qquad S_n\to S|An infinite series converges to S exactly when its partial sums converge to the finite limit S.
measure|μ(⋃ₙAₙ) = Σₙμ(Aₙ)|\mu\!\left(\bigcup_{n=1}^\infty A_n\right)=\sum_{n=1}^\infty\mu(A_n)|Countable additivity holds for pairwise disjoint measurable sets; a measure also assigns zero to the empty set.
functional-analysis|‖Tx‖ ≤ C‖x‖|\lVert Tx\rVert\le C\lVert x\rVert|A linear map between normed spaces is bounded exactly when one such finite constant works for every input; this is equivalent to continuity.
complex-analysis|∂u/∂x = ∂v/∂y; ∂u/∂y = −∂v/∂x|u_x=v_y,\qquad u_y=-v_x|The Cauchy–Riemann equations are necessary for complex differentiability of f=u+iv; with continuous first partial derivatives nearby, they imply holomorphicity.
harmonic-analysis|f(x) ∼ Σₙcₙe²πⁱⁿˣ|f(x)\sim\sum_{n\in\mathbb Z}c_ne^{2\pi i n x}|A Fourier expansion of a 1-periodic function; the meaning and validity of convergence depend on the function space.
fourier-series|cₙ = ∫₀¹f(x)e⁻²πⁱⁿˣ dx|c_n=\int_0^1 f(x)e^{-2\pi i n x}\,dx|These Fourier coefficients use period one and the complex exponential convention; integrability suffices for each coefficient.
differential-equations|y′(t) = f(t,y(t))|y'(t)=f(t,y(t))|A first-order ordinary differential equation relates an unknown function to its derivative; initial data select a solution when suitable existence and uniqueness assumptions hold.
pde|∂u/∂t = αΔu|\frac{\partial u}{\partial t}=\alpha\Delta u|The heat equation, with diffusivity α>0, is one important PDE. Initial and boundary conditions are part of a well-posed problem.
heat-equation|uₜ = αΔu|u_t=\alpha\Delta u|This homogeneous heat equation uses constant diffusivity α>0; a domain and initial/boundary data must be specified.
wave-equation|uₜₜ = c²Δu|u_{tt}=c^2\Delta u|This homogeneous wave equation has propagation speed c>0; appropriate initial and boundary data determine the problem.
probability|P(Ω) = 1|P(\Omega)=1|A probability measure is nonnegative, countably additive on disjoint measurable events, and assigns total mass one.
probability-foundations|P(A∪B) = P(A)+P(B)−P(A∩B)|P(A\cup B)=P(A)+P(B)-P(A\cap B)|The addition rule holds for any two measurable events A and B.
distributions|FX(x) = P(X ≤ x)|F_X(x)=P(X\le x)|The cumulative distribution function of a real random variable is nondecreasing, right-continuous, and has limits zero and one at the ends of the real line.
discrete-distributions|P(X=x) ≥ 0; ΣₓP(X=x) = 1|p(x)\ge0,\qquad\sum_xp(x)=1|A probability mass function assigns probabilities to countably many possible values.
continuous-distributions|P(a≤X≤b) = ∫ₐᵇ fX(x)dx|P(a\le X\le b)=\int_a^b f_X(x)\,dx|For an absolutely continuous distribution, the density fX is nonnegative and integrates to one over ℝ.
normal|f(x) = e⁻⁽ˣ⁻μ⁾²ᐟ⁽²σ²⁾/(σ√2π)|f(x)=\frac{1}{\sigma\sqrt{2\pi}}e^{-(x-\mu)^2/(2\sigma^2)}|A normal density has location μ∈ℝ and scale σ>0, with variance σ².
binomial|P(X=k) = C(n,k)pᵏ(1−p)ⁿ⁻ᵏ|P(X=k)=\binom nk p^k(1-p)^{n-k}|X counts successes in n independent Bernoulli trials with common success probability p; k=0,…,n.
poisson|P(X=k) = e⁻λλᵏ/k!|P(X=k)=e^{-\lambda}\frac{\lambda^k}{k!}|The Poisson distribution has λ>0 and support k=0,1,2,…; its mean and variance equal λ.
exponential|f(x) = λe⁻λˣ, x≥0|f(x)=\lambda e^{-\lambda x}\quad(x\ge0)|The rate λ is positive; the density is zero for negative x and the mean is 1/λ.
conditional|P(A∣B) = P(A∩B)/P(B)|P(A\mid B)=\frac{P(A\cap B)}{P(B)}|For event conditioning this formula requires P(B)>0.
independence|P(A∩B) = P(A)P(B)|P(A\cap B)=P(A)P(B)|Two events are independent exactly when their intersection probability factors this way.
markov|P(Xₙ₊₁=j∣Xₙ=i,…,X₀) = P(Xₙ₊₁=j∣Xₙ=i)|P(X_{n+1}=j\mid X_n,\ldots,X_0)=P(X_{n+1}=j\mid X_n)|The Markov property says that the present state contains the past information relevant for the next transition; time homogeneity is a separate assumption.
statistics|x̄ = (1/n)Σᵢxᵢ|\bar x=\frac1n\sum_{i=1}^n x_i|The arithmetic sample mean summarizes n numerical observations, with n≥1.
descriptive|s² = Σᵢ(xᵢ−x̄)²/(n−1)|s^2=\frac1{n-1}\sum_{i=1}^n(x_i-\bar x)^2|For n>1, this is the sample variance. It is unbiased for the population variance under independent identically distributed sampling with finite second moment.
sampling|SE(x̄) = σ/√n|\operatorname{SE}(\bar X)=\frac{\sigma}{\sqrt n}|For n independent identically distributed observations with population standard deviation σ<∞.
likelihood|L(θ;x) = pθ(x)|L(\theta;x)=p_\theta(x)|The observed data x are fixed while the likelihood is viewed as a function of the model parameter θ. It is not itself a probability distribution over θ.
inference|θ̂ = T(X₁,…,Xₙ)|\hat\theta=T(X_1,\ldots,X_n)|An estimator is a statistic used to infer a population or model parameter; its properties depend on the sampling model.
hypothesis|p = Pₕ₀(T ≥ tobs)|p=P_{H_0}(T\ge t_{\mathrm{obs}})|For a prespecified right-tailed test, the p-value is a null-model tail probability. It is not the probability that the null hypothesis is true.
p-values|p = Pₕ₀(T ≥ tobs)|p=P_{H_0}(T\ge t_{\mathrm{obs}})|This right-tailed-test convention assumes the null distribution of the statistic T is specified. Other test directions define different tail events.
regression|Y = Xβ + ε|Y=X\beta+\varepsilon|A linear model expresses the response using a design matrix and an error term. Inferential conclusions require assumptions on that error and the data collection.
bayesian-statistics|p(θ∣x) ∝ p(x∣θ)p(θ)|p(\theta\mid x)\propto p(x\mid\theta)p(\theta)|The posterior is proportional to likelihood times prior, provided the normalizing marginal probability or density is finite and positive.
least-squares|β̂ ∈ argminβ ‖y−Xβ‖²|\hat\beta\in\operatorname*{arg\,min}_{\beta}\lVert y-X\beta\rVert^2|Ordinary least squares minimizes squared Euclidean residuals; uniqueness requires full column rank of X.
time-series|γ(h) = Cov(Xₜ,Xₜ₊ₕ)|\gamma(h)=\operatorname{Cov}(X_t,X_{t+h})|For a weakly stationary time series, this covariance depends on the lag h rather than the time t, with finite second moments.
statistical-learning|R(f) = E[ℓ(Y,f(X))]|R(f)=\mathbb E[\ell(Y,f(X))]|Population risk is the expected prediction loss under the data-generating distribution, whenever this expectation is defined.
combinatorics|C(n,k) = n!/(k!(n−k)!)|\binom nk=\frac{n!}{k!(n-k)!}|This counts k-element subsets of an n-element set, for integers 0≤k≤n.
graphs|Σᵥdeg(v) = 2∣E∣|\sum_{v\in V}\deg(v)=2\lvert E\rvert|For a finite undirected graph, each edge contributes two to the sum of degrees; a loop contributes two at its vertex.
order-theory|x≤y and y≤z ⇒ x≤z|x\le y\land y\le z\implies x\le z|Transitivity is one axiom of a partial order, alongside reflexivity and antisymmetry.
algorithms|T(n) = 2T(n/2) + Θ(n)|T(n)=2T(n/2)+\Theta(n)|A representative divide-and-conquer recurrence, such as merge sort, has solution Θ(n log n) under the usual base and rounding conventions.
computation|λx.x|\lambda x.x|The identity function in lambda calculus returns its argument; computation also studies algorithms, complexity, and numerical methods.
computability|A ≤m B ⇔ ∃ computable f: x∈A ⇔ f(x)∈B|A\le_m B\iff\exists f\text{ computable}:\ x\in A\iff f(x)\in B|A many-one reduction transforms membership in A into membership in B by one total computable function f.
complexity|P ⊆ NP|\mathsf P\subseteq\mathsf{NP}|Every decision problem solvable in deterministic polynomial time has polynomial-time verifiable yes certificates. Equality is an open question.
numerical|relative error = ∣x̂−x∣/∣x∣|\text{relative error}=\frac{\lvert\hat x-x\rvert}{\lvert x\rvert}|Relative error compares an approximation x̂ with a nonzero exact value x. Absolute error is meaningful even when x=0.
optimization|minₓ∈C f(x)|\min_{x\in C}f(x)|An optimization problem specifies an objective f and feasible set C. A minimum exists only under suitable assumptions.
convex-optimization|f(tx+(1−t)y) ≤ tf(x)+(1−t)f(y)|f(tx+(1-t)y)\le tf(x)+(1-t)f(y)|A convex objective satisfies this inequality for x,y in its convex domain and every t∈[0,1]. Convex optimization also requires convex constraints.
information-theory|H(X) = −Σₓp(x)log₂p(x)|H(X)=-\sum_xp(x)\log_2p(x)|Discrete Shannon entropy uses the convention 0 log 0=0; the logarithm base two gives bits.
coding-theory|dmin ≥ 2t + 1|d_{\min}\ge2t+1|A block code with minimum Hamming distance at least 2t+1 can uniquely correct up to t symbol errors.
control-theory|ẋ = Ax + Bu; y = Cx + Du|\dot x=Ax+Bu,\qquad y=Cx+Du|This continuous-time linear state-space model relates state x, input u, and output y through compatible matrices.
topology|f continuous ⇔ f⁻¹(U) is open for every open U|f\text{ continuous}\iff f^{-1}(U)\text{ open for all open }U|For a map f:X→Y of topological spaces, continuity means that preimages of open subsets of Y are open in X.
euclidean|a² + b² = c²|a^2+b^2=c^2|In a Euclidean right triangle, a,b are the perpendicular side lengths and c is the hypotenuse.
central-tendency|x̄ = (1/n)Σᵢxᵢ|\bar x=\frac1n\sum_{i=1}^n x_i|The arithmetic mean is one measure of location; median and mode describe different aspects and need not equal the mean.
dispersion|s² = Σᵢ(xᵢ−x̄)²/(n−1)|s^2=\frac1{n-1}\sum_{i=1}^n(x_i-\bar x)^2|The sample variance is one measure of dispersion, defined here for n>1. Other measures include standard deviation and interquartile range.
wp-interquartile-range|IQR = Q₃ − Q₁|\operatorname{IQR}=Q_3-Q_1|The interquartile range is the difference between the 75th and 25th percentiles; sample quantile conventions can differ.
wp-covariance-and-correlation|ρ(X,Y) = Cov(X,Y)/(σXσY)|\rho(X,Y)=\frac{\operatorname{Cov}(X,Y)}{\sigma_X\sigma_Y}|Pearson correlation requires finite, positive variances. Zero correlation does not imply independence in general.
wp-location-estimation|x̄ = (1/n)Σᵢxᵢ|\bar x=\frac1n\sum_{i=1}^n x_i|The sample mean is one summary statistic for location; it should be interpreted alongside spread and distribution shape.
completeness-reals|Every nonempty bounded-above A⊆ℝ has sup A∈ℝ|\varnothing\ne A\subseteq\mathbb R,\ A\text{ bounded above}\implies\sup A\in\mathbb R|The least-upper-bound property is a defining completeness property of the real numbers, and fails for the rationals.
heine-borel|K⊆ℝⁿ compact ⇔ K closed and bounded|K\subseteq\mathbb R^n\text{ compact}\iff K\text{ closed and bounded}|This characterization uses Euclidean space with its usual topology. Closed and bounded does not imply compact in every metric space.
bolzano-weierstrass|Bounded (xₙ)⊂ℝⁿ ⇒ a convergent subsequence|\text{bounded }(x_n)\subset\mathbb R^n\implies x_{n_k}\to x|Every bounded sequence in finite-dimensional Euclidean space has a subsequence converging to a point of that space.
homotopy|H(x,0) = f(x), H(x,1) = g(x)|H(x,0)=f(x),\qquad H(x,1)=g(x)|A homotopy between continuous f,g:X→Y is a continuous map H:X×[0,1]→Y with these endpoint conditions.
homology|Hₙ(C) = ker ∂ₙ / im ∂ₙ₊₁|H_n(C)=\ker\partial_n/\operatorname{im}\partial_{n+1}|The boundary maps satisfy ∂ₙ∂ₙ₊₁=0, so the subgroup of boundaries is contained in the group of cycles.
`.trim().split('\n').map(line=>{const[id,text,tex,condition,example]=line.split('|');return[id,{text,tex,condition,...(example?{example}:{})}];}));
definitions['wp-hausdorff-distance'].previewTex=String.raw`d_H(A,B)=\max\{h(A,B),h(B,A)\}`;
definitions['wp-hausdorff-distance'].tex=String.raw`\begin{gathered}d_H(A,B)=\max\{h(A,B),h(B,A)\}\\[5pt]h(A,B)=\sup_{a\in A}\inf_{b\in B}d(a,b)\end{gathered}`;
