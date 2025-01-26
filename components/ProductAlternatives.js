import { OPENAI_API_KEY } from "@env";
import OpenAI from "openai";
import { offToDict } from "../logic/barcodeFetch";

// Prepare OpenAI client
const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

async function fetchOFFProducts(searchTerm) {
  // Basic validation
  if (!searchTerm || typeof searchTerm !== "string" || !searchTerm.trim()) {
    return [];
  }

  const url = "https://us.openfoodfacts.org/cgi/search.pl";
  const params = `?search_terms=${encodeURIComponent(searchTerm)}&page_size=1&json=1`;

  try {
    const response = await fetch(url + params);
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.warn("Failed to fetch from Open Food Facts:", error);
    return [];
  }
}

async function getSynonymsFromAI(searchTerm) {
  // Basic validation
  if (!searchTerm || typeof searchTerm !== "string" || !searchTerm.trim()) {
    return [];
  }

  const prompt = `You are a helpful AI that is given the name of a food product.
You will generate up to 5 short alternative product descriptors or synonyms for searching on Open Food Facts 
that produce a more diverse or unique set of results.

For example:
- If the user types "Nutella", you might suggest terms like "organic hazelnut cocoa spread", 
  "chocolate almond butter", "sugar-free cocoa spread", or "fair trade hazelnut spread".
- If the user types "Lay's chips", you might suggest: 
  "baked potato crisps", "veggie chips", "kettle-cooked chips", "low-salt potato chips".

Avoid repeating the exact brand name or user input.
Output ONLY a JSON array of strings with no additional commentary, e.g.:
["term1", "term2", "term3", "term4", "term5"]

Given the user typed: "${searchTerm}"`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // Use the appropriate model
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant knowledgeable about sustainable and healthy shopping.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 100,
    });

    const aiResponse = response.choices[0]?.message?.content?.trim() || "";
    try {
      const synonyms = JSON.parse(aiResponse);
      if (Array.isArray(synonyms)) {
        // Limit to 5 synonyms
        return synonyms.slice(0, 5);
      }
    } catch (err) {
      console.warn("Could not parse AI response as JSON:", err, aiResponse);
    }
    return [];
  } catch (error) {
    console.warn("OpenAI API error:", error);
    return [];
  }
}

// Merge results into a Map to avoid duplicates by product ID
function mergeResultsIntoMap(productsArray, productMap) {
  productsArray.forEach((prod) => {
    const code = prod.code || prod._id || Math.random().toString();
    const data = { code, product: prod };
    const dict = offToDict(data);

    // Use dict.id as a unique key
    if (!productMap.has(dict.id)) {
      productMap.set(dict.id, dict);
    }
  });
}

export async function getAlternativeData(searchTerm) {
  // If user provided no input or an invalid search term, return early
  if (!searchTerm || typeof searchTerm !== "string" || !searchTerm.trim()) {
    console.warn("No valid search term provided to getAlternativeData");
    return { products: [] };
  }

  // We'll store deduplicated products in this Map
  const productMap = new Map();

  try {
    // 1) Fetch the main OFF results and synonyms from AI in parallel
    const [mainResults, synonymsFromAI] = await Promise.all([
      fetchOFFProducts(searchTerm),
      getSynonymsFromAI(searchTerm),
    ]);

    // Merge main results
    mergeResultsIntoMap(mainResults, productMap);

    // 2) Only if we have fewer than 5 items do we fetch synonyms
    if (productMap.size < 5 && synonymsFromAI.length > 0) {
      // Fetch each synonym in parallel
      const synonymFetchPromises = synonymsFromAI.map((syn) =>
        fetchOFFProducts(syn)
      );
      const synonymResultsArray = await Promise.all(synonymFetchPromises);

      // Merge all results from synonyms
      synonymResultsArray.forEach((synRes) => mergeResultsIntoMap(synRes, productMap));
    }

    // Convert final map to an array
    let combinedProducts = Array.from(productMap.values());

    // Sort by Eco-Score (descending) or adapt to your sorting needs
    combinedProducts.sort((a, b) => (b.ecoscore_score || 0) - (a.ecoscore_score || 0));

    // Limit final results to 5, if that's desired
    combinedProducts = combinedProducts.slice(0, 5);

    return { products: combinedProducts };
  } catch (error) {
    console.warn("Error in getAlternativeData:", error);
    return { products: [] };
  }
}

