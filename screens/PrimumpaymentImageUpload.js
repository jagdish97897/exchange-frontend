import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

const PrimumpaymentImageUpload = ({ route }) => {
  // Destructure parameters from the route
  const { formData, amount, visitorId } = route.params;

  const [images, setImages] = useState([]);
  const [visitorIdState, setVisitorId] = useState(visitorId || '');
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
          setImages(response.assets); // Set the selected images
        }
      }
    );
  };

  const handleSubmit = async () => {
    if (!visitorIdState || !amountState || images.length === 0) {
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
    formData.append('amount', amountState);

    try {
      const response = await axios.post('http://localhost:8000/api/primumupload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', response.data.message);
      setImages([]);
      setVisitorId('');
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

export default PrimumpaymentImageUpload;