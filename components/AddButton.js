import { FontAwesome6 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export const AddButton = ({ onPress, iconSize = 40, radius = 24 }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log("pressed!!");
        onPress();
      }}
      activeOpacity={0.8}
      className={`rounded-full bg-neo-green shadow-neo border-black border-[5px] w-${radius} h-${radius} justify-center items-center`}
    >
      <FontAwesome6 name="add" color="black" size={iconSize} />
    </TouchableOpacity>
  );
};
