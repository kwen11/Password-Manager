import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, Vibration, View } from "react-native";
import globalStyles from "../theme/styles";

export default function LoginScreen() {
  const [pin, setPin] = useState("");
  const router = useRouter();
  const MAX = 4;

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  async function checkFirstLaunch() {
    const storedPin = await SecureStore.getItemAsync("master_pin");
    if (!storedPin) router.replace("/setup");
  }

  async function handlePinPress(digit) {
    const newPin = pin + digit;
    setPin(newPin);
    if (newPin.length === MAX) {
      const stored = await SecureStore.getItemAsync("master_pin");
      if (newPin === stored) {
        router.replace("/vault");
      } else {
        Vibration.vibrate(400);
        Alert.alert("Wrong PIN", "Try again");
        setPin("");
      }
    }
  }

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

  return (
    <View style={globalStyles.centeredContainer}>
      <Text style={globalStyles.titleLarge}>Vault</Text>
      <Text style={globalStyles.subtitle}>Enter your PIN</Text>

      {/* PIN dots */}
      <View style={globalStyles.pinDots}>
        {Array(MAX)
          .fill(0)
          .map((_, i) => (
            <View
              key={i}
              style={[
                globalStyles.pinDot,
                i < pin.length && globalStyles.pinDotFilled,
              ]}
            />
          ))}
      </View>

      {/* Keypad */}
      <View style={globalStyles.pinKeypad}>
        {keys.map((k, i) => (
          <TouchableOpacity
            key={i}
            style={[globalStyles.pinKey, k === "" && globalStyles.pinKeyEmpty]}
            onPress={() => {
              if (k === "⌫") setPin((p) => p.slice(0, -1));
              else if (k !== "") handlePinPress(k);
            }}
            disabled={k === ""}
          >
            <Text style={globalStyles.pinKeyText}>{k}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
