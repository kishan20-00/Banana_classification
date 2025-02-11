import React, { useState } from "react";
import { View, Image, Alert, ActivityIndicator } from "react-native";
import { Button, Text, Card } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

export default function BananaClassificationScreen() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to pick image from gallery
  const pickImage = async () => {
    let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "You need to grant permission to access the gallery.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResult(null); // Reset result when a new image is chosen
    }
  };

  // Function to take a photo using camera
  const takePhoto = async () => {
    let permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission Denied", "You need to grant permission to use the camera.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResult(null);
    }
  };

  // Function to send image to the Flask API
  const classifyImage = async () => {
    if (!image) {
      Alert.alert("No Image", "Please select or capture an image first.");
      return;
    }

    setLoading(true);
    setResult(null);

    let formData = new FormData();
    formData.append("image", {
      uri: image,
      name: "banana.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await axios.post("http://192.168.1.100:5005/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to classify image. Check your server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f8f8f8" }}>
      <Card style={{ padding: 20, borderRadius: 10 }}>
        <Card.Content>
          <Text variant="titleLarge" style={{ marginBottom: 10 }}>Banana Classification</Text>

          {image && <Image source={{ uri: image }} style={{ width: "100%", height: 250, borderRadius: 10, marginBottom: 10 }} />}
          
          <Button mode="contained" onPress={pickImage} style={{ marginBottom: 10 }}>Pick Image</Button>
          <Button mode="contained" onPress={takePhoto} style={{ marginBottom: 10 }}>Take Photo</Button>
          
          {loading ? (
            <ActivityIndicator size="large" color="#6200ea" />
          ) : (
            <Button mode="contained" onPress={classifyImage} style={{ marginBottom: 10 }} disabled={!image}>Classify Image</Button>
          )}

          {result && (
            <View style={{ marginTop: 20 }}>
              <Text variant="titleMedium">Prediction: {result.predicted_class}</Text>
              <Text variant="bodyLarge">Confidence: {(result.confidence * 100).toFixed(2)}%</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}
