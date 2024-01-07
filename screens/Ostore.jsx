import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
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

import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { AntDesign } from "@expo/vector-icons";
import { CartContext } from "./CartContext";
import MyButton from "../components/MyButton";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyActivityIndicator from "../components/MyActivityIndicator";
import { UserContext } from "../components/UserContext";

const Ostore = ({ navigation }) => {
  const [cart, setCart] = useContext(CartContext);
  const [ipAddress,setIpAddress] = useState(null); 
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 20 }} onPress={toCart}>
          <AntDesign name="shoppingcart" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const [stock, setStock] = useState();
  const [broadCategory, setBroadCategory] = useState([]);
  const [category, setCategory] = useState([]);
  const [menu, setMenu] = useState([]);
  const [loggedInId,setLoggedInId] = useState('');
  const [loggedInUser,setLoggedInUser] = useState('');
  const [showA,setShowA] = useState(true)
  const [user, setuser] = useContext(UserContext);
  


  useEffect(() => {
    getIp();
  }, []);

  useEffect(() => {
   gas();     
  }, [ipAddress]);

  useEffect(() => {
    setCart(cart);    
  }, [cart]);

  useEffect(() => {
    retrieveData();
  }, []);

 // i would have and can still put getbroadcategory straight inside useeffect but i did it like this to test the activity indicator with the settimeout
function gas (){
  // setTimeout(() => {
    getBroadCategory();
  // }, 3000);
}

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
  const toProfile = () =>{
    navigation.navigate("Profile")
  }
//
  const getBroadCategory = async () => {
    if(ipAddress!==null){
    try{  
     setShowA(true)
    const res = await fetch(
      "http://"+ipAddress+":80/amonie/index.php?r=inventory/categories",
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
    setBroadCategory(data);
    setCategory([]);
    setMenu([]);
    setShowA(false);
    }catch(error){
      console.log(error);
    }
  }
  };

  // get category

  const getCategory = async (id) => {
    setShowA(true);
    try{
    const res = await fetch(
      "http://"+ipAddress+":80/amonie/index.php?r=inventory/categories2&id="+id,
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
  
    setCategory(data);
    setMenu([]);
    setShowA(false);
    }catch(error){
      console.log(error);
    }
  };

  const saveToCart = (data) => {
  
    const exist = cart.find((x) => x.id === data.id);
    if (exist) {
      setCart(
        cart.map((x) =>
          x.id === data.id ? { ...exist, qty: (exist.qty += 1) } : x
        )
      );
    } else {
      setCart([...cart, { ...data, qty: 1, userid:user }]);
    }

  };

  const toCart = () => {
    navigation.navigate("Cart", { items: { cart } });
   
  };

  const getMenu = (id) => {
    navigation.navigate("Ordering", { id: { id } });
   
  };

  const Subtract = (item) => {
    let data = item;
    let nItem = null;
    const exist = cart.find((x) => x.id === data.id);
    if (exist) {
      if (exist.qty <= 1) {
        nItem = cart.filter((item) => item.id !== data.id);
        return setCart(nItem);
      }

      if (exist.qty > 0) {
        setCart(
          cart.map((x) =>
            x.id === data.id ? { ...exist, qty: (exist.qty -= 1) } : x
          )
        );
      }
    }
    // calc();
  };

  const addOn = (data) => {
  
    const exist = cart.find((x) => x.id === data.id);
    if (exist) {
      setCart(
        cart.map((x) =>
          x.id === data.id ? { ...exist, qty: (exist.qty += 1) } : x
        )
      );
    } else {
      setCart([...cart, { ...data, qty: 1, userid:user }]);
    }

    // calc();
  };

  const Remove = (e, item) => {

    setCart(cart.filter((car) => item.id !== car.id));
  };

  const cashFormat = (cash) => {
    return cash.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };


  const getMenu2 = async (id) => {
    setShowA(true)
    try{
    const res = await fetch(
      "http://"+ipAddress+":80/amonie/index.php?r=inventory/menu&id="+id,
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
      setCategory([]);
    setMenu(data);
  setShowA(false)
    }catch(error){
      console.log(error);
    }
  };
 


  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('@posid');
      const used = await AsyncStorage.getItem('@posname');
      if (value !== null) {       
        setLoggedInId(value);
        setLoggedInUser(used);
      }else{
        console.log('not working')
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  return (
   
    <View style={styles.container}>

      <View>
        <Text>Logged in as {loggedInUser!==null && loggedInUser} </Text> 
       
      </View>
      <View>
        <Text> {cart.length} Items in Cart</Text> 
      </View>
    
        <View style={styles.top}>
          
        {        

          <ScrollView horizontal={true} >
            
          {/* {showA && <MyActivityIndicator />} */}
          {showA===true  ? <MyActivityIndicator /> : broadCategory.map((item) =>
          
           <View  key={item.id} style={styles.items}>   
           <TouchableOpacity onPress={() => getCategory(item.id)}>               
              <MyButton title={item.name} />   
              </TouchableOpacity>      
            </View>           

          )}
           
        </ScrollView>

        }          
        </View>

        <View style={{flex:1}}>
        {!category && <MyActivityIndicator />}
          {category!==null &&
          <View>
          
          <FlatList
            // numColumns={2}
            data={category}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => getMenu2(item.id)}> 
              <View style={ styles.cathold }>                           
                <Text style={styles.cat}>{item.cat}</Text>
              </View>
              </TouchableOpacity>      
            )}
            ListFooterComponent={<View />}
            ListFooterComponentStyle={{ height: 20 }}
          />
          </View>

          
        }
       
        
        {category!==null &&
        <View>
        
        <FlatList
          // numColumns={2}
          data={menu}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            
              <TouchableOpacity onPress={() => saveToCart(item)}> 
            <View style={ styles.menu }>              
              <Text style={styles.catMenu}>{item.name}</Text>
            </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={<View />}
          ListFooterComponentStyle={{ height: 20 }}
        />
        </View>
      }
      </View>
       
    </View>
     
  );
};

export default Store;

const styles = StyleSheet.create({
  container: {
    flex:1,
    margin: 10,
  },
  items:{   
    padding:10
  },
  top:{
    backgroundColor:"#D5D8DC",
    alignContent:"space-around",
    alignItems:"center" , 
  },
  cat:{
    padding:10,
    backgroundColor:"#6675C8",
    color:"white",
    marginTop:10,
    display:"flex",
    flex:1
  },
  cathold:{
    borderRadius:20,  
    padding:5
  },
  catMenu:{
    padding:10,
    backgroundColor:"#6C3483",
    color:"white",
    marginTop:10,
    display:"flex",
    flex:1
  }


});
