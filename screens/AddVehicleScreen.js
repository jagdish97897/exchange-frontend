import React, { useState, useEffect } from "react";  // Import useEffect
import { Keyboard, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const AddVehicleScreen = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [rcCopy, setRcCopy] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [length, setLength] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [brokerId, setBrokerId] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [tdsDeclaration, setTdsDeclaration] = useState("");
  const [ownerConsent, setOwnerConsent] = useState("");
  const [brokerConsent, setBrokerConsent] = useState("");

  // Driver details state variables
  const [driverFullName, setDriverFullName] = useState("");
  const [driverProfileImage, setDriverProfileImage] = useState("");
  const [driverEmail, setDriverEmail] = useState("");
  const [driverPhoneNumber, setDriverPhoneNumber] = useState("");
  const [driverAadharNumber, setDriverAadharNumber] = useState("");
  const [driverPanNumber, setDriverPanNumber] = useState("");
  const [driverDlNumber, setDriverDlNumber] = useState("");
  const [driverDob, setDriverDob] = useState("");
  const [driverGender, setDriverGender] = useState("");

  const handleSubmit = async () => {
    if (!vehicleNumber || !rcCopy || !height || !width || !length || !ownerId) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    const rcCopyArray = rcCopy.split(",").map((url) => url.trim());
    const vehicleData = {
      vehicleNumber,
      rcCopy: rcCopyArray,
      height,
      width,
      length,
      ownerId,
      tdsDeclaration,
      ownerConsent,
      driver: {
        fullName: driverFullName,
        profileImage: driverProfileImage,
        email: driverEmail,
        phoneNumber: driverPhoneNumber,
        aadharNumber: driverAadharNumber,
        panNumber: driverPanNumber,
        dlNumber: driverDlNumber,
        dob: driverDob,
        gender: driverGender,
      },
    };
    try {
      const response = await fetch("http://192.168.1.2:8000/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleData),

      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Vehicle added successfully!");
        // Reset form
        setVehicleNumber("");
        setRcCopy("");
        setHeight("");
        setWidth("");
        setLength("");
        setOwnerId("");
        setTdsDeclaration("");
        setOwnerConsent("");

        setDriverFullName("");
        setDriverProfileImage("");
        setDriverEmail("");
        setDriverPhoneNumber("");
        setDriverAadharNumber("");
        setDriverPanNumber("");
        setDriverDlNumber("");
        setDriverDob("");
        setDriverGender("");
      } else {
        Alert.alert("Error", result.message || "Failed to add vehicle.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred while adding the vehicle.");
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <LinearGradient colors={['#06264D', "#FFF"]} style={{ flex: 1 }}>
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
          <Text style={styles.registerText}>Vehicle Registation form</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter vehicle number"
            placeholderTextColor="#000"
            value={vehicleNumber}
            onChangeText={setVehicleNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter RC copy URLs"
            placeholderTextColor="#000"
            value={rcCopy}
            onChangeText={setRcCopy}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter height"
            placeholderTextColor="#000"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter width"
            placeholderTextColor="#000"
            value={width}
            onChangeText={setWidth}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter length"
            placeholderTextColor="#000"
            value={length}
            onChangeText={setLength}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter owner ID"
            placeholderTextColor="#000"
            value={ownerId}
            onChangeText={setOwnerId}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter TDS declaration"
            placeholderTextColor="#000"
            value={tdsDeclaration}
            onChangeText={setTdsDeclaration}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter owner consent"
            placeholderTextColor="#000"
            value={ownerConsent}
            onChangeText={setOwnerConsent}
          />

          <TextInput
            style={styles.input}
            placeholder="Driver Full Name"
            placeholderTextColor="#000"
            value={driverFullName}
            onChangeText={setDriverFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="Profile Image"
            placeholderTextColor="#000"
            value={driverProfileImage}
            onChangeText={setDriverProfileImage}
          />
          <TextInput
            style={styles.input}
            placeholder="Driver Email"
            placeholderTextColor="#000"
            value={driverEmail}
            onChangeText={setDriverEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Driver Phone Number"
            placeholderTextColor="#000"
            value={driverPhoneNumber}
            onChangeText={setDriverPhoneNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Driver Aadhar Number"
            placeholderTextColor="#000"
            value={driverAadharNumber}
            onChangeText={setDriverAadharNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Driver Pan Number"
            placeholderTextColor="#000"
            value={driverPanNumber}
            onChangeText={setDriverPanNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Driver Dl Number"
            placeholderTextColor="#000"
            value={driverDlNumber}
            onChangeText={setDriverDlNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Driver Dob"
            placeholderTextColor="#000"
            value={driverDob}
            onChangeText={setDriverDob}
          />
          <TextInput
            style={styles.input}
            placeholder="Driver Gender"
            placeholderTextColor="#000"
            value={driverGender}
            onChangeText={setDriverGender}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>

        {!keyboardVisible && (
          <View style={styles.footer}>
            <Image
              source={require("../assets/images/mantra.jpg")}
              style={styles.smallImage}
            />
            <View style={styles.footerTextContainer}>
              <Text style={styles.footerText}>Made in</Text>
              <Image
                source={require("../assets/images/image 10.png")}
                style={styles.smallImage}
              />
            </View>
            <Image
              source={require("../assets/images/make-in-India-logo.jpg")}
              style={styles.smallImage}
            />
          </View>
        )}
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

});


export default AddVehicleScreen;
