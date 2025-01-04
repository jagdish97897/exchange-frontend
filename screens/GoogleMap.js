import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, View, Button, Alert, TouchableOpacity, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

export const getCurrentLocationCoordinates = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
    }

    const location = await Location.getCurrentPositionAsync({});

    return location.coords;
}

const GoogleMap = () => {
    const [fromPin, setFromPin] = useState("");
    const [toPin, setToPin] = useState("");
    const [routeData, setRouteData] = useState(null);
    const [GOOGLE_MAPS_API_KEY, setGOOGLE_MAPS_API_KEY] = useState(null);

    useEffect(() => {
        const fetchApiKey = async () => {
            try {
                const response = await axios.get(`http://192.168.1.4:8000/api/googleApiKey`);
                const apiKey = response.data; // Assuming the API key is in the response body
                // console.log(apiKey);
                // console.log(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY);

                if (apiKey) {
                    setGOOGLE_MAPS_API_KEY(apiKey);
                }
            } catch (error) {
                console.error("Error fetching the Google Maps API key:", error);
            }
        };

        fetchApiKey();
    }, []);

    // Fetch current location
    const getCurrentLocation = async (setPinCallback) => {
        try {
            const { latitude, longitude } = await getCurrentLocationCoordinates();

            // console.log('latitude : ', latitude, ' longitude: ', longitude);

            if (latitude && longitude) {

                // Reverse geocoding to get PIN code
                const response = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=
                ${GOOGLE_MAPS_API_KEY}`
                );
                const data = await response.json();

                if (data) {
                    const pin = data.results.find((result) =>
                        result.types.includes("postal_code")
                    )?.address_components[0].long_name;

                    if (pin) {
                        setPinCallback(pin);
                    } else {
                        Alert.alert("Error", "Unable to fetch PIN code from location.");
                    }
                }
            }

        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to fetch current location.");
        }
    };

    const fetchRoute = async () => {
        if (!fromPin || !toPin) {
            Alert.alert("Error", "Please enter both PIN codes.");
            return;
        }

        try {
            const response = await fetch("http://192.168.1.4:8000/api/location", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fromPin, toPin }),
            });

            const data = await response.json();
            // console.log(data.route);
            if (data.success) {
                setRouteData(data.route);
            } else {
                Alert.alert("Error", data.message || "Failed to fetch route.");
            }
        } catch (error) {
            Alert.alert("Error", "Unable to connect to the server.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="From PIN"
                    keyboardType="numeric"
                    value={fromPin}
                    onChangeText={setFromPin}
                />
                <TouchableOpacity
                    style={styles.currentLocationButton}
                    onPress={() => getCurrentLocation(setFromPin)}
                >
                    <Text style={styles.currentLocationText}>Use Current Location</Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="To PIN"
                    keyboardType="numeric"
                    value={toPin}
                    onChangeText={setToPin}
                />
                <TouchableOpacity
                    style={styles.currentLocationButton}
                    onPress={() => getCurrentLocation(setToPin)}
                >
                    <Text style={styles.currentLocationText}>Use Current Location</Text>
                </TouchableOpacity>

                <Button title="Get Route" onPress={fetchRoute} />
            </View>

            {routeData && (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: routeData.initialRegion.latitude,
                        longitude: routeData.initialRegion.longitude,
                        latitudeDelta: routeData.initialRegion.latitudeDelta,
                        longitudeDelta: routeData.initialRegion.longitudeDelta,
                    }}
                >
                    {/* Start Marker */}
                    <Marker
                        coordinate={{
                            latitude: routeData.startLocation.lat,
                            longitude: routeData.startLocation.lng,
                        }}
                        title="From"
                        description="I are here"
                        pinColor="green" // Change marker color (if no image is used)
                    />

                    <Marker
                        coordinate={{
                            latitude: 26.8946744,
                            longitude: 78.71084325,
                        }}
                        title="From"
                        description="I are here"
                    />

                    <Marker
                        coordinate={{
                            latitude: 24.8946744,
                            longitude: 78.71084325,
                        }}
                        title="From"
                        description="I are here"
                    />

                    {/* End Marker */}
                    <Marker
                        coordinate={{
                            latitude: routeData.endLocation.lat,
                            longitude: routeData.endLocation.lng,
                        }}
                        title="To"
                        description="Driver are here"
                    />

                    {/* Route Polyline */}
                    <Polyline
                        coordinates={routeData.path.map((point) => ({
                            latitude: point.latitude,
                            longitude: point.longitude,
                        }))}
                        strokeWidth={2}
                        strokeColor="black"
                    />
                </MapView>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    inputContainer: { padding: 20 },
    input: { borderBottomWidth: 1, marginBottom: 10, padding: 8 },
    currentLocationButton: {
        backgroundColor: "#007BFF",
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
    },
    currentLocationText: { color: "#FFF", textAlign: "center" },
    map: { flex: 1 },
});

export default GoogleMap;