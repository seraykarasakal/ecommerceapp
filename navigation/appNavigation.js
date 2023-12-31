import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import useAuth from "../hooks/useAuth";
import AddProductScreen from "../screens/AddProductScreen";
import AddUserScreen from "../screens/AddUserScreen";
import CartScreen from "../screens/CartScreen";
import DashboardScreen from "../screens/DashboardScreen";
import EditProductScreen from "../screens/EditProductScreen";
import EditUserScreen from "../screens/EditUserScreen";
import FavoriteProductsScreen from "../screens/FavoriteProductsScreen";
import HomeScreen from "../screens/HomeScreen";
import ListProductsScreen from "../screens/ListProductsScreen";
import ListUsersScreen from "../screens/ListUsersScreen";
import LoginScreen from "../screens/LoginScreen";
import PaymentScreen from "../screens/PaymentScreen";
import SignUpScreen from "../screens/SignUpScreen";
import UserManagerScreen from "../screens/UserManagerScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import OrderDetailsScreen from "../screens/OrderDetailsScreen";
import OrdersScreen from "../screens/OrdersScreen";

const Stack = createNativeStackNavigator();
export default function AppNavigation() {
    const { user } = useAuth();

    if (user) {
        // Kullanıcı varsa, rolüne göre yönlendirme yap
        const { email } = user; // Firebase'den gelen kullanıcı bilgilerine göre değiştirin

        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Dashboard" screenOptions={{ animation: "none" }}>
                    {email === "admin@gmail.com" ? (
                        <>
                            <Stack.Screen name="Dashboard" options={{ headerShown: false }} component={DashboardScreen} />
                            <Stack.Screen name="AddProduct" options={{ headerShown: false }} component={AddProductScreen} />
                            <Stack.Screen name="EditProduct" options={{ headerShown: false }} component={EditProductScreen} />
                            <Stack.Screen name="ListProducts" options={{ headerShown: false }} component={ListProductsScreen} />
                        </>
                    ) : (
                        <>
                            <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
                            <Stack.Screen name="UserManager" options={{ headerShown: false }} component={UserManagerScreen} />
                            <Stack.Screen name="AddUser" options={{ headerShown: false }} component={AddUserScreen} />
                            <Stack.Screen name="ListUsers" options={{ headerShown: false }} component={ListUsersScreen} />
                            <Stack.Screen name="EditUser" options={{ headerShown: false }} component={EditUserScreen} />
                            <Stack.Screen name="FavoriteProducts" options={{ headerShown: false }} component={FavoriteProductsScreen} />
                            <Stack.Screen name="Cart" options={{ headerShown: false }} component={CartScreen} />
                            <Stack.Screen name="Payment" options={{ headerShown: false }} component={PaymentScreen} />
                            <Stack.Screen name="OrderDetails" options={{ headerShown: false }} component={OrderDetailsScreen} />
                            <Stack.Screen name="Orders" options={{ headerShown: false }} component={OrdersScreen} />
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        );
    } else {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Welcome" screenOptions={{ animation: "none" }}>
                    <Stack.Screen name="Welcome" options={{ headerShown: false }} component={WelcomeScreen} />
                    <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
                    <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUpScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
