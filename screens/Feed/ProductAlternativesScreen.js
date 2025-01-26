import { useContext, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { getBarcodeData } from "../../logic/barcodeFetch";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { AddButton } from "../../components/AddButton";
import { FridgeContext } from "../../contexts/FridgeContext";

const ProductAlternativesScreen = ({ navigation, route }) => {
  console.log("params", Object.keys(route.params));

  const { products } = route.params.alternativesData;

  // UI Rendering
  const renderProduct = ({ item }) => {
    const productName = item.product_name || item.product_name_en || "Unknown";
    const brand = item.brands || "No brand";
    const ecoGrade = item.ecoscore_grade || "N/A";
    return (
      <View className="bg-white border-black border-[5px] rounded-xl p-4 shadow-neo mb-4">
        <Text className="text-2xl font-bold mb-2">{productName}</Text>
        <Text className="text-lg">Brand: {brand}</Text>
        <Text className="text-lg">Eco-Score: {ecoGrade.toUpperCase()}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-neo-bg p-4">
      <>
        {products.length === 0 ? (
          <Text className="text-xl font-bold">No products found.</Text>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item._id || Math.random().toString()}
            renderItem={renderProduct}
          />
        )}
      </>
    </SafeAreaView>
  );
};

export default ProductAlternativesScreen;
