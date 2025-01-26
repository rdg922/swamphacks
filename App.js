import * as React from "react";
import { useContext, useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Image,
  Platform,
  Alert,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Audio } from "expo-av";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { FontAwesome } from "@expo/vector-icons";
import BottomSheet, { TouchableOpacity } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FeedStackScreen from "./screens/FeedStack";
import * as Notifications from "expo-notifications";
import { registerForPushNotifications } from "./logic/notifications";
import { FridgeDataProvider } from "./contexts/FridgeContext";

// Sentry.init({
//   dsn: '',

//   // uncomment the line below to enable Spotlight (https://spotlightjs.com)
//   // enableSpotlight: __DEV__,
// });

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MemoizedBottomSheets = React.memo(() => {
  return (
    <>
      {/* <BottomSheet index={-1} ref={} snapPoints={} onChange={} enablePanDownToClose backgroundStyle={{ backgroundColor: '#3F0070', borderRadius: 50 }} handleIndicatorStyle={{ backgroundColor: 'white' }}>
      </BottomSheet> */}
    </>
  );
});

const AppContent = () => {
  // const appVersion = Constants.expoConfig?.version || Constants.manifest?.version;

  const notificationListener = useRef();
  const responseListener = useRef();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const notificationSetup = async () => {
      const notifToken = await registerForPushNotifications();
      
      await fetch(`https://ecoscan.fly.dev/notif-token/${notifToken}`);
    };

    notificationSetup();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const item = response.notification.request.content.data;
        console.log(item);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  let [fontsLoaded] = useFonts({
    "neue-heavy-extended": require("./assets/fonts/neue-heavy-extended.otf"),
    "neue-bold-extended": require("./assets/fonts/neue-bold-extended.otf"),
    "neue-bold": require("./assets/fonts/neue-bold.otf"),
    "neue-medium": require("./assets/fonts/neue-medium.otf"),
    "neue-medium-italic": require("./assets/fonts/neue-medium-italic.otf"),
    "neue-roman": require("./assets/fonts/neue-roman.otf"),
    "helvetica-bold": require("./assets/fonts/helvetica-bold.ttf"),
  });

  if (Platform.OS === "ios")
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
    });

  if (fontsLoaded && !loading) {
    SplashScreen.hideAsync();
  }

  const TabNavigator = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          // if (route.name === 'GeneStack') {
          //   return <Image source={require('./assets/geneIcons/genes.png')} style={{width: size, height: size, tintColor: color}}/>;
          // } else if (route.name === 'FeedStack') {
          //   return <Image source={require('./assets/icons/playbl.png')} style={{width: size, height: size, tintColor: color}}/>;
          // } else if (route.name === 'ProfileStack') {
          //   return <FontAwesome name={'user'} size={size} color={color} />;
          // } else if (route.name === 'OrderStack') {
          //   return <Image source={require('./assets/icons/bag.png')} style={{width: size, height: size, tintColor: color}}/>;
          // }

          return <></>;
        },
        tabBarLabel: ({ focused, color }) => {
          // const map = {'GeneStack': 'Genes', 'ProfileStack': 'Profile', 'FeedStack': 'Feed', 'OrderStack': 'Shop'}
          // let label = map[route.name];

          // return <Text style={{ color, fontSize: focused ? 14 : 12 }}>{label}</Text>;
          return <Text style={{ color, fontSize: 12 }}>{route.name}</Text>;
        },
        tabBarActiveTintColor: "#40AD00",
        tabBarInactiveColor: "#283D28",
      })}
    >
      <Tab.Screen name="FeedStack" component={FeedStackScreen} />
    </Tab.Navigator>
  );

  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="FeedStack"
            component={FeedStackScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <MemoizedBottomSheets />
    </GestureHandlerRootView>
  );
};

const App = () => {
  return (
    <FridgeDataProvider>
      <AppContent />
    </FridgeDataProvider>
    // <AuthProvider>
    // <BottomSheetProvider>
    //   <GeneDataProvider>
    //   <ShoppingCartProvider>

    //     </ShoppingCartProvider>
    //   </GeneDataProvider>
    //   </BottomSheetProvider>
    // </AuthProvider>
  );
};

// export default Sentry.wrap(App);
export default App;
