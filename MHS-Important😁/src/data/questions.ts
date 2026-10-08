export type QType = "mcq" | "short" | "structured";

export interface Question {
  id: string;
  subjectId: string;
  topicId: string;
  type: QType;
  prompt: string;
  options?: string[];
  answer: number | string[];
  marks: number;
  explanation: string;
  difficulty: 1 | 2 | 3;
  years: number[];
}

const SUBJ: Record<string, string> = {
  math: "math",
  phy: "physics",
  chem: "chemistry",
  bio: "biology",
  hist: "history",
  eng: "english",
  geo: "geography",
  ict: "ict",
};

let n = 0;
const subjOf = (topicId: string) => SUBJ[topicId.split("-")[0]];

/** Multiple choice */
const m = (
  topicId: string,
  prompt: string,
  options: string[],
  answer: number,
  explanation: string,
  difficulty: 1 | 2 | 3 = 2,
  years: number[] = [],
): Question => ({
  id: `q${++n}`,
  subjectId: subjOf(topicId),
  topicId,
  type: "mcq",
  prompt,
  options,
  answer,
  marks: 1,
  explanation,
  difficulty,
  years,
});

/** Short answer — accepts any of the listed strings (case/space insensitive) */
const s = (
  topicId: string,
  prompt: string,
  accepted: string[],
  explanation: string,
  marks = 2,
  difficulty: 1 | 2 | 3 = 2,
  years: number[] = [],
): Question => ({
  id: `q${++n}`,
  subjectId: subjOf(topicId),
  topicId,
  type: "short",
  prompt,
  answer: accepted,
  marks,
  explanation,
  difficulty,
  years,
});

/** Structured / essay — self-assessed against a mark scheme */
const t = (topicId: string, prompt: string, scheme: string[], marks: number, difficulty: 1 | 2 | 3 = 3, years: number[] = []): Question => ({
  id: `q${++n}`,
  subjectId: subjOf(topicId),
  topicId,
  type: "structured",
  prompt,
  answer: scheme,
  marks,
  explanation: "Mark scheme: " + scheme.join(" • "),
  difficulty,
  years,
});

