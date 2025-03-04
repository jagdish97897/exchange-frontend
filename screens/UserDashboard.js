import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Alert, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { getSocket } from './SocketIO';
import { fetchApiKey } from './GoogleMap';
import haversine from 'haversine';
import * as ImagePicker from 'expo-image-picker';


// Utility function to get coordinates from a pincode using Google Geocode API
export const getCoordinatesFromPincode = async (pincode, apiKey) => {
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

export default function LocationScreen({ route, navigation }) {
  const { userId, from, to } = route.params;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickupCords, setPickupCords] = useState(null);
  const [dropLocationCords, setDropLocationCords] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [isNearPickup, setIsNearPickup] = useState(false);
  const [isNearPickup1, setIsNearPickup1] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [image, setImage] = useState(null);
  const [billImage, setBillImage] = useState(null);
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  const prevLocation = useRef(null);
  const intervalRef = useRef(null);

  const [GOOGLE_MAPS_API_KEY, setGOOGLE_MAPS_API_KEY] = useState(null);

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
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required.');
        return;
      }
      startLocationTracking();
    };
    requestLocationPermission();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (currentLocation) {
      checkProximity(currentLocation.latitude, currentLocation.longitude);
    }
  }, [currentLocation, pickupCords]);

  const getLocationAndSend = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = location.coords;

      // Always update current location for the UI
      setCurrentLocation({ latitude, longitude });

      // Check if the user is near the pickup location
      checkProximity(latitude, longitude);

      checkProximity1(latitude, longitude);

      // Only send location if it has changed
      if (!prevLocation.current || prevLocation.current.latitude !== latitude || prevLocation.current.longitude !== longitude) {
        prevLocation.current = { latitude, longitude };
        socket.emit("saveLocation", { userId, latitude, longitude });
      }
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const startLocationTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(getLocationAndSend, 10000);
  };

  const checkProximity = (lat, lng) => {
    if (pickupCords) {
      const start = { latitude: lat, longitude: lng };
      const end = { latitude: pickupCords.latitude, longitude: pickupCords.longitude };
      const distance = haversine(start, end, { unit: 'meter' });
      setIsNearPickup(distance <= 5000);
    }
  };
  const checkProximity1 = (lat, lng) => {
    if (dropLocationCords) {
      const start = { latitude: lat, longitude: lng };
      const end = { latitude: dropLocationCords.latitude, longitude: dropLocationCords.longitude };
      const distance = haversine(start, end, { unit: 'meter' });
      setIsNearPickup1(distance <= 5000);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        // Fetch user details to get vehicleId
        const userResponse = await fetch(`http://192.168.1.2:8000/api/v1/users/userid/${userId}`);
        const userData = await userResponse.json();

        if (!userResponse.ok) throw new Error(userData.message || 'Failed to fetch user details');

        const vehicleId = userData.vehicle;
        console.log('Fetched Vehicle ID:', vehicleId);

        // Fetch vehicle details to get vehicleNumber
        const vehicleResponse = await fetch(`http://192.168.1.2:8000/api/vehicles/vehicle/${vehicleId}`);
        const vehicleData = await vehicleResponse.json();

        if (!vehicleResponse.ok) throw new Error(vehicleData.message || 'Failed to fetch vehicle details');

        setVehicleNumber(vehicleData.vehicleNumber);
        console.log('Fetched Vehicle Number:', vehicleData.vehicleNumber);
      } catch (error) {
        console.error('Error fetching vehicle details:', error);
        Alert.alert('Error', error.message);
      }

      // Request location permission
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        Alert.alert('Permission required', 'Permission to access location was denied');
        return;
      }

      // Get current location
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      console.log('Current Location:', JSON.stringify(loc.coords));
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0]);
      console.log('Selected Image:', result.assets[0]);
    }
  };
  const pickBillImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setBillImage(result.assets[0]);
      console.log('Selected Image:', result.assets[0]);
    }
  };

  const submitGR = async () => {
    if (!vehicleNumber || !image || !location) {
      Alert.alert('Missing Data', 'Please select an image and allow location access.');
      return;
    }

    const currentLocationData = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    const formData = new FormData();
    formData.append('vehicleNumber', vehicleNumber);
    formData.append('driverId', userId);
    formData.append('currentLocation', JSON.stringify(currentLocationData));
    formData.append('GR', {
      uri: image.uri,
      name: 'image.jpg',
      type: image.mimeType || 'image/jpeg',
    });

    try {
      const response = await fetch('http://192.168.1.2:8000/api/vehicles/create1', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  const submitBILL = async () => {
    if (!vehicleNumber || !billImage || !location) {
      Alert.alert('Missing Data', 'Please select an image and allow location access.');
      return;
    }

    const currentLocationData = {
      latitude: location.latitude,
      longitude: location.longitude,
    };

    const formData = new FormData();
    formData.append('vehicleNumber', vehicleNumber);
    formData.append('driverId', userId);
    formData.append('currentLocation', JSON.stringify(currentLocationData));
    formData.append('BILL', {
      uri: billImage.uri, // Fix: Corrected to billImage instead of image
      name: 'bill.jpg',
      type: billImage.mimeType || 'image/jpeg',
    });

    try {
      const response = await fetch('http://192.168.1.2:8000/api/vehicles/create2', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', data.message);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };


  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.navText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>Location Tracking</Text>
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        <Text>User ID: {userId}</Text>
        {pickupCords && <Text>Pickup: {pickupCords.latitude}, {pickupCords.longitude}</Text>}
        {dropLocationCords && <Text>Drop: {dropLocationCords.latitude}, {dropLocationCords.longitude}</Text>}
        {currentLocation ? (
          <Text>Current: {currentLocation.latitude}, {currentLocation.longitude}</Text>
        ) : (
          <Text>Fetching location...</Text>
        )}
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        {pickupCords && dropLocationCords ? (
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFill}
            initialRegion={{ ...pickupCords, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }}>
            <Marker coordinate={pickupCords}>
              <Image source={require('../assets/images/start.png')} style={styles.markerImage} />
            </Marker>
            <Marker coordinate={dropLocationCords}>
              <Image source={require('../assets/images/end.png')} style={styles.markerImage} />
            </Marker>
            {currentLocation && (
              <Marker coordinate={currentLocation}>
                <Image source={require('../assets/images/truck.png')} style={styles.markerImage} />
              </Marker>
            )}
            <MapViewDirections
              origin={pickupCords}
              destination={dropLocationCords}
              apikey="AIzaSyAI0jFdBsZoRP00RGq050nfe24aSfj1mwo"
              strokeWidth={6}
              strokeColor="hotpink"
            />
            {showDirections && currentLocation && (
              <MapViewDirections
                origin={pickupCords}
                destination={currentLocation}
                apikey="AIzaSyAI0jFdBsZoRP00RGq050nfe24aSfj1mwo"
                strokeWidth={4}
                strokeColor="blue"
              />
            )}
          </MapView>
        ) : (
          <Text>Fetching Location Data...</Text>
        )}
      </View>

      {isNearPickup && (
        <View style={styles.card}>
          <Text style={styles.header}>Submit Goods Receipt</Text>

          {/* Driver ID Display */}
          <Text style={styles.label}>Driver ID: {userId}</Text>

          {/* Vehicle Number Input (Read-only) */}
          <TextInput
            style={styles.input}
            placeholder="Fetching Vehicle Number..."
            value={vehicleNumber || ""}
            editable={false}
          />

          {/* Image Picker Button */}
          <Button title="Pick GR Image" onPress={pickImage} />

          {/* Show Selected Image URI or Placeholder */}
          <Text style={styles.fileName}>
            {image ? `Selected Image: ${image.uri}` : "No image selected"}
          </Text>

          {/* Show Location or Placeholder */}
          <Text style={styles.location}>
            {location
              ? `Location: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
              : "Fetching location..."}
          </Text>

          {/* Submit Button - Disabled if data is missing */}
          <Button
            title="Submit Goods Receipt"
            onPress={submitGR}
            disabled={!vehicleNumber || !image || !location}
          />
        </View>
      )}

      {isNearPickup1 && (
        <View style={styles.card}>
          <Text style={styles.header}>Submit Bill Receipt</Text>

          {/* Driver ID Display */}
          <Text style={styles.label}>Driver ID: {userId}</Text>

          {/* Vehicle Number Input (Read-only) */}
          <TextInput
            style={styles.input}
            placeholder="Fetching Vehicle Number..."
            value={vehicleNumber || ""}
            editable={false}
          />

          {/* Image Picker Button */}
          <Button title="Pick BILL Image" onPress={pickBillImage} />

          {/* Show Selected Image URI or Placeholder */}
          <Text style={styles.fileName}>
            {billImage ? `Selected Image: ${billImage.uri}` : "No image selected"}
          </Text>

          {/* Show Location or Placeholder */}
          <Text style={styles.location}>
            {location
              ? `Location: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
              : "Fetching location..."}
          </Text>

          {/* Submit Button - Disabled if data is missing */}
          <Button
            title="Submit Bill Receipt"
            onPress={submitBILL}
            disabled={!vehicleNumber || !billImage || !location}
          />
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => setShowDirections(prev => !prev)}>
          <Text style={styles.footerText}>{showDirections ? 'Hide Directions' : 'Show Directions'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navbar: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#6200ea' },
  navText: { color: 'white', fontSize: 16 },
  navTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  card: { padding: 15, margin: 10, backgroundColor: '#fff', borderRadius: 10, elevation: 4 },
  mapContainer: { flex: 1 },
  markerImage: { width: 40, height: 40, resizeMode: 'contain' },
  arrivedButton: { backgroundColor: 'green', padding: 15, borderRadius: 10, alignItems: 'center', margin: 10 },
  arrivedText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  footer: { padding: 15, alignItems: 'center', backgroundColor: '#6200ea' },
  footerText: { color: 'white', fontSize: 16 },
  card: { padding: 15, margin: 10, backgroundColor: '#fff', borderRadius: 10, elevation: 4 },
});
