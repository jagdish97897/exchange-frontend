import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, Image, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import ProfileButton from './ProfileButton';
import CustomModal from './CustomModal';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Viewallorders = ({ route }) => {
  const { visitorId, user } = route.params;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://192.168.1.13:8000/api/order/allorders/${visitorId}`);
        setOrders(response.data.orders);
      } catch (error) {
        console.log('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [visitorId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <LinearGradient colors={['#06264D', '#FFF']} style={styles.gradient}>
      {/* Use the ProfileButton component */}
      <ProfileButton onPress={() => setModalVisible(true)} />
      <SafeAreaView style={styles.container}>
        <Image source={require("../assets/images/kgvmitr.png")} style={styles.logo} />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {orders.map((order) => (
            <View key={order._id} style={[styles.order, order.status === 'Pending' && styles.pendingOrder]}>
              <Text style={styles.text}>Order ID: {order._id}</Text>
              <Text style={styles.text}>Total Price: {order.totalPrice}</Text>
              <Text style={styles.text}>Order Date: {formatDate(order.order_date)}</Text>
              <Text style={styles.text}>Delivery Date(Expected Date): {formatDate(order.delivery_date)}</Text>
              <Text style={styles.order}>Status: {order.status}</Text>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
      < CustomModal
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
    padding: width * 0.03, // 4% of the screen width
    alignItems: 'center',
  },
  logo: {
    width: width * 0.4, // 40% of the screen width
    height: width * 0.4, // Maintain square aspect ratio
    marginBottom: height * 0.03, // 3% of screen height
  },
  scrollViewContent: {
    width: '100%',
    alignItems: 'center',
  },
  order: {
    width: '90%', // 90% of screen width
    marginBottom: height * 0.01, // 1% of screen height
    padding: width * 0.03, // 3% of screen width
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  pendingOrder: {
    backgroundColor: '#ffdddd', // Red background for pending orders
  },
  text: {
    fontSize: width * 0.04, // Responsive text size (4% of screen width)
    color: '#000',
  },
});

export default Viewallorders;