import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          headerShown: false,
          tabBarIcon: () => <AntDesign name="home" size={15} color="black" />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          headerShown: false,
          tabBarIcon: () => <AntDesign name="inbox" size={15} color="black" />,
        }}
      />
      <Tabs.Screen
        name="add_expense"
        options={{
          title: "Add Expense",
          headerShown: false,
          tabBarIcon: () => (
            <AntDesign name="pluscircle" size={15} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: () => (
            <AntDesign name="setting" size={15} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}
