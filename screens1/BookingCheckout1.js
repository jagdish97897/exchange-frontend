import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, SafeAreaView, Image, Dimensions } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileButton1 from './ProfileButton1';
import CustomModal1 from './CustomModel1.js';

const { width, height } = Dimensions.get('window');

// Define scaling factor for width and height
const scaleWidth = width / 375;
const scaleHeight = height / 812; // Assuming a base screen height of 812

const BookingCheckout1 = ({ route }) => {
  const { selectedOption, visitorId, totalItems, user, cartId, totalPrice } = route.params;
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);


  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    aadhar: '',
    dlno: '',
    dob: '',
    gender: '',
    pan: '',
    email: '',
    amount: '',
  });

  useEffect(() => {
    const fetchVisitorDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.1.5:8005/api/v1/visitor/details/${visitorId}`);
        if (response.data.success) {
          const visitorData = response.data.data[0];
          const itemsCount = Number(totalItems);
          const calculatedAmount = itemsCount * 5000;

          if (isNaN(calculatedAmount)) {
            console.log('Calculated amount is NaN, totalItems:', totalItems);
          }

          setFormData({
            fullName: visitorData.fullName,
            phoneNumber: visitorData.phoneNumber,
            address: visitorData.address,
            aadhar: visitorData.aadhar,
            dlno: visitorData.dlno,
            dob: visitorData.dob,
            gender: visitorData.gender,
            pan: visitorData.pan,
            email: visitorData.email,
            amount: calculatedAmount.toString(),
          });
        } else {
          Alert.alert('Error', 'Failed to fetch visitor details.');
        }
      } catch (error) {
        console.log('Error fetching visitor details:', error);
        Alert.alert('Error', 'Failed to fetch visitor details.');
      }
    };

    fetchVisitorDetails();
  }, [visitorId, totalItems]);

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkoutHandler = async () => {
    try {
      const { fullName, phoneNumber, address, email, amount } = formData;

      if (!fullName || !phoneNumber || !address || !email || !amount || isNaN(amount) || Number(amount) <= 0) {
        Alert.alert('Validation Error', 'Please fill all required fields with valid data.');
        return;
      }

      // Navigate to the payment screen, passing necessary data
      navigation.navigate('PaymentPage1', {
        formData,
        user,
        amount: formData.amount,
        visitorId,
        cartId,
        totalPrice
      });

    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#545a2c', '#FFF']} style={styles.gradient}>
      <ProfileButton1 onPress={() => setModalVisible(true)} />
      <SafeAreaView style={styles.safeArea}>
        {/* <Image
          source={require("../assets/images/kgvmitr.png")}
          style={styles.logo}
        /> */}
        <Text style={styles.vehicledetails}>Billing User's Details</Text>
        {selectedOption === 'Self' ? (
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={formData.fullName}
              onChangeText={(text) => handleChange('fullName', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChangeText={(text) => handleChange('phoneNumber', text)}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={formData.address}
              onChangeText={(text) => handleChange('address', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="Aadhar"
              value={formData.aadhar}
              onChangeText={(text) => handleChange('aadhar', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="DL Number"
              value={formData.dlno}
              onChangeText={(text) => handleChange('dlno', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Date of Birth"
              value={formData.dob}
              onChangeText={(text) => handleChange('dob', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Gender"
              value={formData.gender}
              onChangeText={(text) => handleChange('gender', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="PAN"
              value={formData.pan}
              onChangeText={(text) => handleChange('pan', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={formData.amount}
              onChangeText={(text) => handleChange('amount', text)}
              keyboardType="numeric"
            />
            <Button title="Continue" onPress={checkoutHandler} color="#841584" style={{ borderRadius: 50 }} />
          </View>
        ) : (
          <View style={styles.container}>
            <Text style={styles.infoText}>Please select "Self" to proceed with the checkout.</Text>
          </View>
        )}
      </SafeAreaView>
      <CustomModal1
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        navigation={navigation}
        user={user}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: scaleWidth * 20, // Scale padding based on screen width
    justifyContent: 'center',
  },
  button: { borderRadius: 50 },
  logo: {
    width: scaleWidth * 100, // Adjust the width according to screen size
    height: scaleHeight * 100, // Adjust the height similarly
    alignSelf: 'center',
    marginBottom: scaleHeight * 10,
    marginTop: scaleHeight * 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: scaleWidth * 8, // Scale border radius
    padding: scaleWidth * 10, // Scale padding based on width
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scaleHeight * 2 }, // Scale shadowOffset height
    shadowOpacity: 0.2,
    shadowRadius: scaleWidth * 4, // Scale shadow radius
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: scaleWidth * 4, // Scale border radius
    padding: scaleWidth * 10, // Scale padding
    marginVertical: scaleHeight * 3, // Scale vertical margin
    width: '100%', // Stays fixed at 100% width
  },
  infoText: {
    fontSize: scaleWidth * 16, // Adjust the font size
    textAlign: 'center',
    color: '#333',
  },
  vehicledetails: {
    fontSize: scaleWidth * 32, // Scale the font size
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: scaleHeight * 80,
    marginBottom: scaleHeight * 20, // Adjust bottom margin
    textAlign: 'center',
  },
});

export default BookingCheckout1;