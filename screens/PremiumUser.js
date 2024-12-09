import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';

const PremiumUser = ({ route }) => {
  const { visitorId } = route.params;
  const navigation = useNavigation();

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
    amount: '299',
    userId: visitorId
  });

  useEffect(() => {
    const fetchVisitorDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/visitor/details/${visitorId}`);
        if (response.data.success) {
          const visitorData = response.data.data[0];
          setFormData((prevData) => ({
            ...prevData,
            fullName: visitorData.fullName,
            phoneNumber: visitorData.phoneNumber,
            address: visitorData.address,
            aadhar: visitorData.aadhar,
            dlno: visitorData.dlno,
            dob: visitorData.dob,
            gender: visitorData.gender,
            pan: visitorData.pan,
            email: visitorData.email,
          }));
        } else {
          Alert.alert('Error', 'Failed to fetch visitor details.');
        }
      } catch (error) {
        console.error('Error fetching visitor details:', error);
        Alert.alert('Error', 'Failed to fetch visitor details.');
      }
    };

    fetchVisitorDetails();
  }, [visitorId]);


  const amount = 299;

  const checkoutHandler = () => {
    if (formData && visitorId && amount) {
      navigation.navigate('PrimumpaymentImageUpload', {
        formData,
        visitorId,
        amount
      });
    } else {
      // Handle case where required data is missing
      console.log('Missing required data for navigation.');
    }
  };

  // const checkoutHandler = async () => {
  //   try {
  //     const { fullName, phoneNumber, address, email, amount } = formData;

  //     if (!fullName || !phoneNumber || !address || !email || isNaN(amount) || Number(amount) <= 0) {
  //       Alert.alert('Validation Error', 'Please fill all required fields with valid data.');
  //       return;
  //     }

  //     const amountInPaise = Math.round(Number(amount) * 100);

  //     const { data: { key } } = await axios.get("http://localhost:8000/api/getkey");
  //     const { data: { order } } = await axios.post("http://localhost:8000/api/v1/kgvmitra/kgvcheckout", { amount: amountInPaise });

  //     const options = {
  //       key,
  //       amount: order.amount,
  //       currency: "INR",
  //       name: "Payment to KGV",
  //       description: "Payment for KGV services",
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
  //     };

  //     RazorpayCheckout.open(options).then(async (data) => {
  //       // Resetting the navigation stack to prevent going back
  //       console.log(data.razorpay_payment_id)
  //       console.log(data.razorpay_order_id)
  //       console.log(data.razorpay_signature)

  //       const verificationResponse = await axios.post("http://localhost:8000/api/v1/payment/premium/payment-verification", {
  //         ...data
  //       });

  //       if (verificationResponse.data.success) {
  //         navigation.navigate('PremiumPayment', { paymentId: data.razorpay_payment_id, formData })
  //         // Navigate to the success screen
  //         //  navigation.dispatch(
  //         //   CommonActions.reset({
  //         //     index: 0,
  //         //     routes: [{ name: 'MainNavigator1', params: { screen: 'Welcome1', params: { visitorId } } }],
  //         //   })
  //         // );

  //       } else {
  //         // Handle failure (if any)
  //         Alert.alert('Payment Verification Failed', 'Please contact support.');
  //       }
  //     }).catch((error) => {
  //       console.error("Razorpay Error:", error);
  //       Alert.alert(`Error: ${error.code} | ${error.description}`);
  //     });

  //   } catch (error) {
  //     console.error("Error:", error);
  //     Alert.alert('Error', 'Something went wrong. Please try again.');
  //   }
  // };

  return (
    <LinearGradient colors={['#06264D', '#FFF']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Image
            source={require("../assets/images/kgvmitr.png")}
            style={styles.logo}
          />
          <View style={styles.container}>
            <Text style={styles.title}>Join KGV Mitra Club</Text>
            <Text style={styles.description}>

              Enjoy exclusive premium features with your premium account.
            </Text>

            {/* Premium Features Section */}
            <View style={styles.featuresContainer}>
              <Text style={styles.featureItem}>⭐ Unlimited Access to Content</Text>
              <Text style={styles.featureItem}>⭐ Ad-Free Experience</Text>
              <Text style={styles.featureItem}>⭐ Priority Support</Text>
              <Text style={styles.featureItem}>⭐ Early Access to New Features</Text>
            </View>

            {/* Button to upgrade or manage premium subscription */}
            <TouchableOpacity style={styles.upgradeButton} onPress={checkoutHandler}>
              <Text style={styles.upgradeButtonText}>Upgrade Your Plan</Text>
            </TouchableOpacity>

            {/* Back to Home or other screens */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Back to Menu</Text>
            </TouchableOpacity>
          </View>



        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 20,
  },
  scrollViewContent: {
    paddingVertical: 20,
  },
  logo: {
    width: 200,
    height: 280,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent',  // Set backgroundColor to transparent to allow gradient to show
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',  // White text for better visibility on dark background
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#FFF',  // White text for better visibility
    textAlign: 'center',
    marginBottom: 30,
  },

  featuresContainer: {
    marginBottom: 30,
  },
  featureItem: {
    fontSize: 16,
    color: '#FFF',  // White text for better visibility
    marginBottom: 10,
  },
  upgradeButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  upgradeButtonText: {
    fontSize: 16,
    color: '#000',  // Dark text to contrast with gold button
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#06264D',  // White button for contrast
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFF',
  },

});

export default PremiumUser;