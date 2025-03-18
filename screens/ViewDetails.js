import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert, ScrollView, SafeAreaView, TouchableOpacity, Modal, Image, TextInput } from 'react-native';
import {  useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker } from 'react-native-maps';
import Ind from '../assets/images/image 10.png';
import io from 'socket.io-client';
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { API_END_POINT } from '../app.config';

const socket = io('http://192.168.1.6:8000');

const getCoordinatesFromPincode = async (pincode) => {
    const apiKey = "AIzaSyAI0jFdBsZoRP00RGq050nfe24aSfj1mwo";
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

const ViewDetails = ({ route }) => {
    const { tripId, status } = route.params;
    const [tripDetails, setTripDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editedTrip, setEditedTrip] = useState(null); 
    const [userId, setUserId] = useState(null);
    const [pickupCords, setPickupCords] = useState(null);
    const [dropLocationCords, setDropLocationCords] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const [tripGRImages, setTripGRImages] = useState([]);
    const [tripBillImages, setTripBillImages] = useState([]);
    const navigation = useNavigation();
    
    const apiEndpoint = `${API_END_POINT}/api/trips/${tripId}`;

    // Fetch trip details
    const fetchTripDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(apiEndpoint);
            if (response.status === 200) {
                setTripDetails({...response.data.trip,transactions:response.data.transactions});
                console.log('response.data.trip', response.data.trip);
                setEditedTrip(response.data.trip);
            }
        } catch (error) {
            console.error('Error fetching trip details:', error);
            Alert.alert('Error', 'Failed to fetch trip details');
        } finally {
            setLoading(false);
        }
    }, [apiEndpoint]);

    // Reload trip details when the screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchTripDetails();
        }, [fetchTripDetails])
    );

    // Fetch Coordinates for Pickup & Drop Locations
    useEffect(() => {
        if (tripDetails?.from && tripDetails?.to) {
            const fetchLocations = async () => {
                const pickup = await getCoordinatesFromPincode(tripDetails.from);
                const drop = await getCoordinatesFromPincode(tripDetails.to);
                setPickupCords(pickup);
                setDropLocationCords(drop);
            };
            fetchLocations();
        }
    }, [tripDetails]);

    // Fetch driver's live location via socket
    useEffect(() => {
        if (!userId) return;

        const fetchLocation = () => {
            socket.emit('getUserLocation', { userId });
        };

        fetchLocation();
        const interval = setInterval(fetchLocation, 5000);

        const locationUpdateHandler = (data) => {
            if (data.latitude && data.longitude) {
                setDriverLocation({
                    latitude: parseFloat(data.latitude),
                    longitude: parseFloat(data.longitude),
                });
            }
        };

        socket.on('receiveUserLocation', locationUpdateHandler);
        socket.on(`locationUpdate:${userId}`, locationUpdateHandler);
        socket.on('error', (message) => Alert.alert('Error', message));

        return () => {
            clearInterval(interval);
            socket.off('receiveUserLocation', locationUpdateHandler);
            socket.off(`locationUpdate:${userId}`, locationUpdateHandler);
            socket.off('error');
        };
    }, [userId]);

    const handleSaveChanges = async () => {
        try {
            const response = await axios.patch(apiEndpoint, editedTrip, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                console.log("trip", response.data.trip)
                setTripDetails({...response.data.trip,transactions:response.data.transactions});
                Alert.alert('Success', 'Trip details updated successfully!');
                setEditModalVisible(false);
            } else {
                Alert.alert('Error', 'Failed to update trip details');
            }
        } catch (error) {
            console.error('Error saving trip details:', error);
            Alert.alert('Error', 'An error occurred while saving');
        }
    };

    const handleNavigate = async () => {
        try {
            const response = await axios.post(`${API_END_POINT}/api/trips/${tripId}/startBidding`, {});
            if (response.status === 200) {
                navigation.navigate('TripSummary', { tripId });
            }
        } catch (error) {
            console.error('Error starting bidding:', error);
            Alert.alert('Error', 'Failed to start bidding');
        }
    };


useEffect(() => {
    const fetchTripImages = async () => {
        try {
            const response = await axios.get(`http://192.168.1.6:8000/api/trips/gracceptedimage/${tripId}`);
            console.log(response.data.data[0]?.images)
            if (response.data.success) {
                setTripGRImages(response.data.data[0]?.images || []);
            }
        } catch (error) {
            console.log("Error fetching trip images:", error);
        }
    };

    fetchTripImages();
}, [tripId]);

