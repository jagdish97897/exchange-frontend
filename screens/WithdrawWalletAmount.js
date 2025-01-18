import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import axios from "axios";
import RazorpayCheckout from "react-native-razorpay";
import { useRoute } from "@react-navigation/native";
import { API_END_POINT } from "../app.config"; 

const WithdrawWalletAmount = () => {
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
        order_id: order.id, 
        prefill: {
          email: "user@example.com", 
          contact: "9999999999", 
          name: "User Name", 
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
              `${API_END_POINT}/api/wallet/paymentVerificationforWithdraw`,
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
      <Text style={styles.title}>Withdraw Money from Wallet</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity style={styles.button} onPress={handleCheckout}>
        <Text style={styles.buttonText}>Withdraw </Text>
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

export default WithdrawWalletAmount;


// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
// } from "react-native";
// import { useRoute } from "@react-navigation/native";
// import axios from "axios";

// const WithdrawWalletAmount = () => {
//   const route = useRoute(); // Access navigation route params
//   const { userId } = route.params; // Get userId passed from the previous screen

//   const [amount, setAmount] = useState(""); // Withdrawal amount
//   const [isLoading, setIsLoading] = useState(false);

//   const handleWithdraw = async () => {
//     if (!amount || isNaN(amount) || Number(amount) <= 0) {
//       Alert.alert("Validation Error", "Please enter a valid amount.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const API_BASE_URL = "http://192.168.1.7:8000/api/wallet/wallet/withdrawamount";
//       const response = await axios.post(API_BASE_URL, { userId, amount });

//       if (response.data.success) {
//         Alert.alert("Success", `Withdrawal successful. New Balance: ₹${response.data.balance}`);
//       } else {
//         Alert.alert("Error", response.data.message || "Failed to withdraw.");
//       }
//     } catch (error) {
//       console.error("Withdrawal Error:", error);
//       Alert.alert("Error", "An error occurred while processing the withdrawal.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Withdraw Wallet Amount</Text>
//       <Text style={styles.userIdText}>User ID: {userId}</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter Amount"
//         value={amount}
//         onChangeText={setAmount}
//         keyboardType="numeric"
//       />

//       <TouchableOpacity
//         style={[styles.button, isLoading && { backgroundColor: "#ccc" }]}
//         onPress={handleWithdraw}
//         disabled={isLoading}
//       >
//         <Text style={styles.buttonText}>
//           {isLoading ? "Processing..." : "Withdraw"}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#f9f9f9",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#333",
//   },
//   userIdText: {
//     fontSize: 16,
//     marginBottom: 20,
//     color: "#555",
//   },
//   input: {
//     width: "100%",
//     height: 50,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 15,
//     backgroundColor: "#fff",
//   },
//   button: {
//     width: "100%",
//     height: 50,
//     backgroundColor: "#4CAF50",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 5,
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#fff",
//   },
// });

// export default WithdrawWalletAmount;

