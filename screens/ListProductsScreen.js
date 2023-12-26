import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeftIcon, ChevronDoubleRightIcon, TrashIcon } from "react-native-heroicons/solid";
import { DatabaseConnection } from '../config/database-connection';
import Navbar from "./Navbar";
const db = DatabaseConnection.getConnection();

const RefreshContext = createContext();

const RefreshProvider = ({ children }) => {
    const [refresh, setRefresh] = useState(false);

    const handleRefresh = () => {
        setRefresh(!refresh);
    };

    return (
        <RefreshContext.Provider value={{ refresh, handleRefresh }}>
            {children}
        </RefreshContext.Provider>
    );
};
const useRefresh = () => {
    return useContext(RefreshContext);
};



const ListProducts = () => {
    const [refresh, setRefresh] = useState(false);



    const navigation = useNavigation();
    let [flatListItems, setFlatListItems] = useState([]);
    const handleRefresh = () => {
        setRefresh(!refresh);
        // FlatList'in otomatik olarak yeniden yüklenmesi için flatListItems state'ini güncelle
        setFlatListItems([...flatListItems]); // Bu, flatListItems'in referansını değiştirecek ve FlatList'i tetikleyecektir
    };
    const handlerPressForDelete = (id) => {
        deleteProduct(id);
        handleRefresh();
    }
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
    }, [isFocused, refresh]);


    let deleteProduct = (id) => {
        console.log(id + ' ID');
        alert('You are going to delete this product!');
        db.transaction((tx) => {
            tx.executeSql(
                'DELETE  FROM table_products WHERE ? = product_id',
                [id],
                (tx, results) => {
                    if (results.rowsAffected > 0) {
                        Alert.alert(
                            'Basarili!',
                            'Ürün silme başarili!',
                            [
                                {
                                    text: 'Ok',
                                    onPress: () => {
                                        handleRefresh();
                                        navigation.navigate('ListProducts');
                                    },
                                },
                            ],
                            { cancelable: true }
                        );
                    } else alert('Ürün silme başarısız!');
                }
            )
        });
    };


    let listProductsView = (item) => {
        return (

            <View
                key={item.product_id}
                style={{ backgroundColor: '#EEE', marginTop: 20, padding: 30, borderRadius: 10 }}>
                <TouchableOpacity onPress={() => navigation.navigate('EditProduct', { id: item.product_id })}>
                    <ChevronDoubleRightIcon size="20" color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteProduct(item.product_id)}>
                    <TrashIcon size="20" color="black" />
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

        <SafeAreaView style={{ flex: 1, backgroundColor: '#877dfa', alignItems: 'center', justifyContent: 'center' }}>
            
                <View style={{ padding: 30 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
                        <ArrowLeftIcon size="20" color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, backgroundColor: 'white', padding: 100 }}>
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
            
            <Navbar navigation={navigation}/>
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