useEffect(() => {
    const fetchTripImages = async () => {
        try {
            const response = await axios.get(`http://192.168.1.6:8000/api/trips/billacceptedimage/${tripId}`);
            console.log(response.data.data[0]?.images)
            if (response.data.success) {
                setTripBillImages(response.data.data[0]?.images || []);
            }
        } catch (error) {
            console.log("Error fetching trip images:", error);
        }
    };

    fetchTripImages();
}, [tripId]);

const downloadImage = async (imageUrl) => {
    try {
      const fileUri = FileSystem.documentDirectory + "downloaded_image.jpg";
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Downloaded", "Image saved to: " + uri);
      }
    } catch (error) {
      console.error("Error downloading image:", error);
      Alert.alert("Download Failed", "Could not download the image.");
    }
  };

    const handleStartBidding = () => {
        Alert.alert(
            'Confirmation',
            'Are you sure you want to start bidding for this trip?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Start', onPress: () => handleNavigate() },
            ]
        );
    };

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
        <LinearGradient colors={['#FFF', '#FFF']} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 40 }}>
                {tripDetails.status === 'created' && tripDetails.biddingStatus === 'notStarted' &&
                    <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>}
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                   
                    <View style={styles.card}>
                        {status == 'created' && (
                            <View style={styles.additionalInfo}>
                                <Text style={styles.detailText}>From: {tripDetails.from}</Text>
                        <Text style={styles.detailText}>To: {tripDetails.to}</Text>
                        <Text style={styles.detailText}>Cargo Type: {tripDetails?.cargoDetails?.cargoType ?? ''}</Text>
                        <Text style={styles.detailText}>Quote Price: ₹{tripDetails?.cargoDetails?.quotePrice ?? ''}</Text>
                        <Text style={styles.detailText}>
                            Trip Date: {new Date(tripDetails.tripDate).toLocaleDateString()}
                        </Text>
                        <Text style={styles.detailText}>Special Instructions: {tripDetails.specialInstruction || 'N/A'}</Text>
                        <Text style={styles.detailText}>Status: {tripDetails.status}</Text>

                              
                            </View>
                        )}

                        {status === 'inProgress' ?
                            (
                                tripDetails.biddingStatus === 'accepted' ?
                                    (
                                        
                                        <View>
                   <Text style={styles.paymentTitle}>Trip ID: {tripId}</Text>
                 <View style={styles.header}>
                  <Image
                    source={Ind}
                    style={{
                      height: 50,
                      width: 50,
                      borderRadius: 40,
                    }}
                  />
                    
                    <View>
                        <Text style={styles.driverName}>{tripDetails.bidder}</Text>
                        <Text style={styles.date}>{new Date(tripDetails.tripDate).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.phonemessage}>
                        <Icon name="phone" size={20} color="green" />
                        <Icon name="comment" size={20} color="blue" />
                    </View>
                </View>                  
                <View style={styles.locationContainer}>
    <Text style={styles.locationText}>
        <Icon name="map-marker" size={20} color="red" /> {tripDetails.from}
    </Text>
    <Icon name="arrow-right" size={25} color="black" style={styles.arrow} />
    <Text style={styles.locationText}>
        <Icon name="map-marker" size={20} color="green" /> {tripDetails.to}
    </Text>
</View>
    
            <Text style={styles.status}>Status: {status}</Text>
            
            {/* Map Display */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: pickupCords?.latitude || 20.5937,
                    longitude: pickupCords?.longitude || 78.9629,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
            >
                {/* Pickup Location Marker */}
                {pickupCords && (
                    <Marker coordinate={pickupCords} title="Pickup Location" pinColor="green" />
                )}

                {/* Drop Location Marker */}
                {dropLocationCords && (
                    <Marker coordinate={dropLocationCords} title="Drop Location" pinColor="red" />
                )}

                {/* Driver's Live Location Marker */}
                {driverLocation && (
                    <Marker coordinate={driverLocation} title="Driver Location" pinColor="blue" />
                )}
            </MapView>

            <Text style={styles.paymentTitle}>Payments</Text>
        {(tripDetails?.transactions || []).map((payment, index) => (
     <View key={index} style={styles.paymentItem}>
        <Text>Payment {index + 1} ({payment.paymentPercent}%)</Text>
        <Text style={{ color: payment.amount ? 'green' : 'red' }}>
            {payment.amount ? '✅' : '❌'}
        </Text>
     </View>
))}

   <View className="bg-white p-4 rounded-lg shadow-md">
      <Text className="text-lg font-bold text-center text-blue-700">
        Documents
      </Text>
      {tripGRImages.length > 0 ? (
        tripGRImages.map((image, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center justify-between mt-2"
            onPress={() => downloadImage(image)}
          >
            <Text className="text-gray-700 text-base">
              Goods receipt - {index + 1}
            </Text>
            <Image
              source={require("../assets/images/pdf.png")} // Your PDF icon
              style={{ width: 50, height: 50 }}
            />
          </TouchableOpacity>
        ))
      ) : (
        <Text className="text-center text-gray-500 mt-2">No documents found</Text>
      )}
    </View>

<View className="bg-white p-4 rounded-lg shadow-md">

      {tripBillImages.length > 0 ? (
        tripBillImages.map((image, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center justify-between mt-2"
            onPress={() => downloadImage(image)}
          >
            <Text className="text-gray-700 text-base">
              Bill receipt - {index + 1}
            </Text>
            <Image
              source={require("../assets/images/pdf.png")} // Your PDF icon
              style={{ width: 50, height: 50 }}
            />
          </TouchableOpacity>
        ))
      ) : (
        <Text className="text-center text-gray-500 mt-2">No documents found</Text>
      )}
    </View>

    <View style={{ padding: 20, backgroundColor: "#fff", flex: 1 }}>
      {/* Pickup & Drop */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
        Pickup & Drop
      </Text>
      <Text style={{ fontWeight: "bold", marginTop: 10 }}>Pickup Location</Text>
      <Text style={{ color: "gray" }}>
        2972 Westheimer Rd. Santa Ana, Illinois 85486
      </Text>
      <Text style={{ fontWeight: "bold", marginTop: 10 }}>Drop-Off Location</Text>
      <Text style={{ color: "gray" }}>
        4140 Parker Rd. Allentown, New Mexico 31134
      </Text>
      {/* Help Section */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>
        Help
      </Text>
      <TouchableOpacity style={{ marginTop: 10 }}>
        <Text style={{ fontWeight: "bold" }}>Report an Issue</Text>
        <Text style={{ color: "gray" }}>
          Let us know if you have a safety-related issue
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ marginTop: 15 }}>
        <Text style={{ fontWeight: "bold", color: "red" }}>Cancel Booking</Text>
        <Text style={{ color: "gray" }}>Cancel this booking</Text>
      </TouchableOpacity>
    </View>
            {/* Location Details */}
            <Text>Pickup Coordinates: {pickupCords ? `${pickupCords.latitude}, ${pickupCords.longitude}` : "Loading..."}</Text>
            <Text>Drop Coordinates: {dropLocationCords ? `${dropLocationCords.latitude}, ${dropLocationCords.longitude}` : "Loading..."}</Text>
            <Text>Driver Location: {driverLocation ? `${driverLocation.latitude}, ${driverLocation.longitude}` : "Fetching..."}</Text>
        </View>

                                    ) : (
                                        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                                            <Text style={styles.buttonText}>Back to manu</Text>
                                        </TouchableOpacity>
                                    )
                            ) : (
                                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                                    <Text style={styles.buttonText}>khela khatam</Text>
                                </TouchableOpacity>
                            )}

                        {status === 'created' ?
                            (
                                tripDetails.biddingStatus === 'notStarted' ?
                                    (
                                        <TouchableOpacity style={styles.button} onPress={handleStartBidding}>
                                            <Text style={styles.buttonText}>Start Bidding</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TripSummary', { tripId })
                                        }>
                                            <Text style={styles.buttonText}>Continue Bidding</Text>
                                        </TouchableOpacity>
                                    )
                            ) : (
                                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                                    <Text style={styles.buttonText}>Back</Text>
                                </TouchableOpacity>
                            )}
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* Modal for editing trip details */}
            <Modal visible={editModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Trip Details</Text>
                        <ScrollView>
                            <TextInput
                                style={styles.input}
                                value={editedTrip.from}
                                onChangeText={(text) => setEditedTrip({ ...editedTrip, from: text })}
                                placeholder="From"
                                keyboardType="numeric"
                                maxLength={6}
                            />
                            <TextInput
                                style={styles.input}
                                value={editedTrip.to}
                                onChangeText={(text) => setEditedTrip({ ...editedTrip, to: text })}
                                placeholder="To"
                                keyboardType="numeric"
                                maxLength={6}
                            />
                            <TextInput
                                style={styles.input}
                                value={editedTrip.cargoDetails?.cargoType || ''}
                                onChangeText={(text) =>
                                    setEditedTrip({
                                        ...editedTrip,
                                        cargoDetails: { ...editedTrip.cargoDetails, cargoType: text },
                                    })
                                }
                                placeholder="Cargo Type"
                            />
                            <TextInput
                                style={styles.input}
                                value={editedTrip.cargoDetails?.quotePrice?.toString() || ''}
                                onChangeText={(text) =>
                                    setEditedTrip({
                                        ...editedTrip,
                                        cargoDetails: { ...editedTrip.cargoDetails, quotePrice: parseFloat(text) || 0 },
                                    })
                                }
                                placeholder="Quote Price"
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={styles.input}
                                value={editedTrip.cargoDetails?.payloadWeight?.toString() || ''}
                                onChangeText={(text) =>
                                    setEditedTrip({
                                        ...editedTrip,
                                        cargoDetails: { ...editedTrip.cargoDetails, payloadWeight: parseFloat(text) || 0 },
                                    })
                                }
                                placeholder="Payload weight"
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={styles.input}
                                value={editedTrip.cargoDetails?.payloadHeight?.toString() || ''}
                                onChangeText={(text) =>
                                    setEditedTrip({
                                        ...editedTrip,
                                        cargoDetails: { ...editedTrip.cargoDetails, payloadHeight: parseFloat(text) || 0 },
                                    })
                                }
                                placeholder="Payload height"
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={styles.input}
                                value={editedTrip.cargoDetails?.payloadLength?.toString() || ''}
                                onChangeText={(text) =>
                                    setEditedTrip({
                                        ...editedTrip,
                                        cargoDetails: { ...editedTrip.cargoDetails, payloadLenght: parseFloat(text) || 0 },
                                    })
                                }
                                placeholder="Payload length"
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={styles.input}
                                value={editedTrip.cargoDetails?.payloadWidth?.toString() || ''}
                                onChangeText={(text) =>
                                    setEditedTrip({
                                        ...editedTrip,
                                        cargoDetails: { ...editedTrip.cargoDetails, payloadWidth: parseFloat(text) || 0 },
                                    })
                                }
                                placeholder="Payload width"
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={styles.input}
                                value={editedTrip.specialInstruction.toString() || ''}
                                onChangeText={(text) =>
                                    setEditedTrip({ ...editedTrip, specialInstruction: text })
                                }
                                placeholder="Special instruction"
                            />
                        </ScrollView>
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setEditModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={handleSaveChanges}>
                                <Text style={styles.modalButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        gap: 15, // Adds spacing between children
    },
    phonemessage: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10, // Space between icons
        marginLeft: 'auto', // Pushes icons to the right
    },
    driverName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 14,
        color: '#555',
    },    
    status: {
        fontSize: 16,
        marginBottom: 10,
        color: 'blue',
        textAlign: 'center',
    },
    
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    locationText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    arrow: {
        fontSize: 20,
    },
    map: {
        width: '90%', 
        height: 300,
        alignSelf: 'center',
        marginBottom: 10,
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
        color: 'gray',
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
    editButton: {
        alignSelf: 'flex-end',
        backgroundColor: '#007BFF',
        padding: 8,
        borderRadius: 4,
    },
    editButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 8,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#F5F5F5',
        padding: 8,
        borderRadius: 4,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 4,
        backgroundColor: '#007BFF',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#FF6347',
    },
    modalButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
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
    detailText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    paymentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    paymentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
});

