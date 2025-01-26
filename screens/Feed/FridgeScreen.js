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
import { TrashButton } from "../../components/TrashButton";
import { AddButton } from "../../components/AddButton";
import ItemTile from "../../components/ItemTile";

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

  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");

  const allItemsUnchecked = fridgeItems.every((item) => !item.isChecked);

  return (
    <SafeAreaView className="bg-neo-bg">
      <View className="px-4 flex flex-col h-full">
        <View className="flex-row justify-between py-4 gap-7 items-end">
          {isSearching ? (
            <TouchableOpacity
              className="flex-row flex-grow items-center justify-center p-3 px-3 bg-neo-light-blue border-black border-[5px] rounded-xl shadow-neo mt-auto"
              onPress={() => {
                setIsSearching(!isSearching);
                setSearchText("");
              }}
            >
              <FontAwesome6 name="magnifying-glass" color="black" size={25} />
              <TextInput
                className="flex-grow p-3 font-bold text-xl"
                autoFocus={true}
                placeholder="Search..."
                onChangeText={(text) => {
                  setSearchText(text);
                }}
              />
              <FontAwesome6 name="x" color="black" size={25} />
            </TouchableOpacity>
          ) : (
            <>
              <View className="flex-row justify-between items-center p-4 bg-neo-purple border-black border-[5px] shadow-neo">
                <Text className="text-3xl font-bold">My Fridge</Text>
              </View>
              <TouchableOpacity
                className="flex-row flex-grow items-center justify-center p-3 bg-neo-light-blue border-black border-[5px] rounded-xl shadow-neo mt-auto"
                onPress={() => {
                  setIsSearching(!isSearching);
                }}
              >
                <FontAwesome6 name="magnifying-glass" color="black" size={25} />
                <Text className="text-xl font-bold ml-2">Search</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <View className="flex-1 flex-col justify-between">
          <FlatList
            data={fridgeItems}
            numColumns={2}
            keyExtractor={(item) => item.id}
            className="overflow-visible -z-10"
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) =>
              (searchText === "" ||
                item.name.toLowerCase().includes(searchText.toLowerCase())) && (
                <ItemTile
                  id={item.id}
                  imageUrl={item.image_url}
                  name={item.name}
                  expirationDate={item.expirationDate}
                  isChecked={item.isChecked}
                  navigation={navigation}
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
              )
            }
          />
        </View>
        <View className="flex flex-row items-center justify-between px-4 gap-6">
          <View className="flex-grow">
            {!allItemsUnchecked && (
              <TouchableOpacity
                className="flex-row justify-center items-center px-6 py-4 bg-neo-light-blue border-black border-[5px] rounded-xl shadow-neo mt-auto"
                onPress={console.log("recipes")}
              >
                <Text className="text-xl font-bold">Find Recipes</Text>
              </TouchableOpacity>
            )}
          </View>
          <View>
            {allItemsUnchecked ? (
              <AddButton onPress={() => navigation.navigate("ScanBarcode")} />
            ) : (
              <TrashButton onPress={handleRemoveSelected} />
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default FridgeScreen;
