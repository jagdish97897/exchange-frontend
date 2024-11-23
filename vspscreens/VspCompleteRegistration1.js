import React, { useState } from 'react';
import { Button, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, TextInput, Image,KeyboardAvoidingView, ScrollView } from 'react-native';
import { AntDesign, Feather, Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

  
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





  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [selectedItem, setSelectedItem] = useState('City');

  const handleSubmit = () => {
    // Handle form submission here
    console.log('Address 1:', address1);
    console.log('Address 2:', address2);
    console.log('Pin Code:', pinCode);
    console.log('Selected Item:', selectedItem);
  };

  

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
        
      <View className="relative min-h-screen mt-[30px]">
        {/* Header */}
        <View style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height:60,  marginBottom: 20, paddingHorizontal: 30, }}>
          {/* Left Arrow */}
          <TouchableOpacity onPress={navigateBack}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
          
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
    
        <View className=" py-2 h-[90%] w-[100%] flex items-center">
        <Text className="text-2xl text-red-400">Complete Registration</Text>
        <View className=" w-[100%] h-[89%] flex-column">
            <View className="flex-row mx-auto mt-2 items-center">
                <View className="flex items-center mt-6">
                <View className="h-7 w-7 border-2 rounded-2xl flex justify-center items-center bg-blue-600"><Text>1</Text>
                </View><View className="mt-4 ">
                <FontAwesome name="long-arrow-down" size={30} color="darkblue" /></View>
                </View>
                <View className="bg-blue-600 ml-4 h-11 w-[250px] flex items-center justify-center "><Text className="text-xl">Vechile Details</Text></View>
            </View>
            <View className="flex-row mx-auto mt-2 items-center">
                <View className="flex items-center mt-6">
                <View className="h-7 w-7 border-2 rounded-2xl flex justify-center items-center bg-blue-600"><Text>2</Text>
                </View><View className="mt-4">
                <FontAwesome name="long-arrow-down" size={30} color="darkblue" /></View>
                </View>
                <View className="bg-blue-600 ml-4 h-11 w-[250px] flex items-center justify-center "><Text className="text-xl">Vechile Details</Text></View>
            </View>
            <View className="flex-row mx-auto mt-2 items-center">
                <View className="flex items-center mt-6">
                <View className="h-7 w-7 border-2 rounded-2xl flex justify-center items-center"><Text>3</Text>
                </View><View className="mt-4">
                <FontAwesome name="long-arrow-down" size={30} color="lightblue" /></View>
                </View>
                <View className="bg-blue-300 ml-4 h-11 w-[250px] flex items-center justify-center "><Text className="text-xl">Vechile Details</Text></View>
            </View>
            <View className="flex-row mx-auto mt-2 items-center">
                <View className="flex items-center mt-6">
                <View className="h-7 w-7 border-2 rounded-2xl flex justify-center items-center"><Text>4</Text>
                </View><View className="mt-4">
                <FontAwesome name="long-arrow-down" size={30} color="lightblue" /></View>
                </View>
                <View className="bg-blue-300 ml-4 h-11 w-[250px] flex items-center justify-center "><Text className="text-xl">Vechile Details</Text></View>
            </View>
            <View className="flex-row mx-auto mt-4 items-center">
                <View className="flex items-center mt-6">
                <View className="h-7 w-7 border-2 rounded-2xl flex justify-center items-center"><Text>5</Text>
                </View>
                </View>
                <View className="bg-blue-300 ml-4 h-11 w-[250px] flex items-center justify-center "><Text className="text-xl">Vechile Details</Text></View>
            </View>
        </View>
        </View>
        

        {/* Footer */}
        <View className="mt-[30px] absolute bottom-0 w-full bg-black p-1" style={{  flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          <TouchableOpacity>
          <Feather name="truck" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: 'blue', borderRadius: 24, padding: 10 }}>
            <Entypo name="shop" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
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