export default ViewDetails;


// import React, { useEffect, useState, useCallback } from 'react';
// import { View, Text, ActivityIndicator, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Modal, TextInput, Alert, DatePicker } from 'react-native';
// import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { getCurrentDate } from './CargoDetails';
// import axios from 'axios';
// import { API_END_POINT } from '../app.config';

// const ViewDetails = ({ route }) => {
//     const { tripId, status } = route.params;
//     const [tripDetails, setTripDetails] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [editModalVisible, setEditModalVisible] = useState(false);
//     const [editedTrip, setEditedTrip] = useState(null);
//     const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

//     const navigation = useNavigation();

//     const apiEndpoint = `${API_END_POINT}/api/trips/${tripId}`;




//     // Fetch trip details
//     const fetchTripDetails = async () => {
//         try {
//             setLoading(true);
//             const response = await axios.get(apiEndpoint);
//             if (response.status === 200) {
//                 setTripDetails(response.data.trip);
//                 setEditedTrip(response.data.trip);
//             }
//         } catch (error) {
//             console.error('Error fetching trip details:', error);
//             Alert.alert('Error', 'Failed to fetch trip details');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Reload trip details when the screen is focused
//     useFocusEffect(
//         useCallback(() => {
//             fetchTripDetails();
//         }, [])
//     );

