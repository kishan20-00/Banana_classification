import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { Text, TextInput, Button, Card, Appbar } from "react-native-paper";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ProfileScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFullName(userData.fullName);
          setAge(userData.age);
          setPhone(userData.phone);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await updateDoc(doc(db, "users", user.uid), {
        fullName,
        age,
        phone,
      });
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Could not update profile.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f4f4f4" }}>
      {/* Custom App Bar */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Profile" />
      </Appbar.Header>

      <Card style={{ padding: 20, borderRadius: 15 }}>
        <Card.Content>
          <Text variant="headlineMedium" style={{ marginBottom: 10 }}>Edit Profile</Text>

          <TextInput label="Full Name" value={fullName} onChangeText={setFullName} mode="outlined" style={{ marginBottom: 10 }} />
          <TextInput label="Age" value={age} onChangeText={setAge} keyboardType="numeric" mode="outlined" style={{ marginBottom: 10 }} />
          <TextInput label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" mode="outlined" style={{ marginBottom: 10 }} />

          <Button mode="contained" onPress={handleSave} style={{ marginTop: 10 }}>Save Changes</Button>
        </Card.Content>
      </Card>
    </View>
  );
}
