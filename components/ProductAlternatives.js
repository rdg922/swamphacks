import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { OPENAI_API_KEY } from "@env";
import OpenAI from 'openai';

// Prepare OpenAI client
const client = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// A helper function to fetch products from Open Food Facts
const fetchOFFProducts = async (searchTerm) => {
  const url = "https://us.openfoodfacts.org/cgi/search.pl";
  const params = `?search_terms=${encodeURIComponent(searchTerm)}&page_size=20&json=1`;
  try {
    const response = await fetch(url + params);
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.warn("Failed to fetch from Open Food Facts:", error);
    return [];
  }
};

const getEcoScore = (product) => {
  if (typeof product.ecoscore_score === 'number') {
    return product.ecoscore_score; // 0–100
  }

  const grade = (product.ecoscore_grade || "").toUpperCase();
  switch (grade) {
    case "A":
      return 100;
    case "B":
      return 80;
    case "C":
      return 60;
    case "D":
      return 40;
    case "E":
      return 20;
    default:
      return 0; // if no data, default to 0
  }
};

const ProductAlternatives = ({ query = "Lays Chips" }) => {
  const [aiSynonyms, setAiSynonyms] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Call OpenAI to get synonyms/alternative descriptions
  const getSynonymsFromAI = async (searchTerm) => {
    try {
      const prompt = `You are a helpful AI that is given the name of a food product. You will generate short alternative and more sustainable product descriptors or synonyms for searching on Open Food Facts.

For instance:
- If the user types "Nutella", you might suggest: "chocolate hazelnut spread".
- If the user types "Lay's chips", you might suggest: "crisps", "salted potato chips".

The user might want up to 3 alternative search terms. 
Output ONLY a JSON array of strings with no additional commentary, e.g.:

["term1", "term2", "term3"]

Given the user typed: "${searchTerm}"`;

      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo", // or "gpt-4", if available
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

      // Parse the model's JSON array
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

  // 2. Use the synonyms to fetch alternatives from Open Food Facts
  const fetchAlternativeProducts = async (searchTerm) => {
    setIsLoading(true);
    try {
      const synonyms = await getSynonymsFromAI(searchTerm);
      setAiSynonyms(synonyms);

      // Also include the original searchTerm
      const allSearchTerms = [searchTerm, ...synonyms];

      // Collect products in a Map to avoid duplicates
      const productSet = new Map(); // key: product_id, value: product object

      for (const term of allSearchTerms) {
        const results = await fetchOFFProducts(term);
        results.forEach((prod) => {
          if (!productSet.has(prod._id)) {
            productSet.set(prod._id, prod);
          }
        });
      }

      // Convert Map back to an array
      let combinedProducts = Array.from(productSet.values());

      // Sort by eco score (descending: best -> worst)
      combinedProducts.sort((a, b) => b.ecoscore_score - a.ecoscore_score);

      setProducts(combinedProducts);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlternativeProducts(query);
  }, [query]);

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
          {aiSynonyms.length > 0 && (
            <Text style={styles.synonyms}>AI synonyms: {aiSynonyms.join(", ")}</Text>
          )}
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

