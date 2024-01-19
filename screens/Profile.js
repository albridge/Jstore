import React from 'react'
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, LogBox, TouchableOpacity } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-datepicker'
import MyPicker from '../components/MyPicker';
import MyButton from "../components/MyButton";
import { Animated, Button } from 'react-native';
import Today from './Today';

const Profile = ({navigation}) => {

  // const [animatePress, setAnimatePress] = useState(new Animated.Value(1))
  

  const [date, setDate] = useState(new Date(1598051730000));
  const [FromDate, setFromDate] = useState(new Date(1598051730000));

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showDatepicker2 = () => {
    showMode('fromDate');
  };

  const showTimepicker = () => {
    showMode('time');
  };


  // pull todays sales

const todays = async () => { 

  // setShowA(true);
  // datas = {
  //   user_data : user;
  // }
  try{  
   
  const res = await fetch(
    "http://"+ipAddress+":80/amonie/index.php?r=inventory/todays",
    {
      method: "POST",
      headers: {
        // "Accept": "application/json, text/plain, */*", 
        "Accept": "application/json", 
        "Content-type": "application/json"
      },
      body: JSON.stringify(datas),       
     
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


const toToday = () =>{ 
  // navigation.replace('Today');
  // navigation.replace('Today');
  // navigation.push('Today');
  navigation.navigate('Today');
  // navigation.pop('Today');
}



  return (
    <>   
    {/* <View> */}
      {/* <Button onPress={showDatepicker} title="From" /> */}
      {/* <Button onPress={showDatepicker2} title="From" /> */}
      {/* <Button onPress={showTimepicker} title="Show time picker!" /> */}
      {/* <Text>selected: {date.toLocaleString()}</Text> */}
    {/* </View> */}

    {/* <View><Text>Options</Text></View> */}

    <View style={styles.bars}>
    <TouchableOpacity onPress={toToday}>
      <MyButton title="Todays Sales" style={styles.button} onPress={toToday} /> 
     </TouchableOpacity>
      {/* <Button title="Sales" color="#566573" style={styles.button} onPress={toToday} /> */}
    </View>

    <View style={styles.bars}>

    </View>
    </>
  )
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    margin: 10,
  } ,
  bars:{
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-evenly",
    marginTop:20
  },
  button:{
    borderRadius:10,
  }
});