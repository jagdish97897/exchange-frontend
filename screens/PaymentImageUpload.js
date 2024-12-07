import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const PaymentImageUpload = ({ route }) => {
  // Destructure parameters from the route
  const { formData, amount, visitorId, cartId } = route.params;

  const [images, setImages] = useState([]);
  const [visitorIdState, setVisitorId] = useState(visitorId || '');
  const [cartIdState, setCartId] = useState(cartId || '');
  const [amountState, setAmount] = useState(amount || '');

  const handleImagePicker = () => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 1, selectionLimit: 4 },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.assets) {
          setImages(response.assets);
        }
      }
    );
  };

  const handleSubmit = async () => {
    if (!visitorIdState || !cartIdState || !amountState || images.length === 0) {
      Alert.alert('Please upload image after payments.');
      return;
    }

    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append('images', {
        uri: image.uri,
        name: image.fileName || `image${index + 1}.jpg`,
        type: image.type,
      });
    });

    formData.append('visitorId', visitorIdState);
    formData.append('cartId', cartIdState);
    formData.append('amount', amountState);

    try {
      const response = await axios.post('http://192.168.1.13:8000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', response.data.message);
      setImages([]);
      setVisitorId('');
      setCartId('');
      setAmount('');
    } catch (error) {
      console.error('Upload error:', error.response ? error.response.data : error.message);
      Alert.alert('Error', error.response?.data?.message || 'An error occurred during the upload');
    }
  };


  return (
    <LinearGradient colors={['#06264D', "#FFF"]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, padding: 40 }}>
        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>Payment Information</Text>
        </View>

        <View style={styles.imageContainer}>
          <Text style={styles.text}> pay using the following details:</Text>
          <Text style={styles.text}>Scan the QR code to make a payment:</Text>
          <Image
            source={require("../assets/images/scanner.png")}
            style={styles.image}
          />

          <Text style={styles.text}>UPI Transfer Details:</Text>
          <View style={styles.card}>
            <Text style={styles.text1}>UPI ID : KGVL@sbi</Text>
          </View>
          <Text style={styles.text}>Bank Transfer Details:</Text>
          <View style={styles.card}>
            <Text style={styles.text1}>Bank Account No : 872347578662</Text>
            <Text style={styles.text1}>IFSC Code : BABR0AIRPOR</Text>

          </View>
          <Text style={styles.text2}>Your payable amount is {amount} for booking:</Text>
        </View>







        {/* <Button title="Select Images" onPress={handleImagePicker} />
      <Button title="Upload" onPress={handleSubmit} /> */}

        <View style={styles.container}>

          <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
            <Text style={styles.buttonText}>Select Images</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
        {/* Display selected images */}
        <View style={styles.imageContainer}>
          {images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image.uri }}
              style={styles.image}
            />
          ))}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  imageContainer: {
    flexDirection: 'column', // Stack images vertically
    alignItems: 'center', // Center images horizontally
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    margin: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 10, // Space between text elements
    marginTop: 10, // Space between text elements
    color: '#FFF',
  },
  text2: {
    fontSize: 16,
    marginBottom: 10, // Space between text elements
    marginTop: 10, // Space between text elements
    color: '#FFF',
    fontWeight: 'bold',
  },
  headingContainer: {
    alignItems: 'center',
    marginVertical: 20, // 1% of screen height
  },
  headingText: {
    fontSize: 34, // Scales with screen width
    fontWeight: 'bold',
    color: '#FFF',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // White with 50% opacity
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000', // Optional shadow for elevation
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5, // For Android
    margin: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20,
  },
  button: {
    backgroundColor: '#6200EE', // Purple color
    padding: 15,
    borderRadius: 5,
    elevation: 3, // For shadow on Android
  },
  buttonText: {
    color: '#FFFFFF', // White text color
    fontSize: 16,
    textAlign: 'center',
  },

});

export default PaymentImageUpload;


// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, Button, Alert } from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';
// import axios from 'axios';

// const PaymentImageUpload = ({ route }) => {
//   // Destructure parameters from the route
//   const { amount, visitorId, cartId} = route.params;

//   const [images, setImages] = useState([]);

//   // Use the parameters directly in your state or display them

//   const [visitorIdState, setVisitorId] = useState(visitorId || '');
//   const [cartIdState, setCartId] = useState(cartId || '');
//   const [amountState, setAmount] = useState(amount || '');

//   const handleImagePicker = () => {
//     launchImageLibrary({ mediaType: 'photo', quality: 1, selectionLimit: 4 }, (response) => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.error) {
//         console.log('ImagePicker Error: ', response.error);
//       } else {
//         setImages(response.assets); // Set the selected images
//       }
//     });
//   };

//   const handleSubmit = async () => {
//     if (!userId || !visitorIdState || !cartIdState || !totalPriceState || !amountState || images.length === 0) {
//       Alert.alert('Please fill all fields and select images.');
//       return;
//     }

//     const formData = new FormData();

//     // Append images to FormData
//     images.forEach((image, index) => {
//       formData.append('images', {
//         uri: image.uri,
//         name: `image${index + 1}.jpg`, // You can use other formats too
//         type: image.type,
//       });
//     });

//     // Append other fields to FormData

//     formData.append('visitorId', visitorIdState);
//     formData.append('cartId', cartIdState);
//     formData.append('amount', amountState);

