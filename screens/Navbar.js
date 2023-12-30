import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { HeartIcon, HomeIcon, ShoppingCartIcon, UserIcon, Bars3Icon, PlusIcon } from "react-native-heroicons/solid";
const Navbar = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const isDashboardScreen = route.name == "Dashboard";
    const isAddProductScreen = route.name == "AddProduct";
    const isListProductsScreen = route.name == "ListProducts";

    return (
        <View style={styles.NavContainer}>
            <View style={styles.NavBar}>
                <TouchableOpacity onPress={() => navigation.navigate("Dashboard")} style={styles.IconBehave} android_ripple={{ borderless: true, radiues: 50 }}>
                    <HomeIcon style={[styles.Icon, isDashboardScreen ? styles.activeButton : {}]} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("AddProduct")}
                    style={styles.IconBehave}
                    android_ripple={{ borderless: true, radiues: 50 }}
                >
                    <PlusIcon style={[styles.Icon, isAddProductScreen ? styles.activeButton : {}]} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("ListProducts")}
                    style={styles.IconBehave}
                    android_ripple={{ borderless: true, radiues: 50 }}
                >
                    <Bars3Icon style={[styles.Icon, isListProductsScreen ? styles.activeButton : {}]} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    NavContainer: {
        position: "absolute",
        alignItems: "center",
        bottom: 30,
    },
    NavBar: {
        flexDirection: "row",
        backgroundColor: "#eee",
        width: "90%",
        justifyContent: "space-evenly",
        borderRadius: 40,
    },
    Icon: {
        height: 26,
        width: 26,
        color: "#877dfa",
    },
    IconBehave: {
        padding: 14,
        backgroundColor: "#eee",
    },
    activeButton: {
        color: "black",
    },
});

export default Navbar;
