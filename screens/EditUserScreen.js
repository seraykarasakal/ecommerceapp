import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, Button, KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { DatabaseConnection } from "../config/database-connection";
import Navbar from "./Navbar";

const db = DatabaseConnection.getConnection();

const EditUser = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user ? user.uid : null;
    const navigation = useNavigation();
    const route = useRoute();

    let [firstName, setFirstName] = useState("");
    let [lastName, setLastName] = useState("");
    let [phoneNumber, setPhoneNumber] = useState("");
    let [address, setAddress] = useState("");

    let updateAllStates = (name, surname, phone, addr) => {
        setFirstName(name);
        setLastName(surname);
        setPhoneNumber(phone);
        setAddress(addr);
    };

    useEffect(() => {
        console.log(uid);
        db.transaction((tx) => {
            tx.executeSql("SELECT * FROM table_users where user_id = ? ", [uid], (tx, results) => {
                if (results.rows.length > 0) {
                    updateAllStates(
                        results.rows.item(0).first_name,
                        results.rows.item(0).last_name,
                        results.rows.item(0).phone_number,
                        results.rows.item(0).address
                    );
                } else {
                    alert("Kullanıcı bulunamadı");
                    updateAllStates("", "", "", "");
                }
            });
        });
    }, []);

    let editUser = () => {
        console.log(uid, firstName, lastName, phoneNumber, address);

        if (!firstName) {
            alert("Lütfen İsim Giriniz");
            return;
        }
        if (!lastName) {
            alert("Lütfen Soyad Giriniz");
            return;
        }
        if (!phoneNumber) {
            alert("Lütfen Telefon Numarası Giriniz");
            return;
        }
        if (!address) {
            alert("Lütfen Adres Giriniz");
            return;
        }

        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE table_users set first_name=?, last_name=?, phone_number=?, address=? where user_id=?",
                [firstName, lastName, phoneNumber, address, uid],
                (tx, results) => {
                    console.log("Results", results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        Alert.alert(
                            "Başarılı",
                            "Kullanıcı güncelleme başarılı oldu!",
                            [
                                {
                                    text: "Ok",
                                    onPress: () => navigation.navigate("ListUsers"),
                                },
                            ],
                            { cancelable: false }
                        );
                    } else alert("Kullanıcı güncelleme başarısız!");
                }
            );
        });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ padding: 20 }}>
                <Navbar navigation={navigation} />
            </View>
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <View style={{ flex: 1 }}>
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <KeyboardAvoidingView behavior="padding" style={{ flex: 1, justifyContent: "space-between" }}>
                            <Text> Kullanıcı Güncelleme Ekranı </Text>
                            <TextInput
                                placeholder="İsim"
                                value={firstName}
                                editable={true}
                                style={{ padding: 10 }}
                                onChangeText={(firstName) => setFirstName(firstName)}
                            />
                            <TextInput
                                placeholder="Soyad"
                                value={lastName}
                                editable={true}
                                style={{ padding: 10 }}
                                onChangeText={(lastName) => setLastName(lastName)}
                            />
                            <TextInput
                                placeholder="Telefon Numarası"
                                value={phoneNumber}
                                editable={true}
                                style={{ padding: 10 }}
                                onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
                            />
                            <TextInput
                                placeholder="Adres"
                                value={address}
                                editable={true}
                                style={{ padding: 10 }}
                                onChangeText={(address) => setAddress(address)}
                            />
                            <Button title="Kullanıcıyı Güncelle" onPress={editUser} />
                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default EditUser;
