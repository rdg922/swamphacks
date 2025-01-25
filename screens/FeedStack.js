import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import FridgeScreen from "./Feed/FridgeScreen";
import { SafeAreaView } from "react-native-safe-area-context";

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
      </FeedStack.Navigator>
    </>
  );
}
