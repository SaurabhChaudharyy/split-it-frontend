import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: () => <AntDesign name="home" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transactions",
          tabBarIcon: () => <AntDesign name="inbox" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="add_expense"
        options={{
          title: "Add Expense",
          tabBarIcon: () => (
            <AntDesign name="pluscircle" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => (
            <AntDesign name="setting" size={24} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}
