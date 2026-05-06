/**
 * Open Food Facts API helper
 * Docs: https://world.openfoodfacts.org/api
 */

const BASE = 'https://world.openfoodfacts.org';

const FIELDS = [
  'product_name',
  'brands',
  'image_url',
  'nutriments',
  'nutriscore_grade',
  'nova_group',
  'ingredients_text',
  'ingredients',
  'allergens_tags',
  'additives_tags',
  'ecoscore_grade',
  'quantity',
  'serving_size',
].join(',');

/**
 * Search for products by name.
 * Returns an array of product objects (up to 5).
 */
export async function searchProducts(query) {
  const url = `${BASE}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5&fields=${FIELDS}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  return (data.products || []).filter((p) => p.product_name);
}

/**
 * Fetch a single product by barcode.
 */
export async function getProduct(barcode) {
  const url = `${BASE}/api/v2/product/${barcode}?fields=${FIELDS}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data = await res.json();
  return data.product || null;
}
