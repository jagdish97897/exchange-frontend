import React, { useState } from 'react';
import { Button, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, TextInput, Image,KeyboardAvoidingView, ScrollView } from 'react-native';
import { AntDesign, Feather, Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';

  
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
        <View style={{ backgroundColor:"grey", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height:60,  marginBottom: 20, paddingHorizontal: 30, }}>
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
    
        <View className=" py-4 h-[90%] w-[100%] flex items-center">
        <KeyboardAvoidingView className="w-[100%]" style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={100}>
            <ScrollView className="w-[100%]" contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text className="text-2xl ">Book a Vechile</Text>
            <Text className="text-xl pl-[20px] ">Trip Details</Text>
            <View className="w-[100%] flex items-center">
            <Text className="text-xl mt-4 ">From</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, width: '80%' }}
        placeholder="Address Line 1"
        value={address1}
        onChangeText={text => setAddress1(text)}
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, width: '80%' }}
        placeholder="Address Line 2"
        value={address2}
        onChangeText={text => setAddress2(text)}
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, width: '80%' }}
        placeholder="Pin Code"
        value={pinCode}
        onChangeText={text => setPinCode(text)}
        keyboardType="numeric"
      />
      <Picker
        selectedValue={selectedItem}
        style={{ height: 50, width: '80%' }}
        onValueChange={(itemValue, itemIndex) => setSelectedItem(itemValue)}>
        <Picker.Item label="Option 1" value="option1" />
        <Picker.Item label="Option 2" value="option2" />
        <Picker.Item label="Option 3" value="option3" />
        <Picker.Item label="Option 4" value="option4" />
      </Picker>
      
    </View>
    <View className="w-[100%] flex items-center" >
    <Text className="text-xl  ">To</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, width: '80%' }}
        placeholder="Address Line 1"
        value={address1}
        onChangeText={text => setAddress1(text)}
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, width: '80%' }}
        placeholder="Address Line 2"
        value={address2}
        onChangeText={text => setAddress2(text)}
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, width: '80%' }}
        placeholder="Pin Code"
        value={pinCode}
        onChangeText={text => setPinCode(text)}
        keyboardType="numeric"
      />
      <Picker
        selectedValue={selectedItem}
        style={{ height: 50, width: '80%' }}
        onValueChange={(itemValue, itemIndex) => setSelectedItem(itemValue)}>
        <Picker.Item label="Option 1" value="option1" />
        <Picker.Item label="Option 2" value="option2" />
        <Picker.Item label="Option 3" value="option3" />
        <Picker.Item label="Option 4" value="option4" />
      </Picker>
      
    </View>
    <View className="w-[100%] flex items-center mb-11">
            <Text className="text-xl  ">Package Details</Text>
            <Picker
        selectedValue={selectedItem}
        style={{ height: 50, width: '80%' }}
        onValueChange={(itemValue, itemIndex) => setSelectedItem(itemValue)}>
        <Picker.Item label="Option 1" value="option1" />
        <Picker.Item label="Option 2" value="option2" />
        <Picker.Item label="Option 3" value="option3" />
        <Picker.Item label="Option 4" value="option4" />
      </Picker>
      <Picker
        selectedValue={selectedItem}
        style={{ height: 50, width: '80%' }}
        onValueChange={(itemValue, itemIndex) => setSelectedItem(itemValue)}>
        <Picker.Item label="Option 1" value="option1" />
        <Picker.Item label="Option 2" value="option2" />
        <Picker.Item label="Option 3" value="option3" />
        <Picker.Item label="Option 4" value="option4" />
      </Picker>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, width: '80%' }}
        placeholder="Payload Cost"
        value={address1}
        onChangeText={text => setAddress1(text)}
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, width: '80%' }}
        placeholder="Payload Height"
        value={address2}
        onChangeText={text => setAddress2(text)}
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, width: '80%' }}
        placeholder="Payload Width"
        value={pinCode}
        onChangeText={text => setPinCode(text)}
        keyboardType="numeric"
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, width: '80%' }}
        placeholder="Payload Length"
        value={pinCode}
        onChangeText={text => setPinCode(text)}
        keyboardType="numeric"
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, width: '80%' }}
        placeholder="Payload Weight"
        value={pinCode}
        onChangeText={text => setPinCode(text)}
        keyboardType="numeric"
      />
      <Picker
        selectedValue={selectedItem}
        style={{ height: 50, width: '80%' }}
        onValueChange={(itemValue, itemIndex) => setSelectedItem(itemValue)}>
        <Picker.Item label="Vechile" value="option1" />
        <Picker.Item label="Option 2" value="option2" />
        <Picker.Item label="Option 3" value="option3" />
        <Picker.Item label="Option 4" value="option4" />
      </Picker>
      <Picker
        selectedValue={selectedItem}
        style={{ height: 50, width: '80%' }}
        onValueChange={(itemValue, itemIndex) => setSelectedItem(itemValue)}>
        <Picker.Item label="Type of Storage" value="option1" />
        <Picker.Item label="Option 2" value="option2" />
        <Picker.Item label="Option 3" value="option3" />
        <Picker.Item label="Option 4" value="option4" />
      </Picker>
      <Text className="text-xl">Special Instruction</Text>
      <TextInput
        style={{ height: 100, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, width: '80%' }}
        placeholder="Start typing..."
        value={pinCode}
        onChangeText={text => setPinCode(text)}
        
      />
      <Button title="Submit" onPress={()=>{navigation.navigate('Preview')}} />
      <View className="h-[40px]"></View>
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
        </View>
        

        {/* Footer */}
        <View className="mt-[30px] absolute bottom-0 w-full bg-black p-1" style={{  flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
          <TouchableOpacity>
            <AntDesign name="home" size={24} color="white" />
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
