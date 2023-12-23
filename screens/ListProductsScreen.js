import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeftIcon, ChevronDoubleRightIcon } from "react-native-heroicons/solid";
import { DatabaseConnection } from '../config/database-connection';

const db = DatabaseConnection.getConnection();

const ListProducts = () => {

    const navigation = useNavigation();
    let [flatListItems, setFlatListItems] = useState([]);
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM table_products',
                    [],
                    (tx, results) => {
                        var temp = [];
                        for (let i = 0; i < results.rows.length; ++i) {
                            temp.push(results.rows.item(i));
                        }
                        setFlatListItems(temp);
                    }
                )
            });
        }
    }, [isFocused]);

    let listProductsView = (item) => {
        return (
            <View
                key={item.product_id}
                style={{ backgroundColor: '#EEE', marginTop: 20, padding: 30, borderRadius: 10 }}>
                <TouchableOpacity onPress={() => navigation.navigate('EditProduct', { id: item.product_id })}>
                    <ChevronDoubleRightIcon size="20" color="black" />
                </TouchableOpacity>
                <Text style={styles.textheader}>Id</Text>
                <Text style={styles.textbottom}>{item.product_id}</Text>

                <Text style={styles.textheader}>Product Name</Text>
                <Text style={styles.textbottom}>{item.product_name}</Text>

                <Text style={styles.textheader}>Product Description</Text>
                <Text style={styles.textbottom}>{item.product_description}</Text>

                <Text style={styles.textheader}>Product Price</Text>
                <Text style={styles.textbottom}>{item.product_price}</Text>


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
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ flex: 1 }}>

                    <FlatList
                        style={{ marginTop: 30 }}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                        data={flatListItems}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => listProductsView(item)}
                    />
                </View>

            </View>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    textheader: {
        color: '#111',
        fontSize: 12,
        fontWeight: '700',

    },
    textbottom: {
        color: '#111',
        fontSize: 18,
    },
});

export default ListProducts;