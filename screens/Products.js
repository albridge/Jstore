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
} from "react-native";

import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { AntDesign } from "@expo/vector-icons";
import { CartContext } from "./CartContext";

const Products = ({ navigation }) => {
  const [cart, setCart] = useContext(CartContext);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 20 }} onPress={toCart}>
          <AntDesign name="shoppingcart" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const [stock, setStock] = useState();
  // const [cart, setCart] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    setCart(cart);
  }, [cart]);

  const toProfile = () =>{
    navigation.navigate("Profile")
  }


  const getProducts = async () => {
    try{
    // const res = await fetch("http://192.168.43.139:80/jstore/products.php", {
    const res = await fetch(
      "http://192.168.43.139:80/amonie/index.php?r=inventory/products",
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

    setStock(data);
  
    }catch(error){
      console.log(error);
    }
  };

  const saveToCart = (data) => {
    //   cart.map((c) => {
    //     let car = c.id === data.id ? { ...c, qty: c.qty++ } : { ...c, qty: 1 };
    //   });
    //   setCart(car);
    //   console.log(car);

    const exist = cart.find((x) => x.id === data.id);
    if (exist) {
      setCart(
        cart.map((x) =>
          x.id === data.id ? { ...exist, qty: (exist.qty += 1) } : x
        )
      );
    } else {
      setCart([...cart, { ...data, qty: 1 }]);
    }

  };

  const toCart = () => {
    navigation.navigate("Cart", { items: { cart } });
   
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
      setCart([...cart, { ...data, qty: 1 }]);
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

  return (
    <View style={styles.container}>
      <View style={styles.hold}>
        {/* {cart.length > 0 &&
          cart.map((ca) => (
            <View
              key={ca.id}
              style={{
                flexDirection: "row",
                width: "100%",
              }}
            >
              <Image
                style={{ width: 50, height: 70 }}
                source={{
                  uri: ca.photo,
                }}
              />
              <Text
                style={{
                  textAlign: "center",
                  alignSelf: "center",
                  marginLeft: 50,
                  fontWeight: "bold",
                  fontSize: 30,
                }}
              >
                {ca.qty}
              </Text>
            </View>
          ))} */}

        {
          <FlatList
            numColumns={4}
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ flexDirection: "row" }}>
                {item.photo !== null ? (
                  <Image
                    style={{ width: 50, height: 70, marginBottom: 10 }}
                    source={{
                      uri: item.photo,
                    }}
                  />
                ) : (
                  <Image
                    style={{ width: 50, height: 70, marginBottom: 10 }}
                    source={require("../assets/books/book1.jpg")}
                  />
                )}
                <Text
                  style={{
                    textAlign: "center",
                    alignSelf: "center",
                    padding: 10,
                    fontWeight: "bold",
                    fontSize: 20,
                  }}
                >
                  {item.qty}
                </Text>
              </View>
            )}
            ListFooterComponent={<View />}
            ListFooterComponentStyle={{ height: 20 }}
          />
        }
        <Text>Below</Text>
        {/* <Button title="Fetch" onPress={getProducts} /> */}
        {stock !== null && (
          <FlatList
            numColumns={2}
            data={stock}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.book}>
                <TouchableOpacity onPress={() => saveToCart(item)}>
                  {item.photo !== null ? (
                    <Image
                      style={styles.image}
                      source={{
                        uri: item.photo,
                      }}
                    />
                  ) : (
                    <Image
                      style={styles.image}
                      source={require("../assets/books/book1.jpg")}
                    />
                  )}
                </TouchableOpacity>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ margin: 10, width: 40 }}>
                    <Button title="+" onPress={() => addOn(item)} />
                  </View>

                  <View>
                    <Text style={{ fontSize: 20 }}>{item.qty}</Text>
                  </View>

                  <View style={{ margin: 10, marginLeft: 30, width: 40 }}>
                    <Button title="-" onPress={() => Subtract(item)} />
                  </View>
                </View>
              </View>
            )}
            ListFooterComponent={<View />}
            ListFooterComponentStyle={{ height: 20 }}
          />
        )}
      </View>
      <Button title="profile" onPress={toProfile}  />
    </View>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    flex:1,
    margin: 10,
  },
  bookmark: {},
  image: {
    width: 150,
    height: 200,
    marginRight: 10,
    marginTop: 10,
    // alignSelf: "center",
  },
  hold: {
    flex:1,
    alignItems: "center",
  },
});