//     const handleSaveChanges = async () => {
//         try {
//             const response = await fetch(apiEndpoint, {
//                 method: 'PATCH',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(editedTrip),
//             });
//             if (response.ok) {
//                 const updatedTrip = await response.json();
//                 // console.log('upDated trip',updatedTrip)
//                 setTripDetails(updatedTrip.trip);
//                 Alert.alert('Success', 'Trip details updated successfully!');
//                 setEditModalVisible(false);
//             } else {
//                 Alert.alert('Error', 'Failed to update trip details');
//             }
//         } catch (error) {
//             console.error('Error saving trip details:', error);
//             Alert.alert('Error', 'An error occurred while saving');
//         }
//     };

//     const handleNavigate = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.post(`${API_END_POINT}/api/trips/${tripId}/startBidding`, {});

//             if (response.status === 200) {
//                 navigation.navigate('TripSummary', { tripId })
//             }
//         } catch (error) {
//             Alert.alert('Error', 'An error occurred while start Bidding');
//             console.log('Error', error);
//         } finally {
//             setLoading(false)
//         }

//     };

//     console.log('tripId', tripId);


//     const handleStartBidding = () => {
//         Alert.alert(
//             'Confirmation',
//             'Are you sure you want to start bidding for this trip?',
//             [
//                 { text: 'Cancel', style: 'cancel' },
//                 { text: 'Start', onPress: () => handleNavigate() },
//             ]
//         );
//     };

