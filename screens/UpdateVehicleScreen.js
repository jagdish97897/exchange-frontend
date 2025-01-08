import React, { useState, useEffect } from "react";
import {
  Keyboard,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { handleFileUpload } from "./AddVehicleScreen";
import { Ionicons } from '@expo/vector-icons';
import { API_END_POINT } from "../app.config";


// Function to extract file name from the URL
const getFileNameFromUrl = (url) => {
  if (!url) return "";
  const parts = url.split("/");
  return `${parts[parts.length - 1]}`;
};

const UpdateVehicleScreen = ({ route, navigation }) => {
  const { vehicleNumber } = route.params; // Get vehicleNumber from route.params
  const [vehicleData, setVehicleData] = useState({
    rcCopy: "",
    height: "",
    width: "",
    length: "",
    ownerId: "",
    tdsDeclaration: "",
    ownerConsent: "",
  });
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // console.log(vehicleData)
  // Fetch vehicle details
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await fetch(`${API_END_POINT}/api/vehicles/${vehicleNumber}`);
        const result = await response.json();
        // console.log("result", result)

        if (response.ok) {
          setVehicleData({
            rcCopy: result.vehicle.rcCopy || [],
            height: result.vehicle.height || "",
            width: result.vehicle.width || "",
            length: result.vehicle.length || "",
            ownerId: result.vehicle.owner || "",
            tdsDeclaration: result.vehicle.tdsDeclaration || "",
            ownerConsent: result.vehicle.ownerConsent || "",
          });
        } else {
          Alert.alert("Error", result.message || "Failed to fetch vehicle details.");
        }
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
        Alert.alert("Error", "An error occurred while fetching vehicle details.");
      }
    };

    fetchVehicleDetails();
  }, [vehicleNumber]);

  const handleRcCopyChange = (index, value) => {
    const newRcCopy = [...vehicleData.rcCopy];
    newRcCopy[index] = value;
    setVehicleData((prevData) => ({ ...prevData, rcCopy: newRcCopy }));
  };


  // Update input fields dynamically
  const handleChange = (field, value) => {
    setVehicleData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = async () => {
    const { rcCopy, height, width, length, ownerId, tdsDeclaration, ownerConsent } = vehicleData;

    if (!rcCopy || !height || !width || !length || !ownerId) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(`${API_END_POINT}/api/vehicles/update/${vehicleNumber}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleData),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Vehicle updated successfully!");
        navigation.navigate("GetVehicleScreen", { ownerId: vehicleData.ownerId }); // Navigate to GetVehicleScreen
      } else {
        Alert.alert("Error", result.message || "Failed to update vehicle.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred while updating the vehicle.");
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <LinearGradient colors={["#06264D", "#FFF"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={styles.container}
          scrollEnabled={true}
          enableAutomaticScroll={true}
          enableOnAndroid={true}
          extraScrollHeight={100}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <Image
            source={require("../assets/images/logo-removebg-preview 1.png")}
            style={styles.logo}
          />
          <Text style={styles.registerText}>Vehicle Update Form</Text>
          <TextInput
            style={[styles.input, { backgroundColor: "#f0f0f0" }]}
            value={vehicleNumber}
            editable={false} // Make the vehicleNumber read-only
            placeholderTextColor="#000"
          />
          {/* <TextInput
            style={styles.input}
            placeholder="Enter owner ID"
            placeholderTextColor="#000"
            value={vehicleData.rcCopy[0] || ""} // Display the first RC copy by default
            onChangeText={(value) => handleRcCopyChange(0, value)}
          /> */}
          <TextInput
            style={styles.input}
            placeholder="Enter height"
            placeholderTextColor="#000"
            value={vehicleData.height}
            onChangeText={(value) => handleChange("height", value)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter width"
            placeholderTextColor="#000"
            value={vehicleData.width}
            onChangeText={(value) => handleChange("width", value)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter length"
            placeholderTextColor="#000"
            value={vehicleData.length}
            onChangeText={(value) => handleChange("length", value)}
            keyboardType="numeric"
          />

          {/* 
          <TextInput
            style={styles.input}
            placeholder="Enter owner ID"
            placeholderTextColor="#000"
            value={vehicleData.ownerId}
            onChangeText={(value) => handleChange("ownerId", value)}
          /> 
          */}

          {/* <TextInput
            style={styles.input}
            placeholder="Enter TDS declaration"
            placeholderTextColor="#000"
            value={vehicleData.tdsDeclaration}
            onChangeText={(value) => handleChange("tdsDeclaration", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter owner consent"
            placeholderTextColor="#000"
            value={vehicleData.ownerConsent}
            onChangeText={(value) => handleChange("ownerConsent", value)}
          /> */}

          <TouchableOpacity
            style={[styles.input, styles.uploadButton]}
            onPress={() => handleFileUpload("tdsDeclaration", handleChange)}
          >
            <Text style={styles.uploadButtonText}>
              {vehicleData.tdsDeclaration.length
                ? getFileNameFromUrl(`${vehicleData.tdsDeclaration}`)
                : 'Upload TDS declaration (PDF/DOC)'}
            </Text>
            <Ionicons
              name={vehicleData.tdsDeclaration.length ? "checkmark-circle" : "cloud-upload-outline"}
              size={20}
              color="green"
              style={styles.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.input, styles.uploadButton]}
            onPress={() => handleFileUpload("ownerConsent", handleChange)}
          >
            <Text style={styles.uploadButtonText}>
              {vehicleData.ownerConsent.length ? getFileNameFromUrl(`${vehicleData.ownerConsent}`) : 'Upload Owner Consent (PDF/DOC)'}
            </Text>
            <Ionicons
              name={vehicleData.ownerConsent.length ? "checkmark-circle" : "cloud-upload-outline"}
              size={20}
              color="green"
              style={styles.icon}
            />
          </TouchableOpacity>


          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  registerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: '100%',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#06264D',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 20
  },
  smallImage: {
    width: 40,
    height: 40
  },
  footerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  footerText: {
    color: '#000',
    paddingLeft: 2
  },
  uploadButton: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Vertically center items
    justifyContent: 'space-between', // Space out the text and the icon
    width: '100%', // Ensure it spans the full width
  },
  uploadButtonText: {
    color: '#06264D',
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 5, // Add spacing between the text and the icon
  },
});


export default UpdateVehicleScreen;
