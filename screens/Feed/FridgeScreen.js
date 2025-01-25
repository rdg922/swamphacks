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
  const { fridgeItems, isLoadingFridgeItems, loadFridgeItems, addFridgeItems } =
    useContext(FridgeContext);
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
      <View className="flex flex-row justify-between px-4">
        <ItemTile
          imageUrl="https://i5.walmartimages.com/asr/8457cfef-ab75-4bb1-8620-bae6ddd537db.c7d1eb498d47ae519979890cf451d2cf.jpeg"
          name="Nutella"
          expirationDate="1/27"
          isChecked={true}
        />
        <ItemTile
          imageUrl="https://www.lays.com/sites/lays.com/files/2024-02/lays-fun-2%20%281%29%20%281%29%20%281%29.png"
          name="Lays Wavy"
          expirationDate="1/27"
          isChecked={false}
        />
      </View>
      <View className="absolute bottom-7 left-7">
        <TouchableOpacity className="flex-row justify-between items-center p-4 bg-neo-red border-black border-[5px] rounded-xl shadow-neo mt-auto">
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
