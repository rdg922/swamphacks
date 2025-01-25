import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { OPENAI_API_KEY } from "@env";
import OpenAI from 'openai';

// Prepare OpenAI client
const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// 1. Smaller page_size to reduce fetch time
const fetchOFFProducts = async (searchTerm) => {
  const url = "https://us.openfoodfacts.org/cgi/search.pl";
  // Set page_size to 5 instead of 20
  const params = `?search_terms=${encodeURIComponent(searchTerm)}&page_size=5&json=1`;

  try {
    const response = await fetch(url + params);
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.warn("Failed to fetch from Open Food Facts:", error);
    return [];
  }
};

const getSynonymsFromAI = async (searchTerm) => {
  try {
    // 2. Limit synonyms to just 2 for speed
    const prompt = `You are a helpful AI that is given the name of a food product. You will generate up to 2 short alternative and more sustainable product descriptors or synonyms for searching on Open Food Facts.

Output ONLY a JSON array of strings with no additional commentary, e.g.:
["term1", "term2"]

Given the user typed: "${searchTerm}"`;

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant knowledgeable about sustainable shopping.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
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
  // 1) Get synonyms from AI
  const synonyms = await getSynonymsFromAI(searchTerm);

  // 2) Build a full list of search terms (including original)
  const allSearchTerms = [searchTerm, ...synonyms];

  // 3) Collect products in a Map to avoid duplicates
  const productSet = new Map(); // key: product_id, value: product object
  for (const term of allSearchTerms) {
    const results = await fetchOFFProducts(term);
    results.forEach((prod) => {
      if (!productSet.has(prod._id)) {
        productSet.set(prod._id, prod);
      }
    });
  }

  // 4) Convert the Map to an array
  let combinedProducts = Array.from(productSet.values());

  // 5) Sort by Eco-Score (descending)
  combinedProducts.sort((a, b) => (b.ecoscore_score || 0) - (a.ecoscore_score || 0));

  // 6) Keep only top 5 (or 10) for speed/uniqueness
  const finalProducts = combinedProducts.slice(0, 5);

  return {
    synonyms,
    products: finalProducts,
  };
}

export const ProductAlternatives = ({ query = "Lays Chips", isLoading, products }) => {
  // UI Rendering
  const renderProduct = ({ item }) => {
    const productName = item.product_name || item.product_name_en || "Unknown";
    const brand = item.brands || "No brand";
    const ecoGrade = item.ecoscore_grade || "N/A";
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.title}>{productName}</Text>
        <Text>Brand: {brand}</Text>
        <Text>Eco-Score: {ecoGrade.toUpperCase()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <>
          {products.length === 0 ? (
            <Text>No products found.</Text>
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => item._id || Math.random().toString()}
              renderItem={renderProduct}
            />
          )}
        </>
      )}
    </View>
  );
};

export default ProductAlternatives;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  synonyms: {
    marginBottom: 8,
    fontStyle: "italic",
  },
  itemContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
});

