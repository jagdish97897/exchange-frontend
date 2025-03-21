import React, { useState, useEffect, useRef, useContext } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, Text, StyleSheet, View, Image, Keyboard, TextInput, TouchableOpacity, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { API_END_POINT } from '../app.config';
import { getSocket, closeSocket } from './SocketIO';
import { SocketContext } from '../SocketContext.js';
import { FontAwesome } from '@expo/vector-icons';



export default function TripDetails({ route }) {
    const { tripId, phoneNumber } = route.params;
    const [counterPrice, setCounterPrice] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [user, setUser] = useState(null);
    const [accepted, setAccepted] = useState(false);
    const [submitButtonVisible, setSubmitButtonVisible] = useState(false);
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);
    const isMounted = useRef(true);
    // const { socket } = useContext(SocketContext);

    useEffect(() => {
        const socketInstance = getSocket();
        setSocket(socketInstance);

        // return () => {
        //     closeSocket(); // Disconnect socket on unmount
        // };
    }, []);

    const fetchTrips = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_END_POINT}/api/trips/${tripId}`);
            // console.log('API Response:', response.data.trip);
            if (isMounted.current && response.status === 200) {
                setTrip(response.data.trip);
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
        fetchTrips();

        return () => {
            isMounted.current = false;
        };
    }, [tripId]);

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

                const response = await axios.get(`${API_END_POINT}/api/v1/users/${phoneNumber}`);
                setUser(response.data); // Set the user state with the fetched data.
            } catch (error) {
                console.error("Error fetching user info:", error.message); // Log or handle the error.
            }
        };

        fetchUserInfo();
    }, [phoneNumber]);

    const handleSubmit = async () => {
        try {
            const response = await axios.patch(`${API_END_POINT}/api/trips/counterPrice`,
                { counterPrice, userId: user._id, tripId: trip._id }
            );

            if (response.status === 200) {
                Alert.alert('Update', 'Counter Price submitted successfully');
                setSubmitButtonVisible(true);
                setTrip(response.data.trip);
                setCounterPrice('');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleBidReject = () => { };

    const handleBidAccept = async () => {
        await axios.patch(`${API_END_POINT}/api/trips/status`, {
        });
    };

    useEffect(() => {
        const handleFetchTrips = async () => {
            setSubmitButtonVisible(true);
            console.log('revisedPrice event recieved');
            await fetchTrips();
        }

        if (socket) {
            socket.off('revisedPrice', handleFetchTrips);
            socket.on('revisedPrice', handleFetchTrips);

            return () => {
                socket.off('revisedPrice', handleFetchTrips);
            }
        }
    }, [socket]);

    const firstCounterPrice = trip && trip.counterPriceList.length > 0 && user ? trip.counterPriceList.find(list => list.user._id === user._id)?.counterPrice : '';

    return (
        <LinearGradient colors={['#FFF', '#FFF']} style={{ flex: 1 }}>
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
                    <Text style={styles.title}>Exchange</Text>


                    {trip && (  <TouchableOpacity style={styles.card}>
      <Image source={require('../assets/images/mapicon.png')} style={styles.tripImage} />
      <View style={styles.tripDetails}>
        <Text style={styles.tripText}>Trip Id:{trip._id}</Text>
        <View style={styles.routeContainer}>
          <FontAwesome name="map-marker" size={18} color="green" />
          <Text style={styles.locationText}>{' '}{trip.from}{' '}</Text>
          <Text style={styles.arrow}>{'➝'}</Text>
          <FontAwesome name="map-marker" size={18} color="red" />
          <Text style={styles.locationText}>{' '}{trip.to}</Text>
        </View>
        <Text style={styles.eta}>{`ETA: ${trip.eta ?? 'N/A'}`}</Text>
      </View>
    </TouchableOpacity>)}

{/* Display Consumer's Reduced Quote Price at the Top */}
{trip?.cargoDetails?.reducedQuotePrice !== undefined && (
    <View style={styles.topPriceContainer}>
        <Text style={styles.label}>
            Consumer:  
            <Text style={styles.userInfo}> ₹{trip.cargoDetails.reducedQuotePrice}</Text>
        </Text>
    </View>
)}

{/* Display Submitted Bids */}
{trip?.bids?.length > 0 && trip.bids.map((bid, index) => (
    <View 
        key={index} 
        style={[
            styles.chat,
            bid.role === 'consumer' ? styles.consumerChat : styles.driverChat
        ]}
    >
        <TouchableOpacity style={styles.priceRow} activeOpacity={0.7}>
            <Text style={styles.label}>
                {bid.role === 'consumer' ? 'Consumer:' : 'You:'}  
                <Text style={styles.userInfo}> ₹
                    {bid.role === 'consumer' 
                        ? (bid.reducedPrice !== undefined ? bid.reducedPrice : 'N/A') 
                        : (bid.price !== undefined ? bid.price : 'N/A')
                    }
                </Text>
            </Text>
        </TouchableOpacity>
    </View>
))}           
                        {firstCounterPrice && trip.bids.length === 0 && <Text style={styles.detail}>
                            <Text style={styles.label}>Counter Price: </Text> {firstCounterPrice}
                        </Text>}

                        {(!firstCounterPrice || (trip && trip.bids.length > 0 && trip.bids.length % 2 === 0)) && (<View style={styles.counterPriceContainer}>
                            <Text style={styles.label}>Counter Price: </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Counter Price"
                                value={counterPrice}
                                onChangeText={(text) => setCounterPrice(text)}
                                keyboardType="numeric"
                            />
                        </View>)}

                        {(!firstCounterPrice || (trip && trip.bids.length > 0 && trip.bids.length % 2 === 0)) && <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>}

                </KeyboardAwareScrollView>
            </SafeAreaView>
        </LinearGradient >
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
        color: '#000',
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
    label1: {
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    card: { flexDirection: "row", backgroundColor: "#fff", padding: 10, borderRadius: 10, marginBottom: 10, elevation: 2, backgroundColor: '#0052CC', },
    tripImage: { width: 80, height: 80,  },
    tripDetails: { flex: 1 },
    tripText: { fontSize: 16, fontWeight: "bold", color: "white" },
    routeContainer: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
    locationText: { fontSize: 14, color: "white" },
    arrow: { fontSize: 14, marginHorizontal: 5 },
    eta: { fontSize: 14, color: "gray" },
     
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
    driverChat: {
        backgroundColor: '#DCF8C6', // Light green for driver messages (Now on the right)
        alignSelf: 'flex-end', // Your (driver) messages on the right
    },
    consumerChat: {
        backgroundColor: '#E8E8E8', // Light grey for consumer messages
        alignSelf: 'flex-start', // Consumer messages on the left
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    userInfo: {
        fontSize: 16,
        color: '#333',
        fontWeight: 'bold',
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
    topPriceContainer: {
        padding: 20,
        borderRadius: 10,// Spacing before the bid list
        backgroundColor: '#E8E8E8', // Light grey for consumer messages
        alignSelf: 'flex-start',
    },
    
});




// import React, { useState, useEffect, useRef, useContext } from 'react';
// import { LinearGradient } from 'expo-linear-gradient';
// import { SafeAreaView, Text, StyleSheet, View, Image, Keyboard, TextInput, TouchableOpacity, Alert } from 'react-native';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import axios from 'axios';
// import { API_END_POINT } from '../app.config';
// import { getSocket, closeSocket } from './SocketIO';
// import { SocketContext } from '../SocketContext.js';



// export default function TripDetails({ route }) {
//     const { tripId, phoneNumber } = route.params;
//     const [counterPrice, setCounterPrice] = useState('');
//     const [keyboardVisible, setKeyboardVisible] = useState(false);
//     const [user, setUser] = useState(null);
//     const [accepted, setAccepted] = useState(false);
//     const [submitButtonVisible, setSubmitButtonVisible] = useState(false);
//     const [trip, setTrip] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [socket, setSocket] = useState(null);
//     const isMounted = useRef(true);
//     // const { socket } = useContext(SocketContext);

//     useEffect(() => {
//         const socketInstance = getSocket();
//         setSocket(socketInstance);

//         // return () => {
//         //     closeSocket(); // Disconnect socket on unmount
//         // };
//     }, []);

//     const fetchTrips = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`${API_END_POINT}/api/trips/${tripId}`);
//             // console.log('API Response:', response.data.trip);
//             if (isMounted.current && response.status === 200) {
//                 setTrip(response.data.trip);
//             }
//         } catch (error) {
//             console.error('Error fetching trip history:', error);
//         } finally {
//             if (isMounted.current) {
//                 setLoading(false);
//             }
//         }
//     };

//     useEffect(() => {
//         fetchTrips();

//         return () => {
//             isMounted.current = false;
//         };
//     }, [tripId]);

//     // console.log('socket', socket.fetchSockets());

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
//         const fetchUserInfo = async () => {
//             try {
//                 if (!phoneNumber) return; // Guard clause to prevent unnecessary API calls.

//                 const response = await axios.get(`${API_END_POINT}/api/v1/users/${phoneNumber}`);
//                 setUser(response.data); // Set the user state with the fetched data.
//             } catch (error) {
//                 console.error("Error fetching user info:", error.message); // Log or handle the error.
//             }
//         };

//         fetchUserInfo();
//     }, [phoneNumber]);

//     const handleSubmit = async () => {
//         try {
//             const response = await axios.patch(`${API_END_POINT}/api/trips/counterPrice`,
//                 { counterPrice, userId: user._id, tripId: trip._id }
//             );

//             if (response.status === 200) {
//                 Alert.alert('Update', 'Counter Price submitted successfully');
//                 setSubmitButtonVisible(true);
//                 setTrip(response.data.trip);
//                 setCounterPrice('');
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const handleBidReject = () => { };

//     const handleBidAccept = async () => {
//         await axios.patch(`${API_END_POINT}/api/trips/status`, {
//         });
//     };

//     useEffect(() => {
//         const handleFetchTrips = async () => {
//             setSubmitButtonVisible(true);
//             console.log('revisedPrice event recieved');
//             await fetchTrips();
//         }

//         if (socket) {
//             socket.off('revisedPrice', handleFetchTrips);
//             socket.on('revisedPrice', handleFetchTrips);

//             return () => {
//                 socket.off('revisedPrice', handleFetchTrips);
//             }
//         }
//     }, [socket]);

//     // if (trip) {
//     //     console.log('TD&&&&&&', trip.counterPriceList);
//     // }

//     // const firstCounterPrice = '@@@@';

//     const firstCounterPrice = trip && trip.counterPriceList.length > 0 && user ? trip.counterPriceList.find(list => list.user._id === user._id)?.counterPrice : '';

//     return (
//         <LinearGradient colors={['#06264D', '#FFF']} style={{ flex: 1 }}>
//             <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 40 }}>
//                 <KeyboardAwareScrollView
//                     resetScrollToCoords={{ x: 0, y: 0 }}
//                     contentContainerStyle={styles.container}
//                     scrollEnabled={true}
//                     enableAutomaticScroll={true}
//                     enableOnAndroid={true}
//                     extraScrollHeight={100}
//                     showsVerticalScrollIndicator={false}
//                     showsHorizontalScrollIndicator={false}
//                 >
//                     <Text style={styles.title}>Trip Details</Text>
//                     {trip && (<View style={styles.card}>
//                         <Text style={styles.detail}>
//                             <Text style={styles.label}>From: </Text> {trip.from}
//                         </Text>
//                         <Text style={styles.detail}>
//                             <Text style={styles.label}>To: </Text> {trip.to}
//                         </Text>
//                         <Text style={styles.detail}>
//                             <Text style={styles.label}>Date: </Text> {new Date(trip.tripDate).toLocaleString()}
//                         </Text>
//                         <Text style={styles.detail}>
//                             <Text style={styles.label}>Cargo Type: </Text> {trip.cargoDetails.cargoType}
//                         </Text>
//                         <Text style={styles.detail}>
//                             <Text style={styles.label}>Payload Weight: </Text> {trip.cargoDetails.payloadWeight}
//                         </Text>
//                         <Text style={styles.detail}>
//                             <Text style={styles.label}>Payload Dimensions (LxWxH): </Text>
//                             {trip.cargoDetails.payloadLength} x {trip.cargoDetails.payloadWidth} x{' '}
//                             {trip.cargoDetails.payloadHeight}
//                         </Text>
//                         <Text style={styles.detail}>
//                             <Text style={styles.label}>Status: </Text> {trip.status}
//                         </Text>
//                         <Text style={styles.detail}>
//                             <Text style={styles.label}>Quote Price: </Text> {trip.cargoDetails.reducedQuotePrice}
//                         </Text>


//                         {trip?.bids?.length > 0 && trip.bids.map((bid, index) => (
//                             <Text style={[styles.detail, { fontWeight: 'bold' }]}
//                                 key={index}
//                             >
//                                 {bid.role === 'consumer' ? 'Revised Price:' : 'Counter Price:'}
//                                 {bid.user && (<Text >  ₹{bid.role === 'consumer' ? bid.reducedPrice : bid.price || 'N/A'}</Text>)}
//                             </Text>
//                         ))}

//                         {firstCounterPrice && trip.bids.length === 0 && <Text style={styles.detail}>
//                             <Text style={styles.label}>Counter Price: </Text> {firstCounterPrice}
//                         </Text>}

//                         {(!firstCounterPrice || (trip && trip.bids.length > 0 && trip.bids.length % 2 === 0)) && (<View style={styles.counterPriceContainer}>
//                             <Text style={styles.label}>Counter Price: </Text>
//                             <TextInput
//                                 style={styles.input}
//                                 placeholder="Enter Counter Price"
//                                 value={counterPrice}
//                                 onChangeText={(text) => setCounterPrice(text)}
//                                 keyboardType="numeric"
//                             />
//                         </View>)}

//                         {(!firstCounterPrice || (trip && trip.bids.length > 0 && trip.bids.length % 2 === 0)) && <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//                             <Text style={styles.buttonText}>Submit</Text>
//                         </TouchableOpacity>}
//                     </View>)}
//                 </KeyboardAwareScrollView>

//                 {!keyboardVisible && (
//                     <View style={styles.footer}>
//                         <Image
//                             source={require('../assets/images/mantra.jpg')}
//                             style={styles.smallImage}
//                         />
//                         <View style={styles.footerTextContainer}>
//                             <Text style={styles.footerText}>Made in</Text>
//                             <Image
//                                 source={require('../assets/images/image 10.png')}
//                                 style={styles.smallImage}
//                             />
//                         </View>
//                         <Image
//                             source={require('../assets/images/make-in-India-logo.jpg')}
//                             style={styles.smallImage}
//                         />
//                     </View>
//                 )}
//             </SafeAreaView>
//         </LinearGradient >
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,

//     },
//     title: {
//         fontSize: 28,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         marginBottom: 24,
//         color: '#FFF',
//     },
//     card: {
//         backgroundColor: '#ffffff',
//         borderRadius: 10,
//         padding: 16,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//         elevation: 4,
//     },
//     detail: {
//         fontSize: 16,
//         marginBottom: 12,
//         color: '#34495e',
//     },
//     label: {
//         fontWeight: 'bold',
//         color: '#2c3e50',
//     },
//     footer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-around',
//         marginTop: 20,
//     },
//     smallImage: {
//         width: 40,
//         height: 40,
//     },
//     footerTextContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     footerText: {
//         color: '#000',
//         paddingLeft: 2,
//     },
//     input: {
//         flex: 1,
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 5,
//         padding: 10,
//         fontSize: 16,
//         marginLeft: 8,
//     },
//     counterPriceContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 16,
//     },
//     button: {
//         backgroundColor: '#2c3e50',
//         borderRadius: 5,
//         padding: 12,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: '#fff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });
