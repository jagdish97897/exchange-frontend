import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const MultipleImageUpload1 = () => {
  const [images, setImages] = useState([]);
  const [userId, setUserId] = useState('');
  const [visitorId, setVisitorId] = useState('');
  const [cartId, setCartId] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [amount, setAmount] = useState('');

  // Simulate fetching initial data (replace this with your actual data fetching logic)
  useEffect(() => {
    const fetchInitialData = async () => {
      // Simulated fetched data
      const initialData = {
        userId: '12345', // Example userId
        visitorId: '67890', // Example visitorId
        cartId: 'abcde', // Example cartId
        totalPrice: '1500', // Example totalPrice
        amount: '500', 
      };

      // Set state with the fetched data
      setUserId(initialData.userId);
      setVisitorId(initialData.visitorId);
      setCartId(initialData.cartId);
      setTotalPrice(initialData.totalPrice);
      setAmount(initialData.amount);
    };

    fetchInitialData();
  }, []);

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1, selectionLimit: 4 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImages(response.assets); // Set the selected images
      }
    });
  };

  const handleSubmit = async () => {
    if (!userId || !visitorId || !cartId || !totalPrice || !amount || images.length === 0) {
      Alert.alert('Please fill all fields and select images.');
      return;
    }

    const formData = new FormData();

    // Append images to FormData
    images.forEach((image, index) => {
      formData.append('images', {
        uri: image.uri,
        name: `image${index + 1}.jpg`, 
        type: image.type,
      });
    });

    // Append other fields to FormData
    formData.append('userId', userId);
    formData.append('visitorId', visitorId);
    formData.append('cartId', cartId);
    formData.append('totalPrice', totalPrice);
    formData.append('amount', amount);

    try {
      const response = await axios.post('http://192.168.1.5:8005/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', response.data.message);
      // Optionally, reset the form after successful submission
      setImages([]);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'An error occurred during the upload');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>User ID:</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10 }}
        value={userId}
        onChangeText={setUserId}
        placeholder="Enter User ID"
      />

      <Text>Visitor ID:</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10 }}
        value={visitorId}
        onChangeText={setVisitorId}
        placeholder="Enter Visitor ID"
      />

      <Text>Cart ID:</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10 }}
        value={cartId}
        onChangeText={setCartId}
        placeholder="Enter Cart ID"
      />

      <Text>Total Price:</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10 }}
        value={totalPrice}
        onChangeText={setTotalPrice}
        placeholder="Enter Total Price"
        keyboardType="numeric"
      />

      <Text>Amount:</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10 }}
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter Amount"
        keyboardType="numeric"
      />

      <Button title="Select Images" onPress={handleImagePicker} />
      <Button title="Upload" onPress={handleSubmit} />

      {/* Optionally display selected images */}
      {images.map((image, index) => (
        <Text key={index}>{image.fileName || image.uri}</Text>
      ))}
    </View>
  );
};

export default MultipleImageUpload1;



// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Image, ScrollView, StyleSheet, Alert, Keyboard, Dimensions, Linking, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useNavigation } from '@react-navigation/native';

// const { width, height } = Dimensions.get('window');

// const MultipleImageUpload1 = () => {

//     const [loading, setLoading] = useState(false);
//     const navigation = useNavigation();

