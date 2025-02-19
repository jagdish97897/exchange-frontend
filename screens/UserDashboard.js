import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { getSocket } from './SocketIO';
import { fetchApiKey } from './GoogleMap';

// Utility function to get coordinates from a pincode using Google Geocode API
export const getCoordinatesFromPincode = async (pincode, apikey) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
  }
  return null;
};

export default function LocationScreen({ route }) {
  const { userId, from, to } = route.params;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [pickupCords, setPickupCords] = useState(null);
  const [dropLocationCords, setDropLocationCords] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [socket, setSocket] = useState(null);
  const [GOOGLE_MAPS_API_KEY, setGOOGLE_MAPS_API_KEY] = useState(null);


  const mapRef = useRef(null);

  useEffect(() => {
    const apiKey = fetchApiKey();
    if (apiKey.length > 0) {
      setGOOGLE_MAPS_API_KEY(apiKey);
    }
  }, []);

  useEffect(() => {
    const socketInstance = getSocket();
    setSocket(socketInstance);

    // return () => {
    //     closeSocket(); // Disconnect socket on unmount
    // };
  }, []);

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
    const requestLocationPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location access is required.');
          return;
        }
        setHasPermission(true);
        getLocationAndSend();
      } catch (error) {
        console.error('Error requesting location permission:', error);
      }
    };
    requestLocationPermission();
  }, []);

  const getLocationAndSend = async () => {
    if (!hasPermission) return;
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;
      setCurrentLocation({ latitude, longitude });
      // Now, we only send the userId, latitude, and longitude.
      // The server will use these to determine the zone.
      socket.emit("saveLocation", { userId, latitude, longitude });
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getLocationAndSend();
    }, 5000);
    return () => clearInterval(interval);
  }, [hasPermission]);

  return (
    <View style={{ flex: 1 }}>
      <Text>User ID: {userId}</Text>

      {pickupCords && (
        <Text>Pickup Location: {pickupCords.latitude}, {pickupCords.longitude}</Text>
      )}

      {dropLocationCords && (
        <Text>Drop Location: {dropLocationCords.latitude}, {dropLocationCords.longitude}</Text>
      )}

      {currentLocation ? (
        <Text>Current Location: {currentLocation.latitude}, {currentLocation.longitude}</Text>
      ) : (
        <Text>Fetching current location...</Text>
      )}

      {pickupCords && dropLocationCords && GOOGLE_MAPS_API_KEY ? (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            ...pickupCords,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker coordinate={pickupCords}>
            <Image source={require('../assets/images/start.png')} style={{ width: 50, height: 50 }} resizeMode="contain" />
          </Marker>

          <Marker coordinate={dropLocationCords}>
            <Image source={require('../assets/images/end.png')} style={{ width: 40, height: 40 }} resizeMode="contain" />
          </Marker>

          {currentLocation && (
            <Marker coordinate={currentLocation}>
              <Image source={require('../assets/images/truck.png')} style={{ width: 40, height: 40 }} resizeMode="contain" />
            </Marker>
          )}

          <MapViewDirections
            origin={pickupCords}
            destination={dropLocationCords}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={6}
            strokeColor="hotpink"
          />

          {showDirections && currentLocation && (
            <MapViewDirections
              origin={pickupCords}
              destination={currentLocation}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={4}
              strokeColor="blue"
            />
          )}
        </MapView>
      ) : (
        <Text>Fetching Location Data...</Text>
      )}

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => setShowDirections(prev => !prev)}>
          <Text style={styles.footerText}>{showDirections ? 'Hide Directions' : 'Show Directions'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  footerText: {
    fontSize: 16,
    color: '#007bff',
  },
});