export const QUESTIONS: Question[] = [
  // ---------------- MATHEMATICS ----------------
  m("math-quadratics", "Solve the equation x² − 5x + 6 = 0.", ["x = 1 or x = 6", "x = 2 or x = 3", "x = −2 or x = −3", "x = 5 or x = 6"], 1, "Factorising gives (x − 2)(x − 3) = 0, so x = 2 or x = 3.", 1, [2019, 2022]),
  m("math-quadratics", "What is the discriminant of 2x² + 3x − 5 = 0?", ["49", "−31", "9", "25"], 0, "Δ = b² − 4ac = 3² − 4(2)(−5) = 9 + 40 = 49.", 2, [2021]),
  m("math-quadratics", "If Δ < 0 for a quadratic equation, the roots are:", ["Real and equal", "Real and distinct", "Not real (complex)", "Both zero"], 2, "A negative discriminant means the parabola never crosses the x-axis, so there are no real roots.", 1, [2018, 2023]),
  m("math-quadratics", "The turning point of y = x² − 6x + 5 is at x =", ["−3", "3", "6", "5"], 1, "x = −b/2a = −(−6)/(2×1) = 3.", 2, [2024]),
  s("math-quadratics", "Find the sum of the roots of 3x² − 12x + 7 = 0.", ["4", "4.0"], "Sum of roots = −b/a = −(−12)/3 = 4.", 2, 2, [2022]),
  t("math-quadratics", "Solve the inequality x² − x − 6 > 0 and represent the solution on a number line.", ["Factorise: (x − 3)(x + 2) > 0", "Critical values x = 3 and x = −2", "Test intervals and select where expression is positive", "Answer: x < −2 or x > 3", "Correct number line with open circles"], 5, 3, [2019, 2023]),

  m("math-vectors", "Given a = (3, 4), find |a|.", ["7", "5", "12", "25"], 1, "|a| = √(3² + 4²) = √25 = 5.", 1, [2020]),
  m("math-vectors", "If OA = (2, 1) and OB = (5, 7), then AB =", ["(7, 8)", "(3, 6)", "(−3, −6)", "(10, 7)"], 1, "AB = OB − OA = (5 − 2, 7 − 1) = (3, 6).", 2, [2022, 2024]),
  m("math-vectors", "Two vectors are perpendicular when their dot product is:", ["1", "−1", "0", "Equal to their magnitudes"], 2, "cos 90° = 0, so a·b = |a||b|cos 90° = 0.", 1, [2019]),
  s("math-vectors", "Find the dot product of a = (2, 3) and b = (4, −1).", ["5"], "a·b = (2)(4) + (3)(−1) = 8 − 3 = 5.", 2, 2, [2024]),
  t("math-vectors", "Points A(1, 2), B(4, 8) and C(6, 12) are given. Show that A, B and C are collinear.", ["AB = OB − OA = (3, 6)", "BC = OC − OB = (2, 4)", "AB = 1.5 × BC, so AB is parallel to BC", "They share point B, therefore A, B and C are collinear"], 5, 3, [2021]),

  m("math-probability", "A fair die is rolled once. What is P(even number)?", ["1/6", "1/3", "1/2", "2/3"], 2, "Even outcomes are 2, 4, 6 — that is 3 out of 6, which simplifies to 1/2.", 1, [2018]),
  m("math-probability", "If P(A) = 0.3 and P(B) = 0.5 and they are independent, P(A and B) =", ["0.8", "0.15", "0.2", "0.35"], 1, "For independent events P(A ∩ B) = P(A) × P(B) = 0.3 × 0.5 = 0.15.", 2, [2021, 2024]),
  m("math-probability", "A bag has 4 red and 6 blue balls. Two are drawn without replacement. P(both red) =", ["4/25", "2/15", "1/6", "8/45"], 1, "(4/10) × (3/9) = 12/90 = 2/15.", 3, [2023]),
  s("math-probability", "The probability that a student passes is 0.85. What is the probability that the student fails?", ["0.15", "15%", ".15"], "P(fail) = 1 − P(pass) = 1 − 0.85 = 0.15.", 2, 1, [2020]),

  m("math-calculus", "Differentiate y = 4x³ with respect to x.", ["12x²", "4x²", "12x³", "x⁴"], 0, "Power rule: dy/dx = 3 × 4x^(3−1) = 12x².", 1, [2019]),
  m("math-calculus", "At a stationary point, dy/dx equals:", ["1", "0", "Infinity", "The y-value"], 1, "The gradient is zero at a maximum, minimum or point of inflexion.", 1, [2022]),
  m("math-calculus", "If d²y/dx² > 0 at a stationary point, the point is a:", ["Maximum", "Minimum", "Point of inflexion", "Root"], 1, "A positive second derivative means the curve is concave up, giving a minimum.", 2, [2021, 2024]),
  s("math-calculus", "Find dy/dx if y = x² + 3x − 7 at the point x = 2.", ["7"], "dy/dx = 2x + 3; at x = 2 this gives 4 + 3 = 7.", 3, 2, [2023]),
  t("math-calculus", "A farmer has 100 m of fencing to enclose a rectangular plot against a straight river (no fence needed on the river side). Find the maximum area.", ["Let width = x, length = 100 − 2x", "Area A = x(100 − 2x) = 100x − 2x²", "dA/dx = 100 − 4x = 0 → x = 25", "d²A/dx² = −4 < 0 confirms maximum", "Maximum area = 25 × 50 = 1250 m²"], 6, 3, [2022]),

  m("math-statistics", "The mean of 4, 8, 6, 10, 2 is:", ["5", "6", "7", "8"], 1, "Sum = 30, and 30 ÷ 5 = 6.", 1, [2018]),
  m("math-statistics", "For grouped data, the mean is calculated using:", ["Σx/n", "Σfx/Σf", "Σf/Σx", "Middle value"], 1, "Each class midpoint x is weighted by its frequency f.", 2, [2022]),
  m("math-statistics", "The interquartile range is:", ["Q3 + Q1", "Q3 − Q1", "Q2 − Q1", "Max − Min"], 1, "IQR = upper quartile − lower quartile, a measure of spread resistant to outliers.", 1, [2020, 2024]),
  s("math-statistics", "Find the median of 3, 7, 9, 4, 12, 8, 5.", ["7"], "Arranged: 3, 4, 5, 7, 8, 9, 12. The middle (4th) value is 7.", 2, 1, [2019]),

  // ---------------- PHYSICS ----------------
  m("phy-projectile", "For a projectile launched at angle θ with speed u, the horizontal component of velocity is:", ["u sin θ", "u cos θ", "u tan θ", "u/2"], 1, "Resolving horizontally gives uₓ = u cos θ, and it stays constant throughout the flight.", 1, [2019, 2023]),
  m("phy-projectile", "The maximum range of a projectile on level ground occurs at a launch angle of:", ["30°", "45°", "60°", "90°"], 1, "R = u² sin 2θ/g is maximum when sin 2θ = 1, i.e. 2θ = 90°, so θ = 45°.", 1, [2020, 2024]),
  m("phy-projectile", "At the highest point of its path, a projectile's vertical velocity is:", ["Maximum", "Equal to u", "Zero", "Equal to g"], 2, "The vertical component decelerates under gravity until it is momentarily zero at the peak.", 1, [2017, 2022]),
  s("phy-projectile", "A ball is thrown at 20 m/s at 30° to the horizontal. Calculate its time of flight. (g = 10 m/s²)", ["2", "2 s", "2.0"], "T = 2u sin θ/g = (2 × 20 × 0.5)/10 = 2 s.", 3, 2, [2023]),
  t("phy-projectile", "A stone is projected at 40 m/s at 60° to the horizontal. Calculate (a) maximum height (b) horizontal range. Take g = 10 m/s².", ["u_y = 40 sin 60° = 34.6 m/s", "H = u²sin²θ/2g = (1600 × 0.75)/20 = 60 m", "R = u² sin2θ/g = 1600 × sin120°/10", "R = 1600 × 0.866/10 = 138.6 m"], 6, 3, [2024]),

  m("phy-forces", "Newton's second law is best expressed as:", ["F = mv", "F = ma", "F = mgh", "F = m/a"], 1, "The resultant force equals mass times acceleration.", 1, [2018]),
  m("phy-forces", "The SI unit of force is the:", ["Joule", "Watt", "Newton", "Pascal"], 2, "One newton is the force that gives a 1 kg mass an acceleration of 1 m/s².", 1, [2016, 2021]),
  m("phy-forces", "A 5 kg object accelerates at 3 m/s². The resultant force is:", ["1.67 N", "8 N", "15 N", "45 N"], 2, "F = ma = 5 × 3 = 15 N.", 1, [2022, 2024]),
  m("phy-forces", "Momentum is conserved in a collision provided that:", ["Kinetic energy is conserved", "No external force acts", "The bodies stick together", "The masses are equal"], 1, "Conservation of momentum requires a closed system with no net external force.", 2, [2019]),
  s("phy-forces", "State Newton's third law of motion.", ["for every action there is an equal and opposite reaction", "action and reaction are equal and opposite"], "Forces always occur in pairs that are equal in magnitude, opposite in direction, and act on different bodies.", 2, 1, [2021]),

  m("phy-electricity", "Ohm's law states that:", ["V = IR", "V = I/R", "I = VR", "R = VI"], 0, "For a metallic conductor at constant temperature, voltage is directly proportional to current.", 1, [2017, 2023]),
  m("phy-electricity", "Three 6 Ω resistors in parallel give a total resistance of:", ["18 Ω", "6 Ω", "3 Ω", "2 Ω"], 3, "1/R = 1/6 + 1/6 + 1/6 = 3/6, so R = 2 Ω.", 2, [2021, 2024]),
  m("phy-electricity", "Electrical power can be calculated as:", ["P = V/I", "P = VI", "P = I/V", "P = V + I"], 1, "Power = voltage × current; equivalently I²R or V²/R.", 1, [2019]),
  m("phy-electricity", "In a series circuit, which quantity is the same through every component?", ["Voltage", "Resistance", "Current", "Power"], 2, "There is only one path, so the same current flows everywhere.", 1, [2016, 2022]),
  s("phy-electricity", "A 12 V battery drives 3 A through a resistor. Calculate the resistance.", ["4", "4 ohms", "4Ω", "4 Ω"], "R = V/I = 12/3 = 4 Ω.", 2, 1, [2023]),
  t("phy-electricity", "Describe an experiment to determine the internal resistance of a cell using a voltmeter, ammeter and rheostat.", ["Connect cell, rheostat, ammeter in series with voltmeter across the cell", "Vary rheostat and record pairs of V and I", "Plot a graph of V against I", "Gradient = −r (internal resistance)", "Intercept on V-axis = EMF", "State at least two precautions"], 8, 3, [2022]),

  m("phy-waves", "The wave equation is:", ["v = f/λ", "v = fλ", "v = λ/f", "f = vλ"], 1, "Speed equals frequency multiplied by wavelength.", 1, [2018, 2024]),
  m("phy-waves", "Total internal reflection occurs when light travels from:", ["Less dense to denser medium at any angle", "Denser to less dense medium beyond the critical angle", "Any medium to a vacuum", "Air to glass at 90°"], 1, "Both conditions are required: dense → less dense, and angle of incidence greater than the critical angle.", 2, [2020, 2022]),
  m("phy-waves", "Sound waves are:", ["Transverse", "Longitudinal", "Electromagnetic", "Stationary only"], 1, "Sound compresses and rarefies the medium parallel to the direction of travel.", 1, [2021]),
  s("phy-waves", "A wave of frequency 50 Hz has a wavelength of 4 m. Calculate its speed.", ["200", "200 m/s", "200ms-1"], "v = fλ = 50 × 4 = 200 m/s.", 2, 1, [2024]),

  m("phy-energy", "Kinetic energy is given by:", ["mgh", "½mv²", "mv", "Fs"], 1, "KE = ½mv², measured in joules.", 1, [2019]),
  m("phy-energy", "The unit of power is the:", ["Joule", "Newton", "Watt", "Volt"], 2, "One watt equals one joule per second.", 1, [2017, 2023]),
  s("phy-energy", "A 2 kg mass is lifted 5 m. Calculate the gain in potential energy. (g = 10 m/s²)", ["100", "100 J", "100J"], "PE = mgh = 2 × 10 × 5 = 100 J.", 2, 1, [2022]),

  // ---------------- CHEMISTRY ----------------
  m("chem-atomic", "The atomic number of an element is the number of:", ["Neutrons", "Protons", "Electrons + neutrons", "Nucleons"], 1, "Atomic number Z equals the proton count and defines the element.", 1, [2018, 2022]),
  m("chem-atomic", "Isotopes of an element have the same:", ["Mass number", "Number of neutrons", "Number of protons", "Density"], 2, "Isotopes share the proton number but differ in neutron number.", 1, [2016, 2024]),
  m("chem-atomic", "The electron configuration of sodium (Z = 11) is:", ["2, 8, 1", "2, 8, 8", "8, 2, 1", "2, 9"], 0, "Shells fill 2 then 8, leaving 1 electron in the third shell.", 2, [2020]),
  m("chem-atomic", "Across a period from left to right, atomic radius generally:", ["Increases", "Decreases", "Stays the same", "Doubles"], 1, "Nuclear charge increases while shielding stays similar, pulling electrons closer.", 2, [2022]),
  s("chem-atomic", "An atom has mass number 39 and atomic number 19. How many neutrons does it have?", ["20"], "Neutrons = A − Z = 39 − 19 = 20.", 2, 1, [2024]),

  m("chem-equations", "One mole of any substance contains how many particles?", ["6.02 × 10²³", "3.14 × 10⁸", "1.6 × 10⁻¹⁹", "9.8 × 10²"], 0, "This is Avogadro's constant.", 1, [2019, 2023]),
  m("chem-equations", "The number of moles in 36 g of water (M = 18 g/mol) is:", ["0.5", "1", "2", "18"], 2, "n = m/M = 36/18 = 2 mol.", 1, [2021, 2024]),
  m("chem-equations", "Balancing a chemical equation demonstrates the law of:", ["Definite proportions", "Conservation of mass", "Partial pressures", "Multiple proportions"], 1, "Atoms are neither created nor destroyed, so mass is conserved.", 1, [2017]),
  m("chem-equations", "At STP, one mole of any gas occupies:", ["1 dm³", "18 dm³", "22.4 dm³", "100 dm³"], 2, "The molar volume of a gas at standard temperature and pressure is 22.4 dm³.", 2, [2022]),
  s("chem-equations", "Balance: __ H₂ + __ O₂ → __ H₂O. Give the coefficients in order.", ["2,1,2", "2 1 2", "212"], "2H₂ + O₂ → 2H₂O balances 4 hydrogen and 2 oxygen atoms on each side.", 3, 2, [2023]),
  t("chem-equations", "25.0 cm³ of 0.10 M HCl exactly neutralises 20.0 cm³ of NaOH. Calculate the concentration of the NaOH solution.", ["Equation: HCl + NaOH → NaCl + H₂O, ratio 1:1", "Moles HCl = 0.10 × 25/1000 = 0.0025 mol", "Moles NaOH = 0.0025 mol (1:1 ratio)", "C = n/V = 0.0025 ÷ (20/1000)", "C = 0.125 mol/dm³"], 6, 3, [2024]),

  m("chem-acids", "A solution with pH 3 is:", ["Strongly alkaline", "Weakly alkaline", "Neutral", "Acidic"], 3, "Any pH below 7 is acidic; pH 3 indicates a fairly strong acid.", 1, [2018, 2022]),
  m("chem-acids", "Phenolphthalein in an alkaline solution is:", ["Colourless", "Pink", "Yellow", "Blue"], 1, "Phenolphthalein is colourless in acid and pink in alkali.", 1, [2020, 2024]),
  m("chem-acids", "Acid + carbonate produces salt, water and:", ["Hydrogen", "Oxygen", "Carbon dioxide", "Ammonia"], 2, "Carbonates release CO₂, which turns limewater milky.", 1, [2017, 2023]),
  m("chem-acids", "Which acid is a weak acid?", ["Hydrochloric acid", "Sulphuric acid", "Nitric acid", "Ethanoic acid"], 3, "Ethanoic acid only partially ionises in water.", 2, [2022]),
  s("chem-acids", "Name the products when hydrochloric acid reacts with sodium hydroxide.", ["sodium chloride and water", "salt and water", "nacl and water"], "Neutralisation gives a salt (NaCl) and water.", 2, 1, [2019]),

  m("chem-organic", "Esterification is the reaction between an alcohol and a:", ["Ketone", "Carboxylic acid", "Alkane", "Base"], 1, "RCOOH + R′OH ⇌ RCOOR′ + H₂O, catalysed by concentrated sulphuric acid.", 1, [2021, 2024]),
  m("chem-organic", "The catalyst used in esterification is:", ["Dilute HCl", "Concentrated H₂SO₄", "NaOH", "MnO₂"], 1, "Concentrated sulphuric acid catalyses and also removes water, shifting equilibrium right.", 2, [2019, 2023]),
  m("chem-organic", "Oxidation of a primary alcohol first gives:", ["A ketone", "An aldehyde", "An ester", "An alkane"], 1, "Primary alcohol → aldehyde → carboxylic acid on further oxidation.", 2, [2022]),
  s("chem-organic", "Give the name of the ester formed from ethanol and ethanoic acid.", ["ethyl ethanoate", "ethylethanoate"], "The alcohol supplies the alkyl part (ethyl) and the acid the alkanoate part.", 2, 2, [2024]),
  t("chem-organic", "Describe how you would prepare a sample of ethyl ethanoate in the laboratory, stating conditions and one safety precaution.", ["Mix ethanol and ethanoic acid in a flask", "Add a few drops of concentrated H₂SO₄ as catalyst", "Heat under reflux for about 20 minutes", "Distil off the ester and purify with sodium carbonate solution", "Safety: conc. H₂SO₄ is corrosive — wear goggles / avoid naked flames as ethanol is flammable"], 7, 3, [2023]),

  m("chem-rates", "Increasing temperature increases reaction rate mainly because particles:", ["Get bigger", "Collide more often and more energetically", "Become catalysts", "Lose activation energy"], 1, "Higher temperature raises both collision frequency and the proportion of collisions exceeding activation energy.", 1, [2019, 2024]),
  m("chem-rates", "A catalyst increases the rate of a reaction by:", ["Increasing activation energy", "Lowering activation energy", "Increasing temperature", "Being consumed"], 1, "It provides an alternative reaction pathway with lower activation energy.", 1, [2016, 2022]),
  m("chem-rates", "According to Le Chatelier, increasing pressure favours the side with:", ["More gas molecules", "Fewer gas molecules", "More liquid", "Equal molecules"], 1, "The system shifts to reduce pressure by moving to the side with fewer gas moles.", 2, [2020]),
  s("chem-rates", "State two factors that increase the rate of a chemical reaction.", ["temperature and concentration", "concentration and surface area", "temperature and catalyst", "surface area and temperature"], "Any two of: temperature, concentration, pressure (gases), surface area, catalyst, light (some reactions).", 2, 1, [2022]),

  // ---------------- BIOLOGY ----------------
  m("bio-cells", "Which organelle is the site of respiration?", ["Nucleus", "Ribosome", "Mitochondrion", "Chloroplast"], 2, "Mitochondria release energy as ATP through aerobic respiration.", 1, [2018, 2023]),
  m("bio-cells", "Osmosis is the movement of:", ["Solutes from high to low concentration", "Water across a partially permeable membrane", "Ions using ATP", "Gases through stomata"], 1, "Water moves from a region of higher water potential to lower water potential.", 1, [2016, 2021]),
  m("bio-cells", "A structure present in plant cells but absent in animal cells is the:", ["Nucleus", "Cell wall", "Cell membrane", "Mitochondrion"], 1, "Plant cells also have chloroplasts and a large permanent vacuole.", 1, [2019, 2024]),
  m("bio-cells", "Active transport differs from diffusion because it:", ["Is passive", "Requires energy", "Only moves water", "Happens only in plants"], 1, "Active transport moves substances against the concentration gradient using ATP.", 2, [2022]),
  s("bio-cells", "Name the process by which plants lose water vapour through the leaves.", ["transpiration"], "Transpiration is the evaporation of water from leaf surfaces, mainly through stomata.", 2, 1, [2021]),

  m("bio-genetics", "The observable characteristic of an organism is its:", ["Genotype", "Phenotype", "Allele", "Chromosome"], 1, "Phenotype is the expression of the genotype in the environment.", 1, [2018, 2022]),
  m("bio-genetics", "A cross between two heterozygous tall plants (Tt × Tt) gives a phenotypic ratio of:", ["1:1", "3:1", "9:3:3:1", "1:2:1"], 1, "Three tall to one short — the classic monohybrid ratio.", 1, [2020, 2024]),
  m("bio-genetics", "Human sex chromosomes in a male are:", ["XX", "XY", "YY", "XO"], 1, "Females are XX, males XY; the father determines the sex of the child.", 1, [2017, 2023]),
  m("bio-genetics", "Haemophilia is described as sex-linked because the gene is carried on the:", ["Y chromosome", "X chromosome", "Autosomes", "Mitochondria"], 1, "It is a recessive allele on the X chromosome, so males are affected more often.", 2, [2022]),
  t("bio-genetics", "In pea plants, tall (T) is dominant to short (t). Cross a heterozygous tall plant with a short plant. Show the cross and state the expected ratio.", ["Let T = tall, t = short", "Parents: Tt × tt", "Gametes: T, t and t, t", "Punnett square giving Tt, Tt, tt, tt", "Ratio 1 tall : 1 short (50% each)"], 5, 2, [2024]),

  m("bio-nervous", "The correct order of the reflex arc is:", ["Receptor → motor → relay → sensory → effector", "Receptor → sensory → relay → motor → effector", "Effector → sensory → relay → motor → receptor", "Sensory → receptor → motor → relay → effector"], 1, "The stimulus is detected by a receptor and the response carried out by an effector.", 2, [2019, 2023]),
  m("bio-nervous", "The gap between two neurones is called a:", ["Node", "Synapse", "Dendrite", "Axon"], 1, "Neurotransmitters diffuse across the synaptic cleft to continue the impulse.", 1, [2021, 2024]),
  m("bio-nervous", "The myelin sheath functions to:", ["Produce neurotransmitters", "Speed up impulse conduction", "Store energy", "Detect stimuli"], 1, "Myelin insulates the axon and allows saltatory conduction between nodes of Ranvier.", 2, [2022]),
  s("bio-nervous", "Give one difference between nervous and hormonal coordination.", ["nervous is faster", "nervous is fast hormonal is slow", "nervous uses electrical impulses hormonal uses chemicals"], "Nervous: fast, short-lived, localised, electrical. Hormonal: slower, longer-lasting, widespread, chemical.", 2, 2, [2023]),

  m("bio-ecology", "Approximately what percentage of energy passes to the next trophic level?", ["1%", "10%", "50%", "90%"], 1, "Around 90% is lost as heat, movement and undigested waste.", 1, [2020, 2024]),
  m("bio-ecology", "In a food chain, green plants are called:", ["Consumers", "Producers", "Decomposers", "Predators"], 1, "They make their own food by photosynthesis.", 1, [2017]),
  s("bio-ecology", "Name the process by which bacteria convert atmospheric nitrogen into nitrates.", ["nitrogen fixation", "nitrogen-fixation"], "Nitrogen-fixing bacteria such as Rhizobium convert N₂ into compounds plants can absorb.", 2, 2, [2022]),

  // ---------------- HISTORY ----------------
  m("hist-buganda1900", "The Buganda Agreement was signed in:", ["1890", "1894", "1900", "1902"], 2, "It was signed on 10 March 1900 between Sir Harry Johnston and the Buganda regents.", 1, [2018, 2022]),
  m("hist-buganda1900", "Land allocated to chiefs and the royal family under the agreement was called:", ["Crown land", "Mailo land", "Freehold land", "Communal land"], 1, "About 9,000 square miles were shared out as mailo land.", 1, [2019, 2024]),
  m("hist-buganda1900", "Which tax was introduced by the 1900 Agreement?", ["Income tax", "Hut and gun tax", "Value added tax", "Poll tax only"], 1, "Hut tax and gun tax pushed the Baganda into the money economy.", 2, [2021]),
  t("hist-buganda1900", "Discuss the effects of the 1900 Buganda Agreement on the people of Buganda.", ["Introduction: define the agreement, date and signatories", "Land: mailo system created a landed chiefly class and landless bakopi", "Taxation: hut and gun tax forced people into wage labour and cash crops", "Politics: Kabaka reduced to constitutional ruler, Lukiiko strengthened", "Social: rise of Western education and Christianity among chiefs", "Negative: regional imbalance and resentment from other kingdoms", "Conclusion: long-term legacy on Uganda's federal politics"], 20, 3, [2022, 2024]),

  m("hist-colonial", "The system of governing through existing African rulers was called:", ["Direct rule", "Indirect rule", "Assimilation", "Association"], 1, "Britain used chiefs to administer cheaply on its behalf.", 1, [2017, 2023]),
  m("hist-colonial", "Semei Kakungulu is best known for:", ["Signing the 1900 Agreement", "Extending British administration to eastern Uganda", "Founding the UPC", "Leading the 1945 riots"], 1, "He conquered and administered Bukedi, Bugisu and Teso as a Baganda agent.", 2, [2020, 2024]),
  m("hist-colonial", "The main cash crop introduced in Uganda in 1903 was:", ["Coffee", "Tea", "Cotton", "Sugarcane"], 2, "Cotton was introduced by the Uganda Company to supply British textile mills.", 1, [2019]),

  m("hist-independence", "Uganda attained independence on:", ["9 October 1962", "1 January 1960", "9 October 1963", "12 December 1961"], 0, "Uganda became independent on 9 October 1962 with Obote as Prime Minister.", 1, [2018, 2024]),
  m("hist-independence", "Kabaka Mutesa II was deported by the British in:", ["1949", "1953", "1958", "1961"], 1, "Governor Andrew Cohen deported him in 1953, triggering a nationalist upsurge.", 2, [2021, 2022]),
  m("hist-independence", "The first nationalist political party in Uganda was the:", ["UPC", "DP", "Uganda National Congress", "Kabaka Yekka"], 2, "The UNC was formed in 1952 under I.K. Musazi.", 2, [2016]),

  // ---------------- ENGLISH ----------------
  m("eng-summary", "In summary writing you should:", ["Copy sentences directly", "Use your own words", "Add your opinion", "Write in bullet points always"], 1, "Own-word expression earns the language marks; lifting is penalised.", 1, [2019, 2023]),
  m("eng-summary", "The first thing to do in a summary question is:", ["Count the words", "Read the question and identify what is required", "Write the introduction", "Underline every sentence"], 1, "Knowing the focus prevents you from including irrelevant points.", 1, [2021, 2024]),
  s("eng-summary", "What should you always do at the end of a summary answer?", ["state the number of words", "write the word count", "count the words"], "Writing the word count shows the examiner you respected the limit.", 2, 1, [2022]),

  m("eng-composition", "Which of these is a functional composition?", ["A narrative story", "A formal letter", "A descriptive essay", "A poem"], 1, "Functional writing follows a set format: letters, reports, speeches, memos.", 1, [2020]),
  m("eng-composition", "A good paragraph should contain:", ["Several unrelated ideas", "One main idea with supporting detail", "Only one sentence", "Only dialogue"], 1, "Unity of idea, introduced by a topic sentence, is the mark of good paragraphing.", 1, [2018, 2024]),
  t("eng-composition", "Write an argumentative composition of about 400 words on: 'Mobile phones should be allowed in secondary schools.'", ["Clear introduction stating a position", "At least three well-developed arguments with examples", "Acknowledgement and rebuttal of the opposing view", "Logical paragraphing with connectors", "Strong conclusion restating the stand", "Accurate grammar, spelling and varied vocabulary"], 20, 3, [2022]),

  m("eng-grammar", "Choose the correct sentence.", ["The boys is playing", "The boys are playing", "The boys be playing", "The boys plays"], 1, "A plural subject takes a plural verb.", 1, [2019, 2023]),
  m("eng-grammar", "Change to passive voice: 'The teacher marked the books.'", ["The books marked the teacher", "The books were marked by the teacher", "The books are marking", "The teacher was marked"], 1, "Object + be + past participle + by agent.", 2, [2021, 2024]),
  s("eng-grammar", "Give the past participle of the verb 'write'.", ["written"], "Write → wrote (past simple) → written (past participle).", 2, 1, [2022]),

  // ---------------- GEOGRAPHY ----------------
  m("geo-mapwork", "On a 1:50,000 map, 1 cm represents:", ["50 m", "500 m", "5 km", "50 km"], 1, "50,000 cm = 500 m = 0.5 km.", 1, [2018, 2023]),
  m("geo-mapwork", "In a six-figure grid reference, which comes first?", ["Northings", "Eastings", "Latitude", "Bearing"], 1, "Read along the corridor (eastings) then up the stairs (northings).", 1, [2019, 2024]),
  m("geo-mapwork", "Closely spaced contour lines indicate:", ["A gentle slope", "A steep slope", "Flat land", "A valley only"], 1, "The closer the contours, the greater the change in height over a short distance.", 1, [2021, 2022]),
  s("geo-mapwork", "A bearing measured clockwise from north of 45° is written how many digits?", ["three", "3", "three digits", "045"], "Bearings are always written in three figures, e.g. 045°.", 2, 2, [2024]),

  m("geo-climate", "Uganda's climate is best described as:", ["Desert", "Modified equatorial", "Mediterranean", "Temperate"], 1, "Altitude and water bodies modify the true equatorial climate.", 1, [2020, 2024]),
  m("geo-climate", "Temperature decreases with altitude at roughly:", ["1 °C per 1000 m", "6.5 °C per 1000 m", "15 °C per 1000 m", "0.5 °C per 100 m"], 1, "This is the environmental lapse rate.", 2, [2022]),
  m("geo-climate", "The cattle corridor of Uganda is characterised by:", ["Very high rainfall", "Low and unreliable rainfall", "Permanent snow", "Dense rainforest"], 1, "It stretches from Karamoja to Rakai and receives under 800 mm annually.", 2, [2017, 2023]),

  m("geo-population", "Population density is calculated as:", ["Population × area", "Population ÷ area", "Area ÷ population", "Births − deaths"], 1, "It is expressed as people per square kilometre.", 1, [2019, 2023]),
  m("geo-population", "A population pyramid with a very broad base indicates:", ["Low birth rate", "High birth rate", "Ageing population", "Zero growth"], 1, "Many children relative to adults means a high birth rate and youthful structure.", 2, [2021, 2024]),
  s("geo-population", "State one pull factor for rural–urban migration in Uganda.", ["employment", "jobs", "better services", "education", "health services"], "Pull factors attract migrants: jobs, education, health care, entertainment, electricity.", 2, 1, [2022]),

  // ---------------- ICT ----------------
  m("ict-fundamentals", "The brain of the computer is the:", ["RAM", "CPU", "Hard disk", "Monitor"], 1, "The central processing unit performs all processing and control.", 1, [2020, 2024]),
  m("ict-fundamentals", "Which memory is volatile?", ["ROM", "RAM", "Hard disk", "Flash drive"], 1, "RAM loses its contents when power is switched off.", 1, [2018, 2022]),
  m("ict-fundamentals", "1 kilobyte equals:", ["100 bytes", "1000 bits", "1024 bytes", "8 bytes"], 2, "Storage uses powers of two: 2¹⁰ = 1024.", 1, [2021]),
  s("ict-fundamentals", "Differentiate between data and information in one sentence.", ["data is raw facts while information is processed data", "data is unprocessed information is processed"], "Data are raw unprocessed facts; information is data processed into a meaningful form.", 3, 2, [2024]),

  m("ict-spreadsheets", "Every spreadsheet formula must begin with:", ["+", "=", "#", "@"], 1, "The equals sign tells the application to evaluate the expression.", 1, [2019, 2023]),
  m("ict-spreadsheets", "Which function counts cells that meet a condition?", ["SUM", "COUNTIF", "AVERAGE", "MAX"], 1, "COUNTIF(range, criteria) counts only the matching cells.", 2, [2021, 2024]),
  m("ict-spreadsheets", "$A$1 is an example of a:", ["Relative reference", "Absolute reference", "Mixed reference", "Range name"], 1, "The dollar signs lock both the column and the row when copying.", 2, [2022]),
  s("ict-spreadsheets", "Write a formula that returns PASS if cell C2 is 50 or more, otherwise FAIL.", ["=if(c2>=50,\"pass\",\"fail\")", "=if(c2>=50,pass,fail)"], "=IF(C2>=50,\"PASS\",\"FAIL\") — the condition, then the true value, then the false value.", 3, 2, [2023]),

  m("ict-networks", "A network covering a small area such as a school is a:", ["WAN", "MAN", "LAN", "VPN"], 2, "Local Area Network.", 1, [2020, 2024]),
  m("ict-networks", "Which transmission medium is fastest?", ["Twisted pair", "Coaxial", "Fibre optic", "Infrared"], 2, "Fibre optic transmits data as light with very high bandwidth and low loss.", 1, [2022]),
  m("ict-networks", "An attempt to trick a user into revealing a password by a fake email is called:", ["Spamming", "Phishing", "Caching", "Buffering"], 1, "Phishing attacks impersonate trusted organisations.", 1, [2018, 2023]),
  s("ict-networks", "State one measure a student can take to stay safe online.", ["use a strong password", "strong password", "do not share personal information", "enable two factor authentication", "avoid clicking unknown links"], "Good answers: strong unique passwords, two-factor authentication, not sharing personal data, avoiding suspicious links, reporting cyberbullying.", 2, 1, [2024]),
];

