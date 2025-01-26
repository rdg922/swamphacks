import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styled } from "nativewind";

const ItemTile = ({
  item,
  id,
  imageUrl,
  name,
  expirationDate,
  isChecked,
  onClick,
  onCheckClick,
  navigation,
}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Item", { barcode: id, owned: true, item })}
      className="rounded-xl shadow-neo border-black border-[5px] relative bg-neo-light-green w-[48%] mr-1 mb-1"
    >
      <View className=" rounded-b-xl rounded-t-lg p-4 bg-white">
        <Image source={{ uri: imageUrl }} className="w-full h-40 rounded-lg " />
        <TouchableOpacity
          className={`absolute top-2 right-2 w-8 h-8 rounded-lg border-[3px] ${
            isChecked
              ? "bg-neo-green shadow-neo-small"
              : "bg-[#CCCCCC] border-[#999999]"
          }`}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          onPress={onCheckClick}
        />
      </View>
      <View className=" p-2 px-4 bg-neo-light-green rounded-xl">
        <Text className="text-xl font-bold">{name}</Text>
        <Text className="text-sm text-gray-600 font-medium">
          Expires: {expirationDate}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default styled(ItemTile);
