import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { getSocket } from './SocketIO';
import { fetchApiKey } from './GoogleMap';
import { getCoordinatesFromPincode } from './UserDashboard';

const GetUserLocation = ({ route, navigation }) => {
  const { userId, from, to } = route.params;
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [pickupCords, setPickupCords] = useState(null);
  const [dropLocationCords, setDropLocationCords] = useState(null);
  const [GOOGLE_MAPS_API_KEY, setGOOGLE_MAPS_API_KEY] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);

    // return () => {
    //     closeSocket(); // Disconnect socket on unmount
    // };
  }, []);


  useEffect(() => {
    const fetchKey = async () => {
      try {
        const apiKey = await fetchApiKey(); // Wait for the API key
        if (apiKey.length > 0) {
          setGOOGLE_MAPS_API_KEY(apiKey);
        }
      } catch (error) {
        console.error("Error fetching API key:", error);
      }
    };

    fetchKey(); // Call the async function
  }, []);


  const fetchLocation = () => {
    if (userId) {
      socket.emit('getUserLocation', { userId });
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      if (!GOOGLE_MAPS_API_KEY) return;

      const [pickup, drop] = await Promise.all([
        getCoordinatesFromPincode(from, GOOGLE_MAPS_API_KEY),
        getCoordinatesFromPincode(to, GOOGLE_MAPS_API_KEY)
      ]);

      if (pickup && drop) {
        setPickupCords(pickup);
        setDropLocationCords(drop);
      }
    };
    fetchLocations();
  }, [from, to, GOOGLE_MAPS_API_KEY]);

  useEffect(() => {
    fetchLocation();
    const interval = setInterval(() => {
      fetchLocation();
    }, 5000);

    socket.on('receiveUserLocation', (data) => {
      if (data.latitude && data.longitude) {
        setLatitude(parseFloat(data.latitude));
        setLongitude(parseFloat(data.longitude));
      } else {
        Alert.alert('Error', 'Location data not received');
      }
    });

    // socket.on(`locationUpdate:${userId}`, (data) => {
    //   if (data.latitude && data.longitude) {
    //     setLatitude(parseFloat(data.latitude));
    //     setLongitude(parseFloat(data.longitude));
    //   }
    // });

    socket.on('error', (message) => Alert.alert('Error', message));

    return () => {
      clearInterval(interval);
      socket.off('receiveUserLocation');
      socket.off(`locationUpdate:${userId}`);
      socket.off('error');
    };
  }, [userId]);

  return (
    <View style={{ flex: 1 }}>
      {latitude && longitude && pickupCords && dropLocationCords && GOOGLE_MAPS_API_KEY ? (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {/* User's live location */}
          <Marker coordinate={{ latitude, longitude }}>
            <Image source={require('../assets/images/truck.png')} style={styles.truckIcon} resizeMode="contain" />
          </Marker>

          {/* Pickup location */}
          {pickupCords && (
            <Marker coordinate={pickupCords}>
              <Image source={require('../assets/images/start.png')} style={styles.markerIcon} resizeMode="contain" />
            </Marker>
          )}

          {/* Drop location */}
          {dropLocationCords && (
            <Marker coordinate={dropLocationCords}>
              <Image source={require('../assets/images/end.png')} style={styles.markerIcon} resizeMode="contain" />
            </Marker>
          )}

          {/* Directions */}
          {pickupCords && dropLocationCords && (
            <MapViewDirections
              origin={pickupCords}
              destination={dropLocationCords}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={6}
              strokeColor="hotpink"
            />
          )}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Fetching location...</Text>
        </View>
      )}
      {/* Footer for going back */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: 'gray',
  },
  truckIcon: {
    width: 80,
    height: 80,
  },
  markerIcon: {
    width: 50,
    height: 50,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default GetUserLocation;
