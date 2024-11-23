import React, { useState } from 'react';
import { Button, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, TextInput, Image,KeyboardAvoidingView, ScrollView } from 'react-native';
import { AntDesign, Feather, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
  
export default function MyPage() {
  const [menuVisible, setMenuVisible] = useState(false);


  const navigation = useNavigation();



  const navigateBack = () => {
    // Add navigation logic to go back to the previous page
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
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
    
        <View className=" py-4 h-[90%] w-[90%] mx-auto flex items-center">
        <KeyboardAvoidingView className="w-[100%]" style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={100}>
        <Formik
     initialValues={{ walletBalance: 0 , addMoney: 0 , withdrawBalance: 0} }
     onSubmit={(values) => {navigation.navigate('MarketplaceAfterRebid') }}
   >
     {({ handleChange, handleBlur, handleSubmit, values }) => (
       <View className="mt-[60]">
        <View>
        <Text className="text-2xl mx-auto">Add Money to Wallet</Text>
         <TextInput className="m-[10%] mx-[120px] py-2 px-6 bg-gray-200 text-black-200"
           onChangeText={handleChange('addMoney')}
           onBlur={handleBlur('addMoney')}
           value={values.addMoney}
           placeholder='addMoney'
           keyboardType="numeric"
         />
        </View>

        <View>
        <Text className="text-2xl mx-auto">Withdraw Money from Wallet</Text>
         <TextInput className="m-[10%] mx-[120px] py-2 px-6 bg-gray-200 text-black-200"
           onChangeText={handleChange('addMoney')}
           onBlur={handleBlur('addMoney')}
           value={values.addMoney}
           placeholder='addMoney'
           keyboardType="numeric"
         />
        </View>
      
         <Button onPress={handleSubmit} title="Submit" />
       </View>
     )}
   </Formik> 
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




