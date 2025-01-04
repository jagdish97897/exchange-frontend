
import React, { useEffect, useState, useRef } from 'react';
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
    Keyboard
} from 'react-native';
import { getSocket, closeSocket } from './SocketIO';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';

const TripSummary = ({ route }) => {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const { tripId } = route.params;
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [trip, setTrip] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [acceptedDriverId, setAcceptedDriverId] = useState(null);
    const isMounted = useRef(true);

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

        return () => {
            closeSocket();
        };
    }, []);

    const fetchCounterPriceList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://192.168.1.4:8000/api/trips/${tripId}`);
            if (isMounted.current) {
                console.log('API Response:', response.data.trip);
                setTrip(response.data.trip);
            }
        } catch (error) {
            console.error('Error fetching trip history:', error);
        } finally {
            if (isMounted.current) {
                setLoading(false);
                setRefreshing(false);  // Stop refresh indicator
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

    const onRefresh = () => {
        setRefreshing(true);  // Trigger refresh indicator
        fetchCounterPriceList();  // Fetch new data
    };

    const acceptDriver = async (driverId) => {
        setError(null);
        setSuccess(null);
        try {
            const response = await axios.patch('http://192.168.1.4:8000/api/trips/accept-driver', {
                tripId,
                userId: driverId,  
            });
            setAcceptedDriverId(driverId);
            setSuccess('Driver accepted successfully!');
            fetchCounterPriceList();  
        } catch (error) {
            setError('Failed to accept driver');
        }
    };
    

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
                            <Image
                                source={require('../assets/images/logo-removebg-preview 1.png')}
                                style={styles.logo}
                            />
        <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Text style={styles.title}>Trip Details</Text>

            <View style={styles.card}>
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

            <Text style={styles.label}>Current Location:</Text>
            <Text style={styles.value}>
                Latitude: {currentLocation?.latitude || 'N/A'}, Longitude: {currentLocation?.longitude || 'N/A'}
            </Text>
            </View>





            <Text style={styles.title}>Cargo Details:</Text>
            <View style={styles.card}>
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
                    <View key={index} style={styles.card}>
                        <Text style={styles.value}>
                            Name: {bidder.user.fullName} Phone: {bidder.user.phoneNumber}, Bid: {bidder.counterPrice}
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.acceptButton,
                                acceptedDriverId === bidder.user._id && { backgroundColor: '#d3d3d3' },
                            ]}
                            onPress={() => acceptDriver(bidder.user._id)}
                            disabled={acceptedDriverId === bidder.user._id} 
                        >
                            <Text style={styles.buttonText}>
                                {acceptedDriverId === bidder.user._id ? 'Accepted' : 'Accept Driver'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))
            ) : (
                <Text style={styles.value}>No bidders yet</Text>
            )}
            {error && <Text style={styles.errorText}>{error}</Text>}
            {success && <Text style={styles.successText}>{success}</Text>}
        </ScrollView>

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
};

const styles = StyleSheet.create({
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
        fontSize: 18,
        color: 'red',
    },
    successText: {
        fontSize: 18,
        color: 'green',
    },
    scrollView: {
        padding: 16,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
    },
    value: {
        fontSize: 16,
        marginVertical: 4,
    },
    cargoContainer: {
        marginVertical: 16,
    },
    bidderContainer: {
        paddingVertical: 10,
    },
    acceptButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 20
    },
    smallImage: {
        width: 40,
        height: 40
    },
    footerTextContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    footerText: {
        color: '#000',
        paddingLeft: 2
    },
});

export default TripSummary;




// import React, { useEffect, useState, useRef } from 'react';
// import {
//     View,
//     Text,
//     ScrollView,
//     StyleSheet,
//     ActivityIndicator,
//     RefreshControl,
//     TouchableOpacity,
// } from 'react-native';
// import { getSocket, closeSocket } from './SocketIO';
// import axios from 'axios';

// const TripSummary = ({ route }) => {
//     const { tripId } = route.params;
//     const [loading, setLoading] = useState(true);
//     const [socket, setSocket] = useState(null);
//     const [trip, setTrip] = useState(null);
//     const [refreshing, setRefreshing] = useState(false);
//     const [error, setError] = useState(null);
//     const [success, setSuccess] = useState(null);
//     const [acceptedDriverId, setAcceptedDriverId] = useState(null);
//     const isMounted = useRef(true);

//     useEffect(() => {
//         const socketInstance = getSocket();
//         setSocket(socketInstance);

//         return () => {
//             closeSocket();
//         };
//     }, []);

//     const fetchCounterPriceList = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`http://192.168.1.4:8000/api/trips/${tripId}`);
//             if (isMounted.current) {
//                 console.log('API Response:', response.data.trip);
//                 setTrip(response.data.trip);
//             }
//         } catch (error) {
//             console.error('Error fetching trip history:', error);
//         } finally {
//             if (isMounted.current) {
//                 setLoading(false);
//                 setRefreshing(false);  // Stop refresh indicator
//             }
//         }
//     };

//     useEffect(() => {
//         fetchCounterPriceList();

//         return () => {
//             isMounted.current = false;
//         };
//     }, []);

//     useEffect(() => {
//         const handleCounterPrice = async () => {
//             console.log('Event Received');
//             await fetchCounterPriceList();
//         };

