import { OPENAI_API_KEY } from "@env";
import OpenAI from 'openai';
import { offToDict } from "../logic/barcodeFetch";

// Prepare OpenAI client
const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// 1. Smaller page_size to reduce fetch time
const fetchOFFProducts = async (searchTerm) => {
  const url = "https://us.openfoodfacts.org/cgi/search.pl";
  const params = `?search_terms=${encodeURIComponent(searchTerm)}&page_size=1&json=1`;

  try {
    const response = await fetch(url + params);
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.warn("Failed to fetch from Open Food Facts:", error);
    console.log(url + params);
    console.log(data);
    return [];
  }
};

const getSynonymsFromAI = async (searchTerm) => {
  try {
    const prompt = `You are a helpful AI that is given the name of a food product. 
You will generate up to 5 short alternative product descriptors or synonyms for searching on Open Food Facts 
that produce a more diverse or unique set of results.

For example:
- If the user types "Nutella", you might suggest terms like "organic hazelnut cocoa spread", 
  "chocolate almond butter", "sugar-free cocoa spread", or "fair trade hazelnut spread".
  Avoid repeating the exact brand name. 
- If the user types "Lay's chips", you might suggest: 
  "baked potato crisps", "veggie chips", "kettle-cooked chips", "low-salt potato chips".

Output ONLY a JSON array of strings with no additional commentary, e.g.:
["term1", "term2", "term3", "term4", "term5"]

Given the user typed: "${searchTerm}"`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant knowledgeable about sustainable and healthy shopping.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 100,
    });

    const aiResponse = response.choices[0]?.message?.content?.trim();
    let synonyms = [];
    try {
      synonyms = JSON.parse(aiResponse);
    } catch (err) {
      console.warn("Could not parse AI response as JSON:", err, aiResponse);
    }

    if (!Array.isArray(synonyms)) {
      synonyms = [];
    }
    return synonyms;
  } catch (error) {
    console.warn("OpenAI API error:", error);
    return [];
  }
};

/**
 * Fetch synonyms + OFF products, returning at most 5 unique products
 */
export async function getAlternativeData(searchTerm) {
  try {

    console.log("start", Date.now());


    const attemptGettingAlternativeData = async () => {
      // 1) Get synonyms from AI
      const synonyms = await getSynonymsFromAI(searchTerm);
      console.log("got syn", Date.now());

      // 2) Build a full list of search terms (including the original)
      const allSearchTerms = [searchTerm, ...synonyms];

      // 3) Fetch products for all search terms in parallel
      const fetchPromises = allSearchTerms.map((term) => fetchOFFProducts(term));

      // Run all fetches concurrently using Promise.all
      const resultsArrays = await Promise.all(fetchPromises);
      console.log("All fetches completed", Date.now());

      // Flatten the results into a single array
      const allProducts = resultsArrays.flat();
      // 4) Collect products in a Map to avoid duplicates
      const productSet = new Map(); // key: product_id, value: product object
      allProducts.forEach((prod) => {
        const code = prod.code || prod._id || Math.random().toString();
        const data = {
          code,
          product: prod,
        };

        const dict = offToDict(data);
        if (!productSet.has(dict.id)) {
          productSet.set(dict.id, dict);
        }
      });

      // 5) Convert the Map to an array
      let combinedProducts = Array.from(productSet.values());

      // 6) Sort by Eco-Score (descending)
      combinedProducts.sort((a, b) => (b.ecoscore_score || 0) - (a.ecoscore_score || 0));
      return combinedProducts;
    }
    let products = (await attemptGettingAlternativeData()) || (await attemptGettingAlternativeData());



    return {
      products,
    };
  } catch (error) {
    console.log(error)
  }
}

