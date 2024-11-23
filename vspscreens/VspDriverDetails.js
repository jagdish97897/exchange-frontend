import React, { useState } from 'react';
import { Button, View, Text, TouchableOpacity, TouchableWithoutFeedback, Modal, Image, KeyboardAvoidingView, ScrollView, Platform} from 'react-native';
import { AntDesign, Feather, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import { TextInput } from 'react-native';
  
export default function MyPage() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [formValues, setFormValues] = useState("");

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

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };



  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
        
      <View className="relative min-h-screen mt-[30px] ">
        {/* Header */}
        <View className="" style={{  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height:60, paddingHorizontal: 30, }}>
          {/* Left Arrow */}
          <TouchableOpacity onPress={()=>{navigation.navigate('MarketplaceAfterBooking')}}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>

        
      {/* {image && <Image source={{ uri: image }} style={styles.image} onPress={pickImage}/>} */}
      </View>
          
        </View>

       
       <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView>
       <View className="mx-11 mb-11">
       {/* <Text>{JSON.stringify(formValues)}</Text> */}

        
            <Formik
     initialValues={{ VechileNumber: '' , OwnerName: '', WhatsappContactNumber:'' , EmailId:'' , AddressLine1:'', City:'', State:'',Pincode:''}}
     onSubmit={(values) => {
      // navigation.navigate('MarketplaceAfterRebid') 
      console.log(values);
      // setFormValues(values);
    }}
   >
     {({ handleChange, handleBlur, handleSubmit, values }) => (
       <View className="mt-[140px]">
        
         <TextInput className="mx-[10%] my-2 bg-blue-200 text-black-200 pl-4"
           onChangeText={handleChange('VechileNumber')}
           onBlur={handleBlur('VechileNumber')}
           value={values.VechileNumber}
           placeholder='vechile no.'
         />
         <TextInput className="mx-[10%] my-2 bg-blue-200 text-black-200 pl-4"
           onChangeText={handleChange('OwnerName')}
           onBlur={handleBlur('OwnerName')}
           value={values.OwnerName}
           placeholder='Vendor Firm Name'
         />
         <View className="flex-row ml-8">
         <TextInput className=" my-2 bg-blue-200 text-black-200 pl-2 pr-2"
           onChangeText={handleChange('WhatsappContactNumber')}
           onBlur={handleBlur('WhatsappContactNumber')}
           value={values.WhatsappContactNumber}
           placeholder='Whatsapp Contact Number'
           keyboardType="numeric"
         />
         <View className="border-2 h-7 mt-2 ml-2 w-[60px] flex items-center justify-center"><Text>Verify</Text></View>
         </View>
         <TextInput className="mx-[10%] my-2 bg-blue-200 text-black-200 pl-4"
           onChangeText={handleChange('EmailId')}
           onBlur={handleBlur('EmailId')}
           value={values.EmailId}
           placeholder='Email Id'
         />
         <TextInput className="mx-[10%] my-2 bg-blue-200 text-black-200 pl-4"
           onChangeText={handleChange('AddressLine1')}
           onBlur={handleBlur('AddressLine1')}
           value={values.AddressLine1}
           placeholder='Address Line 1'
         />
         <View className="flex-row ml-8">
         <TextInput className=" my-2 bg-blue-200 text-black-200 pl-4 w-[110px]"
           onChangeText={handleChange('City')}
           onBlur={handleBlur('City')}
           value={values.City}
           placeholder='City'
         />
         <TextInput className="my-2 bg-blue-200 text-black-200 pl-4 ml-5 w-[110px]"
           onChangeText={handleChange('State')}
           onBlur={handleBlur('State')}
           value={values.State}
           placeholder='State'
         />
         </View>
         <View className="flex-row ml-8">
         <TextInput className=" my-2 bg-blue-200 text-black-200 pl-4 w-[110px]"
           onChangeText={handleChange('Pincode')}
           onBlur={handleBlur('Pincode')}
           value={values.Pincode}
           placeholder='Pincode'
         />
         
         </View>
         <TouchableOpacity onPress={handleSubmit}>
         <View className="w-[150px] h-[50px] ml-[70px] mt-[60px] rounded-2xl  bg-blue-500 flex items-center justify-center">
         <Text className="text-white text-2xl">Sign Up</Text>
         </View>
         </TouchableOpacity>
       </View>
     )}
   </Formik>
   </View>
   </ScrollView>
   </KeyboardAvoidingView>
   
        

       

      </View>
    </TouchableWithoutFeedback>
  );
}