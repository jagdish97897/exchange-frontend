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
import { API_END_POINT } from '../app.config';

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

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get(`${API_END_POINT}/api/trips/customer/${userId}`);
        // use reduce for inProgress completed cancelled created trips
        if (response.status === 200) {

          const categorizedTrips = {
            created: data?.trips?.filter((trip) => trip.status === 'created') ?? [],
            inProgress: data?.trips?.filter((trip) => trip.status === 'inProgress') ?? [],
            completed: data?.trips?.filter((trip) => trip.status === 'completed') ?? [],
            cancelled: data?.trips?.filter((trip) => trip.status === 'cancelled') ?? [],
          };

          setTrips(categorizedTrips);
        }
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