import { useContext, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import { getBarcodeData } from "../../logic/barcodeFetch";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { AddButton } from "../../components/AddButton";
import { FridgeContext } from "../../contexts/FridgeContext";
import { ProductAlternatives } from "../../components/ProductAlternatives";

const ProductAlternativesScreen = ({ navigation, route }) => {
  console.log("params", Object.keys(route.params));

  const { products } = route.params.alternativesData;


  return (<ProductAlternatives products={products} />);

};

export default ProductAlternativesScreen;
