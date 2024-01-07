import * as React from 'react';
import { TabBarIOS, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Profile from '../screens/Profile';
import Products from '../screens/Products';
import Cart from '../screens/Cart';
import Store from '../screens/Store';
import Logout from '../screens/Logout';
import Today from '../screens/Today';
import { AntDesign } from "@expo/vector-icons";
const Tabs = createBottomTabNavigator();

 const TabNav = () => {
  return (    
      <Tabs.Navigator
      
      screenOptions={({ route }) => ({
        // the header style here applies to all tabs
        headerStyle: {
          backgroundColor: '#F16B1F',
          borderBottomColor:"#F16B1F",
          borderBottomWidth:0,                        
        },
        // tabBarItemStyle: {borderWidth: 1, borderColor:'#101010'},
// tabBarStyle: {paddingBottom:0, backgroundColor: '#101010'},
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Store') {
            iconName = "gift"           
          } else if (route.name === 'Profile') {
            iconName = "user";
          }else if(route.name === 'Cart'){
            iconName = 'shoppingcart';
          }else if(route.name === 'Store'){
            iconName = 'gift';
          }else if(route.name === 'Logout'){
            iconName = 'closesquare';
          }

          // You can return any component that you like here!
          return <AntDesign name={iconName} size={24} color="#F16B1F" />;
        },
        headerTitleStyle: {
          // fontWeight: 'bold',
          color:"white"
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'grey',
        // tabBarStyle: {paddingBottom:0, backgroundColor: '#101010', display:'none'},
        
      })}
      >    
               
        <Tabs.Screen name="Store" component={Store} options={{
          // headerShown:false,
          // this header style will apply to one screen only in this case the store screen
          headerStyle: {
            backgroundColor: '#F16B1F',
            borderBottomColor:"#F16B1F",
            borderBottomWidth:0,                        
          },

        }} />  
        <Tabs.Screen name="Profile" component={Profile} />         
        <Tabs.Screen name="Cart" component={Cart} /> 
        {/* <Tabs.Screen name="Store" component={Products} /> */}
        <Tabs.Screen name="Logout" component={Logout}   options={{
            headerShown: false,
          }} />    
      </Tabs.Navigator>   
  );
}

export default TabNav; 