import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, TextInput, Image, Modal, Button } from "react-native";
import Autocomplete from "react-google-autocomplete";
import { AntDesign, Feather, Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Ind from '../assets/images/image 10.png';
import axios from 'axios';


export default ({ route }) => {
  const { phoneNumber } = route.params;
  console.log(phoneNumber)
  const [menuVisible, setMenuVisible] = useState(false);
  const [ownerId, setOwnerId] = useState('');

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

    console.log(result);

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
        const response = await axios.get(`http://192.168.1.13:8000/api/v1/users/user/${phoneNumber}`);
        const { _id } = response.data;
        console.log(_id)
        setOwnerId(_id); // Set the user ID
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [phoneNumber]);

  return (
    <TouchableWithoutFeedback onPress={toggleMenu}>
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
                onPress={() => navigation.navigate("AddVehicleScreen")}
              >
                <Text style={styles.cardText}>Add Vehicle</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("GetVehicleScreen", { ownerId })}
              >
                <Text style={styles.cardText}>View & Update Vehicle</Text>
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
    width: '100%',
  },
  selectionContainer: {
    borderWidth: 2,
    borderColor: '#80eae0',
    backgroundColor: '#93aed2',
    borderRadius: 30,
    width: '90%',
    position: 'absolute',
    top: 120,
    left: '5%',
    height: 250,
    padding: 20,
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  card: {
    width: 140,
    height: 100,
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
    // backgroundColor: '#e7feff',
    // backgroundColor: 'linear-gradient(to right, #70ACC1, #6F9C9F)',
    height: 250,
    padding: 50
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

  }
})
