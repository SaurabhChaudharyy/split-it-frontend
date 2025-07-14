import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert, // Add Alert for error messages
} from "react-native";
import { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Add AsyncStorage
import { router } from "expo-router"; // Add router

export default function Expense() {
  const [fontsLoaded] = useFonts({
    Montserrat: require("../../assets/fonts/Montserrat_400Regular.ttf"),
    MontserratB: require("../../assets/fonts/Montserrat_700Bold.ttf"),
  });

  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all"); // all, paid, owe

  if (!fontsLoaded) {
    return null;
  }

  // Fetch transactions data
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert(
          "Authentication Error",
          "Please log in to view transactions.",
        );
        router.push("/login");
        return;
      }

      const response = await fetch("http://13.201.80.26/transactions", {
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
        const sortedTransactions = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );
        setTransactions(sortedTransactions);
        setFilteredTransactions(sortedTransactions);
      } else {
        Alert.alert("Error", data.error || "Failed to fetch transactions");
        console.error("Failed to fetch transactions:", data.error);
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  // Filter transactions
  const filterTransactions = (filter, search = searchQuery) => {
    let filtered = transactions;

    // Apply status filter
    if (filter === "paid") {
      filtered = filtered.filter((t) => t.status === "you_paid");
    } else if (filter === "owe") {
      filtered = filtered.filter((t) => t.status === "they_paid" && !t.settled);
    }

    // Apply search filter
    if (search.trim()) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.splitWith.fullName.toLowerCase().includes(search.toLowerCase()) ||
          t.category.toLowerCase().includes(search.toLowerCase()),
      );
    }

    setFilteredTransactions(filtered);
  };

  // Handle search
  const handleSearch = (text) => {
    setSearchQuery(text);
    filterTransactions(selectedFilter, text);
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    filterTransactions(filter);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getCategoryIcon = (category) => {
    const icons = {
      food: "🍕",
      groceries: "🛒",
      entertainment: "🎬",
      transportation: "🚗",
      fitness: "🏋️",
      housing: "🏠",
      utilities: "⚡",
      healthcare: "💊",
      education: "📚",
      travel: "✈️",
      clothing: "👕",
      personal_care: "💳", // Corrected key for personal care
      maintenance: "🔧",
      subscriptions: "📱",
      business: "💼",
      other: "📊",
    };
    return icons[category] || "📊";
  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime()); // Use getTime() for accurate calculation
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today"; // Added 'Today'
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getTransactionStatus = (transaction) => {
    if (transaction.settled) {
      return { text: "Settled", color: "#6b7280" };
    }

    if (transaction.status === "you_paid") {
      if (
        transaction.splitMode === "user1_paid_no_split" ||
        transaction.splitWith.fullName === "No Split User"
      ) {
        return { text: "You paid (no split)", color: "#3b82f6" };
      }
      return {
        text: `${
          transaction.splitWith.fullName
        } owes you ₹${transaction.otherUserShare.toFixed(2)}`,
        color: "#10b981",
      };
    } else {
      // status === "they_paid"
      if (transaction.splitMode === "user2_paid_no_split") {
        // They paid everything, you owe them full amount
        return {
          text: `You owe ₹${transaction.amount.toFixed(2)}`,
          color: "#ef4444",
        };
      }
      return {
        text: `You owe ₹${transaction.userShare.toFixed(2)}`, // userShare is what current user is responsible for
        color: "#ef4444",
      };
    }
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
          Loading transactions...
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
        <View className="items-center mb-6">
          <View className="bg-white p-4 rounded-full shadow-lg mb-4">
            <Text className="text-3xl">📋</Text>
          </View>
          <Text
            className="text-2xl font-bold text-white mb-2"
            style={{ fontFamily: "MontserratB" }}
          >
            All Transactions
          </Text>
          <Text
            className="text-white/80 text-center"
            style={{ fontFamily: "Montserrat" }}
          >
            Track your expense history
          </Text>
        </View>

        {/* Search Bar */}
        <View className="bg-white rounded-xl shadow-lg p-4 mx-2 mb-4">
          <TextInput
            className="text-gray-800 text-base"
            style={{ fontFamily: "Montserrat" }}
            placeholder="Search transactions, people, or categories..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* Filter Buttons */}
        <View className="flex-row mx-2 mb-6 space-x-2">
          <TouchableOpacity
            onPress={() => handleFilterChange("all")}
            className={`flex-1 py-3 px-4 rounded-xl ${
              selectedFilter === "all" ? "bg-white" : "bg-white/20"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                selectedFilter === "all" ? "text-gray-800" : "text-white"
              }`}
              style={{ fontFamily: "MontserratB" }}
            >
              All ({transactions.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleFilterChange("paid")}
            className={`flex-1 py-3 px-4 rounded-xl ${
              selectedFilter === "paid" ? "bg-white" : "bg-white/20"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                selectedFilter === "paid" ? "text-gray-800" : "text-white"
              }`}
              style={{ fontFamily: "MontserratB" }}
            >
              You Paid
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleFilterChange("owe")}
            className={`flex-1 py-3 px-4 rounded-xl ${
              selectedFilter === "owe" ? "bg-white" : "bg-white/20"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                selectedFilter === "owe" ? "text-gray-800" : "text-white"
              }`}
              style={{ fontFamily: "MontserratB" }}
            >
              You Owe
            </Text>
          </TouchableOpacity>
        </View>

        {/* Summary Stats */}
        {filteredTransactions.length > 0 && (
          <View className="bg-white/90 rounded-xl p-4 mx-2 mb-6">
            <Text
              className="text-lg font-bold text-gray-800 mb-3"
              style={{ fontFamily: "MontserratB" }}
            >
              Summary
            </Text>
            <View className="flex-row justify-between">
              <Text
                className="text-gray-600"
                style={{ fontFamily: "Montserrat" }}
              >
                Total transactions: {filteredTransactions.length}
              </Text>
              <Text
                className="text-gray-600"
                style={{ fontFamily: "Montserrat" }}
              >
                Total amount: ₹
                {filteredTransactions
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {/* Transactions List */}
        <View className="mx-2 space-y-3">
          {filteredTransactions.length === 0 ? (
            <View className="bg-white rounded-xl p-8 items-center">
              <Text className="text-4xl mb-4">📝</Text>
              <Text
                className="text-gray-600 text-center text-lg"
                style={{ fontFamily: "MontserratB" }}
              >
                No transactions found
              </Text>
              <Text
                className="text-gray-500 text-center mt-2"
                style={{ fontFamily: "Montserrat" }}
              >
                {searchQuery
                  ? "Try adjusting your search"
                  : "Start by adding your first expense"}
              </Text>
            </View>
          ) : (
            filteredTransactions.map((transaction: any) => {
              const status = getTransactionStatus(transaction);

              return (
                <TouchableOpacity
                  key={transaction.id}
                  className="bg-white rounded-xl shadow-lg p-4"
                  activeOpacity={0.7}
                >
                  <View className="flex-row items-start">
                    {/* Category Icon */}
                    <View className="bg-gray-100 rounded-full p-3 mr-4">
                      <Text className="text-xl">
                        {getCategoryIcon(transaction.category)}
                      </Text>
                    </View>

                    {/* Transaction Details */}
                    <View className="flex-1">
                      <Text
                        className="text-lg font-bold text-gray-800 mb-1"
                        style={{ fontFamily: "MontserratB" }}
                      >
                        {transaction.name}
                      </Text>

                      <View className="flex-row items-center mb-2">
                        <Text
                          className="text-sm text-gray-600"
                          style={{ fontFamily: "Montserrat" }}
                        >
                          with {transaction.splitWith.fullName}
                        </Text>
                      </View>

                      <Text
                        className="text-xs text-gray-400 mb-2"
                        style={{ fontFamily: "Montserrat" }}
                      >
                        {formatDate(transaction.date)} • {transaction.category}
                      </Text>

                      <Text
                        className="text-sm font-medium"
                        style={{
                          fontFamily: "MontserratB",
                          color: status.color,
                        }}
                      >
                        {status.text}
                      </Text>
                    </View>

                    {/* Amount */}
                    <View className="items-end">
                      <Text
                        className="text-xl font-bold text-gray-800 mb-1"
                        style={{ fontFamily: "MontserratB" }}
                      >
                        ₹{transaction.amount.toFixed(2)}
                      </Text>

                      {transaction.settled && (
                        <View className="bg-green-100 px-2 py-1 rounded-full">
                          <Text
                            className="text-xs text-green-700"
                            style={{ fontFamily: "MontserratB" }}
                          >
                            ✓ Settled
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
}
