
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay';
import { API_END_POINT } from '../app.config';

const TripScreen = ({ route }) => {
  const { userId } = route.params;
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState({
    Archived: [],
    InProgress: [],
    Completed: [],
    Cancelled: [],
  });

  // console.log(trips)
  const navigation = useNavigation();
  const apiEndpoint = `${API_END_POINT}/api/trips/customer/${userId}`;

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiEndpoint);
      const data = response.data;

      const categorizedTrips = {
        Archived: data?.trips?.filter((trip) => trip.tripDetails?.status === 'created') ?? [],
        InProgress: data?.trips?.filter((trip) => trip.tripDetails?.status === 'inProgress') ?? [],
        Completed: data?.trips?.filter((trip) => trip.tripDetails?.status === 'completed') ?? [],
        Cancelled: data?.trips?.filter((trip) => trip.tripDetails?.status === 'cancelled') ?? [],
      };

      setTrips(categorizedTrips);
    } catch (error) {
      console.error('Error fetching trips:', error);
      Alert.alert('Error', 'Failed to fetch trips. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchTrips();
    }
  }, [fetchTrips]);

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [fetchTrips])
  );

  const sectionColors = {
    Archived: '#FFCDD2',
    InProgress: '#BBDEFB',
    Completed: '#C8E6C9',
    Cancelled: '#FFE0B2',
  };

  const initiatePayment = async (tripId, finalPrice, percentage) => {
    try {
      const amount = Math.round((finalPrice * percentage) / 100);
      const keyResponse = await axios.get(`${API_END_POINT}/api/getkey`);
      const key = keyResponse?.data?.key;

      if (!key) {
        throw new Error('Failed to fetch Razorpay key.');
      }

      const orderResponse = await axios.post(`${API_END_POINT}/api/wallet/checkout`, { amount });
      const order = orderResponse?.data?.order;

      if (!order || !order.id) {
        Alert.alert('Error', 'Failed to create Razorpay order.');
        return;
      }

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'Trip Payment',
        description: `Payment for trip ${tripId}`,
        order_id: order.id,
        prefill: {
          email: 'user@example.com',
          contact: '1234567890',
        },
        theme: { color: '#F37254' },
      };

      RazorpayCheckout.open(options)
        .then(async (paymentResult) => {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentResult;

          await axios.post(`${API_END_POINT}/api/trips/paymentVerificationForTrip`, {
            userId,
            tripId,
            amount,
            paymentPercent: percentage,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          });

          Alert.alert('Success', 'Payment completed successfully.');
          fetchTrips();
        })
        .catch((error) => {
          console.error('Payment failed:', error);
          Alert.alert('Error', 'Payment was cancelled or failed.');
        });
    } catch (error) {
      console.error('Error initiating payment:', error);
      Alert.alert('Error', 'An error occurred while processing the payment.');
    }
  };

  const renderTripCard = (item) => {
    const trip = item.tripDetails; // Access the nested trip details
    console.log('trip', item)

    let paymentPercentage = 0;
    let buttonLabel = 'View Details';
    let shouldShowPayNow = false;

    if (!trip) return null; // Handle unexpected missing data

    if (trip.status === 'created' && trip.biddingStatus === 'accepted') {
      paymentPercentage = 10;
      buttonLabel = 'Pay 10% Now';
      shouldShowPayNow = true;
    }



    const hasPaid80 = item.transactions?.some(
      (transaction) => transaction.paymentPercent === 80 && transaction.razorpay_payment_id
    );

    const noOf10percentTransaction = item.transactions?.filter(
      (transaction) => transaction.paymentPercent === 10 && transaction.razorpay_payment_id
    )?.length;

    if (hasPaid80) {
      shouldShowPayNow = false;
    }

    if (trip.status === 'inProgress' && trip.biddingStatus === 'accepted' && trip.grAccepted && !hasPaid80) {
      paymentPercentage = 80;
      buttonLabel = 'Pay 80% Now';
      shouldShowPayNow = true;
    }

    console.log('noOf10percentTransaction', noOf10percentTransaction)

    if (hasPaid80 && noOf10percentTransaction) {
      buttonLabel = 'View Details';
      shouldShowPayNow = false;
    }

    if (hasPaid80 && trip.billAccepted && noOf10percentTransaction === 1) {
      paymentPercentage = 10;
      buttonLabel = 'Pay 10% Now';
      shouldShowPayNow = true;
    }
    // Ensure that after the last transaction, the button always shows "View Details"
    if (hasPaid80 && noOf10percentTransaction === 2 && trip.billAccepted) {
      buttonLabel = 'View Details';
      shouldShowPayNow = false;
    }

    return (
      <View style={styles.card} key={trip._id}>
        <Text style={styles.tripText}>Trip ID: {trip._id}</Text>
        <Text style={styles.tripText}>From: {trip.from}</Text>
        <Text style={styles.tripText}>To: {trip.to}</Text>
        <Text style={styles.tripText}>Cargo Type: {trip.cargoDetails?.cargoType || 'N/A'}</Text>
        <Text style={styles.tripText}>Quote Price: ₹{trip.cargoDetails?.quotePrice || 'N/A'}</Text>
        <Text style={styles.tripText}>Final Price: ₹{trip.finalPrice || 'N/A'}</Text>
        <Text style={styles.tripText}>
          Date: {trip.tripDate ? new Date(trip.tripDate).toLocaleDateString() : 'N/A'}
        </Text>
        <Text style={styles.instructionsText}>
          Instructions: {trip.specialInstruction || 'N/A'}
        </Text>

        {shouldShowPayNow ? (
          <TouchableOpacity
            style={[styles.button, styles.payNowButton]}
            onPress={() => initiatePayment(trip._id, trip.finalPrice, paymentPercentage)}
          >
            <Text style={styles.buttonText}>{buttonLabel}</Text>

          </TouchableOpacity>


        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate('ViewDetails', { tripId: trip._id, status: trip.status })
            }
          >
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };


  const renderSection = (status, trips) => (
    <View
      style={[styles.section, { backgroundColor: sectionColors[status] }]}
      key={status}
    >
      <Text style={styles.sectionHeader}>{status} Trips</Text>
      {trips.length > 0 ? (
        <FlatList
          data={trips}
          renderItem={({ item }) => renderTripCard(item)}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noTripsText}>No trips available</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#06264D', '#FFF']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 40 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.screenTitle}>Trips</Text>
          {['Archived', 'InProgress', 'Completed', 'Cancelled'].map((status) =>
            renderSection(status, trips[status])
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFF',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 250,
  },
  tripText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  instructionsText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: '#007BFF',
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noTripsText: {
    color: '#FFF',
    fontSize: 14,
    fontStyle: 'italic',
  },
  payNowButton: {
    backgroundColor: '#00ff45',
    marginVertical: 10,
  },
});
export default TripScreen;