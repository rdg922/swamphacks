import { FontAwesome6 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export const BackButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      className="bg-neo-red p-4 rounded-full w-20 h-20 flex justify-center items-center border-[5px] border-black shadow-neo"
      onPress={onPress}
    >
      <FontAwesome6 name="x" color="white" size={25} />
    </TouchableOpacity>
  );
};
