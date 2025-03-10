import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Modal, TextInput, Alert, DatePicker } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getCurrentDate } from './CargoDetails';
import axios from 'axios';
import { API_END_POINT } from '../app.config';

const ViewDetails = ({ route }) => {
    const { tripId, status } = route.params;
    const [tripDetails, setTripDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editedTrip, setEditedTrip] = useState(null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    const navigation = useNavigation();

    const apiEndpoint = `${API_END_POINT}/api/trips/${tripId}`;




    // Fetch trip details
    const fetchTripDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(apiEndpoint);
            if (response.status === 200) {
                setTripDetails(response.data.trip);
                setEditedTrip(response.data.trip);
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

    const handleSaveChanges = async () => {
        try {
            const response = await fetch(apiEndpoint, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedTrip),
            });
            if (response.ok) {
                const updatedTrip = await response.json();
                // console.log('upDated trip',updatedTrip)
                setTripDetails(updatedTrip.trip);
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
        setLoading(true);
        try {
            const response = await axios.post(`${API_END_POINT}/api/trips/${tripId}/startBidding`, {});

            if (response.status === 200) {
                navigation.navigate('TripSummary', { tripId })
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while start Bidding');
            console.log('Error', error);
        } finally {
            setLoading(false)
        }

    };

    console.log('tripId', tripId);


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
                {tripDetails.status === 'created' && tripDetails.biddingStatus === 'notStarted' &&
                    <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>}

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

                        {status !== 'created' && (
                            <View style={styles.additionalInfo}>
                                <Text style={styles.detailText}>Vehicle Number: {tripDetails.vehicleNumber}</Text>
                                <Text style={styles.detailText}>Driver Details: {tripDetails.bidder || 'N/A'}</Text>
                                <Text style={styles.detailText}>Pickup Address: {tripDetails.pickupAddress || 'N/A'}</Text>
                                <Text style={styles.detailText}>Dropoff Address: {tripDetails.pickupAddress || 'N/A'}</Text>
                            </View>
                        )}

                        {status === 'inProgress' ?
                            (
                                tripDetails.biddingStatus === 'accepted' ?
                                    (
                                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DriverLocation', { userId: tripDetails.bidder, from: tripDetails.from, to: tripDetails.to })}>
                                            <Text style={styles.buttonText}>View Driver Location</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                                            <Text style={styles.buttonText}>Back to manu</Text>
                                        </TouchableOpacity>
                                    )
                            ) : (
                                <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                                    <Text style={styles.buttonText}>Back</Text>
                                </TouchableOpacity>
                            )}

                        {status === 'created' ?
                            (
                                tripDetails.biddingStatus === 'notStarted' ?
                                    (
                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={handleStartBidding}
                                            disabled={loading}>
                                            {loading ? (
                                                <ActivityIndicator size="small" color="#FFF" />
                                            ) : (
                                                <Text style={styles.buttonText}>Start Bidding</Text>
                                            )}
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

            <Modal visible={!!editedTrip && editModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    {editedTrip && (
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Edit Trip Details</Text>
                            <ScrollView>
                                <TextInput
                                    style={styles.input}
                                    value={editedTrip.from || ''}
                                    onChangeText={(text) => setEditedTrip({ ...editedTrip, from: text })}
                                    placeholder="From"
                                    keyboardType="numeric"
                                    maxLength={6}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={editedTrip.to || ''}
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
                                            cargoDetails: { ...editedTrip.cargoDetails, payloadLength: parseFloat(text) || 0 },
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
                                    value={editedTrip.specialInstruction?.toString() || ''}
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
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={handleSaveChanges}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator size="small" color="#FFF" />
                                    ) : (
                                        <Text style={styles.modalButtonText}>Save</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
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

export default ViewDetails;