//         if (socket) {
//             socket.on('counterPrice', handleCounterPrice);

//             // Cleanup listener on unmount
//             return () => {
//                 socket.off('counterPrice', handleCounterPrice);
//             };
//         }
//     }, [socket]);

//     const onRefresh = () => {
//         setRefreshing(true);  // Trigger refresh indicator
//         fetchCounterPriceList();  // Fetch new data
//     };

//     const acceptDriver = async (driverId) => {
//         setError(null);
//         setSuccess(null);
//         try {
//             const response = await axios.patch('http://192.168.1.4:8000/api/trips/accept-driver', {
//                 tripId,
//                 userId: driverId,  
//             });
//             setAcceptedDriverId(driverId);
//             setSuccess('Driver accepted successfully!');
//             fetchCounterPriceList();  
//         } catch (error) {
//             setError('Failed to accept driver');
//         }
//     };
    

//     if (loading) {
//         return (
//             <View style={styles.loaderContainer}>
//                 <ActivityIndicator size="large" color="#0000ff" />
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
//         specialInstruction,
//         status,
//         amount,
//         currentLocation,
//         counterPriceList,
//     } = trip;

//     return (
//         <ScrollView
//             contentContainerStyle={styles.scrollView}
//             refreshControl={
//                 <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//             }
//         >
//             <Text style={styles.title}>Trip Details</Text>

//             <Text style={styles.label}>From:</Text>
//             <Text style={styles.value}>{from}</Text>

//             <Text style={styles.label}>To:</Text>
//             <Text style={styles.value}>{to}</Text>

//             <Text style={styles.label}>Trip Date:</Text>
//             <Text style={styles.value}>{new Date(tripDate).toLocaleString()}</Text>

//             <Text style={styles.label}>Status:</Text>
//             <Text style={styles.value}>{status}</Text>

//             <Text style={styles.label}>Amount:</Text>
//             <Text style={styles.value}>{amount}</Text>

//             <Text style={styles.label}>Special Instruction:</Text>
//             <Text style={styles.value}>{specialInstruction || 'N/A'}</Text>

//             <Text style={styles.label}>Current Location:</Text>
//             <Text style={styles.value}>
//                 Latitude: {currentLocation?.latitude || 'N/A'}, Longitude: {currentLocation?.longitude || 'N/A'}
//             </Text>

//             <Text style={styles.label}>Cargo Details:</Text>
//             <View style={styles.cargoContainer}>
//                 <Text style={styles.label}>Cargo Type:</Text>
//                 <Text style={styles.value}>{cargoDetails?.cargoType || 'N/A'}</Text>

//                 <Text style={styles.label}>Quote Price:</Text>
//                 <Text style={styles.value}>{cargoDetails?.quotePrice || 'N/A'}</Text>

//                 <Text style={styles.label}>Payload Weight:</Text>
//                 <Text style={styles.value}>{cargoDetails?.payloadWeight || 'N/A'}</Text>

//                 <Text style={styles.label}>Payload Dimensions:</Text>
//                 <Text style={styles.value}>
//                     {cargoDetails?.payloadLength && cargoDetails?.payloadWidth && cargoDetails?.payloadHeight
//                         ? `${cargoDetails.payloadLength}x${cargoDetails.payloadWidth}x${cargoDetails.payloadHeight} (LxWxH in feet)`
//                         : 'N/A'}
//                 </Text>
//             </View>

//             <Text style={styles.label}>Driver Price</Text>
//             {counterPriceList && counterPriceList.length > 0 ? (
//                 counterPriceList.map((bidder, index) => (
//                     <View key={index} style={styles.bidderContainer}>
//                         <Text style={styles.value}>
//                             Name: {bidder.user.fullName} Phone: {bidder.user.phoneNumber}, Bid: {bidder.counterPrice}
//                         </Text>
//                         <TouchableOpacity
//                             style={[
//                                 styles.acceptButton,
//                                 acceptedDriverId === bidder.user._id && { backgroundColor: '#d3d3d3' },
//                             ]}
//                             onPress={() => acceptDriver(bidder.user._id)}
//                             disabled={acceptedDriverId === bidder.user._id} // Disable button if driver is accepted
//                         >
//                             <Text style={styles.buttonText}>
//                                 {acceptedDriverId === bidder.user._id ? 'Accepted' : 'Accept Driver'}
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                 ))
//             ) : (
//                 <Text style={styles.value}>No bidders yet</Text>
//             )}
//             {error && <Text style={styles.errorText}>{error}</Text>}
//             {success && <Text style={styles.successText}>{success}</Text>}
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     loaderContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     errorContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     errorText: {
//         fontSize: 18,
//         color: 'red',
//     },
//     successText: {
//         fontSize: 18,
//         color: 'green',
//     },
//     scrollView: {
//         padding: 16,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//     },
//     label: {
//         fontSize: 16,
//         fontWeight: '600',
//         marginTop: 8,
//     },
//     value: {
//         fontSize: 16,
//         marginVertical: 4,
//     },
//     cargoContainer: {
//         marginVertical: 16,
//     },
//     bidderContainer: {
//         paddingVertical: 10,
//     },
//     acceptButton: {
//         backgroundColor: '#007BFF',
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderRadius: 8,
//         marginTop: 10,
//     },
//     buttonText: {
//         color: '#ffffff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });

// export default TripSummary;

