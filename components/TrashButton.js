import { FontAwesome6 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export const TrashButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        console.log("pressed!!");
        onPress();
      }}
      activeOpacity={0.8}
      className="rounded-full bg-neo-red shadow-neo border-black border-[5px] w-24 h-24 justify-center items-center"
    >
      <FontAwesome6 name="trash" color="black" size={40} />
    </TouchableOpacity>
  );
};
