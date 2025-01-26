import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import FridgeScreen from "./Feed/FridgeScreen";
import ItemScreen from "./Feed/ItemScreen";
import ScanBarcodeScreen from "./Feed/ScanBarcodeScreen";
import ProductAlternativesScreen from "./Feed/ProductAlternativesScreen";
import RecipeScreen from "./Feed/RecipeScreen";

const FeedStack = createStackNavigator();

export default function FeedStackScreen() {
  return (
    <>
      <FeedStack.Navigator>
        <FeedStack.Screen
          name="Fridge"
          component={FridgeScreen}
          options={{ headerShown: false }}
        />
        <FeedStack.Screen
          name="ScanBarcode"
          component={ScanBarcodeScreen}
          options={{ headerShown: false }}
        />
        <FeedStack.Screen
          name="Item"
          component={ItemScreen}
          options={{ headerShown: false }}
        />
        <FeedStack.Screen
          name="Alternatives"
          component={ProductAlternativesScreen}
          options={{ headerShown: false }}
        />
        <FeedStack.Screen
          name="Recipe"
          component={RecipeScreen}
          options={{ headerShown: false }}
        />
      </FeedStack.Navigator>
    </>
  );
}
