import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

import Login from "../screens/Login";
import TabNav from "./Tabs";
import Ordering from "../screens/Ordering";
import Store from "../screens/Store";
import IpAddress from "../screens/IpAddress";
import Today from "../screens/Today";
import Details from "../screens/Details";
const HomeStack = () =>{
    return (
    <Stack.Navigator
    screenOptions={{
        headerShown: false,
        // footerShown:false
      }}
      >
    <Stack.Screen name="Login" component ={Login} options={{ tabBarVisible: false}} />
    <Stack.Screen name="Products" component={TabNav} />
    <Stack.Screen name="IpAddress" component ={IpAddress} />
    <Stack.Screen name="Today" component ={Today} options={{ headerShown: true}} />
    <Stack.Screen name="Details" component ={Details} options={{ headerShown: true}} />
    
    
    
    </Stack.Navigator>)
}

export default HomeStack;


