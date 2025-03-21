
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

import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ind from '../assets/images/image 10.png';
import { API_END_POINT } from '../app.config';
import { SocketContext } from '../SocketContext';


const TripSummary = ({ route }) => {
    const { tripId } = route.params;
    const navigation = useNavigation();
    const isMounted = useRef(true);

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [trip, setTrip] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [showChat, setShowChat] = useState(false);
    const [showBids, setShowBids] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [revisedPrice, setRevisedPrice] = useState('');

    console.log("trip", )

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        const socketInstance = getSocket();
        setSocket(socketInstance);
        return () => {
            if (socketInstance) {
                socketInstance.off('counterPrice', handleCounterPrice);
            }
        };
    }, []);

    useEffect(() => {
        fetchCounterPriceList();
        return () => { isMounted.current = false; };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('counterPrice', handleCounterPrice);
            return () => socket.off('counterPrice', handleCounterPrice);
        }
    }, [socket]);

    console.log("selectedPrice", selectedPrice)
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
            if (isMounted.current) setLoading(false);
        }
    };

    const handleCounterPrice = async () => {
        await fetchCounterPriceList();
    };

    const handleBidClick = (price) => {
        setShowChat(true);
        setSelectedPrice(price);
    };

    const handleRevisedPrice = async (userId, vspUserId, price) => {
        try {
            const response = await axios.patch(`${API_END_POINT}/api/trips/revisedPrice`, {
                userId, vspUserId, price, tripId
            });
            if (response.status === 200) {
                setTrip(response.data.trip);
                setRevisedPrice('');
            }
        } catch (error) {
            console.error('Error submitting revised price:', error);
        }
    };

    const handleAccept = async (tripId, vspUserId) => {
        try {
            const response = await axios.patch(`${API_END_POINT}/api/trips/bidStatus`, {
                tripId, vspUserId, status: "created"
            });
            if (response.status === 200) {
                Alert.alert('Success', 'Thank you for accepting the bid');
                navigation.navigate('TripScreen', { userId: trip?.user });
            }
        } catch (error) {
            console.error('Error accepting bid:', error);
        }
    };

    useEffect(() => {
        if (trip?.bids?.length > 0) {
            setShowChat(true);
        }
    }, [trip?.bids?.length]);

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

    const { from, to, counterPriceList } = trip;
    const prices = counterPriceList?.map((price, index) => ({
        label: `Driver ${index + 1}`,
        value: price.increasedCounterPrice,
        user: price.user,
    })) || [];


    

    
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.avltrip}>Available Bids</Text>
    
            <View style={styles.locationContainer}>
                <Text style={styles.locationText}>
                    <Icon name="map-marker" size={20} color="red" /> {from}
                </Text>
                <Icon name="arrow-right" size={25} color="black" style={styles.arrow} />
                <Text style={styles.locationText}>
                    <Icon name="map-marker" size={20} color="green" /> {to}
                </Text>
            </View>
    
            {/* Display Available Bids (Hidden when showChat is true) */}
            {showBids && trip?.bids?.length === 0 && prices?.map((price, index) => (
                <TouchableOpacity key={index} style={styles.priceRow}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Truck driver: {price.label}</Text>
                    </View>
    
                    <View style={styles.content}>
                        <Image source={Ind} style={{ height: 50, width: 50, borderRadius: 40 }} />
                        <View style={styles.info}>
                            <Text style={styles.name}>{price.user?.fullName}</Text>
                            <Text style={styles.price}>Proposed Rate: ₹{price.value}</Text>
                            <Text style={styles.details}>Trips Completed: </Text>
                            <Text style={styles.details}>Ratings: ⭐⭐⭐⭐⭐</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.bidButton}
                            onPress={() => {
                                handleBidClick(price);
                                setShowChat(true);
                                setShowBids(false);
                            }}
                        >
                            <Text style={styles.bidText}>Bid</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            ))}
    
            {/* Display Chat if a bid is clicked */}
            {showChat && (
                <>


               <TouchableOpacity style={styles.priceRow}>
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Truck driver: {selectedPrice?.label}</Text>
                    </View>
    
                    <View style={styles.content}>
                        <Image source={Ind} style={{ height: 50, width: 50, borderRadius: 40 }} />
                        <View style={styles.info}>
                            <Text style={styles.name}>{selectedPrice?.user?.fullName}</Text>
                            <Text style={styles.price}>Proposed Rate: ₹{selectedPrice?.value}</Text>
                            <Text style={styles.details}>Trips Completed: </Text>
                            <Text style={styles.details}>Ratings: ⭐⭐⭐⭐⭐</Text>
                        </View>
                        <TouchableOpacity
    style={[styles.bidButton, isSubmitted && { opacity: 0.5 }]}
    onPress={() => {
        if (!isSubmitted) {
            setShowChat(false);
            setShowBids(true);
        }
    }}
    disabled={isSubmitted}
>
    <Text style={styles.bidText}>Back</Text>
</TouchableOpacity>


                    </View>
                </TouchableOpacity>
    
                    {/* Display submitted bids */}
                    {trip?.bids.map((bid, index) => (
                        <View 
                            key={index} 
                            style={[
                                styles.chat,
                                bid.role === 'consumer' ? styles.consumerChat : styles.driverChat
                            ]}
                        >
                            <TouchableOpacity style={styles.priceRow}>
                                <Text style={styles.label}>
                                    {bid.role === 'consumer' ? `You:` : `Driver:`}  
                                    <Text style={styles.userInfo}> ₹{bid.role === 'consumer' ? bid.price : bid.increasedPrice || 'N/A'}</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
    
                    {/* Chat Input Section */}
                    <View style={styles.modalContent}>
                        <TextInput
                            style={[styles.input, trip?.bids?.length === 5 && { backgroundColor: '#d3d3d3' }]}
                            placeholder="Enter revised price"
                            value={revisedPrice}
                            onChangeText={setRevisedPrice}
                            keyboardType="numeric"
                            editable={trip?.bids?.length !== 5}
                        />
    
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity 
                                style={styles.acceptButton} 
                                onPress={() => handleAccept(trip?._id, trip?.bids?.[0]?.user?._id)}
                            >
                                <Text style={styles.buttonText}>Accept</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.submitButton, trip?.bids?.length === 5 && { backgroundColor: '#d3d3d3' }]}
                                onPress={() => {
                                    if (selectedPrice?.user?._id) {
                                        handleRevisedPrice(trip?.user, selectedPrice?.user?._id, revisedPrice);
                                    }
                                    if (trip?.bidder) {
                                        handleRevisedPrice(trip?.user, trip?.bidder.toString(), revisedPrice);
                                    }
                                    setRevisedPrice('');
                                    setIsSubmitted(true);  // Disable the back button
                                    setShowChat(true);  // Show chat
                                }}
                                disabled={trip?.bids?.length === 5}
                            >
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
    

                </>
            )}
        </ScrollView>
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
    avltrip: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#000',
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

    header: {
        backgroundColor: "#1e4db7",
        padding: 10,
    },
    headerText: {
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#F2E6DA"
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    info: {
        flex: 1,
    },
    name: {
        fontWeight: "bold",
        fontSize: 16,
    },
    price: {
        color: "#333",
        fontSize: 14,
    },
    details: {
        fontSize: 12,
        color: "#666",
    },
    bidButton: {
        backgroundColor: "#1e4db7",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    bidText: {
        color: "#fff",
        fontWeight: "bold",
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
    chat: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        maxWidth: '80%',
    },
    priceRow: {
        padding: 10,
        borderRadius: 10,
       
    },
    consumerChat: {
        backgroundColor: '#DCF8C6', // Light green for consumer messages (like WhatsApp)
        alignSelf: 'flex-end', // Consumer messages on the right

    },
    driverChat: {
        backgroundColor: '#E8E8E8', // Light grey for driver messages
        alignSelf: 'flex-start', // Driver messages on the left
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    userInfo: {
        fontSize: 16,
        color: '#333',
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

// import React, { useEffect, useState, useRef, useContext } from 'react';
// import {
//     SafeAreaView,
//     View,
//     Text,
//     Image,
//     ScrollView,
//     StyleSheet,
//     ActivityIndicator,
//     RefreshControl,
//     TouchableOpacity,
//     Keyboard,
//     Modal,
//     TextInput,
//     Alert
// } from 'react-native';
// import { getSocket, closeSocket } from './SocketIO';

// import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Ind from '../assets/images/image 10.png';
// import { API_END_POINT } from '../app.config';
// import { SocketContext } from '../SocketContext';


// const TripSummary = ({ route }) => {
//     const { tripId } = route.params;
//     const navigation = useNavigation();
//     const isMounted = useRef(true);

//     const [keyboardVisible, setKeyboardVisible] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [socket, setSocket] = useState(null);
//     const [trip, setTrip] = useState(null);
//     const [selectedPrice, setSelectedPrice] = useState(null);
//     const [showChat, setShowChat] = useState(false);
//     const [showBids, setShowBids] = useState(true);
//     const [isSubmitted, setIsSubmitted] = useState(false);
//     const [revisedPrice, setRevisedPrice] = useState('');

//     useEffect(() => {
//         const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
//         const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

//         return () => {
//             keyboardDidShowListener.remove();
//             keyboardDidHideListener.remove();
//         };
//     }, []);

//     useEffect(() => {
//         const socketInstance = getSocket();
//         setSocket(socketInstance);
//         return () => {
//             if (socketInstance) {
//                 socketInstance.off('counterPrice', handleCounterPrice);
//             }
//         };
//     }, []);

//     useEffect(() => {
//         fetchCounterPriceList();
//         return () => { isMounted.current = false; };
//     }, []);

//     useEffect(() => {
//         if (socket) {
//             socket.on('counterPrice', handleCounterPrice);
//             return () => socket.off('counterPrice', handleCounterPrice);
//         }
//     }, [socket]);

//     console.log("selectedPrice", selectedPrice)
//     const fetchCounterPriceList = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`${API_END_POINT}/api/trips/${tripId}`);
//             if (isMounted.current) {
//                 setTrip(response.data.trip);
//             }
//         } catch (error) {
//             console.error('Error fetching trip history:', error);
//         } finally {
//             if (isMounted.current) setLoading(false);
//         }
//     };

//     const handleCounterPrice = async () => {
//         await fetchCounterPriceList();
//     };

//     const handleBidClick = (price) => {
//         setShowChat(true);
//         setSelectedPrice(price);
//     };

//     const handleRevisedPrice = async (userId, vspUserId, price) => {
//         try {
//             const response = await axios.patch(`${API_END_POINT}/api/trips/revisedPrice`, {
//                 userId, vspUserId, price, tripId
//             });
//             if (response.status === 200) {
//                 setTrip(response.data.trip);
//                 setRevisedPrice('');
//             }
//         } catch (error) {
//             console.error('Error submitting revised price:', error);
//         }
//     };

//     const handleAccept = async (tripId, vspUserId) => {
//         try {
//             const response = await axios.patch(`${API_END_POINT}/api/trips/bidStatus`, {
//                 tripId, vspUserId, status: "created"
//             });
//             if (response.status === 200) {
//                 Alert.alert('Success', 'Thank you for accepting the bid');
//                 navigation.navigate('TripScreen', { userId: trip?.user });
//             }
//         } catch (error) {
//             console.error('Error accepting bid:', error);
//         }
//     };

//     useEffect(() => {
//         if (trip?.bids?.length > 0) {
//             setShowChat(true);
//         }
//     }, [trip?.bids?.length]);

//     if (loading) {
//         return (
//             <View style={styles.loaderContainer}>
//                 <ActivityIndicator size="large" color="#007bff" />
//             </View>
//         );
//     }

//     if (!trip) {
//         return (
//             <View style={styles.errorContainer}>
//                 <Text style={styles.errorText}>No trip details found</Text>
//             </View>
//         );
//     }

//     const { from, to, counterPriceList } = trip;
//     const prices = counterPriceList?.map((price, index) => ({
//         label: `Driver ${index + 1}`,
//         value: price.increasedCounterPrice,
//         user: price.user,
//     })) || [];


    

    
//     return (
//         <ScrollView contentContainerStyle={styles.container}>
//             <Text style={styles.avltrip}>Available Bids</Text>
    
//             <View style={styles.locationContainer}>
//                 <Text style={styles.locationText}>
//                     <Icon name="map-marker" size={20} color="red" /> {from}
//                 </Text>
//                 <Icon name="arrow-right" size={25} color="black" style={styles.arrow} />
//                 <Text style={styles.locationText}>
//                     <Icon name="map-marker" size={20} color="green" /> {to}
//                 </Text>
//             </View>
    
//             {/* Display Available Bids (Hidden when showChat is true) */}
//             {showBids && trip?.bids?.length === 0 && prices?.map((price, index) => (
//                 <TouchableOpacity key={index} style={styles.priceRow}>
//                     <View style={styles.header}>
//                         <Text style={styles.headerText}>Truck driver: {price.label}</Text>
//                     </View>
    
//                     <View style={styles.content}>
//                         <Image source={Ind} style={{ height: 50, width: 50, borderRadius: 40 }} />
//                         <View style={styles.info}>
//                             <Text style={styles.name}>{price.user?.fullName}</Text>
//                             <Text style={styles.price}>Proposed Rate: ₹{price.value}</Text>
//                             <Text style={styles.details}>Trips Completed: </Text>
//                             <Text style={styles.details}>Ratings: ⭐⭐⭐⭐⭐</Text>
//                         </View>
//                         <TouchableOpacity
//                             style={styles.bidButton}
//                             onPress={() => {
//                                 handleBidClick(price);
//                                 setShowChat(true);
//                                 setShowBids(false);
//                             }}
//                         >
//                             <Text style={styles.bidText}>Bid</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </TouchableOpacity>
//             ))}
    
//             {/* Display Chat if a bid is clicked */}
//             {showChat && (
//                 <>


//                <TouchableOpacity style={styles.priceRow}>
//                     <View style={styles.header}>
//                         <Text style={styles.headerText}>Truck driver: {selectedPrice?.label}</Text>
//                     </View>
    
//                     <View style={styles.content}>
//                         <Image source={Ind} style={{ height: 50, width: 50, borderRadius: 40 }} />
//                         <View style={styles.info}>
//                             <Text style={styles.name}>{selectedPrice?.user?.fullName}</Text>
//                             <Text style={styles.price}>Proposed Rate: ₹{selectedPrice?.value}</Text>
//                             <Text style={styles.details}>Trips Completed: </Text>
//                             <Text style={styles.details}>Ratings: ⭐⭐⭐⭐⭐</Text>
//                         </View>
//                         <TouchableOpacity
//     style={[styles.bidButton, isSubmitted && { opacity: 0.5 }]}
//     onPress={() => {
//         if (!isSubmitted) {
//             setShowChat(false);
//             setShowBids(true);
//         }
//     }}
//     disabled={isSubmitted}
// >
//     <Text style={styles.bidText}>Back</Text>
// </TouchableOpacity>
//                     </View>
//                 </TouchableOpacity>
    
//                     {/* Display submitted bids */}
//                     {trip?.bids.map((bid, index) => (
//                         <View 
//                             key={index} 
//                             style={[
//                                 styles.chat,
//                                 bid.role === 'consumer' ? styles.consumerChat : styles.driverChat
//                             ]}
//                         >
//                             <TouchableOpacity style={styles.priceRow}>
//                                 <Text style={styles.label}>
//                                     {bid.role === 'consumer' ? `You:` : `Driver:`}  
//                                     <Text style={styles.userInfo}> ₹{bid.role === 'consumer' ? bid.price : bid.increasedPrice || 'N/A'}</Text>
//                                 </Text>
//                             </TouchableOpacity>
//                         </View>
//                     ))}
    
//                     {/* Chat Input Section */}
//                     <View style={styles.modalContent}>
//                         <TextInput
//                             style={[styles.input, trip?.bids?.length === 5 && { backgroundColor: '#d3d3d3' }]}
//                             placeholder="Enter revised price"
//                             value={revisedPrice}
//                             onChangeText={setRevisedPrice}
//                             keyboardType="numeric"
//                             editable={trip?.bids?.length !== 5}
//                         />
    
//                         <View style={styles.buttonGroup}>
//                             <TouchableOpacity 
//                                 style={styles.acceptButton} 
//                                 onPress={() => handleAccept(trip?._id, trip?.bids?.[0]?.user?._id)}
//                             >
//                                 <Text style={styles.buttonText}>Accept</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity
//                                 style={[styles.submitButton, trip?.bids?.length === 5 && { backgroundColor: '#d3d3d3' }]}
//                                 onPress={() => {
//                                     if (selectedPrice?.user?._id) {
//                                         handleRevisedPrice(trip?.user, selectedPrice?.user?._id, revisedPrice);
//                                     }
//                                     if (trip?.bidder) {
//                                         handleRevisedPrice(trip?.user, trip?.bidder.toString(), revisedPrice);
//                                     }
//                                     setRevisedPrice('');
//                                     setIsSubmitted(true);  // Disable the back button
//                                     setShowChat(true);  // Show chat
//                                 }}
//                                 disabled={trip?.bids?.length === 5}
//                             >
//                                 <Text style={styles.buttonText}>Submit</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
    

//                 </>
//             )}
//         </ScrollView>
//     );
    
// };

// const styles = StyleSheet.create({
//     container: {
//         padding: 16,
//         backgroundColor: '#f9f9f9',
//     },
//     loaderContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#f9f9f9',
//     },
//     errorContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#f9f9f9',
//     },
//     avltrip: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 16,
//         color: '#000',
//         textAlign: 'center',
//     },
//     locationContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingVertical: 10,
//     },
//     locationText: {
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     arrow: {
//         fontSize: 20,
//     },

//     header: {
//         backgroundColor: "#1e4db7",
//         padding: 10,
//     },
//     headerText: {
//         color: "#fff",
//         fontWeight: "bold",
//         textAlign: "center",
//     },
//     content: {
//         flexDirection: "row",
//         alignItems: "center",
//         padding: 20,
//     },
//     avatar: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         marginRight: 10,
//     },
//     info: {
//         flex: 1,
//     },
//     name: {
//         fontWeight: "bold",
//         fontSize: 16,
//     },
//     price: {
//         color: "#333",
//         fontSize: 14,
//     },
//     details: {
//         fontSize: 12,
//         color: "#666",
//     },
//     bidButton: {
//         backgroundColor: "#1e4db7",
//         paddingVertical: 8,
//         paddingHorizontal: 15,
//         borderRadius: 5,
//     },
//     bidText: {
//         color: "#fff",
//         fontWeight: "bold",
//     },

//     errorText: {
//         color: 'red',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     summaryBox: {
//         backgroundColor: '#ffffff',
//         borderRadius: 8,
//         padding: 16,
//         marginBottom: 16,
//         elevation: 3,
//     },
//     heading: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 8,
//         color: '#333',
//     },
//     summaryText: {
//         fontSize: 16,
//         marginBottom: 4,
//         color: '#555',
//     },
//     detailsButton: {
//         marginTop: 8,
//         paddingVertical: 8,
//         backgroundColor: '#007bff',
//         borderRadius: 4,
//         alignItems: 'center',
//     },
//     detailsButtonText: {
//         color: '#ffffff',
//         fontWeight: 'bold',
//     },
    
//     chat: {
//         padding: 10,
//         marginVertical: 5,
//         borderRadius: 10,
//         maxWidth: '80%',
//     },
//     priceRow: {
//         padding: 10,
//         paddingTop:30,
//         borderRadius: 10,
//     },
//     consumerChat: {
//         backgroundColor: '#DCF8C6', // Light green for consumer messages (like WhatsApp)
//         alignSelf: 'flex-end', // Consumer messages on the right
//     },
//     driverChat: {
//         backgroundColor: '#E8E8E8', // Light grey for driver messages
//         alignSelf: 'flex-start', // Driver messages on the left
//     },
//     label: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#000',
//     },
//     userInfo: {
//         fontSize: 16,
//         color: '#333',
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     modalContent: {
//         width: '100%',
//         backgroundColor: '#ffffff',
//         borderRadius: 8,
//         padding: 16,
//         elevation: 4,
//     },
//     modalTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 8,
//         color: '#333',
//     },
//     modalInfo: {
//         fontSize: 16,
//         marginBottom: 8,
//         color: '#555',
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#ddd',
//         borderRadius: 4,
//         padding: 8,
//         marginBottom: 16,
//         fontSize: 16,
//     },
//     buttonGroup: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     acceptButton: {
//         flex: 1,
//         backgroundColor: '#28a745',
//         borderRadius: 4,
//         paddingVertical: 12,
//         alignItems: 'center',
//         marginRight: 4,
//     },
//     rejectButton: {
//         flex: 1,
//         backgroundColor: '#dc3545',
//         borderRadius: 4,
//         paddingVertical: 12,
//         alignItems: 'center',
//         marginHorizontal: 4,
//     },
//     submitButton: {
//         flex: 1,
//         backgroundColor: '#007bff',
//         borderRadius: 4,
//         paddingVertical: 12,
//         alignItems: 'center',
//         marginLeft: 4,
//     },
//     buttonText: {
//         color: '#ffffff',
//         fontWeight: 'bold',
//     },
//     closeButton: {
//         position: 'absolute',
//         top: 10,
//         right: 10,
//         backgroundColor: '#ddd',
//         borderRadius: 20,
//         width: 30,
//         height: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 1,
//     },
//     closeButtonText: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#333',
//     },

// });

// export default TripSummary;




// import React, { useEffect, useState, useRef, useContext } from 'react';
// import {
//     SafeAreaView,
//     View,
//     Text,
//     Image,
//     ScrollView,
//     StyleSheet,
//     ActivityIndicator,
//     RefreshControl,
//     TouchableOpacity,
//     Keyboard,
//     Modal,
//     TextInput,
//     Alert
// } from 'react-native';
// import { getSocket, closeSocket } from './SocketIO';
// import { LinearGradient } from 'expo-linear-gradient';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Ind from '../assets/images/image 10.png';
// import { API_END_POINT } from '../app.config';
// import { SocketContext } from '../SocketContext';


// const TripSummary = ({ route }) => {
//     const { tripId } = route.params;
//     const navigation = useNavigation();

//     const [keyboardVisible, setKeyboardVisible] = useState(false);
//     const [loading, setLoading] = useState(true);
//     const [socket, setSocket] = useState(null);
//     const [trip, setTrip] = useState(null);
//     // const [refreshing, setRefreshing] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);
//     const [acceptedDriverId, setAcceptedDriverId] = useState(null);
//     const [showDetails, setShowDetails] = useState(false);
//     const isMounted = useRef(true);
//     const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false); // Controls the visibility
//     const [modalVisible, setModalVisible] = useState(false);
//     const [selectedPrice, setSelectedPrice] = useState(null);
//     const [revisedPrice, setRevisedPrice] = useState('');
//     // const { socket } = useContext(SocketContext);


//     console.log("showDetails", showDetails)
//     console.log("trip", trip)
//     console.log("selectedPrice", selectedPrice)


//     useEffect(() => {
//         const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
//             setKeyboardVisible(true);
//         });
//         const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
//             setKeyboardVisible(false);
//         });

//         return () => {
//             keyboardDidShowListener.remove();
//             keyboardDidHideListener.remove();
//         };
//     }, []);

//     useEffect(() => {
//         const socketInstance = getSocket();
//         setSocket(socketInstance);

//         // return () => {
//         //     closeSocket(); // Disconnect socket on unmount
//         // };
//     }, []);

//     const fetchCounterPriceList = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`${API_END_POINT}/api/trips/${tripId}`);

//             if (isMounted.current) {
//                 setTrip(response.data.trip);
//             }
//         } catch (error) {
//             console.error('Error fetching trip history:', error);
//         } finally {
//             if (isMounted.current) {
//                 setLoading(false);
//                 // setRefreshing(false);  // Stop refresh indicator
//             }
//         }
//     };

//     const handleCounterPrice = async () => {
//         // console.log('counterPrice Event Received');
//         await fetchCounterPriceList();
//         setShowDetails(true);
//         setIsSubmitModalVisible(Number(trip?.bids?.length) % 2 === 1 ? true : false)
//     };

//     useEffect(() => {
//         handleCounterPrice();

//         return () => {
//             isMounted.current = false;
//         };
//     }, []);

//     useEffect(() => {
//         if (socket) {
//             socket.off('counterPrice', handleCounterPrice);
//             socket.on('counterPrice', handleCounterPrice);

//             return () => {
//                 socket.off('counterPrice', handleCounterPrice);
//             };
//         }
//     }, [socket]);


//     const openModal = (price) => {
//         setSelectedPrice(price);
//         setModalVisible(true);
//     };

//     const handleReject = () => {
//         console.log('Rejected:', selectedPrice);
//         setModalVisible(false);
//     };

//     const handleRevisedPrice = async (userId, vspUserId, price) => {
//         console.log('userId : ', userId, 'vspUserId :', vspUserId, 'price : ', price, 'tripId : ', tripId);
//         console.log('Revised Price:', revisedPrice);
//         const response = await axios.patch(`${API_END_POINT}/api/trips/revisedPrice`, { userId, vspUserId, price, tripId });

//         if (response.status === 200) {
//             setModalVisible(false);
//             setTrip(response.data.trip);
//             setIsSubmitModalVisible(false);
//         }
//     };

//     if (loading) {
//         return (
//             <View style={styles.loaderContainer}>
//                 <ActivityIndicator size="large" color="#007bff" />
//             </View>
//         );
//     }

//     if (!trip) {
//         return (
//             <View style={styles.errorContainer}>
//                 <Text style={styles.errorText}>No trip details found</Text>
//             </View>
//         );
//     }

//     const {
//         from,
//         to,
//         tripDate,
//         cargoDetails,
//         counterPriceList,
//         user,
//         bidder
//     } = trip;

//     const handleAccept = async (tripId, vspUserId) => {
//         console.log('Accepted:', vspUserId);
//         const response = await axios.patch(`${API_END_POINT}/api/trips/bidStatus`, { tripId, vspUserId, status: "created" });

//         if (response.status === 200) {
//             setModalVisible(false);
//             Alert.alert('Success', 'Thank you for accepting the bid');
//             navigation.navigate('TripScreen', { userId: user });
//         }
//     };

//     // console.log('tripUser', trip.bids);
//     // Handle accept and reject disable

//     const prices = counterPriceList.map((price, index) => ({
//         label: `Driver ${index + 1}`,
//         value: price.increasedCounterPrice,
//         user: price.user,
//     }));


//     return (
//         <ScrollView
//             contentContainerStyle={styles.container}
//         >
//          <Text style={styles.avltrip}>Available Bids</Text>

//          <View style={styles.locationContainer}>
//                 <Text style={styles.locationText}>
//                     <Icon name="map-marker" size={20} color="red" />{from}
//                 </Text>
//                 <Icon name="arrow-right" size={25} color="black" style={styles.arrow} />
//                 <Text style={styles.locationText}>
//                     <Icon name="map-marker" size={20} color="green" /> {to}
//                 </Text>
//             </View>


//             {showDetails && trip?.bids?.length === 0 && prices.map((price, index) => (
//                 <TouchableOpacity
//                     key={index}
//                     style={styles.priceRow}
                 
//                 >
//                                         <View style={styles.header}>
//                         <Text style={styles.headerText}>Truck driver:{price.label} </Text>
//                     </View>

//                  <View style={styles.content}>
//                      <Image
//                                          source={Ind}
//                                          style={{
//                                            height: 50,
//                                            width: 50,
//                                            borderRadius: 40,
//                                          }}
//                                        />
//                         <View style={styles.info}>
//                             <Text style={styles.name}>{price.user.fullName}</Text>
//                             <Text style={styles.price}>Truck Driver: {price.user.fullName}</Text>
//                             <Text style={styles.price}>Proposed Rate: ₹{price.value}</Text>
//                             <Text style={styles.details}>Trips Completed: </Text>
//                             <Text style={styles.details}>Ratings: ⭐⭐⭐⭐⭐</Text>
//                         </View>
//                         <TouchableOpacity style={styles.bidButton} onPress={() => openModal(price)}>
//                             <Text style={styles.bidText}>Bid</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </TouchableOpacity>
//             ))}

// {showDetails && trip?.bids?.length > 0 && (
//     <>
//         {trip.bids.map((bid, index) => (
//             <View 
//                 key={index} 
//                 style={[
//                     styles.chat,
//                     bid.role === 'consumer' ? styles.consumerChat : styles.driverChat
//                 ]}
//             >
//                 <TouchableOpacity style={styles.priceRow}>
//                     <Text style={styles.label}>
//                         {bid.role === 'consumer' ? `You:` : `Driver:`}  
//                         {bid.user && (
//                             <Text style={styles.userInfo}>  ₹{bid.role === 'consumer' ? bid.price : bid.increasedPrice || 'N/A'}</Text>
//                         )}
//                     </Text>
//                 </TouchableOpacity>
//             </View>
//         ))}

//         {/* Modal Content Always Visible */}
//         <View style={styles.modalContent}>
//             <TextInput
//                 style={[
//                     styles.input,
//                     trip?.bids?.length === 5 && { backgroundColor: '#d3d3d3' }, // Change background when disabled
//                 ]}
//                 placeholder="Enter revised price"
//                 value={revisedPrice}
//                 onChangeText={setRevisedPrice}
//                 keyboardType="numeric"
//                 editable={trip?.bids?.length !== 5} // Disable input when bids.length is 5
//             />

//             <View style={styles.buttonGroup}>
//                 <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(tripId, bidder)}>
//                     <Text style={styles.buttonText}>Accept</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={[
//                         styles.submitButton,
//                         trip?.bids?.length === 5 && { backgroundColor: '#d3d3d3' },
//                     ]}
//                     onPress={() => {
//                         handleRevisedPrice(user, trip?.bidder?.toString(), revisedPrice);
//                         setRevisedPrice('');
//                     }}
//                     disabled={trip?.bids?.length === 5}
//                 >
//                     <Text style={styles.buttonText}>Submit</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     </>
// )}

//             <Modal
//                 transparent={true}
//                 animationType="slide"
//                 visible={modalVisible}
//                 onRequestClose={() => setModalVisible(false)}
//             >
//                 <View style={styles.modalContainer}>
//                     <View style={styles.modalContent}>
//                         {/* Close Button */}
//                         <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
//                             <Text style={styles.closeButtonText}>×</Text>
//                         </TouchableOpacity>

//                         <Text style={styles.modalTitle}>Counter Offer</Text>
//                         <Text style={styles.modalInfo}>User: {selectedPrice?.user?.fullName}</Text>
//                         <Text style={styles.modalInfo}>Price: ₹{selectedPrice?.value || 'N/A'}</Text>

//                         <TextInput
//                             style={styles.input}
//                             placeholder="Enter revised price"
//                             value={revisedPrice}
//                             onChangeText={setRevisedPrice}
//                             keyboardType="numeric"
//                         />

//                         <View style={styles.buttonGroup}>
//                             <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(tripId, selectedPrice?.user?._id)}>
//                                 <Text style={styles.buttonText}>Accept</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={styles.submitButton} onPress={() => handleRevisedPrice(user, selectedPrice?.user?._id, revisedPrice)}>
//                                 <Text style={styles.buttonText}>Submit</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//         </ScrollView >
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         padding: 16,
//         backgroundColor: '#f9f9f9',
//     },
//     loaderContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#f9f9f9',
//     },
//     errorContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#f9f9f9',
//     },
//     avltrip: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 16,
//         color: '#000',
//         textAlign: 'center',
//     },
//     locationContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingVertical: 10,
//     },
//     locationText: {
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     arrow: {
//         fontSize: 20,
//     },

//     header: {
//         backgroundColor: "#1e4db7",
//         padding: 10,
//     },
//     headerText: {
//         color: "#fff",
//         fontWeight: "bold",
//         textAlign: "center",
//     },
//     content: {
//         flexDirection: "row",
//         alignItems: "center",
//         padding: 20,
//     },
//     avatar: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         marginRight: 10,
//     },
//     info: {
//         flex: 1,
//     },
//     name: {
//         fontWeight: "bold",
//         fontSize: 16,
//     },
//     price: {
//         color: "#333",
//         fontSize: 14,
//     },
//     details: {
//         fontSize: 12,
//         color: "#666",
//     },
//     bidButton: {
//         backgroundColor: "#1e4db7",
//         paddingVertical: 8,
//         paddingHorizontal: 15,
//         borderRadius: 5,
//     },
//     bidText: {
//         color: "#fff",
//         fontWeight: "bold",
//     },
//     errorText: {
//         color: 'red',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     summaryBox: {
//         backgroundColor: '#ffffff',
//         borderRadius: 8,
//         padding: 16,
//         marginBottom: 16,
//         elevation: 3,
//     },
//     heading: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 8,
//         color: '#333',
//     },
//     summaryText: {
//         fontSize: 16,
//         marginBottom: 4,
//         color: '#555',
//     },
//     detailsButton: {
//         marginTop: 8,
//         paddingVertical: 8,
//         backgroundColor: '#007bff',
//         borderRadius: 4,
//         alignItems: 'center',
//     },
//     detailsButtonText: {
//         color: '#ffffff',
//         fontWeight: 'bold',
//     },
    
//     chat: {
//         padding: 10,
//         marginVertical: 5,
//         borderRadius: 10,
//         maxWidth: '80%',
//     },
//     priceRow: {
//         padding: 10,
//         borderRadius: 10,
//     },
//     consumerChat: {
//         backgroundColor: '#DCF8C6', // Light green for consumer messages (like WhatsApp)
//         alignSelf: 'flex-end', // Consumer messages on the right
//     },
//     driverChat: {
//         backgroundColor: '#E8E8E8', // Light grey for driver messages
//         alignSelf: 'flex-start', // Driver messages on the left
//     },
//     label: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#000',
//     },
//     userInfo: {
//         fontSize: 16,
//         color: '#333',
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     modalContent: {
//         width: '100%',
//         backgroundColor: '#ffffff',
//         borderRadius: 8,
//         padding: 16,
//         elevation: 4,
//     },
//     modalTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 8,
//         color: '#333',
//     },
//     modalInfo: {
//         fontSize: 16,
//         marginBottom: 8,
//         color: '#555',
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#ddd',
//         borderRadius: 4,
//         padding: 8,
//         marginBottom: 16,
//         fontSize: 16,
//     },
//     buttonGroup: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     acceptButton: {
//         flex: 1,
//         backgroundColor: '#28a745',
//         borderRadius: 4,
//         paddingVertical: 12,
//         alignItems: 'center',
//         marginRight: 4,
//     },
//     rejectButton: {
//         flex: 1,
//         backgroundColor: '#dc3545',
//         borderRadius: 4,
//         paddingVertical: 12,
//         alignItems: 'center',
//         marginHorizontal: 4,
//     },
//     submitButton: {
//         flex: 1,
//         backgroundColor: '#007bff',
//         borderRadius: 4,
//         paddingVertical: 12,
//         alignItems: 'center',
//         marginLeft: 4,
//     },
//     buttonText: {
//         color: '#ffffff',
//         fontWeight: 'bold',
//     },
//     closeButton: {
//         position: 'absolute',
//         top: 10,
//         right: 10,
//         backgroundColor: '#ddd',
//         borderRadius: 20,
//         width: 30,
//         height: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 1,
//     },
//     closeButtonText: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#333',
//     },

// });

// export default TripSummary;

