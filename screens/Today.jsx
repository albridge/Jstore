import React, {useState, useEffect, useLayoutEffect, useContext } from 'react'
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyActivityIndicator from "../components/MyActivityIndicator";
import { UserContext } from "../components/UserContext";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  TouchableOpacity,
  Image,
  SafeAreaView,
  addons,
  ScrollView   
} from "react-native";
import { useURL } from 'expo-linking';
import Card from '../components/Card';

const Today = ({navigation}) => {
  const [ipAddress,setIpAddress] = useState(null); 
  const [showA,setShowA] = useState(true)
  const [user, setuser] = useContext(UserContext);
  const [myOrders, setMyOrders] = useState(null);
  const [directory,setDirectory] = useState('');
  

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 20 }}>
          {/* <AntDesign name="shoppingcart" size={24} color="orange" /> */}
          {/* <Ionicons name="ios-pizza" color="black" size={20} /> */}
        </TouchableOpacity>
      ),
    });
  }, []);


  useEffect(() => {
    getDirectory();   
  }, []);

  useEffect(() => {
    getIp();   
  }, [directory]);

  useEffect(() => {  
    getToday();
  }, [ipAddress]);

  const toCart = () => {
    navigation.navigate("Cart", { items: { cart } });
   
  };

  const getIp = async () => {
    try {
      const value = await AsyncStorage.getItem('@posipaddress');
      if (value !== null) {
        // We have data!!
        setIpAddress(value); 
      
         
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  const getToday = async () => {
    if(ipAddress!==null){
    try{  
     setShowA(true)
    const res = await fetch(
      "http://"+ipAddress+":80/"+directory+"/index.php?r=inventory/todays&user="+user,
      {
        method: "GET",
        headers: {
          // "Accept": "application/json, text/plain, */*", 
          "Accept": "application/json", 
          "Content-type": "application/json"
        }
       
      }
    );
  
    const data = await res.json();  

    setMyOrders(data);
    setShowA(false);
   
    }catch(error){
      console.log(error);
    }
  }
  };

  // const getDetails = async (id) => {
  //   if(ipAddress!==null){
  //   try{  
  //    setShowA(true)
  //   const res = await fetch(
  //     "http://"+ipAddress+":80/"+directory+"/index.php?r=inventory/details&id="+id,
  //     {
  //       method: "GET",
  //       headers: {
  //         // "Accept": "application/json, text/plain, */*", 
  //         "Accept": "application/json", 
  //         "Content-type": "application/json"
  //       }
       
  //     }
  //   );
  
  //   const data = await res.json();  

    
  //   setShowA(false);
   
  //   }catch(error){
  //     console.log(error);
  //   }
  // }
  // };

  const details = (id) =>{   
    navigation.navigate("Details", { id:id, deal:myOrders });
  }

  const getDirectory = async () => {
    try {
      const value = await AsyncStorage.getItem('@posdirectory');
      if (value !== null) {
        // We have data!!
        
        setDirectory(value);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  return (
    
    <SafeAreaView style={{flex:1}}> 
    
    {showA===true  ? <View style={{marginTop:100}}><MyActivityIndicator /></View> : 
          
          <FlatList
            // numColumns={2}
            data={myOrders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              
              <TouchableOpacity onPress= {() => details(item.id)}>            
              <Card item_name={item.transaction_id+' - '+item.table_number} icon="play" />
              </TouchableOpacity>  
               
            )}
            // ListFooterComponent={<View />}
            ListFooterComponentStyle={{ height: 20 }}
          /> 
          
          }

    </SafeAreaView>
   
  )
}

export default Today

const styles = StyleSheet.create({
  container: {
    margin: 10,
  } ,
  
  button:{
    borderRadius:10,
  },
  
});