//     const [keyboardVisible, setKeyboardVisible] = useState(false);
//     // Request media library permissions
//     const requestPermission = async () => {
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== 'granted') {
//             Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
//         }
//     };

//     useEffect(() => {
//         requestPermission();
//     }, []);

//     const pickImage = async (imageKey) => {
//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             quality: 1,
//         });

//         if (!result.canceled) {
//             setImages((prevImages) => ({ ...prevImages, [imageKey]: result.assets[0] }));
//         }
//     };

//     const uploadImage = async () => {
//         const formData = new FormData();



//         // Add images to the form data
//         Object.keys(images).forEach((key) => {
//             const image = images[key];
//             if (image && image.uri) {
//                 const uri = image.uri;
//                 const fileType = uri.split('.').pop();
//                 const type = `image/${fileType}`;
//                 const name = `${key}.${fileType}`;

//                 // console.log('uri', uri)

//                 // Append the image to formData
//                 formData.append('images', {
//                     uri,
//                     type,
//                     name,
//                 });
//             }
//         });

//         try {
//             const response = await axios.post('', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             console.log(`Image uploaded successfully:`, response.data);
//             return response.data;
//         } catch (error) {
//             // // console.log(`Upload error for image :`, error.response ? error.response.data : error.message);
//             // // throw new Error(error.message);
//             // Alert.alert('Error', error.message);
//             // Check if error has a response (server-side error)
//             if (error.response) {
//                 // Log full error details (useful for debugging)
//                 // console.error('Error response:', error.response.data);

//                 // Provide a user-friendly error message based on status code
//                 if (error.response.status === 400) {
//                     Alert.alert('Error', error.response.data.error);
//                 } else if (error.response.status === 500) {
//                     Alert.alert('Error', 'Server is down. Please try again later.');
//                 } else {
//                     Alert.alert('Error', 'An unknown error occurred.');
//                 }
//             } else if (error.request) {
//                 // Request made but no response (network error or server issue)
//                 // console.error('Error request:', error.request);
//                 Alert.alert('Error', 'Unable to connect to the server. Please check your network.');
//             } else {
//                 // Something else triggered the error
//                 // console.error('Error', error.message);
//                 Alert.alert('Error', error.message);
//             }

//         }
//     };

//     const handleUpload = async () => {
//         setLoading(true);


//         if (Object.keys(images).filter((key) =>
//             !(key === 'imageTwitter' || key === 'imageFacebook')
//         ).length < 2) {
//             Alert.alert('Error', 'Please select all images.');
//             return;
//         }

//         try {
//             const data = await uploadImage(); 
//             // console.log('data after upload', data);
//             if (data) {
//                 Alert.alert('Success');   // Create form data object without images
//                 const formDataWithoutImages = {

//                     userId: data?.user?._id
//                 };


//             }
//         } catch (error) {
//             console.log('error in handle upload', error.message)
//             Alert.alert('Error8', error.message);
//         }
//         finally {
//             // Stop the loader after getting the response
//             setLoading(false);
//         }
//     }




//     useEffect(() => {
//         const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
//             setKeyboardVisible(true);
//         });
//         const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
//             setKeyboardVisible(false);
//         });

//         return () => {
//             keyboardDidShowListener.remove();
//             keyboardDidHideListener.remove();
//         };
//     }, []);
//     return (
//         <LinearGradient
//             colors={['#06264D', '#FFF']}
//             style={styles.gradient}
//         >
//             <Image
//                 source={require("../assets/images/kgvmitr.png")}
//                 style={styles.logo}
//             />
//             <Text style={styles.vehicledetails}>Pay</Text>

//             <ScrollView contentContainerStyle={styles.container}>








//                 {["Instagram", "Youtube", "Twitter", "Facebook"].map((platform) => (
//                     <View key={platform} style={styles.imagePickerContainer}>
//                         <View style={styles.rowContainer}>

//                             <Text style={styles.imageText}>{platform}</Text>

                            
//                         </View>

//                         {/* Conditionally render the image if it exists */}
//                         {images[`image${platform}`] && (
//                             <Image
//                                 source={{ uri: images[`image${platform}`].uri }}
//                                 style={styles.image}
//                             />
//                         )}
//                         <Button title="Pick" onPress={() => pickImage(`image${platform}`)} />

//                     </View>
//                 ))}

//                 {loading ? (
//                     // Display the loader while registering
//                     <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
//                 ) : (

//                     <TouchableOpacity
//                         style={[styles.button, styles.submitButton]}
//                         onPress={handleUpload}
//                     >
//                         <Text style={styles.buttonText}>Submit</Text>
//                     </TouchableOpacity>
//                 )
//                 }
//             </ScrollView>

//             {!keyboardVisible && (
//                 <View style={styles.footer}>
//                     <Image
//                         source={require("../assets/images/mantra.jpg")}
//                         style={styles.footerImage}
//                     />
//                     <View style={styles.footerTextContainer}>
//                         <Text style={styles.footerText}>Made in</Text>
//                         <Image
//                             source={require("../assets/images/image 10.png")}
//                             style={styles.footerFlag}
//                         />
//                     </View>
//                     <Image
//                         source={require("../assets/images/make-in-India-logo.jpg")}
//                         style={styles.footerLogo}
//                     />
//                 </View>
//             )}
//         </LinearGradient>
//     );
// };

// const styles = StyleSheet.create({
//     gradient: {
//         flex: 1,
//     },
//     container: {
//         padding: width * 0.05,
//         backgroundColor: 'transparent',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     logo: {
//         width: 100,
//         height: 130,
//         alignSelf: 'center',
//         marginBottom: 20,
//         marginTop: 20,
//     },
//     input: {
//         borderBottomWidth: 2,
//         borderBottomColor: 'black',
//         borderStyle: 'solid',
//         padding: 10,
//         width: '80%',
//         marginTop: 10,
//     },
//     imagePickerContainer: {
//         borderBottomWidth: 2,
//         borderBottomColor: 'black',
//         borderStyle: 'solid',
//         padding: 10,
//         width: '80%',
//         marginTop: 10,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     rowContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     imageText: {
//         fontSize: 16,
//         color: 'black',
//     },
//     image: {
//         width: width * 0.1,
//         height: width * 0.1,
//         borderRadius: 10,
//         marginTop: 10,
//         marginLeft: 20,
//     },
//     vehicledetails: {
//         fontSize: 32,
//         fontWeight: 'bold',
//         color: '#FFF',
//         marginBottom: 20,
//         textAlign: 'center',
//     },
//     vehicledetails1: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#FFF',
//         marginBottom: 10,
//         textAlign: 'center',
//     },
//     socialMediaLink: {
//         fontSize: 14,
//         color: '#1DA1F2', // Example color for Twitter-like link
//         textDecorationLine: 'underline',
//         marginHorizontal: 20,
//     },
//     button: {
//         backgroundColor: '#06264D', // Blue background
//         borderRadius: 5,
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: '#FFF',
//         fontSize: 16,
//     },
//     submitButton: {
//         marginTop: 20,
//     },
//     footer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         margin: height * 0.04,

//     },
//     footerImage: {
//         width: width * 0.09, // 9% of screen width
//         height: height * 0.05, // 5% of screen height
//     },
//     footerTextContainer: {
//         alignItems: 'center',
//     },
//     footerText: {
//         color: 'black',
//         fontSize: width * 0.025, // Font size relative to screen width
//     },
//     footerFlag: {
//         width: width * 0.06, // 6% of screen width
//         height: height * 0.02, // 2% of screen height
//     },
//     footerLogo: {
//         width: width * 0.12, // 12% of screen width
//         height: height * 0.05, // 5% of screen height
//     },
// });

// export default MultipleImageUpload1;
