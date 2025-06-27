import React, { useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Button } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Center } from "@/components/ui/center";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function Welcome() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat_700Bold.ttf"),
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
    <GluestackUIProvider>
      <View className="flex-1 w-full">
        <Center className="pt-72">
          <Text
            className="text-6xl text-[#123458] font-bold"
            style={{ fontFamily: "Montserrat" }}
          >
            DIV/DE
          </Text>
        </Center>
        <Center className="flex-1 px-8 py-8 items-center justify-center">
          <VStack space="lg" className="w-full max-w-[320px] mt-5">
            <Button
              size="xl"
              className="bg-[#123458] py-3 px-8 rounded-xl"
              onPress={() => {
                console.log("Register is pressed");
                router.push("/register");
              }}
            >
              <Text className="text-white text-xl font-bold font-[Montserrat]">
                REGISTER
              </Text>
            </Button>

            <Button
              size="xl"
              variant="outline"
              className="bg-transparent border-2 border-white py-3 px-8 rounded-xl shadow-md"
              onPress={() => {
                console.log("Login is pressed");
                router.push("/login");
              }}
            >
              <Text className="text-[#123458] text-xl font-bold font-[Montserrat]">
                LOGIN
              </Text>
            </Button>
          </VStack>
        </Center>
      </View>
    </GluestackUIProvider>
  );
}
