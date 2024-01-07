import React from 'react'
import {Text, View, StyleSheet} from 'react-native';
const MyButton = ({title,background}) => {
  return (
    <View style={styles.button}><Text style={styles.text}>{title}</Text></View>
  )
}

export default MyButton

const styles = StyleSheet.create({
    button:{
        backgroundColor:"#D35400",       
        padding:10,
        borderRadius:10, 
             
    },
    text:{
        color:"white",
        textAlign:"center"  
    }
})