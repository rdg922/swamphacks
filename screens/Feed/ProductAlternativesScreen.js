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

  // alternativeOf is the item that this is an alternative of, used only for its name rn
  const { alternativeOf, alternativesData } = route.params;
  const { products } = alternativesData;

  // UI Rendering
  const renderProduct = ({ item }) => {
    const productName = item.name || "Unknown";
    // const brand = item.brands || "No brand";
    const ecoGrade = item.ecoscore_grade || "N/A";
    return (
      <View className="rounded-xl shadow-neo border-black border-[5px] bg-neo-light-green w-[48%] mr-1 mb-1">
        <View className="rounded-b-xl rounded-t-lg bg-white p-2">
          {item.image_url ?
            <Image source={{ uri: item.image_url }} className="w-full h-40 rounded-lg " />
            :
            <Image source={require("../../assets/placeholder.png")} className="w-full h-40 rounded-lg " />
          }
        </View>

        <View className="px-2 py-2 bg-neo-light-green rounded-xl">
          <Text className="text-2xl font-bold mb-2" numberOfLines={2}>{productName.slice(0, 30)}</Text>
          <Text className="text-lg">Eco-Score: {ecoGrade.toUpperCase()}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="bg-neo-bg">
      <View className="px-4 flex flex-col h-full">
        {products.length === 0 ? (
          <Text className="text-xl font-bold">No products found.</Text>
        ) : (

          <>
            <View className="flex-row justify-between py-4 gap-7 items-end">
              <View className="flex-row justify-between items-center p-4 bg-neo-purple border-black border-[5px] shadow-neo">
                <Text className="text-3xl font-bold">Alternatives to {alternativeOf.name}</Text>
              </View>
            </View>
            <View className="flex-1 flex-col justify-between">
              <FlatList
                data={products}
                numColumns={2}
                keyExtractor={(item) => item._id || Math.random().toString()}
                className="overflow-visible -z-10"
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={{ justifyContent: "space-between" }}
                contentContainerStyle={{ gap: 10 }}

                renderItem={renderProduct}
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaView >
  );
};

export default ProductAlternativesScreen;
