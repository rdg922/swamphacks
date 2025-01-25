import {
  Text,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image"


const AlternativesButton = ({ image1, image2, onPress }) => {
  return (
    <TouchableOpacity className="flex-row justify-between items-center p-4 bg-white border-black border-[5px] rounded-xl shadow-neo active:shadow-none active:mt-1 active:ml-1" onPress={onPress}>
      <Text className="text-3xl font-bold">Alternatives</Text>
      <Image className="rounded-full object-fill" />
      <Image className="rounded-full object-fill" />
    </TouchableOpacity >
  )
}

export default AlternativesButton;
