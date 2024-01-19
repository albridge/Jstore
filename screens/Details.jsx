import React, {useState, useEffect, useLayoutEffect, useContext } from 'react'
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
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyActivityIndicator from "../components/MyActivityIndicator";
import { UserContext } from "../components/UserContext";
import DetailsCard from '../components/DetailsCard';
import MyButton from '../components/MyButton';


  

const Details = ({navigation,route}) => {
    

    
    const [ipAddress,setIpAddress] = useState(null); 
    const [showA,setShowA] = useState(true)
    const [user, setuser] = useContext(UserContext);
    const [detail, setDetail] = useState([]);
    const [did, setDid] = useState(null);
    const [directory,setDirectory] = useState('');

    const { deal } = route.params;    
    let {id} =  route.params;  

    const getTotal = () => {
      return deal[0].total;
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

      useEffect(() => {  
        if(directory)
        {
          getIp();
        }
      }, [directory]);

      

     

    const getDetails = async () => {
       
        if(ipAddress!==null){
           
        try{  
         setShowA(true)
         
        
        const res = await fetch(
          "http://"+ipAddress+":80/"+directory+"/index.php?r=inventory/details&id="+id,
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
    
        setDetail(data);
        
        setShowA(false);
       
        }catch(error){
          console.log(error);
        }
      }
      };

      useEffect(() => {  
        getDetails();
      }, [ipAddress]);

      useEffect(() => {  
        getDirectory();
      }, []);

      
      const storeAddon = async (id) => {
      try {        
        await AsyncStorage.setItem('@orderId',
          id
        );      
      } catch (error) {
        console.log(error);
      }
    };

    const startAddon = (id) =>{
     storeAddon(id)
    console.log(id)

    getTid();
    navigation.navigate('Store')
    }

    const getTid = async () => {
      try {
        const value = await AsyncStorage.getItem('@orderId');
        if (value !== null) {
        //  console.log("value",value);
        }else{
          console.log('transactio id not found')
        }
      } catch (error) {
        // Error retrieving data
        console.log('no transaction id')
      }
    };

    const cashFormat = (cash) => {
      return cash.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
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


  return (
    <>
    <View>
        <Text style={{fontWeight:"bold", fontSize:24, textAlign:"center", paddingBottom:20, paddingTop:20}}>Order Details</Text>
    </View>

    <SafeAreaView style={{flex:1}}> 
    
    {showA===true  ? <View style={{marginTop:100}}><MyActivityIndicator /></View> : 
          
          <FlatList
            // numColumns={2}
            data={detail}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (             
                        
              <DetailsCard item_name={item.item_name} qty={item.qty} />              
               
            )}
            // ListFooterComponent={<View />}
            ListFooterComponent={() => 
               <>
            
            <View style={{marginTop:20}}>
              {/* <TouchableOpacity onPress={()=>startAddon(detail[0].transaction_id)}>
            <MyButton title="Add to Order"/>
            </TouchableOpacity> */}
            </View>
            </>
            
            
        }

        ListHeaderComponent={() => 
          <>
       
       <View style={{padding:15}}>
       <Text>ID: {detail[0].transaction_id}</Text>
       <Text>Table: {detail[0].table_number}</Text>
       <Text>Order Value: {detail[0].total}</Text>
       </View>
       </>
       
       
   }
            // ListFooterComponentStyle={{ textAlign:"center" }}
          /> 
          
          }

    </SafeAreaView>
    </>
  )
}

export default Details

const styles = StyleSheet.create({
    container: {
      margin: 10,
    } ,
    
    button:{
      borderRadius:10,
    },
    listFooter:{
        textAlign:"center"
    }
    
  });