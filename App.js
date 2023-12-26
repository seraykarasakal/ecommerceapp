import React, { useEffect } from "react";
import { DatabaseConnection } from "./config/database-connection";
import AppNavigation from "./navigation/appNavigation";

const db = DatabaseConnection.getConnection();

// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from './screens/HomeScreen';
// import GameStore from './screens/gameStore';

// const Tab = createBottomTabNavigator();

export default function App() {
    useEffect(() => {
        db.transaction(function (txn) {
            txn.executeSql(
                "CREATE TABLE IF NOT EXISTS table_products(product_id INTEGER PRIMARY KEY AUTOINCREMENT, product_name VARCHAR(30), product_description VARCHAR(255), product_price INT(5) )",
                []
            );
        });
        db.transaction(function (txn) {
            txn.executeSql(
                "CREATE TABLE IF NOT EXISTS table_users(user_id INTEGER PRIMARY KEY AUTOINCREMENT, first_name VARCHAR(30), last_name VARCHAR(30), phone_number VARCHAR(15), address VARCHAR(255))",
                []
            );
        });

        // Favori ürünler tablosu oluşturuluyor
        db.transaction(function (txn) {
            txn.executeSql("CREATE TABLE IF NOT EXISTS favorites(id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER)", []);
        });

        db.transaction(function (txn) {
            txn.executeSql("CREATE TABLE IF NOT EXISTS table_cart(id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER)", []);
        });
    }, []);

    return <AppNavigation />;
}
