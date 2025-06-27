import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import { useFonts } from "expo-font";

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

  // Mock transaction data - Replace with actual API call
  const mockTransactions = [
    {
      id: 1,
      name: "Dinner at Pizza Palace",
      amount: 85.5,
      category: "food",
      date: "2024-06-20T18:30:00Z",
      splitWith: {
        username: "john_doe",
        fullName: "John Doe",
      },
      splitMode: "user1_paid_split_equal",
      userShare: 42.75,
      otherUserShare: 42.75,
      status: "you_paid",
      settled: false,
    },
    {
      id: 2,
      name: "Grocery Shopping",
      amount: 120.4,
      category: "groceries",
      date: "2024-06-19T14:15:00Z",
      splitWith: {
        username: "sarah_smith",
        fullName: "Sarah Smith",
      },
      splitMode: "user2_paid_split_equal",
      userShare: 60.2,
      otherUserShare: 60.2,
      status: "they_paid",
      settled: false,
    },
    {
      id: 3,
      name: "Movie Tickets",
      amount: 40.0,
      category: "entertainment",
      date: "2024-06-18T19:45:00Z",
      splitWith: {
        username: "mike_wilson",
        fullName: "Mike Wilson",
      },
      splitMode: "user1_paid_split_equal",
      userShare: 20.0,
      otherUserShare: 20.0,
      status: "you_paid",
      settled: true,
    },
    {
      id: 4,
      name: "Uber Ride to Airport",
      amount: 65.8,
      category: "transportation",
      date: "2024-06-17T08:20:00Z",
      splitWith: {
        username: "emma_davis",
        fullName: "Emma Davis",
      },
      splitMode: "user2_paid_no_split",
      userShare: 0,
      otherUserShare: 65.8,
      status: "they_paid",
      settled: false,
    },
    {
      id: 5,
      name: "Coffee & Breakfast",
      amount: 28.6,
      category: "food",
      date: "2024-06-16T09:10:00Z",
      splitWith: {
        username: "alex_brown",
        fullName: "Alex Brown",
      },
      splitMode: "user1_paid_split_equal",
      userShare: 14.3,
      otherUserShare: 14.3,
      status: "you_paid",
      settled: false,
    },
    {
      id: 6,
      name: "Gym Membership Split",
      amount: 150.0,
      category: "fitness",
      date: "2024-06-15T16:00:00Z",
      splitWith: {
        username: "sarah_smith",
        fullName: "Sarah Smith",
      },
      splitMode: "user1_paid_split_equal",
      userShare: 75.0,
      otherUserShare: 75.0,
      status: "you_paid",
      settled: false,
    },
  ];

  // Fetch transactions data
  const fetchTransactions = async () => {
    try {
      setIsLoading(true);

      // Replace with actual API call
      // const token = await AsyncStorage.getItem('token');
      // const response = await fetch('YOUR_API_ENDPOINT/transactions', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      // const data = await response.json();

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const sortedTransactions = mockTransactions.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setTransactions(sortedTransactions);
      setFilteredTransactions(sortedTransactions);
    } catch (error) {
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
          t.category.toLowerCase().includes(search.toLowerCase())
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
      other: "📊",
    };
    return icons[category] || "📊";
  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getTransactionStatus = (transaction) => {
    if (transaction.settled) {
      return { text: "Settled", color: "#6b7280" };
    }

    if (transaction.status === "you_paid") {
      if (transaction.userShare === transaction.amount) {
        return { text: "You paid (no split)", color: "#3b82f6" };
      }
      return {
        text: `${
          transaction.splitWith.fullName
        } owes you $${transaction.otherUserShare.toFixed(2)}`,
        color: "#10b981",
      };
    } else {
      if (transaction.otherUserShare === transaction.amount) {
        return { text: "They paid (no split)", color: "#6b7280" };
      }
      return {
        text: `You owe $${transaction.userShare.toFixed(2)}`,
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
                Total amount: $
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
                        ${transaction.amount.toFixed(2)}
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
