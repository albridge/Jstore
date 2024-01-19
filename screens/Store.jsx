import React, { useState, useEffect, useLayoutEffect, useContext } from "react";
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

import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { AntDesign } from "@expo/vector-icons";
// import AntDesign from '@expo/vector-icons/AntDesign';
import { CartContext } from "./CartContext";
import MyButton from "../components/MyButton";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyActivityIndicator from "../components/MyActivityIndicator";
import { UserContext } from "../components/UserContext";
import { Ionicons } from '@expo/vector-icons';
const Store = ({ navigation }) => {
  const [cart, setCart] = useContext(CartContext);
  const [ipAddress,setIpAddress] = useState(null); 
  const [tid,setTid] = useState(null); 
  const [counts,setCounts] = useState([]); 
  

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 20 }} onPress={toCart}>
          <AntDesign name="shoppingcart" size={24} color="white" />
          {/* <Ionicons name="ios-pizza" color="black" size={20} /> */}
        </TouchableOpacity>
      ),
    });
  }, []);

  const [stock, setStock] = useState();
  const [broadCategory, setBroadCategory] = useState([]);
  const [category, setCategory] = useState([]);
  const [menu, setMenu] = useState([]);
  const [loggedInId,setLoggedInId] = useState('');
  const [loggedInUser,setLoggedInUser] = useState('');
  const [showA,setShowA] = useState(true)
  const [user, setuser] = useContext(UserContext);
  const [directory,setDirectory] = useState('');



  const buildCount = () =>{
    if(cart.length>0)
    {
      cart.map((b)=>{
        if(b.value>0)
        {
          setCounts([...counts,{key:b.id,value:b.qty}])
        }
      })
      // console.log(counts)
    }
    // console.log('building')
  }

 // i would have and can still put getbroadcategory straight inside useeffect but i did it like this to test the activity indicator with the settimeout



useEffect(() => {
  if(ipAddress && directory)
  {
    getBroadCategory();
  }
}, [ipAddress,directory])


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
  const toProfile = () =>{
    navigation.navigate("Profile")
  }

  const freeCount = () =>{
    if(cart.length<1)
    {
      setCounts([])
    }
  }
