import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Dimensions, Image, Modal, Button, Alert, TextInput, FlatList, ScrollView } from "react-native";
import Autocomplete from "react-google-autocomplete";
import { AntDesign, Feather, Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Ind from '../assets/images/image 10.png';
import axios from 'axios';
import { checkAndRequestLocationPermission } from './ConsumerDashboard';
import { getSocket, closeSocket } from './SocketIO.js';

const { width, height } = Dimensions.get('window');



export default ({ route }) => {
  const { phoneNumber, token } = route.params;
  // console.log(phoneNumber)
  const [menuVisible, setMenuVisible] = useState(false);
  const [ownerId, setOwnerId] = useState('');
  const [isBrokerModalVisible, setBrokerModalVisible] = useState(false);
  const [brokerPhoneNumber, setBrokerPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setOtpVerified] = useState(false);
  const [serverOtp, setServerOtp] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentLocation, setCurrentLocation] = useState({
    latitude: '',
    longitude: '',
  });

  const socketInstance = io("http://192.168.1.6:8000", { query: { token } }); // Replace with your server URL

  useEffect(() => {
    const socket = getSocket(token);

    socket.on("newMessage", (message) => {
      console.log("Message from server:", message);
    });

    return () => {
      closeSocket(); // Disconnect socket on unmount
    };
  }, [token]);

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


  const sendOtp = async () => {
    try {
      if (brokerPhoneNumber.trim() === "") {
        Alert.alert("Error", "Please enter a valid phone number.");
        return;
      }
      // Mock OTP send logic

      const response = await axios.post('http://192.168.1.6:8000/api/v1/users/sendOtp', {
        phoneNumber: brokerPhoneNumber,
        type: ['broker']
      });

      if (response.status === 200) {
        setOtpSent(true);
        const otpFromServer = response.data.data.otp;
        setServerOtp(otpFromServer);
        console.log('OTP sent:', otpFromServer);
        Alert.alert("OTP Sent", `OTP sent to phone number ending with ${brokerPhoneNumber.slice(-4)}`);
      } else {
        throw new Error('Failed to send OTP.'); // This block might never be reached due to the 200 check above
      }
    }
    catch (error) {
      if (error.response) {
        if (error.response.status === 400 || 404) {
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
    }

  };

  const verifyOtp = async () => {
    try {
      // Use the rest operator to handle multiple arguments
      const response = await axios.post('http://192.168.1.6:8000/api/v1/users/verifyOtp', {
        otp, // Assuming first argument is the OTP
        phoneNumber: brokerPhoneNumber, // Assuming second argument is the phone number
      });

      if (response.status === 200) {
        setOtpVerified(true);
        Alert.alert("Success", "OTP Verified!");
      } else {
        Alert.alert("Error", "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };


  const submitVehicleNumber = async () => {
    try {
      if (vehicleNumber.trim() === "") {
        Alert.alert("Error", "Please enter a vehicle number.");
        return;
      }

      const response = await axios.post('http://192.168.1.6:8000/api/v1/users/addBroker', {
        ownerId, vehicleNumber, brokerPhoneNumber
      });

      if (response.status === 200) {
        // Submit logic for vehicle number
        Alert.alert("Success", `Broker added successfully !`);
        setBrokerModalVisible(false);
        setOtpSent(false);
        setOtpVerified(false);
        setBrokerPhoneNumber("");
        setOtp("");
        setVehicleNumber("");
        setVehicles([]);
      } else {
        Alert.alert("Error", "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };


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

  const toggleMenu = () => {
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
  useEffect(() => {
    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://192.168.1.6:8000/api/v1/users/user/${phoneNumber}`);
        const { _id } = response.data;
        setOwnerId(_id); // Set the user ID
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [phoneNumber]);

  // Function to fetch vehicles from the server
  const fetchVehicles = async (query) => {
    try {
      setLoading(true);

      // Make API call with searchText as a query parameter
      const response = await axios.get(
        `http://192.168.1.6:8000/api/vehicles/owner/${ownerId}`,
        {
          params: { searchText: query }, // Send searchText as query parameter
        }
      );

      // Update the vehicles state with the fetched data
      const vehicles = response.data.vehicles.length ? response.data.vehicles.map(v => v.vehicleNumber) : [];
      setVehicles(vehicles);
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
    } finally {
      setLoading(false);
    }
  };

  // Call API when text input changes
  const handleInputChange = (text) => {
    setVehicleNumber(text);
    fetchVehicles(text); // Fetch vehicles based on user input
  };

  // Handle vehicle selection from the list
  const handleVehicleSelect = (selectedVehicle) => {
    setVehicleNumber(selectedVehicle); // Set the selected vehicle number
    setVehicles([]); // Optionally clear the list after selection
  };

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
      <View style={{ flex: 1, marginTop: 40 }}>
        <View className="bg-blue-100" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 60, marginBottom: 20, paddingHorizontal: 30 }}>
          {/* Left Arrow */}
          <TouchableOpacity onPress={navigateBack}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
            <View className="ml-[160px]">
              <Feather name="headphones" size={24} color="black" /></View>
            <View className="ml-[20px]">
              <Ionicons name="notifications-outline" size={24} color="black" /></View>
            {/* {image && <Image source={{ uri: image }} style={styles.image} onPress={pickImage}/>} */}
          </View>
          {/* Right Menu */}
          <TouchableOpacity onPress={toggleMenu}>
            <Feather name="menu" size={24} color="black" />
          </TouchableOpacity>
        </View>



        {/* Menu Options */}
        {menuVisible && (
          <View style={{ position: 'absolute', top: 75, right: 20, backgroundColor: 'white', padding: 10, borderRadius: 5, elevation: 5, zIndex: 2 }}>
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



        <View className="flex-row gap-5 bg-blue-100">
          <Text className="text-lg pb-2 font-bold pl-[70px]">Dashboard</Text>
          <Text onPress={() => { navigation.navigate('Trips') }} className="text-lg font-bold pl-[80px]">Trips</Text>
        </View>

        <SafeAreaView style={styles.container}>
          <View className="flex-row bg-blue-100" style={styles.topBox}>
            <Image source={Ind} style={{
              width: 80,
              height: 50,
              width: 50,
              borderRadius: 40,
            }} />
            <Text className="pl-8" style={{ fontSize: 30, fontWeight: '700' }}>TWCPL</Text>
          </View>

          <View style={styles.selectionContainer}>
            <View style={styles.cardContainer}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("AddVehicleScreen", { ownerId, token, currentLocation })}
              >
                <Text style={styles.cardText}>Add Vehicle</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("GetVehicleScreen", { ownerId })}
              >
                <Text style={styles.cardText}>View & Update Vehicle</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.card}
                onPress={() => setBrokerModalVisible(true)}              >
                <Text style={styles.cardText}>Add Broker</Text>
              </TouchableOpacity>
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

        {/* Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isBrokerModalVisible}
          onRequestClose={() => setBrokerModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <FlatList
              data={[]}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.modalContent}
              ListHeaderComponent={
                <>
                  <TouchableOpacity
                    style={styles.crossButton}
                    onPress={() => {
                      setBrokerModalVisible(false);
                      setOtpSent(false);
                      setOtpVerified(false);
                      setBrokerPhoneNumber("");
                      setOtp("");
                      setVehicleNumber("");
                      setVehicles([]);
                    }}
                  >
                    {/* If using React Native Vector Icons */}
                    {/* <Icon name="close" size={24} color="#000" /> */}

                    {/* Alternatively, using Text */}
                    <Text style={styles.crossButtonText}>✕</Text>
                  </TouchableOpacity>
                  {!isOtpSent ? (
                    <>
                      <Text style={styles.modalTitle}>Enter Phone Number</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        keyboardType="numeric"
                        value={brokerPhoneNumber}
                        onChangeText={setBrokerPhoneNumber}
                      />
                      <TouchableOpacity style={styles.button} onPress={sendOtp}>
                        <Text style={styles.buttonText}>Send OTP</Text>
                      </TouchableOpacity>
                    </>
                  ) : !isOtpVerified ? (
                    <>
                      <Text style={styles.modalTitle}>Enter OTP</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter OTP"
                        keyboardType="numeric"
                        value={otp}
                        onChangeText={setOtp}
                      />
                      <TouchableOpacity style={styles.button} onPress={verifyOtp}>
                        <Text style={styles.buttonText}>Verify OTP</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <Text style={styles.modalTitle}>Enter Vehicle Number</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Vehicle Number"
                        value={vehicleNumber}
                        onChangeText={handleInputChange}
                      />
                      {loading && <Text>Loading...</Text>}
                      <FlatList
                        data={vehicles}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.vehicleItem}
                            onPress={() => handleVehicleSelect(item)}
                          >
                            <Text>{item}</Text>
                          </TouchableOpacity>
                        )}
                      // ListEmptyComponent={!loading && <Text>No vehicles found</Text>}
                      />
                    </>
                  )}

                </>
              }
              ListFooterComponent={
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={submitVehicleNumber}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              }
              ListEmptyComponent={null} // Disable the empty list component since the ListHeaderComponent is already used
            />

          </View>
        </Modal>
        <View clasName="flex-1">
          <Text className="pl-[100px] bg-blue-300 h-[30px] text-xl">Company Newsletter</Text>
        </View>

        <View style={{ backgroundColor: 'black', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 20 }}>
          <TouchableOpacity>
            <AntDesign name="home" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: 'blue', borderRadius: 24, padding: 10 }}>
            <Entypo name="shop" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile', { phoneNumber })}>
            <AntDesign name="user" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = new StyleSheet.create({
  cardContainer: {
    flexDirection: 'row', // Or 'column' depending on your layout preference
    justifyContent: 'space-between', // Adjust spacing between cards
    alignItems: 'center', // Align the cards vertically
    flexWrap: 'wrap', // Allows cards to wrap to the next row if needed
    gap: 10,
  },
  selectionContainer: {
    borderWidth: 2,
    borderColor: '#80eae0',
    backgroundColor: '#93aed2',
    borderRadius: 30,
    width: '90%',
    position: 'absolute',
    top: height * 0.15, // Adjusted based on screen height
    left: '5%',
    height: height * 0.35, // Dynamic height adjustment
    padding: 20,
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  card: {
    // width: 140,
    // height: 100,
    width: width * 0.37, // Responsive width
    height: height * 0.12, // Responsive height
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },

  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  topBox: {
    backgroundColor: '#e7feff',
    // backgroundColor: 'linear-gradient(to right, #70ACC1, #6F9C9F)',
    height: 250,
    padding: 50,
    paddingTop: 25
  },

  ctaWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 200
  },
  cta: {
    padding: 15,
    borderRadius: 10,
    shadowColor: '#1E40D8',
    shadowOffset: 0,
    shadowOpacity: 4,
    borderColor: '#80eae0',
    borderWidth: 2,
    shadowRadius: 10,
    height: 90,
    width: 110,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ADD8E6',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    marginTop: 5,
    marginHorizontal: 5,
    paddingBottom: 60, // Ensure there’s space for the submit button
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  crossButton: {
    position: "absolute",
    top: 0,
    right: 5,
    zIndex: 10, // Ensure it appears on top of other elements
  },
  crossButtonText: {
    fontSize: 18,
    color: "#000",
    backgroundColor: "gray", // Adds a red background
    borderWidth: 2,         // Adds a border
    borderColor: "#000",    // Ensures the border is visible (default is transparent)
    // borderRadius: 50,       // Makes it a circular button for better appearance
    textAlign: "center",    // Centers the cross mark horizontally
    lineHeight: 30,         // Matches the height to make it vertically centered
    width: 30,              // Sets the width of the button
    height: 30,             // Sets the height of the button
  },
  scrollViewContent: {
    flexGrow: 1, // Ensures the ScrollView takes up all available space
    justifyContent: 'space-between',
  },
  vehicleItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 5,
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10, // Add margin to separate from the vehicle list
  },
})
