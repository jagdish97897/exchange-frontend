import React, { useState, useEffect, useRef } from "react";  // Import useEffect
import { Keyboard, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Modal } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getCurrentDate } from "./CargoDetails";
import DatePicker from 'react-native-date-picker';
import axios from "axios";
import Loader from "../components/Buttons/Loader";
import { Calendar } from 'react-native-calendars';
import { format, formatDate } from 'date-fns';
import { API_END_POINT } from '../app.config';

const today = new Date();
const eighteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 18));

const initialFormData = {
  vehicleNumberPart1: "",
  vehicleNumberPart2: "",
  rcCopy: "",
  vehicleHeight: "",
  vehicleWidth: "",
  vehicleLength: "",
  brokerId: "",
  latitude: "",
  longitude: "",
  tdsDeclaration: "",
  ownerConsent: "",
  brokerConsent: "",
  driverFullName: "",
  driverProfileImage: "",
  driverEmail: "",
  driverPhoneNumber: "",
  driverAadharNumber: "",
  driverPanNumber: "",
  driverDlNumber: "",
  driverDob: eighteenYearsAgo,
  driverGender: "",
};

export const validateEmail = (email) => {
  // Regex for validating email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};



// const getCurrentDateFormat = (date) => format(new Date(date), 'yyyy-MM-dd');

// console.log('getCurrentDateFormat', getCurrentDateFormat(today));

const updateFileNameInUri = (file) => {
  if (!file || !file.uri || !file.name) {
    return file?.uri || ""; // Return the original URI if no valid file or name is provided
  }

  const uriParts = file.uri.split("/"); // Split the URI into parts
  uriParts[uriParts.length - 1] = file.name; // Replace the last part with the file name
  return uriParts.join("/"); // Join the parts back into a valid URI
};

export const handleFileUpload = async (name, handleInputChange) => {
  try {
    // Use Expo's Document Picker
    const file = await DocumentPicker.getDocumentAsync({
      type: 'application/*', // Accepts any file type; you can narrow it down to `application/pdf` or others
      copyToCacheDirectory: true,
    });

    // console.log('file : ', file)
    if (!file.canceled) {
      handleInputChange(name, file.assets[0].uri); // Save the file URI in your userData

      // handleInputChange(name, file.assets[0].uri); // Save the file URI in your userData
    } else {
      console.log('User cancelled the file picker');
    }
  } catch (err) {
    console.error('Error picking file:', err);
  }
};

const AddVehicleScreen = ({ route }) => {
  const { token, ownerId, currentLocation } = route.params;
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [userData, setUserData] = useState(initialFormData);
  const vehicleDataRef1 = useRef("");
  const vehicleDataRef2 = useRef("");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  // const [driverDob, setDriverDob] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);


  const handleBoxBlur = () => {
    const totalDigits = userData.vehicleNumberPart1.length + userData.vehicleNumberPart2.length;

    if (totalDigits === 9 && Number(userData.vehicleNumberPart1.slice(-1))) {
      const vehicleNoPart1 = userData.vehicleNumberPart1.slice(0, -1);
      const vehicleNoPart2 = userData.vehicleNumberPart1.slice(-1) + userData.vehicleNumberPart2;
      handleInputChange("vehicleNumberPart1", vehicleNoPart1);
      handleInputChange("vehicleNumberPart2", vehicleNoPart2);
    }
  };

  const vehicleNumber = `${userData.vehicleNumberPart1}${userData.vehicleNumberPart2}`;

  const handleInputChange = (name, value) => {
    setUserData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (isLoading) return; // Prevent duplicate submissions

    setIsLoading(true);// Show loader

    try {
      // console.log("Submitting...");

      if (!validateEmail(userData.driverEmail)) {
        Alert.alert('Error', 'Please enter a valid email address.');
        return;
      }

      if (!vehicleNumber || !userData.rcCopy || !userData.vehicleHeight || !userData.vehicleWidth ||
        !userData.vehicleLength || !ownerId) {
        Alert.alert("Error", "Please fill in all required fields.");
        return;
      }

      const formData = new FormData();

      formData.append('vehicleNumber', vehicleNumber);
      formData.append('ownerId', ownerId);
      formData.append('currentLocation', JSON.stringify(currentLocation));

      // Add file and non-file fields
      for (const key in userData) {
        if (userData[key]) {
          switch (key) {
            case 'vehicleNumberPart1':
            case 'vehicleNumberPart2':
              break;
            case 'driverDob':
              formData.append(key, JSON.stringify(userData[key]));
              break;
            case 'rcCopy':
            case 'driverProfileImage':
            case 'tdsDeclaration':
            case 'ownerConsent':
              const uriParts = userData[key].split('.');
              const fileType = uriParts[uriParts.length - 1];
              const fileName = userData[key].split('/').pop();

              formData.append(key, {
                uri: userData[key],
                name: fileName,
                type: fileType === "pdf" || fileType === "doc" || fileType === "docx"
                  ? `application/${fileType}`
                  : `image/${fileType}`,
              });
              break;

            default:
              formData.append(key, userData[key]);
          }
        }
      }

      const response = await axios.post(
        `${API_END_POINT}/api/vehicles/create`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      console.log("Data from add vehicle API:", response.data);

      if (response.status === 201) { // Adjusted for 'Created' response
        Alert.alert("Success", "Vehicle added successfully!");
        setUserData(initialFormData); // Reset form data
      } else {
        console.error("Unexpected Response:", response);
        Alert.alert("Error", response.data.message || "Failed to add vehicle.");
      }

      return;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          Alert.alert('Error', error.response.data.message);
        } else if (error.response.status === 500) {
          Alert.alert('Error', 'Server is down. Please try again later.');
        } else {
          Alert.alert('Error', 'An unknown error occurred.');
        }
      } else if (error.request) {
        console.log(error.request)
        Alert.alert('Error', 'Unable to connect to the server. Please check your network.');
      } else {
        Alert.alert('Error', error.message);
      }
      // console.error("Error response data:", error.response?.data);
      // console.log("Error message:", error);

      // Alert.alert(
      //   "Error",
      //   error.response?.data?.message || "An error occurred while adding the vehicle."
      // );
    } finally {
      setIsLoading(false); // Hide loader
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

  const handleVehicleNumberPart1Change = (text) => {
    handleInputChange('vehicleNumberPart1', text.toUpperCase());
    if (text.length === 6) {
      vehicleDataRef2.current?.focus(); // Focus "to" field when "from" has 6 digits
    }
  };

  const handleVehicleNumberPart2Change = (text) => {
    handleInputChange('vehicleNumberPart2', text.toUpperCase());
    if (text.length === 4) {
      vehicleDataRef2.current?.focus(); // Focus "to" field when "from" has 6 digits
    }
  };



  const handleImagePicker = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        handleInputChange("driverProfileImage", result.assets[0].uri);
      } else {
        Alert.alert('Image selection canceled');
      }
    } else {
      Alert.alert('Permission denied', 'Please allow access to your photos.');
    }
  };

  return (
    <LinearGradient colors={['#06264D', "#FFF"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ paddingLeft: 60 }}>
        <Image
          source={require("../assets/images/logo-removebg-preview 1.png")}
          style={styles.logo}
        />
        <Text style={styles.registerText}>Vehicle Registation form</Text>
      </SafeAreaView>
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

          <View style={styles.inputRow}>
            <TextInput
              ref={vehicleDataRef1}
              style={styles.vehicleDataInput}
              placeholder="Enter Vehicle Number "
              placeholderTextColor="#000"
              value={userData.vehicleNumberPart1.toUpperCase()}
              onChangeText={handleVehicleNumberPart1Change}
              maxLength={6}
            />
            <TextInput
              ref={vehicleDataRef2}
              style={styles.vehicleDataInput}
              placeholder=""
              placeholderTextColor="#000"
              value={userData.vehicleNumberPart2}
              onChangeText={handleVehicleNumberPart2Change}
              maxLength={4}
              keyboardType="numeric"
              onBlur={handleBoxBlur}
            />
          </View>

          <TouchableOpacity
            style={[styles.input, styles.uploadButton]}
            onPress={() => handleFileUpload("rcCopy", handleInputChange)}
          >
            <Text style={styles.uploadButtonText}>
              {userData.rcCopy.length ? 'RC Copy Uploaded' : 'Upload RC Copy (PDF/DOC)'}
            </Text>
            <Ionicons
              name={userData.rcCopy.length ? "checkmark-circle" : "cloud-upload-outline"}
              size={20}
              color="green"
              style={styles.icon}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Enter Vehicle Height"
            placeholderTextColor="#000"
            value={userData.vehicleHeight}
            onChangeText={(value) => handleInputChange("vehicleHeight", value)}
            keyboardType="numeric"
            maxLength={2}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Vehicle Width"
            placeholderTextColor="#000"
            value={userData.vehicleWidth}
            onChangeText={(value) => handleInputChange("vehicleWidth", value)}
            keyboardType="numeric"
            maxLength={2}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Vehicle Length"
            placeholderTextColor="#000"
            value={userData.vehicleLength}
            onChangeText={(value) => handleInputChange("vehicleLength", value)}
            keyboardType="numeric"
            maxLength={2}
          />
          <TouchableOpacity
            style={[styles.input, styles.uploadButton]}
            onPress={() => handleFileUpload("tdsDeclaration", handleInputChange)}
          >
            <Text style={styles.uploadButtonText}>
              {userData.tdsDeclaration.length ? 'TDS declaration Uploaded' : 'Upload TDS declaration (PDF/DOC)'}
            </Text>
            <Ionicons
              name={userData.tdsDeclaration.length ? "checkmark-circle" : "cloud-upload-outline"}
              size={20}
              color="green"
              style={styles.icon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.input, styles.uploadButton]}
            onPress={() => handleFileUpload("ownerConsent", handleInputChange)}
          >
            <Text style={styles.uploadButtonText}>
              {userData.ownerConsent.length ? 'Owner Consent Uploaded' : 'Upload Owner Consent (PDF/DOC)'}
            </Text>
            <Ionicons
              name={userData.ownerConsent.length ? "checkmark-circle" : "cloud-upload-outline"}
              size={20}
              color="green"
              style={styles.icon}
            />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Driver Full Name"
            placeholderTextColor="#000"
            value={userData.driverFullName}
            onChangeText={(value) => handleInputChange("driverFullName", value)}
          />

          <TouchableOpacity style={[styles.input, styles.uploadButton]} onPress={handleImagePicker}>
            {userData.driverProfileImage ? (
              <View style={styles.profileImageContainer}>
                <Text style={styles.profileText}>Profile Image</Text>
                <Image
                  source={
                    userData.driverProfileImage && userData.driverProfileImage !== 'undefined'
                      ? { uri: encodeURI(userData.driverProfileImage) }
                      : require('../assets/images/logo-removebg-preview 1.png') // Local fallback image
                  }
                  style={styles.image}
                />
              </View>
            ) : (
              <View style={styles.selectImageContainer}>
                <Text style={styles.selectImageText}>Select Profile Image</Text>
                <Ionicons
                  name="image-outline" // Select image icon
                  size={30}
                  color="#000"
                  style={styles.icon}
                // backgroundColor="gray"
                />
              </View>
            )}
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Driver Email"
            placeholderTextColor="#000"
            value={userData.driverEmail}
            onChangeText={(value) => handleInputChange("driverEmail", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Driver Phone Number"
            placeholderTextColor="#000"
            value={userData.driverPhoneNumber}
            onChangeText={(value) => handleInputChange("driverPhoneNumber", value)}
            keyboardType="numeric"
            maxLength={10}
          />
          <TextInput
            style={styles.input}
            placeholder="Driver Aadhar Number"
            placeholderTextColor="#000"
            value={userData.driverAadharNumber}
            onChangeText={(value) => handleInputChange("driverAadharNumber", value)}
            keyboardType="numeric"
            maxLength={12}
          />
          <TextInput
            style={styles.input}
            placeholder="Driver PAN Number"
            placeholderTextColor="#000"
            value={userData.driverPanNumber}
            onChangeText={(value) => handleInputChange("driverPanNumber", value.toUpperCase())}
            maxLength={10}
          />
          <TextInput
            style={styles.input}
            placeholder="Driving Licence Number"
            placeholderTextColor="#000"
            value={userData.driverDlNumber}
            onChangeText={(value) => handleInputChange("driverDlNumber", value.toUpperCase())}
            maxLength={16}
          />

          <TouchableOpacity
            style={styles.input}
            onPress={() => { setIsDatePickerOpen(true) }}
            placeholder="Driver Dob"
            placeholderTextColor="#000"
          >
            <View style={styles.row}>
              <Text>{userData.driverDob < eighteenYearsAgo ? getCurrentDate(userData.driverDob) : "Select Dob"}</Text>
              <Ionicons name="calendar" size={20} color="#000" style={styles.icon} />
            </View>
          </TouchableOpacity>
          <DatePicker
            modal
            mode="date"
            open={isDatePickerOpen}
            date={userData.driverDob}
            maximumDate={eighteenYearsAgo}
            onConfirm={(date) => {
              setIsDatePickerOpen(false);
              handleInputChange("driverDob", date);
            }}
            onCancel={() => { setIsDatePickerOpen(false) }}
          >
          </DatePicker>

          {/* 
          <TouchableOpacity
            style={styles.input}
            onPress={() => { setIsCalendarOpen(true); }}
            placeholder="Driver Dob"
            placeholderTextColor="#000"
          >
            <View style={styles.row}>
              <Text>{driverDob ? getCurrentDate(driverDob) : "Select Dob"}</Text>
              <Ionicons name="calendar" size={20} color="#000" style={styles.icon} />
            </View>
          </TouchableOpacity>

         
          <Modal
            visible={isCalendarOpen}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsCalendarOpen(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.calendarContainer}>
                <Calendar
                  current={driverDob || '2000-01-01'} // Default view for calendar
                  minDate={'1990-01-01'} // Minimum allowed date
                  maxDate={eighteenYearsAgo.toISOString().split('T')[0]} // 18 years ago
                  onDayPress={(day) => {
                    setDriverDob(day.dateString); // Set the selected date
                    setIsCalendarOpen(false); // Close the calendar
                  }}
                  markedDates={{
                    [driverDob]: { selected: true, selectedColor: 'blue', selectedTextColor: 'white' },
                  }}
                  monthFormat={'yyyy MM'}
                />
              </View>
            </View>
          </Modal> */}

          <View style={[styles.pickerContainer]}>
            <Picker
              selectedValue={userData.driverGender}
              style={styles.pickerInput} // Apply the same style as TextInput
              onValueChange={(value) => handleInputChange("driverGender", value)}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
            </Picker>
          </View>

          {isLoading ? (
            <Loader />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          )}

          {/* <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity> */}
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
    </LinearGradient >
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
    marginBottom: -10,
    paddingLeft: 250,
    marginTop: 10
  },
  registerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 0,
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
  pickerInput: {
    width: '100%',
    height: 5,
    backgroundColor: '#FFF',
    marginBottom: 1,
    borderColor: '#ccc',
  },
  vehicleDataInput: {
    flex: 1, // Let inputs share equal space
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginHorizontal: 1, // Space between inputs
  },
  inputRow: {
    flexDirection: 'row', // Align items in a horizontal row
    justifyContent: 'space-between', // Ensure proper spacing between items
    alignItems: 'center', // Align items vertically
    marginBottom: 15, // Space below the row
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 58,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    justifyContent: 'center',
    paddingTop: 0,
    marginTop: 0,
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
    marginLeft: 10, // Add some spacing between the text and icon
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginBottom: 0,
  },
  imagePlaceholder: {
    height: 40,
    width: 40,
    // backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  profileImageContainer: {
    flexDirection: 'row', // Arrange text and image horizontally
    justifyContent: 'space-between', // Push text and image to opposite ends
    alignItems: 'center',
    width: '100%',
  },
  profileText: {
    fontSize: 16,
    color: '#000', // Uniform text color
  },
  selectImageContainer: {
    flexDirection: 'row', // Arrange text and icon horizontally
    justifyContent: 'space-between', // Push text and icon to opposite ends
    alignItems: 'center',
    width: '100%',
  },
  selectImageText: {
    fontSize: 16,
    color: '#000',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20, // Circular image
  },
  icon: {
    marginLeft: 5, // Add spacing between the text and the icon
  },
  row: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});


export default AddVehicleScreen;
