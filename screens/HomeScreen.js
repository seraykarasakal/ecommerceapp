import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function HomeScreen() {
    const navigation = useNavigation();

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <View style={styles.container}>
            <Navbar navigation={navigation} />
            <SafeAreaView style={styles.Safecontainer}>
                <View style={styles.content}>
                    <Text style={styles.text}>Home Page - </Text>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <Footer navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    Safecontainer: {
        flex: 1,
    },
    content: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 20,
    },
    logoutButton: {
        padding: 8,
        backgroundColor: "#FF0000",
        borderRadius: 8,
        marginLeft: 5,
    },
    logoutButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});
