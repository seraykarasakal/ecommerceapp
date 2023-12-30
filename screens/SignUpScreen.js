import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";

export default function SignUpScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        try {
            if (email && password) {
                await createUserWithEmailAndPassword(auth, email, password);
                // Kullanıcı başarıyla kayıt olduysa:
                console.log("Kullanıcı başarıyla kayıt oldu");
                Alert.alert("Başarılı", "Kullanıcı başarıyla kayıt oldu.");
            }
        } catch (err) {
            // Firebase tarafından dönen hata kodunu kontrol edin
            if (err.code === "auth/email-already-in-use") {
                console.log("Kullanıcı zaten kayıtlı");
                Alert.alert("Hata", "Kullanıcı zaten kayıtlı.");
                setEmail("");
                setPassword("");
            } else if (err.code === "auth/weak-password") {
                console.log("Zayıf şifre");
                // Zayıf şifre hatası durumunda bir uyarı mesajı gösterin
                Alert.alert("Hata", "Şifre zayıf. Lütfen daha güçlü bir şifre seçin.");
                setPassword("");
            } else {
                console.log("Diğer hata: ", err.message);
                // Diğer hatalar için genel bir hata mesajı gösterin
                Alert.alert("Hata", "Bir hata oluştu. Lütfen tekrar deneyin.");
                setEmail("");
                setPassword("");
            }
        }
    };

    return (
        <View style={[styles.container]}>
            <View style={styles.formContainer}>
                <View style={styles.form}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput style={styles.input} value={email} onChangeText={(value) => setEmail(value)} placeholder="Email" />
                    <Text style={styles.label}>Password</Text>
                    <TextInput style={styles.input} secureTextEntry value={password} onChangeText={(value) => setPassword(value)} placeholder="Password" />
                    <TouchableOpacity style={styles.signUpButton} onPress={handleSubmit}>
                        <Text style={styles.signUpButtonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.orText}>Or</Text>
                <View style={styles.loginLink}>
                    <Text style={styles.loginText}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={[styles.loginText, styles.loginLinkText]}> Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#877dfa",
    },
    formContainer: {
        flex: 1,
        backgroundColor: "white",
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
        paddingTop: 5,
        paddingBottom: 5,
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
    signUpButton: {
        backgroundColor: "#FFD700",
        padding: 15,
        marginTop: 15,
        borderRadius: 20,
    },
    signUpButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#374151",
        textAlign: "center",
    },
    orText: {
        fontSize: 20,
        color: "#555",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },

    loginLink: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 7,
    },
    loginText: {
        color: "#777",
        fontWeight: "600",
    },
    loginLinkText: {
        color: "#FFD700",
        marginLeft: 5,
        marginBottom: 50,
    },
});
