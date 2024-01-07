import React, {useState, useEffect, useContext} from 'react';
import { Text, View, Button, TextInput, StyleSheet, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Alert, StatusBar } from 'react-native';
import LoginHeader from '../components/LoginHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyButton from "../components/MyButton";
// import { AsyncStorage } from 'react-native';
import MyActivityIndicator from '../components/MyActivityIndicator';
import { UserContext } from '../components/UserContext';

const Login = ({navigation}) => {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [ipAddress,setIpAddress] = useState(''); 
    const [showA,setShowA] = useState(false) // display or hide activity indicator like loading
    const [user, setUser] = useContext(UserContext);
    const [deviceId,setDeviceId] = useState(''); 
   
    function drag()
    {
      setShowA(false)
    }

    const Cleared = () =>{
        navigation.navigate("Products");
    }

    const doIp = () =>{
      navigation.navigate("IpAddress");
    }

    useEffect(() => {
      getIp();
    }, []);

    useEffect(() => {
      drag();
    }, []);

    useEffect(() => {
      getId();
    }, []);

    
      
      // const options = {
      // method: 'POST',
      // headers: {
      // 'Content-Type': 'application/json',
      // },
      // body: JSON.stringify(update),
      // };


    const doLogin = async () => {
      // if(deviceId==null)
      // {
      //   alert('You are not authorized');
      //   return;
      // }

     
      setShowA(true);
      try{  
        let logDetails = {
          username,
          password,      
          };
      const res = await fetch(
        // "http://"+ipAddress+":80/jstore/index.php?r=site/applogin",
        "http://"+ipAddress+":80/amonie/index.php?r=site/applogin",
        {
          method: "POST",
          headers: {
            // "Accept": "application/json, text/plain, */*", 
            "Accept": "application/json", 
            "Content-type": "application/json"
          },
          body: JSON.stringify(logDetails),
          
         
        }
      );
    
      const data = await res.json();
      if(data.result==1){
        
        setShowA(false)
        let user={userId:data.userId,myUsername:data.myUsername}
        setUser(data.userId)
        storeUser(user);
        setUsername("");
        setPassword("")
        navigation.replace("Products");
      }else{
        Alert.alert(
          "Error!",
          "Wrong Username or Password!",
          [
            {
              text: "OK",
              // onPress: () => navigation.goBack(),
              style: "cancel",
            },
          ],
          {
            cancelable: false,
            onDismiss: () =>
              Alert.alert(
                "Error alert was dismissed by tapping outside of the alert dialog."
              ),
          }
        );
       setShowA(false) ;
      }
    
      }catch(error){
        console.log(error);
      }
    };

    const storeUser = async (value) => {
      try {        
        await AsyncStorage.setItem('@posid',
          value.userId
        );
        await AsyncStorage.setItem('@posname',
          value.myUsername
        );
      } catch (error) {
        console.log(error);
      }
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


    const getId = async () => {
      try {
        const value = await AsyncStorage.getItem('@posdeviceid');
        if (value !== null) {
          // We have data!!
          setDeviceId(value);
        }
      } catch (error) {
        // Error retrieving data
      }
    };

    StatusBar.setHidden(true, 'none');
  return (
    <>
     <StatusBar hidden={true} />
     <StatusBar hidden />
     <StatusBar  backgroundColor={'#ffffff00'} />
    {/* <KeyboardAvoidingView> */}
     <ImageBackground source={require("../assets/bc/back2.jpg")} style={styles.image}>
    <View style={styles.container}>
      
    {/* <LoginHeader /> */}
    <Text style={styles.title}>XSALE</Text>
    <View style={styles.holder}>    

    <Text style={styles.header}>Login</Text>
    {showA===true && <MyActivityIndicator />}
    <View>
        <TextInput
          placeholder="Enter Username"
          onChangeText={text => setUsername(text)}
          value={username}
          style={styles.username}                 
          placeholderTextColor="#000" 
                     
        />
      </View>
      
    <View >
        <TextInput
          placeholder="Enter Password"
          onChangeText={text => setPassword(text)}
          value={password}
          secureTextEntry={true}          
          style={styles.username}  
          placeholderTextColor="#000"   
        />
      </View>      
      
    <View style={{marginTop:30}}><Button title="Login" color="#CC2912" onPress={doLogin} ></Button></View>
    </View>
    <TouchableOpacity onPress={() => doIp()}>
      
    <View style={{marginTop:30, color:"#CC2912"}}><MyButton title="Set Ip Address"  /></View>
    </TouchableOpacity>
    
    </View>
    </ImageBackground>
    {/* </KeyboardAvoidingView> */}
    </>
  )
}

export default Login;

const styles = StyleSheet.create({
    container: {
      // marginTop:0,
      // padding: 10,
      // backgroundColor:"#3E53C8",
      // backgroundColor:"#F16B1F",
      flex:1
    },
    username: {
      alignItems: "center",
      padding: 10,
      marginBottom:5,
      color:"black",
      borderColor: '#fff',
      borderWidth: 1,
      backgroundColor:"white",
      opacity:.8
      
    },
    holder:{
      // backgroundColor:"#F16B1F",
      padding:20,
      marginTop:"10%"      
    },
    header:{
      color:"#F16B1F",
      fontSize:30,
      fontWeight:"bold",
      textAlign:"center",
      marginBottom:30
    },
    title:{
      marginTop:"20%",
      color:"#ffffff",
      fontSize:30,
      fontWeight:"bold",
      textAlign:"center",
      marginBottom:10
    },
    image:{
      width:"100%",
      height:"100%",
      
    }
  });