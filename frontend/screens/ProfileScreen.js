import React, { useEffect, useState } from "react";
import { View, Alert } from "react-native";
import { Text, TextInput, Button, Card, Appbar } from "react-native-paper";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useLanguage } from "./LanguageContext"; // Import language context

export default function ProfileScreen({ navigation }) {
  const { language } = useLanguage(); // Get selected language
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
      Alert.alert(
        language === "en" ? "Success" : "සාර්ථකයි",
        language === "en" ? "Profile updated successfully!" : "පැතිකඩ යාවත්කාලීන කරන ලදී!"
      );
    } catch (error) {
      Alert.alert(
        language === "en" ? "Error" : "දෝෂයක්",
        language === "en" ? "Could not update profile." : "පැතිකඩ යාවත්කාලීන කළ නොහැක."
      );
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f4f4f4", marginTop: 40 }}>
      {/* Custom App Bar */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={language === "en" ? "Profile" : "පැතිකඩ"} />
      </Appbar.Header>

      <Card style={{ padding: 20, borderRadius: 15 }}>
        <Card.Content>
          <Text variant="headlineMedium" style={{ marginBottom: 10 }}>
            {language === "en" ? "Edit Profile" : "පැතිකඩ සංස්කරණය"}
          </Text>

          <TextInput
            label={language === "en" ? "Full Name" : "සම්පූර්ණ නම"}
            value={fullName}
            onChangeText={setFullName}
            mode="outlined"
            style={{ marginBottom: 10 }}
          />
          <TextInput
            label={language === "en" ? "Age" : "වයස"}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            mode="outlined"
            style={{ marginBottom: 10 }}
          />
          <TextInput
            label={language === "en" ? "Phone Number" : "දුරකථන අංකය"}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            mode="outlined"
            style={{ marginBottom: 10 }}
          />

          <Button mode="contained" onPress={handleSave} style={{ marginTop: 10 }}>
            {language === "en" ? "Save Changes" : "වෙනස්කම් සුරකින්න"}
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}
