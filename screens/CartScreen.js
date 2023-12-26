import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import { DatabaseConnection } from "../config/database-connection";
import { HeartIcon, ShoppingCartIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";

const db = DatabaseConnection.getConnection();

const CartScreen = () => {
    const navigation = useNavigation();
    const [cartItems, setCartItems] = useState([]);

    const getCartFromDatabase = useCallback(() => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT p.*, f.product_id IS NOT NULL AS is_favorite, c.product_id IS NOT NULL AS is_cart FROM table_products p LEFT JOIN favorites f ON p.product_id = f.product_id LEFT JOIN table_cart c ON p.product_id = c.product_id WHERE c.product_id IS NOT NULL",
                    [],
                    (_, { rows }) => {
                        const products = [];
                        for (let i = 0; i < rows.length; i++) {
                            products.push(rows.item(i));
                        }
                        resolve(products);
                    },
                    (_, error) => {
                        console.error("Sepetteki ürünleri çekerken bir hata oluştu:", error);
                        reject(error);
                    }
                );
            });
        });
    }, []);

    const toggleFavoriteInDatabase = useCallback((productId, isFavorite) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "UPDATE table_products SET is_favorite = ? WHERE product_id = ?",
                    [isFavorite ? 0 : 1, productId],
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
                    "DELETE FROM table_cart WHERE product_id = ?",
                    [productId],
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
            const cartItems = await getCartFromDatabase();
            setCartItems(cartItems);
        } catch (error) {
            console.error("Sepetteki ürünleri çekerken bir hata oluştu: ", error);
        }
    }, [getCartFromDatabase]);

    const toggleCart = async (productId, isCart) => {
        try {
            if (isCart) {
                await removeFromCart(productId);
            } else {
                await addToCart(productId);
            }

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
            <Text>Sepetteki Ürünler</Text>
            <View style={styles.products}>
                {cartItems.map((item) => (
                    <View key={item.product_id} style={styles.productContainer}>
                        <Text>
                            {item.product_name} - {item.product_price}
                        </Text>
                        <TouchableOpacity onPress={() => toggleFavoriteInDatabase(item.product_id, item.is_favorite)}>
                            <HeartIcon size={24} color={item.is_favorite ? "red" : "gray"} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => toggleCart(item.product_id, item.is_cart)}>
                            <ShoppingCartIcon size={24} color={item.is_cart ? "green" : "gray"} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <Text>Total: {calculateTotal()}</Text>

            <TouchableOpacity title="Make Payment" onPress={() => navigation.navigate("Payment")}>
                <Text style={styles.text}>Ödemeye geç</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    products: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    productContainer: {
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
    },
});

export default CartScreen;