//
  const getBroadCategory = async () => {
  
    if(ipAddress!=null && directory!=null){
    try{  
     setShowA(true)
    const res = await fetch(
      "http://"+ipAddress+":80/"+directory+"/index.php?r=inventory/categories",
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
    setBroadCategory(data);
    setCategory([]);
    setMenu([]);
    setShowA(false);
    }catch(error){
      console.log(error);
    }
  }
  };

  // get category

  const getCategory = async (id) => {
    setShowA(true);
    try{
    const res = await fetch(
      "http://"+ipAddress+":80/"+directory+"/index.php?r=inventory/categories2&id="+id,
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
  
    setCategory(data);
    setMenu([]);
    setShowA(false);
    }catch(error){
      console.log(error);
    }
  };

  const saveToCart = (data) => {

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
    // console.log(cart)
  };

  const toCart = () => {
    navigation.navigate("Cart", { items: { cart } });
   
  };

  const getMenu = (id) => {
    navigation.navigate("Ordering", { id: { id } });
   
  };

  const Subtract = (item) => {
  
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

    setCart(cart.filter((car) => item.id !== car.id));
  };

  const cashFormat = (cash) => {
    return cash.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
  };


  const getMenu2 = async (id) => {
    // buildCount()
    setShowA(true)
    try{
    const res = await fetch(
      "http://"+ipAddress+":80/"+directory+"/index.php?r=inventory/menu&id="+id,
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
      setCategory([]);
    setMenu(data);
  setShowA(false)
    }catch(error){
      console.log(error);
    }
  };
 


  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('@posid');
      const used = await AsyncStorage.getItem('@posname');
      if (value !== null) {       
        setLoggedInId(value);
        setLoggedInUser(used);
      }else{
        console.log('not working')
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  // useEffect(() => {
  //  if(directory){
  //   getIp(); 
  //  } 
  // }, []);




  const getTid = async () => {
    try {
      const value = await AsyncStorage.getItem('@orderId');
      if (value !== null) {
      //  console.log("value",value);
      setTid(value)
      // setTid(tid => (tid, value));
      }else{
        console.log('transaction id not found')
      }
    } catch (error) {
      // Error retrieving data
   
      console.log('no transaction id')
    }
  };




// this function is no longer in use. remove this comment if you decide to start using
const getCount = (id) =>{
  id = parseInt(id)
  let target = counts.find((x) =>x.key === id);
  if(target){    
    return target.value;
  }else{ 
    return null 
  }
}




const cartCount = (id) =>{ 
  const exist = cart.find((x) =>x.id == id);
  if(exist)  {
    return(exist.qty);
  }else{
    return 0;
  }
}

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



useEffect(() => {
  setCart(cart);    
}, [cart]);

useEffect(()=>{
  // buildCount()   ;
},[])

useEffect(() => {
  retrieveData();
}, []);

useEffect(() => {
  freeCount();
}, [cart]);


  return (
   
    
<>
<SafeAreaView style={{flex:1}}> 
<View>  
 
<Text style={styles.topHead}>Logged in as {loggedInUser!==null && loggedInUser} </Text> 
       
     
       <Text style={styles.topHead}> {cart.length} Items in Cart</Text> 
</View>    
<View style={styles.top}> 
     
        
          
        {        

          <ScrollView horizontal={true} >
            
          {/* {showA && <MyActivityIndicator />} */}
          {broadCategory.map((item) =>
          
           <View  key={item.id} style={styles.items}>   
           <TouchableOpacity onPress={() => getCategory(item.id)}>         

<Image
              style={styles.broadCategory}
              // resizeMode="contain"
              source={{ uri: "http://"+ipAddress+":80/amonie/assets/bc/"+item.photo }}
            />
          
              
              </TouchableOpacity>      
            </View>           

          )}
           
        </ScrollView>

        }          
        </View>

<View style={styles.container}>
  <View style={styles.inContainer}>
        <View style={{flex:1}}>
        {!category && <MyActivityIndicator />}
          {category!==null &&
          <View>
          
          {showA===true  ? <View style={{marginTop:100}}><MyActivityIndicator /></View> : 
          <FlatList
            // numColumns={2}
            data={category}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              
              <TouchableOpacity onPress={() => getMenu2(item.id)}> 
              <View style={ styles.cathold }>                           
                <Text style={styles.cat}>{(item.cat).toUpperCase()}</Text>
                <AntDesign style={{}} name="play" size={24} color="black" />
              </View>
              </TouchableOpacity>  
               
            )}
            ListFooterComponent={<View />}
            ListFooterComponentStyle={{ height: 20 }}
          /> }
          </View>

          
        }
       
        
        {category!==null &&
        <View>
        
        <FlatList
          // numColumns={2}
          data={menu}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            
            // #F16B1F
            <View style={ styles.cathold }>              
              <Text style={styles.catMenu}>{item.name}</Text>
              <Text style={styles.catMenu}>{cartCount(item.id)} </Text>
              <TouchableOpacity onPress={() => saveToCart(item)}> 
              <AntDesign name="pluscircle" size={30} color="black" />
              </TouchableOpacity>
              <View style={{width:30}}></View>
              <TouchableOpacity onPress={() => Subtract(item)}> 
              <AntDesign name="minuscircle" size={30} color="#F16B1F" />
              </TouchableOpacity>
            </View>
           
          )}
          ListFooterComponent={<View />}
          ListFooterComponentStyle={{ height: 20 }}
        />
        </View>
      }
      </View>
       </View>
     
    </View>
    </SafeAreaView>
     </>
  );
};

export default Store;

const styles = StyleSheet.create({
  container: {
    flex:1,
    // margin: 10,
    backgroundColor:"#F16B1F",
    
  },
  inContainer:{ 
    backgroundColor:"white",
    flex:1,
    padding:10
  },
  items:{   
    padding:10
  },
  top:{    
    alignContent:"space-around",
    alignItems:"center" , 
    backgroundColor:"#F16B1F",
    // backgroundColor:"#F0E0D7",
    color:"black",
    paddingBottom:10,
    paddingTop:10,
    marginTop:2
  },
  cat:{
    padding:20,
    // backgroundColor:"#6675C8",
    backgroundColor:"white",
    // color:"white",
    marginTop:10,
    display:"flex",
    flex:1,
    
    fontWeight:"bold"
  },
  cathold:{
    // borderRadius:20,  
    paddingRight:30,    
    display:"flex",
    flex:1,
    justifyContent:"space-between",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    marginBottom:5,
    backgroundColor:"white",

  },
  catMenu:{
    padding:20,
    // backgroundColor:"#6C3483",
    
    // color:"white",  
    display:"flex",
    flex:1,   
    fontWeight:"bold"
  },
  image: {
    width: 150,
    height: 100,
    marginRight: 10,
    marginTop: 10,
    backgroundColor:"#ffffff",
    
    
    // alignSelf: "center",
  },
  broadCategory:{
    width:150,
    height:100, 
    borderRadius:10,  
    borderWidth: 5,
    // borderColor: "white",
    borderWidth: 5,
    borderColor: "white"
   
  },
  topHead:{        
    textAlign:"center",
    fontSize:16,
    fontWeight:"bold",
    color:"black",    
  }


});
