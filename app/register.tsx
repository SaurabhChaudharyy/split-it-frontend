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
import React, { useEffect, useState } from "react"; // Add useState
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { View, Text, Pressable } from "react-native";
import { Box } from "@/components/ui/box";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { ArrowLeftIcon } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");

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

  const handleRegister = async () => {
    setError(""); // Clear previous errors
    if (!username || !password || !confirmPassword || !fullName) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await fetch("http://13.201.80.26/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, fullName }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful:", data);
        alert(data.message);
        router.push("/login");
      } else {
        setError(data.error || "Registration failed. Please try again.");
        console.error("Registration failed:", data.error);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Network error during registration:", err);
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
            Enter your details below
          </Text>
          <Box className="w-full">
            <FormControl isInvalid={!!error}>
              <FormControlLabel>
                <FormControlLabelText
                  className="w-full"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Full Name
                </FormControlLabelText>
              </FormControlLabel>
              <Input className="my-1 w-full">
                <InputField
                  type="text"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </Input>
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
              <FormControlLabel>
                <FormControlLabelText style={{ fontFamily: "Montserrat" }}>
                  Confirm Password
                </FormControlLabelText>
              </FormControlLabel>
              <Input className="my-1 w-full">
                <InputField
                  type="password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
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
            onPress={handleRegister}
          >
            <ButtonText style={{ fontFamily: "Montserrat" }}>
              REGISTER
            </ButtonText>
          </Button>
          <Text
            className="w-full mt-4 text-center"
            style={{ fontFamily: "Montserrat" }}
          >
            Already a user ?
          </Text>
          <Button
            className="w-full self-center mt-4 py-3 px-8 rounded-xl"
            size="lg"
            style={{ backgroundColor: "#123458" }}
            onPress={() => {
              console.log("Login is pressed");
              router.push("/login");
            }}
          >
            <ButtonText style={{ fontFamily: "Montserrat" }}>LOGIN</ButtonText>
          </Button>
        </VStack>
      </View>
    </GluestackUIProvider>
  );
}
