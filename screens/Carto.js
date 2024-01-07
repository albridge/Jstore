import React, { useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Button,
} from "react-native";
// import { Button } from "react-native-elements/dist/buttons/Button";
import ThemedListItem from "react-native-elements/dist/list/ListItem";
import { CartContext } from "./CartContext";

const Carto = ({ navigation, route }) => {
  const [cart, setCart] = useContext(CartContext);
  //   const { items } = route.params;
  //   console.log("inside cart", cart);

  const Subtract = (e, item) => {
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
    // console.log(data);
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
    <ScrollView style={styles.container}>
      {cart.length > 0 ? (
        cart.map((item) => (
          <View style={styles.cartItem} key={item.id}>
            <Image
              style={styles.image}
              source={{
                uri: item.photo,
              }}
            />
            <View style={styles.boss}>
              <View style={{ flexDirection: "row", marginBottom: 20 }}>
                <Text style={styles.text}>{item.qty}</Text>
                <Text style={styles.text}>
                  {cashFormat(item.price * item.qty)}
                </Text>
              </View>

              <View style={{ flexDirection: "row" }}>
                <View style={styles.pBut}>
                  <Button title="+" onPress={() => addOn(item)} />
                </View>
                <View style={styles.mBut}>
                  <Button title="-" onPress={(e) => Subtract(e, item)} />
                </View>

                <View style={styles.mBut}>
                  <Button title="X" onPress={(e) => Remove(e, item)} />
                </View>
              </View>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.empty}>Cart is Empty!</Text>
      )}
    </ScrollView>
  );
};

export default Carto;

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
    flexDirection: "row",
    flex: 1,
    alignContent: "space-between",
    alignItems: "center",
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
    flex: 1,
    // flexDirection: "row",
  },
});
