import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';  
import { LinearGradient } from 'expo-linear-gradient';

const ViewDetails = () => {
  const [tripDetails, setTripDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const navigation = useNavigation();  

  const { tripId } = route.params;  

  const apiEndpoint = `http://192.168.1.4:8000/api/trips/${tripId}`;

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();
        setTripDetails(data.trip);
      } catch (error) {
        console.error('Error fetching trip details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (tripId) fetchTripDetails();
  }, [tripId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!tripDetails) {
    return (
      <View style={styles.noDetailsContainer}>
        <Text style={styles.noDetailsText}>No trip details available</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#06264D', '#FFF']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 40 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Trip Details</Text>

        <View style={styles.card}>
          <Text style={styles.detailText}>From: {tripDetails.from}</Text>
          <Text style={styles.detailText}>To: {tripDetails.to}</Text>
          <Text style={styles.detailText}>Cargo Type: {tripDetails.cargoDetails.cargoType}</Text>
          <Text style={styles.detailText}>Quote Price: ₹{tripDetails.cargoDetails.quotePrice}</Text>
          <Text style={styles.detailText}>
            Trip Date: {new Date(tripDetails.tripDate).toLocaleDateString()}
          </Text>
          <Text style={styles.detailText}>Special Instructions: {tripDetails.specialInstruction || 'N/A'}</Text>
          <Text style={styles.detailText}>Status: {tripDetails.status}</Text>

          {/* Optionally, display more detailed info based on the trip object */}
          <View style={styles.additionalInfo}>
            <Text style={styles.detailText}>Vehicle Number: {tripDetails.vehicleNumber}</Text>
            <Text style={styles.detailText}>Driver Details: {tripDetails.driverDetails || 'N/A'}</Text>
            <Text style={styles.detailText}>Pickup Address: {tripDetails.pickupAddress || 'N/A'}</Text>
            <Text style={styles.detailText}>Dropoff Address: {tripDetails.dropoffAddress || 'N/A'}</Text>
          </View>

          {/* Button to navigate back */}
          <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
         </SafeAreaView>
       </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDetailsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDetailsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6347',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  additionalInfo: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ViewDetails;


// import React, { useEffect, useState } from 'react';
// import { View, Text, ActivityIndicator, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
// import { useRoute } from '@react-navigation/native';

// const ViewDetails = () => {
//   const [tripDetails, setTripDetails] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const route = useRoute();
//   const { tripId } = route.params;  // Expecting tripId to be passed via navigation params

//   const apiEndpoint = `c`;

//   useEffect(() => {
//     const fetchTripDetails = async () => {
//       try {
//         const response = await fetch(apiEndpoint);
//         const data = await response.json();
//         setTripDetails(data.trip); // Assuming the trip object is under 'trip' key
//       } catch (error) {
//         console.error('Error fetching trip details:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (tripId) fetchTripDetails();
//   }, [tripId]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007BFF" />
//       </View>
//     );
//   }

//   if (!tripDetails) {
//     return (
//       <View style={styles.noDetailsContainer}>
//         <Text style={styles.noDetailsText}>No trip details available</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text style={styles.title}>Trip Details</Text>

//         <View style={styles.card}>
//           <Text style={styles.detailText}>From: {tripDetails.from}</Text>
//           <Text style={styles.detailText}>To: {tripDetails.to}</Text>
//           <Text style={styles.detailText}>Cargo Type: {tripDetails.cargoDetails.cargoType}</Text>
//           <Text style={styles.detailText}>Quote Price: ₹{tripDetails.cargoDetails.quotePrice}</Text>
//           <Text style={styles.detailText}>
//             Trip Date: {new Date(tripDetails.tripDate).toLocaleDateString()}
//           </Text>
//           <Text style={styles.detailText}>Special Instructions: {tripDetails.specialInstruction || 'N/A'}</Text>
//           <Text style={styles.detailText}>Status: {tripDetails.status}</Text>

//           {/* Optionally, display more detailed info based on the trip object */}
//           <View style={styles.additionalInfo}>
//             <Text style={styles.detailText}>Vehicle Number: {tripDetails.vehicleNumber}</Text>
//             <Text style={styles.detailText}>Driver Details: {tripDetails.driverDetails || 'N/A'}</Text>
//             <Text style={styles.detailText}>Pickup Address: {tripDetails.pickupAddress || 'N/A'}</Text>
//             <Text style={styles.detailText}>Dropoff Address: {tripDetails.dropoffAddress || 'N/A'}</Text>
//           </View>

//           {/* Button to navigate back */}
//           <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
//             <Text style={styles.buttonText}>Back</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   scrollContainer: {
//     paddingBottom: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noDetailsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noDetailsText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FF6347',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   card: {
//     backgroundColor: '#FFF',
//     padding: 16,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   detailText: {
//     fontSize: 16,
//     marginBottom: 8,
//     color: '#333',
//   },
//   additionalInfo: {
//     marginTop: 16,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#E0E0E0',
//   },
//   button: {
//     marginTop: 20,
//     backgroundColor: '#007BFF',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 4,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default ViewDetails;
