import React, {useState, useEffect} from 'react'
import {View, Text, TextInput, StyleSheet, Button, Alert, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
var FormData = require('form-data');



const IpAddress = ({navigation}) => {
    const [ip,setIpAddress] = useState('');
    const [directory,setDirectory] = useState('');
    const [deviceId,setDeviceId] = useState('');    

    const getIp = async () => {
        try {
          const value = await AsyncStorage.getItem('@posipaddress');
          if (value !== null) {
            // We have data!!
            setIpAddress(value);
          }
        } catch (error) {
          // Error retrieving data
          alert('Ip not yet set')
        }
      };

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

    useEffect(() => {
        getIp();
      }, []);


      useEffect(() => {
        getDirectory();
      }, []);

      useEffect(() => {
        getId();
      }, []);

    const saveIp = async () => {
       
        try {        
          await AsyncStorage.setItem('@posipaddress',
            ip
          );  
          setIpAddress("");
          showAlert()
        } catch (error) {
          console.log(error);
        }
      }; 
      
      const saveId = async () => {
       
        try {        
          await AsyncStorage.setItem('@posdeviceid',
            deviceId
          );                   
         alert('Done! Now request Authorization')
        } catch (error) {
          console.log(error);
        }
      }; 
      
       // set app directory
       

       const saveDirectory = async () => {
       
        try {        
          await AsyncStorage.setItem('@posdirectory',
            directory
          );  
          setDirectory("");
          showAlertD()
        } catch (error) {
          console.log(error);
        }
      };

      const showAlert = () =>
  Alert.alert(
    "Ip Update",
    "Your connection IP Address was successfully updated!",
    [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
        style: "cancel",
      },
    ],
    {
      cancelable: true,
      onDismiss: () =>
        Alert.alert(
          "This alert was dismissed by tapping outside of the alert dialog."
        ),
    }
  );

  const showAlertD = () =>
  Alert.alert(
    "Directory Update",
    "Your directory name was successfully updated!",
    [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
        style: "cancel",
      },
    ],
    {
      cancelable: true,
      onDismiss: () =>
        Alert.alert(
          "This alert was dismissed by tapping outside of the alert dialog."
        ),
    }
  );

  // save device id
  const doSaveId = async () => {
   
    try{  
      
      const form = new FormData();
       
      
      let deviceDetails = {
        device:deviceId           
        };

        form.append( 'ob_data',  JSON.stringify(deviceDetails  ))
    const res = await fetch(      
      "http://"+ip+":80/amonie/index.php?r=site/savedevice",
      {
        method: "POST",
        headers: {
          
          // "Accept": "application/json", 
          // "Content-type": "application/json"
          'Content-Type':'multipart/form-data'
        },
        body: form,
        
       
      }
    );
  
    const data = await res.json();

    if(data.result==2){      
      // alert('There was a problem')      ;
      alert(data.message)
    } else if(data.result==3){
      alert('Device id already exists. Please Enter a different Id');
    
    }else{
      Alert.alert(
        "Success!",
        "Device authorized and Details saved!",
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

    }
  
    }catch(error){
      // console.log(error);
      alert(error);
    }
  };

  // test get request
  const getPerson = async () => {
    if(ip!==null){
    try{  
      // let person = {age:7}
      let person = 10;
    
    const res = await fetch(
      "http://"+ip+":80/amonie/index.php?r=inventory/person&user="+person,
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

  console.log(data)
   
    }catch(error){
      console.log(error);
    }
  }
  };
  return (
    <View style={styles.container}>
      <ScrollView>
      <View style={styles.boxed}>
      
    <View><Text style={{fontWeight:"bold",fontSize:40, color:"#fff"}}>IpAddress</Text></View>
    <View>
        <TextInput
          placeholder="Enter ipAddress"
          onChangeText={text => setIpAddress(text)}
          value={ip}
          style={styles.username} 
          placeholderTextColor="#fff" 
                     
        />
        </View>
        <View><Text style={{fontSize:30, color:"white"}}>{ip}</Text></View>
        <View><Button title="Save Ip" onPress={saveIp} /></View>
        <View style={{height:50}}></View>
        <View>
        <TextInput
          placeholder="Enter Directory"
          onChangeText={text => setDirectory(text)}
          value={directory}
          style={styles.username} 
          placeholderTextColor="#fff" 
                     
        />
        </View>
        <View><Button title="Save Directory" onPress={saveDirectory} /></View>
        {/* <View><Text style={{fontSize:30, color:"white"}}>{directory}</Text></View> */}
        <View style={{height:50}}></View>
        <View>
        {/* {(!deviceId ?
        <TextInput
          placeholder="Enter Device ID"
          onChangeText={text => setDeviceId(text)}
          value={deviceId}
          style={styles.username} 
          placeholderTextColor="#fff" 
          keyboardType = 'number-pad'
                     
        /> : <Text></Text>)} */}


        <TextInput
          placeholder="Enter Device ID"
          onChangeText={text => setDeviceId(text)}
          value={deviceId}
          style={styles.username} 
          placeholderTextColor="#fff" 
          keyboardType = 'number-pad'
                     
        /> 
        </View>
        {/* {(deviceId ? <Text></Text> : <View><Button title="Save Device ID" onPress={saveId} /></View>) } */}
      <View><Button title="Save Device ID" onPress={saveId} /></View>
        {/* <View><Text style={{fontSize:30, color:"white"}}>{deviceId}</Text></View> */}
        <View style={{height:50}}></View>
        <View><Button title="Request Device Authorization" onPress={doSaveId} color="red" /></View>
        <View style={{height:50}}></View>
        {/* <View><Button title="Get Person" onPress={getPerson} color="green" /></View> */}
        
      </View>
      </ScrollView>
      </View>


  )
}

export default IpAddress

const styles = StyleSheet.create({
    container: {
      paddingTop: 60,
      backgroundColor:"#3E53C8",
      flex:1
    },
    boxed:{
        margin:20, height:"100%", marginBottom:100
    },
    username: {
        alignItems: "center",
        padding: 10,
        marginBottom:5,
        color:"white",
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
        
      },

  });
  