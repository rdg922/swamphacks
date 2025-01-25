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
import { getAlternativeData } from "../../components/ProductAlternatives";

const ItemScreen = ({ navigation, route }) => {
  const { barcode } = route.params;
  const { addFridgeItems } = useContext(FridgeContext);

  const [itemData, setItemData] = useState(null);
  const [alternativesData, setAlternativesData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchItem = async () => {
    setLoading(true);
    const itemData = await getBarcodeData(barcode);
    setItemData(itemData);
    console.log(itemData);
    setLoading(false);

    const altData = await getAlternativeData(itemData.name);
    setAlternativesData(altData);
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
    <SafeAreaView className="flex-1 items-center px-5 bg-[#FFF982] space-y-4">
      <View className="bg-white w-full rounded-2xl shadow-neo space-x-4 items-center justify-center p-5 flex-row">
        <Image
          source={{ uri: itemData.image_url }}
          className="w-24 h-24 rounded-xl"
        />
        <Text className="font-bold text-xl text-center flex-shrink">
          {itemData.name}
        </Text>
      </View>

      <View className="flex-row space-x-4">
        <View className="bg-white rounded-2xl shadow-neo flex-grow">
        </View>
        <View className="bg-white rounded-2xl shadow-neo">
          <Text className="font-semibold text-lg text-center">
            Ecoscore: {itemData.ecoscore_grade}
          </Text>
          <View className="flex-row">
            {alternativesData ?
              <AlternativesButton onPress={() => {
                navigation.navigate("Alternatives", { alternativesData })
              }} /> : <></>

            }
            <AddButton
              onPress={() => {
                addFridgeItems(itemData);
                navigation.goBack();
              }}
            />
          </View>
        </View>
      </View>


      <AddButton
        onPress={() => {
          addFridgeItems(itemData);
          navigation.navigate('Fridge');
        }}
      />
    </SafeAreaView>
  );
};

export default ItemScreen;
