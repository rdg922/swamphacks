import { OPENAI_API_KEY } from "@env";
import OpenAI from "openai";
import { offToDict } from "../logic/barcodeFetch";

// Prepare OpenAI client
const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const getRecipeFromAI = async (searchTerm, previousRecipe) => {
  try {
    const prompt = `You are a helpful AI that is given the name of multiple food products. 
You will generate a well formatted recipe from those food products, complete with ingredients and instructions.
Do not give commentary before or after the recipe, simply respond with the recipe title, ingredients, and steps to prepare it.

Separate each section with a double pipe character like this example: Cheesy Lasagna||
Ingredients: 
...
||
Instructions
...
There should be exactly three sections, the title, the ingredients, and the instructions.
After each instruction, insert one additional newline character to separate them.
${
  previousRecipe
    ? `Previously, you made the recipe ${previousRecipe}, so make something different.`
    : ""
}
You are given the food products:
${searchTerm}`;
    console.log("=========" + previousRecipe);

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant knowledgeable about sustainable and healthy shopping.",
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
  return await getRecipeFromAI(itemNames.join("\n"));
}
