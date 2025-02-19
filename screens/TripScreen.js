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
    Archieved: [],
    InProgress: [],
    Completed: [],
    Cancelled: [],
  });

  const navigation = useNavigation();

  const apiEndpoint = `${API_END_POINT}/api/trips/customer/${userId}`;

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await axios.get(apiEndpoint);
      const data = response.data;

      const categorizedTrips = {
        Archieved: data?.trips?.filter((trip) => trip.status === 'created') ?? [],
        InProgress: data?.trips?.filter((trip) => trip.status === 'inProgress') ?? [],
        Completed: data?.trips?.filter((trip) => trip.status === 'completed') ?? [],
        Cancelled: data?.trips?.filter((trip) => trip.status === 'cancelled') ?? [],
      };

      setTrips(categorizedTrips);
    } catch (error) {
      console.error('Error fetching trips:', error);
      Alert.alert('Error', 'Failed to fetch trips. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      console.log("Fetching trips for user:", userId); // Debugging
      fetchTrips();
    } else {
      console.error("userId is undefined");
    }
  }, [userId]);
  

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [])
  );

  const sectionColors = {
    Archieved: '#FFCDD2', // Light Red
    InProgress: '#BBDEFB', // Light Blue
    Completed: '#C8E6C9', // Light Green
    Cancelled: '#FFE0B2', // Light Orange
  };

  const initiatePayment = async (tripId, finalPrice) => {
    try {
      // Calculate 10% of the finalPrice
      const amount = Math.round((finalPrice * 10) / 100); // Round to nearest integer
  
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
          email: 'user@example.com', // Replace with dynamic user email
          contact: '1234567890', // Replace with dynamic user phone number
        },
        theme: { color: '#F37254' },
      };
  
      RazorpayCheckout.open(options)
        .then(async (paymentResult) => {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentResult;
          // Verify the payment
          await axios.post(`${API_END_POINT}/api/trips/paymentVerificationForTrip`, {
            userId,
            tripId,
            amount,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          });
  
          Alert.alert('Success', 'Payment completed successfully.');
          await fetchTrips(); // Refresh trips after payment
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
  const renderTripCard = (item) => (
    <View style={styles.card} key={item._id}>
      <Text style={styles.tripText}>Trip ID: {item._id}</Text>
      <Text style={styles.tripText}>From: {item.from}</Text>
      <Text style={styles.tripText}>To: {item.to}</Text>
      <Text style={styles.tripText}>Cargo Type: {item.cargoDetails.cargoType}</Text>
      <Text style={styles.tripText}>Quote Price: ₹{item.cargoDetails.quotePrice}</Text>
      <Text style={styles.tripText}>Final Price: ₹{item.finalPrice}</Text>
      <Text style={styles.tripText}>Date: {new Date(item.tripDate).toLocaleDateString()}</Text>
      <Text style={styles.instructionsText}>
        Instructions: {item.specialInstruction || 'N/A'}
      </Text>
  
      {item.status === 'created' && item.biddingStatus === 'accepted' ? (
        <TouchableOpacity
          style={[styles.button, styles.payNowButton]}
          onPress={() => initiatePayment(item._id, item.finalPrice)}
        >
          <Text style={styles.buttonText}>Pay Now</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ViewDetails', { tripId: item._id, status: item.status })}
        >
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  

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
          {['Archieved', 'InProgress', 'Completed', 'Cancelled'].map((status) =>
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
        backgroundColor: '#00ff45', // Bright orange for "Pay Now"
        marginVertical: 10,
    },
});

export default TripScreen;

// import React, { useEffect, useState, useContext, useCallback } from 'react';
// import {
//     View,
//     Text,
//     FlatList,
//     ActivityIndicator,
//     StyleSheet,
//     ScrollView,
//     SafeAreaView,
//     TouchableOpacity,
// } from 'react-native';
// import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { API_END_POINT } from '../app.config';
// import RazorpayCheckout from "react-native-razorpay";

// const TripScreen = ({ route }) => {
//     const { userId } = route.params;
//     const [loading, setLoading] = useState(true);
//     const [trips, setTrips] = useState({
//         Archieved: [],
//         InProgress: [],
//         Completed: [],
//         Cancelled: [],
//     });

//     const navigation = useNavigation();
//     // const route = useRoute();
//     const apiEndpoint = `${API_END_POINT}/api/trips/customer/${userId}`;

//     const fetchTrips = async () => {
//         try {
//             const response = await fetch(apiEndpoint);
//             const data = await response.json();

//             const categorizedTrips = {
//                 Archieved: data?.trips?.filter((trip) => trip.status === 'created')?? [],
//                 InProgress: data?.trips?.filter((trip) => trip.status === 'inProgress')?? [],
//                 Completed: data?.trips?.filter((trip) => trip.status === 'completed')?? [],
//                 Cancelled: data?.trips?.filter((trip) => trip.status === 'cancelled')?? [],
//             };

//             setTrips(categorizedTrips);
//         } catch (error) {
//             console.error('Error fetching trips:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (userId) fetchTrips();
//     }, [userId]);


//     useFocusEffect(
//         useCallback(() => {
//             let isMounted = true;

//             // Refresh trips when screen gains focus
//             const refreshTrips = async () => {
//                 await fetchTrips();
//             };

//             refreshTrips();

//             return () => {
//                 isMounted = false;
//             };
//         }, [])
//     );

//     const sectionColors = {
//         Archieved: '#e6f7ff', // Gold
//         InProgress: '#fff7e6', // Dodger Blue
//         Completed: '#e6ffe6', // Lime Green
//         Cancelled: '#ffe6e6', // Tomato Red
//     };


//     const paymentVerificationForTrip = (async (req, res) => {
//         const { userId, tripId, amount, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      
//         // Validate required fields
//         if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
//           throw new ApiError(400, "Invalid or missing userId.");
//         }
//         if (!tripId) {
//           throw new ApiError(400, "Trip ID is required.");
//         }
//         if (!mongoose.Types.ObjectId.isValid(tripId)) {
//           console.error(`Invalid tripId format: ${tripId}`);
//           throw new ApiError(400, "Invalid tripId format.");
//         }
//         if (!amount || isNaN(amount) || Number(amount) <= 0) {
//           throw new ApiError(400, "Invalid amount. Please provide a positive number.");
//         }
//         if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//           throw new ApiError(400, "Missing required payment fields: orderId, paymentId, signature.");
//         }
      
//         try {
//           // Generate and compare signatures
//           const body = `${razorpay_order_id}|${razorpay_payment_id}`;
//           const expectedSignature = crypto
//             .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
//             .update(body)
//             .digest("hex");
      
//           if (razorpay_signature !== expectedSignature) {
//             console.error("Invalid payment signature", { razorpay_payment_id, expectedSignature });
//             throw new ApiError(400, "Invalid payment signature.");
//           }
      
//           // Find the Trip document
//           console.log(`Searching for trip with ID: ${tripId}`);
//           const trip = await Trip.findById(tripId);
      
//           if (!trip) {
//             console.error(`Trip not found for tripId: ${tripId}`);
//             throw new ApiError(404, "Trip not found.");
//           }
      
//           // Add transaction
//           trip.transactions.push({
//             amount: Number(amount),
//             type: "credit",
//             razorpay_order_id,
//             razorpay_payment_id,
//             razorpay_signature,
//           });
      
//           // Save the updated Trip document
//           await trip.save();
      
//           return res.status(200).json({
//             success: true,
//             message: "Payment verified and trip transaction updated successfully.",
//             transactions: trip.transactions,
//           });
//         } catch (error) {
//           console.error("Error during payment verification:", error);
//           throw new ApiError(
//             error.statusCode || 500,
//             error.message || "Internal server error during payment verification."
//           );
//         }
//       });

//     const renderTripCard = (item) => (
//         <View style={styles.card} key={item._id}>
//             <Text style={styles.tripText}>tripid: {item._id}</Text>
//             <Text style={styles.tripText}>From: {item.from}</Text>
//             <Text style={styles.tripText}>To: {item.to}</Text>
//             <Text style={styles.tripText}>Cargo Type: {item.cargoDetails.cargoType}</Text>
//             <Text style={styles.tripText}>Quote Price: ₹{item.cargoDetails.quotePrice}</Text>
//             <Text style={styles.tripText}>
//                 Date: {new Date(item.tripDate).toLocaleDateString()}
//             </Text>
//             <Text style={styles.instructionsText}>
//                 Instructions: {item.specialInstruction || 'N/A'}
//             </Text>
//             {/* Show "Pay Now" button when status is "created" and biddingStatus is "accepted" */}
//             {item.status === 'created' && item.biddingStatus === 'accepted' && (
//                 <TouchableOpacity
//                     style={[styles.button, styles.payNowButton]}
//                     onPress={() => paymentVerificationForTrip({tripId: item._id, userId, amount:30})}
//                 >
//                     <Text style={styles.buttonText}>Pay Now</Text>
//                 </TouchableOpacity>
//             )}
//             <TouchableOpacity
//                 style={styles.button}
//                 onPress={() => navigation.navigate('ViewDetails', { tripId: item._id, status: item.status })}
//             >
//                 <Text style={styles.buttonText}>View Details</Text>
//             </TouchableOpacity>
//         </View>
//     );
    

//     const renderSection = (status, trips) => (
//         <View
//             style={[styles.section, { backgroundColor: sectionColors[status] }]}
//             key={status}
//         >
//             <Text style={styles.sectionHeader}>{status} Trips</Text>
//             {trips.length > 0 ? (
//                 <FlatList
//                     data={trips}
//                     renderItem={({ item }) => renderTripCard(item)}
//                     keyExtractor={(item) => item._id}
//                     horizontal
//                     showsHorizontalScrollIndicator={false}
//                 />
//             ) : (
//                 <Text style={styles.noTripsText}>No trips available</Text>
//             )}
//         </View>
//     );

//     if (loading) {
//         return (
//             <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color="#007BFF" />
//             </View>
//         );
//     }


      
//     return (
//         <LinearGradient colors={['#06264D', '#FFF']} style={{ flex: 1 }}>
//             <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 40 }}>
//                 <ScrollView contentContainerStyle={styles.container}>
//                     <Text style={styles.screenTitle}>Trips</Text>
//                     {['Archieved', 'InProgress', 'Completed', 'Cancelled'].map((status) =>
//                         renderSection(status, trips[status])
//                     )}
//                 </ScrollView>
//             </SafeAreaView>
//         </LinearGradient>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         padding: 16,
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     screenTitle: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 16,
//         color: '#FFF',
//         textAlign: 'center',
//     },
//     section: {
//         marginBottom: 24,
//         padding: 16,
//         borderRadius: 8,
//     },
//     sectionHeader: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 8,
//         color: '#333',
//     },
//     card: {
//         backgroundColor: '#FFF',
//         padding: 16,
//         marginHorizontal: 8,
//         borderRadius: 8,
//         shadowColor: '#000',
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//         width: 250,
//     },
//     tripText: {
//         fontSize: 16,
//         marginBottom: 4,
//         color: '#333',
//     },
//     instructionsText: {
//         fontSize: 14,
//         color: '#555',
//         marginTop: 4,
//     },
//     button: {
//         marginTop: 8,
//         paddingVertical: 8,
//         backgroundColor: '#007BFF',
//         borderRadius: 4,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: '#FFF',
//         fontSize: 14,
//         fontWeight: 'bold',
//     },
//     noTripsText: {
//         color: '#FFF',
//         fontSize: 14,
//         fontStyle: 'italic',
//     },
//     payNowButton: {
//         backgroundColor: '#00ff45', // Bright orange for "Pay Now"
//         marginVertical: 10,
//     },
// });

// export default TripScreen;