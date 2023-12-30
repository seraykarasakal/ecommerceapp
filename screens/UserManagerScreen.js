import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../config/firebase";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import HomeNavbar from "./HomeNavbar";
import { signOut } from "firebase/auth";

export default function UserManagerScreen() {
    const navigation = useNavigation();
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordChanged, setPasswordChanged] = useState(false);
    const [error, setError] = useState(null); // Add error state

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

        return () => unsubscribe(); // componentWillUnmount gibi çalışır
    }, [navigation]);

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
            {currentUser ? (
                <View style={styles.userInfo}>
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
                        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                            <Text style={styles.buttonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <Text>Oturum açmış bir kullanıcı yok.</Text>
            )}

            <HomeNavbar navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white",
    },
    userInfo: {
        padding: 20,
    },
    Email: {
        marginBottom: 16,
        marginLeft: 10,
        marginRight: 10,
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    input: {
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
    buttonContainer: {
        gap: 10,
    },
    changePasswordButton: {
        backgroundColor: "#E5E3DD",
        padding: 15,
        marginLeft: 10,
        width: "50%",
        borderRadius: 20,
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
