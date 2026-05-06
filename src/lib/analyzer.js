/**
 * Analyzer – derives health score, pros, cons, and flags harmful ingredients
 * from an Open Food Facts product object.
 */

// ─── Harmful / flagged ingredient keywords ────────────────────────────────────
const HARMFUL_KEYWORDS = [
  'high fructose corn syrup',
  'partially hydrogenated',
  'hydrogenated oil',
  'trans fat',
  'monosodium glutamate',
  'aspartame',
  'saccharin',
  'acesulfame',
  'sodium nitrite',
  'sodium nitrate',
  'butylated hydroxyanisole',
  'bha',
  'bht',
  'potassium bromate',
  'brominated vegetable oil',
  'propyl gallate',
  'carrageenan',
  'artificial color',
  'artificial flavour',
  'artificial flavor',
  'red 40',
  'yellow 5',
  'yellow 6',
  'blue 1',
  'blue 2',
];

/**
 * Returns an array of matched harmful ingredient names found in the
 * product's ingredients text.
 */
export function detectHarmfulIngredients(product) {
  const text = (product.ingredients_text || '').toLowerCase();
  return HARMFUL_KEYWORDS.filter((kw) => text.includes(kw));
}

// ─── Nutriscore → numeric ─────────────────────────────────────────────────────
const NUTRISCORE_MAP = { a: 10, b: 8, c: 6, d: 4, e: 2 };

// ─── NOVA group description ───────────────────────────────────────────────────
export const NOVA_LABELS = {
  1: 'Unprocessed / minimally processed food',
  2: 'Processed culinary ingredient',
  3: 'Processed food',
  4: 'Ultra-processed food',
};

/**
 * Compute a health score (1–10) from available product signals.
 * Weights:
 *   - Nutriscore grade  → 40%
 *   - NOVA group        → 30%  (lower = better)
 *   - Sugar penalty     → 15%
 *   - Saturated fat     → 15%
 */
export function computeHealthScore(product) {
  const n = product.nutriments || {};

  // Nutriscore component (0–10)
  const grade = (product.nutriscore_grade || '').toLowerCase();
  const nutriscoreScore = NUTRISCORE_MAP[grade] ?? 5;

  // NOVA component (1=best → 4=worst → invert to 0–10 scale)
  const nova = parseInt(product.nova_group) || 3;
  const novaScore = ((5 - nova) / 4) * 10; // 1→10, 2→7.5, 3→5, 4→2.5

  // Sugar penalty (g per 100g) – WHO recommends <10g free sugars
  const sugar = parseFloat(n['sugars_100g']) || 0;
  const sugarScore = Math.max(0, 10 - sugar * 0.4);

  // Saturated fat penalty (g per 100g) – penalty kicks in > 5g
  const satFat = parseFloat(n['saturated-fat_100g']) || 0;
  const satFatScore = Math.max(0, 10 - satFat * 0.7);

  const raw =
    nutriscoreScore * 0.4 +
    novaScore * 0.3 +
    sugarScore * 0.15 +
    satFatScore * 0.15;

  return Math.min(10, Math.max(1, Math.round(raw * 10) / 10));
}

/**
 * Returns { pros: string[], cons: string[] } based on nutriment data.
 */
export function buildProscons(product) {
  const n = product.nutriments || {};
  const pros = [];
  const cons = [];

  const get = (key) => parseFloat(n[key]) || 0;

  // Protein
  const protein = get('proteins_100g');
  if (protein >= 15) pros.push(`High in protein (${protein.toFixed(1)}g / 100g)`);
  else if (protein < 3) cons.push(`Low protein content (${protein.toFixed(1)}g / 100g)`);

  // Fibre
  const fibre = get('fiber_100g');
  if (fibre >= 5) pros.push(`Good source of fibre (${fibre.toFixed(1)}g / 100g)`);
  else if (fibre < 1) cons.push('Very low in dietary fibre');

  // Sugar
  const sugar = get('sugars_100g');
  if (sugar <= 5) pros.push(`Low sugar (${sugar.toFixed(1)}g / 100g)`);
  else if (sugar > 15) cons.push(`High sugar content (${sugar.toFixed(1)}g / 100g)`);

  // Saturated fat
  const satFat = get('saturated-fat_100g');
  if (satFat <= 1.5) pros.push(`Low saturated fat (${satFat.toFixed(1)}g / 100g)`);
  else if (satFat > 5) cons.push(`High saturated fat (${satFat.toFixed(1)}g / 100g)`);

  // Sodium / Salt
  const salt = get('salt_100g');
  if (salt <= 0.3) pros.push(`Low in salt (${salt.toFixed(2)}g / 100g)`);
  else if (salt > 1.5) cons.push(`High in salt (${salt.toFixed(2)}g / 100g)`);

  // Calories
  const kcal = get('energy-kcal_100g');
  if (kcal < 100) pros.push(`Low calorie density (${kcal.toFixed(0)} kcal / 100g)`);
  else if (kcal > 400) cons.push(`High calorie density (${kcal.toFixed(0)} kcal / 100g)`);

  // Nutriscore
  const grade = (product.nutriscore_grade || '').toUpperCase();
  if (['A', 'B'].includes(grade)) pros.push(`Excellent Nutri-Score (${grade})`);
  else if (['D', 'E'].includes(grade)) cons.push(`Poor Nutri-Score (${grade})`);

  // NOVA
  const nova = parseInt(product.nova_group);
  if (nova === 1) pros.push('Minimally processed (NOVA 1)');
  else if (nova === 4) cons.push('Ultra-processed food (NOVA 4)');

  // Additives
  const additives = (product.additives_tags || []).length;
  if (additives === 0) pros.push('No additives detected');
  else if (additives >= 5) cons.push(`Contains ${additives} food additives`);

  return { pros, cons };
}

/**
 * Extract macros per 100g from nutriments.
 */
export function extractMacros(product) {
  const n = product.nutriments || {};
  const get = (key) => parseFloat(n[key]) || 0;
  return {
    calories: get('energy-kcal_100g'),
    protein:  get('proteins_100g'),
    carbs:    get('carbohydrates_100g'),
    fat:      get('fat_100g'),
    fibre:    get('fiber_100g'),
    sugar:    get('sugars_100g'),
    salt:     get('salt_100g'),
  };
}
