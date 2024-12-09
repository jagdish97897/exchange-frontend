import React, { useState } from 'react';
import { Button, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, TextInput, Image,KeyboardAvoidingView, ScrollView, SafeAreaView, FlatList } from 'react-native';
import { AntDesign, Feather, Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
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
        <View className="bg-blue-100" style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height:60, paddingHorizontal: 30, }}>
          {/* Left Arrow */}
          
        </View>

        

        {/* Menu Options */}
        
    
        <View className=" py-2 h-[90%] w-[100%] flex items-center bg-blue-100">
        {/* <Text className="text-2xl">Ongoing Trips</Text> */}
        <View className="bg-white h-[88%] w-[90%] mt-4 rounded-lg flex items-center border-2">
          <View className="border-2 h-[100px] w-[90%] mt-4">
          <Image className="h-[100%] w-[100%]" source={{ uri: "https://via.placeholder.com/150" }} />
          </View>
          <View className="my-8 mx-5">
                    <Text className="" style={{textAlign: 'center', fontSize: 22, fontWeight: '700', marginTop: 10}}>Order Details</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
                        <View>
                            <Text style={{fontSize: 15, fontWeight: '700'}}>From</Text>
                            <Text>New Delhi</Text>

                            <View style={{marginTop: 15}}>
                                <Text style={{fontSize: 15, fontWeight: '700'}}>Pickup Time</Text>
                                <Text>3 PM</Text>
                            </View>
                        </View>
                        <AntDesign name="swap" size={24} color="black" />
                        <View>
                            <Text style={{fontSize: 15, fontWeight: '700'}}>To</Text>
                            <Text>Jaipur</Text>

                            <View style={{marginTop: 15}}>
                                <Text style={{fontSize: 15, fontWeight: '700'}}>ETA</Text>
                                <Text>1 hour 25 min</Text>
                            </View>
                        </View>
                    </View>

                    <View className="mt-6">
    
        </View>
        <View className="flex-row">
        <Text className="" style={{textAlign: 'center', fontSize: 17, fontWeight: '400'}}>Package Details</Text>
        <Image className="h-[40px] w-[80px] ml-11" source={{ uri: "https://via.placeholder.com/150" }} />
        </View>

         <View className="flex-row space-x-11 mr-4 py-1 ">
            <Text className="font-light text-base">Payload Dimensions</Text>
         </View>
         <View className="flex-row space-x-11 mr-4 py-1">
            <Text className="font-light text-base">Payload Weight</Text>
            <Text className="font-light text-base">Type</Text>
         </View>
         <View className="flex-row space-x-11 mr-4 py-1">
            <Text className="font-light text-base">Payload Cost</Text>
            <Text className="font-light text-base">Payload Vechile</Text>
         </View>
         <View className="flex-row space-x-11 ml-8 py-1">
            <Text className="font-light text-base">Special Instructions</Text>
         </View>
         <View className="flex items-center ml-4 py-1 my-8 bg-blue-600  rounded-lg">
            <Text className="font-light text-base text-white">Quote Price</Text>
         </View>
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
