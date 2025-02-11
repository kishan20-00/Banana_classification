import React, { useEffect, useState } from "react";
import { View, ImageBackground, Alert } from "react-native";
import { Text, Button, Card, Appbar } from "react-native-paper";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function HomeScreen({ navigation }) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().fullName);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1570931668003-1e6e1163f8e1" }}
      style={{ flex: 1 }}
    >
      {/* Custom App Bar */}
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Banana Classification" />
        <Appbar.Action icon="account" onPress={() => navigation.navigate("Profile")} />
      </Appbar.Header>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Card style={{ padding: 20, borderRadius: 15, backgroundColor: "rgba(255, 255, 255, 0.9)", width: "90%" }}>
          <Card.Content>
            <Text variant="headlineMedium" style={{ fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>
              Welcome, {userName || "User"}! 🍌
            </Text>
            <Text variant="bodyMedium" style={{ textAlign: "center", marginBottom: 20 }}>
              Identify the type of banana with AI-powered classification.
            </Text>

            <Button mode="contained" onPress={() => navigation.navigate("Banana")} style={{ marginBottom: 10 }}>
              Classify Banana 🍌
            </Button>
            <Button mode="outlined" onPress={handleLogout}>
              Logout
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ImageBackground>
  );
}
