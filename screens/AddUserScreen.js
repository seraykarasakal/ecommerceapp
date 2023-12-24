import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { DatabaseConnection } from "../config/database-connection";
import { auth } from "../config/firebase";
import Navbar from "./Navbar";
import Footer from "./Footer";

const db = DatabaseConnection.getConnection();

const AddUserScreen = () => {
    const navigation = useNavigation();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");

    const createUser = () => {
        console.log(firstName, lastName, phoneNumber, address);

        if (!firstName || !lastName || !phoneNumber || !address) {
            alert("Lütfen tüm bilgileri doldurun!");
            return;
        }

        db.transaction(function (tx) {
            tx.executeSql(
                "INSERT INTO table_users (first_name, last_name, phone_number, address) VALUES (?, ?, ?, ?)",
                [firstName, lastName, phoneNumber, address],
                (tx, results) => {
                    console.log("Results", results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        Alert.alert(
                            "Başarılı!",
                            "Kullanıcı kaydı başarıyla eklendi!",
                            [
                                {
                                    text: "Tamam",
                                    onPress: () => navigation.navigate("UserManager"),
                                },
                            ],
                            { cancelable: false }
                        );
                    } else {
                        alert("Kullanıcı kaydı başarısız!");
                    }
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
            <Navbar navigation={navigation} />
            <View style={styles.formContainer}>
                <Text style={styles.text}>Yeni Kullanıcı Oluştur</Text>
                <Text style={styles.label}>isim</Text>
                <TextInput placeholder="İsim Giriniz" onChangeText={(firstName) => setFirstName(firstName)} style={styles.input} />
                <Text style={styles.label}>Soyisim</Text>
                <TextInput placeholder="Soyad Giriniz" onChangeText={(lastName) => setLastName(lastName)} style={styles.input} />
                <Text style={styles.label}>Telefon</Text>
                <TextInput placeholder="Telefon Giriniz" onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)} style={styles.input} />
                <Text style={styles.label}>Adres</Text>
                <TextInput placeholder="Adres Giriniz" onChangeText={(address) => setAddress(address)} style={styles.input} />
                <TouchableOpacity onPress={createUser} style={styles.Button}>
                    <Text style={styles.ButtonText}>Ekle</Text>
                </TouchableOpacity>
            </View>
            <Footer navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: "white",
    },

    formContainer: {
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        flex: 1,
        paddingHorizontal: 8,
        paddingTop: 8,
    },
    form: {
        flex: 1,
        justifyContent: "center",
    },
    label: {
        color: "#555",
        marginLeft: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    input: {
        padding: 20,
        backgroundColor: "#EEE",
        color: "#555",
        borderRadius: 20,
        marginBottom: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },
    Button: {
        backgroundColor: "#FFD700",
        padding: 15,
        borderRadius: 20,
    },
    ButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "black",
        textAlign: "center",
    },
});

export default AddUserScreen;
