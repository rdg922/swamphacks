import { OPENAI_API_KEY } from "@env";
import OpenAI from 'openai';
import { offToDict } from "../logic/barcodeFetch";

// Prepare OpenAI client
const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const getRecipeFromAI = async (searchTerm) => {
  try {
    const prompt = `You are a helpful AI that is given the name of multiple food products. 
You will generate a well formatted recipe from those food products, complete with ingredients and instructions.

Given the food products:
${searchTerm}`;

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
      max_tokens: 1000,
    });

    const aiResponse = response.choices[0]?.message?.content?.trim();
    return aiResponse;
  } catch (error) {
    console.warn("OpenAI API error:", error);
    return [];
  }
};

/**
 * Fetch synonyms + OFF products, returning at most 5 unique products
 */
export async function getRecipe(itemNames) {
  console.log("start", Date.now());
  return await getRecipeFromAI(itemNames.join('\n'));
}

