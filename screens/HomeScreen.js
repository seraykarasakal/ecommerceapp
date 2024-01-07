import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import { React, useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HeartIcon, ShoppingCartIcon } from "react-native-heroicons/solid";
import { DatabaseConnection } from "../config/database-connection";
import Header from "./Header";
import HomeNavbar from "./HomeNavbar";

const db = DatabaseConnection.getConnection();

const HomeScreen = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user ? user.uid : null;

    const navigation = useNavigation();
    const [products, setProducts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [cartItems, setCartItems] = useState([]);

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
                );
            });
        });
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
                );
            });
        });
    };
    const fetchProducts = useCallback(async () => {
        try {
            const products = await getProductsFromDatabase();

            const updatedFavorites = await isFavorite();
            const updatedCartItems = await isCartItem();
            setFavorites(updatedFavorites);
            setCartItems(updatedCartItems);
            setProducts(products);
        } catch (error) {
            console.error("Ürünleri çekerken bir hata oluştu: ", error);
        }
    }, [getProductsFromDatabase]);

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
                        console.error("Veritabanından ürünleri çekerken bir hata oluştu:", error);
                        reject(error);
                    }
                );
            });
        });
    };

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
                        reject();
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

    const toggleFavorite = async (productId) => {
        try {
            console.log("toggle favorites");
            if (favorites.some((favorite) => favorite.product_id === productId)) {
                console.log(productId);
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
            console.log("togglecart");
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

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Çıkış başarılı olduysa, yönlendirme veya başka bir işlem ekleyebilirsiniz
        } catch (error) {
            console.error("Çıkış yaparken bir hata oluştu: ", error.message);
        }
    };

    useEffect(() => {
        console.log(uid);
        const unsubscribe = navigation.addListener("focus", () => {
            // Favori ürünler sayfasından dönüldüğünde ürünleri tekrar çek
            fetchProducts();
        });

        db.transaction((tx) => {
            console.log("trnsctsn");

            tx.executeSql("INSERT INTO table_users (user_id) SELECT ? WHERE NOT EXISTS (SELECT 1 FROM table_users WHERE user_id = ?)", [uid], (tx, result) => {
                if (result.rowsAffected > 0) {
                    console.log("eklendi");
                } else {
                    console.log("eklenemedi");
                }
            });
        });

        return unsubscribe;
    }, [navigation, fetchProducts]);

    return (
        <View style={styles.container}>
            <Header label="Anasayfa" />
            <Text style={styles.headerText}>Ürünler</Text>

            <TouchableOpacity onPress={() => navigation.navigate("FavoriteProducts")}>
                <Text style={styles.text}>Favori Ürünleri Listele</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("AddUser")}>
                <Text style={styles.text}>Kullanıcı ekle</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
                <Text style={styles.text}>Sepet Ürünleri Listele</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("ListUsers")}>
                <Text style={styles.text}>KUllancıcı Listele</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("EditUser")}>
                <Text style={styles.text}>KUllancıcı düzenle</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Orders")}>
                <Text style={styles.text}>Siparişlerim</Text>
            </TouchableOpacity>
            <View style={styles.products}>
                {products.map((product) => (
                    <View key={product.product_id} style={styles.productContainer}>
                        <Text>
                            {product.product_name} - {product.product_price}
                        </Text>

                        <TouchableOpacity onPress={() => toggleFavorite(product.product_id)}>
                            <HeartIcon size={24} color={favorites.some((favorite) => favorite.product_id === product.product_id) ? "red" : "gray"} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => toggleCart(product.product_id)}>
                            <ShoppingCartIcon size={24} color={cartItems.some((cart) => cart.product_id === product.product_id) ? "green" : "gray"} />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
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
