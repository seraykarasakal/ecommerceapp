import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ArrowLeftIcon, ChevronDoubleRightIcon } from "react-native-heroicons/solid";
import { DatabaseConnection } from "../config/database-connection";

const db = DatabaseConnection.getConnection();

const ListUsers = () => {
    const navigation = useNavigation();
    const [flatListItems, setFlatListItems] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            db.transaction((tx) => {
                tx.executeSql("SELECT * FROM table_users", [], (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i) {
                        temp.push(results.rows.item(i));
                    }
                    setFlatListItems(temp);
                });
            });
        }
    }, [isFocused]);

    let listUsersView = (item) => {
        return (
            <View key={item.user_id} style={{ backgroundColor: "#EEE", marginTop: 20, padding: 30, borderRadius: 10 }}>
                <TouchableOpacity onPress={() => navigation.navigate("EditUser", { id: item.user_id })}>
                    <ChevronDoubleRightIcon size="20" color="black" />
                </TouchableOpacity>

                <Text style={styles.textheader}>User ID</Text>
                <Text style={styles.textbottom}>{item.user_id}</Text>

                <Text style={styles.textheader}>First Name</Text>
                <Text style={styles.textbottom}>{item.first_name}</Text>

                <Text style={styles.textheader}>Last Name</Text>
                <Text style={styles.textbottom}>{item.last_name}</Text>

                <Text style={styles.textheader}>Phone Number</Text>
                <Text style={styles.textbottom}>{item.phone_number}</Text>

                <Text style={styles.textheader}>Address</Text>
                <Text style={styles.textbottom}>{item.address}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
                    <ArrowLeftIcon size="20" color="black" />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <View style={{ flex: 1 }}>
                    <FlatList
                        style={{ marginTop: 30 }}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                        data={flatListItems}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => listUsersView(item)}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    textheader: {
        color: "#111",
        fontSize: 12,
        fontWeight: "700",
    },
    textbottom: {
        color: "#111",
        fontSize: 18,
    },
});

export default ListUsers;
