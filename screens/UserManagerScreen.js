import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import { getAuth, updatePassword } from "firebase/auth";

export default function UserManagerScreen() {
    const navigation = useNavigation();
    const [currentUser, setCurrentUser] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [passwordChanged, setPasswordChanged] = useState(false);

    const handleChangePassword = () => {
        // Kullanıcının girdiği yeni şifreyi kullanarak güncelleme yap
        const user = auth.currentUser;
        updatePassword(user, newPassword)
            .then(() => {
                console.log("Şifre başarıyla güncellendi");
                setPasswordChanged(true);
                setNewPassword(""); // Şifre değiştirildikten sonra giriş alanını sıfırla
            })
            .catch((error) => {
                console.error("Şifre Güncelleme Hatası:", error.message);
            });
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

    return (
        <View style={styles.container}>
            {currentUser ? (
                <View style={styles.userInfo}>
                    <Text>Email: {currentUser.email}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Yeni Şifre"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={(text) => setNewPassword(text)}
                    />
                    <TouchableOpacity onPress={handleChangePassword}>
                        <Text style={styles.changePasswordText}>Şifreyi Değiştir</Text>
                    </TouchableOpacity>
                    {passwordChanged && <Text style={styles.successMessage}>Şifreniz başarıyla değiştirildi!</Text>}
                </View>
            ) : (
                <Text>Oturum açmış bir kullanıcı yok.</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    userInfo: {
        padding: 20,
        backgroundColor: "#EEE",
        borderRadius: 10,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
    },
    changePasswordText: {
        color: "blue",
        marginTop: 10,
    },
});
