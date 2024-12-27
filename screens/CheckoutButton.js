import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import ProfileButton from './ProfileButton';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const CheckoutButton = ({ route }) => {
  const { selectedOption } = route.params;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    contact: '',
    amount: '',
  });
  const [isDisabled, setIsDisabled] = useState(true);

  const handleChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));

    // Check if all form fields are filled and amount is greater than 0 to enable the button
    const { name: formName, email, address, contact, amount } = formData;
    if (formName && email && address && contact && amount && Number(amount) > 0) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const checkoutHandler = async () => {
    try {
      const { data: { key } } = await axios.get("http://192.168.1.3:8000/api/getkey");
      // console.log("Razorpay Key:", key);

      const { data: { order } } = await axios.post("http://192.168.1.3:8000/api/v1/visitor/placeOrder", { amount: formData.amount });
      // console.log("Order ID:", order.id);
      // console.log("Order Amount:", order.amount);

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "6 Pack Programmer",
        description: "Tutorial of RazorPay",
        image: "https://i.imgur.com/3g7nmJC.png",
        order_id: order.id,
        callback_url: "http://192.168.1.3:8000/api/v1/visitor/verifyPayment",
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.contact,
        },
        notes: {
          "address": formData.address
        },
        theme: {
          "color": "#121212"
        }
      };

      if (RazorpayCheckout) {
        RazorpayCheckout.open(options).then((data) => {
          Alert.alert(`Success: ${data.razorpay_payment_id}`);
        }).catch((error) => {
          console.log("Razorpay Error:", error);
          Alert.alert(`Error: ${error.code} | ${error.description}`);
        });
      } else {
        console.log("RazorpayCheckout is not initialized properly.");
        Alert.alert('Error', 'RazorpayCheckout is not initialized.');
      }

    } catch (error) {
      console.log("Error:", error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#06264D', '#FFF']} style={styles.gradient}>
      <ProfileButton onPress={() => setModalVisible(true)} />
      {selectedOption === 'Other' ? (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
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
            placeholder="Address"
            value={formData.address}
            onChangeText={(text) => handleChange('address', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={formData.contact}
            onChangeText={(text) => handleChange('contact', text)}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={formData.amount}
            onChangeText={(text) => handleChange('amount', text)}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[styles.button, styles.buttonDisabled]}
            onPress={checkoutHandler}
            disabled={true}
          >
            <Text style={styles.buttonText}>Pay Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.infoText}>Please select "Self" to proceed with the checkout.</Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: width * 0.04,
    marginTop: height * 0.1,
    marginBottom: height * 0.04,
  },
  input: {
    height: height * 0.05,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: height * 0.02,
    paddingHorizontal: width * 0.02,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 50,
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  buttonDisabled: {
    backgroundColor: '#d3d3d3',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045,
  },
  infoText: {
    fontSize: width * 0.045,
    textAlign: 'center',
    color: '#000',
  },
});

export default CheckoutButton;
