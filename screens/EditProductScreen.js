import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, Button, KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { DatabaseConnection } from "../config/database-connection";
const db = DatabaseConnection.getConnection();
import Header from "./Header";

const EditProduct = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const id = route.params?.id;

    let [productName, setProductName] = useState("");
    let [productDescription, setProductDescription] = useState("");
    let [productPrice, setProductPrice] = useState("");

    let updateAllStates = (name, description, price) => {
        setProductName(name);
        setProductDescription(description);
        setProductPrice(price);
    };

    useEffect(() => {
        console.log(id);
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM table_products where product_id = ? ", [id], (tx, results) => {
                if (results.rows.length > 0) {
                    updateAllStates(results.rows.item(0).product_name, results.rows.item(0).product_description, results.rows.item(0).product_price);
                } else {
                    alert("Ürün bulunamadı");
                    updateAllStates("", "", "");
                }
            });
        });
    }, []);

    let editProduct = () => {
        console.log(id, productName, productDescription, productPrice);

        if (!productName) {
            alert("Lütfen İsim Giriniz");
        }
        if (!productDescription) {
            alert("Lütfen Açıklama Giriniz");
        }
        if (!productPrice) {
            alert("Lütfen Fiyat Giriniz");
        }

        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE table_products set product_name=?, product_description=?, product_price=? where product_id=?",
                [productName, productDescription, productPrice, id],
                (tx, results) => {
                    console.log("Results", results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        Alert.alert(
                            "Başarılı",
                            "Ürün güncelleme başarılı oldu!",
                            [
                                {
                                    text: "Ok",
                                    onPress: () => navigation.navigate("ListProducts"),
                                },
                            ],
                            { cancelable: false }
                        );
                    } else alert("Kullanıcı güncelleme başarısız!");
                }
            );
        });
    };

    // return (
    //     <SafeAreaView style={{ flex: 1 }}>
    //         <View style={{ padding: 20 }}>
    //             <TouchableOpacity onPress={() => navigation.goBack()} className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
    //                 <ArrowLeftIcon size="20" color="black" />
    //             </TouchableOpacity>
    //         </View>
    //         <View style={{ flex: 1, backgroundColor: "white" }}>
    //             <View style={{ flex: 1 }}>
    //                 <ScrollView keyboardShouldPersistTaps="handled">
    //                     <KeyboardAvoidingView behavior="padding" style={{ flex: 1, justifyContent: "space-between" }}>
    //                         <Text> Ürün Güncelleme Ekranı </Text>
    //                         <TextInput
    //                             placeholder="Ürün Adı"
    //                             value={productName}
    //                             editable={true}
    //                             style={{ padding: 10 }}
    //                             onChangeText={(productName) => setProductName(productName)}
    //                         />
    //                         <TextInput
    //                             placeholder="Ürün Açıklaması"
    //                             value={productDescription}
    //                             editable={true}
    //                             maxLength={255}
    //                             numberOfLines={5}
    //                             multiline={true}
    //                             style={{ padding: 10 }}
    //                             onChangeText={(productDescription) => setProductDescription(productDescription)}
    //                         />
    //                         <TextInput
    //                             placeholder="Ürün Fiyatı"
    //                             value={productPrice.toString()}
    //                             editable={true}
    //                             maxLength={5}
    //                             keyboardType="numeric"
    //                             style={{ textAlignVertical: "top", padding: 10 }}
    //                             onChangeText={(productPrice) => setProductPrice(productPrice)}
    //                         />
    //                         <Button title="Ürünü Güncelle" onPress={editProduct} />
    //                     </KeyboardAvoidingView>
    //                 </ScrollView>
    //             </View>
    //         </View>
    //     </SafeAreaView>
    // );
    return (
        <View style={styles.container}>
            <Header label="Ürün Güncelleme " />
            <ScrollView keyboardShouldPersistTaps="handled">
                <KeyboardAvoidingView behavior="padding" style={styles.content}>
                    <Text style={styles.headerText}>Ürün Güncelleme</Text>
                    <TextInput
                        placeholder="Ürün Adı"
                        value={productName}
                        editable={true}
                        style={styles.inputField}
                        onChangeText={(productName) => setProductName(productName)}
                    />
                    <TextInput
                        placeholder="Ürün Açıklaması"
                        value={productDescription}
                        editable={true}
                        maxLength={255}
                        numberOfLines={5}
                        // multiline={true}
                        style={styles.inputField}
                        onChangeText={(productDescription) => setProductDescription(productDescription)}
                    />
                    <TextInput
                        placeholder="Ürün Fiyatı"
                        value={productPrice.toString()}
                        editable={true}
                        maxLength={5}
                        keyboardType="numeric"
                        style={styles.inputField}
                        onChangeText={(productPrice) => setProductPrice(productPrice)}
                    />
                    <TouchableOpacity style={styles.editButton} onPress={editProduct}>
                        <Text style={styles.editButtonText}>Ürünü Güncelle</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },

    content: {
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

    inputField: {
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
        marginLeft: 10,
        fontSize: 18,
        fontWeight: "semibold",
        marginBottom: 8,
        color: "#333",
    },

    editButton: {
        backgroundColor: "#E5E3DD",
        padding: 15,
        marginLeft: 10,
        width: "50%",
        borderRadius: 20,
    },
    editButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#374151",
        textAlign: "center",
    },
});
export default EditProduct;
