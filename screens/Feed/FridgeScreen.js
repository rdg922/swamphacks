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
} from "react-native";
import { getBarcodeData } from "../../logic/barcodeFetch";
import { FridgeContext } from "../../contexts/FridgeContext";
import { StyleSheet } from "react-native";

const FridgeScreen = () => {
  const { fridgeItems, isLoadingFridgeItems, loadFridgeItems, addFridgeItems } =
    useContext(FridgeContext);
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>Header</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
  },
});

export default FridgeScreen;
