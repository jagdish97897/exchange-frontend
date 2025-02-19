import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { API_END_POINT } from '../app.config';

const TripScreen1 = ({ route }) => {
    const { userId } = route.params;
    const [loading, setLoading] = useState(true);
    const [trips, setTrips] = useState({
        Archieved: [],
        InProgress: [],
        Completed: [],
        Cancelled: [],
    });


    const navigation = useNavigation();
    // const route = useRoute();

    const apiEndpoint = `${API_END_POINT}/api/trips/${userId}/acceptedBidTrips`;

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await fetch(apiEndpoint);
                const data = await response.json();

                const categorizedTrips = {
                    InProgress: data?.trips?.filter((trip) => trip.status === 'inProgress') ?? [],
                    Completed: data?.trips?.filter((trip) => trip.status === 'completed') ?? [],
                    Cancelled: data?.trips?.filter((trip) => trip.status === 'cancelled') ?? [],
                };

                setTrips(categorizedTrips);
            } catch (error) {
                console.error('Error fetching trips:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchTrips();
    }, [userId]);

    const sectionColors = {
        InProgress: '#fff7e6', 
        Completed: '#e6ffe6', 
        Cancelled: '#ffe6e6', 
    };

    const renderTripCard = (item) => (
        <View style={styles.card} key={item._id}>
            <Text style={styles.tripText}>From: {item.from}</Text>
            <Text style={styles.tripText}>To: {item.to}</Text>
            <Text style={styles.tripText}>Cargo Type: {item.cargoDetails.cargoType}</Text>
            <Text style={styles.tripText}>Quote Price: ₹{item.cargoDetails.quotePrice}</Text>
            <Text style={styles.tripText}>
                Date: {new Date(item.tripDate).toLocaleDateString()}
            </Text>

            <Text style={styles.instructionsText}>
                Instructions: {item.specialInstruction || 'N/A'}
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('ViewDetails1', { tripId: item._id, status: item.status, userId })}
            >
                <Text style={styles.buttonText}>View Details</Text>
            </TouchableOpacity>
        </View>
    );

    const renderSection = (status, trips) => (
        <View
            style={[styles.section, { backgroundColor: sectionColors[status] }]}
            key={status}
        >
            <Text style={styles.sectionHeader}>{status} Trips</Text>
            {trips.length > 0 ? (
                <FlatList
                    data={trips}
                    renderItem={({ item }) => renderTripCard(item)}
                    keyExtractor={(item) => item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            ) : (
                <Text style={styles.noTripsText}>No trips available</Text>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    return (
        <LinearGradient colors={['#06264D', '#FFF']} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 40 }}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.screenTitle}>Trips</Text>
                    {['InProgress', 'Completed', 'Cancelled'].map((status) =>
                        renderSection(status, trips[status])
                    )}
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    screenTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#FFF',
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
        padding: 16,
        borderRadius: 8,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    card: {
        backgroundColor: '#FFF',
        padding: 16,
        marginHorizontal: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        width: 250,
    },
    tripText: {
        fontSize: 16,
        marginBottom: 4,
        color: '#333',
    },
    instructionsText: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    button: {
        marginTop: 8,
        paddingVertical: 8,
        backgroundColor: '#007BFF',
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    noTripsText: {
        color: '#FFF',
        fontSize: 14,
        fontStyle: 'italic',
    },
});

export default TripScreen1;