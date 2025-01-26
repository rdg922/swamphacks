import { useEffect, useContext, useState, useRef } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Platform,
  Alert,
  TouchableOpacity,
  ScrollView,
  Modal,
  InteractionManager,
} from "react-native";
import { getBarcodeData } from "../../logic/barcodeFetch";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome6 } from "@expo/vector-icons";
import { AddButton } from "../../components/AddButton";
import { FridgeContext } from "../../contexts/FridgeContext";
import { Image, ImageBackground } from "expo-image";
import { getAlternativeData } from "../../components/ProductAlternatives";
import { SmallBackButton } from "../../components/SmallBackButton";
import DateScroller from "../../components/DateScroller";

const ItemScreen = ({ navigation, route }) => {
  const { barcode, item, owned } = route.params;
  const { addFridgeItems } = useContext(FridgeContext);

  const [itemData, setItemData] = useState(null);
  const [alternativesData, setAlternativesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(1);
  const [currentDate, setCurrentDate] = useState(1);
  const [currentYear, setCurrentYear] = useState(2000);

  const nutriscoreImgs = {
    a: require("../../assets/productScores/nutriscore-a.png"),
    b: require("../../assets/productScores/nutriscore-b.png"),
    c: require("../../assets/productScores/nutriscore-c.png"),
    d: require("../../assets/productScores/nutriscore-d.png"),
    e: require("../../assets/productScores/nutriscore-e.png"),
  };

  const ecoscoreImgs = {
    a: require("../../assets/productScores/green-score-a.png"),
    b: require("../../assets/productScores/green-score-b.png"),
    c: require("../../assets/productScores/green-score-c.png"),
    d: require("../../assets/productScores/green-score-d.png"),
    e: require("../../assets/productScores/green-score-e.png"),
  };

  const levelToColor = {
    high: "red",
    moderate: "orange",
    low: "green",
  };

  const scoreToColor = ["green", "green", "orange", "red", "red"];

  const levelToText = {
    high: "High",
    moderate: "Moderate",
    low: "Low",
  };

  const fetchItem = async () => {
    setLoading(true);
    if (owned && item) {
      setItemData(item);
      setLoading(false);
    } else {
      const data = await getBarcodeData(barcode);
      setItemData(data);
      console.log(data);

      setLoading(false);
      if (data?.name) {
        try {
          const altData = await getAlternativeData(data.name);
          setAlternativesData(altData);
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  useEffect(() => {
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
      <View className="absolute top-[70] left-7 z-10">
        <SmallBackButton onPress={navigation.goBack} />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="w-full h-full overflow-visible px-5 space-y-4 mt-10"
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View className="border border-black bg-white w-full rounded-2xl shadow-neo space-x-4 items-center justify-center p-5 flex-row">
          <Image
            source={{ uri: itemData.image_url }}
            className="w-24 h-24 rounded-xl"
            contentFit="contain"
          />
          <Text className="font-bold text-xl text-center flex-shrink">
            {itemData.name}
          </Text>
        </View>

        <View className="flex-row space-x-4">
          <View className="border border-black bg-white rounded-2xl shadow-neo w-40">
            <View className="w-full overflow-hidden items-center justify-center">
              {itemData.nutriscore_grade &&
              itemData.nutriscore_grade !== "not-applicable" &&
              itemData.ecoscore_grade !== "unknown" ? (
                <Image
                  placeholder={{ blurhash: "LtP~yGBjNhrYyErst3X7%%v$s*X7" }}
                  source={nutriscoreImgs[itemData.nutriscore_grade]}
                  className="w-36 aspect-[1.85]"
                />
              ) : (
                <View className="p-3 bg-gray-500 rounded-xl w-[100%]">
                  <Text className="text-white">Missing Nutri-Score</Text>
                </View>
              )}
            </View>
          </View>
          <View className="border border-black bg-white rounded-2xl shadow-neo w-40">
            <View className="w-full overflow-hidden items-center justify-center">
              {itemData.ecoscore_grade &&
              itemData.ecoscore_grade !== "not-applicable" &&
              itemData.ecoscore_grade !== "unknown" ? (
                <Image
                  placeholder={{ blurhash: "LTRovk=o-VJEn~j[o#f-.ASkNZr=" }}
                  source={ecoscoreImgs[itemData.ecoscore_grade]}
                  className="w-36 aspect-[1.85]"
                />
              ) : (
                <View className="p-3 bg-gray-500 rounded-xl  w-[100%]">
                  <Text className="text-white">Missing Green Score</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        {itemData.nova_grade && (
          <View className="border border-black bg-white rounded-2xl shadow-neo p-2 w-full space-y-2">
            <View className="flex-row items-center space-x-2">
              <View
                style={{ backgroundColor: scoreToColor[itemData.nova_grade] }}
                className="p-2 rounded-lg"
              >
                <Text className="font-bold text-white text-xl">
                  {itemData.nova_grade}
                </Text>
              </View>
              <Text className="font-bold text-lg">Ultra-Processing Level</Text>
            </View>
            {itemData.nova_ingredients && (
              <Text className="text-base">
                Contributing Ingredients: {itemData.nova_ingredients.join(", ")}
              </Text>
            )}
            {itemData.nova_additives && (
              <Text className="text-base">
                Contributing Additives: {itemData.nova_additives.join(", ")}
              </Text>
            )}
          </View>
        )}
        <View className="w-full flex-row space-x-4">
          <View
            style={{
              backgroundColor: levelToColor[itemData.fat_level] || "gray",
            }}
            className="border-2 border-black flex-1 rounded-2xl shadow-neo p-2 justify-center items-center"
          >
            <FontAwesome6 name="droplet" size={30} color="white" />
            <Text numberOfLines={1} className="font-bold text-white text-xl">
              Fats
            </Text>
            <Text className="font-semibold text-base text-white">
              {levelToText[itemData.fat_level] || "N/A"}
            </Text>
          </View>
          <View
            style={{
              backgroundColor:
                levelToColor[itemData.saturated_fat_level] || "gray",
            }}
            className="border-2 border-black flex-1 rounded-2xl shadow-neo p-2 justify-center items-center"
          >
            <FontAwesome6 name="hashnode" size={30} color="white" />
            <Text numberOfLines={1} className="font-bold text-white text-xl">
              Saturated Fats
            </Text>
            <Text className="font-semibold text-base text-white">
              {levelToText[itemData.saturated_fat_level] || "N/A"}
            </Text>
          </View>
        </View>
        <View className="w-full flex-row space-x-4">
          <View
            style={{
              backgroundColor: levelToColor[itemData.sugar_level] || "gray",
            }}
            className="border-2 border-black flex-1 rounded-2xl shadow-neo p-2 justify-center items-center"
          >
            <FontAwesome6 name="cube" size={30} color="white" />
            <Text numberOfLines={1} className="font-bold text-white text-xl">
              Sugar
            </Text>
            <Text className="font-semibold text-base text-white">
              {levelToText[itemData.sugar_level] || "N/A"}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: levelToColor[itemData.salt_level] || "gray",
            }}
            className="border-2 border-black flex-1 rounded-2xl shadow-neo p-2 justify-center items-center"
          >
            <FontAwesome6 name="cubes-stacked" size={30} color="white" />
            <Text numberOfLines={1} className="font-bold text-white text-xl">
              Salt
            </Text>
            <Text className="font-semibold text-base text-white">
              {levelToText[itemData.salt_level] || "N/A"}
            </Text>
          </View>
        </View>
        {itemData.co2 && (
          <View className="border border-black bg-white rounded-2xl shadow-neo p-4 w-full space-x-4 items-center flex-row">
            <FontAwesome6 name="car" size={40} />
            <View className="flex-1">
              <Text className="font-medium text-base">
                Equivalent to driving {(itemData.co2 / 1.7).toFixed(1)} miles in
                a car.
              </Text>
              <Text>
                ({(itemData.co2 * 100).toFixed()}g of CO2 emissions to produce.)
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
      {!owned && (
        <View className="flex-row w-full justify-between px-4 mt-4">
          <TouchableOpacity
            disabled={!alternativesData}
            className="flex-row justify-between items-center p-4 bg-white border-black border-[5px] rounded-xl shadow-neo active:shadow-none active:mt-1 active:ml-1"
            onPress={() =>
              navigation.navigate("Alternatives", {
                alternativesData,
                alternativeOf: itemData,
              })
            }
          >
            <Text className="text-xl font-bold mr-2">Alternatives</Text>
            {alternativesData && alternativesData.products ? (
              <>
                {alternativesData.products.length > 0 && (
                  <Image
                    source={{ uri: alternativesData.products[0].image_url }}
                    className="w-10 h-10 rounded-full object-fill"
                  />
                )}
                {alternativesData.products.length > 1 && (
                  <Image
                    source={{ uri: alternativesData.products[1].image_url }}
                    className="w-10 h-10 -ml-4 rounded-full object-fill"
                  />
                )}
              </>
            ) : (
              <ActivityIndicator />
            )}
          </TouchableOpacity>

          <View>
            <AddButton
              onPress={() => {
                setModalVisible(true);
              }}
            />
          </View>
        </View>
      )}
      <Modal
        animationType="none"
        visible={modalVisible}
        transparent
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View className="w-full h-full">
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="absolute w-full h-full bg-black opacity-40"
          />
          <View className="w-full h-full items-center justify-center p-4">
            <View className="w-full h-72 bg-red-200 rounded-2xl border-4 border-black shadow-neo p-5">
              <Text className="font-extrabold text-lg flex-1 pb-10 w-full">
                Expiry Date
              </Text>
              <DateScroller
                setCurrentDate={setCurrentDate}
                setCurrentMonth={setCurrentMonth}
                setCurrentYear={setCurrentYear}
              />

              <View className="flex flex-row items-center justify-between py-2 pb-5 px-5">
                <TouchableOpacity
                  onPress={() => {
                    const addedData = itemData;
                    addFridgeItems(addedData);
                    setModalVisible(false);
                    navigation.goBack();
                  }}
                  className="flex grow items-center p-4 bg-white border-black border-[5px] rounded-xl shadow-neo active:shadow-none active:mt-1 active:ml-1 mr-4"
                >
                  <Text className="text-xl font-bold">Skip </Text>
                </TouchableOpacity>
                <AddButton
                  onPress={() => {
                    const addedData = itemData;
                    addedData["expiryDate"] = new Date(
                      currentYear,
                      currentMonth - 1,
                      currentDate
                    );
                    addFridgeItems(addedData);
                    setModalVisible(false);
                    navigation.goBack();
                  }}
                  size={20}
                  radius={20}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ItemScreen;
