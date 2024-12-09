import React, { useState } from 'react';
import { Button, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, TextInput, Image,KeyboardAvoidingView, ScrollView, SafeAreaView, FlatList } from 'react-native';
import { AntDesign, Feather, Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Formik } from 'formik';
  
export default function MyPage() {
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

  

  const navigateBack = () => {
    // Add navigation logic to go back to the previous page
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const navigateToSettings = () => {
    // Add navigation logic to go to settings page
  };

  const navigateToHelp = () => {
    // Add navigation logic to go to help page
  };

  const navigateToAbout = () => {
    // Add navigation logic to go to about page
  };

  const navigateToLegal = () => {
    // Add navigation logic to go to legal page
  };

  const info= [{from: "delhi" , to: "Bhopal"},{from: "delhi" , to: "Bhopal"},{from: "delhi" , to: "Bhopal"},{from: "delhi" , to: "Bhopal"},
  {from: "delhi" , to: "Bhopal"},{from: "delhi" , to: "Bhopal"},{from: "delhi" , to: "Bhopal"},{from: "delhi" , to: "Bhopal"},{from: "Chennai" , to: "Lucknow"},]



  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [selectedItem, setSelectedItem] = useState('City');

  const handleSubmit = () => {
    // Handle form submission here
    // console.log('Address 1:', address1);
    // console.log('Address 2:', address2);
    // console.log('Pin Code:', pinCode);
    // console.log('Selected Item:', selectedItem);
  };

  

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
        
      <View className="relative min-h-screen mt-[30px]">
        {/* Header */}
        <View className="" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height:60,paddingHorizontal: 30 }}>
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
          <View style={{ position: 'absolute', top: 50, right: 20, backgroundColor: 'white', padding: 10, borderRadius: 5, elevation: 5, zIndex:2 }}>
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
    
        <View className=" h-[90%] w-[100%] flex items-center ">
        {/* <Text className="text-2xl">Ongoing Trips</Text> */}
       <View className="mt-4">
       <Text className="text-2xl mr-[150px] mb-11">FAQ</Text>
       
       <Text className="text-medium my-3">Lorem ipsum dolor sit amet, consectetur ?</Text>
       <Text className="text-medium my-3">Lorem ipsum dolor sit amet, consectetur ?</Text>
       <Text className="text-medium my-3">Lorem ipsum dolor sit amet, consectetur ?</Text>
       <Text className="text-medium my-3">Lorem ipsum dolor sit amet, consectetur ?</Text>
       </View>
        <Text className="text-xl mr-[150px] my-4">User Guide</Text>
        <Text className="text-xl mr-[150px] my-4">Contact us</Text>
        </View>
        

        {/* Footer */}
        <View className="mt-[30px] absolute bottom-0 w-full bg-black p-1" style={{  flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          <TouchableOpacity>
          <Feather name="truck" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: 'blue', borderRadius: 24, padding: 10 }}>
            <Entypo name="shop" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>{navigation.navigate('VspProfile')}}>
            <AntDesign name="user" size={24} color="white" />
          </TouchableOpacity>
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 50,
    },
    photoContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    photo: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 10,
      marginBottom: 20,
    },
    submitButton: {
      backgroundColor: 'blue',
      borderRadius: 5,
      padding: 15,
      alignItems: 'center',
    },
    submitButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 100, padding: 10
    },
    button: {
      height: 20,
      width: 20,
      fontSize: 10,
    },
    linkText: {
      fontSize: 18,
      color: 'blue',
      marginBottom: 20,
    },
  });
