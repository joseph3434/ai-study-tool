/**
 * Official AP® curriculum reference for AP Calculus AB/BC and AP Physics C: Mechanics.
 * Sourced from College Board AP Central course descriptions.
 * Embedded in the system prompt so the AI knows the exact scope, depth, and expectations.
 */
export const AP_CURRICULUM = `
=== AP® CALCULUS AB & BC — OFFICIAL COURSE AND EXAM REFERENCE ===

OVERVIEW
AP Calculus AB covers roughly first-semester college calculus (limits through basic integration).
AP Calculus BC covers the full year of single-variable calculus (AB content plus series, parametric, polar).
All BC topics are also tested on AB except where marked [BC ONLY].
Prerequisites: algebra, geometry, trigonometry, analytic geometry, and elementary functions (linear, polynomial, rational, exponential, logarithmic, trigonometric).

MATHEMATICAL PRACTICES (tested throughout):
1. Implementing Mathematical Processes — applying procedures and rules correctly
2. Connecting Representations — translating between graphical, numerical, analytical, and verbal forms
3. Justification — using mathematical evidence to support claims (especially on FRQs)
4. Communication and Notation — using proper mathematical language and notation

EXAM FORMAT
- Section I: 45 MCQ (30 no-calculator, 15 calculator) — 1 hour 45 minutes — 50% of score
- Section II: 6 FRQ (2 calculator, 4 no-calculator) — 1 hour 30 minutes — 50% of score

─────────────────────────────────────────────
UNIT 1 — LIMITS AND CONTINUITY (10–12% of exam)
─────────────────────────────────────────────
Topics:
- Average vs. instantaneous rates of change
- Defining limits and using limit notation
- Estimating limit values from graphs and tables
- Determining limits analytically (algebraic manipulation, factoring, conjugates)
- Squeeze Theorem
- Limits involving infinity: horizontal and vertical asymptotes, limits at ±∞
- Continuity at a point: three conditions (limit exists, f(c) defined, limit equals f(c))
- Types of discontinuity: removable (hole), jump, infinite (vertical asymptote), oscillating
- Intermediate Value Theorem (IVT): if f is continuous on [a,b] and k is between f(a) and f(b), then f(c)=k for some c in (a,b)

─────────────────────────────────────────────
UNIT 2 — DIFFERENTIATION: DEFINITION AND FUNDAMENTAL PROPERTIES (10–12%)
─────────────────────────────────────────────
Topics:
- Definition of derivative as a limit: f'(x) = lim[h→0] (f(x+h)−f(x))/h
- Derivative as slope of tangent line and as instantaneous rate of change
- Estimating derivatives from graphs and tables
- Differentiability implies continuity (but not vice versa); non-differentiable points (corners, cusps, vertical tangents, discontinuities)
- Power Rule, Constant Multiple Rule, Sum/Difference Rule
- Derivatives of sin(x), cos(x), eˣ, ln(x), and other basic functions
- Product Rule: (fg)' = f'g + fg'
- Quotient Rule: (f/g)' = (f'g − fg')/g²
- Derivatives of tan(x), cot(x), sec(x), csc(x)

─────────────────────────────────────────────
UNIT 3 — DIFFERENTIATION: COMPOSITE, IMPLICIT, AND INVERSE FUNCTIONS (9–13%)
─────────────────────────────────────────────
Topics:
- Chain Rule: d/dx[f(g(x))] = f'(g(x))·g'(x)
- Implicit Differentiation: differentiate both sides with respect to x, apply chain rule to y terms
- Derivatives of inverse functions: if y = f⁻¹(x) then dy/dx = 1/f'(y)
- Derivatives of inverse trig functions: arcsin, arccos, arctan
- Derivatives of general exponential functions: d/dx[aˣ] = aˣ·ln(a)
- Derivatives of general logarithmic functions: d/dx[log_a(x)] = 1/(x·ln(a))
- Higher-order derivatives

─────────────────────────────────────────────
UNIT 4 — CONTEXTUAL APPLICATIONS OF DIFFERENTIATION (10–15%)
─────────────────────────────────────────────
Topics:
- Interpreting the meaning of f'(x) in context (rates of change with correct units)
- Straight-line motion: position s(t), velocity v(t) = s'(t), acceleration a(t) = v'(t)
- Speed = |v(t)|; particle moving right/left when v(t) > 0 / < 0; speeding up when v and a have same sign
- Related rates: implicit differentiation with respect to time; ladder, cone, sphere, similar triangles problems
- Linear approximation / local linearization: L(x) = f(a) + f'(a)(x−a)
- L'Hôpital's Rule: for 0/0 or ∞/∞ indeterminate forms, lim f/g = lim f'/g'

─────────────────────────────────────────────
UNIT 5 — ANALYTICAL APPLICATIONS OF DIFFERENTIATION (15–18%)
─────────────────────────────────────────────
Topics:
- Mean Value Theorem (MVT): if f is continuous on [a,b] and differentiable on (a,b), then f'(c) = (f(b)−f(a))/(b−a) for some c
- Extreme Value Theorem: continuous function on closed interval attains absolute max and min
- Critical points: where f'(x) = 0 or f'(x) undefined
- First Derivative Test for local extrema
- Second Derivative Test for local extrema
- Concavity: f''(x) > 0 concave up, f''(x) < 0 concave down
- Points of inflection: where concavity changes
- Candidates Test for absolute extrema on closed interval
- Optimization: set up function to maximize/minimize, find critical points, verify
- Curve sketching: combining f, f', f'' information
- Implicit relations and their derivatives on graphs

─────────────────────────────────────────────
UNIT 6 — INTEGRATION AND ACCUMULATION OF CHANGE (17–20%)
─────────────────────────────────────────────
Topics:
- Accumulation of change: ∫ₐᵇ f(x)dx as signed area under curve
- Riemann sums (left, right, midpoint) and trapezoidal rule as approximations
- Definite integral notation and properties (linearity, additivity, reversing limits)
- Fundamental Theorem of Calculus Part 1 (FTC1): d/dx[∫ₐˣ f(t)dt] = f(x)
- FTC1 with Chain Rule: d/dx[∫ₐᵍ⁽ˣ⁾ f(t)dt] = f(g(x))·g'(x)
- Fundamental Theorem of Calculus Part 2 (FTC2): ∫ₐᵇ f(x)dx = F(b)−F(a)
- Antiderivatives and indefinite integrals; +C
- Basic antiderivative rules (power, trig, exponential, logarithmic)
- u-substitution (change of variables)
- [BC ONLY] Integration by parts: ∫u dv = uv − ∫v du
- [BC ONLY] Integration of partial fractions (distinct linear factors)
- [BC ONLY] Improper integrals: infinite limits or discontinuous integrands; convergence/divergence

─────────────────────────────────────────────
UNIT 7 — DIFFERENTIAL EQUATIONS (6–12%)
─────────────────────────────────────────────
Topics:
- Differential equations: verifying solutions by substitution
- Slope fields: sketching and interpreting graphical representation of dy/dx = f(x,y)
- Separable differential equations: separate variables, integrate both sides, apply initial conditions
- Exponential growth/decay: dy/dt = ky → y = Ce^(kt)
- [BC ONLY] Euler's method: approximate y(xₙ) using y_{n+1} = yₙ + f(xₙ,yₙ)·Δx
- [BC ONLY] Logistic growth: dy/dt = ky(1−y/L); carrying capacity L; solution has S-curve shape

─────────────────────────────────────────────
UNIT 8 — APPLICATIONS OF INTEGRATION (10–15%)
─────────────────────────────────────────────
Topics:
- Average value of a function: (1/(b−a))∫ₐᵇ f(x)dx
- Position from velocity: s(t) = s(t₀) + ∫_{t₀}^t v(τ)dτ; total distance = ∫|v(t)|dt
- Area between curves: ∫ₐᵇ (top − bottom)dx or ∫ (right − left)dy
- Volumes of solids of revolution: Disk method ∫πR²dx, Washer method ∫π(R²−r²)dx
- Volumes with known cross-sections (squares, semicircles, equilateral triangles perpendicular to axis)
- [BC ONLY] Arc length of a curve: ∫ₐᵇ √(1+(f'(x))²) dx

─────────────────────────────────────────────
UNIT 9 — [BC ONLY] PARAMETRIC EQUATIONS, POLAR, AND VECTOR-VALUED FUNCTIONS (11–12%)
─────────────────────────────────────────────
Topics:
- Parametric equations: x(t), y(t); dy/dx = (dy/dt)/(dx/dt); d²y/dx²
- Arc length of parametric curve: ∫√((dx/dt)²+(dy/dt)²) dt
- Vector-valued functions: position, velocity, acceleration vectors; speed = |v(t)|
- Polar coordinates: converting between polar and rectangular; r = f(θ)
- Slopes of polar curves: dy/dx from r(θ)
- Area enclosed by polar curve: A = (1/2)∫r²dθ; area between two polar curves

─────────────────────────────────────────────
UNIT 10 — [BC ONLY] INFINITE SEQUENCES AND SERIES (17–18%)
─────────────────────────────────────────────
Topics:
- Sequences: convergence/divergence, L'Hôpital applied to sequences
- Series: geometric series (converges iff |r|<1, sum = a/(1−r)); telescoping series
- Convergence tests:
  - Nth Term Test (divergence test): if lim aₙ ≠ 0, series diverges
  - Integral Test (positive, decreasing functions)
  - p-series: Σ1/nᵖ converges iff p > 1
  - Direct Comparison Test
  - Limit Comparison Test
  - Alternating Series Test (Leibniz): decreasing terms → 0 → converges; error ≤ first omitted term
  - Ratio Test: lim |a_{n+1}/aₙ| < 1 → converges absolutely
- Absolute vs. conditional convergence
- Power series: radius of convergence R, interval of convergence (check endpoints separately)
- Taylor series: f(x) = Σ f⁽ⁿ⁾(a)/n! · (x−a)ⁿ
- Maclaurin series for: eˣ, sin(x), cos(x), 1/(1−x), ln(1+x), arctan(x)
- Lagrange error bound for Taylor polynomial approximation: |Rₙ(x)| ≤ M/(n+1)! · |x−a|^(n+1)


=== AP® PHYSICS C: MECHANICS — OFFICIAL COURSE AND EXAM REFERENCE ===

OVERVIEW
AP Physics C: Mechanics is a calculus-based physics course covering classical mechanics.
This is NOT the algebra-based AP Physics 1 — calculus (derivatives and integrals) is required and expected throughout.
Calculus topics used: derivatives of position/velocity/acceleration, integration to find displacement from velocity, integrals for work and impulse, moment of inertia as an integral, solving differential equations for SHM.
Prerequisite: calculus (concurrent enrollment acceptable).
Laboratory work is required; students may need to present lab notebooks to colleges for credit.

SCIENCE PRACTICES:
1. Creating Representations — diagrams, free-body diagrams, graphs, tables, sketches (20–35% of FRQ score)
2. Mathematical Routines — deriving expressions symbolically, calculating quantities, predicting changes (40–45% of FRQ score)
3. Scientific Questioning and Argumentation — designing experiments, applying laws/models, justifying claims (30–35% of FRQ score)

EXAM FORMAT
- Section I: 35 MCQ — 45 minutes — 50% of score (no calculator)
- Section II: 3 FRQ — 45 minutes — 50% of score (calculator allowed)
  - FRQ types include: derivation, experimental design, graph interpretation, justification

─────────────────────────────────────────────
UNIT 1 — KINEMATICS (10–15% of exam)
─────────────────────────────────────────────
Topics:
- Position x(t), displacement Δx, distance; velocity v(t) = dx/dt; acceleration a(t) = dv/dt = d²x/dt²
- Kinematic equations (constant acceleration): v=v₀+at, x=x₀+v₀t+½at², v²=v₀²+2aΔx
- Deriving position from velocity by integration: x(t) = x₀ + ∫v(t)dt
- Interpreting slopes and areas on x-t, v-t, and a-t graphs
- 2D kinematics: vector components; projectile motion (horizontal: aₓ=0, vertical: aᵧ=−g)
- Relative motion; reference frames

─────────────────────────────────────────────
UNIT 2 — FORCE AND TRANSLATIONAL DYNAMICS (20–25%)
─────────────────────────────────────────────
Topics:
- Newton's First Law (inertia), Second Law (ΣF = ma), Third Law (action-reaction pairs)
- Free-body diagrams: identifying all forces on a single object
- Common forces: gravity (W=mg), normal force, tension, friction (static: f_s ≤ μ_s N; kinetic: f_k = μ_k N)
- Applying Newton's 2nd law to systems of objects (Atwood machines, stacked blocks, inclines)
- Center of mass: x_cm = Σmᵢxᵢ/Σmᵢ; motion of center of mass under external forces
- Uniform circular motion: centripetal acceleration a_c = v²/r = ω²r directed toward center; centripetal force = mv²/r
- Non-uniform circular motion: tangential and centripetal components of acceleration
- Newton's Law of Universal Gravitation: F = Gm₁m₂/r²
- Gravitational field g = GM/r² near a large mass
- Orbital mechanics: circular orbits, v_orbit = √(GM/r), T² ∝ r³ (Kepler's 3rd law)
- Escape velocity: v_esc = √(2GM/r)
- Apparent weight and weightlessness

─────────────────────────────────────────────
UNIT 3 — WORK, ENERGY, AND POWER (15–25%)
─────────────────────────────────────────────
Topics:
- Work done by a constant force: W = F·d·cosθ
- Work done by a variable force: W = ∫F(x)dx (fundamental use of integration in physics)
- Work-energy theorem: W_net = ΔKE = ΔK
- Kinetic energy: KE = ½mv²
- Conservative vs. non-conservative forces; path independence of conservative forces
- Potential energy: gravitational U = mgh; spring (elastic) U = ½kx²
- Conservation of mechanical energy (no non-conservative forces): KE + PE = constant
- Work done by non-conservative forces: W_nc = ΔKE + ΔPE = ΔE_mech
- Power: P = dW/dt = F·v (instantaneous); P_avg = W/Δt
- Spring force: F = −kx (Hooke's Law); work done by spring = −½kx²

─────────────────────────────────────────────
UNIT 4 — LINEAR MOMENTUM (10–20%)
─────────────────────────────────────────────
Topics:
- Linear momentum: p = mv
- Impulse: J = ∫F dt = Δp = m·Δv; impulse-momentum theorem
- Impulse approximation: large force over short time
- Conservation of linear momentum (isolated system): Σpᵢ = constant
- Types of collisions:
  - Perfectly elastic: KE conserved, use conservation of momentum + KE
  - Perfectly inelastic: objects stick together, maximum KE lost
  - Inelastic: momentum conserved, KE not conserved
- Center of mass velocity: v_cm = Σmᵢvᵢ/Σmᵢ; v_cm is constant if no external forces
- Center of mass frame; total momentum in CM frame is zero
- Variable mass (briefly): rocket equation F = ma + v_rel(dm/dt)

─────────────────────────────────────────────
UNIT 5 — TORQUE AND ROTATIONAL DYNAMICS (10–15%)
─────────────────────────────────────────────
Topics:
- Rotational kinematics: θ, ω = dθ/dt, α = dω/dt; equations analogous to linear kinematics
- Torque: τ = r × F; τ = rF sinθ; sign convention (CCW positive)
- Moment of inertia: I = Σmᵢrᵢ² (point masses); I = ∫r²dm (continuous objects)
  - Common values: thin rod about center = ML²/12; thin rod about end = ML²/3; solid disk = ½MR²; solid sphere = ⅖MR²; hollow sphere = ⅔MR²; ring = MR²
- Parallel Axis Theorem: I = I_cm + Md²
- Newton's 2nd law for rotation: Στ = Iα
- Rotational static equilibrium: Στ = 0 and ΣF = 0 (both conditions required)
- Conditions for rolling without slipping

─────────────────────────────────────────────
UNIT 6 — ENERGY AND MOMENTUM OF ROTATING SYSTEMS (10–15%)
─────────────────────────────────────────────
Topics:
- Rotational kinetic energy: KE_rot = ½Iω²
- Total KE of rolling object: KE = ½mv_cm² + ½Iω² with constraint v_cm = Rω
- Work done by torque: W = ∫τ dθ
- Angular momentum of a particle: L = r × p = mvr sinθ (for particle)
- Angular momentum of rigid body: L = Iω
- Conservation of angular momentum (no external torques): L_i = L_f
  - Examples: spinning figure skater pulling in arms (I decreases, ω increases), orbital mechanics
- Gyroscopic precession (qualitative)
- Relationship between linear and angular quantities: v = rω, a_t = rα, a_c = rω² = v²/r

─────────────────────────────────────────────
UNIT 7 — OSCILLATIONS (10–15%)
─────────────────────────────────────────────
Topics:
- Simple Harmonic Motion (SHM): restoring force F = −kx; condition for SHM: F ∝ −x
- Equation of motion: d²x/dt² = −(k/m)x = −ω²x
- Solution: x(t) = A cos(ωt + φ); ω = 2πf = 2π/T
- Angular frequency: ω = √(k/m) for spring; ω = √(g/L) for simple pendulum (small angle)
- Velocity in SHM: v(t) = −Aω sin(ωt + φ); maximum speed v_max = Aω at equilibrium
- Acceleration in SHM: a(t) = −Aω² cos(ωt + φ); maximum |a| = Aω² at amplitude
- Energy in SHM: E = ½kA² = ½mv² + ½kx² (total mechanical energy conserved)
- Simple pendulum: T = 2π√(L/g) for small oscillations (θ < ~15°); not SHM for large angles
- Physical (compound) pendulum: τ = −MgD sinθ ≈ −MgDθ; ω = √(MgD/I)
- Damped oscillations (qualitative): underdamped, critically damped, overdamped
- Driven oscillations and resonance (qualitative)
`;
