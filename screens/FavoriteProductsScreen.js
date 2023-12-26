import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DatabaseConnection } from "../config/database-connection";
import { HeartIcon } from "react-native-heroicons/solid";

const db = DatabaseConnection.getConnection();

const FavoriteProductsScreen = () => {
    const [products, setProducts] = useState([]);

    const getFavoriteProductsFromDatabase = () => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT p.*, f.product_id IS NOT NULL AS is_favorite FROM table_products p LEFT JOIN favorites f ON p.product_id = f.product_id WHERE f.product_id IS NOT NULL",
                    [],
                    (_, { rows }) => {
                        const products = [];
                        for (let i = 0; i < rows.length; i++) {
                            products.push(rows.item(i));
                        }
                        resolve(products);
                    },
                    (_, error) => {
                        console.error("Favori ürünleri çekerken bir hata oluştu:", error);
                        reject(error);
                    }
                );
            });
        });
    };

    const handleToggleFavorite = async (productId, isFavorite) => {
        try {
            if (isFavorite) {
                await removeFavoriteProduct(productId);
            } else {
                await addFavoriteProduct(productId);
            }

            const updatedProducts = await getProductsFromDatabase();
            setProducts(updatedProducts);
        } catch (error) {
            console.error("Favori durumu güncellenirken bir hata oluştu: ", error);
        }
    };

    const handleRemoveFavorite = async (productId) => {
        try {
            await removeFavoriteProduct(productId);
            // Favori ürünleri yeniden çekmek için
            await fetchFavoriteProducts();
        } catch (error) {
            console.error("Ürünü favorilerden kaldırma işlemi başarısız oldu:", error);
        }
    };

    const toggleFavoriteInDatabase = (productId, isFavorite) => {
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
    };

    const removeFavoriteProduct = (productId) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "DELETE FROM favorites WHERE product_id = ?",
                    [productId],
                    (_, results) => {
                        console.log("Favori ürün kaldırıldı:", results);
                        resolve();
                    },
                    (_, error) => {
                        console.error("Favori ürün kaldırılırken bir hata oluştu:", error);
                        reject(error);
                    }
                );
            });
        });
    };

    const fetchFavoriteProducts = async () => {
        try {
            const favoriteProducts = await getFavoriteProductsFromDatabase();
            setProducts(favoriteProducts);
        } catch (error) {
            console.error("Favori ürünleri çekerken bir hata oluştu: ", error);
        }
    };

    const toggleFavorite = async (productId, isFavorite) => {
        try {
            if (isFavorite) {
                await removeFavoriteProduct(productId);
            } else {
                await addFavoriteProduct(productId);
            }

            // Favori durumu güncellenmiş ürünleri setProducts aracılığıyla güncelle
            await fetchFavoriteProducts();
        } catch (error) {
            console.error("Favori durumu güncellenirken bir hata oluştu: ", error);
        }
    };
    useEffect(() => {
        fetchFavoriteProducts();
    }, []);
    return (
        <View style={styles.container}>
            <Text>Favori Ürünler</Text>
            <View style={styles.products}>
                {products.map((product) => (
                    <View key={product.product_id} style={styles.productContainer}>
                        <Text>
                            {product.product_name} - {product.product_price}
                        </Text>
                        <TouchableOpacity onPress={() => toggleFavorite(product.product_id, product.is_favorite)}>
                            <HeartIcon size={24} color={product.is_favorite ? "red" : "gray"} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
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
    },
});

export default FavoriteProductsScreen;
