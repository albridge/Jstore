import React from 'react'
import {
  StyleSheet,
  Text,
  View
 
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from '@expo/vector-icons';


const CartCard = ({item_name,qty,price,item,add,sub,rem}) => {
    const cashFormat = (cash) => {
        return cash.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
      };
  return (
<View style={styles.holder}>
  <View style={styles.singleHolder}>              
    <Text style={{fontWeight:"bold", fontSize:16}}>{item_name.toUpperCase()}</Text>
    {/* <Ionicons name="ios-trash-bin" size={24} color="#F16B1F" onPress={(e) => rem(e, item)} /> */}
        
  </View>

  <View style={styles.singleHolder}>              
   
    <AntDesign name="pluscircle" size={24} color="black" onPress={() => add(item)} />
    <AntDesign name="minuscircle" size={24} color="black" onPress={(e) => sub(e, item)} />
      
    <Ionicons name="ios-trash-bin" size={24} color="#F16B1F" onPress={(e) => rem(e, item)} />
  </View>
  

  <View style={styles.singleHolder}>              
    <Text style={{fontWeight:"bold"}}>Line Total</Text>
    <Text>{'@ '+qty+ 'x' +price}</Text>
       
    <Text>{cashFormat(item.price * item.qty)}</Text>     
  </View>
</View>
  )
}

export default CartCard

const styles = StyleSheet.create({

  singleHolder:{     
    // marginTop:5,
    // marginBottom:5,
    elevation:3,
    backgroundColor:"white",
    padding:10,  
    paddingTop:10,
    paddingBottom:15, 
    display:"flex",
    flex:1,
    flexDirection: "row",
    justifyContent:"space-between",
    
    
  },
  holder:{
    
    padding:5,
    marginStart:5,
    marginEnd:5,
    // backgroundColor:"#FAFBFC"
    backgroundColor:"#F16B1F",
  }
});