import { useEffect, useState } from "react";
import { getRecipe } from "../../logic/getRecipe";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SmallBackButton } from "../../components/SmallBackButton";
import { FontAwesome6 } from "@expo/vector-icons";

const RecipeScreen = ({ navigation, route }) => {
  const { items } = route.params;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(null);
  const [ingredients, setIngredients] = useState(null);
  const [instructions, setInstructions] = useState(null);

  const loadRecipe = async () => {
    setLoading(true);
    const r = await getRecipe(
      items.map((i) => i.name),
      title
    );
    // const r = `Nacho Cheese Dip||
    // Ingredients:
    // - 1 cup nachos cheese
    // - 1 cup traditional salsa
    // - 1 teaspoon jalapeño slices (optional)
    // - 1 tablespoon chopped fresh cilantro (for garnish)
    // - Tortilla chips (for serving)
    // ||
    // Instructions:
    // 1. In a medium saucepan, heat the nachos cheese over low heat until melted, stirring occasionally.
    // 2. Once the cheese is melted, add the traditional salsa to the saucepan and mix well.
    // 3. If desired, stir in the jalapeño slices for added spice.
    // 4. Keep the cheese dip on low heat, stirring occasionally until heated through.
    // 5. Transfer the nacho cheese dip to a serving bowl and garnish with chopped cilantro.
    // 6. Serve immediately with tortilla chips for dipping.`;
    console.log(r);
    const [title, ingredients, instructions] = r.split("||");
    setTitle(title.trim());
    setIngredients(ingredients.trim());
    setInstructions(instructions.trim());
    setLoading(false);
  };

  useEffect(() => {
    loadRecipe();
  }, []);

  return (
    <SafeAreaView className="w-full h-full bg-neo-bg">
      <View className="absolute top-20 left-8 z-10">
        <SmallBackButton onPress={navigation.goBack} />
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="font-bold text-lg">Generating Recipe...</Text>
          <ActivityIndicator className="mt-8" size="large" />
        </View>
      ) : (
        <ScrollView
          className="w-full px-4 pt-10 mt-[55] overflow-visible"
          contentContainerStyle={{ alignItems: "center" }}
        >
          <View className="w-full gap-y-4">
            <View className="bg-neo-purple p-4 rounded-xl w-full shadow-neo border-black border-[5px] justify-center items-center">
              <Text className="font-bold text-2xl">{title}</Text>
            </View>
            <View className="bg-white p-4 rounded-xl w-full shadow-neo border-black border-[5px]">
              <Text className=" font-semibold text-xl">{ingredients}</Text>
            </View>
            <View className="bg-white p-4 rounded-xl w-full shadow-neo border-black border-[5px]">
              <Text className=" font-semibold text-lg">{instructions}</Text>
            </View>
            <TouchableOpacity onPress={loadRecipe}>
              <View className="bg-neo-light-blue p-4 rounded-xl w-full shadow-neo border-black border-[5px] justify-center items-center flex-row">
                <FontAwesome6 name="arrows-rotate" color="black" size={25} />
                <Text className="font-semibold text-2xl mx-4">Regenerate</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default RecipeScreen;
