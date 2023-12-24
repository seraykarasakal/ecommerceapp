import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Let's Get Started!</Text>
                <View style={styles.imageContainer}>
                    <Image source={require("../assets/images/welcome.png")} style={styles.image} />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("SignUp")} style={styles.button}>
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text style={[styles.loginText, styles.loginLink]}> Log In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#877dfa",
    },
    content: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
        marginVertical: 20,
    },
    title: {
        color: "white",
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 350,
        height: 350,
        borderRadius: 10,
    },
    buttonContainer: {
        alignItems: "center",
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        backgroundColor: "#FFD700",
        borderRadius: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#374151",
    },
    loginContainer: {
        flexDirection: "row",
        marginTop: 15,
        alignItems: "center",
    },
    loginText: {
        color: "white",
        fontWeight: "600",
    },
    loginLink: {
        color: "#FFD700",
        marginLeft: 5,
    },
});
