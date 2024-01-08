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
                "CREATE TABLE IF NOT EXISTS table_products(product_id INTEGER PRIMARY KEY AUTOINCREMENT, product_name VARCHAR(30), product_description VARCHAR(255), product_price INT(5), image_uri VARCHAR)",
                []
            );
        });
        db.transaction(function (txn) {
            txn.executeSql(
                "CREATE TABLE IF NOT EXISTS table_users(user_id VARCHAR(64) PRIMARY KEY, first_name VARCHAR(30) NULL, last_name VARCHAR(30) NULL, phone_number VARCHAR(15) NULL, address VARCHAR(255) NULL)",
                []
            );
        });

        // Favori ürünler tablosu oluşturuluyor
        db.transaction(function (txn) {
            txn.executeSql("CREATE TABLE IF NOT EXISTS favorites(product_id INTEGER, user_id VARCHAR(64))", []);
        });

        db.transaction(function (txn) {
            txn.executeSql("CREATE TABLE IF NOT EXISTS table_cart(product_id INTEGER, user_id VARCHAR(64))", []);
        });

        db.transaction(function (txn) {
            console.log("order tablosu oluşturuluor");
            txn.executeSql(
                "CREATE TABLE IF NOT EXISTS table_orders(order_id INTEGER PRIMARY KEY AUTOINCREMENT, user_id VARCHAR(64), order_date DATETIME, total_amount INTEGER )",
                []
            );
        });
        db.transaction(function (txn) {
            console.log("order tablosu oluşturuluor");
            txn.executeSql(
                "CREATE TABLE IF NOT EXISTS order_items(order_item_id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER, product_id INTEGER, quantity INTEGER NULL )",
                []
            );
        });
    }, []);

    return <AppNavigation />;
}
