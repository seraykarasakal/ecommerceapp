import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { HomeIcon, ShoppingCartIcon, UserIcon } from "react-native-heroicons/solid";

const Footer = ({ navigation }) => {
    return (
        <View style={styles.footerContainer}>
            <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => navigation.navigate("Home")}
                activeOpacity={0.7} // Hareketlenme efekti için
            >
                <HomeIcon name="home" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => navigation.navigate("ShoppingCart")}
                activeOpacity={0.7} // Hareketlenme efekti için
            >
                <ShoppingCartIcon name="shopping-cart" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => navigation.navigate("UserManager")}
                activeOpacity={0.7} // Hareketlenme efekti için
            >
                <UserIcon name="user" size={30} color="black" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#ffffff",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
    },
    iconContainer: {
        alignItems: "center",
        padding: 10,
        transform: [{ scale: 1 }], // İlk durumu
    },
});

export default Footer;
