import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { React, useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChevronDoubleRightIcon, TrashIcon } from "react-native-heroicons/solid";
import { DatabaseConnection } from "../config/database-connection";
const db = DatabaseConnection.getConnection();


const OrdersScreen = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user ? user.uid : null;
    const navigation = useNavigation();
    const [orders, setOrders] = useState([]);


    const getOrdersFromDatabase = useCallback(() => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM table_orders",
                    [],
                    (_, { rows }) => {
                        const order = [];
                        for (let i = 0; i < rows.length; i++) {
                            order.push(rows.item(i));

                        }


                        resolve(order);
                    },
                    (_, error) => {
                        console.error("Veritabanından siparişeri çekerken hata oluştu!");
                        reject(error);
                    }
                );
            });
        });
    }, []);
    const fetchOrders = useCallback(async () => {
        try {
            const getOrders = await getOrdersFromDatabase();

            setOrders(getOrders);
        } catch (error) {
            console.error("HATA!", error);
        }

    }, [getOrdersFromDatabase]);
    let deleteOrder = (id) => {
        console.log(id + ' ID');
        db.transaction((tx) => {
            tx.executeSql(
                'DELETE  FROM table_orders WHERE order_id = ?',
                [id],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        Alert.alert(
                            'Basarili!',
                            'Sipariş silme başarili!',
                            [
                                {
                                    text: 'Ok',
                                    onPress: () => {
                                        navigation.navigate('Home');
                                    },
                                },
                            ],
                            { cancelable: true }
                        );
                    } else alert('Sipariş silme başarısız!');
                }
            )
        });
    };
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headerText}>Siparişlerim</Text>
            <View style={styles.products}>
                {orders.map((order) => (
                    <View key={order.order_id} style={styles.productContainer}>
                        <View style={styles.productInfo}>
                            <Text style={styles.productPrice}>{order.total_amount} TL</Text>
                        </View>
                        <View style={styles.iconsContainer}>
                            <TouchableOpacity onPress={() => deleteOrder(order.order_id)}>
                                <TrashIcon size="24" color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('OrderDetails', { orderId: order.order_id })}>
                                <Text>Sipariş Detayları</Text>
                                <ChevronDoubleRightIcon size="24" color="black" />
                            </TouchableOpacity>

                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        marginTop: 16,
        color: "#333",
        marginLeft: 10,
    },
    products: {
        flex: 1,
    },
    productContainer: {
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
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    productDescription: {
        fontSize: 16,
        marginBottom: 8,
        color: "#333",
    },
    productPrice: {
        fontSize: 16,
        color: "#333",
    },
    iconsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
    },

    logoutButton: {
        backgroundColor: "red",
        padding: 16,
        borderRadius: 8,
        marginTop: 16,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
export default OrdersScreen;
