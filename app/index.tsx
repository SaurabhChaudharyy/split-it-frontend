import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Login from "./screens/auth/Login";
import Signup from "./screens/auth/Register";
import Home from "./screens/app/Home/Home";

const App = () => {
  return <Home />;
};

export default App;
