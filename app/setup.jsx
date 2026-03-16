import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, Vibration, View } from "react-native";
import { encrypt } from "../constants/crypto";
import globalStyles from "../theme/styles";

export default function SetupScreen() {
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [step, setStep] = useState(1); // 1=enter, 2=confirm
  const router = useRouter();
  const MAX = 4;

  async function handlePinPress(digit) {
    if (step === 1) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === MAX) setStep(2);
    } else {
      const newConfirm = confirm + digit;
      setConfirm(newConfirm);
      if (newConfirm.length === MAX) {
        if (newConfirm === pin) {
          await AsyncStorage.setItem("master_pin", encrypt(pin));
          router.replace("/vault");
        } else {
          Vibration.vibrate(400);
          Alert.alert("PINs do not match", "Please try again");
          setPin("");
          setConfirm("");
          setStep(1);
        }
      }
    }
  }

  const current = step === 1 ? pin : confirm;
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

  return (
    <View style={globalStyles.centeredContainer}>
      <Text style={globalStyles.titleLarge}>Vault</Text>
      <Text style={globalStyles.subtitle}>
        {step === 1 ? "Create a 4-digit PIN" : "Confirm your PIN"}
      </Text>
      <View style={globalStyles.pinDots}>
        {Array(MAX)
          .fill(0)
          .map((_, i) => (
            <View
              key={i}
              style={[
                globalStyles.pinDot,
                i < current.length && globalStyles.pinDotFilled,
              ]}
            />
          ))}
      </View>
      <View style={globalStyles.pinKeypad}>
        {keys.map((k, i) => (
          <TouchableOpacity
            key={i}
            style={[globalStyles.pinKey, k === "" && globalStyles.pinKeyEmpty]}
            onPress={() => {
              if (k === "⌫") {
                if (step === 1) setPin((p) => p.slice(0, -1));
                else setConfirm((c) => c.slice(0, -1));
              } else if (k !== "") handlePinPress(k);
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
