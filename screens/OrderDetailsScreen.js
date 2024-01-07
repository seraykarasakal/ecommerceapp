import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { React, useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { DatabaseConnection } from "../config/database-connection";
const db = DatabaseConnection.getConnection();


const OrderDetailsScreen = () => {

    const route = useRoute();
    const orderId = route.params?.orderId;
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user ? user.uid : null;
    const navigation = useNavigation();
    const [orderItems, setOrderItems] = useState([]);


    const getOrderItemsFromDatabase = useCallback(async () => {
        return new Promise((resolve, reject) => {
            db.transaction(async (tx) => {
                tx.executeSql(
                    "SELECT * FROM order_items INNER JOIN table_products ON order_items.product_id = table_products.product_id WHERE order_items.order_id = ?",
                    [orderId],
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
    }, [orderId]);
    const fetchOrderItems = useCallback(async () => {
        try {
            const getOrderItems = await getOrderItemsFromDatabase();
            setOrderItems(getOrderItems);

        } catch (error) {
            console.error("HATA!", error);
        }

    }, [getOrderItemsFromDatabase]);
    useEffect(() => {
        fetchOrderItems();
    }, [fetchOrderItems]);
    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Sipariş Ürünleri</Text>
            <View style={styles.products}>
                {orderItems.map((order) => (
                    <View key={order.order_item_id} style={styles.productContainer}>
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{order.product_name}</Text>
                            <Text style={styles.productDescription}>{order.product_description}</Text>
                            <Text style={styles.productPrice}>{order.product_price} TL</Text>
                                
                            
                        </View>

                    </View>
                ))}
            </View>
        </View>
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
export default OrderDetailsScreen;
