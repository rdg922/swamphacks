import { useEffect, useState } from "react";
import { getRecipe } from "../../logic/getRecipe";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../../components/BackButton";

const RecipeScreen = ({ navigation, route }) => {
    const { items } = route.params;

    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState(null);

    const loadRecipe = async () => {
        setLoading(true);
        const r = await getRecipe(items.map(i => i.name));
        setRecipe(r);
        setLoading(false);
    }

    useEffect(() => {
        loadRecipe();
    }, []);
  
    const renderLine = (line, index) => {
      if (line.startsWith('### ')) {
        return (
          <Text key={index} className='font-bold text-xl w-full text-center'>
            {line.replace('### ', '')}
          </Text>
        );
      } else if (line.startsWith('#### ')) {
        return (
          <Text key={index} className='font-bold text-lg w-full'>
            {line.replace('#### ', '')}
          </Text>
        );
      } else {
        return (
          <Text key={index}>
            {line}
          </Text>
        );
      }
    };
  
    return (
      <SafeAreaView className="w-full h-full">
        <View className="absolute top-20 left-8 z-10">
            <BackButton onPress={navigation.goBack} />
        </View>
        <ScrollView className="w-full px-4 pt-10" contentContainerStyle={{alignItems: 'center'}}>
        {loading ? <ActivityIndicator className="mt-10" size='large'/> : recipe.split('\n').map((line, index) => renderLine(line, index))}
      </ScrollView>
      </SafeAreaView>
    );
  };


  export default RecipeScreen;