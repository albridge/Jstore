import React from 'react'
import {
  StyleSheet,
  Text,
  View
 
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

const Card = ({item_name,icon}) => {
  return (
<View style={styles.holder}>
  <View style={styles.singleHolder}> 
             
    <Text>{item_name}</Text>                                  
    
    <AntDesign name={icon} size={24} color="#F16B1F" />              

  </View>
</View>
  )
}

export default Card

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
    // backgroundColor:"#FAFBFC"
    backgroundColor:"#ffffff",
  }
});