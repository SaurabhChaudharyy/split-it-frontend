import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Dashboard() {
  const [fontsLoaded] = useFonts({
    Montserrat: require("../../assets/fonts/Montserrat_400Regular.ttf"),
    MontserratB: require("../../assets/fonts/Montserrat_700Bold.ttf"),
  });

  const [balanceData, setBalanceData] = useState({
    totalBalance: 0,
    totalToGive: 0,
    totalToReceive: 0,
    userBalances: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  if (!fontsLoaded) {
    return null;
  }

  const fetchBalanceData = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Authentication Error", "Please log in to view dashboard.");
        router.push("/login");
        return;
      }

      const response = await fetch("http://13.201.80.26/dashboard", {
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
        setBalanceData(data);
      } else {
        Alert.alert("Error", data.error || "Failed to fetch dashboard data");
        console.error("Failed to fetch dashboard data:", data.error);
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
      console.error("Error fetching balance data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBalanceData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchBalanceData();
  }, []);

  const getBalanceColor = (balance) => {
    if (balance > 0) return "#10b981"; // Green - they owe you
    if (balance < 0) return "#ef4444"; // Red - you owe them
    return "#6b7280"; // Gray - balanced
  };

  const getBalanceText = (balance: any) => {
    if (balance > 0) return `owes you ₹${Math.abs(balance).toFixed(2)}`;
    if (balance < 0) return `you owe ₹${Math.abs(balance).toFixed(2)}`;
    return "all settled";
  };

  const getTotalBalanceText = () => {
    const { totalBalance } = balanceData;
    if (totalBalance > 0) return `You are owed ₹${totalBalance.toFixed(2)}`;
    if (totalBalance < 0)
      return `You owe ₹${Math.abs(totalBalance).toFixed(2)}`;
    return "All expenses settled";
  };

  const getTotalBalanceColor = () => {
    const { totalBalance } = balanceData;
    if (totalBalance > 0) return "#10b981"; // Green
    if (totalBalance < 0) return "#ef4444"; // Red
    return "#6b7280"; // Gray
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
            <Text className="text-3xl">💰</Text>
          </View>
          <Text
            className="text-2xl font-bold text-white mb-2"
            style={{ fontFamily: "MontserratB" }}
          >
            Expense Dashboard
          </Text>
        </View>

        {/* Total Balance Card */}
        <View className="bg-white rounded-2xl shadow-xl p-6 mx-2 mb-6">
          <View className="items-center">
            <Text
              className="text-lg font-medium text-gray-600 mb-2"
              style={{ fontFamily: "MontserratB" }}
            >
              Overall Balance
            </Text>
            <Text
              className="text-3xl font-bold mb-4"
              style={{
                fontFamily: "MontserratB",
                color: getTotalBalanceColor(),
              }}
            >
              {getTotalBalanceText()}
            </Text>

            {/* Balance Summary */}
            <View className="flex-row justify-between w-full mt-4 pt-4 border-t border-gray-200">
              <View className="items-center flex-1">
                <Text
                  className="text-sm text-gray-500 mb-1"
                  style={{ fontFamily: "Montserrat" }}
                >
                  You owe
                </Text>
                <Text
                  className="text-lg font-bold text-red-500"
                  style={{ fontFamily: "MontserratB" }}
                >
                  ₹{balanceData.totalToGive.toFixed(2)}
                </Text>
              </View>
              <View className="w-px bg-gray-200 mx-4" />
              <View className="items-center flex-1">
                <Text
                  className="text-sm text-gray-500 mb-1"
                  style={{ fontFamily: "Montserrat" }}
                >
                  You're owed
                </Text>
                <Text
                  className="text-lg font-bold text-green-500"
                  style={{ fontFamily: "MontserratB" }}
                >
                  ₹{balanceData.totalToReceive.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* User Balances Header */}
        <View className="mx-2 mb-4">
          <Text
            className="text-xl font-bold text-white mb-2"
            style={{ fontFamily: "MontserratB" }}
          >
            Balances with Friends
          </Text>
          <Text className="text-white/70" style={{ fontFamily: "Montserrat" }}>
            {balanceData.userBalances.length} active balances
          </Text>
        </View>

        {/* User Balance Cards */}
        <View className="mx-2 space-y-3">
          {balanceData.userBalances.length === 0 ? (
            <View className="bg-white rounded-xl p-8 items-center">
              <Text className="text-4xl mb-4">👥</Text>
              <Text
                className="text-gray-600 text-center text-lg"
                style={{ fontFamily: "MontserratB" }}
              >
                No balances with friends yet!
              </Text>
              <Text
                className="text-gray-500 text-center mt-2"
                style={{ fontFamily: "Montserrat" }}
              >
                Add an expense to start splitting.
              </Text>
            </View>
          ) : (
            balanceData.userBalances.map((user) => (
              <TouchableOpacity
                key={user.id}
                className="bg-white rounded-xl shadow-lg p-4"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  {/* User Info */}
                  <View className="flex-1">
                    <Text
                      className="text-lg font-bold text-gray-800 mb-1"
                      style={{ fontFamily: "MontserratB" }}
                    >
                      {user.fullName}
                    </Text>
                    <Text
                      className="text-sm text-gray-500 mb-1"
                      style={{ fontFamily: "Montserrat" }}
                    >
                      @{user.username}
                    </Text>
                    <Text
                      className="text-xs text-gray-400"
                      style={{ fontFamily: "Montserrat" }}
                    >
                      Last transaction • {user.lastTransaction}
                    </Text>
                  </View>

                  {/* Balance */}
                  <View className="items-end">
                    <Text
                      className="text-lg font-bold mb-1"
                      style={{
                        fontFamily: "MontserratB",
                        color: getBalanceColor(user.balance),
                      }}
                    >
                      ₹{Math.abs(user.balance).toFixed(2)}
                    </Text>
                    <Text
                      className="text-xs text-center"
                      style={{
                        fontFamily: "Montserrat",
                        color: getBalanceColor(user.balance),
                      }}
                    >
                      {getBalanceText(user.balance)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
