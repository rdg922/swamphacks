import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styled } from "nativewind";


const ItemTile = ({ item, onClick, onCheckClick, navigation }) => {
  let formattedDate = "N/A";
  let expiryColor = "#FFEF8A";
  if (item.expiryDate) {
    const date = new Date(item.expiryDate);
    const today = new Date();
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);

    // Check if the date is within the next 7 days
    if (date >= today && date <= next7Days) {
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" }); // e.g., "Monday"
      formattedDate = dayOfWeek;
    } else {
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Add 1 because months are zero-based
      const day = date.getDate().toString().padStart(2, "0");
      const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year

      formattedDate = `${month}/${day}/${year}`;
      expiryColor = "#7DFF99"; // green
    }
    if (date <= today) {
      expiryColor = "#FF7878"; // red
    }



    console.log(expiryColor)
  }
  const placeholderImage =
    "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png";

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Item", { barcode: item.id, owned: true, item })
      }
      className={`rounded-xl shadow-neo border-black border-[5px] relative w-[48%] mr-1 mb-1`}
      style={{ backgroundColor: expiryColor }}
    >
      <View className=" rounded-b-xl rounded-t-lg p-4 bg-white">
        <Image
          source={{ uri: item.image_url || placeholderImage }}
          className="w-full h-40 rounded-lg"
        />
        <TouchableOpacity
          className={`absolute top-2 right-2 w-8 h-8 rounded-lg border-[3px] ${item.isChecked
            ? "bg-neo-green shadow-neo-small"
            : "bg-[#CCCCCC] border-[#999999]"
            }`}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={onCheckClick}
        />
      </View>
      <View className={`p-2 px-4 mb-2 rounded-xl`}>
        <Text className="text-xl font-bold" numberOfLines={2}>
          {item.name}
        </Text>
        <Text className="text-sm text-gray-600 font-medium">
          Expires: {formattedDate}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default styled(ItemTile);
