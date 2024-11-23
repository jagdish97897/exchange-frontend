import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const KgvPaymentSuccess = ({ route, navigation }) => {
  // Destructure the payment data from route params
  const { data } = route.params;

  return (
    <LinearGradient colors={['#06264D', '#FFF']} style={styles.gradient}>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.successContainer}>
        <Text style={styles.successText}>Payment Successful!</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Payment ID:</Text>
          <Text style={styles.value}>{data.razorpay_payment_id}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Order ID:</Text>
          <Text style={styles.value}>{data.razorpay_order_id}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Signature:</Text>
          <Text style={styles.value}>{data.razorpay_signature}</Text>
        </View>

        <Button
          title="Go to Dashboard"
          onPress={() => navigation.navigate('Dashboard')}
        />
      </View>
    </ScrollView>
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
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  successContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
  },
});

export default KgvPaymentSuccess;
