import React, { useEffect, useState } from "react";
import { Alert, Button, SafeAreaView, View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { auth } from "../config/firebase";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { DatabaseConnection } from "../config/database-connection";

import HomeNavbar from "./HomeNavbar";
import { signOut } from "firebase/auth";
import Header from "./Header";

const db = DatabaseConnection.getConnection();
export default function UserManagerScreen() {
    const navigation = useNavigation();
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordChanged, setPasswordChanged] = useState(false);
    const [error, setError] = useState(null); // Add error state
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user ? user.uid : null;

    let [firstName, setFirstName] = useState("");
    let [lastName, setLastName] = useState("");
    let [phoneNumber, setPhoneNumber] = useState("");
    let [address, setAddress] = useState("");

    let updateAllStates = (name, surname, phone, addr) => {
        setFirstName(name);
        setLastName(surname);
        setPhoneNumber(phone);
        setAddress(addr);
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
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user.toJSON());
            } else {
                // Kullanıcı oturum açmamışsa, giriş sayfasına yönlendir
                navigation.navigate("Login");
            }
        });

        console.log(uid);
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM table_users where user_id = ? ", [uid], (tx, results) => {
                if (results.rows.length > 0) {
                    updateAllStates(
                        results.rows.item(0).first_name,
                        results.rows.item(0).last_name,
                        results.rows.item(0).phone_number,
                        results.rows.item(0).address
                    );
                } else {
                    alert("Kullanıcı bulunamadı");
                    updateAllStates("", "", "", "");
                }
            });
        });
        return () => unsubscribe(); // componentWillUnmount gibi çalışır
    }, [navigation]);

    let editUser = () => {
        console.log(uid, firstName, lastName, phoneNumber, address);

        if (!firstName) {
            alert("Lütfen İsim Giriniz");
            return;
        }
        if (!lastName) {
            alert("Lütfen Soyad Giriniz");
            return;
        }
        if (!phoneNumber) {
            alert("Lütfen Telefon Numarası Giriniz");
            return;
        }
        if (!address) {
            alert("Lütfen Adres Giriniz");
            return;
        }

        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE table_users set first_name=?, last_name=?, phone_number=?, address=? where user_id=?",
                [firstName, lastName, phoneNumber, address, uid],
                (tx, results) => {
                    console.log("Results", results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        Alert.alert(
                            "Başarılı",
                            "Kullanıcı güncelleme başarılı oldu!",
                            [
                                {
                                    text: "Ok",
                                    onPress: () => navigation.navigate("Home"),
                                },
                            ],
                            { cancelable: false }
                        );
                    } else alert("Kullanıcı güncelleme başarısız!");
                }
            );
        });
    };
    const reauthenticateUser = () => {
        const credentials = EmailAuthProvider.credential(currentUser.email, currentPassword);
        return reauthenticateWithCredential(auth.currentUser, credentials);
    };

    const handleChangePassword = () => {
        reauthenticateUser()
            .then(() => {
                const user = auth.currentUser;
                updatePassword(user, newPassword)
                    .then(() => {
                        console.log("Şifre başarıyla güncellendi");
                        setError(null);
                        setPasswordChanged(true);
                        setNewPassword("");
                        setCurrentPassword("");
                    })
                    .catch((error) => {
                        console.error("Şifre Güncelleme Hatası:", error.message);
                        setError("Bir hata oluştu. Lütfen tekrar deneyin.");
                        setPasswordChanged(false); // Hata durumunda başarılı mesajını kaldır
                        setTimeout(() => {
                            setError(null);
                        }, 5000);
                    });
            })
            .catch((error) => {
                setError("Eski şifre hatalı. Lütfen doğru şifreyi girin.");
                setCurrentPassword("");
                setNewPassword("");
                setPasswordChanged(false); // Eski şifre hatalı durumunda başarılı mesajını kaldır
            });
    };

    return (
        <View style={styles.container}>
            <Header label="Kullanıcı Yönetimi" />

            <ScrollView keyboardShouldPersistTaps="handled">
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    <Text style={styles.headerText}> Kullanıcı Güncelleme Ekranı </Text>
                    <TextInput
                        placeholder="İsim"
                        value={firstName}
                        editable={true}
                        style={styles.input}
                        onChangeText={(firstName) => setFirstName(firstName)}
                    />
                    <TextInput placeholder="Soyad" value={lastName} editable={true} style={styles.input} onChangeText={(lastName) => setLastName(lastName)} />
                    <TextInput
                        placeholder="Telefon Numarası"
                        value={phoneNumber}
                        editable={true}
                        style={styles.input}
                        onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
                    />
                    <TextInput placeholder="Adres" value={address} editable={true} style={styles.input} onChangeText={(address) => setAddress(address)} />
                    <TouchableOpacity onPress={editUser} style={styles.logoutButton}>
                        <Text style={styles.buttonText}>Kullanıcıyı Güncelle</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>

                <Text style={styles.headerText}> Şifre Güncelleme Ekranı </Text>
                {currentUser ? (
                    <View>
                        <Text style={styles.Email}>Email: {currentUser.email}</Text>
                        {error && <Text style={styles.errorText}>{error}</Text>}
                        <TextInput
                            style={styles.input}
                            placeholder="Eski Şifre"
                            secureTextEntry
                            value={currentPassword}
                            onChangeText={(text) => setCurrentPassword(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Yeni Şifre"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={(text) => setNewPassword(text)}
                        />
                        {passwordChanged && <Text style={styles.successMessage}>Şifreniz başarıyla değiştirildi!</Text>}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}>
                                <Text style={styles.changePasswordText}>Şifreyi Değiştir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <Text>Oturum açmış bir kullanıcı yok.</Text>
                )}
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.buttonText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
            <HomeNavbar navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    userInfo: {
        padding: 20,
    },
    Email: {
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "#E5E3DD",
        padding: 16,
        borderRadius: 8,
        backgroundColor: "#fff",

        color: "#333",
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        marginTop: 16,
        color: "#333",
        marginLeft: 10,
    },
    input: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "#E5E3DD",
        padding: 16,
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    buttonContainer: {
        gap: 10,
    },
    changePasswordButton: {
        backgroundColor: "#E5E3DD",
        padding: 15,
        marginLeft: 10,
        width: "50%",
        borderRadius: 20,
        marginBottom: 10,
    },
    changePasswordText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#374151",
        textAlign: "center",
    },
    logoutButton: {
        backgroundColor: "#E5E3DD",
        padding: 15,
        marginLeft: 10,
        width: "50%",
        borderRadius: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#374151",
        textAlign: "center",
    },
    successMessage: {
        color: "green",
        marginBottom: 10,
        marginLeft: 10,
    },
    errorText: {
        marginLeft: 10,
        marginBottom: 10,

        color: "red",
        marginTop: 10,
    },
});
