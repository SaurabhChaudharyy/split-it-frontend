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

const App = () => {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Montserrat: require("../../../../assets/fonts/Montserrat_700Bold.ttf"),
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
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require("../../../../assets/images/logo.png")}
            contentFit="cover"
            transition={1000}
          />
        </View>
        <Text
          className="text-6xl text-[#123458] self-center font-bold "
          style={{ fontFamily: "Montserrat" }}
        >
          DIV/DE
        </Text>

        <Center className="flex-1 px-8 py-8 items-center justify-center">
          <VStack space="lg" className="w-full max-w-[320px] mt-5">
            <Button
              size="xl"
              className="bg-[#123458] py-3 px-8 rounded-xl"
              onPress={() => {
                console.log("Sign Up pressed");
                router.push("/screens/auth/Register");
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
                console.log("Sign Up pressed");
                router.push("/screens/auth/Login");
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
};

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    marginBottom: -100,
    width: "40%",
    height: "40%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  image: {
    width: "100%",
    height: "50%",
    backgroundColor: "#fff",
    resizeMode: "contain",
  },
});
