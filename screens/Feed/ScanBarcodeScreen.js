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
          <TouchableOpacity
            className="top-2 left-6"
            onPress={() => navigation.goBack()}
          >
            <FontAwesome6 name="x" color="white" size={20} />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 self-end items-center"
            onPress={toggleCameraFacing}
          >
            <FontAwesome6 name="camera-rotate" color="white" size={40} />
          </TouchableOpacity>
        </SafeAreaView>
      </CameraView>
    </View>
  );
};

export default ScanBarcodeScreen;
