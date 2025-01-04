import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const TripScreen = () => {
  const [trips, setTrips] = useState({
    created: [],
    inProgress: [],
    completed: [],
    cancelled: [],
  });
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const route = useRoute();

  const userId = route.params?.userId;

  const apiEndpoint = `http://192.168.1.4:8000/api/trips/customer/${userId}`;

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();

        const categorizedTrips = {
          created: data.trips.filter((trip) => trip.status === 'created'),
          inProgress: data.trips.filter((trip) => trip.status === 'inProgress'),
          completed: data.trips.filter((trip) => trip.status === 'completed'),
          cancelled: data.trips.filter((trip) => trip.status === 'cancelled'),
        };

        setTrips(categorizedTrips);
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchTrips();
  }, [userId]);

  const sectionColors = {
    created: '#e6f7ff', // Gold
    inProgress: '#fff7e6', // Dodger Blue
    completed: '#e6ffe6', // Lime Green
    cancelled: '#ffe6e6', // Tomato Red
  };

  const renderTripCard = (item) => (
    <View style={styles.card} key={item._id}>
      <Text style={styles.tripText}>From: {item.from}</Text>
      <Text style={styles.tripText}>To: {item.to}</Text>
      <Text style={styles.tripText}>Cargo: {item.cargoDetails.cargoType}</Text>
      <Text style={styles.tripText}>Quote: ₹{item.cargoDetails.quotePrice}</Text>
      <Text style={styles.tripText}>
        Date: {new Date(item.tripDate).toLocaleDateString()}
      </Text>
      <Text style={styles.instructionsText}>
        Instructions: {item.specialInstruction || 'N/A'}
      </Text>
      <TouchableOpacity
  style={styles.button}
  onPress={() => navigation.navigate('ViewDetails', { tripId: item._id })}
>
  <Text style={styles.buttonText}>View Details</Text>
</TouchableOpacity>
    </View>
  );

  const renderSection = (title, data) => (
    <View
      style={[styles.section, { backgroundColor: sectionColors[title] }]}
      key={title}
    >
      <Text style={styles.sectionHeader}>{title} Trips</Text>
      {data.length > 0 ? (
        <FlatList
          data={data}
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
          {['created', 'inProgress', 'completed', 'cancelled'].map((status) =>
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
});

export default TripScreen;


// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   ActivityIndicator,
//   StyleSheet,
//   ScrollView,
//   SafeAreaView,
//   TouchableOpacity,
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { LinearGradient } from 'expo-linear-gradient';

// const TripScreen = () => {
//   const [trips, setTrips] = useState({
//     created: [],
//     inProgress: [],
//     completed: [],
//     cancelled: [],
//   });
//   const [loading, setLoading] = useState(true);

//   const navigation = useNavigation();
//   const route = useRoute();

//   // Retrieve userId from navigation params
//   const userId = route.params?.userId;

//   const apiEndpoint = `http://192.168.1.4:8000/api/trips/customer/${userId}`;

//   useEffect(() => {
//     const fetchTrips = async () => {
//       try {
//         const response = await fetch(apiEndpoint);
//         const data = await response.json();

//         const categorizedTrips = {
//           created: data.trips.filter((trip) => trip.status === 'created'),
//           inProgress: data.trips.filter((trip) => trip.status === 'inProgress'),
//           completed: data.trips.filter((trip) => trip.status === 'completed'),
//           cancelled: data.trips.filter((trip) => trip.status === 'cancelled'),
//         };

//         setTrips(categorizedTrips);
//       } catch (error) {
//         console.error('Error fetching trips:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId) fetchTrips();
//   }, [userId]);

//   const renderTripCard = (item) => (
//     <View style={styles.card} key={item._id}>
//       <Text style={styles.tripText}>From: {item.from}</Text>
//       <Text style={styles.tripText}>To: {item.to}</Text>
//       <Text style={styles.tripText}>Cargo: {item.cargoDetails.cargoType}</Text>
//       <Text style={styles.tripText}>Quote: ₹{item.cargoDetails.quotePrice}</Text>
//       <Text style={styles.tripText}>
//         Date: {new Date(item.tripDate).toLocaleDateString()}
//       </Text>
//       <Text style={styles.instructionsText}>
//         Instructions: {item.specialInstruction || 'N/A'}
//       </Text>
//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>View Details</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const renderSection = (title, data) => (
//     <View style={[styles.section]} key={title}>
//       <Text style={styles.sectionHeader}>{title} Trips</Text>
//       {data.length > 0 ? (
//         <FlatList
//           data={data}
//           renderItem={({ item }) => renderTripCard(item)}
//           keyExtractor={(item) => item._id}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//         />
//       ) : (
//         <Text style={styles.noTripsText}>No trips available</Text>
//       )}
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#007BFF" />
//       </View>
//     );
//   }

//   return (
//     <LinearGradient colors={['#06264D', '#FFF']} style={{ flex: 1 }}>
//       <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 40 }}>
//         <ScrollView contentContainerStyle={styles.container}>
//           <Text style={styles.screenTitle}>Trips</Text>
//           {['created', 'inProgress', 'completed', 'cancelled'].map((status) =>
//             renderSection(status, trips[status])
//           )}
//         </ScrollView>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   screenTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     color: '#FFF',
//     textAlign: 'center',
//   },
//   section: {
//     marginBottom: 24,
//     padding: 16,
//     borderRadius: 8,
//     backgroundColor: '#e6f7ff',
//   },
//   sectionHeader: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#333',
//   },
//   card: {
//     backgroundColor: '#FFF',
//     padding: 16,
//     marginHorizontal: 8,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     width: 250,
//   },
//   tripText: {
//     fontSize: 16,
//     marginBottom: 4,
//     color: '#333',
//   },
//   instructionsText: {
//     fontSize: 14,
//     color: '#555',
//     marginTop: 4,
//   },
//   button: {
//     marginTop: 8,
//     paddingVertical: 8,
//     backgroundColor: '#007BFF',
//     borderRadius: 4,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#FFF',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   noTripsText: {
//     color: '#888',
//     fontSize: 14,
//     fontStyle: 'italic',
//   },
// });

// export default TripScreen;




// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Image,
//   SafeAreaView,
//   Keyboard,
// } from "react-native";

// import { LinearGradient } from 'expo-linear-gradient';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// const Trips = () => {

//    const [keyboardVisible, setKeyboardVisible] = useState(false);

//        useEffect(() => {
//            const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
//                setKeyboardVisible(true);
//            });
//            const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
//                setKeyboardVisible(false);
//            });
   
//            return () => {
//                keyboardDidShowListener.remove();
//                keyboardDidHideListener.remove();
//            };
//        }, []);

//   const currentTrips = [
//     { id: 1, driver: "John Doe", eta: "15 mins", destination: "City Center" },
//     { id: 2, driver: "John Doe1", eta: "20 mins", destination: "Airport" },
//     { id: 3, driver: "John Doe2", eta: "25 mins", destination: "Mall" },
//   ];

//   const pastTrips = [
//     { id: 1, driver: "Jane Smith", date: "2024-12-30", cargoType: "Furniture" },
//     { id: 2, driver: "John Doe1", date: "2024-12-29", cargoType: "Electronics" },
//     { id: 3, driver: "John Doe2", date: "2024-12-28", cargoType: "Groceries" },
//   ];

//   const completedTrips = [
//     { id: 1, driver: "John Doe", eta: "15 mins", destination: "City Center" },
//     { id: 2, driver: "John Doe1", eta: "20 mins", destination: "Airport" },
//   ];

//   const canceledTrips = [
//     { id: 1, driver: "Jane Smith", date: "2024-12-30", cargoType: "Furniture" },
//     { id: 2, driver: "John Doe1", date: "2024-12-29", cargoType: "Electronics" },
//   ];


//   const sectionColors = {
//     "Current Trips": "#e6f7ff", // Light blue
//     "Past Trips": "#fff7e6", // Light orange
//     "Completed Trips": "#e6ffe6", // Light green
//     "Canceled Trips": "#ffe6e6", // Light red
//   };

//   const renderTripCard = (item) => (
//     <View style={styles.card} key={item.id}>
//       <Text style={styles.driverText}>Driver: {item.driver}</Text>
//       {item.eta && <Text>ETA: {item.eta}</Text>}
//       {item.destination && <Text>Destination: {item.destination}</Text>}
//       {item.date && <Text>Date: {item.date}</Text>}
//       {item.cargoType && <Text>Cargo Type: {item.cargoType}</Text>}
//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>View Details</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const renderSection = (title, data) => (
//     <View
//       style={[styles.section, { backgroundColor: sectionColors[title] }]}
//       key={title}
//     >
//       <Text style={styles.sectionHeader}>{title}</Text>
//       <FlatList
//         data={data}
//         renderItem={({ item }) => renderTripCard(item)}
//         keyExtractor={(item) => item.id.toString()}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//       />
//     </View>
//   );
//   return (
//             <LinearGradient colors={['#06264D', '#FFF']} style={{ flex: 1 }}>
//                 <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 40 }}>
//                     <KeyboardAwareScrollView
//                         resetScrollToCoords={{ x: 0, y: 0 }}
//                         contentContainerStyle={styles.container}
//                         scrollEnabled={true}
//                         enableAutomaticScroll={true}
//                         enableOnAndroid={true}
//                         extraScrollHeight={100}
//                         showsVerticalScrollIndicator={false}
//                         showsHorizontalScrollIndicator={false}
//                     >
//                         <Image
//                             source={require('../assets/images/logo-removebg-preview 1.png')}
//                             style={styles.logo}
//                         />
              
//     <ScrollView contentContainerStyle={styles.container}>
//       {renderSection("Current Trips", currentTrips)}
//       {renderSection("Past Trips", pastTrips)}
//       {renderSection("Completed Trips", completedTrips)}
//       {renderSection("Canceled Trips", canceledTrips)}
//     </ScrollView>

//                     </KeyboardAwareScrollView>
    
//                     {!keyboardVisible && (
//                         <View style={styles.footer}>
//                             <Image
//                                 source={require('../assets/images/mantra.jpg')}
//                                 style={styles.smallImage}
//                             />
//                             <View style={styles.footerTextContainer}>
//                                 <Text style={styles.footerText}>Made in</Text>
//                                 <Image
//                                     source={require('../assets/images/image 10.png')}
//                                     style={styles.smallImage}
//                                 />
//                             </View>
//                             <Image
//                                 source={require('../assets/images/make-in-India-logo.jpg')}
//                                 style={styles.smallImage}
//                             />
//                         </View>
//                     )}
//                 </SafeAreaView>
//             </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//   },
//   section: {
//     marginBottom: 24,
//     padding: 16,
//     borderRadius: 8,
//   },
//   sectionHeader: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 8,
//     color: "#333",
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 16,
//     marginHorizontal: 8,
//     borderRadius: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     width: 250,
//   },
//   logo: {
//     width: 180, // Reduced width for better fit
//     height: 160, // Reduced height for better fit
//     alignSelf: 'center',
//     marginBottom: 30, // Added margin below the logo
// },
//   driverText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
//   button: {
//     marginTop: 8,
//     paddingVertical: 8,
//     backgroundColor: "#007BFF",
//     borderRadius: 4,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "bold",
//   },

//   footer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-around',
//     marginTop: 20
// },
// smallImage: {
//     width: 40,
//     height: 40
// },
// footerTextContainer: {
//     flexDirection: 'row',
//     alignItems: 'center'
// },
// footerText: {
//     color: '#000',
//     paddingLeft: 2
// },
// });

// export default Trips;

