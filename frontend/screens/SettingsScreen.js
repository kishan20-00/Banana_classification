import React, { useState } from "react";
import { View, Switch } from "react-native";
import { Text, List, RadioButton } from "react-native-paper";
import { useLanguage } from "./LanguageContext"; // Import Language Context

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { language, setLanguage } = useLanguage(); // Get language state

  return (
    <View style={{ flex: 1, padding: 20, marginTop: 40 }}>
      <Text variant="headlineMedium" style={{ textAlign: "center" }}>
        {language === "en" ? "Settings" : "සැකසුම්"}
      </Text>

      <List.Item
        title={language === "en" ? "Enable Notifications" : "දැනුම්දීම් සක්රිය කරන්න"}
        left={() => <List.Icon icon="bell" />}
        right={() => (
          <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
        )}
      />

      <List.Item
        title={language === "en" ? "Dark Mode" : "අඳුරු මාදිලිය"}
        left={() => <List.Icon icon="theme-light-dark" />}
        right={() => <Switch value={darkMode} onValueChange={setDarkMode} />}
      />

      <Text variant="titleMedium" style={{ marginTop: 20 }}>
        {language === "en" ? "Select Language" : "භාෂාව තෝරන්න"}
      </Text>

      <RadioButton.Group onValueChange={setLanguage} value={language}>
        <List.Item title="English" left={() => <RadioButton value="en" />} />
        <List.Item title="සිංහල" left={() => <RadioButton value="si" />} />
      </RadioButton.Group>
    </View>
  );
}