//     if (!tripDetails) {
//         return (
//             <View style={styles.noDetailsContainer}>
//                 <Text style={styles.noDetailsText}>No trip details available</Text>
//             </View>
//         );
//     }

//     return (
//         <LinearGradient colors={['#06264D', '#FFF']} style={{ flex: 1 }}>
//             <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 40 }}>
//                 {tripDetails.status === 'created' && tripDetails.biddingStatus === 'notStarted' &&
//                     <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
//                         <Text style={styles.editButtonText}>Edit</Text>
//                     </TouchableOpacity>}

//                 <ScrollView contentContainerStyle={styles.scrollContainer}>
//                     <Text style={styles.title}>Trip Details</Text>

//                     <View style={styles.card}>
//                         <Text style={styles.detailText}>From: {tripDetails.from}</Text>
//                         <Text style={styles.detailText}>To: {tripDetails.to}</Text>
//                         <Text style={styles.detailText}>Cargo Type: {tripDetails.cargoDetails.cargoType}</Text>
//                         <Text style={styles.detailText}>Quote Price: ₹{tripDetails.cargoDetails.quotePrice}</Text>
//                         <Text style={styles.detailText}>
//                             Trip Date: {new Date(tripDetails.tripDate).toLocaleDateString()}
//                         </Text>
//                         <Text style={styles.detailText}>Special Instructions: {tripDetails.specialInstruction || 'N/A'}</Text>
//                         <Text style={styles.detailText}>Status: {tripDetails.status}</Text>

//                         {status !== 'created' && (
//                             <View style={styles.additionalInfo}>
//                                 <Text style={styles.detailText}>Vehicle Number: {tripDetails.vehicleNumber}</Text>
//                                 <Text style={styles.detailText}>Driver Details: {tripDetails.bidder || 'N/A'}</Text>
//                                 <Text style={styles.detailText}>Pickup Address: {tripDetails.pickupAddress || 'N/A'}</Text>
//                                 <Text style={styles.detailText}>Dropoff Address: {tripDetails.pickupAddress || 'N/A'}</Text>
//                             </View>
//                         )}

