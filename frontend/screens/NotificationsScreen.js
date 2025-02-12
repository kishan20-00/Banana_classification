import React, { useState } from "react";
import { View, FlatList } from "react-native";
import { Text, Card } from "react-native-paper";

export default function NotificationScreen() {
  const [notifications] = useState([
    { id: "1", title: "New Update!", message: "Banana classification model improved!" },
    { id: "2", title: "Reminder", message: "Check your classified bananas before they expire!" },
    { id: "3", title: "News", message: "Shelf life estimation is now more accurate." }
  ]);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text variant="headlineMedium" style={{ textAlign: "center", marginVertical: 10 }}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 10, padding: 10 }}>
            <Card.Title title={item.title} />
            <Card.Content>
              <Text variant="bodyMedium">{item.message}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}
