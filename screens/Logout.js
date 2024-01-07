import React, {useEffect, useContext} from 'react'
import { Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartContext } from "./CartContext";

const Logout = ({navigation}) => {
    const [cart, setCart] = useContext(CartContext);
    
  
  const cleanUp = async (value) => {
    try {        
      await AsyncStorage.removeItem('@posid');
      await AsyncStorage.removeItem('@posname');
      // await AsyncStorage.removeItem('@posdeviceid');
      setCart([]);
      navigation.replace("Login")
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    cleanUp();
  }, []);

  return (
    <>
    {/* <View>
      <Text>You are logged out</Text>
    </View>
    <View><Text>Login again</Text></View> */}
    </>
  )
}

export default Logout