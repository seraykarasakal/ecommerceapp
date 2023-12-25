import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function UserManagerScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Navbar navigation={navigation} />
            <View style={styles.formContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("AddUser")}>
                    <Text style={styles.Text}>Yeni Kullanıcı Ekle</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("ListUsers")}>
                    <Text style={styles.Text}>Kullanıcıları listele</Text>
                </TouchableOpacity>
            </View>
            <Footer navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },

    formContainer: {
        flex: 1,
        paddingHorizontal: 8,
    },
    form: {
        flex: 1,
        justifyContent: "center",
    },
    label: {
        color: "#555",
        marginLeft: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    input: {
        padding: 20,
        backgroundColor: "#EEE",
        color: "#555",
        borderRadius: 20,
        marginBottom: 10,
    },
    Text: {
        color: "#BBB",
    },
});
