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
  ScrollView,
} from "react-native";

import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { AntDesign } from "@expo/vector-icons";
import { CartContext } from "./CartContext";
import MyButton from "../components/MyButton";

const Ordering = ({ navigation, route }) => {
  const [cart, setCart] = useContext(CartContext);
  let id = route.params.id 
  console.log("the id is ",id);
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

  useEffect(() => {
    getBroadCategory();
  }, []);

  useEffect(() => {
    setCart(cart);
  }, [cart]);

  useEffect(() => {
    getMenu(id);
  }, [id]);

  const toProfile = () =>{
    navigation.navigate("Profile")
  }
//
  const getBroadCategory = async () => {
    try{
    // const res = await fetch("http://192.168.43.139:80/jstores/categories.php", {
    const res = await fetch(
      "http://192.168.43.139:80/amonie/index.php?r=inventory/categories",
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
  
    }catch(error){
      console.log(error);
    }
  };

  // get categor

  const getCategory = async (id) => {
    try{
    const res = await fetch(
      "http://192.168.43.139:80/amonie/index.php?r=inventory/categories2&id="+id,
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
    console.log(data);
    setCategory(data);
  
    }catch(error){
      console.log(error);
    }
  };

  // get menu items

  const getMenu = async (id) => {
    try{
    const res = await fetch(
      "http://192.168.43.139:80/amonie/index.php?r=inventory/menu&id="+id.id,
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

    setMenu(data);
  
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
      setCart([...cart, { ...data, qty: 1 }]);
    }

  };

  const toCart = () => {
    navigation.navigate("Cart", { items: { cart } });
   
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
      setCart([...cart, { ...data, qty: 1 }]);
    }

    // calc();
  };

  const Remove = (e, item) => {

    setCart(cart.filter((car) => item.id !== car.id));
  };

  const cashFormat = (cash) => {
    return cash.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };


  const catDetails=()=>{

  }

  return (
   
    <View style={styles.container}>

      <View>
        <Text>Select Category</Text> 
      </View>
    
        <View style={styles.top}>
          
        {        

          <ScrollView horizontal={true} >
          {broadCategory !== null && broadCategory.map((item) =>
          
           <View  key={item.id} style={styles.items}>   
                       
              <MyButton title={item.name} />   
            
            </View>           

          )}
        </ScrollView>

        }          
        </View>

        <View style={{flex:1}}>
        
          {category!==null &&
          <View>
          
          <FlatList
            // numColumns={2}
            data={menu}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => getMenu(item.id)}> 
              <View style={ styles.menu }>              
                <Text style={styles.cat}>{item.name}</Text>
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

export default Ordering;

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
  menu:{
    borderRadius:20,  
    padding:5
  },


});
