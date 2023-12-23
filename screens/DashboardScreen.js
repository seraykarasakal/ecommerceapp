import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import React from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DatabaseConnection } from "../config/database-connection";
import { auth } from "../config/firebase";
const db = DatabaseConnection.getConnection();


const DashboardScreen = () => {
    const navigation = useNavigation();
    
    const navigateToAddProduct = () => {
        navigation.navigate('AddProduct');
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
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.text}>Dashboard Page</Text>
                <Button title='Create Product' onPress={navigateToAddProduct}  />
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
    },
    logoutButton: {
        padding: 10,
        backgroundColor: "red",
        borderRadius: 8,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default DashboardScreen;
