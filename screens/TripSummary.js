import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { getSocket, closeSocket } from './SocketIO';
import axios from 'axios';

const TripSummary = ({ route }) => {
    const { tripId } = route.params;
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [trip, setTrip] = useState(null);
    const isMounted = useRef(true);

    useEffect(() => {
        const socketInstance = getSocket();
        setSocket(socketInstance);

        return () => {
            closeSocket(); // Disconnect socket on unmount
        };
    }, []);

    const fetchCounterPriceList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://192.168.1.3:8000/api/trips/${tripId}`);
            if (isMounted.current) {
                console.log('API Response:', response.data.trip); // Debug the API response
                setTrip(response.data.trip); // Directly set the trip data
            }
        } catch (error) {
            console.error('Error fetching trip history:', error);
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchCounterPriceList();

        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        const handleCounterPrice = async () => {
            console.log('Event Received');
            await fetchCounterPriceList();
        };

        if (socket) {
            socket.on('counterPrice', handleCounterPrice);

            // Cleanup listener on unmount
            return () => {
                socket.off('counterPrice', handleCounterPrice);
            };
        }
    }, [socket]);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!trip) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No trip details found</Text>
            </View>
        );
    }

    const {
        from,
        to,
        tripDate,
        cargoDetails,
        specialInstruction,
        status,
        amount,
        currentLocation,
        counterPriceList,
    } = trip;


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Trip Details</Text>

            <Text style={styles.label}>From:</Text>
            <Text style={styles.value}>{from}</Text>

            <Text style={styles.label}>To:</Text>
            <Text style={styles.value}>{to}</Text>

            <Text style={styles.label}>Trip Date:</Text>
            <Text style={styles.value}>{new Date(tripDate).toLocaleString()}</Text>

            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{status}</Text>

            <Text style={styles.label}>Amount:</Text>
            <Text style={styles.value}>{amount}</Text>

            <Text style={styles.label}>Special Instruction:</Text>
            <Text style={styles.value}>{specialInstruction || 'N/A'}</Text>

            <Text style={styles.label}>Current Location:</Text>
            <Text style={styles.value}>
                Latitude: {currentLocation?.latitude || 'N/A'}, Longitude: {currentLocation?.longitude || 'N/A'}
            </Text>

            <Text style={styles.label}>Cargo Details:</Text>
            <View style={styles.cargoContainer}>
                <Text style={styles.label}>Cargo Type:</Text>
                <Text style={styles.value}>{cargoDetails?.cargoType || 'N/A'}</Text>

                <Text style={styles.label}>Quote Price:</Text>
                <Text style={styles.value}>{cargoDetails?.quotePrice || 'N/A'}</Text>

                <Text style={styles.label}>Payload Weight:</Text>
                <Text style={styles.value}>{cargoDetails?.payloadWeight || 'N/A'}</Text>

                <Text style={styles.label}>Payload Dimensions:</Text>
                <Text style={styles.value}>
                    {cargoDetails?.payloadLength && cargoDetails?.payloadWidth && cargoDetails?.payloadHeight
                        ? `${cargoDetails.payloadLength}x${cargoDetails.payloadWidth}x${cargoDetails.payloadHeight} (LxWxH in feet)`
                        : 'N/A'}
                </Text>
            </View>

            <Text style={styles.label}>Driver Price</Text>
            {counterPriceList && counterPriceList.length > 0 ? (
                counterPriceList.map((bidder, index) => (
                    <View key={index} style={styles.bidderContainer}>
                        <Text style={styles.value}>
                            Name: {bidder.user.fullName}
                            Phone: {bidder.user.phoneNumber},
                            Bid: {bidder.counterPrice}
                        </Text>
                    </View>
                ))
            ) : (
                <Text style={styles.value}>No bidders yet</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginVertical: 4,
    },
    value: {
        fontSize: 16,
        marginVertical: 4,
    },
    cargoContainer: {
        marginTop: 16,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
    },
    bidderContainer: {
        marginVertical: 4,
    },
});

export default TripSummary;