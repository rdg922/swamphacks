import { useContext, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Image,
  Platform,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { getBarcodeData } from "../../logic/barcodeFetch";
import { FridgeContext } from "../../contexts/FridgeContext";
import { StyleSheet } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { AddButton } from "../../components/AddButton";
import ItemTile from "../../components/ItemTile";

const FridgeScreen = ({ navigation }) => {
  const {
    fridgeItems,
    isLoadingFridgeItems,
    loadFridgeItems,
    addFridgeItems,
    setFridgeItems,
  } = useContext(FridgeContext);

  const handleRemoveSelected = async () => {
    setFridgeItems(fridgeItems.filter((fridgeItem) => !fridgeItem.isChecked));
  };

  const allItemsUnchecked = fridgeItems.every((item) => !item.isChecked);

  return (
    <SafeAreaView className="bg-neo-bg">
      <View className="px-4 flex flex-col h-full">
        <View className="flex-row justify-between py-4 gap-7 items-end">
          <View className="flex-row justify-between items-center p-4 bg-neo-purple border-black border-[5px] shadow-neo">
            <Text className="text-3xl font-bold">My Fridge</Text>
          </View>
          <TouchableOpacity className="flex-row flex-grow items-center p-3 bg-neo-light-blue border-black border-[5px] rounded-xl shadow-neo mt-auto">
            <Text className="text-xl font-bold">Sort By: Date</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1 flex-col justify-between">
          <FlatList
            data={fridgeItems}
            numColumns={2}
            keyExtractor={(item) => item.id}
            className="overflow-visible -z-10"
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => (
              <ItemTile
                id={item.id}
                imageUrl={item.image_url}
                name={item.name}
                expirationDate={item.expirationDate}
                isChecked={item.isChecked}
                navigation={navigation}
                onCheckClick={() => {
                  setFridgeItems(
                    fridgeItems.map((fridgeItem) =>
                      fridgeItem.id === item.id
                        ? { ...fridgeItem, isChecked: !fridgeItem.isChecked }
                        : fridgeItem
                    )
                  );
                }}
              />
            )}
          />
        </View>
        <View className="flex flex-row items-center justify-between px-4 gap-6">
          <View className="flex-grow">
            {allItemsUnchecked ? (
              <TouchableOpacity
                className="flex-row justify-center items-center px-6 py-4 bg-neo-light-blue border-black border-[5px] rounded-xl shadow-neo mt-auto"
                onPress={handleRemoveSelected}
              >
                <Text className="text-xl font-bold">Find Recipes</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="flex-row justify-center items-center px-6 py-4 bg-neo-red border-black border-[5px] rounded-xl shadow-neo mt-auto"
                onPress={handleRemoveSelected}
              >
                <Text className="text-xl font-bold">Delete Items</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="">
            <AddButton onPress={() => navigation.navigate("ScanBarcode")} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FridgeScreen;
