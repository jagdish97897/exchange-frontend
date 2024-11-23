
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, ScrollView, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { Card } from 'react-native-paper';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
const { width, height } = Dimensions.get('window');

const PaymentPage2 = ({ route, navigation }) => {
  const { formData, user, amount, visitorId, cartId, totalPrice } = route.params;
  const [data, setData] = useState(null);
  const [buyerDetails, setBuyerDetails] = useState(null);
  const bookingAmountPerItem = 5000;
  const installationfeeperkit = 5000;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://192.168.1.5:8005/api/cart/item/${cartId}`);
        setData(response.data);
      } catch (error) {
        console.log('Error fetching cart data:', error);
      }
    };
    fetchData();
  }, [cartId]);

  useEffect(() => {

    const fetchBuyerDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.1.5:8005/api/v1/visitor/details/${visitorId}`);
        setBuyerDetails(response.data.data[0]);
      } catch (error) {
        console.log('Error fetching buyer details:', error);
      }
    };
    if (visitorId) {
      fetchBuyerDetails();
    }
  }, [visitorId]);

  if (!data || !buyerDetails) {
    return <Text>Loading...</Text>;
  }

  const { cartItems } = data;

  const calculateTax = (price) => {
    const cgstRate = 0;
    const sgstRate = 0;
    const igstRate = 0.18;
    const cgst = price * cgstRate;
    const sgst = price * sgstRate;
    const igst = price * igstRate;
    return { cgst, sgst, igst };
  };
  const totalBeforeTax = cartItems.reduce((sum, item) => sum + item.item.totalPrice, 0);
  const totalTax = cartItems.reduce((sum, item) => {
    const { igst } = calculateTax(item.item.totalPrice);
    return sum + igst;
  }, 0);

  const totalBookingAmount = cartItems.length * bookingAmountPerItem;
  const totalInstallationFee = cartItems.length * installationfeeperkit;
  const totalAmount = totalBeforeTax + totalTax + totalInstallationFee;
  const totalAmountToBePaid = totalAmount - totalBookingAmount;

  const handlePayment = () => {
    if (formData && user && visitorId && cartId && totalPrice) {
      navigation.navigate('PaymentImageUpload1', {
        formData,        
        user,            
        amount: formData.amount,  
        visitorId,      
        cartId,          
        totalPrice       
      });
    } else {
      // Handle case where required data is missing
      console.log('Missing required data for navigation.');
    }
  };
  // const handlePayment = async () => {
  //   try {
  //     const amountInPaise = Math.round(Number(amount) * 100);

  //     // Fetch Razorpay key
  //     const { data: { key } } = await axios.get("http://192.168.1.5:8005/api/getkey");

  //     const { data: { order } } = await axios.post("http://192.168.1.5:8005/api/v1/bookingkit/checkout", { amount: amountInPaise });

  //     const options = {
  //       key,
  //       amount: order.amount,
  //       currency: "INR",
  //       name: "Payment to KGV",
  //       description: "Passionate about KGV",
  //       image: "https://raw.githubusercontent.com/jagdish97897/kgvl/main/logokgv.cb6e50d56b55ae361cd7-removebg-preview.png",
  //       order_id: order.id,
  //       prefill: {
  //         name: formData.fullName,
  //         email: formData.email,
  //         contact: formData.phoneNumber,
  //       },
  //       notes: {
  //         fullName: formData.fullName,
  //         phoneNumber: formData.phoneNumber,
  //         address: formData.address,
  //         aadhar: formData.aadhar,
  //         dlno: formData.dlno,
  //         dob: formData.dob,
  //         gender: formData.gender,
  //         email: formData.email,
  //         amount: formData.amount,
  //         pan: formData.pan,
  //       },
  //       theme: {
  //         color: "#121212",
  //       },
  //       method: {
  //         wallet: true
  //       }
  //     };

  //     RazorpayCheckout.open(options)
  //       .then(async (data) => {
  //         console.log(`Payment Successful: ${data.razorpay_payment_id}`);

  //         try {
  //           // Verify cartId before proceeding
  //           if (!cartId) {
  //             console.log('Cart ID is missing');
  //             Alert.alert('Error', 'Cart ID is missing. Cannot proceed with the order.');
  //             return;
  //           }

  //           console.log('Sending order data:', { visitorId, cartId });

  //           // Post the cart items to order schema
  //           const orderResponse = await axios.post("http://192.168.1.5:8005/api/order/item", { visitorId, cartId, totalAmount, amountPaid: amount });
  //           console.log('Order saved successfully:', orderResponse.data);
  //           console.log('Order saved successfully:', orderResponse.data.order._id);

  //           navigation.navigate('PaymentSuccess1', {
  //             data,
  //             orderId: orderResponse.data.order._id,
  //             user
  //           });

  //         } catch (orderError) {
  //           // Log the error response for more details
  //           if (orderError.response) {
  //             console.log('Error response from API:', orderError.response.data);
  //             Alert.alert('Error', `Failed to save order data: ${orderError.response.data.message}`);
  //           } else {
  //             console.log('Error saving order data:', orderError.message);
  //             Alert.alert('Error', 'Failed to save order data.');
  //           }
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("Razorpay Error:", error);
  //         Alert.alert(`Error: ${error.code} | ${error.description}`);
  //       });
  //   } catch (error) {
  //     console.log("Error:", error);
  //     Alert.alert('Error', 'Something went wrong. Please try again.');
  //   }
  // };

  const generatePDF = async () => {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };


  return (
    <SafeAreaView style={styles.container}>

      <LinearGradient colors={['#545a2c', '#FFF']} style={styles.gradientBackground}>
        {/* Heading Section */}
        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>Billing Details 2</Text>
        </View>




        <View style={styles.buttonContainer}>
          <Button title="Download PDF" onPress={generatePDF} color="#ff6347" />
          <Button title="Proceed to Pay" onPress={handlePayment} color="#841584" />
        </View>
      </LinearGradient>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    paddingHorizontal: width * 0.05, // 5% of screen width
    paddingVertical: height * 0.02, // 2% of screen height
  },
  headingContainer: {
    alignItems: 'center',
    marginVertical: height * 0.01, // 1% of screen height
  },
  headingText: {
    fontSize: width * 0.06, // Scales with screen width
    fontWeight: 'bold',
    color: '#FFF',
  },

  buttonContainer: {
    marginTop: height * 0.02, // 2% of screen height
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});


export default PaymentPage2;
