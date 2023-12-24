import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

const Navbar = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.backButton}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonIcon}>
                    <ArrowLeftIcon size={20} color="black" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
});

export default Navbar;
