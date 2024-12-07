import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, SafeAreaView, Image, Dimensions, Platform } from 'react-native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import CustomModal from './CustomModal';
import ProfileButton from './ProfileButton';

const { width, height } = Dimensions.get('window');

const Orderdetails = ({ route, navigation }) => {
  const { data, orderId, user, referralCode } = route.params;
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);


  // Extract Razorpay data
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.1.13:8000/api/order/orders/${orderId}`);
        setOrderDetails(response.data.order);
        console.log(response.data)
      } catch (err) {
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    const sendNotification = async () => {
      try {
        const response = await axios.post("http://192.168.1.13:8000/api/v1/bookingkit/booking-verification", {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          userId: user.data.userId,
          referralCode
        });
        Alert.alert("Notification Sent", "Your payment verification notification has been sent successfully.");
      } catch (error) {
        console.log("Error sending notification:", error);
        Alert.alert("Notification Failed", "There was an error sending the notification.");
      }
    };

    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      sendNotification();
    }
  }, [razorpay_order_id, razorpay_payment_id, razorpay_signature]);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  if (!orderDetails) return null;

  // Extract visitorId from orderDetails.visitor object
  const visitorId = orderDetails.visitor ? orderDetails.visitor._id : null;

  return (
    <LinearGradient colors={['#06264D', '#FFF']} style={styles.gradient}>
      {/* Use the ProfileButton component */}
      <ProfileButton onPress={() => setModalVisible(true)} />
      <SafeAreaView style={styles.container}>
        <Image source={require("../assets/images/kgvmitr.png")} style={styles.logo} />
        <Text style={styles.successText}>Order Details</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Order ID:</Text>
          <Text style={styles.value}>{orderDetails._id}</Text>
          <Text style={styles.label}>Visitor Name:</Text>
          <Text style={styles.value}>{user.data.fullName}</Text>
          <Text style={styles.label}>Paid Amount:</Text>
          <Text style={styles.value}>{orderDetails.amountPaid}</Text>
          <Text style={styles.label}>Amount To Be Paid:</Text>
          <Text style={styles.value}>{orderDetails.amountToBePaid}</Text>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{orderDetails.status}</Text>
          <Text style={styles.label}>Order Date:</Text>
          <Text style={styles.value}>{new Date(orderDetails.order_date).toLocaleDateString()}</Text>
          <Text style={styles.label}>Delivery Date:</Text>
          <Text style={styles.value}>{new Date(orderDetails.delivery_date).toLocaleDateString()}</Text>
        </View>

        {/* Pass visitorId to Viewallorders screen */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Viewallorders', { visitorId, user })}
        >
          <Text style={styles.buttonText}>View All Orders</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <CustomModal
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.05, // 5% of screen width
  },
  logo: {
    width: width * 0.4, // 40% of screen width
    height: width * 0.4, // Keep the logo square with width = height
    marginBottom: height * 0.02, // 2% of screen height
  },
  successText: {
    fontSize: width * 0.065, // Responsive font size (6.5% of screen width)
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: height * 0.03, // 3% of screen height
  },
  detailsContainer: {
    width: '90%', // 90% of the screen width
    padding: width * 0.05, // 5% padding
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: height * 0.03, // 3% of screen height
  },
  label: {
    fontSize: width * 0.045, // Responsive font size (4.5% of screen width)
    fontWeight: '600',
    color: '#333',
    marginTop: height * 0.01, // 1% of screen height
  },
  value: {
    fontSize: width * 0.04, // 4% of screen width
    color: '#666',
    marginBottom: height * 0.01, // 1% of screen height
  },
  button: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? height * 0.1 : height * 0.02, // Adjust for different platforms
    left: '65%',
    transform: [{ translateX: -100 }],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#06264D',
    padding: width * 0.03, // 3% of screen width for padding
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.04, // Responsive font size
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: width * 0.04, // Responsive font size (4% of screen width)
    marginTop: height * 0.02, // 2% of screen height
  },
});

export default Orderdetails;