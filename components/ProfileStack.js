import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();


import Today from "../screens/Today";
const ProfileStack = () =>{
    return (
    <Stack.Navigator
    screenOptions={{
        headerShown: false
      }}
      >
    <Stack.Screen name="Today" component ={Today} />   
    
    </Stack.Navigator>)
}

export default ProfileStack;


