import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform, Image, ActivityIndicator } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { DatabaseConnection } from "../config/database-connection";
import { auth, storage } from "../config/firebase";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, uploadBytes, ref } from "firebase/storage";

import Navbar from "./Navbar";
import Header from "./Header";

const db = DatabaseConnection.getConnection();

const AddProductScreen = () => {
    const navigation = useNavigation();
    let [productName, setProductName] = useState("");
    let [productDescription, setProductDescription] = useState("");
    let [productPrice, setProductPrice] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [uri, setUri] = useState(null);
    const pickImage = async () => {
        setIsLoading(true);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setUri(result.assets[0].uri);
            alert("Görsel ekleme işlemi başarılı.Gönder butonuna basınız");
            setIsLoading(false);
        } else {
            setImage(null);
            setIsLoading(false);
        }
    };
    const uploadImageAsync = async (uri) => {
        // Why are we using XMLHttpRequest? See:
        // https://github.com/expo/expo/issues/2402#issuecomment-443726662
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });
        try {
            const storageRef = ref(storage, `Image/${Date.now()}`);
            const result = await uploadBytes(storageRef, blob);
            blob.close();
            return await getDownloadURL(storageRef);
        } catch (error) {
            alert(`error: ${error}`);
        }
    };

    let createProduct = async () => {
        console.log(productName, productDescription, productPrice);

        if (!productName) {
            alert("Lütfen ürün ismi giriniz!");
            return;
        }
        if (!productPrice) {
            alert("Lütfen ürün fiyatı giriniz!");
        }
        let uploadURL = null;
        if (uri) {
            uploadURL = await uploadImageAsync(uri);
            console.log("Upload URL:", uploadURL);
            setImage(uploadURL);
        }

        db.transaction(function (tx) {
            tx.executeSql(
                "INSERT INTO table_products (product_name,product_description,product_price,image_uri) VALUES (?,?,?,?)",
                [productName, productDescription, productPrice, uploadURL],
                (tx, results) => {
                    console.log("Results", results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        Alert.alert(
                            "Başarılı!",
                            "Ürün kaydı başarılı!",
                            [
                                {
                                    text: "Ok",
                                    onPress: () => navigation.navigate("Dashboard"),
                                },
                            ],
                            { cancelable: false }
                        );
                    } else alert("Ürün kaydı başarısız!");
                }
            );
        });
    };
    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Çıkış başarılı olduysa, yönlendirme veya başka bir işlem ekleyebilirsiniz
        } catch (error) {
            console.error("Çıkış yaparken bir hata oluştu: ", error.message);
        }
    };
    return (
        <View style={styles.container}>
            <Header label="Add Product Screen" />
            <Text style={styles.headerText}>Ürün Ekleme</Text>

            {/* <View className="flex-row justify-start">
                <TouchableOpacity onPress={() => navigation.goBack()} className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
                    <ArrowLeftIcon size="20" color="black" />
                </TouchableOpacity>
            </View> */}

            <View style={styles.content}>
                <Text style={styles.productName}>Ürün Adı</Text>
                <TextInput style={styles.product} placeholder="Ürün adı giriniz" onChangeText={(productName) => setProductName(productName)} />
                <Text style={styles.productName}>Ürün Açıklaması</Text>
                <TextInput
                    style={styles.product}
                    placeholder="Ürün açıklama giriniz"
                    onChangeText={(productDescription) => setProductDescription(productDescription)}
                    maxLength={255}
                    numberOfLines={4}
                />
                <Text style={styles.productName}>Ürün Fiyatı</Text>

                <TextInput
                    style={styles.product}
                    placeholder="Ürün fiyatı giriniz"
                    onChangeText={(productPrice) => setProductPrice(productPrice)}
                    maxLength={5}
                    keyboardType="numeric"
                />

                <View style={styles.imgcont}>
                    {!image ? (
                        <>
                            <TouchableOpacity onPress={pickImage} style={styles.pickImage}>
                                {isLoading ? (
                                    <View style={styles.loadingcontainer}>
                                        <ActivityIndicator color={"#ff0000"} animating size={"large"}></ActivityIndicator>
                                    </View>
                                ) : (
                                    <Text style={styles.imagetext}>Görsel Ekleme</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            {image && (
                                <View style={styles.imageContainer}>
                                    <Image source={{ uri: image }} />
                                </View>
                            )}
                        </>
                    )}
                </View>
                <TouchableOpacity style={styles.submitButton} onPress={createProduct}>
                    <Text style={styles.submitButtonText}>Gönder</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity> */}
            </View>
            <Navbar navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    imgcont: {
        borderRadius: 20,
    },
    pickImage: {
        backgroundColor: "#E5E3DD",
        padding: 15,
        marginLeft: 10,
        width: "50%",
        borderRadius: 20,
        marginBottom: 10,
    },
    imagetext: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#374151",
        textAlign: "center",
    },
    imageContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        margin: 20,
        width: 100,
        height: 100,
    },
    images: {
        width: 100,
        height: 100,
        borderRadius: 40,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        marginTop: 16,
        color: "#333",
        marginLeft: 10,
    },
    product: {
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
    productName: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    content: {
        flex: 1,
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
    },
    logoutButton: {
        padding: 10,
        backgroundColor: "red",
        borderRadius: 8,
    },
    submitButton: {
        backgroundColor: "#E5E3DD",
        padding: 15,
        marginLeft: 10,
        width: "50%",
        borderRadius: 20,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#374151",
        textAlign: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default AddProductScreen;
