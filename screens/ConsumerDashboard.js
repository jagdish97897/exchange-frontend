import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, TextInput, Image, Modal, Button, Dimensions, Keyboard, ScrollView, Alert, Animated } from "react-native";
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


  const handleFromChange = (text) => {
    setFrom(text);
    if (text.length === 6) {
      toInputRef.current?.focus(); // Focus "to" field when "from" has 6 digits
    }
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: menuVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [menuVisible]);


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

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

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

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuVisible(!menuVisible);
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
    }, [route])
  );

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
      <View style={{ flex: 1, marginTop: 40, backgroundColor: '#FFF' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 60, marginBottom: 20, paddingHorizontal: 30, }}>
          {/* Left Arrow */}
          <TouchableOpacity onPress={toggleMenu}>
            <Feather name="menu" size={24} color="black" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <Text style={styles.title}>Exchange</Text>
          </View>
          {/* Right Menu */}
          <TouchableOpacity onPress={toggleMenu}>

          </TouchableOpacity>
        </View>

        {menuVisible && (
          <Animated.View
            style={{
              position: 'absolute',
              top: 75,
              left: 20,
              backgroundColor: 'white',
              padding: 15,
              borderRadius: 10,
              elevation: 5,
              zIndex: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
              transform: [{ scale: fadeAnim }],
            }}
          >
            {/* Account */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile', { phoneNumber })}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#ddd',
              }}
            >
              <Ionicons name="person-circle-outline" size={20} color="black" style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 16, fontWeight: '500' }}>Account</Text>
            </TouchableOpacity>

            {/* Trips */}
            <TouchableOpacity
              onPress={() => navigation.navigate('TripScreen', { userId })}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#ddd',
              }}
            >
              <Ionicons name="car-outline" size={20} color="black" style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 16, fontWeight: '500' }}>Trips</Text>
            </TouchableOpacity>

            {/* Wallet */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Wallet', { userId })}
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}
            >
              <Ionicons name="wallet-outline" size={20} color="black" style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 16, fontWeight: '500' }}>Wallet</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <SafeAreaView style={styles.container}>

          <View style={styles.selectionContainer}>

            {/* From Location */}
            <View style={styles.inputGroup}>
              <View style={styles.row}>
                <Ionicons name="location" size={24} color="red" />
                <Text style={styles.label}>From</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit code"
                placeholderTextColor="#CCC"
                keyboardType="number-pad"
                maxLength={6}
                value={from}
                onChangeText={handleFromChange}
              />
            </View>

            {/* Arrow Icon */}
            <Ionicons name="arrow-down" size={30} color="white" style={styles.arrow} />
            {/* To Location */}
            <View style={styles.inputGroup}>
              <View style={styles.row}>
                <Ionicons name="location" size={24} color="green" />
                <Text style={styles.label}>To</Text>
              </View>
              <TextInput
                ref={toInputRef}
                style={styles.input}
                placeholder="Enter 6-digit code"
                placeholderTextColor="#CCC"
                keyboardType="number-pad"
                maxLength={6}
                value={to}
                onChangeText={setTo}
              />
            </View>

          </View>

        </SafeAreaView>
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
    backgroundColor: "#0047AB",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
  },
  inputGroup: {
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    color: "white",
    fontSize: 16,
    marginLeft: 8,
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
    color: '#000',
    fontWeight: "bold"
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
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  arrow: {
    alignSelf: "center",
    marginVertical: 5,
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