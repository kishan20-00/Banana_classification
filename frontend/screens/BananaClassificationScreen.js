import React, { useState } from "react";
import { View, Image, Alert, ActivityIndicator } from "react-native";
import { Button, Text, Card } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useLanguage } from "./LanguageContext"; // Import language context

export default function BananaClassificationScreen() {
  const { language } = useLanguage(); // Get selected language
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Translations
  const translations = {
    en: {
      title: "Banana Classification",
      pickImage: "Pick Image",
      takePhoto: "Take Photo",
      classifyImage: "Classify Image",
      noImage: "No Image",
      noImageMsg: "Please select or capture an image first.",
      prediction: "Prediction",
      confidence: "Confidence",
      shelfLife: "Shelf Life",
      success: "Success",
      error: "Error",
      permissionDenied: "Permission Denied",
      permissionGallery: "You need to grant permission to access the gallery.",
      permissionCamera: "You need to grant permission to use the camera.",
      classificationError: "Failed to classify image. Check your server.",
      shelfLifeInfo: {
        unripe: "4-6 days to become ripe.",
        ripe: "3-4 days to become overripe.",
        overripe: "Consume soon or use for baking.",
        rotten: "Not edible.",
        unknown: "Unknown shelf life.",
      },
    },
    si: {
      title: "කෙසෙල් වර්ගීකරණය",
      pickImage: "පින්තූරයක් තෝරන්න",
      takePhoto: "ඡායාරූපයක් ගන්න",
      classifyImage: "පින්තූරය වර්ගීකරණය කරන්න",
      noImage: "පින්තූරයක් නැත",
      noImageMsg: "කරුණාකර පින්තූරයක් තෝරන්න හෝ ගන්න.",
      prediction: "ඵල දැක්වීම",
      confidence: "විශ්වාසය",
      shelfLife: "ආයු කාලය",
      success: "සාර්ථකයි",
      error: "දෝෂයකි",
      permissionDenied: "අවසර නෝකළා",
      permissionGallery: "ගැලරියට ප්‍රවේශය ලබාදිය යුතුය.",
      permissionCamera: "කැමරාව භාවිතයට අවසර ලබාදිය යුතුය.",
      classificationError: "පින්තූරය වර්ගීකරණය කළ නොහැක. සේවාදායකය පරීක්ෂා කරන්න.",
      shelfLifeInfo: {
        unripe: "පකුණු වීමට දින 4-6ක්.",
        ripe: "අධික පකුණු වීමට දින 3-4ක්.",
        overripe: "ඉක්මනින් භාවිතා කරන්න හෝ පිසීමට යොදාගන්න.",
        rotten: "භාවිතයට නුසුදුසුයි.",
        unknown: "අදාල ආයු කාලය නොදනී.",
      },
    },
  };

  const t = translations[language];

  // Function to pick image from gallery
  const pickImage = async () => {
    let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t.permissionDenied, t.permissionGallery);
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResult(null);
    }
  };

  // Function to take a photo using camera and classify immediately
  const takePhoto = async () => {
    let permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t.permissionDenied, t.permissionCamera);
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
      setResult(null);
      classifyImage(imageUri);
    }
  };

  // Function to get shelf life based on classification
  const getShelfLife = (classification) => {
    return t.shelfLifeInfo[classification.toLowerCase()] || t.shelfLifeInfo.unknown;
  };

  // Function to send image to the Flask API
  const classifyImage = async (imageUri = image) => {
    if (!imageUri) {
      Alert.alert(t.noImage, t.noImageMsg);
      return;
    }

    setLoading(true);
    setResult(null);

    let formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      name: "banana.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await axios.post("http://192.168.1.100:5005/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const predictedClass = response.data.predicted_class;
      const confidence = response.data.confidence;

      // Capitalize first letter
      const formattedClass = predictedClass.charAt(0).toUpperCase() + predictedClass.slice(1);

      setResult({
        predicted_class: formattedClass,
        confidence: (confidence * 100).toFixed(2) + "%",
        shelf_life: getShelfLife(predictedClass),
      });
    } catch (error) {
      Alert.alert(t.error, t.classificationError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f8f8f8" }}>
      <Card style={{ padding: 20, borderRadius: 10 }}>
        <Card.Content>
          <Text variant="titleLarge" style={{ marginBottom: 10 }}>{t.title}</Text>

          {image && <Image source={{ uri: image }} style={{ width: "100%", height: 250, borderRadius: 10, marginBottom: 10 }} />}
          
          <Button mode="contained" onPress={pickImage} style={{ marginBottom: 10 }}>{t.pickImage}</Button>
          <Button mode="contained" onPress={takePhoto} style={{ marginBottom: 10 }}>{t.takePhoto}</Button>
          
          {loading ? (
            <ActivityIndicator size="large" color="#6200ea" />
          ) : (
            <Button mode="contained" onPress={() => classifyImage()} style={{ marginBottom: 10 }} disabled={!image}>
              {t.classifyImage}
            </Button>
          )}

          {result && (
            <View style={{ marginTop: 20 }}>
              <Text variant="titleMedium">{t.prediction}: {result.predicted_class}</Text>
              <Text variant="bodyLarge">{t.confidence}: {result.confidence}</Text>
              <Text variant="bodyLarge">{t.shelfLife}: {result.shelf_life}</Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}
