export interface SimRef {
  title: string;
  url: string;
  provider: string;
  description: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  title: string;
  level: "O" | "A" | "Both";
  minutes: number;
  overview: string;
  keyPoints: string[];
  formulas?: string[];
  examTips: string[];
  sims?: SimRef[];
  years: number[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  emoji: string;
  gradient: string;
  tint: string;
  description: string;
  topics: Topic[];
}

const phet = (slug: string) => `https://phet.colorado.edu/sims/html/${slug}/latest/${slug}_en.html`;

export const SUBJECTS: Subject[] = [
  {
    id: "math",
    name: "Mathematics",
    code: "456",
    emoji: "📐",
    gradient: "from-indigo-500 to-blue-700",
    tint: "bg-indigo-50 text-indigo-700 border-indigo-200",
    description: "Pure and applied mathematics for UCE and UACE — algebra, geometry, calculus and statistics.",
    topics: [
      {
        id: "math-quadratics",
        subjectId: "math",
        title: "Quadratic Equations & Inequalities",
        level: "O",
        minutes: 35,
        years: [2016, 2018, 2019, 2021, 2022, 2023, 2024],
        overview:
          "A quadratic equation is any equation that can be written as ax² + bx + c = 0 where a ≠ 0. UNEB tests solving by factorisation, completing the square and the quadratic formula, plus sketching parabolas and solving inequalities.",
        keyPoints: [
          "Standard form: ax² + bx + c = 0, with a, b, c real and a ≠ 0.",
          "Factorisation works when the expression splits into two linear brackets with integer or simple rational roots.",
          "Completing the square rewrites the equation as a(x + p)² + q = 0 and reveals the turning point (−p, q).",
          "The discriminant Δ = b² − 4ac tells you the nature of the roots: Δ > 0 two distinct real roots, Δ = 0 one repeated root, Δ < 0 no real roots.",
          "For inequalities, find the critical values first, then test the sign of each interval on a number line.",
          "The parabola opens upward when a > 0 and downward when a < 0 — always sketch before answering a range question.",
        ],
        formulas: ["x = [−b ± √(b² − 4ac)] / 2a", "Δ = b² − 4ac", "Sum of roots = −b/a", "Product of roots = c/a", "Turning point: x = −b/2a"],
        examTips: [
          "Always state the formula before substituting — UNEB awards a method mark for it.",
          "When asked for the 'nature of roots', compute Δ and interpret it in words. Do not just leave a number.",
          "For inequalities, present the final answer in set or interval notation, e.g. {x : −2 < x < 5}.",
        ],
        sims: [
          { title: "Graphing Quadratics", url: phet("graphing-quadratics"), provider: "PhET", description: "Drag the coefficients a, b and c and watch how the parabola, roots and vertex respond in real time." },
          { title: "Area Model Algebra", url: phet("area-model-algebra"), provider: "PhET", description: "Build rectangles to see why factorising a quadratic is the same as finding side lengths." },
        ],
      },
      {
        id: "math-vectors",
        subjectId: "math",
        title: "Vectors in Two Dimensions",
        level: "Both",
        minutes: 40,
        years: [2017, 2019, 2020, 2022, 2024],
        overview:
          "Vectors have both magnitude and direction. At O-level you work with column vectors, position vectors and vector geometry proofs; at A-level you extend to the scalar (dot) product and vector equations of lines.",
        keyPoints: [
          "A column vector (x, y) describes a translation of x units horizontally and y units vertically.",
          "The magnitude of vector a = (x, y) is |a| = √(x² + y²).",
          "Position vector of point P relative to origin O is written OP.",
          "AB = OB − OA. This single result solves most vector geometry questions.",
          "Two vectors are parallel if one is a scalar multiple of the other: a = kb.",
          "The dot product a·b = |a||b|cos θ; if a·b = 0 the vectors are perpendicular.",
        ],
        formulas: ["|a| = √(x² + y²)", "AB = OB − OA", "a·b = x₁x₂ + y₁y₂", "cos θ = (a·b)/(|a||b|)", "Unit vector â = a/|a|"],
        examTips: [
          "Draw the diagram even if it is not asked for — it earns you the route to the answer.",
          "In 'show that A, B and C are collinear' questions, prove AB = kBC and state that they share point B.",
          "Keep vectors in bold or with arrows in your script so the examiner can tell them from scalars.",
        ],
        sims: [{ title: "Vector Addition", url: phet("vector-addition"), provider: "PhET", description: "Add vectors head-to-tail and read off components, magnitude and angle instantly." }],
      },
      {
        id: "math-probability",
        subjectId: "math",
        title: "Probability",
        level: "Both",
        minutes: 30,
        years: [2016, 2018, 2020, 2021, 2023, 2024],
        overview:
          "Probability measures how likely an event is on a scale from 0 to 1. UNEB favours tree diagrams, Venn diagrams and the difference between independent and mutually exclusive events.",
        keyPoints: [
          "P(event) = number of favourable outcomes ÷ total number of equally likely outcomes.",
          "P(A′) = 1 − P(A) — the complement rule saves time on 'at least one' questions.",
          "Mutually exclusive: P(A or B) = P(A) + P(B). They cannot happen together.",
          "Independent: P(A and B) = P(A) × P(B). One does not affect the other.",
          "Tree diagrams: multiply along branches, add between branches.",
          "Conditional probability: P(A|B) = P(A ∩ B) / P(B).",
        ],
        formulas: ["P(A ∪ B) = P(A) + P(B) − P(A ∩ B)", "P(A|B) = P(A ∩ B)/P(B)", "P(A′) = 1 − P(A)"],
        examTips: [
          "Label every branch of a tree diagram with its probability — marks are given for the diagram itself.",
          "'At least one' almost always means use 1 − P(none).",
          "Watch for 'without replacement' — the denominator changes on the second draw.",
        ],
        sims: [{ title: "Plinko Probability", url: phet("plinko-probability"), provider: "PhET", description: "Drop hundreds of balls and watch experimental probability converge on the theoretical binomial distribution." }],
      },
      {
        id: "math-calculus",
        subjectId: "math",
        title: "Differentiation & Its Applications",
        level: "A",
        minutes: 45,
        years: [2017, 2019, 2021, 2022, 2023, 2024],
        overview:
          "Differentiation finds the instantaneous rate of change of a function. UACE Paper 1 uses it for gradients, tangents, normals, stationary points and rates of change; Paper 2 applies it to kinematics.",
        keyPoints: [
          "dy/dx is the gradient of the curve at a point, i.e. the limit of δy/δx as δx → 0.",
          "Power rule: if y = xⁿ then dy/dx = nxⁿ⁻¹.",
          "Product rule: (uv)′ = u′v + uv′. Quotient rule: (u/v)′ = (u′v − uv′)/v².",
          "Chain rule: dy/dx = (dy/du)(du/dx) — essential for composite functions.",
          "Stationary points occur where dy/dx = 0; use the second derivative to classify (d²y/dx² > 0 minimum, < 0 maximum).",
          "In kinematics, v = ds/dt and a = dv/dt = d²s/dt².",
        ],
        formulas: ["d/dx(xⁿ) = nxⁿ⁻¹", "d/dx(sin x) = cos x", "d/dx(eˣ) = eˣ", "d/dx(ln x) = 1/x", "Tangent: y − y₁ = m(x − x₁)"],
        examTips: [
          "For maximum/minimum word problems, always define your variable and write the function before differentiating.",
          "Do not forget to find the y-coordinate of a stationary point — half the marks live there.",
          "Normal gradient = −1/(tangent gradient). Students lose easy marks by forgetting the negative reciprocal.",
        ],
        sims: [{ title: "Calculus Grapher", url: phet("calculus-grapher"), provider: "PhET", description: "Sketch a function and see its derivative and integral appear beneath it — perfect for understanding turning points." }],
      },
      {
        id: "math-statistics",
        subjectId: "math",
        title: "Statistics: Averages & Dispersion",
        level: "Both",
        minutes: 35,
        years: [2016, 2018, 2020, 2022, 2024],
        overview:
          "Statistics summarises data using measures of central tendency (mean, median, mode) and dispersion (range, variance, standard deviation). Grouped frequency tables are a UNEB favourite.",
        keyPoints: [
          "Mean of grouped data = Σfx / Σf where x is the class midpoint.",
          "Median is the (n+1)/2 th value for raw data; for grouped data use the median class and interpolation.",
          "Mode is the most frequent value; for grouped data use the modal class formula or a histogram.",
          "Standard deviation measures spread about the mean: a small SD means data is tightly clustered.",
          "The cumulative frequency curve (ogive) gives quartiles: Q1 at n/4, Q3 at 3n/4.",
          "Interquartile range = Q3 − Q1 and is resistant to outliers.",
        ],
        formulas: ["x̄ = Σfx/Σf", "σ = √(Σf(x − x̄)²/Σf)", "σ² = Σfx²/Σf − x̄²", "IQR = Q3 − Q1"],
        examTips: [
          "Draw up a clear table with columns for x, f, fx and fx² — the examiner follows your table.",
          "Use the class midpoint, not the class boundary, when computing the mean.",
          "Label both axes of an ogive and use a smooth curve, not straight lines.",
        ],
        sims: [{ title: "Least-Squares Regression", url: phet("least-squares-regression"), provider: "PhET", description: "Plot data points and watch the best-fit line, residuals and correlation coefficient update live." }],
      },
    ],
  },
  {
    id: "physics",
    name: "Physics",
    code: "535",
    emoji: "⚛️",
    gradient: "from-sky-500 to-cyan-700",
    tint: "bg-sky-50 text-sky-700 border-sky-200",
    description: "Mechanics, electricity, waves and modern physics with hands-on PhET laboratory simulations.",
    topics: [
      {
        id: "phy-projectile",
        subjectId: "physics",
        title: "Projectile Motion",
        level: "Both",
        minutes: 40,
        years: [2017, 2019, 2020, 2022, 2023, 2024],
        overview:
          "A projectile is any object thrown into the air and moving under gravity alone. The key insight is that horizontal and vertical motion are completely independent of each other.",
        keyPoints: [
          "Horizontal velocity is constant (ignoring air resistance): uₓ = u cos θ.",
          "Vertical motion is uniformly accelerated with a = −g = −9.8 m/s²: u_y = u sin θ.",
          "Time of flight T = 2u sin θ / g for a projectile landing at the same height it was launched.",
          "Maximum height H = u² sin²θ / 2g occurs when the vertical velocity is momentarily zero.",
          "Range R = u² sin 2θ / g is maximum at θ = 45°.",
          "The trajectory is a parabola; complementary angles (e.g. 30° and 60°) give the same range.",
        ],
        formulas: ["R = u² sin 2θ / g", "H = u² sin²θ / 2g", "T = 2u sin θ / g", "v² = u² + 2as", "s = ut + ½at²"],
        examTips: [
          "Resolve into components in the very first line — write uₓ and u_y separately.",
          "Take downward as negative consistently and state your sign convention.",
          "If the projectile lands at a different height, you must solve the quadratic in t, not use T = 2u sin θ/g.",
        ],
        sims: [{ title: "Projectile Motion", url: phet("projectile-motion"), provider: "PhET", description: "Fire cannonballs, pumpkins and pianos at any angle. Turn air resistance on and off and measure range and height." }],
      },
      {
        id: "phy-forces",
        subjectId: "physics",
        title: "Forces & Newton's Laws",
        level: "O",
        minutes: 35,
        years: [2016, 2018, 2021, 2022, 2024],
        overview:
          "Newton's three laws explain how forces change motion. They underpin almost every mechanics question in UCE Physics, from lifts and pulleys to friction on inclined planes.",
        keyPoints: [
          "First law (inertia): a body stays at rest or in uniform motion unless acted on by a resultant force.",
          "Second law: F = ma. The resultant force equals mass × acceleration and acts in the direction of acceleration.",
          "Third law: for every action there is an equal and opposite reaction — on different bodies.",
          "Weight W = mg acts vertically downwards; the normal reaction R acts perpendicular to the surface.",
          "Friction f = μR opposes relative motion and always acts along the surface.",
          "Momentum p = mv is conserved in all collisions when no external force acts.",
        ],
        formulas: ["F = ma", "W = mg", "f = μR", "p = mv", "Impulse = Ft = Δp"],
        examTips: [
          "Draw a free-body diagram and mark every force — it is worth marks on its own.",
          "For connected bodies, write F = ma for each body separately, then solve simultaneously.",
          "State which body a reaction force acts on; 'equal and opposite on the same body' is a classic error.",
        ],
        sims: [
          { title: "Forces and Motion: Basics", url: phet("forces-and-motion-basics"), provider: "PhET", description: "Push a crate, add friction and see the net force, acceleration and free-body diagram appear live." },
          { title: "Balancing Act", url: phet("balancing-act"), provider: "PhET", description: "Explore moments and equilibrium by balancing masses on a plank." },
        ],
      },
      {
        id: "phy-electricity",
        subjectId: "physics",
        title: "Current Electricity & Ohm's Law",
        level: "Both",
        minutes: 40,
        years: [2016, 2017, 2019, 2021, 2023, 2024],
        overview:
          "Electric current is the rate of flow of charge. Ohm's law links current, voltage and resistance, and lets you analyse series and parallel circuits — a guaranteed UNEB topic.",
        keyPoints: [
          "Current I = Q/t measured in amperes; conventional current flows from + to −.",
          "Ohm's law: V = IR, valid for a metallic conductor at constant temperature.",
          "Series: the current is the same everywhere and R_total = R₁ + R₂ + R₃.",
          "Parallel: the voltage is the same across each branch and 1/R_total = 1/R₁ + 1/R₂.",
          "Electrical power P = VI = I²R = V²/R; energy W = VIt.",
          "EMF ε = I(R + r) where r is the internal resistance of the cell; terminal voltage = ε − Ir.",
        ],
        formulas: ["V = IR", "P = VI = I²R", "Series: R = R₁ + R₂", "Parallel: 1/R = 1/R₁ + 1/R₂", "ε = I(R + r)"],
        examTips: [
          "Redraw complicated circuits in a simplified form before calculating.",
          "Units matter: convert mA to A and kΩ to Ω before substituting.",
          "In internal-resistance experiments, plot V against I — the gradient is −r and the intercept is ε.",
        ],
        sims: [
          { title: "Circuit Construction Kit: DC", url: phet("circuit-construction-kit-dc"), provider: "PhET", description: "Build real circuits with batteries, resistors and bulbs. Measure current and voltage with virtual meters." },
          { title: "Ohm's Law", url: phet("ohms-law"), provider: "PhET", description: "Vary voltage and resistance with sliders and watch the current equation resize in front of you." },
        ],
      },
      {
        id: "phy-waves",
        subjectId: "physics",
        title: "Waves, Light & Refraction",
        level: "Both",
        minutes: 38,
        years: [2018, 2020, 2021, 2022, 2024],
        overview:
          "Waves transfer energy without transferring matter. This topic covers wave properties, the wave equation, reflection, refraction, Snell's law and total internal reflection.",
        keyPoints: [
          "Transverse waves vibrate perpendicular to the direction of travel (light); longitudinal waves vibrate parallel (sound).",
          "Wave equation: v = fλ links speed, frequency and wavelength.",
          "Refraction occurs because light changes speed when entering a different medium.",
          "Snell's law: n₁ sin θ₁ = n₂ sin θ₂, and refractive index n = c/v = sin i / sin r.",
          "Total internal reflection happens when light travels from dense to less dense medium and the angle exceeds the critical angle C, where sin C = 1/n.",
          "Applications: optical fibres, periscopes, mirages and diamond brilliance.",
        ],
        formulas: ["v = fλ", "n = sin i / sin r", "n = c/v", "sin C = 1/n", "T = 1/f"],
        examTips: [
          "Always measure angles from the normal, never from the surface.",
          "State both conditions for total internal reflection — dense to less dense AND i > C.",
          "In ray diagrams use a ruler and put arrows on the rays to show direction.",
        ],
        sims: [
          { title: "Bending Light", url: phet("bending-light"), provider: "PhET", description: "Shoot a laser between air, water and glass. Measure the critical angle and watch total internal reflection appear." },
          { title: "Wave on a String", url: phet("wave-on-a-string"), provider: "PhET", description: "Generate pulses and standing waves; adjust tension, damping and frequency." },
        ],
      },
      {
        id: "phy-energy",
        subjectId: "physics",
        title: "Work, Energy & Power",
        level: "O",
        minutes: 30,
        years: [2017, 2019, 2022, 2023],
        overview:
          "Energy is the capacity to do work. The principle of conservation of energy — energy is never created or destroyed, only converted — solves a huge range of UNEB problems quickly.",
        keyPoints: [
          "Work done W = Fs cos θ, measured in joules.",
          "Kinetic energy KE = ½mv²; gravitational potential energy PE = mgh.",
          "Conservation of mechanical energy: KE + PE is constant when only gravity does work.",
          "Power P = W/t = Fv measured in watts.",
          "Efficiency = (useful energy output / total energy input) × 100%.",
          "Real machines lose energy mainly as heat through friction, so efficiency is always below 100%.",
        ],
        formulas: ["W = Fs cos θ", "KE = ½mv²", "PE = mgh", "P = W/t = Fv", "Efficiency = (out/in) × 100%"],
        examTips: [
          "Using energy conservation is usually faster than using equations of motion — try it first.",
          "Watch the height reference point; h must be measured from the level you defined as zero.",
          "Efficiency can never exceed 100%; if it does, you have mixed up input and output.",
        ],
        sims: [{ title: "Energy Skate Park: Basics", url: phet("energy-skate-park-basics"), provider: "PhET", description: "Build a track and watch kinetic, potential and thermal energy trade off in real time on the bar chart." }],
      },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    code: "545",
    emoji: "🧪",
    gradient: "from-emerald-500 to-teal-700",
    tint: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "Physical, inorganic and organic chemistry with virtual laboratory simulations.",
    topics: [
      {
        id: "chem-atomic",
        subjectId: "chemistry",
        title: "Atomic Structure & the Periodic Table",
        level: "O",
        minutes: 35,
        years: [2016, 2018, 2020, 2022, 2024],
        overview:
          "Everything in chemistry starts with the atom. Protons, neutrons and electrons determine an element's identity, mass and chemical behaviour — and its position in the periodic table.",
        keyPoints: [
          "Atomic number Z = number of protons; it defines the element.",
          "Mass number A = protons + neutrons. Isotopes have the same Z but different A.",
          "Electron configuration fills shells 2, 8, 8, 18 — the outermost shell determines reactivity.",
          "Groups (columns) share the same number of valence electrons and therefore similar properties.",
          "Periods (rows) show a trend: atomic radius decreases and electronegativity increases across a period.",
          "Group I metals get more reactive down the group; Group VII halogens get less reactive down the group.",
        ],
        formulas: ["A = Z + N", "Relative atomic mass = Σ(isotope mass × abundance)/100", "Number of electrons = Z (neutral atom)"],
        examTips: [
          "When drawing atomic structure diagrams, label protons, neutrons and electrons with their counts.",
          "Explain trends using shielding and nuclear attraction — examiners want the reason, not just the trend.",
          "Practise relative atomic mass calculations with two isotopes; they appear almost every year.",
        ],
        sims: [
          { title: "Build an Atom", url: phet("build-an-atom"), provider: "PhET", description: "Drag protons, neutrons and electrons to build atoms and ions, then check the element, charge and mass." },
          { title: "Isotopes and Atomic Mass", url: phet("isotopes-and-atomic-mass"), provider: "PhET", description: "Mix isotopes and see how natural abundance produces the relative atomic mass in the periodic table." },
        ],
      },
      {
        id: "chem-equations",
        subjectId: "chemistry",
        title: "Chemical Equations & the Mole",
        level: "Both",
        minutes: 42,
        years: [2016, 2017, 2019, 2021, 2023, 2024],
        overview:
          "The mole is the chemist's counting unit. Balanced equations plus mole ratios let you predict exactly how much product a reaction gives — the backbone of every quantitative chemistry question.",
        keyPoints: [
          "One mole contains 6.02 × 10²³ particles (Avogadro's constant).",
          "Moles n = mass ÷ molar mass, so n = m/M.",
          "For gases at STP, one mole occupies 22.4 dm³ (at RTP, 24 dm³).",
          "For solutions, n = concentration (mol/dm³) × volume (dm³).",
          "Balancing an equation conserves atoms of each element on both sides; never change a formula, only coefficients.",
          "The limiting reagent is completely used up and determines the maximum yield.",
        ],
        formulas: ["n = m/M", "n = CV", "n = V/22.4 (STP)", "% yield = (actual/theoretical) × 100", "N = n × 6.02×10²³"],
        examTips: [
          "Write the balanced equation first — every quantitative mark depends on it.",
          "Underline the mole ratio you are using so the examiner can follow your reasoning.",
          "Carry units through your working; a naked number loses the accuracy mark.",
        ],
        sims: [
          { title: "Balancing Chemical Equations", url: phet("balancing-chemical-equations"), provider: "PhET", description: "Balance equations with a visual balance and molecule counter. Includes a game mode with three levels." },
          { title: "Reactants, Products and Leftovers", url: phet("reactants-products-and-leftovers"), provider: "PhET", description: "Make sandwiches then molecules to understand limiting reagents intuitively." },
        ],
      },
      {
        id: "chem-acids",
        subjectId: "chemistry",
        title: "Acids, Bases, Salts & pH",
        level: "Both",
        minutes: 38,
        years: [2017, 2018, 2020, 2022, 2023, 2024],
        overview:
          "Acids release H⁺ ions in water and bases release OH⁻. The pH scale measures acidity, and titration lets you find an unknown concentration precisely — the most common practical in UNEB Chemistry.",
        keyPoints: [
          "pH = −log₁₀[H⁺]. pH 7 is neutral, below 7 acidic, above 7 alkaline.",
          "Strong acids (HCl, H₂SO₄, HNO₃) ionise completely; weak acids (CH₃COOH) ionise partially.",
          "Neutralisation: acid + base → salt + water. With carbonates you also get CO₂.",
          "Indicators: methyl orange turns red in acid / yellow in alkali; phenolphthalein is colourless in acid / pink in alkali.",
          "Titration finds the exact volume needed to neutralise; the endpoint is the colour change.",
          "Titration calculation: use C₁V₁/n₁ = C₂V₂/n₂ where n is the mole ratio from the balanced equation.",
        ],
        formulas: ["pH = −log₁₀[H⁺]", "C₁V₁/n₁ = C₂V₂/n₂", "Moles = CV/1000 (V in cm³)", "pH + pOH = 14"],
        examTips: [
          "Record titre values to 2 decimal places and average only concordant titres (within 0.10 cm³).",
          "Choose the indicator based on the salt formed: strong acid + weak base → methyl orange.",
          "Always rinse the burette with the solution it will contain — this is a standard practical mark.",
        ],
        sims: [
          { title: "pH Scale: Basics", url: phet("ph-scale-basics"), provider: "PhET", description: "Dip the probe into coffee, soap and blood; dilute solutions and watch pH and H⁺ concentration change." },
          { title: "Acid-Base Solutions", url: phet("acid-base-solutions"), provider: "PhET", description: "Compare strong and weak acids at the particle level with conductivity and pH meters." },
          { title: "Molarity", url: phet("molarity"), provider: "PhET", description: "Vary solute and volume to master concentration calculations before your titration." },
        ],
      },
      {
        id: "chem-organic",
        subjectId: "chemistry",
        title: "Organic Chemistry: Alcohols, Acids & Esters",
        level: "A",
        minutes: 40,
        years: [2018, 2019, 2021, 2022, 2023, 2024],
        overview:
          "Organic chemistry studies carbon compounds. Esterification — the reaction of a carboxylic acid with an alcohol — is a perennial UACE question because it links mechanism, conditions and uses.",
        keyPoints: [
          "Functional groups define reactivity: −OH alcohol, −COOH carboxylic acid, −COO− ester.",
          "Esterification: alcohol + carboxylic acid ⇌ ester + water, catalysed by concentrated H₂SO₄ and heated under reflux.",
          "The reaction is reversible; excess alcohol or removing water drives it forward (Le Chatelier).",
          "Esters have characteristically sweet, fruity smells and are used in flavourings and perfumes.",
          "Hydrolysis of an ester with NaOH (saponification) gives a carboxylate salt and an alcohol — the basis of soap making.",
          "Oxidation of a primary alcohol gives an aldehyde then a carboxylic acid; secondary alcohols give ketones; tertiary resist oxidation.",
        ],
        formulas: ["RCOOH + R′OH ⇌ RCOOR′ + H₂O", "Ethanol: C₂H₅OH", "Ethanoic acid: CH₃COOH", "Ethyl ethanoate: CH₃COOC₂H₅"],
        examTips: [
          "State the catalyst AND the condition (conc. H₂SO₄, reflux) — both carry marks.",
          "Show the reversible arrow ⇌ in esterification; a single arrow loses a mark.",
          "Name esters as alkyl alkanoate: the alcohol part comes first.",
        ],
        sims: [{ title: "Molecule Shapes: Basics", url: phet("molecule-shapes-basics"), provider: "PhET", description: "Build molecules and see bond angles and shapes — useful for understanding functional group geometry." }],
      },
      {
        id: "chem-rates",
        subjectId: "chemistry",
        title: "Rates of Reaction & Equilibrium",
        level: "Both",
        minutes: 35,
        years: [2016, 2019, 2020, 2022, 2024],
        overview:
          "Reaction rate measures how fast reactants become products. Collision theory explains why temperature, concentration, surface area and catalysts change the rate.",
        keyPoints: [
          "Collision theory: particles must collide with enough energy (activation energy) and correct orientation.",
          "Increasing temperature increases both the frequency and the energy of collisions — rate rises sharply.",
          "Increasing concentration or pressure puts more particles in the same volume, so more collisions occur.",
          "Smaller particle size increases surface area and therefore rate.",
          "A catalyst provides an alternative pathway with lower activation energy; it is not consumed.",
          "Le Chatelier's principle: a system at equilibrium shifts to oppose any change imposed on it.",
        ],
        formulas: ["Rate = Δ[concentration]/Δtime", "Rate ∝ 1/time taken", "Kc = [products]^n / [reactants]^m"],
        examTips: [
          "When describing a rate graph, mention the steep initial gradient and the plateau when a reactant runs out.",
          "For Le Chatelier questions, always state the direction of shift AND the reason.",
          "Catalysts speed up both forward and reverse reactions equally — they do not change the yield.",
        ],
        sims: [
          { title: "Reversible Reactions", url: phet("reversible-reactions"), provider: "PhET", description: "Watch molecules cross an energy barrier and settle into dynamic equilibrium." },
          { title: "Concentration", url: phet("concentration"), provider: "PhET", description: "Add solute, evaporate water and observe saturation and concentration changes." },
        ],
      },
    ],
  },
  {
    id: "biology",
    name: "Biology",
    code: "553",
    emoji: "🧬",
    gradient: "from-lime-500 to-green-700",
    tint: "bg-lime-50 text-lime-700 border-lime-200",
    description: "Cells, genetics, physiology and ecology — with interactive biological simulations.",
    topics: [
      {
        id: "bio-cells",
        subjectId: "biology",
        title: "Cell Structure & Transport",
        level: "O",
        minutes: 35,
        years: [2016, 2018, 2019, 2021, 2023],
        overview:
          "The cell is the basic unit of life. Understanding organelles and how substances move across the cell membrane explains nearly every physiological process you will study.",
        keyPoints: [
          "Plant cells have a cell wall, chloroplasts and a large permanent vacuole; animal cells do not.",
          "The nucleus controls cell activities and contains DNA; mitochondria release energy through respiration.",
          "The cell membrane is partially permeable, made of a phospholipid bilayer.",
          "Diffusion: net movement of particles from high to low concentration — passive, no energy needed.",
          "Osmosis: movement of water across a partially permeable membrane from dilute to concentrated solution.",
          "Active transport moves substances against the gradient and requires ATP energy from respiration.",
        ],
        formulas: ["Surface area : volume ratio = SA/V", "Magnification = image size ÷ actual size"],
        examTips: [
          "Label diagrams with a ruler and horizontal label lines — untidy labels lose marks.",
          "In osmosis experiments, always mention the partially permeable membrane in your explanation.",
          "Explain results using water potential language: water moves from high to low water potential.",
        ],
        sims: [
          { title: "Diffusion", url: phet("diffusion"), provider: "PhET", description: "Release two gases and watch them mix; change temperature and mass to see how diffusion rate responds." },
          { title: "Membrane Channels", url: phet("membrane-channels"), provider: "PhET", description: "Insert channels into a membrane and watch passive transport rates change." },
        ],
      },
      {
        id: "bio-genetics",
        subjectId: "biology",
        title: "Genetics & Inheritance",
        level: "Both",
        minutes: 42,
        years: [2017, 2018, 2020, 2022, 2023, 2024],
        overview:
          "Genetics explains how characteristics pass from parents to offspring. Punnett squares, monohybrid crosses and sex-linked inheritance are guaranteed UNEB content.",
        keyPoints: [
          "Genes are sections of DNA; alleles are alternative forms of a gene.",
          "Genotype is the genetic makeup (e.g. Tt); phenotype is the observable characteristic (e.g. tall).",
          "Dominant alleles (T) mask recessive alleles (t); recessive traits appear only when homozygous (tt).",
          "A monohybrid cross of two heterozygotes (Tt × Tt) gives a 3:1 phenotypic ratio.",
          "A test cross with a homozygous recessive reveals whether an organism is homozygous or heterozygous dominant.",
          "Sex is determined by XX (female) and XY (male); sex-linked conditions like haemophilia and colour blindness are carried on X.",
        ],
        formulas: ["Monohybrid Tt × Tt → 3:1", "Test cross Tt × tt → 1:1", "Dihybrid ratio = 9:3:3:1"],
        examTips: [
          "Always define your symbols at the start: let T = allele for tallness.",
          "Show the parental genotypes, gametes, Punnett square and ratio — each stage earns marks.",
          "State the ratio as phenotypic or genotypic; do not leave it ambiguous.",
        ],
        sims: [
          { title: "Natural Selection", url: phet("natural-selection"), provider: "PhET", description: "Add mutations to a rabbit population and watch allele frequencies shift under selection pressure." },
          { title: "Gene Expression Essentials", url: phet("gene-expression-essentials"), provider: "PhET", description: "Build proteins from DNA and see transcription and translation happen step by step." },
        ],
      },
      {
        id: "bio-nervous",
        subjectId: "biology",
        title: "Coordination: The Nervous System",
        level: "Both",
        minutes: 38,
        years: [2016, 2019, 2021, 2023, 2024],
        overview:
          "The nervous system coordinates rapid responses to stimuli. Neurones carry electrical impulses and synapses transmit them chemically between cells.",
        keyPoints: [
          "Reflex arc: receptor → sensory neurone → relay neurone (spinal cord) → motor neurone → effector.",
          "Reflex actions are rapid and involuntary, protecting the body before the brain is consciously involved.",
          "A neurone has dendrites, a cell body, an axon and a myelin sheath that speeds up conduction.",
          "The impulse is an electrical wave of depolarisation travelling along the axon membrane.",
          "At a synapse, a neurotransmitter diffuses across the gap and binds to receptors on the next neurone.",
          "The nervous system gives fast, short-lived, localised responses; the endocrine system is slower and longer-lasting.",
        ],
        formulas: ["Speed of impulse = distance ÷ time", "Reaction time = time between stimulus and response"],
        examTips: [
          "Learn the reflex arc sequence in order — it is frequently worth 5 marks on its own.",
          "Compare nervous and hormonal coordination in a table if asked; tables score well.",
          "Mention that synapses ensure one-way transmission — a commonly forgotten point.",
        ],
        sims: [{ title: "Neuron", url: phet("neuron"), provider: "PhET", description: "Stimulate a neuron and watch sodium and potassium channels create the action potential." }],
      },
      {
        id: "bio-ecology",
        subjectId: "biology",
        title: "Ecology & Ecosystems",
        level: "O",
        minutes: 32,
        years: [2017, 2020, 2022, 2024],
        overview:
          "Ecology studies how organisms interact with each other and their environment. Food chains, energy flow and nutrient cycles show why ecosystems must stay balanced.",
        keyPoints: [
          "A food chain shows energy flow: producer → primary consumer → secondary consumer → tertiary consumer.",
          "Only about 10% of energy passes to the next trophic level; the rest is lost as heat, movement and waste.",
          "Pyramids of numbers, biomass and energy represent trophic structure; the pyramid of energy is always upright.",
          "The carbon cycle moves carbon through photosynthesis, respiration, decomposition and combustion.",
          "The nitrogen cycle involves nitrogen fixation, nitrification, assimilation and denitrification.",
          "Human activities — deforestation, pollution, overfishing — disrupt these cycles and reduce biodiversity.",
        ],
        formulas: ["Energy transfer efficiency = (energy at level n+1 / energy at level n) × 100"],
        examTips: [
          "Draw arrows in food chains pointing in the direction of energy flow, i.e. towards the consumer.",
          "When asked about human impact, give a named local example such as Lake Victoria or Mabira Forest.",
          "Explain the 10% rule when justifying short food chains.",
        ],
      },
    ],
  },
  {
    id: "history",
    name: "History",
    code: "241",
    emoji: "🏛️",
    gradient: "from-amber-500 to-orange-700",
    tint: "bg-amber-50 text-amber-700 border-amber-200",
    description: "East African and world history with essay frameworks and source analysis.",
    topics: [
      {
        id: "hist-buganda1900",
        subjectId: "history",
        title: "The Buganda Agreement of 1900",
        level: "Both",
        minutes: 40,
        years: [2016, 2018, 2019, 2021, 2022, 2024],
        overview:
          "Signed on 10 March 1900 between Sir Harry Johnston and the regents of the infant Kabaka Daudi Chwa, this agreement redefined land, taxation and governance in Buganda — and shaped Uganda's politics to this day.",
        keyPoints: [
          "Land was divided into mailo land (about 9,000 square miles for chiefs and the royal family) and crown land for the protectorate government.",
          "Hut tax and gun tax were introduced, forcing Baganda into the cash economy and wage labour.",
          "The Kabaka's powers were reduced: he became a constitutional ruler subject to the protectorate governor.",
          "The Lukiiko (parliament) was formalised with 89 members, strengthening the chiefs relative to the Kabaka.",
          "Buganda was granted a privileged position within the protectorate, creating resentment in other regions.",
          "Consequences include landlessness among peasants (bakopi), the rise of a chiefly landed class, and long-term federalism disputes.",
        ],
        examTips: [
          "Structure essays as: introduction defining the agreement, 3–4 body paragraphs (land, taxation, politics, social effects), then conclusion.",
          "Always give the date and the two signing parties in your introduction — examiners look for it.",
          "Balance positive and negative effects; one-sided essays cap at a C.",
        ],
      },
      {
        id: "hist-colonial",
        subjectId: "history",
        title: "Colonial Administration in Uganda",
        level: "Both",
        minutes: 38,
        years: [2017, 2019, 2020, 2023, 2024],
        overview:
          "Britain governed Uganda through indirect rule, using existing African rulers and the Baganda agents system. This shaped ethnic relations, the economy and the path to independence.",
        keyPoints: [
          "Indirect rule used traditional chiefs to collect taxes and maintain order cheaply.",
          "Baganda agents such as Semei Kakungulu were used to extend administration to Bukedi, Bugisu and Teso, causing lasting resentment.",
          "Cash crops — cotton from 1903 and later coffee — were introduced to fund the protectorate and supply British industry.",
          "The Uganda Railway (completed to Kisumu in 1901) opened the interior to trade and Asian commercial settlement.",
          "Education was left largely to missionaries, producing a small Western-educated elite that later led nationalism.",
          "Regional imbalance was deliberate: the south produced cash crops, the north supplied labour and soldiers.",
        ],
        examTips: [
          "Define indirect rule precisely in the first paragraph, then evaluate its success and failure.",
          "Use specific names, places and dates — Kakungulu, 1903 cotton, 1901 railway — to lift your grade.",
          "Link colonial policy to post-independence problems in the conclusion for top marks.",
        ],
      },
      {
        id: "hist-independence",
        subjectId: "history",
        title: "Nationalism & Independence, 1945–1962",
        level: "Both",
        minutes: 36,
        years: [2016, 2018, 2021, 2022, 2024],
        overview:
          "After the Second World War, African nationalism accelerated. Political parties, the Kabaka crisis and constitutional conferences led Uganda to independence on 9 October 1962.",
        keyPoints: [
          "The Uganda National Congress (1952), led by I.K. Musazi, was the first nationalist party.",
          "The 1953–55 deportation of Kabaka Mutesa II by Governor Cohen inflamed Buganda nationalism.",
          "The Democratic Party (1954) drew Catholic support; the UPC under Milton Obote formed in 1960.",
          "The 1961 Lancaster House and 1962 constitutional conferences negotiated the terms of independence.",
          "The UPC–Kabaka Yekka alliance won the 1962 elections; Obote became Prime Minister and Mutesa II the first President.",
          "Independence came on 9 October 1962, but unresolved federal questions led directly to the 1966 crisis.",
        ],
        examTips: [
          "Distinguish internal factors (parties, the Kabaka crisis) from external factors (Ghana 1957, UN pressure, weakened Britain).",
          "The Kabaka's deportation is the single most examined event — know its causes and effects cold.",
          "End with the fragile compromise of the 1962 constitution to show analytical depth.",
        ],
      },
    ],
  },
  {
    id: "english",
    name: "English Language",
    code: "112",
    emoji: "📖",
    gradient: "from-rose-500 to-pink-700",
    tint: "bg-rose-50 text-rose-700 border-rose-200",
    description: "Comprehension, summary, composition and grammar mastery for UCE English.",
    topics: [
      {
        id: "eng-summary",
        subjectId: "english",
        title: "Summary Writing",
        level: "O",
        minutes: 30,
        years: [2016, 2017, 2019, 2021, 2022, 2023, 2024],
        overview:
          "Summary writing tests whether you can identify the main ideas of a passage and express them concisely in your own words within a strict word limit.",
        keyPoints: [
          "Read the question FIRST so you know exactly which points to hunt for.",
          "Underline only points that answer the question — ignore examples, repetition and illustrations.",
          "Write in continuous prose unless told otherwise; no bullet points in the final answer.",
          "Use your own words wherever possible; lifting whole sentences loses language marks.",
          "Respect the word limit; going over by more than 10% is penalised.",
          "Count and write the number of words at the end — it shows the examiner you obeyed the rubric.",
        ],
        examTips: [
          "Aim for one clear sentence per point; link them with connectors like 'moreover', 'in addition', 'however'.",
          "Never add your own opinion or information not in the passage.",
          "Leave two minutes to proofread for tense consistency and spelling.",
        ],
      },
      {
        id: "eng-composition",
        subjectId: "english",
        title: "Composition & Essay Writing",
        level: "O",
        minutes: 35,
        years: [2016, 2018, 2020, 2022, 2024],
        overview:
          "Composition tests fluency, organisation and creativity. UNEB sets narrative, descriptive, argumentative and functional (letters, speeches, reports) compositions.",
        keyPoints: [
          "Spend 5 minutes planning: jot an outline of introduction, 3 body paragraphs and a conclusion.",
          "Narrative essays need a clear plot, vivid detail and dialogue used sparingly but effectively.",
          "Argumentative essays require a thesis, balanced points, evidence and a decisive conclusion.",
          "Functional writing must follow its format exactly: addresses and salutations for letters, headings for reports.",
          "Vary sentence length and use a range of vocabulary — repetition depresses the language mark.",
          "Aim for 350–450 words unless the paper states otherwise.",
        ],
        examTips: [
          "Your opening sentence should hook the reader; avoid 'I am going to write about…'.",
          "One idea per paragraph, each with a topic sentence.",
          "Reserve the last 5 minutes to correct tense, agreement, spelling and punctuation errors.",
        ],
      },
      {
        id: "eng-grammar",
        subjectId: "english",
        title: "Grammar, Tenses & Sentence Structure",
        level: "O",
        minutes: 28,
        years: [2017, 2019, 2021, 2023],
        overview:
          "Accurate grammar underpins every paper. This topic covers tenses, subject–verb agreement, active and passive voice, direct and indirect speech, and concord.",
        keyPoints: [
          "Subject–verb agreement: a singular subject takes a singular verb (The boy runs; The boys run).",
          "Present perfect (has/have + past participle) links a past action to the present.",
          "Passive voice: object + be + past participle + (by agent). Use it when the doer is unknown or unimportant.",
          "Direct to indirect speech shifts tense back one step and changes pronouns and time words.",
          "Conditional sentences: Type 1 (real), Type 2 (unreal present), Type 3 (unreal past).",
          "Avoid double negatives, dangling modifiers and comma splices.",
        ],
        examTips: [
          "For rewrite questions, keep the original meaning exactly — do not add or remove information.",
          "Read the whole sentence before choosing the tense; time markers like 'since', 'ago' and 'yet' are clues.",
          "Check every sentence has a subject and a finite verb.",
        ],
      },
    ],
  },
  {
    id: "geography",
    name: "Geography",
    code: "273",
    emoji: "🌍",
    gradient: "from-teal-500 to-emerald-700",
    tint: "bg-teal-50 text-teal-700 border-teal-200",
    description: "Physical and human geography of Uganda, East Africa and the world.",
    topics: [
      {
        id: "geo-mapwork",
        subjectId: "geography",
        title: "Map Reading & Interpretation",
        level: "O",
        minutes: 35,
        years: [2016, 2018, 2019, 2021, 2022, 2023, 2024],
        overview:
          "Map work is compulsory and highly scoring. You must read grid references, calculate distance and area, interpret relief and describe the human geography shown on a topographic sheet.",
        keyPoints: [
          "Four-figure grid references locate a square; six-figure references locate a point (eastings first, then northings).",
          "Scale converts map distance to ground distance: 1:50,000 means 1 cm represents 0.5 km.",
          "Contours show relief; closely spaced contours mean a steep slope, widely spaced means gentle.",
          "Calculate area by counting full squares plus halves of partial squares, then multiply by the area per square.",
          "Bearings are measured clockwise from north in three digits (e.g. 045°).",
          "Settlement patterns — nucleated, linear, dispersed — reflect relief, water supply and transport routes.",
        ],
        formulas: ["Ground distance = map distance × scale", "Gradient = vertical interval ÷ horizontal equivalent", "Area = number of squares × area per square"],
        examTips: [
          "Always give the map sheet name and scale when asked to describe a map.",
          "Eastings before northings — remember 'along the corridor, up the stairs'.",
          "Use evidence from the map (grid references) in every descriptive answer.",
        ],
      },
      {
        id: "geo-climate",
        subjectId: "geography",
        title: "Climate of Uganda & East Africa",
        level: "Both",
        minutes: 32,
        years: [2017, 2020, 2022, 2024],
        overview:
          "Uganda has a modified equatorial climate influenced by altitude, water bodies, relief and the movement of the Inter-Tropical Convergence Zone (ITCZ).",
        keyPoints: [
          "The equatorial climate zone has rainfall over 1,000 mm spread through the year with two peaks (March–May, September–November).",
          "Altitude lowers temperature by about 6.5 °C per 1,000 m, giving highland areas like Kabale a cool climate.",
          "Lake Victoria creates a lake breeze and convectional rainfall on its northern shores.",
          "The ITCZ migration explains the bimodal rainfall pattern in the south and unimodal in the north.",
          "Relief rainfall occurs on the windward slopes of Mt. Elgon and the Rwenzoris; leeward sides are drier.",
          "The cattle corridor from Karamoja to Rakai is semi-arid with under 800 mm of unreliable rainfall.",
        ],
        examTips: [
          "Always name specific places — Kabale, Karamoja, Entebbe — rather than writing 'some areas'.",
          "When describing a climate graph, quote actual figures for maximum and minimum and the range.",
          "Link climate to human activity (farming, settlement) if the question asks for significance.",
        ],
      },
      {
        id: "geo-population",
        subjectId: "geography",
        title: "Population & Settlement",
        level: "Both",
        minutes: 30,
        years: [2016, 2019, 2021, 2023],
        overview:
          "Uganda has one of the world's youngest and fastest-growing populations. This topic examines distribution, density, growth, migration and their consequences.",
        keyPoints: [
          "Population density = total population ÷ land area, expressed per square kilometre.",
          "Uganda's population is unevenly distributed: dense in the fertile south-west and around Lake Victoria, sparse in Karamoja.",
          "Factors affecting distribution: rainfall, soil fertility, relief, disease (tsetse fly), and historical settlement.",
          "High birth rates and falling death rates produce rapid natural increase and a very youthful age structure.",
          "Rural–urban migration is driven by push factors (land shortage, poverty) and pull factors (jobs, services).",
          "Consequences include pressure on land, unemployment, slum growth in Kampala, and strain on schools and health services.",
        ],
        formulas: ["Density = population ÷ area", "Natural increase = birth rate − death rate", "Dependency ratio = (under 15 + over 64) ÷ (15–64) × 100"],
        examTips: [
          "Use the most recent census figures you know and say they are approximate.",
          "Describe population pyramids by shape: a broad base means high birth rate.",
          "Give both problems AND solutions when asked about rapid population growth.",
        ],
      },
    ],
  },
  {
    id: "ict",
    name: "ICT / Computer Studies",
    code: "840",
    emoji: "💻",
    gradient: "from-violet-500 to-purple-700",
    tint: "bg-violet-50 text-violet-700 border-violet-200",
    description: "Computer fundamentals, applications, networks and problem solving with computers.",
    topics: [
      {
        id: "ict-fundamentals",
        subjectId: "ict",
        title: "Computer Fundamentals & Hardware",
        level: "O",
        minutes: 30,
        years: [2018, 2020, 2022, 2024],
        overview:
          "A computer is an electronic device that accepts data, processes it, stores it and outputs information. Understanding the hardware components and the information processing cycle is the base of the syllabus.",
        keyPoints: [
          "Information processing cycle: input → processing → output, with storage supporting all stages.",
          "The CPU contains the control unit, the arithmetic and logic unit (ALU) and registers.",
          "Primary storage: RAM is volatile and temporary; ROM is non-volatile and permanent.",
          "Secondary storage includes hard disks, SSDs, flash drives and optical discs.",
          "Input devices: keyboard, mouse, scanner, microphone. Output devices: monitor, printer, speaker.",
          "Computer classification by size: supercomputer, mainframe, mini, micro (desktop, laptop, tablet, phone).",
        ],
        formulas: ["1 byte = 8 bits", "1 KB = 1024 bytes", "1 MB = 1024 KB", "1 GB = 1024 MB"],
        examTips: [
          "Give function AND example for each component; one without the other loses half the mark.",
          "Distinguish data (raw facts) from information (processed, meaningful data) — a classic definition question.",
          "Practise storage conversion calculations; they appear regularly.",
        ],
      },
      {
        id: "ict-spreadsheets",
        subjectId: "ict",
        title: "Spreadsheets & Data Handling",
        level: "O",
        minutes: 32,
        years: [2017, 2019, 2021, 2023, 2024],
        overview:
          "Spreadsheets organise data in rows and columns and automate calculation with formulas and functions — essential for the practical paper.",
        keyPoints: [
          "A cell reference combines column letter and row number, e.g. B7.",
          "Every formula begins with an equals sign, e.g. =A1+B1.",
          "Relative references change when copied (A1 → A2); absolute references are fixed with $ (e.g. $A$1).",
          "Common functions: SUM, AVERAGE, MAX, MIN, COUNT, IF, VLOOKUP.",
          "The IF function: =IF(condition, value_if_true, value_if_false) — used for grading and pass/fail columns.",
          "Charts visualise data: column for comparison, line for trends, pie for proportions.",
        ],
        formulas: ["=SUM(A1:A10)", "=AVERAGE(B2:B20)", "=IF(C2>=50,\"PASS\",\"FAIL\")", "=COUNTIF(D2:D50,\">80\")"],
        examTips: [
          "Read whether the question wants a formula or a function and answer accordingly.",
          "Use absolute references when a constant such as a tax rate is in one cell.",
          "Always save your practical work with the filename format the paper specifies.",
        ],
      },
      {
        id: "ict-networks",
        subjectId: "ict",
        title: "Networks, Internet & Cyber Safety",
        level: "Both",
        minutes: 30,
        years: [2018, 2020, 2022, 2023, 2024],
        overview:
          "A network connects computers to share resources and communicate. The internet is the largest network of all, and using it safely is now an examinable skill.",
        keyPoints: [
          "LAN covers a small area such as a school; WAN spans cities or countries; MAN covers a metropolitan area.",
          "Network topologies: bus, star, ring, mesh — star is most common in schools.",
          "Transmission media: twisted pair, coaxial, fibre optic (fastest) and wireless (Wi-Fi, cellular).",
          "Key hardware: router, switch, modem, network interface card, access point.",
          "Internet services: WWW, email, VoIP, cloud storage, e-learning platforms.",
          "Cyber safety: strong unique passwords, two-factor authentication, avoiding phishing links, and reporting cyberbullying.",
        ],
        formulas: ["Bandwidth measured in Mbps", "Transfer time = file size ÷ bandwidth"],
        examTips: [
          "Draw topologies neatly with labelled nodes when asked to illustrate.",
          "Give both advantages AND disadvantages of networking when the question says 'discuss'.",
          "For cyber safety questions, give practical measures, not vague statements like 'be careful'.",
        ],
      },
    ],
  },
];

export const ALL_TOPICS: Topic[] = SUBJECTS.flatMap((s) => s.topics);
export const getSubject = (id: string) => SUBJECTS.find((s) => s.id === id);
export const getTopic = (id: string) => ALL_TOPICS.find((t) => t.id === id);
export const subjectName = (id: string) => getSubject(id)?.name ?? id;