//                         {status === 'inProgress' ?
//                             (
//                                 tripDetails.biddingStatus === 'accepted' ?
//                                     (
//                                         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DriverLocation', { userId: tripDetails.bidder, from: tripDetails.from, to: tripDetails.to })}>
//                                             <Text style={styles.buttonText}>View Driver Location</Text>
//                                         </TouchableOpacity>
//                                     ) : (
//                                         <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
//                                             <Text style={styles.buttonText}>Back to manu</Text>
//                                         </TouchableOpacity>
//                                     )
//                             ) : (
//                                 <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
//                                     <Text style={styles.buttonText}>Back</Text>
//                                 </TouchableOpacity>
//                             )}

//                         {status === 'created' ?
//                             (
//                                 tripDetails.biddingStatus === 'notStarted' ?
//                                     (
//                                         <TouchableOpacity
//                                             style={styles.button}
//                                             onPress={handleStartBidding}
//                                             disabled={loading}>
//                                             {loading ? (
//                                                 <ActivityIndicator size="small" color="#FFF" />
//                                             ) : (
//                                                 <Text style={styles.buttonText}>Start Bidding</Text>
//                                             )}
//                                         </TouchableOpacity>
//                                     ) : (
//                                         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TripSummary', { tripId })
//                                         }>
//                                             <Text style={styles.buttonText}>Continue Bidding</Text>
//                                         </TouchableOpacity>
//                                     )
//                             ) : (
//                                 <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
//                                     <Text style={styles.buttonText}>Back</Text>
//                                 </TouchableOpacity>
//                             )}
//                     </View>
//                 </ScrollView>
//             </SafeAreaView>

