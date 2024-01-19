import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Button,
  TouchableOpacity,
  Alert,
  TextInput
} from "react-native";
// import CheckBox from "@react-native-community/checkbox";
import CheckBox from 'expo-checkbox';
// import { Button } from "react-native-elements/dist/buttons/Button";
import ThemedListItem from "react-native-elements/dist/list/ListItem";
import { CartContext } from "./CartContext";
import { UserContext } from "../components/UserContext";
import MyButton from "../components/MyButton";
import MyActivityIndicator from '../components/MyActivityIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
// this file doesnt seem to be actively doing anything in our code
const Cart = ({ navigation, route }) => {
  const [cart, setCart] = useContext(CartContext);
  const [user, setuser] = useContext(UserContext);
  const [showA,setShowA] = useState(false)
  const [ipAddress,setIpAddress] = useState(null); 
  const [complimentary, setComplimentary] = useState(false);
  const [tableNumber, setTableNumber] = useState();

  
  
  //   const { items } = route.params;
  //   console.log("inside cart", cart);

  useEffect(() => {
    getIp();  
  }, []);

  

  useEffect(()=>{
    setCart(cart)   ;
  },[cart])

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


 

  const Subtract = (e, item) => {
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
    // console.log(data);
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
    // let newItems = [];
    // newItems = cart.filter((car) => {
    //   item.id !== car.id;
    // });
    // return setCart(newItems);

    setCart(cart.filter((car) => item.id !== car.id));
  };

  const cashFormat = (cash) => {
    return cash.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };

  const total = () =>{
    let tot = 0;
    for(let m=0; m<cart.length; m++)
    {
      tot+=(cart[m].qty*cart[m].price);
    }
    return tot;
  }


   // checkout
   const checkit = async () =>{
    if(cart.length < 1)
    {
      alert("Cart is empty");
      return false;
    }
      checkout()    
   }

   const checkout = async () => {  
   

    if(!tableNumber)
    {
      alert('Please enter a table number');
      return;
    }

    setShowA(true);
    try{  
     
    const res = await fetch(
      "http://"+ipAddress+":80/amonie/index.php?r=inventory/salesapi",
      {
        method: "POST",
        headers: {
          // "Accept": "application/json, text/plain, */*", 
          "Accept": "application/json", 
          "Content-type": "application/json"
        },
        body: JSON.stringify(cart),       
       
      }
    );
  
    const data = await res.json();
    if(data.result==1){
      setShowA(false)      
      success();  
      setCart([]) ;
      setTableNumber(null);
      setComplimentary(false)
    }
    // console.log(data);
  
    }catch(error){
      console.log(error);
    }
  };

    
      const success = () =>{
  Alert.alert(
    "Order Sent!",
    "Order Successfully Placed!",
    [
      {
        text: "OK",
        // onPress: () => navigation.goBack(),
        style: "cancel",
      },
    ],
    {
      cancelable: true,
      onDismiss: () =>
        Alert.alert(
          "Success Message was dismissed by tapping outside of the alert dialog."
        ),
    }
  );
    }

const ready = async () =>{
  setComplimentary(!complimentary)
  let compliment = complimentary===true ? 0 : 1;
  const newCart =  await cart.map((car)=>{
    return {...car,compliment:compliment}
  });
  setCart(newCart) 
}

  
const ready2 = async (value) =>{
setTableNumber(value);
const newCart2 =  await cart.map((car)=>{
  return {...car,table:value}
});
setCart(newCart2) 

}


    

  return (
    <View>
      
    <ScrollView style={styles.container}>
      {cart.length > 0 ? (
        cart.map((item) => (
          
          <View style={styles.shadows} key={item.id}>
            
          
          <View style={styles.cartItem} >

          <View style={styles.named}>
           <Text style={styles.nameText}>{item.name}</Text>
          </View>
            
            <View style={styles.boss}>
              <View style={{ flexDirection: "row", marginBottom: 20 }}>
                <Text style={styles.text}>({item.qty})</Text>
                <Text style={styles.text}>
                  {cashFormat(item.price * item.qty)}
                </Text>
              </View>

              <View style={{ flexDirection: "row" }}>
                <View style={styles.pBut}>
                  <Button title="+"  onPress={() => addOn(item)} />
                </View>
                <View style={styles.mBut}>
                  <Button title="-" color="orange" onPress={(e) => Subtract(e, item)} />
                </View>

                <View style={styles.mBut}>
                  <Button title="X" color="red" onPress={(e) => Remove(e, item)} />
                </View>
              </View>
            </View>
          </View>
          
          
          </View>
          
        ))
      ) : (
        <Text style={styles.empty}>Cart is Empty!</Text>
      )}
      <View><Text style={styles.total}>Total Bill: {cashFormat(total())}</Text></View>
      <Text>Complimentary</Text>
      <CheckBox
      value={complimentary}
      onValueChange={ready}
       />
       <View><Text>Enter Table Number Below</Text></View>
       <View>
       <TextInput
          placeholder="Table Number"
          onChangeText={(e)=>{ready2(e)}}
          value={tableNumber}
          style={styles.table} 
          keyboardType={"number-pad"}
          placeholderTextColor="#000"                      
        />
       </View>
      <View>
        {showA && <MyActivityIndicator /> }
       </View>
      <TouchableOpacity style={{ marginRight: 20 }} onPress={checkit}>
      <View style={{marginBottom:40, marginTop:20}}><MyButton title="Checkout" background="black"   /></View>
       </TouchableOpacity>
       
    
    </ScrollView>


</View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  empty: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
  },
  image: {
    width: 100,
    height: 150,
    marginRight: 10,
    marginTop: 10,
    // alignSelf: "center",
  },
  cartItem: {
    // alignItems: "stretch",
    flexDirection: "column",
    flex: 1,
    alignContent: "space-between",
    alignItems: "center",
    borderColor:"grey",
    borderWidth:1,
    backgroundColor:"white",
    borderBottomEndRadius:20,
    borderTopStartRadius:20,
    // box-shadow: 5px 5px blue, 10px 10px red, 15px 15px green;
  },
  text: {
    marginLeft: 15,
    fontWeight: "bold",
    fontSize: 20,
  },
  pBut: {
    marginLeft: 15,
    fontWeight: "bold",
    fontSize: 20,
    width: 40,
    marginBottom: 10,
  },
  mBut: {
    marginLeft: 35,
    fontWeight: "bold",
    fontSize: 20,
    width: 40,
    marginBottom: 10,
  },
  boss: {
    display:"flex",
    flex: 1,
    
    // flexDirection: "row",
  },
  named:{
    flex:1,
    borderTopLeftRadius:10
    // display:"flex",
   
  },
  nameText:{
    fontSize:20,
    fontWeight:"bold",
    // marginLeft:15,
    textAlign:"left"
  },
  shadows:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    
    elevation: 5,
    marginBottom:10,   
  },
  total:{
    fontWeight:"bold",
    fontSize:20
  },
  table: {
    alignItems: "center",
    padding: 10,
    marginBottom:5,
    color:"black",
    borderColor: '#000',
    // borderLeftColor: '#000',
    borderWidth: 1,
    // borderLeftWidth: 1,
    
  },
});
