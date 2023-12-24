import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import Navbar from "./Navbar";

export default function SignUpScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async () => {
        if (email && password) {
            try {
                await createUserWithEmailAndPassword(auth, email, password);
            } catch (err) {
                console.log("got error: ", err.message);
            }
        }
    };

    return (
        <View style={[styles.container]}>
            <Navbar navigation={navigation} />
            <View style={styles.formContainer}>
                <View style={styles.form}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput style={styles.input} value={email} onChangeText={(value) => setEmail(value)} placeholder="Enter Email" />
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        value={password}
                        onChangeText={(value) => setPassword(value)}
                        placeholder="Enter Password"
                    />
                    <TouchableOpacity style={styles.signUpButton} onPress={handleSubmit}>
                        <Text style={styles.signUpButtonText}>Sign Up</Text>
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
        paddingTop: 15,
        backgroundColor: "#877dfa",
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
    signUpButton: {
        backgroundColor: "#FFD700",
        padding: 15,
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
