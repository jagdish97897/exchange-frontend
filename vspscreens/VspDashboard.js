import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity,TouchableWithoutFeedback, StyleSheet, TextInput, Image } from "react-native";
import Autocomplete from "react-google-autocomplete";
import { AntDesign, Feather, Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

export default () => {
    const [menuVisible, setMenuVisible] = useState(false);


  const navigation = useNavigation();

  const handleDocumentsClick = () => {
    // Navigate to the Documents page
    navigation.navigate('Documents');
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
  const [photo, setPhoto] = useState(null); // State for storing the photo URI
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

    return (
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
        <View style={{ flex: 1, paddingTop: 26 }}>
        <View className="" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height:60,  marginBottom: 20, paddingHorizontal: 30 }}>
          {/* Left Arrow */}
          <TouchableOpacity onPress={navigateBack}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
     <View className="ml-[170px]">     
    <Feather name="headphones" size={24} color="black" /></View>
    <View className="ml-[30px]"> 
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
          <View style={{ position: 'absolute', top: 75, right: 20, backgroundColor: 'white', padding: 10, borderRadius: 5, elevation: 5, zIndex:2 }}>
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
        <View className="flex items-center my-6">
       <Text className="text-3xl">Welcome Aboard @</Text>
       <Text className="text-3xl">TWCPL</Text></View>
        <SafeAreaView style={styles.container}>
        <View className="bg-blue-900 rounded-3xl m mx-[80px] py-4 flex items-center">
            <TouchableOpacity onPress={()=>{navigation.navigate('BookingForm')}}>
            <Text className="text-2xl text-yellow-700">Register Vechile</Text>
            </TouchableOpacity>
        </View>

            <View style={styles.ctaWrapper}>
                <TouchableOpacity style={styles.cta}>
                    <Text>Wallet</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cta}>
                    <Text>Insurance</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cta}>
                    <Text>Help & FAQ</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
        <View clasName="flex-1">
            <Text className="pl-[100px] bg-blue-300 mt-5 h-[30px] text-xl">Company Newsletter</Text>
            </View>
            <View className="mt-6">
        <Image className="h-[300px] w-[100%]" source={{ uri: "https://via.placeholder.com/150" }} />
        </View>
        <View style={{ backgroundColor: 'black', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 20 }}>
          <TouchableOpacity>
          <Feather name="truck" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: 'blue', borderRadius: 24, padding: 10 }}>
            <Entypo name="shop" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <AntDesign name="user" size={24} color="white" />
          </TouchableOpacity>
        </View>
        </View>
        </TouchableWithoutFeedback>
    )
}

const styles = new StyleSheet.create({
    container: {
        
       
    },
    topBox: {
        backgroundColor: '#70ACC1',
        height: 250,
        padding: 50
    },
    selectionContainer: {
        backgroundColor: '#1E40D8',
        borderRadius: 50,
        width: '90%',
        position: 'absolute',
        top: 120,
        left: '5%',
        height: 2,
        padding: 20
    },
    ctaWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 70
    },
    cta: {
        padding: 15,
        borderRadius: 10,
        shadowColor: '#1E40D8',
        shadowOffset: 0,
        shadowOpacity: 4,
        borderColor: '#1E40D8',
        borderWidth: 2,
        shadowRadius: 10
    }
})