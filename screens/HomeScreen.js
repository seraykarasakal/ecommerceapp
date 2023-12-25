import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DatabaseConnection } from "../config/database-connection";
import { HeartIcon } from "react-native-heroicons/solid";
import Navbar from "./Navbar";

const db = DatabaseConnection.getConnection();

// ... Diğer import'lar ...

export default function HomeScreen() {
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);

    const getProductsFromDatabase = () => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM table_products",
                    [],
                    (_, { rows }) => {
                        const products = [];
                        for (let i = 0; i < rows.length; i++) {
                            products.push(rows.item(i));
                        }
                        resolve(products);
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await getProductsFromDatabase();
                setProducts(products);
            } catch (error) {
                console.error("Ürünleri çekerken bir hata oluştu: ", error);
            }
        };

        fetchProducts();
    }, []);

    const toggleFavorite = async (productId, isFavorite) => {
        try {
            await toggleFavoriteInDatabase(productId, isFavorite);
            const updatedProducts = await getProductsFromDatabase();
            setProducts(updatedProducts);
        } catch (error) {
            console.error("Favori durumu güncellenirken bir hata oluştu: ", error);
        }
    };

    const toggleFavoriteInDatabase = (productId, isFavorite) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "UPDATE table_products SET is_favorite = ? WHERE product_id = ?",
                    [isFavorite ? 0 : 1, productId],
                    (_, { rowsAffected }) => {
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
    };

    return (
        <View style={styles.container}>
            <Navbar navigation={navigation} />
            <TouchableOpacity onPress={() => navigation.navigate("FavoriteProducts")}>
                <Text style={styles.text}>Favori Ürünleri Listele</Text>
            </TouchableOpacity>
            <Text>Ürünler</Text>
            <View style={styles.products}>
                {products.map((product) => (
                    <View key={product.product_id} style={styles.productContainer}>
                        <Text>
                            {product.product_name} - {product.product_price}
                        </Text>
                        <TouchableOpacity onPress={() => toggleFavorite(product.product_id, !product.is_favorite)}>
                            <HeartIcon size={24} color={product.is_favorite ? "red" : "gray"} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
}

// ... Stil tanımlamaları ...

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    products: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    productContainer: {
        marginBottom: 10,
    },
});
