import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Text, Card } from "react-native-paper";
import { auth, db } from "../firebaseConfig";
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

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F8F8", padding: 20 }}>
      
      {/* Profile & Welcome Section */}
      <Card style={{ padding: 15, borderRadius: 10, marginBottom: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image 
              source={require("../assets/Profile.jpg")} 
              style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} 
            />
            <Text variant="titleMedium">Welcome, {userName || "User"}!</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Image 
              source={require("../assets/settings.png")} 
              style={{ width: 30, height: 30, tintColor: "#666" }} 
            />
          </TouchableOpacity>
        </View>
      </Card>

      {/* Feature Buttons Section */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
        
        {/* Feature Cards */}
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Banana")}>
          <Image source={require("../assets/banana.png")} style={styles.icon} />
          <Text variant="titleSmall" style={styles.text}>Banana Ripeness Prediction</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Irrigation")}>
          <Image source={require("../assets/irrigation.png")} style={styles.icon} />
          <Text variant="titleSmall" style={styles.text}>Smart Irrigation System</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Price")}>
          <Image source={require("../assets/price.png")} style={styles.icon} />
          <Text variant="titleSmall" style={styles.text}>Price Prediction</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Disease")}>
          <Image source={require("../assets/disease.png")} style={styles.icon} />
          <Text variant="titleSmall" style={styles.text}>Disease Detection</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

// Styles for UI Components
const styles = {
  card: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  text: {
    textAlign: "center",
  }
};

