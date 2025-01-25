import { FontAwesome6 } from "@expo/vector-icons"
import { TouchableOpacity } from "react-native"

export const AddButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-full bg-neo-green shadow-neo active:shadow-none active:mt-1 active:ml-1 w-24 h-24 justify-center items-center"
    >
      <FontAwesome6 name="add" color="black" size={40} />
    </TouchableOpacity>
  )
}