//     try {
//       const response = await axios.post('http://192.168.1.13:8000/api/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       Alert.alert('Success', response.data.message);
//       // Optionally, reset the form after successful submission
//       setImages([]);
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'An error occurred during the upload');
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>


//       <Text>Visitor ID:</Text>
//       <TextInput
//         style={{ borderWidth: 1, marginBottom: 10 }}
//         value={visitorIdState}
//         onChangeText={setVisitorId}
//         placeholder="Enter Visitor ID"
//       />

//       <Text>Cart ID:</Text>
//       <TextInput
//         style={{ borderWidth: 1, marginBottom: 10 }}
//         value={cartIdState}
//         onChangeText={setCartId}
//         placeholder="Enter Cart ID"
//       />


//       <Text>Amount:</Text>
//       <TextInput
//         style={{ borderWidth: 1, marginBottom: 10 }}
//         value={amountState}
//         onChangeText={setAmount}
//         placeholder="Enter Amount"
//         keyboardType="numeric"
//       />

//       <Button title="Select Images" onPress={handleImagePicker} />
//       <Button title="Upload" onPress={handleSubmit} />

//       {/* Optionally display selected images */}
//       {images.map((image, index) => (
//         <Text key={index}>{image.fileName || image.uri}</Text>
//       ))}
//     </View>
//   );
// };

// export default PaymentImageUpload;



// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, Button, Alert } from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';
// import axios from 'axios';

// const PaymentImageUpload = () => {
//   const [images, setImages] = useState([]);
//   const [userId, setUserId] = useState('');
//   const [visitorId, setVisitorId] = useState('');
//   const [cartId, setCartId] = useState('');
//   const [totalPrice, setTotalPrice] = useState('');
//   const [amount, setAmount] = useState('');

//   // Simulate fetching initial data (replace this with your actual data fetching logic)
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       // Simulated fetched data
//       const initialData = {
//         userId: '12345', // Example userId
//         visitorId: '67890', // Example visitorId
//         cartId: 'abcde', // Example cartId
//         totalPrice: '1500', // Example totalPrice
//         amount: '500', // Example amount
//       };

//       // Set state with the fetched data
//       setUserId(initialData.userId);
//       setVisitorId(initialData.visitorId);
//       setCartId(initialData.cartId);
//       setTotalPrice(initialData.totalPrice);
//       setAmount(initialData.amount);
//     };

//     fetchInitialData();
//   }, []);

//   const handleImagePicker = () => {
//     launchImageLibrary({ mediaType: 'photo', quality: 1, selectionLimit: 4 }, (response) => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.error) {
//         console.log('ImagePicker Error: ', response.error);
//       } else {
//         setImages(response.assets); // Set the selected images
//       }
//     });
//   };

//   const handleSubmit = async () => {
//     if (!userId || !visitorId || !cartId || !totalPrice || !amount || images.length === 0) {
//       Alert.alert('Please fill all fields and select images.');
//       return;
//     }

//     const formData = new FormData();

//     // Append images to FormData
//     images.forEach((image, index) => {
//       formData.append('images', {
//         uri: image.uri,
//         name: `image${index + 1}.jpg`, // You can use other formats too
//         type: image.type,
//       });
//     });

//     // Append other fields to FormData
//     formData.append('userId', userId);
//     formData.append('visitorId', visitorId);
//     formData.append('cartId', cartId);
//     formData.append('totalPrice', totalPrice);
//     formData.append('amount', amount);

//     try {
//       const response = await axios.post('http://192.168.1.13:8000/api/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       Alert.alert('Success', response.data.message);
//       // Optionally, reset the form after successful submission
//       setImages([]);
//     } catch (error) {
//       Alert.alert('Error', error.response?.data?.message || 'An error occurred during the upload');
//     }
//   };

//   return (
//     <View style={{ padding: 20 }}>
//       <Text>User ID:</Text>
//       <TextInput
//         style={{ borderWidth: 1, marginBottom: 10 }}
//         value={userId}
//         onChangeText={setUserId}
//         placeholder="Enter User ID"
//       />

//       <Text>Visitor ID:</Text>
//       <TextInput
//         style={{ borderWidth: 1, marginBottom: 10 }}
//         value={visitorId}
//         onChangeText={setVisitorId}
//         placeholder="Enter Visitor ID"
//       />

//       <Text>Cart ID:</Text>
//       <TextInput
//         style={{ borderWidth: 1, marginBottom: 10 }}
//         value={cartId}
//         onChangeText={setCartId}
//         placeholder="Enter Cart ID"
//       />

//       <Text>Total Price:</Text>
//       <TextInput
//         style={{ borderWidth: 1, marginBottom: 10 }}
//         value={totalPrice}
//         onChangeText={setTotalPrice}
//         placeholder="Enter Total Price"
//         keyboardType="numeric"
//       />

//       <Text>Amount:</Text>
//       <TextInput
//         style={{ borderWidth: 1, marginBottom: 10 }}
//         value={amount}
//         onChangeText={setAmount}
//         placeholder="Enter Amount"
//         keyboardType="numeric"
//       />

//       <Button title="Select Images" onPress={handleImagePicker} />
//       <Button title="Upload" onPress={handleSubmit} />

//       {/* Optionally display selected images */}
//       {images.map((image, index) => (
//         <Text key={index}>{image.fileName || image.uri}</Text>
//       ))}
//     </View>
//   );
// };

// export default PaymentImageUpload;
