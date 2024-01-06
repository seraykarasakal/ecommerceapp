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
            <View key={item.product_id} style={styles.card}>
                <View style={styles.productContainer}>
                    <Text style={styles.textheader}>Id</Text>
                    <Text style={styles.textbottom}>{item.product_id}</Text>

                    <Text style={styles.textheader}>Product Name</Text>
                    <Text style={styles.textbottom}>{item.product_name}</Text>

                    <Text style={styles.textheader}>Product Description</Text>
                    <Text style={styles.textbottom}>{item.product_description}</Text>

                    <Text style={styles.textheader}>Product Price</Text>
                    <Text style={styles.textbottom}>{item.product_price}</Text>
                </View>
                <View style={styles.ıconContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("EditProduct", { id: item.product_id })}>
                        <ChevronDoubleRightIcon size="20" color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteProduct(item.product_id)}>
                        <TrashIcon size="20" color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <Header label="Dashboard Screen" />
            <View style={styles.content}>
                <FlatList
                    style={{ marginTop: 30 }}
                    contentContainerStyle={styles.cardContainer}
                    data={flatListItems}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => listProductsView(item)}
                />
            </View>
            <Navbar navigation={navigation} />
        </View>
    );
};
const deviceWidth = Math.round(Dimensions.get("window").width);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingBottom: 10,
    },
    content: {
        backgroundColor: "white",
        margin: 10,
    },
    cardContainer: {
        backgroundColor: "white",
        justifyContent: "space-evenly",
        marginBottom: 6,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#a29bfe",
        borderRadius: 20,
        shadowColor: "grey",
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowOpacity: 0.75,
        marginTop: 20,
        padding: 30,
    },
    ıconContainer: {
        gap: 10,
        flexDirection: "row",
        width: "30%",
        justifyContent: "flex-end",
        alignItems: "flex-start",
    },
    productContainer: {
        width: "70%",
    },

    text: {
        fontSize: 12,
        marginBottom: 20,
    },
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
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 2,
        marginTop: 8,
    },
    textbottom: {
        color: "#111",
        fontSize: 18,
    },
    // card: {
    //     flex: 1,
    //     width: deviceWidth - 70,
    //     backgroundColor: "#a29bfe",
    //     height: 300,
    //     borderRadius: 20,

    //     shadowColor: "#000",
    //     shadowOffset: {
    //         width: 5,
    //         height: 5,
    //     },
    //     shadowOpacity: 0.75,
    //     shadowRadius: 5,
    //     elevation: 9,
    //     marginTop: 20,
    //     padding: 30,
    // },
});

export default DashboardScreen;
