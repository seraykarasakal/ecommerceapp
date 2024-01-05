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
    const [favorites, setFavorites] = useState([]);
    const [products, setProducts] = useState([]);
    const getCartProductsFromDatabase = () => {
        return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            
                tx.executeSql(
                    "SELECT * FROM table_cart INNER JOIN table_products ON table_cart.product_id = table_products.product_id WHERE table_cart.user_id = ?",
                    [uid],
                    (_ , {rows}) => {

                        var temp = [];
                        for (let i = 0; i < rows.length; ++i) {
                            temp.push(rows.item(i));
                        }
                        resolve(temp);
                    },
                    (_,error) => {
                        console.error('Veritabanından ürünleri çekerken hata oluştu!');
                        reject(error);
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
    const removeFavoriteProduct = useCallback((productId) => {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    "DELETE FROM favorites WHERE product_id = ? AND user_id = ?",
                    [productId,uid],
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
    },[]);
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

    const fetchProducts = useCallback(async () => {
        try {
            const products = await getCartProductsFromDatabase();
            const updatedFavorites = await isFavorite();
            const updatedCartItems = await isCartItem();

            setFavorites(updatedFavorites);
            setCartItems(updatedCartItems);
            setProducts(products);
        } catch (error) {
            console.error("Ürünleri çekerken bir hata oluştu: ", error);
        }
    }, [ getCartProductsFromDatabase]);

    const toggleCart = async (productId) => {
        try {
            await removeFromCart(productId);
            await fetchProducts();

        } catch (error) {
            console.error("Sepet durumu güncellenirken bir hata oluştu: ", error);
        }
    };

    const calculateTotal = useCallback(() => {
        return products.reduce((total, item) => total + item.product_price, 0);
    }, [products]);

    const makePayment = () => {
        const total = calculateTotal();
        // Implement payment logic here (e.g., call a payment API, navigate to a payment screen, etc.)
        console.log(`Payment made for total: ${total}`);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            // Favori ürünler sayfasından dönüldüğünde ürünleri tekrar çek
            fetchProducts();

        });
        return unsubscribe;
    }, [navigation,fetchProducts]);

    return (
        <View style={styles.container}>
            <Header label="Sepetim" />
            <Text style={styles.headerText}>Sepetteki Ürünler</Text>
            <View style={styles.products}>
                {products.map((product) => (
                    <View key={product.product_id} style={styles.productContainer}>
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{product.product_name}</Text>
                            <Text style={styles.productPrice}>{product.product_price} TL</Text>
                        </View>
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
