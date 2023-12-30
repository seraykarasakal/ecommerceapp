import { useIsFocused, useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { React, createContext, useEffect, useState } from "react";
import { Alert, Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ArrowLeftIcon, ChevronDoubleRightIcon, TrashIcon } from "react-native-heroicons/solid";
import { DatabaseConnection } from "../config/database-connection";
import { auth } from "../config/firebase";
import Header from "./Header";
import Navbar from "./Navbar";
const db = DatabaseConnection.getConnection();
const RefreshContext = createContext();

const RefreshProvider = ({ children }) => {
    const [refresh, setRefresh] = useState(false);

    const handleRefresh = () => {
        setRefresh(!refresh);
    };

    return <RefreshContext.Provider value={{ refresh, handleRefresh }}>{children}</RefreshContext.Provider>;
};
const useRefresh = () => {
    return useContext(RefreshContext);
};
const DashboardScreen = () => {
    const navigation = useNavigation();
    const [refresh, setRefresh] = useState(false);
    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Çıkış yaparken bir hata oluştu: ", error.message);
        }
    };
    let [flatListItems, setFlatListItems] = useState([]);
    const handleRefresh = () => {
        setRefresh(!refresh);
        setFlatListItems([...flatListItems]);
    };

    const handlerPressForDelete = (id) => {
        deleteProduct(id);
        handleRefresh();
    };

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            db.transaction((tx) => {
                tx.executeSql("SELECT * FROM table_products", [], (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                    }
                    setFlatListItems(temp);
                });
            });
        }
    }, [isFocused, refresh]);
    let deleteProduct = (id) => {
        console.log(id + " ID");
        alert("You are going to delete this product!");
        db.transaction((tx) => {
            tx.executeSql("DELETE  FROM table_products WHERE ? = product_id", [id], (tx, results) => {
                if (results.rowsAffected > 0) {
                    Alert.alert(
                        "Basarili!",
                        "Ürün silme başarili!",
                        [
                            {
                                text: "Ok",
                                onPress: () => {
                                    handleRefresh();
                                    navigation.navigate("ListProducts");
                                },
                            },
                        ],
                        { cancelable: true }
                    );
                } else alert("Ürün silme başarısız!");
            });
        });
    };
    let listProductsView = (item) => {
        return (
            <View key={item.product_id} style={styles.Cartcontainer}>
                <View style={styles.Cartcontainer2}>
                    <View style={styles.product}>
                        <Text style={styles.textheader}>Id</Text>
                        <Text style={styles.textbottom}>{item.product_id}</Text>
                        <ScrollView key={item.product_id} style={styles.card}>
                            <TouchableOpacity onPress={() => navigation.navigate("EditProduct", { id: item.product_id })}>
                                <ChevronDoubleRightIcon size="20" color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteProduct(item.product_id)}>
                                <TrashIcon size="20" color="black" />
                            </TouchableOpacity>
                            <Text style={styles.textheader}>Id</Text>
                            <Text style={styles.textbottom}>{item.product_id}</Text>

                            <Text style={styles.textheader}>Product Name</Text>
                            <Text style={styles.textbottom}>{item.product_name}</Text>

                            <Text style={styles.textheader}>Product Description</Text>
                            <Text style={styles.textbottom}>{item.product_description}</Text>

                            <Text style={styles.textheader}>Product Price</Text>
                            <Text style={styles.textbottom}>{item.product_price}</Text>

                            <Text style={styles.textheader}>Product Description</Text>
                            <Text style={styles.textbottom}>{item.product_description}</Text>
                        </ScrollView>

                        <View style={styles.iconsContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate("EditProduct", { id: item.product_id })}>
                                <ChevronDoubleRightIcon size="20" color="black" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteProduct(item.product_id)}>
                                <TrashIcon size="20" color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Header label="Dashboard Screen" />
            <ScrollView>
                <View style={styles.content}>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ArrowLeftIcon size="20" color="black" />
                    </TouchableOpacity>

                    <FlatList
                        style={{ marginTop: 30, flex: 1 }}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                        data={flatListItems}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => listProductsView(item)}
                    />
                </View>
            </ScrollView>
            <Navbar navigation={navigation} />
        </View>
    );
};
const deviceWidth = Math.round(Dimensions.get("window").width);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#877dfa",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingBottom: 70,
    },
    Cartcontainer: {
        backgroundColor: "red",
        paddingBottom: 100,
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
    Cartcontainer2: {
        flexDirection: "row",
    },
    iconsContainer: {
        flexDirection: "row",
        gap: 7,
        alignSelf: "flex-end",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "flex-end",
    },
    products: {
        flex: 1,
        backgroundColor: "#877dfa",
        justifyContent: "flex-start",
        padding: 10,
        margin: 10,
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
    },
    textheader: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    textbottom: {
        fontSize: 16,
        color: "#666",
    },
    product: {},
    logoutButton: {
        padding: 10,
        backgroundColor: "#F0E68C",
        opacity: 0.9,
        borderRadius: 8,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    textheader: {
        color: "#111",
        fontSize: 12,
        fontWeight: "700",
    },
    textbottom: {
        color: "#111",
        fontSize: 18,
    },
    card: {
        flex: 1,
        width: deviceWidth - 70,
        backgroundColor: "#a29bfe",
        height: 300,
        borderRadius: 20,

        shadowColor: "#000",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.75,
        shadowRadius: 5,
        elevation: 9,
        marginTop: 20,
        padding: 30,
    },
});

export default DashboardScreen;
