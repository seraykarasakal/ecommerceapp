// import { useNavigation, useRoute } from "@react-navigation/native";
// import React from "react";
// import { StyleSheet, TouchableOpacity, View } from "react-native";
// import { HeartIcon, HomeIcon, ShoppingCartIcon, UserIcon } from "react-native-heroicons/solid";
// const HomeNavbar = () => {
//     const route = useRoute();
//     const navigation = useNavigation();
//     const isHomeScreen = route.name == "Home";
//     const isCartScreen = route.name == "Cart";
//     const isFavoriteProductScreen = route.name == "FavoriteProducts";
//     const isUserManagerScreen = route.name == "UserManager";

//     return (
//         <View style={styles.NavContainer}>
//             <View style={styles.NavBar}>
//                 <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.IconBehave} android_ripple={{ borderless: true, radiues: 50 }}>
//                     <HomeIcon style={[styles.Icon, isHomeScreen ? styles.activeButton : {}]} />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={styles.IconBehave} android_ripple={{ borderless: true, radiues: 50 }}>
//                     <ShoppingCartIcon style={[styles.Icon, isCartScreen ? styles.activeButton : {}]} />
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     onPress={() => navigation.navigate("FavoriteProducts")}
//                     style={styles.IconBehave}
//                     android_ripple={{ borderless: true, radiues: 50 }}
//                 >
//                     <HeartIcon style={[styles.Icon, isFavoriteProductScreen ? styles.activeButton : {}]} />
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                     onPress={() => navigation.navigate("UserManager")}
//                     style={styles.IconBehave}
//                     android_ripple={{ borderless: true, radiues: 50 }}
//                 >
//                     <UserIcon style={[styles.Icon, isUserManagerScreen ? styles.activeButton : {}]} />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };
// const styles = StyleSheet.create({
//     NavContainer: {
//         position: "absolute",
//         alignItems: "center",
//         bottom: 30,
//         paddingLeft: 20,
//         paddingRight: 20,
//     },
//     NavBar: {
//         flexDirection: "row",
//         backgroundColor: "#eee",
//         width: "100%",
//         justifyContent: "space-evenly",
//         borderRadius: 40,
//     },
//     Icon: {
//         height: 26,
//         width: 26,
//         color: "#877dfa",
//     },
//     IconBehave: {
//         padding: 14,
//         backgroundColor: "#eee",
//     },
//     activeButton: {
//         color: "grey",
//     },
// });

// export default HomeNavbar;

import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { HeartIcon, HomeIcon, ShoppingCartIcon, UserIcon } from "react-native-heroicons/solid";
const HomeNavbar = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const isHomeScreen = route.name == "Home";
    const isCartScreen = route.name == "Cart";
    const isFavoriteProductsScreen = route.name == "FavoriteProducts";
    const isUserManagerScreen = route.name == "UserManager";
    return (
        <View style={styles.NavContainer}>
            <View style={styles.NavBar}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.IconBehave} android_ripple={{ borderless: true, radiues: 50 }}>
                    <HomeIcon style={[styles.Icon, isHomeScreen ? styles.activeButton : {}]} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={styles.IconBehave} android_ripple={{ borderless: true, radiues: 50 }}>
                    <ShoppingCartIcon style={[styles.Icon, isCartScreen ? styles.activeButton : {}]} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("FavoriteProducts")}
                    style={styles.IconBehave}
                    android_ripple={{ borderless: true, radiues: 50 }}
                >
                    <HeartIcon style={[styles.Icon, isFavoriteProductsScreen ? styles.activeButton : {}]} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("UserManager")}
                    style={styles.IconBehave}
                    android_ripple={{ borderless: true, radiues: 50 }}
                >
                    <UserIcon style={[styles.Icon, isUserManagerScreen ? styles.activeButton : {}]} />
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
        marginLeft: 35,
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

export default HomeNavbar;
