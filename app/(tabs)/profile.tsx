import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Alert, // Add Alert
} from "react-native";
import { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Add AsyncStorage

export default function Profile() {
  const [fontsLoaded] = useFonts({
    Montserrat: require("../../assets/fonts/Montserrat_400Regular.ttf"),
    MontserratB: require("../../assets/fonts/Montserrat_700Bold.ttf"),
  });

  const [profileData, setProfileData] = useState({
    fullName: "",
    username: "",
    email: "",
    totalExpenses: 0,
    totalFriends: 0,
    settledExpenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  if (!fontsLoaded) {
    return null;
  }

  // Fetch profile data
  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Authentication Error", "Please log in to view profile.");
        router.push("/login");
        return;
      }

      const response = await fetch("http://13.201.80.26/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (response.status === 401) {
        Alert.alert("Session Expired", "Please login again");
        await AsyncStorage.removeItem("token");
        router.push("/login");
        return;
      }

      if (response.ok) {
        setProfileData(data);
      } else {
        Alert.alert("Error", data.error || "Failed to fetch profile data");
        console.error("Error fetching profile data:", data.error);
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfileData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    console.log("User Signout");
    setShowSignOutModal(false);
    await AsyncStorage.removeItem("token"); // Clear the token
    router.push("/login");
  };

  if (isLoading) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "#123458" }}
      >
        <Text
          className="text-white text-lg"
          style={{ fontFamily: "Montserrat" }}
        >
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: "#123458" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          className="flex-1 px-6 py-8 min-h-screen"
          style={{ backgroundColor: "#123458" }}
        >
          {/* Header */}
          <View className="items-center mb-8">
            <View className="bg-white p-4 rounded-full shadow-lg mb-4">
              <Text className="text-3xl">👤</Text>
            </View>
            <Text
              className="text-2xl font-bold text-white mb-2"
              style={{ fontFamily: "MontserratB" }}
            >
              My Profile
            </Text>
          </View>

          {/* Profile Info Card */}
          <View className="bg-white rounded-2xl shadow-xl p-6 mx-2 mb-6">
            <View className="items-center mb-4">
              <View className="bg-blue-100 p-6 rounded-full mb-4">
                <Text className="text-4xl">
                  {profileData.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Text>
              </View>
              <Text
                className="text-2xl font-bold text-gray-800 mb-1"
                style={{ fontFamily: "MontserratB" }}
              >
                {profileData.fullName}
              </Text>
              <Text
                className="text-lg text-gray-500 mb-2"
                style={{ fontFamily: "Montserrat" }}
              >
                @{profileData.username}
              </Text>
            </View>
          </View>

          {/* Stats Card */}
          <View className="bg-white rounded-2xl shadow-xl p-6 mx-2 mb-6">
            <Text
              className="text-lg font-bold text-gray-800 mb-4"
              style={{ fontFamily: "MontserratB" }}
            >
              Your Statistics
            </Text>

            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text
                  className="text-xl font-bold text-blue-600 mb-1"
                  style={{ fontFamily: "MontserratB" }}
                >
                  ₹{profileData.totalExpenses.toFixed(2)}
                </Text>
                <Text
                  className="text-xs text-gray-500 text-center"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Total Expenses
                </Text>
              </View>

              <View className="w-px bg-gray-200 mx-4" />

              <View className="items-center flex-1">
                <Text
                  className="text-xl font-bold text-green-600 mb-1"
                  style={{ fontFamily: "MontserratB" }}
                >
                  {profileData.settledExpenses}
                </Text>
                <Text
                  className="text-xs text-gray-500 text-center"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Settled
                </Text>
              </View>
            </View>
          </View>
          <View className="mx-2 mb-8">
            <TouchableOpacity
              className="bg-red-500 rounded-xl shadow-lg p-4"
              activeOpacity={0.8}
              onPress={() => {
                console.log("Button pressed!");
                setShowSignOutModal(true);
              }}
            >
              <View className="flex-row items-center justify-center">
                <Text className="text-xl mr-3">🚪</Text>
                <Text
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "MontserratB" }}
                >
                  Sign Out
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="none"
        transparent={true}
        visible={showSignOutModal}
        onRequestClose={() => setShowSignOutModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl p-6 mx-6 min-w-[280px]">
            <Text
              className="text-xl font-bold text-gray-800 mb-4 text-center"
              style={{ fontFamily: "MontserratB" }}
            >
              Sign Out
            </Text>
            <Text
              className="text-base text-gray-600 mb-6 text-center"
              style={{ fontFamily: "Montserrat" }}
            >
              Are you sure you want to sign out?
            </Text>

            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-xl py-3"
                onPress={() => {
                  console.log("No pressed");
                  setShowSignOutModal(false);
                }}
              >
                <Text
                  className="text-center text-gray-800 font-bold"
                  style={{ fontFamily: "MontserratB" }}
                >
                  No
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-red-500 rounded-xl py-3"
                onPress={handleSignOut}
              >
                <Text
                  className="text-center text-white font-bold"
                  style={{ fontFamily: "MontserratB" }}
                >
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
