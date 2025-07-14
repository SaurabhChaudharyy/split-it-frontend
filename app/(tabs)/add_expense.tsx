import { ScrollView, View, Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Keep this import
import { useState } from "react";
import { useFonts } from "expo-font";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { router } from "expo-router";

export default function Expense() {
  const [fontsLoaded] = useFonts({
    Montserrat: require("../../assets/fonts/Montserrat_400Regular.ttf"),
    MontserratB: require("../../assets/fonts/Montserrat_700Bold.ttf"),
  });

  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [splitWithUser, setSplitWithUser] = useState("");
  const [splitMode, setSplitMode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!fontsLoaded) {
    return null;
  }

  // Function to validate and format amount input
  const handleAmountChange = (text) => {
    // Remove any non-numeric characters except decimal point
    const numericValue = text.replace(/[^0-9.]/g, "");

    // Ensure only one decimal point
    const parts = numericValue.split(".");
    if (parts.length > 2) {
      return;
    }

    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return;
    }

    setExpenseAmount(numericValue);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!expenseName.trim()) {
      Alert.alert("Error", "Please enter an expense name");
      return;
    }

    if (!expenseAmount || parseFloat(expenseAmount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    if (!splitMode) {
      Alert.alert("Error", "Please select a split mode");
      return;
    }

    // Check if split_with_user is required for certain split modes
    if (
      (splitMode === "user2_paid_split_equal" ||
        splitMode === "user2_paid_no_split" ||
        splitMode === "user1_paid_split_equal") && // user1_paid_split_equal also requires a split_with user
      !splitWithUser.trim()
    ) {
      Alert.alert("Error", "Please enter the username to split with");
      return;
    }

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Authentication Error", "Please log in to add expenses.");
        router.push("/login");
        return;
      }

      const expenseData = {
        name: expenseName.trim(),
        amount: parseFloat(expenseAmount),
        category: selectedCategory,
        split_mode: splitMode,
        split_with: splitWithUser.trim() || null,
      };

      const response = await fetch("http://13.201.80.26/add_expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expenseData),
      });

      const result = await response.json();

      if (response.status === 401) {
        Alert.alert("Session Expired", "Please login again");
        await AsyncStorage.removeItem("token"); // Clear invalid token
        router.push("/login");
        return;
      }

      if (response.ok) {
        Alert.alert("Success", result.message || "Expense added successfully!");

        // Reset form
        setExpenseName("");
        setExpenseAmount("");
        setSelectedCategory("");
        setSplitWithUser("");
        setSplitMode("");
      } else {
        Alert.alert("Error", result.error || "Failed to add expense");
      }
    } catch (error) {
      Alert.alert("Error", "Network error. Please try again.");
      console.error("Error adding expense:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSplitModeLabel = (mode) => {
    switch (mode) {
      case "user1_paid_split_equal":
        return "I paid, split equally";
      case "user2_paid_split_equal":
        return "They paid, split equally";
      case "user1_paid_no_split":
        return "I paid, no split";
      case "user2_paid_no_split":
        return "They paid, no split";
      default:
        return "";
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={{ backgroundColor: "#123458" }}
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
            Add New Expense
          </Text>
        </View>

        {/* Form Container */}
        <View className="bg-white rounded-2xl shadow-xl p-6 mx-2">
          {/* Expense Name Input */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <Text className="text-lg mr-2">📝</Text>
              <Text
                className="text-sm font-medium text-gray-700"
                style={{ fontFamily: "MontserratB" }}
              >
                Expense Name
              </Text>
            </View>
            <Input
              variant="outline"
              size="md"
              className="w-full border-gray-200 focus:border-blue-500"
              accessibilityLabel="Name input"
              accessibilityHint="Enter the name of the expense"
            >
              <InputField
                placeholder="e.g., Grocery shopping, Gas, Coffee"
                value={expenseName}
                onChangeText={setExpenseName}
                className="text-gray-800"
                style={{ fontFamily: "Montserrat" }}
              />
            </Input>
          </View>

          {/* Amount Input */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <Text className="text-lg mr-2">💵</Text>
              <Text
                className="text-sm font-medium text-gray-700"
                style={{ fontFamily: "MontserratB" }}
              >
                Amount
              </Text>
            </View>
            <Input
              variant="outline"
              size="md"
              className="w-full border-gray-200 focus:border-blue-500"
              accessibilityLabel="Amount input"
              accessibilityHint="Enter the amount of the expense"
              keyboardType="decimal-pad"
            >
              <InputField
                placeholder="0.00"
                value={expenseAmount}
                onChangeText={handleAmountChange}
                className="text-gray-800 text-lg font-medium"
                style={{ fontFamily: "Montserrat" }}
              />
            </Input>
            {expenseAmount && (
              <Text
                className="text-xs text-gray-500 mt-1"
                style={{ fontFamily: "Montserrat" }}
              >
                Amount: ₹{parseFloat(expenseAmount || 0).toFixed(2)}
              </Text>
            )}
          </View>

          {/* Category Select */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <Text className="text-lg mr-2">🏷️</Text>
              <Text
                className="text-sm font-medium text-gray-700"
                style={{ fontFamily: "MontserratB" }}
              >
                Category
              </Text>
            </View>
            <Select onValueChange={setSelectedCategory}>
              <SelectTrigger
                variant="outline"
                size="md"
                className="w-full border-gray-200 focus:border-blue-500"
                accessibilityLabel="Category selector"
                accessibilityHint="Select the category of the expense"
              >
                <SelectInput
                  placeholder="Choose a category"
                  className="text-gray-800"
                  style={{ fontFamily: "Montserrat" }}
                  value={
                    selectedCategory
                      ? selectedCategory.charAt(0).toUpperCase() +
                        selectedCategory.slice(1).replace(/_/g, " ")
                      : ""
                  } // Display selected category
                />
                <SelectIcon className="mr-3" as={ChevronDownIcon} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent className="bg-white">
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>

                  {/* Essential Categories */}
                  <SelectItem label="🏠 Housing & Rent" value="housing" />
                  <SelectItem label="🍕 Food & Dining" value="food" />
                  <SelectItem
                    label="🚗 Transportation"
                    value="transportation"
                  />
                  <SelectItem label="🛒 Groceries" value="groceries" />
                  <SelectItem label="⚡ Utilities" value="utilities" />

                  {/* Lifestyle Categories */}
                  <SelectItem label="👕 Clothing" value="clothing" />
                  <SelectItem label="💊 Healthcare" value="healthcare" />
                  <SelectItem label="🎬 Entertainment" value="entertainment" />
                  <SelectItem label="🏋️ Fitness & Sports" value="fitness" />
                  <SelectItem label="✈️ Travel" value="travel" />

                  {/* Financial Categories */}
                  <SelectItem label="📚 Education" value="education" />
                  <SelectItem label="🎁 Gifts & Donations" value="gifts" />
                  <SelectItem label="💳 Personal Care" value="personal_care" />
                  <SelectItem label="🔧 Home Maintenance" value="maintenance" />
                  <SelectItem label="📱 Subscriptions" value="subscriptions" />
                  <SelectItem label="💼 Business" value="business" />
                  <SelectItem label="📊 Other" value="other" />
                </SelectContent>
              </SelectPortal>
            </Select>
          </View>

          {/* Split Mode Select */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <Text className="text-lg mr-2">🤝</Text>
              <Text
                className="text-sm font-medium text-gray-700"
                style={{ fontFamily: "MontserratB" }}
              >
                Split Mode
              </Text>
            </View>
            <Select onValueChange={setSplitMode}>
              <SelectTrigger
                variant="outline"
                size="md"
                className="w-full border-gray-200 focus:border-blue-500"
                accessibilityLabel="Split mode selector"
                accessibilityHint="Select how to split the expense"
              >
                <SelectInput
                  placeholder="Choose split mode"
                  className="text-gray-800"
                  style={{ fontFamily: "Montserrat" }}
                  value={getSplitModeLabel(splitMode)} // Display selected split mode
                />
                <SelectIcon className="mr-3" as={ChevronDownIcon} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent className="bg-white">
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>

                  <SelectItem
                    label="I paid, split equally"
                    value="user1_paid_split_equal"
                  />
                  <SelectItem
                    label="They paid, split equally"
                    value="user2_paid_split_equal"
                  />
                  <SelectItem
                    label="I paid, no split"
                    value="user1_paid_no_split"
                  />
                  <SelectItem
                    label="They paid, no split"
                    value="user2_paid_no_split"
                  />
                </SelectContent>
              </SelectPortal>
            </Select>
          </View>

          {/* Split With User Input - Only show if needed */}
          {(splitMode === "user2_paid_split_equal" ||
            splitMode === "user2_paid_no_split" ||
            splitMode === "user1_paid_split_equal") && (
            <View className="mb-6">
              <View className="flex-row items-center mb-2">
                <Text className="text-lg mr-2">👤</Text>
                <Text
                  className="text-sm font-medium text-gray-700"
                  style={{ fontFamily: "MontserratB" }}
                >
                  Split With User
                </Text>
              </View>
              <Input
                variant="outline"
                size="md"
                className="w-full border-gray-200 focus:border-blue-500"
                accessibilityLabel="Split with user input"
                accessibilityHint="Enter the username to split the expense with"
              >
                <InputField
                  placeholder="Enter username"
                  value={splitWithUser}
                  onChangeText={setSplitWithUser}
                  className="text-gray-800"
                  style={{ fontFamily: "Montserrat" }}
                />
              </Input>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            className="rounded-xl py-4 px-6 shadow-lg"
            style={{
              backgroundColor: isLoading ? "#94a3b8" : "#123458",
              opacity: isLoading ? 0.7 : 1,
            }}
            accessibilityLabel="Add expense"
            accessibilityHint="Tap to add the expense"
          >
            <Text
              className="text-white text-center font-semibold text-lg"
              style={{ fontFamily: "MontserratB" }}
            >
              {isLoading ? "Adding..." : "Add Expense"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Summary Card */}
        {(expenseName || expenseAmount || selectedCategory || splitMode) && (
          <View className="bg-white/90 backdrop-blur rounded-xl p-4 mx-2 mt-4">
            <Text
              className="text-sm font-medium text-gray-700 mb-2"
              style={{ fontFamily: "MontserratB" }}
            >
              Preview:
            </Text>
            <View className="space-y-1">
              {expenseName && (
                <Text
                  className="text-gray-600"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Name: {expenseName}
                </Text>
              )}
              {expenseAmount && (
                <Text
                  className="text-gray-600"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Amount: ₹{parseFloat(expenseAmount || 0).toFixed(2)}
                </Text>
              )}
              {selectedCategory && (
                <Text
                  className="text-gray-600"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Category: {selectedCategory}
                </Text>
              )}
              {splitMode && (
                <Text
                  className="text-gray-600"
                  style={{ fontFamily: "Montserrat" }}
                >
                  Split: {getSplitModeLabel(splitMode)}
                </Text>
              )}
              {splitWithUser && (
                <Text
                  className="text-gray-600"
                  style={{ fontFamily: "Montserrat" }}
                >
                  With: {splitWithUser}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
