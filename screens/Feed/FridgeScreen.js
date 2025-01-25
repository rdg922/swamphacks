import { useContext, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Image,
  Platform,
  Alert,
} from "react-native";
import { getBarcodeData } from "../../logic/barcodeFetch";
import { FridgeContext } from "../../contexts/FridgeContext";

const FridgeScreen = () => {
  const { fridgeItems, isLoadingFridgeItems, loadFridgeItems, addFridgeItems } =
    useContext(FridgeContext);
  return (
    <View>
      <Text>Testing 123</Text>
    </View>
  );
};

export default FeedScreen;
