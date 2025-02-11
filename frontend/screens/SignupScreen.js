import React, { useState } from "react";
import { View, Alert } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!fullName || !age || !phone || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        age,
        phone,
        email,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Signup successful!", "You can now log in.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Signup failed", error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f4f4f4" }}>
      <Card style={{ padding: 20, borderRadius: 10 }}>
        <Card.Content>
          <Text variant="titleLarge" style={{ marginBottom: 10 }}>Signup</Text>
          
          <TextInput label="Full Name" value={fullName} onChangeText={setFullName} mode="outlined" style={{ marginBottom: 10 }} />
          <TextInput label="Age" value={age} onChangeText={setAge} keyboardType="numeric" mode="outlined" style={{ marginBottom: 10 }} />
          <TextInput label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" mode="outlined" style={{ marginBottom: 10 }} />
          <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" mode="outlined" style={{ marginBottom: 10 }} />
          <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry mode="outlined" style={{ marginBottom: 10 }} />
          
          <Button mode="contained" onPress={handleSignup} style={{ marginBottom: 10 }}>Signup</Button>
          <Button mode="text" onPress={() => navigation.navigate("Login")}>Already have an account? Login</Button>
        </Card.Content>
      </Card>
    </View>
  );
}
