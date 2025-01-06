

import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, Text, StyleSheet, View, Image, Keyboard, TextInput, TouchableOpacity, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { API_ENd_POINT } from '../app.config';

export default function TripDetails({ route }) {
    const { tripId, socket, phoneNumber } = route.params;
    const [counterPrice, setCounterPrice] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [user, setUser] = useState(null);
    const [accepted, setAccepted] = useState(false);
    const [acceptButtonVisible, setAcceptButtonVisible] = useState(false);
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(false);

    let isMounted = true;

    const fetchTrips = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_ENd_POINT}/api/trips/${tripId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (isMounted && response.data.trip) {
                setTrip(response.data.trip);
            }
        } catch (error) {
            console.error('Error fetching trip history:', error);
        } finally {
            if (isMounted) {
                setLoading(false);
                console.log('Trips : ', trip);
            }
        }
    };

    useEffect(() => {
        fetchTrips();

        return () => {
            isMounted = false;
        };
    }, []);
    // console.log('socket', socket.fetchSockets());

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                if (!phoneNumber) return; // Guard clause to prevent unnecessary API calls.

                const response = await axios.get(`${API_ENd_POINT}/api/v1/users/${phoneNumber}`);
                setUser(response.data); // Set the user state with the fetched data.
            } catch (error) {
                console.error("Error fetching user info:", error.message); // Log or handle the error.
            }
        };

        fetchUserInfo();
    }, [phoneNumber]);

    const handleSubmit = async () => {
        try {
            const response = await axios.patch(`${API_ENd_POINT}/api/trips/counterPrice`,
                { counterPrice, userId: user._id, tripId: trip._id }
            );

            if (response.status === 200) {
                Alert.alert('Update', 'Counter Price submitted successfully');
                setAcceptButtonVisible(true);
                setTrip(response.data.trip);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleBidReject = () => { };

    const handleBidAccept = async () => {
        await axios.patch(`${API_ENd_POINT}/api/trips/status`, {
        });
    };

    useEffect(() => {
        socket.on('rebidPrice', (rebidPriceInfo) => {
            setAcceptButtonVisible(true);
        })
    }
        , [socket])

    return (
        <LinearGradient colors={['#06264D', '#FFF']} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 40 }}>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    contentContainerStyle={styles.container}
                    scrollEnabled={true}
                    enableAutomaticScroll={true}
                    enableOnAndroid={true}
                    extraScrollHeight={100}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <Text style={styles.title}>Trip Details</Text>
                    <View style={styles.card}>
                        {/* <Text style={styles.detail}>
                            <Text style={styles.label}>From: </Text> {trip.user}
                        </Text> */}
                        <Text style={styles.detail}>
                            <Text style={styles.label}>From: </Text> {trip.from}
                        </Text>
                        <Text style={styles.detail}>
                            <Text style={styles.label}>To: </Text> {trip.to}
                        </Text>
                        <Text style={styles.detail}>
                            <Text style={styles.label}>Date: </Text> {new Date(trip.tripDate).toLocaleString()}
                        </Text>
                        <Text style={styles.detail}>
                            <Text style={styles.label}>Cargo Type: </Text> {trip.cargoDetails.cargoType}
                        </Text>
                        <Text style={styles.detail}>
                            <Text style={styles.label}>Payload Weight: </Text> {trip.cargoDetails.payloadWeight}
                        </Text>
                        <Text style={styles.detail}>
                            <Text style={styles.label}>Payload Dimensions (LxWxH): </Text>
                            {trip.cargoDetails.payloadLength} x {trip.cargoDetails.payloadWidth} x{' '}
                            {trip.cargoDetails.payloadHeight}
                        </Text>
                        <Text style={styles.detail}>
                            <Text style={styles.label}>Status: </Text> {trip.status}
                        </Text>
                        <Text style={styles.detail}>
                            <Text style={styles.label}>Quote Price: </Text> {trip.cargoDetails.quotePrice}
                        </Text>

                        {trip?.bids?.length > 0 && trip.bids.map((bid, index) => (
                            <Text style={styles.detail}>{bid.role === 'consumer' ? 'Revised Price:' : 'Counter Price:'}  {bid.user && (
                                <Text style={styles.label}>  ₹{bid.price || 'N/A'}</Text>
                            )}
                            </Text>
                        ))}

                        {/* Counter Price Section */}
                        {!acceptButtonVisible && (<View style={styles.counterPriceContainer}>
                            <Text style={styles.label}>Counter Price: </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Counter Price"
                                value={counterPrice}
                                onChangeText={(text) => setCounterPrice(text)}
                                keyboardType="numeric"
                            />
                        </View>)}

                        {/* Submit Button */}
                        {!acceptButtonVisible && <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>}

                        {/* {acceptButtonVisible &&
                            <view>
                                <TouchableOpacity style={styles.button} onPress={handleBidAccept}>
                                    <Text style={styles.buttonText}>Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={handleBidReject}>
                                    <Text style={styles.buttonText}>Reject</Text>
                                </TouchableOpacity>
                            </view>} */}
                    </View>
                </KeyboardAwareScrollView>

                {!keyboardVisible && (
                    <View style={styles.footer}>
                        <Image
                            source={require('../assets/images/mantra.jpg')}
                            style={styles.smallImage}
                        />
                        <View style={styles.footerTextContainer}>
                            <Text style={styles.footerText}>Made in</Text>
                            <Image
                                source={require('../assets/images/image 10.png')}
                                style={styles.smallImage}
                            />
                        </View>
                        <Image
                            source={require('../assets/images/make-in-India-logo.jpg')}
                            style={styles.smallImage}
                        />
                    </View>
                )}
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,

    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
        color: '#FFF',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    detail: {
        fontSize: 16,
        marginBottom: 12,
        color: '#34495e',
    },
    label: {
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    smallImage: {
        width: 40,
        height: 40,
    },
    footerTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        color: '#000',
        paddingLeft: 2,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginLeft: 8,
    },
    counterPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#2c3e50',
        borderRadius: 5,
        padding: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
