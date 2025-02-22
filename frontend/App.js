import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert } from "react-native";
import { auth } from "./firebaseConfig";

import { LanguageProvider, useLanguage } from "./screens/LanguageContext"; // Import Language Provider
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import BananaClassificationScreen from "./screens/BananaClassificationScreen"

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BottomTabs() {
  const { language } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#fff", height: 80 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "bold" },
        tabBarActiveTintColor: "#009688",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          tabBarLabel: language === "en" ? "Home" : "මුල් පිටුව", // Dynamic label
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
          ),
          tabBarLabel: language === "en" ? "Notifications" : "දැනුම්දීම්", // Dynamic label
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
          tabBarLabel: language === "en" ? "Settings" : "සැකසුම්", // Dynamic label
        }}
      />
      {/* 🔹 Logout Button */}
      <Tab.Screen
        name="Logout"
        component={HomeScreen} // Using HomeScreen as a placeholder, no actual UI needed
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault(); // Prevent navigation
            Alert.alert(
              language === "en" ? "Logout" : "ලොග් අවුට් වන්න",
              language === "en"
                ? "Are you sure you want to log out?"
                : "ඔබට ලොග් අවුට් වීමට ඇවැසිද?",
              [
                { text: language === "en" ? "Cancel" : "අවලංගු කරන්න", style: "cancel" },
                {
                  text: language === "en" ? "Logout" : "ලොග් අවුට්",
                  onPress: () => {
                    auth.signOut().then(() => {
                      navigation.replace("Login"); // Redirect to Login screen
                    });
                  },
                },
              ]
            );
          },
        })}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="logout" color={color} size={size} />
          ),
          tabBarLabel: language === "en" ? "Logout" : "ලොග් අවුට්",
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Main" component={BottomTabs} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Banana" component={BananaClassificationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
}
