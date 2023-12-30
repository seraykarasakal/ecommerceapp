import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Alert, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";
import Navbar from "./Navbar";

export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleForgetPassword = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                Alert.alert("Şifre değiştirme maili başarıyla gönderildi");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                if (errorCode === "auth/user-not-found") {
                    Alert.alert("Email bulunamadı lütfen tekrar giriniz");
                } else {
                    console.error(errorMessage);
                }
            });
    };
    const handleSubmit = async () => {
        if (email && password) {
            try {
                // Firebase Authentication kullanarak giriş yap
                await signInWithEmailAndPassword(auth, email, password);

                // Kullanıcı adı admin@gmail.com ve şifre admin ise dashboard'a yönlendir
                if (email === "admin@gmail.com" && password === "admin1") {
                    navigation.navigate("Dashboard"); // Dashboard ekranına yönlendir
                } else {
                    navigation.navigate("Home"); // Home ekranına yönlendir
                }
            } catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;

                if (errorCode === "auth/user-not-found") {
                    Alert.alert("Kullanıcı bulunamadı. Lütfen tekrar giriş yapınız");
                } else if (errorCode === "auth/wrong-password") {
                    // Eğer buraya ulaşıyorsa, kullanıcının şifresi yanlış demektir
                    Alert.alert("Yanlış şifre. Lütfen şifrenizi kontrol edin.");
                } else {
                    Alert.alert("Giriş başarısız. Lütfen tekrar deneyin.");
                }
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <View style={styles.form}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={(value) => setEmail(value)} />
                    <Text style={styles.label}>Password</Text>
                    <TextInput style={styles.input} secureTextEntry placeholder="Password" value={password} onChangeText={(value) => setPassword(value)} />
                    <TouchableOpacity style={styles.forgotPassword} onPress={() => handleForgetPassword()}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSubmit} style={styles.loginButton}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.orText}>Or</Text>
                <View style={styles.signUpLink}>
                    <Text style={styles.signUpText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                        <Text style={[styles.signUpText, styles.signUpLinkText]}> Sign Up</Text>
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
    backButton: {
        position: "absolute",
        top: 20,
        left: 20,
    },
    backButtonIcon: {
        backgroundColor: "#FFD700",
        padding: 10,
        borderRadius: 10,
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
    forgotPassword: {
        alignItems: "flex-end",
        paddingTop: 3,
        paddingBottom: 3,
    },
    forgotPasswordText: {
        color: "#555",
        marginBottom: 5,
    },
    loginButton: {
        backgroundColor: "#FFD700",
        padding: 15,
        borderRadius: 20,
    },
    loginButtonText: {
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
    signUpLink: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 7,
    },
    signUpText: {
        color: "#777",
        fontWeight: "600",
    },
    signUpLinkText: {
        color: "#FFD700",
        marginLeft: 5,
        marginBottom: 50,
    },
});
