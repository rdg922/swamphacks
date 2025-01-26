import { useContext, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Platform,
  Alert,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { getBarcodeData } from "../../logic/barcodeFetch";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import { AddButton } from "../../components/AddButton";
import { FridgeContext } from "../../contexts/FridgeContext";
import { Image, ImageBackground } from "expo-image";
import { getAlternativeData } from "../../components/ProductAlternatives";

const ItemScreen = ({ navigation, route }) => {
  const { barcode } = route.params;
  const { addFridgeItems } = useContext(FridgeContext);

  const [itemData, setItemData] = useState(null);
  const [alternativesData, setAlternativesData] = useState(null);
  const [loading, setLoading] = useState(true);

  const nutriscoreImgs = {
    'a': require('../../assets/productScores/nutriscore-a.png'),
    'b': require('../../assets/productScores/nutriscore-b.png'),
    'c': require('../../assets/productScores/nutriscore-c.png'),
    'd': require('../../assets/productScores/nutriscore-d.png'),
    'e': require('../../assets/productScores/nutriscore-e.png')
  }

  const ecoscoreImgs = {
    'a': require('../../assets/productScores/green-score-a.png'),
    'b': require('../../assets/productScores/green-score-b.png'),
    'c': require('../../assets/productScores/green-score-c.png'),
    'd': require('../../assets/productScores/green-score-d.png'),
    'e': require('../../assets/productScores/green-score-e.png')
  }

  const levelToColor = {
    'high': 'red',
    'moderate': 'orange',
    'low': 'green'
  }

  const scoreToColor = [
    'green',
    'green',
    'orange',
    'red',
    'red'
  ]

  const levelToText = {
    'high': 'High',
    'moderate': 'Moderate',
    'low': 'Low'
  }

  const fetchItem = async () => {
    setLoading(true);
    const data = await getBarcodeData(barcode);
    setItemData(data);
    console.log(data);
    setLoading(false);

    const altData = await getAlternativeData(data.name);
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
    <SafeAreaView className="flex-1 items-center bg-[#FFF982]">
      <ScrollView className="w-full h-full overflow-visible px-5 space-y-4" contentContainerStyle={{alignItems: 'center'}}>
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
      <View className="bg-white rounded-2xl shadow-neo w-40 items-center justify-center">
      { (itemData.nutriscore_grade && itemData.nutriscore_grade !== 'not-applicable') ?
        <Image
        placeholder={{blurhash: 'LtP~yGBjNhrYyErst3X7%%v$s*X7'}}
          source={ nutriscoreImgs[itemData.nutriscore_grade] }
          className="w-36 aspect-[1.85]"
      />
      : <View className="p-3 bg-gray-500 rounded-xl"><Text className="text-white">Missing Nutri-Score</Text></View>
      }
      </View>
      <View className="bg-white rounded-2xl shadow-neo w-40 items-center justify-center">
      { (itemData.ecoscore_grade && itemData.ecoscore_grade !== 'not-applicable') ?
        <Image
        placeholder={{blurhash: 'LTRovk=o-VJEn~j[o#f-.ASkNZr='}}
          source={ ecoscoreImgs[itemData.ecoscore_grade] }
          className="w-36 aspect-[1.85]"
      />
      : <View className="p-3 bg-gray-500 rounded-xl"><Text className="text-white">Missing Green Score</Text></View>
      }
      </View>
      </View>
      { itemData.nova_grade &&
        <View className="bg-white rounded-2xl shadow-neo p-2 w-full space-y-2">
          <View className="flex-row items-center space-x-2">
            <View style={{backgroundColor: scoreToColor[itemData.nova_grade]}} className="p-2 rounded-lg">
              <Text className="font-bold text-white text-xl">{itemData.nova_grade}</Text>
            </View>
          <Text className="font-bold text-lg">Ultra-Processing Level</Text>
          </View>
          <Text className="text-base">Contributing Ingredients: {itemData.nova_data || 'N/A'}</Text>
        </View>
      }
      <View className="w-full flex-row space-x-4">
      <View style={{backgroundColor: levelToColor[itemData.fat_level] || 'gray'}} className="flex-1 rounded-2xl shadow-neo p-2 justify-center items-center">
        <FontAwesome6 name='droplet' size={30} color='white'/>
        <Text numberOfLines={1} className="font-bold text-white text-xl">Fats</Text>
        <Text className="font-semibold text-base text-white">{levelToText[itemData.fat_level] || 'N/A'}</Text>
      </View>
      <View style={{backgroundColor: levelToColor[itemData.saturated_fat_level] || 'gray'}} className="flex-1 rounded-2xl shadow-neo p-2 justify-center items-center">
        <FontAwesome6 name='hashnode' size={30} color='white'/>
        <Text numberOfLines={1} className="font-bold text-white text-xl">Saturated Fats</Text>
        <Text className="font-semibold text-base text-white">{levelToText[itemData.saturated_fat_level] || 'N/A'}</Text>
      </View>
      </View>
      <View className="w-full flex-row space-x-4">
      <View style={{backgroundColor: levelToColor[itemData.sugar_level] || 'gray'}} className="flex-1 rounded-2xl shadow-neo p-2 justify-center items-center">
        <FontAwesome6 name='cube' size={30} color='white'/>
        <Text numberOfLines={1} className="font-bold text-white text-xl">Sugar</Text>
        <Text className="font-semibold text-base text-white">{levelToText[itemData.sugar_level] || 'N/A'}</Text>
      </View>
      <View style={{backgroundColor: levelToColor[itemData.salt_level] || 'gray'}} className="flex-1 rounded-2xl shadow-neo p-2 justify-center items-center">
        <FontAwesome6 name='cubes-stacked' size={30} color='white'/>
        <Text numberOfLines={1} className="font-bold text-white text-xl">Salt</Text>
        <Text className="font-semibold text-base text-white">{levelToText[itemData.salt_level] || 'N/A'}</Text>
      </View>
      </View>
      { itemData.co2 &&
        <View className="bg-white rounded-2xl shadow-neo p-4 w-full space-x-4 items-center flex-row">
          <FontAwesome6 name='car' size={40}/>
          <View className="flex-1">
          <Text className="font-medium text-base">Equivalent to driving {(itemData.co2 / 1.7).toFixed(1)} miles in a car.</Text>
          <Text>({(itemData.co2 * 100).toFixed()}g of CO2 emissions to produce.)</Text>
          </View>
        </View>
      }
      </ScrollView>
       {alternativesData ?
       <TouchableOpacity className="flex-row justify-between items-center p-4 bg-white border-black border-[5px] rounded-xl shadow-neo active:shadow-none active:mt-1 active:ml-1" onPress={() => navigation.navigate("Alternatives", { alternativesData })}>
       <Text className="text-3xl font-bold">Alternatives</Text>
       <Image className="rounded-full object-fill" />
       <Image className="rounded-full object-fill" />
     </TouchableOpacity >
               : <></>

      }
      
      <View className="absolute bottom-7 right-7">
      <AddButton
        onPress={() => {
          addFridgeItems(itemData);
          navigation.navigate('Fridge');
        }}
      />
      </View>
    </SafeAreaView>
  );
};

export default ItemScreen;
