import { FontAwesome6 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export const CameraRotateButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      className="bg-neo-purple p-4 rounded-full w-25 h-25 flex justify-center items-center border-[5px] border-black shadow-neo"
      onPress={onPress}
    >
      <FontAwesome6 name="camera-rotate" color="white" size={40} />
    </TouchableOpacity>
  );
};
