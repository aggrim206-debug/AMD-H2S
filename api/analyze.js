import { Anthropic } from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on Vercel.' });
  }

  const { product } = req.body || {};
  if (!product) {
    return res.status(400).json({ error: 'Product data is required' });
  }

  const { product_name, ingredients_text, nutriments } = product;

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const prompt = `
Analyze the following food product based on its ingredients and nutritional data.
Product Name: ${product_name || 'Unknown'}
Ingredients: ${ingredients_text || 'Not provided'}
Nutrition (per 100g):
- Calories: ${nutriments?.['energy-kcal_100g'] || 'Unknown'} kcal
- Protein: ${nutriments?.proteins_100g || 'Unknown'} g
- Carbohydrates: ${nutriments?.carbohydrates_100g || 'Unknown'} g
- Sugars: ${nutriments?.sugars_100g || 'Unknown'} g
- Fat: ${nutriments?.fat_100g || 'Unknown'} g
- Saturated Fat: ${nutriments?.['saturated-fat_100g'] || 'Unknown'} g
- Fiber: ${nutriments?.fiber_100g || 'Unknown'} g
- Sodium: ${nutriments?.sodium_100g || 'Unknown'} g

Provide a structured analysis returning strictly JSON data matching this exact schema:
{
  "health_score": <number 1-10 based on overall nutritional quality and ingredient safety>,
  "pros": [<string>, <string>, <string>],
  "cons": [<string>, <string>, <string>],
  "healthier_alternatives": [<string>, <string>],
  "guideline_context": "<string explaining how this fits into WHO/ICMR guidelines for sugar/fat/sodium intake>"
}
Return ONLY valid JSON without any markdown formatting blocks like \`\`\`json.
  `;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      temperature: 0.2,
      system: "You are an expert nutritionist and data analyst. You provide factual, objective assessments of food products. Output strictly valid JSON.",
      messages: [{ role: "user", content: prompt }]
    });

    const aiResponse = response.content[0].text;
    const cleanJson = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    return res.status(200).json(parsedData);
  } catch (error) {
    console.error("Vercel Serverless Error:", error);
    return res.status(500).json({ error: "Failed to communicate with Claude API", details: error.message });
  }
}
