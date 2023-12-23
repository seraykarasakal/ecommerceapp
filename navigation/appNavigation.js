import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import useAuth from "../hooks/useAuth";
import AddProductScreen from "../screens/AddProductScreen";
import DashboardScreen from "../screens/DashboardScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
    const { user } = useAuth();

    if (user) {
        // Kullanıcı varsa, rolüne göre yönlendirme yap
        const { email } = user; // Firebase'den gelen kullanıcı bilgilerine göre değiştirin

        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Dashboard">
                    {email === "admin@gmail.com" ? (
                        <Stack.Screen name="Dashboard" options={{ headerShown: false }} component={DashboardScreen} />
                    ) : (
                        <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        );
    } else {
        return (
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Welcome">
                    <Stack.Screen name="Welcome" options={{ headerShown: false }} component={WelcomeScreen} />
                    <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
                    <Stack.Screen name="Dashboard" options={{ headerShown: false }} component={DashboardScreen} />
                    <Stack.Screen name="AddProduct" options={{ headerShown: false }} component={AddProductScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
