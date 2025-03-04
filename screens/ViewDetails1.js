import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Modal, TextInput, Alert, DatePicker } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { API_END_POINT } from '../app.config';

const ViewDetails1 = ({ route }) => {
    const { tripId, status,userId } = route.params;
    const [tripDetails, setTripDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    const apiEndpoint = `${API_END_POINT}/api/trips/${tripId}`;

    console.log("viewdetails1", userId)

    // Fetch trip details
    const fetchTripDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(apiEndpoint);
            if (response.status === 200) {
                setTripDetails(response.data.trip);
              
            }
        } catch (error) {
            console.error('Error fetching trip details:', error);
            Alert.alert('Error', 'Failed to fetch trip details');
        } finally {
            setLoading(false);
        }
    };

    // Reload trip details when the screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchTripDetails();
        }, [])
    );

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
        <LinearGradient colors={['#06264D', '#FFF']} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 40 }}>

                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.title}>Trip Details</Text>
                    <View style={styles.card}>
                        <Text style={styles.detailText}>From: {tripDetails.from}</Text>
                        <Text style={styles.detailText}>To: {tripDetails.to}</Text>
                        <Text style={styles.detailText}>Cargo Type: {tripDetails.cargoDetails.cargoType}</Text>
                        <Text style={styles.detailText}>Quote Price: ₹{tripDetails.cargoDetails.quotePrice}</Text>
                        <Text style={styles.detailText}>
                            Trip Date: {new Date(tripDetails.tripDate).toLocaleDateString()}
                        </Text>
                        <Text style={styles.detailText}>Special Instructions: {tripDetails.specialInstruction || 'N/A'}</Text>
                        <Text style={styles.detailText}>Status: {tripDetails.status}</Text>

                        {status === 'inProgress' ?
                            (
                                tripDetails.biddingStatus === 'accepted' ?
                                    (
                                        <TouchableOpacity style={styles.button}  onPress={() => navigation.navigate('UserDashboard', { userId, from:tripDetails.from, to:tripDetails.to, cargoType:tripDetails.cargoDetails.cargoType, quotePrice:tripDetails.cargoDetails.quotePrice })} >
                                            <Text style={styles.buttonText}>View map</Text>
                                        </TouchableOpacity>

                                    ) : (

                                        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                                            <Text style={styles.buttonText}>back to manu</Text>
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


        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
        borderTopWidth: 1,
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
});

export default ViewDetails1;