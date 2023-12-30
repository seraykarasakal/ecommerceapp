import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import HomeNavbar from "./HomeNavbar";

const PaymentScreen = () => {
    const navigation = useNavigation();
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handlePayment = async () => {
        try {
            if (!cardNumber || !expiryDate || !cvv) {
                console.log("Lütfen tüm kart bilgilerini doldurun.");
                return;
            }

            const simulatedApiResponse = { status: "success", message: "Ödeme başarılı!" };
            const response = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(simulatedApiResponse);
                }, 1000);
            });

            if (response.status === "success") {
                console.log("Ödeme başarılı!");
                setPaymentSuccess(true);
            } else {
                console.log("Ödeme başarısız. Lütfen tekrar deneyin.");
            }
        } catch (error) {
            console.error("Ödeme işlemi sırasında hata:", error);
        }
    };

    useEffect(() => {
        if (paymentSuccess) {
            // Ödeme başarılıysa, 2 saniye sonra sepet ekranına geri dön
            const timer = setTimeout(() => {
                navigation.goBack(); // veya istediğiniz sayfaya yönlendirme yapabilirsiniz
            }, 2000);

            return () => clearTimeout(timer); // Temizleme işlemi
        }
    }, [paymentSuccess, navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Ödeme Bilgileri</Text>
            <TextInput
                style={styles.input}
                placeholder="Kart Numarası"
                keyboardType="numeric"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(text)}
            />
            <TextInput style={styles.input} placeholder="Son Kullanma Tarihi" value={expiryDate} onChangeText={(text) => setExpiryDate(text)} />
            <TextInput style={styles.input} placeholder="CVV" keyboardType="numeric" value={cvv} onChangeText={(text) => setCvv(text)} />
            <TouchableOpacity style={styles.paymentButton} onPress={() => navigation.navigate("Payment")}>
                <Text style={styles.paymentButtonText} onPress={handlePayment}>
                    Ödemeyi Gerçekleştir
                </Text>
            </TouchableOpacity>
            {paymentSuccess && <Text style={styles.successText}>Ödeme başarılı!</Text>}
            <HomeNavbar navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white",
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#333",
        textAlign: "center",
    },
    input: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "#E5E3DD",
        padding: 16,
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    successText: {
        marginTop: 20,
        fontSize: 18,
        color: "green",
        textAlign: "center",
    },
    paymentButton: {
        backgroundColor: "#E5E3DD",
        padding: 15,
        marginLeft: 10,
        width: "50%",
        borderRadius: 20,
    },
    paymentButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#374151",
        textAlign: "center",
    },
});

export default PaymentScreen;