export const byTopic = (topicId: string) => QUESTIONS.filter((q) => q.topicId === topicId);
export const bySubject = (subjectId: string) => QUESTIONS.filter((q) => q.subjectId === subjectId);
export const byIds = (ids: string[]) => ids.map((id) => QUESTIONS.find((q) => q.id === id)).filter(Boolean) as Question[];

const norm = (v: string) =>
  v
    .toLowerCase()
    .replace(/[\s,]+/g, " ")
    .replace(/[."'`´]/g, "")
    .trim();

export function markAnswer(q: Question, given: string): { correct: boolean; marks: number } {
  if (given == null || given === "") return { correct: false, marks: 0 };
  if (q.type === "mcq") {
    const correct = Number(given) === q.answer;
    return { correct, marks: correct ? q.marks : 0 };
  }
  if (q.type === "short") {
    const accepted = (q.answer as string[]).map(norm);
    const g = norm(given);
    const correct = accepted.some((a) => g === a || (a.length > 4 && g.includes(a)) || (g.length > 4 && a.includes(g)));
    return { correct, marks: correct ? q.marks : 0 };
  }
  // structured: keyword-based partial credit against the mark scheme
  const scheme = q.answer as string[];
  const g = norm(given);
  if (g.length < 15) return { correct: false, marks: 0 };
  let hits = 0;
  for (const point of scheme) {
    const keywords = norm(point)
      .split(" ")
      .filter((w) => w.length > 4);
    const matched = keywords.filter((k) => g.includes(k)).length;
    if (keywords.length && matched / keywords.length >= 0.34) hits++;
  }
  const ratio = hits / scheme.length;
  const marks = Math.round(ratio * q.marks);
  return { correct: ratio >= 0.6, marks };
}

/** UNEB-style grading */
export function gradeFor(percent: number): { grade: string; label: string; tone: string } {
  if (percent >= 80) return { grade: "D1", label: "Distinction 1", tone: "text-emerald-600 bg-emerald-50 border-emerald-200" };
  if (percent >= 75) return { grade: "D2", label: "Distinction 2", tone: "text-emerald-600 bg-emerald-50 border-emerald-200" };
  if (percent >= 70) return { grade: "C3", label: "Credit 3", tone: "text-sky-600 bg-sky-50 border-sky-200" };
  if (percent >= 65) return { grade: "C4", label: "Credit 4", tone: "text-sky-600 bg-sky-50 border-sky-200" };
  if (percent >= 60) return { grade: "C5", label: "Credit 5", tone: "text-sky-600 bg-sky-50 border-sky-200" };
  if (percent >= 55) return { grade: "C6", label: "Credit 6", tone: "text-indigo-600 bg-indigo-50 border-indigo-200" };
  if (percent >= 50) return { grade: "P7", label: "Pass 7", tone: "text-amber-600 bg-amber-50 border-amber-200" };
  if (percent >= 45) return { grade: "P8", label: "Pass 8", tone: "text-amber-600 bg-amber-50 border-amber-200" };
  return { grade: "F9", label: "Fail 9", tone: "text-rose-600 bg-rose-50 border-rose-200" };
}

export const gradePoints: Record<string, number> = { D1: 1, D2: 2, C3: 3, C4: 4, C5: 5, C6: 6, P7: 7, P8: 8, F9: 9 };

export function divisionFor(aggregate: number, subjectCount: number): string {
  if (subjectCount < 3) return "—";
  const avg = aggregate / subjectCount;
  if (avg <= 2.6) return "Division 1";
  if (avg <= 4.5) return "Division 2";
  if (avg <= 6.2) return "Division 3";
  if (avg <= 7.8) return "Division 4";
  return "Division 9";
}
