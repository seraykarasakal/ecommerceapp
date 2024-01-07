// import { useIsFocused, useNavigation } from "@react-navigation/native";
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { ArrowLeftIcon, ChevronDoubleRightIcon, TrashIcon } from "react-native-heroicons/solid";
// import { DatabaseConnection } from "../config/database-connection";
// import { auth } from "../config/firebase";
// import { signOut } from "firebase/auth";

// import Navbar from "./Navbar";

// const ListProducts = () => {
//     useEffect(() => {
//         const unsubscribe = auth.onAuthStateChanged((user) => {
//             if (user) {
//                 setCurrentUser(user.toJSON());
//             } else {
//                 // Kullanıcı oturum açmamışsa, giriş sayfasına yönlendir
//                 navigation.navigate("Login");
//             }
//         });
//     });
//     const navigation = useNavigation();

//     const handleLogout = async () => {
//         try {
//             await signOut(auth);
//             // Çıkış başarılı olduysa, yönlendirme veya başka bir işlem ekleyebilirsiniz
//         } catch (error) {
//             console.error("Çıkış yaparken bir hata oluştu: ", error.message);
//         }
//     };
//     return (
//         <SafeAreaView style={{ flex: 1, backgroundColor: "#877dfa", alignItems: "center", justifyContent: "center" }}>
//             <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
//                 <Text style={styles.buttonText}>Log Out</Text>
//             </TouchableOpacity>

//             <Navbar navigation={navigation} />
//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     textheader: {
//         color: "#111",
//         fontSize: 12,
//         fontWeight: "700",
//     },
//     textbottom: {
//         color: "#111",
//         fontSize: 18,
//     },
//     logoutButton: {
//         backgroundColor: "#E5E3DD",
//         padding: 15,
//         marginLeft: 10,
//         width: "50%",
//         borderRadius: 20,
//     },
//     buttonText: {
//         fontSize: 18,
//         fontWeight: "bold",
//         color: "#374151",
//         textAlign: "center",
//     },
// });

// export default ListProducts;
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, SafeAreaView, StyleSheet, Text } from "react-native";
import { signOut } from "firebase/auth";

import Navbar from "./Navbar";
import { auth } from "../config/firebase";

const ListProducts = () => {
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user.toJSON());
            } else {
                // Kullanıcı oturum açmamışsa, giriş sayfasına yönlendir
                navigation.navigate("Login");
            }
        });

        return () => {
            // Cleanup the subscription when the component is unmounted
            unsubscribe();
        };
    }, [isFocused, navigation]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Çıkış başarılı olduysa, welcome sayfasına yönlendir
            navigation.navigate("Welcome");
        } catch (error) {
            console.error("Çıkış yaparken bir hata oluştu: ", error.message);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#877dfa", alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.buttonText}>Çıkış Yap</Text>
            </TouchableOpacity>

            <Navbar navigation={navigation} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    logoutButton: {
        backgroundColor: "#E5E3DD",
        padding: 15,
        marginLeft: 10,
        width: "50%",
        borderRadius: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#374151",
        textAlign: "center",
    },
});
export default ListProducts;
