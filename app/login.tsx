import React, { useEffect, useState } from "react"; // Add useState
import AsyncStorage from "@react-native-async-storage/async-storage"; // Add AsyncStorage
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { AlertCircleIcon } from "@/components/ui/icon";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { View, Text } from "react-native";
import { Box } from "@/components/ui/box";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { ArrowLeftIcon } from "lucide-react-native";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For displaying login errors

  const [fontsLoaded] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat_400Regular.ttf"),
    MontserratB: require("../assets/fonts/Montserrat_700Bold.ttf"),
  });

  useEffect(() => {
    const hideSplash = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    };
    hideSplash();
  }, [fontsLoaded]);

  const handleLogin = async () => {
    setError(""); // Clear previous errors
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch("http://13.201.80.26/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem("token", data.access_token);
        console.log("Login successful:", data);
        router.replace("/(tabs)");
      } else {
        setError(data.error || "Login failed. Please try again.");
        console.error("Login failed:", data.error);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Network error during login:", err);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode="light">
      <View className="flex-1 w-full items-center">
        <View
          className="w-full px-6 pt-12 absolute top-0 left-0"
          style={{ height: 60, zIndex: 999 }}
        >
          <Pressable
            onPress={() => {
              console.log("Arrow clicked");
              router.back();
            }}
          >
            <ArrowLeftIcon size={28} color="#123458" />
          </Pressable>
        </View>
        <VStack className="flex-1 px-8 py-8 items-center justify-center w-full">
          <Text
            className="text-3xl font-bold text-center self-center pt-1 w-full"
            style={{ fontFamily: "MontserratB" }}
          >
            Welcome,
          </Text>
          <Text
            className="text-xl text-center self-center pb-14"
            style={{ fontFamily: "Montserrat" }}
          >
            Glad to see you back!
          </Text>
          <Box className="w-full">
            <FormControl isInvalid={!!error}>
              <FormControlLabel>
                <FormControlLabelText
                  className="w-full"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Username
                </FormControlLabelText>
              </FormControlLabel>
              <Input className="my-1 w-full">
                <InputField
                  type="text"
                  value={username}
                  onChangeText={setUsername}
                />
              </Input>
              <FormControlLabel>
                <FormControlLabelText style={{ fontFamily: "Montserrat" }}>
                  Password
                </FormControlLabelText>
              </FormControlLabel>
              <Input className="my-1 w-full">
                <InputField
                  type="password"
                  value={password}
                  onChangeText={setPassword}
                />
              </Input>
              {error && (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>{error}</FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>
          </Box>
          <Button
            className="w-full self-center mt-4 py-3 px-8 rounded-xl"
            size="lg"
            style={{ backgroundColor: "#123458" }}
            onPress={handleLogin}
          >
            <ButtonText style={{ fontFamily: "Montserrat" }}>LOGIN</ButtonText>
          </Button>
          <Text
            className="w-full mt-4 text-center"
            style={{ fontFamily: "Montserrat" }}
          >
            Not a user yet?
          </Text>
          <Button
            className="w-full self-center mt-4 py-3 px-8 rounded-xl"
            size="lg"
            style={{ backgroundColor: "#123458" }}
            onPress={() => {
              console.log("Register is pressed");
              router.push("/register");
            }}
          >
            <ButtonText style={{ fontFamily: "Montserrat" }}>
              REGISTER
            </ButtonText>
          </Button>
        </VStack>
      </View>
    </GluestackUIProvider>
  );
}
