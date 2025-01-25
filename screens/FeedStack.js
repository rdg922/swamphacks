import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FeedScreen from './Feed/FeedScreen';

const FeedStack = createStackNavigator();

export default function FeedStackScreen() {
  return (
    <>
    <FeedStack.Navigator>
      <FeedStack.Screen
        name="Feed"
        component={FeedScreen}
        options={{ headerShown: false }}
      />
    </FeedStack.Navigator>
    </>
  );
}