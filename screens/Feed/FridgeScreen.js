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
import AlternativesButton from "../../components/AlternativesButton";

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
  return (
    <SafeAreaView className="flex flex-col h-full bg-[#FEF992]">
      <View className="flex-row justify-between items-center p-4">
        <View className="flex-row justify-between items-center p-4 bg-neo-purple border-black border-[5px] rounded-xl shadow-neo">
          <Text className="text-3xl font-bold">My Fridge</Text>
        </View>
        <TouchableOpacity className="flex-row justify-between items-center p-4 bg-neo-light-blue border-black border-[5px] rounded-xl shadow-neo mt-auto">
          <Text className="text-xl font-bold">Sort By: Date</Text>
        </TouchableOpacity>
      </View>
      <View className="flex flex-col justify-between px-4">
        <FlatList
          data={fridgeItems}
          numColumns={2}
          keyExtractor={(item) => item.id}
          className="h-full overflow-visible -z-10"
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <ItemTile
              imageUrl={item.image_url}
              name={item.name}
              expirationDate={item.expirationDate}
              isChecked={item.isChecked}
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
      <View className="absolute bottom-7 left-7">
        <TouchableOpacity
          className="flex-row justify-between items-center p-4 bg-neo-red border-black border-[5px] rounded-xl shadow-neo mt-auto"
          onPress={handleRemoveSelected}
        >
          <Text className="text-xl font-bold">Remove Selected Items</Text>
        </TouchableOpacity>
      </View>
      <View className="absolute bottom-7 right-7">
        <AddButton onPress={() => navigation.navigate("ScanBarcode")} />
      </View>
    </SafeAreaView>
  );
};

export default FridgeScreen;
