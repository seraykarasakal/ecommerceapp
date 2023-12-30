import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HeartIcon } from "react-native-heroicons/solid";
import { DatabaseConnection } from "../config/database-connection";
import Header from "./Header";
import HomeNavbar from "./HomeNavbar";


const db = DatabaseConnection.getConnection();

const FavoriteProductsScreen = () => {
    const navigation = useNavigation();



    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user ? user.uid : null;
    const [flatListItems, setFlatListItems] = useState([]);

    const [products, setProducts] = useState([]);

    const getFavoriteProductsFromDatabase = () => {

        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM favorites INNER JOIN table_products ON favorites.product_id = table_products.product_id WHERE favorites.user_id = ?",
                [uid], (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                    }
                    setFlatListItems(temp);
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
            <Header label="Favorilerim" />
            <Text style={styles.headerText}>Favori Ürünler</Text>
            <View style={styles.products}>
                {products.map((product) => (
                    <View key={product.product_id} style={styles.productContainer}>
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{product.product_name}</Text>
                            <Text style={styles.productPrice}>{product.product_price} TL</Text>
                        </View>
                        <TouchableOpacity onPress={() => toggleFavorite(product.product_id)}>
                            <HeartIcon size={24} color={product.is_favorite ? "red" : "gray"} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <HomeNavbar navigation={navigation} />
        </View>
    )
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
});

export default FavoriteProductsScreen;
