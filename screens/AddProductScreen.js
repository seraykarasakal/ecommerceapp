import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DatabaseConnection } from "../config/database-connection";
import { auth } from "../config/firebase";

const db = DatabaseConnection.getConnection();



const AddProductScreen = () => {
    const navigation = useNavigation();
    let [productName, setProductName] = useState('');
    let [productDescription, setProductDescription] = useState('');
    let [productPrice, setProductPrice] = useState('');
    let createProduct = () => {
        console.log(productName, productDescription, productPrice);

        if (!productName) {
            alert('Lütfen ürün ismi giriniz!');
            return;
        }
        if (!productPrice) {
            alert('Lütfen ürün fiyatı giriniz!');
        }

        db.transaction(function (tx) {
            tx.executeSql(
                'INSERT INTO table_products (product_name,product_description,product_price) VALUES (?,?,?)',
                [productName, productDescription, productPrice],
                (tx, results) => {
                    console.log('Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        Alert.alert(
                            'Basarili!',
                            'Ürün kaydi başarili!',
                            [
                                {
                                    text: 'Ok',
                                    onPress: () => navigation.navigate('Dashboard'),
                                },
                            ],
                            { cancelable: false }
                        );
                    } else alert('Ürün kaydı başarısız!');
                }
            )
        });
    }
    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Çıkış başarılı olduysa, yönlendirme veya başka bir işlem ekleyebilirsiniz
        } catch (error) {
            console.error("Çıkış yaparken bir hata oluştu: ", error.message);
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.text}>Create Product</Text>
                <TextInput placeholder='Ürün adı' onChangeText={
                    (productName => setProductName(productName))
                }
                    style={{ padding: 10 }} />
                <TextInput placeholder='Ürün açıklaması' onChangeText={
                    (productDescription => setProductDescription(productDescription))
                }
                    maxLength={255}
                    numberOfLines={4}
                    multiline= {true}
                    style={{ textAlignVertical: 'top', padding: 10 }} />
                <TextInput placeholder='Ürün fiyatı' onChangeText={
                    (productPrice => setProductPrice(productPrice))
                }
                    maxLength={5}
                    keyboardType="numeric"
                    style={{ padding: 10 }} />
                <Button title="Gönder" onPress={createProduct}/>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default AddProductScreen;
