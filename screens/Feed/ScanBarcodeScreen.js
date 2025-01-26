import { useRef, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  Image,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import { getBarcodeData } from "../../logic/barcodeFetch";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Icon } from "@rneui/base";
import { FontAwesome6 } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "../../components/BackButton";
import { CameraRotateButton } from "../../components/CameraRotateButton";

const ScanBarcodeScreen = ({ navigation }) => {
  const [facing, setFacing] = useState("back");
  const [permission, _requestPermission] = useCameraPermissions();
  const isHandlingBarcode = useRef(false);

  const requestPermission = async () => {
    const res = await _requestPermission();
    if (!res.granted) {
      Alert.alert(
        "Go to Settings",
        "We could not ask for camera permission! Please try granting permission in your settings app."
      );
    }
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleScannedBarcode = async (scannedBarcode) => {
    navigation.navigate("Item", { barcode: scannedBarcode.data });
  };

  if (!permission) {
    return (
      <View className="bg-black flex-1 items-center justify-center p-2">
        <ActivityIndicator color="white" size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="bg-black flex-1 items-center justify-center p-2">
        <Text className="text-center text-lg font-bold text-white">
          We need your permission to show the camera.
        </Text>
        <TouchableOpacity
          className="bg-green-900 p-4 mt-3 rounded-2xl"
          onPress={requestPermission}
        >
          <Text className="text-center text-base text-white">
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center bg-black">
      <CameraView
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "upc_a", "upc_e"],
        }}
        onBarcodeScanned={handleScannedBarcode}
        className="flex-1"
        facing={facing}
      >
        <SafeAreaView className="flex-1 flex-row bg-transparent">
          <View className="absolute top-20 left-8">
            <BackButton onPress={navigation.goBack} />
          </View>
          <View className="absolute left-0 right-0 items-center bottom-16">
            <CameraRotateButton onPress={toggleCameraFacing} />
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
};

export default ScanBarcodeScreen;
