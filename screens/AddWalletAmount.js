import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import axios from "axios";
import RazorpayCheckout from "react-native-razorpay";
import { useRoute } from "@react-navigation/native";
import { API_END_POINT } from "../app.config";

const AddWalletAmount = () => {
  const route = useRoute();
  const { userId } = route.params;
  const [amount, setAmount] = useState("");

  const handleCheckout = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount.");
      return;
    }

    try {
      // Fetch Razorpay key
      const { data: keyData } = await axios.get(`${API_END_POINT}/api/getkey`);
      const key = keyData?.key;
      if (!key) {
        throw new Error("Failed to fetch Razorpay key.");
      }

      // Create Razorpay order
      const response = await axios.post(`${API_END_POINT}/api/wallet/checkout`, { amount });
      const order = response.data.order;

      if (!order || !order.id) {
        Alert.alert("Error", "Failed to create Razorpay order.");
        return;
      }

      // Razorpay checkout options
      const options = {
        description: "Add Money to Wallet",
        image: "https://i.imgur.com/3g7nmJC.png",
        currency: order.currency,
        key,
        amount: order.amount,
        name: "EXCHANGE TWI",
        order_id: order.id, // Razorpay order ID
        prefill: {
          email: "user@example.com", // Replace with user's email or retrieve from context
          contact: "9999999999", // Replace with user's contact or retrieve from context
          name: "User Name", // Replace with user's name or retrieve from context
        },
        theme: { color: "#F37254" }, // Customize the theme color
      };

      RazorpayCheckout.open(options)
        .then(async (paymentData) => {
          // Payment successful, verify on the backend
          const verificationData = {
            userId,
            amount,
            razorpay_order_id: paymentData.razorpay_order_id,
            razorpay_payment_id: paymentData.razorpay_payment_id,
            razorpay_signature: paymentData.razorpay_signature,
          };

          try {
            const verificationResponse = await axios.post(
              `${API_END_POINT}/api/wallet/paymentVerification`,
              verificationData
            );

            if (verificationResponse.data.success) {
              Alert.alert(
                "Success",
                `Payment verified successfully! New balance: ₹${verificationResponse.data.balance}`
              );
            } else {
              Alert.alert("Error", "Payment verification failed.");
            }
          } catch (verificationError) {
            console.error("Verification error:", verificationError);
            Alert.alert("Error", "Failed to verify payment. Please contact support.");
          }
        })
        .catch((error) => {
          console.error("Payment failed:", error?.description || error);
          Alert.alert("Error", error?.description || "Payment failed. Please try again.");
        });
    } catch (error) {
      console.error("Checkout error:", error?.response || error.message);
      Alert.alert("Error", "An error occurred during checkout. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Money to Wallet</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity style={styles.button} onPress={handleCheckout}>
        <Text style={styles.buttonText}>Add to Wallet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#F37254",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddWalletAmount;