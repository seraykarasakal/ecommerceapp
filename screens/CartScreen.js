import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HeartIcon, ShoppingCartIcon } from "react-native-heroicons/solid";
import { DatabaseConnection } from "../config/database-connection";
import Header from "./Header";
import HomeNavbar from "./HomeNavbar";

const db = DatabaseConnection.getConnection();

const CartScreen = () => {
    const navigation = useNavigation();
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user ? user.uid : null;
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);
    const getCartFromDatabase = () => {

        db.transaction((tx) => {
            return new Promise((resolve, reject) => {
                tx.executeSql(
                    "SELECT * FROM table_cart INNER JOIN table_products ON table_cart.product_id = table_products.product_id WHERE table_cart.user_id = ?",
                    [uid],
                    (tx, results) => {

                        var temp = [];
                        for (let i = 0; i < results.rows.length; ++i) {
                            temp.push(results.rows.item(i));
                        }
                        setCartItems(temp);

                    }
                );
            });

        });

    };

    const toggleFavoriteInDatabase = useCallback((productId) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "DELETE FROM favorites WHERE product_id = ? user_id = ?",
                    [productId, uid],
                    (_, { rowsAffected }) => {
                        console.log("Rows affected:", rowsAffected);
                        if (rowsAffected > 0) {
                            resolve();
                        } else {
                            reject(new Error("Ürün favori durumu güncellenemedi."));
                        }
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    }, []);

    const addToCart = useCallback((productId) => {
        return new Promise((resolve, reject) => {
            // Sepete ekleme işlemini gerçekleştir
            // Örneğin, veritabanına yeni bir kayıt ekleme veya başka bir işlem
            console.log(`Ürün (${productId}) sepete eklendi.`);
            resolve();
        });
    }, []);

    const removeFromCart = useCallback((productId) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "DELETE FROM table_cart WHERE product_id = ? AND user_id=?",
                    [productId, uid],
                    (_, results) => {
                        console.log("Ürün sepetten çıkarıldı:", results);
                        resolve();
                    },
                    (_, error) => {
                        console.error("Ürünü sepette çıkarma işlemi başarısız oldu:", error);
                        reject(error);
                    }
                );
            });
        });
    }, []);

    const fetchCart = useCallback(async () => {
        try {
            const cartItems = getCartFromDatabase();

        } catch (error) {
            console.error("Sepetteki ürünleri çekerken bir hata oluştu: ", error);
        }
    }, [getCartFromDatabase]);

    const toggleCart = async (productId) => {
        try {
            await removeFromCart(productId);
            

            // Sepet durumu güncellenmiş ürünleri setCartItems aracılığıyla güncelle
            await fetchCart();
        } catch (error) {
            console.error("Sepet durumu güncellenirken bir hata oluştu: ", error);
        }
    };

    const calculateTotal = useCallback(() => {
        return cartItems.reduce((total, item) => total + item.product_price, 0);
    }, [cartItems]);

    const makePayment = () => {
        const total = calculateTotal();
        // Implement payment logic here (e.g., call a payment API, navigate to a payment screen, etc.)
        console.log(`Payment made for total: ${total}`);
    };

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    return (
        <View style={styles.container}>
            <Header label="Sepetim" />
            <Text style={styles.headerText}>Sepetteki Ürünler</Text>
            <View style={styles.products}>
                {cartItems.map((item) => (
                    <View key={item.product_id} style={styles.productContainer}>
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{item.product_name}</Text>
                            <Text style={styles.productPrice}>{item.product_price} TL</Text>
                        </View>
                        <View style={styles.iconsContainer}>
                            <TouchableOpacity onPress={() => toggleFavoriteInDatabase(item.product_id)}>
                                <HeartIcon size={24} color={item.is_favorite ? "red" : "gray"} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => toggleCart(item.product_id, item.is_cart)}>
                                <ShoppingCartIcon size={24} color={item.is_cart ? "green" : "gray"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Toplam: {calculateTotal()} TL</Text>
                </View>
                <TouchableOpacity style={styles.paymentButton} onPress={() => navigation.navigate("Payment")}>
                    <Text style={styles.paymentButtonText}>Ödemeye Geç</Text>
                </TouchableOpacity>

            </View>
            <HomeNavbar navigation={navigation} />
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
    productPrice: {
        fontSize: 16,
        color: "#666",
    },
    iconsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
    },
    totalContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 16,
        paddingHorizontal: 16,
    },
    totalText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
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
export default CartScreen;
