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
} from "react-native";
import { getBarcodeData } from "../../logic/barcodeFetch";
import { FridgeContext } from "../../contexts/FridgeContext";
import { StyleSheet } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

const FridgeScreen = ({ navigation }) => {
  const { fridgeItems, isLoadingFridgeItems, loadFridgeItems, addFridgeItems } =
    useContext(FridgeContext);
  return (
    <SafeAreaView className="flex flex-col">
      <View className="flex-row justify-between items-center p-4 bg-neo-red">
        <View className="flex-row justify-between items-center p-4 bg-neo-purple border-black border-[5px] rounded-xl shadow-neo">
          <Text className="text-3xl font-bold">My Fridge</Text>
        </View>
        <View className="flex-row justify-between items-center p-4 bg-neo-purple border-black border-[5px] rounded-xl shadow-neo">
          <Text className="text-xl font-bold">Sort By: Date</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate("ScanBarcode")}
        className="rounded-full bg-neo-green w-20 h-20"
      >
        <FontAwesome6 name="add" color="white" size={40} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default FridgeScreen;
