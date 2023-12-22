import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import DashboardScreen from "../screens/DashboardScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import useAuth from "../hooks/useAuth";

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
                    <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUpScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
