import React, { useState } from "react";
import { View, Switch } from "react-native";
import { Text, List } from "react-native-paper";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text variant="headlineMedium" style={{ textAlign: "center" }}>Settings</Text>

      <List.Item
        title="Enable Notifications"
        left={() => <List.Icon icon="bell" />}
        right={() => (
          <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
        )}
      />

      <List.Item
        title="Dark Mode"
        left={() => <List.Icon icon="theme-light-dark" />}
        right={() => (
          <Switch value={darkMode} onValueChange={setDarkMode} />
        )}
      />
    </View>
  );
}
