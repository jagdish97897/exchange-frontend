import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView, Platform,Keyboard
} from "react-native";

import { AntDesign, Feather, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { getSocket, closeSocket } from './SocketIO.js';


export default ({ route }) => {

    const { phoneNumber, token } = route.params;
    const [menuVisible, setMenuVisible] = useState(false);
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();
    const socket = getSocket(token);

    useEffect(() => {
        const handleNewTrip = ({ sender, message }) => {
            setTrips((previousData) => [
                ...previousData,
                { sender, message },
            ]);
            console.log('sender', sender, 'message', message);
        };

        // Add the listener
        socket.on('newTrip', handleNewTrip);

        // Cleanup the listener on unmount or dependency change
        return () => {
            socket.off('newTrip', handleNewTrip);
        };
    }, [socket]);

    socket.on("newMessage", (message) => {
        console.log("Message from server:", message);
    });

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };


    const handleReject = (tripId) => {
        console.log('Reject Trip:', tripId);
        // Implement reject functionality
    };

    const handleView = async (tripId) => {
        try {
            const response = await axios.get(`http://192.168.1.6:8000/api/trips/${tripId}`, {
                headers: { Authorization: `Bearer ${token} ` },
            });
            const tripDetails = response.data.trip;
            navigation.navigate('TripDetails', { trip: tripDetails });
        } catch (error) {
            console.error('Error fetching trip details:', error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1, marginTop: 40 }}>
                    <SafeAreaView style={styles.container}>
                        <Text style={styles.title}>Trip History</Text>

                        {loading && trips.length === 0 ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <ScrollView style={styles.tripList}>
                                {trips.map((trip) => (
                                    <View key={trip.message.tripId} style={styles.tripCard}>
                                        <Text style={styles.tripDetail}>
                                            <Text style={styles.label}>From:</Text> {trip.message.from}
                                        </Text>
                                        <Text style={styles.tripDetail}>
                                            <Text style={styles.label}>To:</Text> {trip.message.to}
                                        </Text>
                                        <Text style={styles.tripDetail}>
                                            <Text style={styles.label}>Phone Number:</Text> {trip.message.phoneNumber}
                                        </Text>
                                        <Text style={styles.tripDetail}>
                                            <Text style={styles.label}>Date:</Text>{' '}
                                            {new Date(trip.message.tripDate).toLocaleString()}
                                        </Text>
                                        <Text style={styles.tripDetail}>
                                            <Text style={styles.label}>Payload Cost:</Text>{' '}
                                            {trip.message.payloadCost}
                                        </Text>

                                        {/* Action Buttons */}
                                        <View style={styles.actionButtons}>
                                            <TouchableOpacity onPress={() => handleView(trip.message.tripId)}>
                                                <Feather
                                                    name="eye"
                                                    size={24}
                                                    color="blue"
                                                    style={styles.icon}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => handleReject(trip.message.tripId)}
                                            >
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

                    {/* Bottom Navigation */}
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
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
    // return (
    //     <TouchableWithoutFeedback onPress={toggleMenu}>
    //         <View style={{ flex: 1, marginTop: 40 }}>
    //             <SafeAreaView style={styles.container}>
    //                 <Text style={styles.title}>Trip History</Text>

    //                 {loading && trips.length === 0 ? (
    //                     <ActivityIndicator size="large" color="#0000ff" />
    //                 ) : (
    //                     <ScrollView style={styles.tripList}>
    //                         {trips.map((trip) => (
    //                             <View key={trip.message.tripId} style={styles.tripCard}>
    //                                 <Text style={styles.tripDetail}>
    //                                     <Text style={styles.label}>From:</Text> {trip.message.from}
    //                                 </Text>
    //                                 <Text style={styles.tripDetail}>
    //                                     <Text style={styles.label}>To:</Text> {trip.message.to}
    //                                 </Text>
    //                                 <Text style={styles.tripDetail}>
    //                                     <Text style={styles.label}>Date:</Text> {new Date(trip.message.tripDate).toLocaleString()}
    //                                 </Text>
    //                                 <Text style={styles.tripDetail}>
    //                                     <Text style={styles.label}>Payload Cost:</Text> {trip.message.payloadCost}
    //                                 </Text>

    //                                 {/* Action Buttons */}
    //                                 <View style={styles.actionButtons}>
    //                                     <TouchableOpacity onPress={() => handleView(trip.message.tripId)}>
    //                                         <Feather name="eye" size={24} color="blue" style={styles.icon} />
    //                                     </TouchableOpacity>
    //                                     <TouchableOpacity onPress={() => handleReject(trip.message.tripId)}>
    //                                         <Entypo name="circle-with-cross" size={24} color="orange" style={styles.icon} />
    //                                     </TouchableOpacity>
    //                                 </View>
    //                             </View>
    //                         ))}
    //                     </ScrollView>
    //                 )}
    //             </SafeAreaView>

    //             {/* Bottom Navigation */}
    //             <View style={styles.bottomNav}>
    //                 <TouchableOpacity>
    //                     <AntDesign name="home" size={24} color="white" />
    //                 </TouchableOpacity>
    //                 <TouchableOpacity style={styles.shopButton}>
    //                     <Entypo name="shop" size={24} color="white" />
    //                 </TouchableOpacity>
    //                 <TouchableOpacity onPress={() => navigation.navigate('Profile', { phoneNumber })}>
    //                     <AntDesign name="user" size={24} color="white" />
    //                 </TouchableOpacity>
    //             </View>
    //         </View>
    //     </TouchableWithoutFeedback>
    // );
};

const styles = StyleSheet.create({
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
});



// import React, { useState, useEffect } from 'react';
// import { SafeAreaView, View, Text, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, TextInput, Image, Modal, Button } from "react-native";
// import Autocomplete from "react-google-autocomplete";
// import { AntDesign, Feather, Entypo } from '@expo/vector-icons';
// import { Ionicons } from '@expo/vector-icons';
// import LinearGradient from 'react-native-linear-gradient';
// import { useNavigation } from '@react-navigation/native';
// import Ind from '../assets/images/image 10.png';
// import axios from 'axios';
// import { checkAndRequestLocationPermission } from './ConsumerDashboard.js';
// import { getSocket, closeSocket } from './SocketIO.js';



// export default ({ route }) => {
//     const { phoneNumber, token } = route.params;
//     // console.log(phoneNumber)
//     const [menuVisible, setMenuVisible] = useState(false);
//     const [ownerId, setOwnerId] = useState('');
//     const [consumerTrip, setConsumerTrip] = useState([]);

//     const socket = getSocket(token);
//     const navigation = useNavigation();
//     const [currentLocation, setCurrentLocation] = useState({
//         latitude: '',
//         longitude: '',
//     });

//     // useEffect( get driver location and update vehicle location
//     //)

//     useEffect(() => {


//         socket.on("newMessage", (message) => {
//             console.log("Message from server:", message);
//         });

//         return () => {
//             closeSocket(); // Disconnect socket on unmount
//         };
//     }, [token]);

//     const handleDocumentsClick = () => {
//         // Navigate to the Documents page
//         navigation.navigate('Documents');
//     };

//     const [modalVisible, setModalVisible] = useState(false);


//     // // Listening for the 'newtrip' event from socket
//     // socket.on('newTrip', ({ sender, message }) => {
//     //     setConsumerTrip((previousData) => {
//     //         // Update the state by appending the new trip to the previous data
//     //         return [...previousData, { sender, message }];
//     //     });

//     //     console.log('consumerTrip', consumerTrip);
//     // });

//     socket.on('newTrip', ({ sender, message }) => {
//         setConsumerTrip((previousData) => [
//             ...previousData,
//             {
//                 sender: typeof sender === 'object' ? JSON.stringify(sender) : sender,
//                 message: typeof message === 'object' ? JSON.stringify(message) : message,
//             },
//         ]);
//     });


//     const openModal = () => {
//         setModalVisible(true);
//     };

//     const closeModal = () => {
//         setModalVisible(false);
//     };

//     const handleAccountTypeClick = () => {
//         // Navigate to the Account Type page
//         navigation.navigate('AccountType');
//     };

//     const handleDeleteAccountClick = () => {
//         // Navigate to the Delete Account page
//         navigation.navigate('DeleteAccount');
//     };

//     const handleLogoutClick = () => {
//         // Navigate to the Logout page
//         navigation.navigate('Logout');
//     };

//     const navigateBack = () => {
//         // Add navigation logic to go back to the previous page
//     };

//     const toggleMenu = () => {
//         setMenuVisible(!menuVisible);
//     };

//     const navigateToSettings = () => {
//         navigation.navigate('Settings')
//     };

//     const navigateToHelp = () => {
//         // Add navigation logic to go to help page
//     };

//     const navigateToAbout = () => {
//         navigation.navigate('About')
//     };

//     const navigateToLegal = () => {
//         navigation.navigate('Legal')
//     };

//     const [name, setName] = useState('');
//     const [mobileNumber, setMobileNumber] = useState('');
//     const [gstin, setGstin] = useState('');
//     const [photo, setPhoto] = useState(null);
//     const [image, setImage] = useState(null);

//     const pickImage = async () => {
//         // No permissions request is necessary for launching the image library
//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.All,
//             allowsEditing: true,
//             aspect: [4, 3],
//             quality: 1,
//         });

//         // console.log(result);

//         if (!result.canceled) {
//             setImage(result.assets[0].uri);
//         }
//     };
//     // Function to handle photo selection
//     const handlePhotoSelection = () => {
//         // Logic to select a photo from the device
//         // Update the 'photo' state with the selected photo URI
//     };

//     // Function to handle form submission
//     const handleSubmit = () => {
//         // Logic to handle form submission
//     };
//     useEffect(() => {
//         // Fetch user data from API
//         const fetchUserData = async () => {
//             try {
//                 const response = await axios.get(`http://192.168.1.6:8000/api/v1/users/user/${phoneNumber}`);
//                 const { _id } = response.data;
//                 setOwnerId(_id); // Set the user ID
//             } catch (error) {
//                 console.error("Error fetching user data:", error);
//             }
//         };
//         fetchUserData();
//     }, [phoneNumber]);

//     useEffect(() => {
//         (async () => {
//             try {
//                 const { latitude, longitude } = await checkAndRequestLocationPermission();

//                 if (latitude) {
//                     setCurrentLocation((prevLocation) => ({
//                         ...prevLocation,
//                         latitude,
//                     }));
//                 }

//                 if (longitude) {
//                     setCurrentLocation((prevLocation) => ({
//                         ...prevLocation,
//                         longitude,
//                     }));
//                 }
//             } catch (error) {
//                 console.log('Error in checking or requesting location permission:', error);
//             }
//         })();
//     }, []);


//     useEffect(() => {
//         const updateLocation = async () => {
//             if (!currentLocation.latitude || !currentLocation.longitude) return;

//             try {
//                 const response = await axios.patch(
//                     'http://192.168.1.6:8000/api/vehicles/location',
//                     { currentLocation, driverPhoneNumber: phoneNumber }
//                 );

//                 if (response.status == 200) {
//                     console.log('Location updated!');
//                 } else {
//                     console.log('Failed to update location.');
//                 }
//             } catch (error) {
//                 console.error('Error updating location:', error.message);
//             }
//         };

//         updateLocation();
//     }, [currentLocation.latitude, currentLocation.longitude]);

//     return (
//         <TouchableWithoutFeedback onPress={toggleMenu}>
//             <View style={{ flex: 1, marginTop: 40 }}>
//                 <View className="bg-blue-100" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 60, marginBottom: 20, paddingHorizontal: 30 }}>
//                     {/* Left Arrow */}
//                     <TouchableOpacity onPress={navigateBack}>
//                         <AntDesign name="arrowleft" size={24} color="black" />
//                     </TouchableOpacity>
//                     <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
//                         <View className="ml-[160px]">
//                             <Feather name="headphones" size={24} color="black" />
//                         </View>
//                         <View className="ml-[20px]">
//                             <Ionicons name="notifications-outline" size={24} color="black" />
//                         </View>
//                     </View>
//                     {/* Right Menu */}
//                     <TouchableOpacity onPress={toggleMenu}>
//                         <Feather name="menu" size={24} color="black" />
//                     </TouchableOpacity>
//                 </View>

//                 {/* Menu Options */}
//                 {menuVisible && (
//                     <View style={{ position: 'absolute', top: 75, right: 20, backgroundColor: 'white', padding: 10, borderRadius: 5, elevation: 5, zIndex: 2 }}>
//                         <TouchableOpacity onPress={navigateToSettings} style={{ marginBottom: 10 }}>
//                             <Text>Settings</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity onPress={navigateToHelp} style={{ marginBottom: 10 }}>
//                             <Text>Help</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity onPress={navigateToAbout} style={{ marginBottom: 10 }}>
//                             <Text>About</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity onPress={navigateToLegal}>
//                             <Text>Legal</Text>
//                         </TouchableOpacity>
//                     </View>
//                 )}

//                 <View className="flex-row gap-5 bg-blue-100">
//                     <Text className="text-lg pb-2 font-bold pl-[70px]">Dashboard</Text>
//                     <Text onPress={() => { navigation.navigate('Trips') }} className="text-lg font-bold pl-[80px]">Trips</Text>
//                 </View>

//                 <SafeAreaView style={styles.container}>
//                     <View className="flex-row bg-blue-100" style={styles.topBox}>
//                         <Image source={Ind} style={{ width: 80, height: 50, width: 50, borderRadius: 40 }} />
//                         <Text className="pl-8" style={{ fontSize: 30, fontWeight: '700' }}>TWCPL</Text>
//                     </View>

//                     <View style={styles.selectionContainer}>
//                         <View style={styles.cardContainer}>
//                             <TouchableOpacity
//                                 style={styles.card}
//                                 onPress={() => navigation.navigate("AddVehicleScreen", { ownerId, token })}
//                             >
//                                 <Text style={styles.cardText}>Add Vehicle</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity
//                                 style={styles.card}
//                                 onPress={() => navigation.navigate("GetVehicleScreen", { ownerId })}
//                             >
//                                 <Text style={styles.cardText}>View & Update Vehicle</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>

//                     <View style={styles.ctaWrapper}>
//                         <TouchableOpacity style={styles.cta}>
//                             <Entypo name="wallet" size={24} color="black" />
//                             <Text>Wallet</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity style={styles.cta}>
//                             <Feather name="shield" size={24} color="black" />
//                             <Text>Insurance</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity style={styles.cta}>
//                             <Feather name="headphones" size={24} color="black" />
//                             <Text>Help & FAQ</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </SafeAreaView>

//                 <View className="flex-1">
//                     <Text className="pl-[100px] bg-blue-300 h-[30px] text-xl">Company Newsletter</Text>
//                 </View>


//                 <View className="px-5 py-2 bg-blue-100">
//                     <Text className="text-lg font-bold">Consumer Trips</Text>
//                     {consumerTrip.length === 0 ? (
//                         <Text>No trips available</Text>
//                     ) : (
//                         consumerTrip.map((trip, index) => (
//                             <View key={index} style={{ padding: 10, backgroundColor: 'white', marginVertical: 5, borderRadius: 5, elevation: 2 }}>
//                                 <Text>
//                                     <Text style={{ fontWeight: 'bold' }}>Sender:</Text> {typeof trip.sender === 'string' ? trip.sender : JSON.stringify(trip.sender)}
//                                 </Text>
//                                 <Text>
//                                     <Text style={{ fontWeight: 'bold' }}>Message:</Text> {typeof trip.message === 'string' ? trip.message : JSON.stringify(trip.message)}
//                                 </Text>
//                             </View>
//                         ))
//                     )}
//                 </View>


//                 <View style={{ backgroundColor: 'black', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 20 }}>
//                     <TouchableOpacity>
//                         <AntDesign name="home" size={24} color="white" />
//                     </TouchableOpacity>
//                     <TouchableOpacity style={{ backgroundColor: 'blue', borderRadius: 24, padding: 10 }}>
//                         <Entypo name="shop" size={24} color="white" />
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => navigation.navigate('Profile', { phoneNumber })}>
//                         <AntDesign name="user" size={24} color="white" />
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </TouchableWithoutFeedback>
//     );
// }

// const styles = new StyleSheet.create({
//     cardContainer: {
//         flexDirection: 'row', // Or 'column' depending on your layout preference
//         justifyContent: 'space-between', // Adjust spacing between cards
//         alignItems: 'center', // Align the cards vertically
//         flexWrap: 'wrap', // Allows cards to wrap to the next row if needed
//         width: '100%',
//     },
//     selectionContainer: {
//         borderWidth: 2,
//         borderColor: '#80eae0',
//         backgroundColor: '#93aed2',
//         borderRadius: 30,
//         width: '90%',
//         position: 'absolute',
//         top: 120,
//         left: '5%',
//         height: 250,
//         padding: 20,
//         flexDirection: 'row',
//         gap: 16,
//         justifyContent: 'center',
//     },
//     card: {
//         width: 140,
//         height: 100,
//         backgroundColor: '#ffffff',
//         borderRadius: 8,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//         elevation: 5,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     cardText: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#333333',
//     },

//     container: {
//         flex: 1,
//         backgroundColor: '#FFF'
//     },
//     topBox: {
//         // backgroundColor: '#e7feff',
//         // backgroundColor: 'linear-gradient(to right, #70ACC1, #6F9C9F)',
//         height: 250,
//         padding: 50
//     },

//     ctaWrapper: {
//         flexDirection: 'row',
//         justifyContent: 'space-evenly',
//         marginTop: 200
//     },
//     cta: {
//         padding: 15,
//         borderRadius: 10,
//         shadowColor: '#1E40D8',
//         shadowOffset: 0,
//         shadowOpacity: 4,
//         borderColor: '#80eae0',
//         borderWidth: 2,
//         shadowRadius: 10,
//         height: 90,
//         width: 110,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#ADD8E6',

//     }
// })
