import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useState, useEffect } from "react";
import { useFonts } from "expo-font";

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

  // Mock data - Replace with actual API call
  const mockData = {
    totalBalance: -125.5,
    totalToGive: 275.3,
    totalToReceive: 149.8,
    userBalances: [
      {
        id: 1,
        username: "john_doe",
        fullName: "John Doe",
        balance: -85.5, // You owe John $85.50
        lastTransaction: "Dinner at Pizza Place",
      },
      {
        id: 2,
        username: "sarah_smith",
        fullName: "Sarah Smith",
        balance: 65.2, // Sarah owes you $65.20
        lastTransaction: "Grocery shopping",
      },
      {
        id: 3,
        username: "mike_wilson",
        fullName: "Mike Wilson",
        balance: -40.0, // You owe Mike $40.00
        lastTransaction: "Movie tickets",
      },
      {
        id: 4,
        username: "emma_davis",
        fullName: "Emma Davis",
        balance: 84.6, // Emma owes you $84.60
        lastTransaction: "Uber ride",
      },
      {
        id: 5,
        username: "alex_brown",
        fullName: "Alex Brown",
        balance: -65.2, // You owe Alex $65.20
        lastTransaction: "Coffee meetup",
      },
    ],
  };

  // Fetch balance data
  const fetchBalanceData = async () => {
    try {
      setIsLoading(true);

      // Replace with actual API call
      // const token = await AsyncStorage.getItem('token');
      // const response = await fetch('YOUR_API_ENDPOINT/dashboard', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      // const data = await response.json();

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setBalanceData(mockData);
    } catch (error) {
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
    if (balance > 0) return `owes you $${Math.abs(balance).toFixed(2)}`;
    if (balance < 0) return `you owe $${Math.abs(balance).toFixed(2)}`;
    return "all settled";
  };

  const getTotalBalanceText = () => {
    const { totalBalance } = balanceData;
    if (totalBalance > 0) return `You are owed $${totalBalance.toFixed(2)}`;
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
          {balanceData.userBalances.map((user) => (
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
                    ${Math.abs(user.balance).toFixed(2)}
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
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
