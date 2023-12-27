import React from "react";
import { Dimensions, SafeAreaView, StyleSheet, Text } from 'react-native';


const Header = ({ label }) => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.labelStyle}>Welcome to {label} !</Text>
        </SafeAreaView>
    );
};
const deviceWidth = Math.round(Dimensions.get('window').width);
const styles = StyleSheet.create({
    container: {
        width: deviceWidth,
        height: 90,
        backgroundColor: '#f2e3c6',
        justifyContent: 'flex-end',
        paddingBottom: 20,
        alignItems: 'center',
        borderRadius:30,
        overflow: 'hidden',
    },
    labelStyle: {
        fontSize: 20,
        fontWeight: '700',
    },
});
export default Header;