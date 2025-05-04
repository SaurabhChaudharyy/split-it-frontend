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
import React, { useEffect } from "react";
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
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText
                  className="w-full"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Username
                </FormControlLabelText>
              </FormControlLabel>
              <Input className="my-1 w-full">
                <InputField type="text" />
              </Input>
              <FormControlLabel>
                <FormControlLabelText style={{ fontFamily: "Montserrat" }}>
                  Password
                </FormControlLabelText>
              </FormControlLabel>
              <Input className="my-1 w-full">
                <InputField type="password" />
              </Input>
              <FormControlError>
                <FormControlErrorIcon as={AlertCircleIcon} />
                <FormControlErrorText>
                  Atleast 6 characters are required.
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          </Box>
          <Button
            className="w-full self-center mt-4 py-3 px-8 rounded-xl"
            size="lg"
            style={{ backgroundColor: "#123458" }}
            onPress={() => console.log("Regsiter is pressed!")}
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
