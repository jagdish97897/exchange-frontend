import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, TextInput, Image, Modal, Button, Dimensions, Keyboard, ScrollView, Alert } from "react-native";
import Autocomplete from "react-google-autocomplete";
import { AntDesign, Feather, Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ind from '../assets/images/image 10.png';
import * as Location from 'expo-location';
const { width, height } = Dimensions.get('window');
import { BackHandler } from 'react-native';
// import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';  // To store token locally
import { useNotification } from '../context/NotificationContext';
import { API_END_POINT } from '../app.config';


export const showAlert = (title, message, actions = [{ text: 'OK' }]) => {
  Alert.alert(title, message, actions);
};

// Helper function to enable location services
export const enableLocationServices = async () => {
  try {
    await Location.enableNetworkProviderAsync();
    return await Location.hasServicesEnabledAsync();
  } catch (error) {
    console.log('Error enabling location services:', error);
    showAlert('Error', 'Failed to enable location services.');
    return false;
  }
};

// Main function to check and request location permission
export const checkAndRequestLocationPermission = async () => {
  try {
    // Check if location services are enabled
    let isLocationServicesEnabled = await Location.hasServicesEnabledAsync();

    if (!isLocationServicesEnabled) {
      showAlert(
        'Location Services Disabled',
        'Your location services are turned off. Please enable them to continue.',
        [
          { text: 'Cancel', onPress: () => console.log('User canceled enabling location services') },
          {
            text: 'Enable',
            onPress: async () => {
              isLocationServicesEnabled = await enableLocationServices();
              if (isLocationServicesEnabled) {
                await checkAndRequestLocationPermission();
              }
            },
          },
        ]
      );
      return;
    }


    // Request location permissions
    const { status: requestedStatus } = await Location.requestForegroundPermissionsAsync();

    if (requestedStatus === 'granted') {
      showAlert('Permission Granted', 'You have granted location access.');
      return await getCurrentLocation();
    } else {
      showAlert(
        'Permission Denied',
        'You have denied location access. Please enable it in settings if needed.'
      );
    }
  } catch (error) {
    console.log('Error requesting location permission:', error);
    showAlert('Error', 'An error occurred while requesting location permission.');
  }
};

// Helper function to get the current location
export const getCurrentLocation = async () => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    const { latitude, longitude } = location.coords;
    // console.log('location.coords', latitude, longitude);
    return { latitude, longitude };
  } catch (error) {
    console.error('Error getting current location:', error);
    showAlert('Error', 'Unable to retrieve your location. Please try again.');
    return null;
  }
};

// Function to store token in backend
async function savePushTokenToDatabase(userId, token) {
  await fetch(`${API_END_POINT}/api/v1/users/save-push-token`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, expoPushToken: token }),
  });
}

export const checkExpoPushTokenChange = async (userId, expoPushToken) => {
  try {
    // Get the previously stored token (to avoid unnecessary updates)
    const storedToken = await AsyncStorage.getItem('expoPushToken');

    if (expoPushToken && storedToken !== expoPushToken) {
      // Update the backend only if the token has changed
      await savePushTokenToDatabase(userId, expoPushToken);
      await AsyncStorage.setItem('expoPushToken', expoPushToken);  // Store the latest token locally
    }
  } catch (error) {
    console.log('Failed to submit expoPushToken : ', error.message);
  }
};