//             <Modal visible={!!editedTrip && editModalVisible} animationType="slide" transparent={true}>
//                 <View style={styles.modalContainer}>
//                     {editedTrip && (
//                         <View style={styles.modalContent}>
//                             <Text style={styles.modalTitle}>Edit Trip Details</Text>
//                             <ScrollView>
//                                 <TextInput
//                                     style={styles.input}
//                                     value={editedTrip.from || ''}
//                                     onChangeText={(text) => setEditedTrip({ ...editedTrip, from: text })}
//                                     placeholder="From"
//                                     keyboardType="numeric"
//                                     maxLength={6}
//                                 />
//                                 <TextInput
//                                     style={styles.input}
//                                     value={editedTrip.to || ''}
//                                     onChangeText={(text) => setEditedTrip({ ...editedTrip, to: text })}
//                                     placeholder="To"
//                                     keyboardType="numeric"
//                                     maxLength={6}
//                                 />
//                                 <TextInput
//                                     style={styles.input}
//                                     value={editedTrip.cargoDetails?.cargoType || ''}
//                                     onChangeText={(text) =>
//                                         setEditedTrip({
//                                             ...editedTrip,
//                                             cargoDetails: { ...editedTrip.cargoDetails, cargoType: text },
//                                         })
//                                     }
//                                     placeholder="Cargo Type"
//                                 />
//                                 <TextInput
//                                     style={styles.input}
//                                     value={editedTrip.cargoDetails?.quotePrice?.toString() || ''}
//                                     onChangeText={(text) =>
//                                         setEditedTrip({
//                                             ...editedTrip,
//                                             cargoDetails: { ...editedTrip.cargoDetails, quotePrice: parseFloat(text) || 0 },
//                                         })
//                                     }
//                                     placeholder="Quote Price"
//                                     keyboardType="numeric"
//                                 />
//                                 <TextInput
//                                     style={styles.input}
//                                     value={editedTrip.cargoDetails?.payloadWeight?.toString() || ''}
//                                     onChangeText={(text) =>
//                                         setEditedTrip({
//                                             ...editedTrip,
//                                             cargoDetails: { ...editedTrip.cargoDetails, payloadWeight: parseFloat(text) || 0 },
//                                         })
//                                     }
//                                     placeholder="Payload weight"
//                                     keyboardType="numeric"
//                                 />
//                                 <TextInput
//                                     style={styles.input}
//                                     value={editedTrip.cargoDetails?.payloadHeight?.toString() || ''}
//                                     onChangeText={(text) =>
//                                         setEditedTrip({
//                                             ...editedTrip,
//                                             cargoDetails: { ...editedTrip.cargoDetails, payloadHeight: parseFloat(text) || 0 },
//                                         })
//                                     }
//                                     placeholder="Payload height"
//                                     keyboardType="numeric"
//                                 />
//                                 <TextInput
//                                     style={styles.input}
//                                     value={editedTrip.cargoDetails?.payloadLength?.toString() || ''}
//                                     onChangeText={(text) =>
//                                         setEditedTrip({
//                                             ...editedTrip,
//                                             cargoDetails: { ...editedTrip.cargoDetails, payloadLength: parseFloat(text) || 0 },
//                                         })
//                                     }
//                                     placeholder="Payload length"
//                                     keyboardType="numeric"
//                                 />
//                                 <TextInput
//                                     style={styles.input}
//                                     value={editedTrip.cargoDetails?.payloadWidth?.toString() || ''}
//                                     onChangeText={(text) =>
//                                         setEditedTrip({
//                                             ...editedTrip,
//                                             cargoDetails: { ...editedTrip.cargoDetails, payloadWidth: parseFloat(text) || 0 },
//                                         })
//                                     }
//                                     placeholder="Payload width"
//                                     keyboardType="numeric"
//                                 />
//                                 <TextInput
//                                     style={styles.input}
//                                     value={editedTrip.specialInstruction?.toString() || ''}
//                                     onChangeText={(text) =>
//                                         setEditedTrip({ ...editedTrip, specialInstruction: text })
//                                     }
//                                     placeholder="Special instruction"
//                                 />
//                             </ScrollView>
//                             <View style={styles.modalActions}>
//                                 <TouchableOpacity
//                                     style={[styles.modalButton, styles.cancelButton]}
//                                     onPress={() => setEditModalVisible(false)}
//                                 >
//                                     <Text style={styles.modalButtonText}>Cancel</Text>
//                                 </TouchableOpacity>
//                                 <TouchableOpacity
//                                     style={styles.modalButton}
//                                     onPress={handleSaveChanges}
//                                     disabled={loading}
//                                 >
//                                     {loading ? (
//                                         <ActivityIndicator size="small" color="#FFF" />
//                                     ) : (
//                                         <Text style={styles.modalButtonText}>Save</Text>
//                                     )}
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                     )}
//                 </View>
//             </Modal>
//         </LinearGradient>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//     },
//     scrollContainer: {
//         paddingBottom: 20,
//     },
//     loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     noDetailsContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     noDetailsText: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#FF6347',
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 16,
//         textAlign: 'center',
//     },
//     card: {
//         backgroundColor: '#FFF',
//         padding: 16,
//         borderRadius: 8,
//         shadowColor: '#000',
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//     },
//     detailText: {
//         fontSize: 16,
//         marginBottom: 8,
//         color: '#333',
//     },
//     additionalInfo: {
//         marginTop: 16,
//         paddingTop: 8,
//         borderTopWidth: 1,
//         borderTopColor: '#E0E0E0',
//     },
//     button: {
//         marginTop: 20,
//         backgroundColor: '#007BFF',
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderRadius: 4,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: '#FFF',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     editButton: {
//         alignSelf: 'flex-end',
//         backgroundColor: '#007BFF',
//         padding: 8,
//         borderRadius: 4,
//     },
//     editButtonText: {
//         color: '#FFF',
//         fontWeight: 'bold',
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     modalContent: {
//         width: '90%',
//         backgroundColor: '#FFF',
//         padding: 16,
//         borderRadius: 8,
//         elevation: 5,
//     },
//     modalTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 16,
//         textAlign: 'center',
//     },
//     input: {
//         backgroundColor: '#F5F5F5',
//         padding: 8,
//         borderRadius: 4,
//         marginBottom: 12,
//         borderWidth: 1,
//         borderColor: '#E0E0E0',
//     },
//     modalActions: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 16,
//     },
//     modalButton: {
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderRadius: 4,
//         backgroundColor: '#007BFF',
//         alignItems: 'center',
//     },
//     cancelButton: {
//         backgroundColor: '#FF6347',
//     },
//     modalButtonText: {
//         color: '#FFF',
//         fontWeight: 'bold',
//     },
//     noDetailsContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     noDetailsText: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#FF6347',
//     },
//     detailText: {
//         fontSize: 16,
//         marginBottom: 8,
//         color: '#333',
//     },
// });

// export default ViewDetails;