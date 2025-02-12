import React, { useState } from "react";
import { View, Alert, Keyboard, ActivityIndicator } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // ⬅️ Loading state

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    Keyboard.dismiss(); // ⬅️ Hide keyboard

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Login successful!");
      navigation.replace("Main"); // ⬅️ Ensures no back navigation to login
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      if (error.code === "auth/invalid-email") errorMessage = "Invalid email format.";
      if (error.code === "auth/user-not-found") errorMessage = "No account found with this email.";
      if (error.code === "auth/wrong-password") errorMessage = "Incorrect password.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f4f4f4" }}>
      <Card style={{ padding: 20, borderRadius: 10 }}>
        <Card.Content>
          <Text variant="titleLarge" style={{ marginBottom: 10 }}>Login</Text>

          <TextInput 
            label="Email" 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address" 
            autoCapitalize="none"
            mode="outlined" 
            style={{ marginBottom: 10 }} 
          />

          <TextInput 
            label="Password" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry 
            mode="outlined" 
            style={{ marginBottom: 10 }} 
          />

          {/* Show loading indicator when signing in */}
          {loading ? (
            <ActivityIndicator size="large" color="#6200ea" />
          ) : (
            <>
              <Button mode="contained" onPress={handleLogin} style={{ marginBottom: 10 }}>Login</Button>
              <Button mode="text" onPress={() => navigation.navigate("Signup")}>Don't have an account? Signup</Button>
            </>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}
