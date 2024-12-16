import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay';
import { Picker } from '@react-native-picker/picker';

const Booking = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    address: '',
    phonenumber: '',
  });
  const [selectedAmount, setSelectedAmount] = useState(50000);

  const { firstname, lastname, email, address, phonenumber } = formData;

  const handleAmountChange = (amount) => {
    setSelectedAmount(parseInt(amount, 10));
  };

  const checkoutHandler = async () => {
    if (!firstname || !lastname || !email || !address || !phonenumber) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    try {
      // Fetch the API key
      const { data: { key } } = await axios.get('http://192.168.1.5:8000/api/getkey');
      // console.log('API Key:', key);

      // Place the order
      const { data: { order } } = await axios.post('http://192.168.1.5:8000/api/v1/visitor/placeOrder', { amount: selectedAmount });
      // console.log('Order:', order);

      // Payment options
      const options = {
        key,
        amount: order.amount,
        currency: 'INR',
        name: 'TWI',
        description: 'Test Transaction',
        order_id: order.id,
        callback_url: 'http://192.168.1.5:8000/api/v1/visitor/verifyPayment',
        prefill: {
          email,
          name: `${firstname} ${lastname}`,
          contact: phonenumber,
        },
        notes: {
          address,
        },
        theme: {
          color: '#3399cc',
        },
      };

      // Initialize Razorpay
      RazorpayCheckout.open(options)
        .then((data) => {
          Alert.alert('Success', `Payment successful: ${data.razorpay_payment_id}`);
        })
        .catch((error) => {
          console.log('Payment Failed:', error);
          Alert.alert('Payment Failed', `Error: ${error.description}`);
        });

    } catch (error) {
      console.log('Error during checkout:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Error during checkout.');
    }

    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      address: '',
      phonenumber: '',
    });
  };

  const handleOnChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={require('../assets/images/kgv.png')} style={styles.backgroundImage} />

      <View style={styles.formContainer}>
        <Image source={require('../assets/images/kgv.png')} style={styles.image} />

        <View style={styles.form}>
          <Text style={styles.header}>Booking Form</Text>

          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstname}
            onChangeText={(text) => handleOnChange('firstname', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={lastname}
            onChangeText={(text) => handleOnChange('lastname', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={(text) => handleOnChange('email', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={(text) => handleOnChange('address', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phonenumber}
            onChangeText={(text) => handleOnChange('phonenumber', text)}
          />

          <Picker
            selectedValue={selectedAmount}
            onValueChange={(itemValue) => handleAmountChange(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="₹10,000" value={10000} />
            <Picker.Item label="₹50,000" value={50000} />
          </Picker>

          <TouchableOpacity style={styles.button} onPress={checkoutHandler}>
            <Text style={styles.buttonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 20,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  form: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#3EC70B',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Booking;