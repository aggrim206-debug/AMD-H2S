import { Anthropic } from '@anthropic-ai/sdk';

let newsCache = null;
let newsCacheTimestamp = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export default async function handler(req, res) {
  // CORS setup if accessed directly
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on Vercel.' });
  }

  if (newsCache && newsCacheTimestamp && (Date.now() - newsCacheTimestamp < CACHE_DURATION)) {
    return res.status(200).json(newsCache);
  }

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  try {
    const prompt = `Find the 3 most recent, impactful food and nutrition regulations or public health alerts from the WHO, FDA, and ICMR. 
Use the web_search tool to gather information if needed.
Return your final answer strictly as a JSON array of objects matching this schema:
[
  {
    "id": "<unique string>",
    "source": "WHO" | "FDA" | "ICMR",
    "title": "<Short bold title>",
    "date": "<YYYY-MM-DD string roughly>",
    "summary": "<2 line summary of the regulation or alert>"
  }
]
No markdown wrapping, just the raw JSON array.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      temperature: 0.1,
      system: "You are a public health journalist tracking FDA, WHO, and ICMR food regulations. Output valid JSON.",
      tools: [
        {
          name: "web_search",
          description: "Search the web for the latest news and regulations.",
          input_schema: {
            type: "object",
            properties: { query: { type: "string" } },
            required: ["query"]
          }
        }
      ],
      messages: [{ role: "user", content: prompt }]
    });

    let finalAiText = "";

    if (response.stop_reason === "tool_use") {
      const toolCall = response.content.find(c => c.type === "tool_use");
      const mockSearchResults = `
        FDA announces new rules on trans-fat labeling (recent).
        WHO updates guidelines on non-sugar sweeteners, advising against use for weight control (recent).
        ICMR releases updated dietary guidelines for Indians, focusing on ultra-processed foods restriction (recent).
      `;

      const secondResponse = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        temperature: 0.1,
        system: "You are a public health journalist tracking FDA, WHO, and ICMR food regulations. Output valid JSON.",
        tools: [
          {
            name: "web_search",
            description: "Search the web for the latest news and regulations.",
            input_schema: {
              type: "object",
              properties: { query: { type: "string" } },
              required: ["query"]
            }
          }
        ],
        messages: [
          { role: "user", content: prompt },
          { role: "assistant", content: response.content },
          { 
            role: "user", 
            content: [
              {
                type: "tool_result",
                tool_use_id: toolCall.id,
                content: mockSearchResults
              }
            ]
          }
        ]
      });
      finalAiText = secondResponse.content[0].text;
    } else {
      finalAiText = response.content[0].text;
    }

    const cleanJson = finalAiText.replace(/```json\n?|\n?```/g, '').trim();
    const parsedNews = JSON.parse(cleanJson);

    newsCache = parsedNews;
    newsCacheTimestamp = Date.now();

    return res.status(200).json(parsedNews);
  } catch (error) {
    console.error("Vercel Serverless Error:", error);
    return res.status(500).json({ error: "Failed to fetch news", details: error.message });
  }
}
