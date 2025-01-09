
import React, { useEffect, useState, useRef, useContext } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    Keyboard,
    Modal,
    TextInput,
    Alert
} from 'react-native';
import { getSocket, closeSocket } from './SocketIO';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_END_POINT } from '../app.config';
import { SocketContext } from '../SocketContext';


const TripSummary = ({ route }) => {
    const { tripId } = route.params;
    const navigation = useNavigation();

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [trip, setTrip] = useState(null);
    // const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [acceptedDriverId, setAcceptedDriverId] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const isMounted = useRef(true);
    const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false); // Controls the visibility
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [revisedPrice, setRevisedPrice] = useState('');
    // const { socket } = useContext(SocketContext);


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
        const socketInstance = getSocket();
        setSocket(socketInstance);

        // return () => {
        //     closeSocket(); // Disconnect socket on unmount
        // };
    }, []);

    const fetchCounterPriceList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_END_POINT}/api/trips/${tripId}`);

            if (isMounted.current) {
                setTrip(response.data.trip);
            }
        } catch (error) {
            console.error('Error fetching trip history:', error);
        } finally {
            if (isMounted.current) {
                setLoading(false);
                // setRefreshing(false);  // Stop refresh indicator
            }
        }
    };

    const handleCounterPrice = async () => {
        // console.log('counterPrice Event Received');
        await fetchCounterPriceList();
        setShowDetails(true);
        setIsSubmitModalVisible(Number(trip?.bids?.length) % 2 === 1 ? true : false)
    };

    useEffect(() => {
        handleCounterPrice();

        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.off('counterPrice', handleCounterPrice);
            socket.on('counterPrice', handleCounterPrice);

            return () => {
                socket.off('counterPrice', handleCounterPrice);
            };
        }
    }, [socket]);


    const openModal = (price) => {
        setSelectedPrice(price);
        setModalVisible(true);
    };

    const handleAccept = async (tripId, vspUserId) => {
        console.log('Accepted:', vspUserId);
        const response = await axios.patch(`${API_END_POINT}/api/trips/bidStatus`, { tripId, vspUserId, status: "inProgress" });

        if (response.status === 200) {
            setModalVisible(false);
            Alert.alert('Success', 'Thank you for accepting the bid');
            navigation.navigate('TripScreen', { user });
        }
    };

    const handleReject = () => {
        console.log('Rejected:', selectedPrice);
        setModalVisible(false);
    };

    const handleRevisedPrice = async (userId, vspUserId, price) => {
        console.log('userId : ', userId, 'vspUserId :', vspUserId, 'price : ', price, 'tripId : ', tripId);
        console.log('Revised Price:', revisedPrice);
        const response = await axios.patch(`${API_END_POINT}/api/trips/revisedPrice`, { userId, vspUserId, price, tripId });

        if (response.status === 200) {
            setModalVisible(false);
            setTrip(response.data.trip);
            setIsSubmitModalVisible(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007bff" />
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
        counterPriceList,
        user,
        bidder
    } = trip;

    console.log('tripUser', trip.bids);
    // Handle accept and reject disable

    const prices = counterPriceList.map((price, index) => ({
        label: `Driver ${index + 1}`,
        value: price.counterPrice,
        user: price.user,
    }));


    return (
        <ScrollView
            contentContainerStyle={styles.container}
        >
            <View style={styles.summaryBox}>
                <Text style={styles.heading}>Trip Summary</Text>
                <Text style={styles.summaryText}>From: {from}</Text>
                <Text style={styles.summaryText}>To: {to}</Text>
                <Text style={styles.summaryText}>Date: {new Date(tripDate).toLocaleDateString()}</Text>
                <Text style={styles.summaryText}>Quote Price: ₹{cargoDetails.quotePrice}</Text>
                <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => setShowDetails(!showDetails)}
                >
                    <Text style={styles.detailsButtonText}>{showDetails ? 'Hide Details' : 'Show Details'}</Text>
                </TouchableOpacity>
            </View>

            {showDetails && trip?.bids?.length === 0 && prices.map((price, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.priceRow}
                    onPress={() => openModal(price)}
                >
                    <Text style={styles.label}>{price.label}</Text>
                    {price.user && (
                        <Text style={styles.userInfo}>Price:  ₹{price.value || 'N/A'}</Text>
                    )}
                    {price.user && (
                        <Text style={styles.userInfo}>By: {price.user.fullName} ({price.user.phoneNumber})</Text>
                    )}
                </TouchableOpacity>
            ))}

            {showDetails && trip?.bids?.length > 0 && trip.bids.map((bid, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.priceRow}
                // onPress={() => openModal(price)}
                >
                    <Text style={styles.label}>{bid.role === 'consumer' ? 'Revised Price:' : 'Counter Price:'}  {bid.user && (
                        <Text style={styles.userInfo}>  ₹{bid.price || 'N/A'}</Text>
                    )}
                    </Text>
                </TouchableOpacity>
            ))}

            {/* {isSubmitModalVisible && (
                <View style={styles.modalContent}>
                    <TextInput
                        style={[
                            styles.input,
                            trip?.bids?.length === 5 && { backgroundColor: '#d3d3d3' }, // Change background to indicate disabled
                        ]}
                        placeholder="Enter revised price"
                        value={revisedPrice}
                        onChangeText={setRevisedPrice}
                        keyboardType="numeric"
                        editable={trip?.bids?.length !== 5} // Disable input if bids.length is 5
                    />

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity
                            style={styles.acceptButton}
                            onPress={() => handleAccept(tripId, bidder)}
                        >
                            <Text style={styles.buttonText}>Accept</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                trip?.bids?.length === 5 && { backgroundColor: '#d3d3d3' }, // Change button color when disabled
                            ]}
                            onPress={() => {
                                handleRevisedPrice(user, selectedPrice?.user?._id, revisedPrice);
                                setRevisedPrice(''); // Clear the revised price
                            }}
                            disabled={trip?.bids?.length === 5} // Disable button if bids.length is 5
                        >
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )} */}


            {showDetails && Number(trip?.bids?.length) % 2 === 1 &&
                (<View style={styles.modalContent}>
                    <TextInput
                        style={[
                            styles.input,
                            trip?.bids?.length === 5 && { backgroundColor: '#d3d3d3' }, // Change background to indicate disabled
                        ]}
                        placeholder="Enter revised price"
                        value={revisedPrice}
                        onChangeText={setRevisedPrice}
                        keyboardType="numeric"
                        editable={trip?.bids?.length !== 5} // Disable input if bids.length is 5
                    />

                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(tripId, bidder)}>
                            <Text style={styles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                trip?.bids?.length === 5 && { backgroundColor: '#d3d3d3' }, // Change button color when disabled
                            ]}
                            onPress={() => {
                                handleRevisedPrice(user, trip?.bidder?.toString(), revisedPrice);
                                setRevisedPrice(''); // Clear the revised price
                            }}

                            disabled={trip?.bids?.length === 5} // Disable button if bids.length is 5
                        >
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>)
            }

            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Close Button */}
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>×</Text>
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>Counter Offer</Text>
                        <Text style={styles.modalInfo}>User: {selectedPrice?.user?.fullName}</Text>
                        <Text style={styles.modalInfo}>Price: ₹{selectedPrice?.value || 'N/A'}</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Enter revised price"
                            value={revisedPrice}
                            onChangeText={setRevisedPrice}
                            keyboardType="numeric"
                        />

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(tripId, selectedPrice?.user?._id)}>
                                <Text style={styles.buttonText}>Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.submitButton} onPress={() => handleRevisedPrice(user, selectedPrice?.user?._id, revisedPrice)}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
    },
    summaryBox: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    summaryText: {
        fontSize: 16,
        marginBottom: 4,
        color: '#555',
    },
    detailsButton: {
        marginTop: 8,
        paddingVertical: 8,
        backgroundColor: '#007bff',
        borderRadius: 4,
        alignItems: 'center',
    },
    detailsButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    priceRow: {
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        marginBottom: 8,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    userInfo: {
        fontSize: 14,
        color: '#777',
        marginTop: 4,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        elevation: 4,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    modalInfo: {
        fontSize: 16,
        marginBottom: 8,
        color: '#555',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 8,
        marginBottom: 16,
        fontSize: 16,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    acceptButton: {
        flex: 1,
        backgroundColor: '#28a745',
        borderRadius: 4,
        paddingVertical: 12,
        alignItems: 'center',
        marginRight: 4,
    },
    rejectButton: {
        flex: 1,
        backgroundColor: '#dc3545',
        borderRadius: 4,
        paddingVertical: 12,
        alignItems: 'center',
        marginHorizontal: 4,
    },
    submitButton: {
        flex: 1,
        backgroundColor: '#007bff',
        borderRadius: 4,
        paddingVertical: 12,
        alignItems: 'center',
        marginLeft: 4,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#ddd',
        borderRadius: 20,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },

});

export default TripSummary;