export default ({ route }) => {
  const { phoneNumber, token, userId } = route.params;
  const [menuVisible, setMenuVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const toInputRef = useRef(null);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: '',
    longitude: '',
  });
  const [showExitOptions, setShowExitOptions] = useState(false);
  const { expoPushToken } = useNotification();

  // console.log('expoPushToken', expoPushToken);

  // const projectId =
  //   Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

  // console.log('Expo Project ID:', projectId);

  const handleFromChange = (text) => {
    setFrom(text);
    if (text.length === 6) {
      toInputRef.current?.focus(); // Focus "to" field when "from" has 6 digits
    }
  };


  useEffect(() => {
    if (!userId || !expoPushToken) {
      return;
    } else {
      checkExpoPushTokenChange(userId, expoPushToken);
    }

  }, [userId, expoPushToken]);

  useEffect(() => {
    try {
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
    } catch (error) {
      console.error('Error in keyboard event listeners:', error);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { latitude, longitude } = await checkAndRequestLocationPermission();

        if (latitude) {
          setCurrentLocation((prevLocation) => ({
            ...prevLocation,
            latitude,
          }));
        }

        if (longitude) {
          setCurrentLocation((prevLocation) => ({
            ...prevLocation,
            longitude,
          }));
        }
      } catch (error) {
        console.log('Error in checking or requesting location permission:', error);
      }
    })();
  }, []);

  useEffect(() => {
    try {
      if (from.length === 6 && to.length === 6) {
        navigation.navigate('CargoDetails', { from, to, phoneNumber, currentLocation, userId });
        setFrom('');
        setTo('');
      }
    } catch (error) {
      console.error('Error in navigation logic:', error);
    }
  }, [from, to, navigation]);


  const navigation = useNavigation();

  const handleDocumentsClick = () => {
    // Navigate to the Documents page
    navigation.navigate('Documents');
  };

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleAccountTypeClick = () => {
    // Navigate to the Account Type page
    navigation.navigate('AccountType');
  };

  const handleDeleteAccountClick = () => {
    // Navigate to the Delete Account page
    navigation.navigate('DeleteAccount');
  };

  const handleLogoutClick = () => {
    // Navigate to the Logout page
    navigation.navigate('Logout');
  };

  const navigateBack = () => {
    // Add navigation logic to go back to the previous page
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuVisible(!menuVisible);
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings')
  };

  const navigateToHelp = () => {
    // Add navigation logic to go to help page
  };

  const navigateToAbout = () => {
    navigation.navigate('About')
  };

  const navigateToLegal = () => {
    navigation.navigate('Legal')
  };

  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [gstin, setGstin] = useState('');
  const [photo, setPhoto] = useState(null);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  // Function to handle photo selection
  const handlePhotoSelection = () => {
    // Logic to select a photo from the device
    // Update the 'photo' state with the selected photo URI
  };

  // Function to handle form submission
  const handleSubmit = () => {
    // Logic to handle form submission
  };

  const handleCloseApp = () => {
    BackHandler.exitApp();
  };

  useFocusEffect(
    React.useCallback(() => {
      if (route.name === 'ConsumerDashboard') {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
          setShowExitOptions(true); // Show modal when back is pressed
          return true; // Prevent default back button behavior
        });

        return () => backHandler.remove(); // Cleanup listener on unmount
      }
    }, [route]) // Re-run effect when the route changes
  );

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
      <View style={{ flex: 1, marginTop: 40 }}>
        {/* Fixed Top Component */}
        <View
          className="bg-blue-200"
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 50,
            marginBottom: 0,
            paddingHorizontal: 30,
          }}
        >
          {/* Left Arrow */}
          <TouchableOpacity onPress={navigateBack}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <View className="ml-[160px]">
              <Feather name="headphones" size={24} color="black" />
            </View>
            <View className="ml-[20px]">
              <Ionicons name="notifications-outline" size={24} color="black" />
            </View>
          </View>

          {/* Right Menu */}
          <TouchableOpacity onPress={toggleMenu}>
            <Feather name="menu" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Dropdown Menu */}
        {menuVisible && (
          <View
            style={{
              position: 'absolute',
              top: 55,
              right: 20,
              backgroundColor: 'white',
              padding: 10,
              borderRadius: 5,
              elevation: 5,
              zIndex: 2,
            }}
          >
            <TouchableOpacity onPress={navigateToSettings} style={{ marginBottom: 10 }}>
              <Text>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToHelp} style={{ marginBottom: 10 }}>
              <Text>Help</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToAbout} style={{ marginBottom: 10 }}>
              <Text>About</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToLegal}>
              <Text>Legal</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Scrollable Middle Section */}
        <ScrollView style={{ flex: 1, backgroundColor: 'blue' }} contentContainerStyle={{ paddingBottom: 20 }}>
          <View className="flex-row gap-5 bg-blue-300 top-0">
            <Text className="text-lg pb-2 font-bold pl-[70px]">Dashboard</Text>
            <Text
              onPress={() => {
                navigation.navigate('TripScreen', { userId });
              }}
              className="text-lg font-bold pl-[80px]"
            >
              Trips
            </Text>
          </View>

          <SafeAreaView style={styles.container}>
            <View className="flex-row bg-blue-100" style={styles.topBox}>
              <Image
                source={Ind}
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 40,
                }}
              />
              <Text className="pl-8" style={{ fontSize: 30, fontWeight: '700' }}>
                TWCPL
              </Text>
            </View>

            <View style={styles.selectionContainer}>
              <Text style={styles.title}>Where to ship?</Text>
              <View style={styles.flexRow}>
                <View style={styles.arrowIcon}>
                  <Feather name="arrow-down" size={40} color="white" />
                </View>
                <View style={styles.formContainer}>
                  <Text style={styles.label}>From</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter 6-digit code"
                    placeholderTextColor="#CCC"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={from}
                    onChangeText={handleFromChange}
                  />

                  <Text style={styles.label}>To</Text>
                  <TextInput
                    ref={toInputRef} // Attach ref to the "to" field
                    style={styles.input}
                    placeholder="Enter 6-digit code"
                    placeholderTextColor="#CCC"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={to}
                    onChangeText={text => setTo(text)}
                  />
                </View>
              </View>
            </View>

            <View style={styles.ctaWrapper}>
              <TouchableOpacity style={styles.cta}>
                <Entypo name="wallet" size={24} color="black" />
                <Text>Wallet</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cta}>
                <Feather name="shield" size={24} color="black" />
                <Text>Insurance</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cta}>
                <Feather name="headphones" size={24} color="black" />
                <Text>Help & FAQ</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <View clasName="flex-1">
            <Text className="pl-[100px] bg-blue-300 h-[30px] text-xl">Company Newsletter</Text>
          </View>
        </ScrollView>

        {/* Fixed Bottom Navigation */}
        <View
          style={{
            backgroundColor: 'black',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('Wallet', { userId })}>
            <AntDesign name="wallet" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: 'blue', borderRadius: 24, padding: 10 }}>
            <Entypo name="shop" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile', { phoneNumber })}>
            <AntDesign name="user" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {/* Modal for exit options */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showExitOptions}
          onRequestClose={() => setShowExitOptions(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.exitText}>Do you really want to close the app?</Text>
              <View style={styles.buttonGroup}>
                <Button title="Close App" onPress={handleCloseApp} color="#FF5C5C" />
                <Button title="Not Close" onPress={() => setShowExitOptions(false)} color="#5CCF5C" />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  exitText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  topBox: {
    height: height * 0.3, // 30% of screen height
    padding: width * 0.1, // 10% of screen width for padding
  },
  selectionContainer: {
    borderWidth: 2,
    borderColor: '#80eae0',
    backgroundColor: '#93aed2',
    borderRadius: width * 0.075, // Adjusted radius for responsiveness
    width: '90%',
    position: 'absolute',
    top: height * 0.15, // 15% of screen height
    left: '5%',
    height: height * 0.38, // 30% of screen height
    padding: width * 0.05, // 5% of screen width
  },
  ctaWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: height * 0.25, // 25% of screen height
  },
  cta: {
    padding: width * 0.04, // 4% of screen width
    borderRadius: width * 0.025, // 2.5% of screen width
    shadowColor: '#1E40D8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    borderColor: '#80eae0',
    borderWidth: 2,
    shadowRadius: width * 0.025, // Adjust shadow for responsiveness
    height: height * 0.12, // 12% of screen height
    width: width * 0.28, // 28% of screen width
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ADD8E6',
  },
  responsiveBox: {
    height: height * 0.06, // 6% of the screen height
    backgroundColor: 'white',
    width: width * 0.7, // 70% of the screen width
    marginLeft: width * 0.05, // 5% of the screen width
    marginTop: height * 0.01, // 1% of the screen height
    borderRadius: width * 0.05, // Adjusted to 5% of the screen width
    borderWidth: 2,
    borderColor: '#BFDBFE', // Light blue
  },
  title: {
    fontSize: 28,
    color: '#FFF',
    marginBottom: 20,
  },
  flexRow: {
    flexDirection: 'row',
  },
  arrowIcon: {
    height: '85%',
    justifyContent: 'center',
    marginTop: 30,
    marginRight: 10,
  },
  formContainer: {
    flex: 1,
  },
  label: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
    paddingLeft: 10,
  },
  input: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#80eae0',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  cta: {
    backgroundColor: '#ADD8E6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  ctaText: {
    fontSize: 18,
    color: '#FFF',
  },
});