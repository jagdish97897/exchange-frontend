import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TouchableWithoutFeedback, Modal, Button, Image, ActivityIndicator, StyleSheet, ScrollView, FlatList, Dimensions } from "react-native";
import { Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import { checkAndRequestLocationPermission } from './ConsumerDashboard';
import { getSocket } from './SocketIO.js';
import { API_END_POINT } from '../app.config';
import { checkExpoPushTokenChange } from './ConsumerDashboard.js';
import { useNotification } from '../context/NotificationContext.js';

const { width, height } = Dimensions.get('window');

export default ({ route }) => {
  const { phoneNumber, token, userId } = route.params;
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const [ownerId, setOwnerId] = useState('');
  const [socket, setSocket] = useState(null);
  const [trips, setTrips] = useState({ created: [], inProgress: [], completed: [], cancelled: [] });
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({ latitude: '', longitude: '' });
  const [showExitOptions, setShowExitOptions] = useState(false);
  const { expoPushToken } = useNotification();
  const [selectedType, setSelectedType] = useState("inProgress"); // Default selection

  const tripTypes = ["created", "inProgress", "completed", "canceled"];

  // Define section colors
  const sectionColors = {
    created: '#f0f8ff',
    inProgress: '#e6f7ff',
    completed: '#e6ffe6',
    cancelled: '#ffe6e6'
  };

  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);

    if (socket) {
      socket.on("newMessage", (message) => {
        console.log("Message from server:", message);
      });
    }

    // return () => {
    //   closeSocket(); // Disconnect socket on unmount
    // };
  }, [token]);

  useEffect(() => {
    if (!userId || !expoPushToken) {
      return;
    } else {
      checkExpoPushTokenChange(userId, expoPushToken);
    }

  }, [userId, expoPushToken]);

  useEffect(() => {
    (async () => {
      try {
        const { latitude, longitude } = await checkAndRequestLocationPermission();

        if (latitude) {
          setCurrentLocation((prevLocation) => ({
            ...prevLocation,
            latitude,
          }));
        }

        if (longitude) {
          setCurrentLocation((prevLocation) => ({
            ...prevLocation,
            longitude,
          }));
        }
      } catch (error) {
        console.log('Error in checking or requesting location permission:', error);
      }
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      // Refresh trips when screen gains focus
      const refreshTrips = async () => {
        // if (token) {
        //     await fetchTrips(isMounted);
        // }
      };

      refreshTrips();

      return () => {
        isMounted = false;
      };
    }, [token])
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_END_POINT}/api/v1/users/${phoneNumber}`);
        setOwnerId(response.data._id);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [phoneNumber]);

  const fetchTrips = async () => {
    try {
      const response = await axios.get(`${API_END_POINT}/api/trips/owner/${userId}/progressTrip`);

      // console.log('API Response:', response.data);

      if (response.status === 200 && Array.isArray(response.data)) {
        const categorizedTrips = {
          created: response.data.filter((trip) => trip.status === 'created') ?? [],
          inProgress: response.data.filter((trip) => trip.status === 'inProgress') ?? [],
          completed: response.data.filter((trip) => trip.status === 'completed') ?? [],
          cancelled: response.data.filter((trip) => trip.status === 'cancelled') ?? [],
        };
        setTrips(categorizedTrips);
      } else {
        console.log('Unexpected API Response:', response.data);
        setTrips({ created: [], inProgress: [], completed: [], cancelled: [] });
      }
    } catch (error) {
      console.log('Error fetching trips:', error);
      setTrips({ created: [], inProgress: [], completed: [], cancelled: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchTrips();
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [token])
  );

  useEffect(() => {
    (async () => {
      try {
        const { latitude, longitude } = await checkAndRequestLocationPermission();
        setCurrentLocation({ latitude, longitude });
      } catch (error) {
        console.log('Error getting location:', error);
      }
    })();
  }, []);

  const handleCloseApp = () => {
    BackHandler.exitApp();
  };

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const renderTripCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ViewDetails', { tripId: item._id, status: item.status })}>
      <Image source={require('../assets/images/start.png')} style={styles.tripImage} />
      <View style={styles.tripDetails}>
        <Text style={styles.tripText}>Trip Id: {item._id}</Text>
        <View style={styles.routeContainer}>
          <FontAwesome name="map-marker" size={18} color="green" />
          <Text style={styles.locationText}>{' '}{item.from}{' '}</Text>
          <Text style={styles.arrow}>{'➝'}</Text>
          <FontAwesome name="map-marker" size={18} color="red" />
          <Text style={styles.locationText}>{' '}{item.to}</Text>
        </View>
        <Text style={styles.eta}>{`ETA: ${item.eta ?? 'N/A'}`}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
      <View style={{ flex: 1, marginTop: 40 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleMenu}>
            <Feather name="menu" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Exchange</Text>
          <TouchableOpacity onPress={toggleMenu} />
        </View>

        {menuVisible && (
          <View style={styles.menu}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile', { phoneNumber })}>
              <Text>ACCOUNT</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("AddVehicleScreen", { ownerId, token, currentLocation })}>
              <Text>ADD VEHICLE</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("GetVehicleScreen", { ownerId })}>
              <Text>UPDATE VEHICLE</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Trip Type Selection */}
        <View style={styles.filterContainer}>
          {tripTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.filterButton, selectedType === type && styles.selectedButton]}
              onPress={() => setSelectedType(type)}
            >
              <Text style={selectedType === type ? styles.selectedText : styles.filterText}>
                {type.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Trips List */}
        <SafeAreaView style={styles.container}>
          <FlatList
            data={trips[selectedType]}
            renderItem={renderTripCard}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        </SafeAreaView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showExitOptions}
          onRequestClose={() => setShowExitOptions(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.exitText}>Do you really want to close the app?</Text>
              <View style={styles.buttonGroup}>
                <Button title="Close App" onPress={handleCloseApp} color="#FF5C5C" />
                <Button title="Not Close" onPress={() => setShowExitOptions(false)} color="#5CCF5C" />
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", padding: 15, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { flexDirection: "row", backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 10, elevation: 2, backgroundColor: '#0052CC', },
  tripImage: { width: 50, height: 50, marginRight: 10 },
  tripDetails: { flex: 1 },
  tripText: { fontSize: 16, fontWeight: "bold", color: "white" },
  routeContainer: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  locationText: { fontSize: 14, color: "white" },
  arrow: { fontSize: 14, marginHorizontal: 5 },
  eta: { fontSize: 14, color: "gray" },
  menu: { position: 'absolute', top: 75, left: 20, backgroundColor: 'white', padding: 10, borderRadius: 5, elevation: 5, zIndex: 2 },
  filterContainer: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  filterButton: { padding: 7, borderRadius: 5, backgroundColor: "#ddd" },
  selectedButton: { backgroundColor: "#007BFF" },
  filterText: { color: "#333" },
  selectedText: { color: "#fff", fontWeight: "bold" },
});