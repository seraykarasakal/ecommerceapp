import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { DatabaseConnection } from "../config/database-connection";
import HomeNavbar from "./HomeNavbar";

const db = DatabaseConnection.getConnection();

const PaymentScreen = () => {
    const route = useRoute();
    const total = route.params?.total;
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user ? user.uid : null;
    const navigation = useNavigation();
    const [cartItems, setCartItems] = useState([]);
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const currentDate = new Date();
    let orderId = 0;
    const handlePayment = async () => {
        try {
            if (!cardNumber || !expiryDate || !cvv) {
                console.log("Lütfen tüm kart bilgilerini doldurun.");
                return;
            }

            
            
                console.log("Ödeme başarılı!");
                setPaymentSuccess(true);


                const getOrder = await createOrder();
                console.log("getorder orderid: " + getOrder);
                orderId= getOrder;
                console.log("order id son : "+ orderId);
                 
                await createOrderItem();

            
        } catch (error) {
            console.error("Ödeme işlemi sırasında hata:", error);
        }
    };
    const isCartItem = () => {
        return new Promise((resolve, reject) => {
            db.transaction(async (tx) => {
                tx.executeSql(
                    "SELECT * FROM table_cart WHERE user_id = ? ",
                    [uid],
                    (_, { rows }) => {

                        let cartItem = [];

                        for (let i = 0; i < rows.length; i++) {
                            cartItem.push(rows.item(i));
                            console.log("cart row: "+ rows.item(i).product_id);
                            console.log(cartItem.at(i));
                        }
                        resolve(cartItem);
                    },
                    (_, error) => {
                        console.error("Sepetten ürünleri çekerken bir hata oluştu:", error);
                        reject();
                    }

                )
            });
        });
    }
    const createOrder = async () => {
        console.log('createorder çalıstı');
        console.log(total);

        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "INSERT INTO table_orders (user_id,total_amount) VALUES (?,?)",
                    [uid, total],
                    (_, { insertId }) => {
                        console.log("orderid : " + insertId);
                        const tempOrderid = insertId;
                        resolve(tempOrderid);
                    },
                    (_, error) => {
                        console.error('sipariş oluşturulamadı');
                        reject(error);
                    },
                );
            });
        });
    };
    const createOrderItem = async () => {
        return new Promise((resolve, reject) => {

            db.transaction((tx) => {
                
                cartItems.forEach((item) => {
                    const productId = item.product_id;
                    console.log("orderitems sql girdi");
                    tx.executeSql(
                        "INSERT INTO order_items (order_id, product_id) VALUES (?,?)",
                        [orderId, productId],
                        (_, result) => {
                            console.log('order_items insert success', result);
                            console.log("productid " + productId);
                            console.log("orderid : " + orderId);
                            resolve();
                        },
                        (_, error) => {
                            console.error('order_items insert error', error);
                            reject();
                        },
                    );
                });
            })
        })
    }
    const fetchCart = async () => {
        try {
            const getCartItems = await isCartItem();
            
            setCartItems(getCartItems);
        } catch (error) {
            console.error("Diğer işlemler sırasında hata:", error);
        }
    };
    useEffect(() => {
        fetchCart();
        
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Ödeme Bilgileri</Text>
            <TextInput
                style={styles.input}
                placeholder="Kart Numarası"
                keyboardType="numeric"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(text)}
            />
            <TextInput style={styles.input} placeholder="Son Kullanma Tarihi" value={expiryDate} onChangeText={(text) => setExpiryDate(text)} />
            <TextInput style={styles.input} placeholder="CVV" keyboardType="numeric" value={cvv} onChangeText={(text) => setCvv(text)} />
            <TouchableOpacity style={styles.paymentButton} onPress={() => navigation.navigate("Payment")}>
                <Text style={styles.paymentButtonText} onPress={handlePayment}>
                    Ödemeyi Gerçekleştir
                </Text>
            </TouchableOpacity>
            {paymentSuccess && <Text style={styles.successText}>Ödeme başarılı!</Text>}
            <HomeNavbar navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white",
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#333",
        textAlign: "center",
    },
    input: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "#E5E3DD",
        padding: 16,
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    successText: {
        marginTop: 20,
        fontSize: 18,
        color: "green",
        textAlign: "center",
    },
    paymentButton: {
        backgroundColor: "#E5E3DD",
        padding: 15,
        marginLeft: 10,
        width: "50%",
        borderRadius: 20,
    },
    paymentButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#374151",
        textAlign: "center",
    },
});

export default PaymentScreen;
