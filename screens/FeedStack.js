import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import FridgeScreen from "./Feed/FridgeScreen";
import ItemScreen from "./Feed/ItemScreen";
import ScanBarcodeScreen from "./Feed/ScanBarcodeScreen";

const FeedStack = createStackNavigator();

export default function FeedStackScreen() {
  return (
    <>
      <FeedStack.Navigator>
        <FeedStack.Screen
          name="Feed"
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
      </FeedStack.Navigator>
    </>
  );
}
