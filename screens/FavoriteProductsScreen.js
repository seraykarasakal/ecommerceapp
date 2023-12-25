import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DatabaseConnection } from "../config/database-connection";
import { HeartIcon } from "react-native-heroicons/solid";

const db = DatabaseConnection.getConnection();

// ... Diğer import'lar ...

export default function FavoriteProductsScreen() {
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);

    const getFavoriteProductsFromDatabase = () => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM table_products WHERE is_favorite = 1",
                    [],
                    (_, { rows }) => {
                        const favoriteProducts = [];
                        for (let i = 0; i < rows.length; i++) {
                            favoriteProducts.push(rows.item(i));
                        }
                        resolve(favoriteProducts);
                    },
                    (_, error) => {
                        reject(error);
                    }
                );
            });
        });
    };

    useEffect(() => {
        const fetchFavoriteProducts = async () => {
            try {
                const favoriteProducts = await getFavoriteProductsFromDatabase();
                setProducts(favoriteProducts);
            } catch (error) {
                console.error("Favori ürünleri çekerken bir hata oluştu: ", error);
            }
        };

        fetchFavoriteProducts();
    }, []);

    const handleToggleFavorite = async (productId, isFavorite) => {
        try {
            await toggleFavoriteInDatabase(productId, isFavorite);
            const updatedProducts = await getFavoriteProductsFromDatabase();
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
            <Text>Favori Ürünler</Text>
            <View style={styles.products}>
                {products.map((product) => (
                    <View key={product.product_id} style={styles.productContainer}>
                        <Text>
                            {product.product_name} - {product.product_price}
                        </Text>
                        <TouchableOpacity onPress={() => handleToggleFavorite(product.product_id, false)}>
                            <HeartIcon size={24} color="red" />
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
    products: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    productContainer: {
        marginBottom: 10,
    },
});
