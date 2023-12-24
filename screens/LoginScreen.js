import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Alert } from "react-native";
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
                // Password reset email sent!
                Alert.alert("Password reset link is sent successfully");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                if (errorCode === "auth/user-not-found") {
                    // Kullanıcı bulunamadı, yani email adresi hatalı
                    Alert.alert("User not found. Please check your email address.");
                } else {
                    // Diğer hatalar
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
                    // Dashboard ekranına yönlendirme kodu buraya eklenebilir
                    navigation.navigate("Dashboard"); // Dashboard ekranına yönlendir
                } else {
                    // Diğer kullanıcılar için home ekranına yönlendirme kodu buraya eklenebilir
                    navigation.navigate("Home"); // Home ekranına yönlendir
                }
            } catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;

                if (errorCode === "auth/user-not-found") {
                    Alert.alert("User not found. Please check your email address.");
                } else if (errorCode === "auth/wrong-password") {
                    Alert.alert("Incorrect password. Please check your password.");
                } else {
                    Alert.alert("Login failed. Please try again later.");
                    console.error(errorMessage);
                }
            }
        }
    };

    return (
        <View style={styles.container}>
            <Navbar navigation={navigation} />
            <View style={styles.formContainer}>
                <View style={styles.form}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput style={styles.input} placeholder="email" value={email} onChangeText={(value) => setEmail(value)} />
                    <Text style={styles.label}>Password</Text>
                    <TextInput style={styles.input} secureTextEntry placeholder="password" value={password} onChangeText={(value) => setPassword(value)} />
                    <TouchableOpacity style={styles.forgotPassword} onPress={() => handleForgetPassword()}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSubmit} style={styles.loginButton}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.orText}>Or</Text>
                <View style={styles.socialButtons}>
                    <TouchableOpacity style={styles.socialButton}>
                        <Image source={require("../assets/icons/google.png")} style={styles.socialIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <Image source={require("../assets/icons/apple.png")} style={styles.socialIcon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <Image source={require("../assets/icons/facebook.png")} style={styles.socialIcon} />
                    </TouchableOpacity>
                </View>
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
        paddingTop: 15,
    },
    safeArea: {
        padding: 50,
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
    logoContainer: {
        flex: 1,
        alignItems: "center",
    },
    logo: {
        width: 200,
        height: 200,
    },
    formContainer: {
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 8,
        paddingTop: 8,
    },
    form: {
        flex: 1,
        justifyContent: "center",
        paddingTop: 20,
    },
    label: {
        color: "#555",
        marginLeft: 20,
    },
    input: {
        padding: 20,
        backgroundColor: "#EEE",
        color: "#555",
        borderRadius: 20,
        marginBottom: 10,
    },
    forgotPassword: {
        alignItems: "flex-end",
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
        marginTop: 20,
        marginBottom: 10,
    },
    socialButtons: {
        flexDirection: "row",
        justifyContent: "center",
        spaceBetween: 12,
    },
    socialButton: {
        padding: 10,
        backgroundColor: "#EEE",
        borderRadius: 20,
    },
    socialIcon: {
        width: 40,
        height: 40,
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
