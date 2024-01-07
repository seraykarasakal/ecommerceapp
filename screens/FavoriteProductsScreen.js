import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HeartIcon, ShoppingCartIcon } from "react-native-heroicons/solid";
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
    const [favorites, setFavorites] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);


    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            // Favori ürünler sayfasından dönüldüğünde ürünleri tekrar çek
            fetchProducts();

        });
        return unsubscribe;
    }, [navigation, fetchProducts]);
    const getFavoriteProductsFromDatabase = () => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM favorites INNER JOIN table_products ON favorites.product_id = table_products.product_id WHERE favorites.user_id = ?",
                    [uid],
                    (_, { rows }) => {
                        var temp = [];
                        for (let i = 0; i < rows.length; ++i) {
                            temp.push(rows.item(i));
                        }
                        resolve(temp);
                    },
                    (_, error) => {
                        console.error('Veritabanından ürünleri çekerken hata oluştu!');
                        reject(error);
                    }
                );
            });
        })


    };
    const isFavorite = () => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM favorites WHERE user_id = ? ",
                    [uid],
                    (_, { rows }) => {
                        const favorites = [];
                        for (let i = 0; i < rows.length; i++) {
                            favorites.push(rows.item(i));
                        }
                        resolve(favorites);
                    },
                    (_, error) => {
                        console.error("Favori ürün eklenirken bir hata oluştu:", error);
                        reject();
                    }

                )
            });
        });
    }
    const isCartItem = () => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "SELECT * FROM table_cart WHERE user_id = ? ",
                    [uid],
                    (_, { rows }) => {

                        const cartItems = [];

                        for (let i = 0; i < rows.length; i++) {
                            cartItems.push(rows.item(i));
                        }
                        resolve(cartItems);
                    },
                    (_, error) => {
                        console.error("Favori ürün eklenirken bir hata oluştu:", error);
                        reject();
                    }

                )
            });
        });
    }
    const handleToggleFavorite = async (productId, isFavorite) => {
        try {
            if (isFavorite) {
                await removeFavoriteProduct(productId);
            } else {
                await addFavoriteProduct(productId);
            }

            const updatedProducts = await getFavoriteProductsFromDatabase();
            setProducts(updatedProducts);
        } catch (error) {
            console.error("Favori durumu güncellenirken bir hata oluştu: ", error);
        }
    };

    const handleRemoveFavorite = async (productId) => {
        try {
            await removeFavoriteProduct(productId);
            // Favori ürünleri yeniden çekmek için
            await fetchProducts();
        } catch (error) {
            console.error("Ürünü favorilerden kaldırma işlemi başarısız oldu:", error);
        }
    };
    const addCart = useCallback((productId) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "INSERT INTO table_cart (product_id, user_id) VALUES (?,?)",
                    [productId, uid],
                    (_, results) => {
                        console.log("Ürün sepete eklendi:", results);
                        resolve();
                    },
                    (_, error) => {
                        console.error("Ürün sepete eklenirken bir hata oluştu:", error);
                        reject();
                    }
                );
            });
        });

    }, []);
    const addFavoriteProduct = useCallback((productId) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "INSERT INTO favorites (product_id, user_id) VALUES (?,?)",
                    [productId, uid],
                    (_, results) => {
                        console.log("Favori ürün eklendi:", results);
                        resolve();
                    },
                    (_, error) => {
                        console.error("Favori ürün eklenirken bir hata oluştu:", error);
                        reject();
                    }
                );
            });
        });

    }, []);
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

    const removeFavoriteProduct = useCallback((productId) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "DELETE FROM favorites WHERE product_id = ? AND user_id = ?",
                    [productId, uid],
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
    }, []);
    const removeCart = useCallback((productId) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "DELETE FROM table_cart WHERE product_id = ? AND user_id = ?",
                    [productId, uid],
                    (_, results) => {
                        console.log("Ürün sepetten kaldırıldı:", results);
                        resolve();
                    },
                    (_, error) => {
                        console.error("Ürün sepetten kaldırılırken bir hata oluştu:", error);
                        reject();
                    }
                );
            });
        });

    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            const products = await getFavoriteProductsFromDatabase();
            const updatedFavorites = await isFavorite();
            const updatedCartItems = await isCartItem();

            setFavorites(updatedFavorites);
            setCartItems(updatedCartItems);
            setProducts(products);
        } catch (error) {
            console.error("Ürünleri çekerken bir hata oluştu: ", error);
        }
    }, [getFavoriteProductsFromDatabase]);

    const toggleFavorite = async (productId) => {
        try {
            console.log('toggle favorites');
            if (favorites.some((favorite) => favorite.product_id === productId)) {
                console.log(productId + 'tooglefav');
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
    const toggleCart = async (productId) => {
        try {
            console.log('togglecart');
            if (cartItems.some((cart) => cart.product_id === productId)) {
                await removeCart(productId);
            } else {
                await addCart(productId);
            }
            await fetchProducts();

        } catch (error) {
            console.error("Sepet durumu güncellenirken bir hata oluştu: ", error);
        }
    };
    return (
        <View style={styles.container}>
            <Header label="Favorilerim" />
            <Text style={styles.headerText}>Favori Ürünler</Text>
            <View style={styles.products}>
                {products.map((product) => (
                    <View key={product.product_id} style={styles.productContainer}>
                        <Text>
                            {product.product_name} - {product.product_price}
                        </Text>
                        <View style={styles.iconsContainer}>
                            <TouchableOpacity onPress={() => toggleFavorite(product.product_id)}>
                                <HeartIcon size={24} color={favorites.some((favorite) => favorite.product_id === product.product_id) ? 'red' : 'gray'} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => toggleCart(product.product_id)}>
                                <ShoppingCartIcon size={24} color={cartItems.some((cart) => cart.product_id === product.product_id) ? 'green' : 'gray'} />
                            </TouchableOpacity>
                        </View>
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
    iconsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
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
