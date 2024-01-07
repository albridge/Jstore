import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { CartProvider } from "./screens/CartContext";
import { UserProvider } from "./components/UserContext";
import HomeStack from "./components/HomeStack";

export default function App() {

  return (
    <UserProvider>
    <CartProvider>
      <NavigationContainer>
        <HomeStack />
      </NavigationContainer>
    </CartProvider>
    </UserProvider>
  );
}
