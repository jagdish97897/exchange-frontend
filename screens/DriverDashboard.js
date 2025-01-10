import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView, Platform, Keyboard, Modal, Button,
    RefreshControl
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign, Feather, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { getSocket, closeSocket } from './SocketIO.js';
import { API_END_POINT } from '../app.config';
import { BackHandler } from 'react-native';
// import { SocketContext } from '../SocketContext.js';

export default ({ route }) => {
    const { phoneNumber, token, userId } = route.params;
    const [menuVisible, setMenuVisible] = useState(false);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [refreshing, setRefreshing] = useState(false); // Refresh state
    const [showExitOptions, setShowExitOptions] = useState(false);
    const [bidAccepted, setBidAccepted] = useState(false);


    const navigation = useNavigation();
    // const { socket } = useContext(SocketContext);

    useEffect(() => {
        const socketInstance = getSocket();
        setSocket(socketInstance);

        // return () => {
        //     closeSocket(); // Disconnect socket on unmount
        // };
    }, []);

    useFocusEffect(
        useCallback(() => {
            let isMounted = true;

            // Refresh trips when screen gains focus
            const refreshTrips = async () => {
                if (token) {
                    await fetchTrips(isMounted);
                }
            };

            refreshTrips();

            return () => {
                isMounted = false;
            };
        }, [token])
    );

    const fetchTrips = async (isMounted) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_END_POINT}/api/trips/history/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.bidAccepted) {
                setBidAccepted(response.data.bidAccepted);
            } else if (isMounted && response.data.trips?.length) {
                // Add a timer for each trip
                const tripsWithTimers = response.data.trips.map((trip) => ({
                    ...trip,
                    timer: getRemainingTime(new Date(trip.biddingStartTime)),
                }));
                // console.log('tripsWithTimers', tripsWithTimers)
                setTrips(tripsWithTimers);
            }
        } catch (error) {
            if (error.response) {
                // Alert.alert('Error:', error.response.data.message);
                console.log('Error:', error.response.data.message);
            }

        } finally {
            if (isMounted) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        let isMounted = true;

        if (token) {
            fetchTrips(isMounted);
        }

        return () => {
            isMounted = false;
        };
    }, [token]);



    useEffect(() => {
        const interval = setInterval(() => {
            setTrips((previousTrips) => {
                let expiredFound = false; // Flag to detect an expired trip

                const updatedTrips = previousTrips.map((trip) => {
                    const remainingTime = getRemainingTime(new Date(trip.biddingStartTime));

                    if (remainingTime === 'Expired') {
                        expiredFound = true; // Set flag if expired is found
                    }

                    return {
                        ...trip,
                        timer: remainingTime,
                    };
                });

                // If an expired timer is found, fetch the updated trips
                if (expiredFound) {
                    fetchTrips(true); // Call fetchTrips with `true` to indicate the component is still mounted
                }

                return updatedTrips;
            });
        }, 1000);

        return () => clearInterval(interval); // Clear interval on component unmount
    }, []);


    const getRemainingTime = (biddingStartTime) => {
        const now = new Date();
        const expirationTime = new Date(biddingStartTime.getTime() + 30 * 60 * 1000); // 5 minutes from creation
        const difference = expirationTime - now;

        if (difference <= 0) {
            return 'Expired';
        }
        const minutes = Math.floor(difference / 60000);
        const seconds = Math.floor((difference % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    const handleReject = (tripId) => {
        console.log('Reject Trip:', tripId);
    };

    const handleView = async (tripId) => {
        console.log('tripId', tripId);
        try {
            navigation.navigate('TripDetails', { tripId, phoneNumber });
        } catch (error) {
            console.error('Error fetching trip details:', error);
        }
    };

    const handleNewTrip = ({ sender, message }) => {
        setTrips((previousData) => [
            ...previousData,
            { sender, message },
        ]);
        console.log('sender', sender, 'message', message);
    };

    useEffect(() => {
        const handleFetchTrips = async () => {
            console.log('newTripEvent Received');
            await fetchTrips(true);
        };

        if (socket) {
            // Clean up any previous listener
            socket.off('newTrip', handleFetchTrips);

            // Register the event listener
            socket.on('newTrip', handleFetchTrips);

            return () => {
                socket.off('newTrip', handleFetchTrips);
            };
        }
    }, [socket]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchTrips(true); // Fetch trips during refresh
        setRefreshing(false);
    };

    const handleCloseApp = () => {
        BackHandler.exitApp();
    };

    useFocusEffect(
        React.useCallback(() => {
            if (route.name === 'DriverDashboard') {
                const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                    setShowExitOptions(true); // Show modal when back is pressed
                    return true; // Prevent default back button behavior
                });

                return () => backHandler.remove(); // Cleanup listener on unmount
            }
        }, [route]) // Re-run effect when the route changes
    );



    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, marginTop: 40 }}>
                    <SafeAreaView style={styles.container}>
                        <View style={styles.header}>
                            <Text style={styles.headerText}>Dashboard</Text>
                            <Text
                                onPress={() => navigation.navigate('TripScreen1', { userId })}
                                style={styles.headerLink}
                            >
                                Trips
                            </Text>
                        </View>

                        <Text style={styles.title}>Trip History</Text>

                        {loading && trips.length === 0 ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            bidAccepted ?
                                <Text style={styles.bidAcceted}>Thank you ! You have accepted a bid. Continue your journey safely!</Text>
                                :
                                <ScrollView
                                    style={styles.tripList}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={handleRefresh}
                                        />
                                    }
                                >
                                    {trips.map((trip) => (
                                        <View key={trip._id} style={styles.tripCard}>
                                            <Text style={styles.tripDetail}>
                                                <Text style={styles.label}>From:</Text> {trip.from}
                                            </Text>
                                            <Text style={styles.tripDetail}>
                                                <Text style={styles.label}>To:</Text> {trip.to}
                                            </Text>
                                            <Text style={styles.tripDetail}>
                                                <Text style={styles.label}>Date:</Text>{' '}
                                                {new Date(trip.tripDate).toLocaleString()}
                                            </Text>
                                            <Text style={styles.tripDetail}>
                                                <Text style={styles.label}>Payload Cost:</Text>{' '}
                                                {trip.cargoDetails.quotePrice}
                                            </Text>

                                            <View style={styles.timerContainer}>
                                                <Text style={styles.timer}>{trip.timer}</Text>
                                            </View>

                                            <View style={styles.actionButtons}>
                                                <TouchableOpacity onPress={() => handleView(trip._id)}>
                                                    <Feather
                                                        name="eye"
                                                        size={24}
                                                        color="blue"
                                                        style={styles.icon}
                                                    />
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => handleReject(trip._id)}>
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

                    {/* Modal for exit options */}
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
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    exitText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
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
    timerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    timer: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'red',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#e3f2fd',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerLink: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'blue',
    },
    bidAcceted: {
        fontSize: 18, // Slightly larger text for readability
        fontWeight: 'bold', // Bold to emphasize importance
        textAlign: 'center', // Center-align text for balance
        color: '#4CAF50', // A calming green color (symbolizing safety)
        paddingHorizontal: 20, // Padding for better alignment
        marginVertical: 15, // Space above and below
        lineHeight: 25, // Space between lines for better readability
    }
});