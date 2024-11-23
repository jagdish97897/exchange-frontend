import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';

const CheckoutButton = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    contact: '',
    amount: '',
  });

  const handleChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const checkoutHandler = async () => {
    try {
      // Get Razorpay key
      const { data: { key } } = await axios.get("http://192.168.1.5:8005/api/getkey");
      console.log("Razorpay Key:", key);

      // Create order
      const { data: { order } } = await axios.post("http://192.168.1.5:8005/api/v1/visitor/placeOrder", { amount: formData.amount });
      console.log("Order ID:", order.id);
      console.log("Order Amount:", order.amount);

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "6 Pack Programmer",
        description: "Tutorial of RazorPay",
        image: "https://i.imgur.com/3g7nmJC.png",
        order_id: order.id,
        callback_url: "http://192.168.1.5:8005/api/v1/visitor/verifyPayment",
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

      // Open Razorpay checkout
      if (RazorpayCheckout) {
        RazorpayCheckout.open(options).then((data) => {
          // Handle success
          Alert.alert(`Success: ${data.razorpay_payment_id}`);
        }).catch((error) => {
          // Handle error
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
      <Button title="Pay Now" onPress={checkoutHandler} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8
  }
});

export default CheckoutButton;