import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

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
            <Text>Payment Details</Text>
            <TextInput style={styles.input} placeholder="Card Number" keyboardType="numeric" value={cardNumber} onChangeText={(text) => setCardNumber(text)} />
            <TextInput style={styles.input} placeholder="Expiry Date" value={expiryDate} onChangeText={(text) => setExpiryDate(text)} />
            <TextInput style={styles.input} placeholder="CVV" keyboardType="numeric" value={cvv} onChangeText={(text) => setCvv(text)} />
            <Button title="Make Payment" onPress={handlePayment} />

            {paymentSuccess && <Text style={styles.successText}>Ödeme başarılı!</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: "center",
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 8,
    },
    successText: {
        marginTop: 20,
        fontSize: 18,
        color: "green",
        textAlign: "center",
    },
});

export default PaymentScreen;
