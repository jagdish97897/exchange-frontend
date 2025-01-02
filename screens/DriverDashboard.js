import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView, Platform, Keyboard
} from "react-native";

import { AntDesign, Feather, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { getSocket, closeSocket } from './SocketIO.js';


export default ({ route }) => {

    const { phoneNumber, token, userId } = route.params;
    const [menuVisible, setMenuVisible] = useState(false);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);


    const navigation = useNavigation();

    useEffect(() => {
        const socketInstance = getSocket();
        setSocket(socketInstance);

        return () => {
            closeSocket(); // Disconnect socket on unmount
        };
    }, []);

    // useEffect(() => {
    //     const socketInstance = getSocket();

    //     setSocket(socketInstance);

    //     socket.on("newMessage", (message) => {
    //         console.log("Message from server:", message);
    //     });

    //     return () => {
    //         closeSocket(); // Disconnect socket on unmount
    //     };
    // }, [token]);

    // Fetch trip history from the API
    useEffect(() => {
        let isMounted = true;

        const fetchTrips = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://192.168.1.3:8000/api/trips/history', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (isMounted && response.data.trips?.length) {
                    setTrips(response.data.trips);
                }
            } catch (error) {
                console.error('Error fetching trip history:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (token) {
            fetchTrips();
        }

        return () => {
            isMounted = false;
        };
    }, [token]);

    // Listen for new trips via Socket.IO
    useEffect(() => {
        const handleNewTrip = (newTrip) => {
            setTrips((previousTrips) => {
                // Ensure no duplicates
                if (!previousTrips.find((trip) => trip._id === newTrip._id)) {
                    return [...previousTrips, newTrip];
                }
                return previousTrips;
            });
        };

        if (socket) {
            socket.on('newTrip', handleNewTrip);

            // Cleanup listener on unmount
            return () => {
                socket.off('newTrip', handleNewTrip);
            };
        }
        // Cleanup listener on unmount

    }, [socket, trips]);

    // socket.on("newMessage", (message) => {
    //     console.log("Message from server:", message);
    // });

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };


    const handleReject = (tripId) => {
        console.log('Reject Trip:', tripId);
        // Implement reject functionality
    };

    const handleView = async (trip) => {
        try {
            // const response = await axios.get(`http://192.168.1.3:8000/api/trips/${tripId}`, {
            //     headers: { Authorization: `Bearer ${token} ` },
            // });
            // const tripDetails = response.data.trip;
            // navigation.navigate('TripDetails', { trip: tripDetails, socket });
            navigation.navigate('TripDetails', { trip, socket, phoneNumber });

        } catch (error) {
            console.error('Error fetching trip details:', error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, marginTop: 40 }}>
                    <SafeAreaView style={styles.container}>
                        <Text style={styles.title}>Trip History</Text>

                        {loading && trips.length === 0 ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <ScrollView style={styles.tripList}>
                                {trips.map((trip) => (
                                    <View key={trip.tripId} style={styles.tripCard}>
                                        <Text style={styles.tripDetail}>
                                            <Text style={styles.label}>From:</Text> {trip.from}
                                        </Text>
                                        <Text style={styles.tripDetail}>
                                            <Text style={styles.label}>To:</Text> {trip.to}
                                        </Text>
                                        {/* <Text style={styles.tripDetail}>
                                            <Text style={styles.label}>Phone Number:</Text> {trip.phoneNumber}
                                        </Text> */}
                                        <Text style={styles.tripDetail}>
                                            <Text style={styles.label}>Date:</Text>{' '}
                                            {new Date(trip.tripDate).toLocaleString()}
                                        </Text>
                                        <Text style={styles.tripDetail}>
                                            <Text style={styles.label}>Payload Cost:</Text>{' '}
                                            {trip.cargoDetails.quotePrice}
                                        </Text>

                                        {/* Action Buttons */}
                                        <View style={styles.actionButtons}>
                                            <TouchableOpacity onPress={() => handleView(trip)}>
                                                <Feather
                                                    name="eye"
                                                    size={24}
                                                    color="blue"
                                                    style={styles.icon}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => handleReject(trip.tripId)}
                                            >
                                                <Entypo
                                                    name="circle-with-cross"
                                                    size={24}
                                                    color="orange"
                                                    style={styles.icon}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        )}
                    </SafeAreaView>

                    {/* Bottom Navigation */}
                    <View style={styles.bottomNav}>
                        <TouchableOpacity>
                            <AntDesign name="home" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shopButton}>
                            <Entypo name="shop" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Profile', { phoneNumber })}
                        >
                            <AntDesign name="user" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );

    // return (
    //     <TouchableWithoutFeedback onPress={toggleMenu}>
    //         <View style={{ flex: 1, marginTop: 40 }}>
    //             <SafeAreaView style={styles.container}>
    //                 <Text style={styles.title}>Trip History</Text>

    //                 {loading && trips.length === 0 ? (
    //                     <ActivityIndicator size="large" color="#0000ff" />
    //                 ) : (
    //                     <ScrollView style={styles.tripList}>
    //                         {trips.map((trip) => (
    //                             <View key={trip.message.tripId} style={styles.tripCard}>
    //                                 <Text style={styles.tripDetail}>
    //                                     <Text style={styles.label}>From:</Text> {trip.message.from}
    //                                 </Text>
    //                                 <Text style={styles.tripDetail}>
    //                                     <Text style={styles.label}>To:</Text> {trip.message.to}
    //                                 </Text>
    //                                 <Text style={styles.tripDetail}>
    //                                     <Text style={styles.label}>Date:</Text> {new Date(trip.message.tripDate).toLocaleString()}
    //                                 </Text>
    //                                 <Text style={styles.tripDetail}>
    //                                     <Text style={styles.label}>Payload Cost:</Text> {trip.message.quotePrice}
    //                                 </Text>

    //                                 {/* Action Buttons */}
    //                                 <View style={styles.actionButtons}>
    //                                     <TouchableOpacity onPress={() => handleView(trip.message.tripId)}>
    //                                         <Feather name="eye" size={24} color="blue" style={styles.icon} />
    //                                     </TouchableOpacity>
    //                                     <TouchableOpacity onPress={() => handleReject(trip.message.tripId)}>
    //                                         <Entypo name="circle-with-cross" size={24} color="orange" style={styles.icon} />
    //                                     </TouchableOpacity>
    //                                 </View>
    //                             </View>
    //                         ))}
    //                     </ScrollView>
    //                 )}
    //             </SafeAreaView>

    //             {/* Bottom Navigation */}
    //             <View style={styles.bottomNav}>
    //                 <TouchableOpacity>
    //                     <AntDesign name="home" size={24} color="white" />
    //                 </TouchableOpacity>
    //                 <TouchableOpacity style={styles.shopButton}>
    //                     <Entypo name="shop" size={24} color="white" />
    //                 </TouchableOpacity>
    //                 <TouchableOpacity onPress={() => navigation.navigate('Profile', { phoneNumber })}>
    //                     <AntDesign name="user" size={24} color="white" />
    //                 </TouchableOpacity>
    //             </View>
    //         </View>
    //     </TouchableWithoutFeedback>
    // );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
    },
    tripList: {
        marginTop: 10,
    },
    tripCard: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
    },
    tripDetail: {
        fontSize: 8,
        marginBottom: 4,
    },
    label: {
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 6,
    },
    icon: {
        marginHorizontal: 10,
    },
    bottomNav: {
        backgroundColor: 'black',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 10,
        paddingTop: 10,
    },
    shopButton: {
        backgroundColor: 'blue',
        borderRadius: 24,
        padding: 10,
    },
});

