import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Button,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  FlatList,
  TextInput,
  KeyboardAvoidingView,  
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
import CartCard from "../components/CartCard";
import { SelectList } from "react-native-dropdown-select-list";
// import { Dropdown } from 'react-native-material-dropdown-v2-fixed';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';


const Cart = ({ navigation, route }) => {
  const [cart, setCart] = useContext(CartContext);
  const [user, setuser] = useContext(UserContext);
  const [showA,setShowA] = useState(false)
  const [ipAddress,setIpAddress] = useState(null); 
  const [complimentary, setComplimentary] = useState(false);
  const [tableNumber, setTableNumber] = useState();
  const [tid, setTid] = useState(null); // didnt work. will reviseit
  const [todaysList, setList] = useState(null);
  const [selectedList, setSelectedList] = useState(null); // holds sorted runcat data
  const [selected, setSelected] = React.useState(""); // used by dropdownlist extension
  
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [showD, setShowD] = useState(false);
  const [counts,setCounts] = useState([]);
  const [deviceId,setDeviceId] = useState(''); 
  const [directory,setDirectory] = useState('');
  const [showButton, setShowButton] = useState(true)
  //   const { items } = route.params;
  //   console.log("inside cart", cart);



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


 

  const Subtract = (e, item) => {
    let data = item;
    let nItem = null;
    // counting(item.id)
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
    // counting(data.id)
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

  let runCat =  () =>{
    showD ? setShowD(false) : setShowD(true)
   
    let myData = [];       
  
    for(let x=0; x<todaysList.length; x++)
    {
      myData[x]={"key":todaysList[x].transaction_id,"value":todaysList[x].transaction_id+'-'+todaysList[x].table_number}
      // myData.push({"key":todaysList[x].transaction_id,"value":todaysList[x].transaction_id+'-'+todaysList[x].table_number+'-'+todaysList[x].staff})
   
    }
    myData[myData.length+1]={"key":1,"value":"None"}
   
 setSelectedList(myData) 

  }


// for value without key or label defination
//   let runCat =  () =>{
//     let myData = [];       
  
//     for(let x=0; x<todaysList.length; x++)
//     {
//       myData[x]={"value":todaysList[x].transaction_id+'-'+todaysList[x].table_number}
//       // myData.push({"key":todaysList[x].transaction_id,"value":todaysList[x].transaction_id+'-'+todaysList[x].table_number+'-'+todaysList[x].staff})
   
//     }
//     myData[myData.length+1]={"value":"None"}
   
//  setSelectedList(myData) 

//   }


// for dropdown 
//   let runCat =  () =>{
//     let myData = [];       
  
//     for(let x=0; x<todaysList.length; x++)
//     {
//       // myData[x]={"label":todaysList[x].transaction_id,"value":todaysList[x].transaction_id+'-'+todaysList[x].table_number}
//       myData[x]={"label":todaysList[x].transaction_id+'-'+todaysList[x].table_number,"value":todaysList[x].transaction_id}
//       // myData.push({"label":todaysList[x].transaction_id,"value":todaysList[x].transaction_id+'-'+todaysList[x].table_number+'-'+todaysList[x].staff})
   
//     }
//     myData[myData.length+1]={"label":"None","value":1}
   
//  setSelectedList(myData) 

//   }



   // checkout
   const checkit = async () =>{
    if(cart.length < 1)
    {
      alert("Cart is empty");
      return false;
    }
  
    isAddon();
    isSale();
    
      checkout()  ; 
   }

   const checkout = async () => {  
  //  return;
    // console.log(directory,ipAddress); return;
    let load = isDiv();
    if(!tableNumber)
    {
      alert('Please enter a table number');
      return;
    }

    setShowA(true);
    try{  
     
    const res = await fetch(
      "http://"+ipAddress+":80/"+directory+"/index.php?r=inventory/salesapi",
      {
        method: "POST",
        headers: {
          // "Accept": "application/json, text/plain, */*", 
          "Accept": "application/json", 
          "Content-type": "application/json"
        },
        body: JSON.stringify(load),       
       
      }
    );
  
    const data = await res.json();
    if(data.result==1){
      setShowA(false)      
      success();  
      setCart([]) ;
      setTableNumber(null);
      setComplimentary(false)
      setSelected("");
      setSelectedList(null)
      getToday();      
    }else if(data.result==5){
      alert('This device is registered but not approved by admin. Please contact admin');
      return;
    }else if(data.result==8){
      alert('Selected table is still currently occupied. Please chose another table number');
      return;
    }else if(data.result==9){
      // alert(data.message);
      console.log(data.message)
      return;
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
      cancelable: false,
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


const isSale = async () =>{  
  const newCart3 =  await cart.map((car)=>{
   
    return {...car,tosale:tid}
  });
  setCart(newCart3) 
  
  }



  const isAddon = async () =>{  
    const newCart4 =  await cart.map((car)=>{
      return {...car,addon:selected}
    });
    setCart(newCart4) 
    
    }



      const isDiv =  () =>{  
        const newCart5 =   cart.map((car)=>{
         
          return {...car,divid:deviceId}
        });
       return newCart5; 
        
        }


const getTid = async () => {
  try {
    const value = await AsyncStorage.getItem('@orderId');
    if (value !== null) {
    setTid(value)
    //  console.log("value in cart",value);
    }else{
      console.log('transaction id not found')
    }
  } catch (error) {
    // Error retrieving data
    console.log('there was an error')
  }
};

// get todadys sales

const getToday = async () => {
  
  if(ipAddress!==null){
  try{  
   setShowA(true)
  const res = await fetch(
    "http://"+ipAddress+"/"+directory+"/index.php?r=inventory/todays&user="+user,
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
  setList(data,[runCat])
  // setMyOrders(data);
// {data && setList(data,[runCat])
 
  // const sing = () =>{
  //   console.log('singing')
  // } 

  setShowA(false);
// }
  }catch(error){
    console.log(error);
  }
}
};
    


const renderLabel = () => {
  if (value || isFocus) {
    return (
      <Text style={[styles.label, isFocus && { color: 'blue' }]}>
        Dropdown label
      </Text>
    );
  }
  return null;
};

const doCancel = () =>{
  
  setShowA(true)
  setCart([]);
  setShowA(false)
  setCounts([])
}

const cancelCart = () => {
  
  Alert.alert(
    "Warning!",
    "Cancel Order?",
    [
      {
        text: "Yes",
        onPress: () => doCancel(),
        style: "cancel",
      },
      {
        text: "No",
        // onPress: () => doCancel(),
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

// const counting = (id) =>{ 
//   id = parseInt(id)
//   const exist = counts.find((x) =>x.key === id);
//   if (exist) {    
//     setCounts(
//       counts.map((x) =>
//         x.key === id ? { ...exist, value: (exist.value += 1) } : x
//       )
//     );
//   } else {
//     setCounts([...counts,  {key:id,value: 1 }]);
//   }
//   console.log(counts)
// }

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


useEffect(() => {    
  getDirectory();     
}, []);

useEffect(() => {
if(directory){
  getIp();
}  
}, [directory]);

// useEffect(() => {
//   getTid();  
// }, [tid]);

useEffect(() => {
getToday();  
}, [ipAddress]);



useEffect(() => {
getId();   
}, []);

useEffect(()=>{
setCart(cart)   ;
},[cart])
  return (
    <SafeAreaView style={{flex:1, marginTop:20}}> 
    <View style={{marginLeft:10, marginRight:10, marginBottom:10}}>
   <Button title="Cancel Order" onPress={cancelCart} color="black" />
   </View>
 
   {showButton && 
   <View style={{marginEnd:10,marginStart:10}}>
   <Button title="Add to Existing Order" color="#349B2F" onPress={runCat} />
   </View>}
   {showD &&
   selectedList && <View style={{marginEnd:10,marginStart:10, marginBottom:23}}><SelectList
    setSelected = {(val) => setSelected(val)}
    data={selectedList}
    save="key"
    onSelect={isAddon}    
    />
   
    </View>
   }

    {showA  ? <View style={{marginTop:100}}><MyActivityIndicator /></View> : '' }
    {cart.length > 0 ? (
          <FlatList
            // numColumns={2}
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (             
                        
              <CartCard item_name={item.name} qty={item.qty} price={item.price} sub={Subtract} add={addOn} rem={Remove} item={item} />              
               
            )}          
  
           
            
          /> 

          ) : (
            <Text style={styles.empty}>Cart is Empty!</Text>
          )}
          
         

<>
             
               <View style={{marginLeft:10, marginRight:10}}>
               <View style={{marginTop:10}} ><Text>Enter Table Number Below</Text></View>
       <View>
       <TextInput
          placeholder="Table Number"
          onChangeText={(e)=>{ready2(e)}}
          value={tableNumber}
          style={styles.table} 
          keyboardType={"default"}
          placeholderTextColor="#000"                      
        />
       </View>
            <View><Text style={styles.total}>Total Bill: {cashFormat(total())}</Text></View>

 
            <View style={{marginTop:5}}></View>
            <TouchableOpacity onPress={checkit}>
            <MyButton title="Checkout" />
            </TouchableOpacity>
            {/* <View style={{marginTop:10}}></View> */}
            
            {/* <TouchableOpacity onPress={cancelCart}>
            <MyButton title="Cancel Order" />
            </TouchableOpacity> */}
           
            <View style={{marginBottom:20}}></View>
            </View>
            
            </>
            
    </SafeAreaView>
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
    marginTop:10,
    fontWeight:"bold",
    fontSize:16,
    textAlign:"center"
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
  ListFooter:{
    marginTop:10
  }
});
