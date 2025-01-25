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
import AlternativesButton from "../../components/AlternativesButton";

const ItemScreen = ({ navigation, route }) => {
  const { barcode } = route.params;
  const { addFridgeItems } = useContext(FridgeContext);

  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchItem = async () => {
    setLoading(true);
    const data = await getBarcodeData(barcode);
    setItemData(data);
    console.log(data);
    setLoading(false);
  };

  useState(() => {
    fetchItem();
  }, []);

  if (loading) {
    return (
      <SafeAreaView>
        <View>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  if (!itemData) {
    return (
      <SafeAreaView>
        <View>
          <Text>Invalid barcode.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="items-center px-5">
      <Text className="font-bold text-3xl text-center mt-4">
        {itemData.name}
      </Text>
      <Image
        source={{ uri: itemData.image_url }}
        className="w-60 h-60 rounded-xl mt-5"
      />
      <Text className="font-semibold text-lg text-center mt-4">
        Nutriscore: {itemData.nutriscore_grade}
      </Text>
      <Text className="font-semibold text-lg text-center">
        Ecoscore: {itemData.ecoscore_grade}
      </Text>
      <View className="flex-row">
        <AlternativesButton onPress={() => {
          navigation.navigate("Alternatives");
        }} />
        <AddButton
          onPress={() => {
            addFridgeItems(itemData);
            navigation.goBack();
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ItemScreen;
