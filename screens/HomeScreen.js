import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DatabaseConnection } from "../config/database-connection";
import { HeartIcon, ShoppingCartIcon } from "react-native-heroicons/solid";
import Footer from "./Footer";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import HomeNavbar from "./HomeNavbar";
import Header from "./Header";

const db = DatabaseConnection.getConnection();

const HomeScreen = () => {
    const navigation = useNavigation();
    const [products, setProducts] = useState([]);

    const fetchProducts = useCallback(async () => {
        try {
            const products = await getProductsFromDatabase();
            setProducts(products);
        } catch (error) {
            console.error("Ürünleri çekerken bir hata oluştu: ", error);
        }
    }, []);

    const getProductsFromDatabase = () => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT p.*, f.product_id IS NOT NULL AS is_favorite, c.product_id IS NOT NULL AS is_cart FROM table_products p LEFT JOIN favorites f ON p.product_id = f.product_id LEFT JOIN table_cart c ON p.product_id = c.product_id",
                    [],
                    (_, { rows }) => {
                        const products = [];
                        for (let i = 0; i < rows.length; i++) {
                            products.push(rows.item(i));
                        }
                        resolve(products);
                    },
                    (_, error) => {
                        console.error("Veritabanından ürünleri çekerken bir hata oluştu:", error);
                        reject(error);
                    }
                );
            });
        });
    };

    const addFavoriteProduct = useCallback((productId) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO favorites (product_id) VALUES (?)",
                [productId],
                (_, results) => {
                    console.log("Favori ürün eklendi:", results);
                },
                (_, error) => {
                    console.error("Favori ürün eklenirken bir hata oluştu:", error);
                }
            );
        });
    }, []);

    const addCart = useCallback((productId) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO table_cart (product_id) VALUES (?)",
                [productId],
                (_, results) => {
                    console.log("Ürün sepete eklendi:", results);
                },
                (_, error) => {
                    console.error("Ürün sepete eklenirken bir hata oluştu:", error);
                }
            );
        });
    }, []);

    const removeFavoriteProduct = useCallback((productId) => {
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM favorites WHERE product_id = ?",
                [productId],
                (_, results) => {
                    console.log("Favori ürün kaldırıldı:", results);
                },
                (_, error) => {
                    console.error("Favori ürün kaldırılırken bir hata oluştu:", error);
                }
            );
        });
    }, []);

    const removeCart = useCallback((productId) => {
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM table_cart WHERE product_id = ?",
                [productId],
                (_, results) => {
                    console.log("Ürün sepetten kaldırıldı:", results);
                },
                (_, error) => {
                    console.error("Ürün sepetten kaldırılırken bir hata oluştu:", error);
                }
            );
        });
    }, []);

    const toggleFavorite = async (productId, isFavorite) => {
        try {
            if (isFavorite) {
                await removeFavoriteProduct(productId);
            } else {
                await addFavoriteProduct(productId);
            }

            // Favori durumu güncellenmiş ürünleri setProducts aracılığıyla güncelle
            await fetchProducts();
        } catch (error) {
            console.error("Favori durumu güncellenirken bir hata oluştu: ", error);
        }
    };

    const toggleCart = async (productId, isCart) => {
        try {
            if (isCart) {
                await removeCart(productId);
            } else {
                await addCart(productId);
            }

            // Sepet durumu güncellenmiş ürünleri setProducts aracılığıyla güncelle
            await fetchProducts();
        } catch (error) {
            console.error("Sepet durumu güncellenirken bir hata oluştu: ", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Çıkış başarılı olduysa, yönlendirme veya başka bir işlem ekleyebilirsiniz
        } catch (error) {
            console.error("Çıkış yaparken bir hata oluştu: ", error.message);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            // Favori ürünler sayfasından dönüldüğünde ürünleri tekrar çek
            fetchProducts();
        });
        // Komponent ayrıldığında event listener'ı temizle
        return unsubscribe;
    }, [navigation, fetchProducts]);

    return (
        <View style={styles.container}>
            <Header label="Anasayfa" />
            <Text style={styles.headerText}>Ürünler</Text>
            <View style={styles.products}>
                {products.map((product) => (
                    <View key={product.product_id} style={styles.productContainer}>
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{product.product_name}</Text>
                            <Text style={styles.productPrice}>{product.product_price} TL</Text>
                        </View>
                        <View style={styles.iconsContainer}>
                            <TouchableOpacity onPress={() => toggleFavorite(product.product_id, product.is_favorite)}>
                                <HeartIcon size={24} color={product.is_favorite ? "red" : "grey"} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => toggleCart(product.product_id, product.is_cart)}>
                                <ShoppingCartIcon size={24} color={product.is_cart ? "green" : "grey"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
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
export default HomeScreen;
