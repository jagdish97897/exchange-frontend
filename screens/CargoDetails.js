import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    SafeAreaView,
    View,
    Text,
    TextInput,
    Button,
    Image,
    StyleSheet,
    Keyboard,
    Alert,
    TouchableOpacity,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { API_END_POINT } from '../app.config';

export const getCurrentDate = (today) => {
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
};


const today = new Date(); // Current date
const twoMonthsAfter = new Date();
twoMonthsAfter.setMonth(today.getMonth() + 2);

const CargoDetails = ({ route }) => {
    const navigation = useNavigation();
    const { from, to, phoneNumber, currentLocation, userId } = route.params;
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [cargoType, setCargoType] = useState('');
    const [quotePrice, setQuotePrice] = useState('');
    const [payloadWeight, setPayloadWeight] = useState('');
    const [payloadHeight, setPayloadHeight] = useState('');
    const [payloadLength, setPayloadLength] = useState('');
    const [payloadWidth, setPayloadWidth] = useState('');
    const [tripDate, setTripDate] = useState(new Date());
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [specialInstruction, setSpecialInstruction] = useState('');
    const [isChecked, setIsChecked] = useState(false);

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
    const handleSubmit = async () => {
        if (!cargoType || !quotePrice || !payloadWeight) {
            Alert.alert('Validation Error', 'Cargo type, payload cost, and payload weight are required!');
            return;
        }

        const cargoDetails = {
            cargoType,
            quotePrice: parseFloat(quotePrice),
            payloadWeight: parseFloat(payloadWeight),
            payloadHeight: payloadHeight ? parseFloat(payloadHeight) : null,
            payloadLength: payloadLength ? parseFloat(payloadLength) : null,
            payloadWidth: payloadWidth ? parseFloat(payloadWidth) : null,
        };

        try {
            const response = await axios.post(`${API_END_POINT}/api/trips/create`, {
                from,
                to,
                phoneNumber,
                currentLocation,
                cargoDetails,
                tripDate,
                specialInstruction,
            });

            if (response.status === 200) {
                Alert.alert('Cargo Details Submitted', 'Your cargo details have been successfully submitted!');

                // Clear form fields after successful submission
                setCargoType('');
                setQuotePrice('');
                setPayloadWeight('');
                setPayloadHeight('');
                setPayloadLength('');
                setPayloadWidth('');
                setTripDate(new Date());
                setSpecialInstruction('');

                // Navigate to the desired screen
                navigation.navigate('TripScreen', { userId });
            }
        } catch (error) {
            console.log('Error while submitting cargo details:', error);
        }
    };


    return (

        <LinearGradient colors={['#06264D', '#FFF']} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 40 }}>
            <Text style={styles.title}>Exchange</Text>
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
                    
                    <View className=" p-4">
                        <View style={styles.selectionContainer}>
                            <View style={styles.inputGroup}>
                                <View style={styles.row}>
                                    <Ionicons name="location" size={24} color="red" />

                                    <Text style={styles.label}>From</Text>
                                </View>
                                <TextInput
                                    value={from} className="bg-white p-2 rounded-md" placeholder="Enter pickup location"
                                />
                            </View>
                            <Ionicons name="arrow-down" size={30} color="white" style={styles.arrow} />
                            <View style={styles.inputGroup}>
                                <View style={styles.row}>
                                    <Ionicons name="location" size={24} color="green" />
                                    <Text className="text-white text-lg mb-1">From</Text>
                                </View>
                                <TextInput value={to} className="bg-white p-2 rounded-md" placeholder="Enter pickup location" />
                            </View>

                        </View>
     
 
         
                        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                            <View className="bg-white rounded-t-3xl p-5">
                                {/* Cargo Type */}
                                <View className="flex-row justify-between mb-3">
                                    <View className="w-1/2 pr-2">
                                        <Text className="text-gray-600 mb-1">Cargo Type</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Cargo type"
                                            value={cargoType}
                                            onChangeText={setCargoType}
                                        />
                                    </View>
                                    {/* Payload Weight */}
                                    <View className="w-1/2 pl-2">
                                        <Text className="text-gray-600 mb-1">Payload Weight</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Payload weight"
                                            keyboardType="numeric"
                                            value={payloadWeight}
                                            onChangeText={setPayloadWeight}
                                        />
                                    </View>
                                </View>
                                {/* Payload Dimensions */}
                                <View className="flex-row justify-between mb-3">
                                    <View className="w-1/2 pr-2">
                                        <Text className="text-gray-600 mb-1">Payload Height (in feet)</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Payload height"
                                            keyboardType="numeric"
                                            value={payloadHeight}
                                            onChangeText={setPayloadHeight}
                                        />
                                    </View>
                                    <View className="w-1/2 pl-2">
                                        <Text className="text-gray-600 mb-1">Payload Length (in feet)</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Payload length"
                                            keyboardType="numeric"
                                            value={payloadLength}
                                            onChangeText={setPayloadLength}
                                        />
                                    </View>
                                </View>
                                <View className="flex-row justify-between mb-3">
                                    <View className="w-1/2 pr-2">
                                        <Text className="text-gray-600 mb-1">Payload Width (in feet)</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Payload width"
                                            keyboardType="numeric"
                                            value={payloadWidth}
                                            onChangeText={setPayloadWidth}
                                        />
                                    </View>
                                    {/* Trip Date */}
                                    <View className="w-1/2 pl-2">
                                        <Text className="text-gray-600 mb-1">Trip Date</Text>
                                        <TouchableOpacity
                                            style={styles.dateInput}
                                            onPress={() => {
                                                setIsDatePickerOpen(true);
                                            }}
                                        >
                                            <Text>{getCurrentDate(tripDate)}</Text>
                                        </TouchableOpacity>
                                        <DatePicker
                                            modal
                                            open={isDatePickerOpen}
                                            date={tripDate}
                                            onConfirm={(date) => {
                                                setIsDatePickerOpen(false);
                                                setTripDate(date);
                                            }}
                                            onCancel={() => {
                                                setIsDatePickerOpen(false);
                                            }}
                                        />
                                    </View>
                                </View>
                                {/* Special Instruction */}
                                <View className="flex-row justify-between mb-3">
                                    <View className="w-1/2 pr-2">
                                        <Text className="text-gray-600 mb-1">Special Instruction</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Special instruction"
                                            value={specialInstruction}
                                            onChangeText={setSpecialInstruction}
                                        />

                                    </View>

                                    <View className="w-1/2 pl-2">

                                        {/* Quote Price */}
                                        <Text className="text-gray-600 mb-1">Quote Price</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Quote cost"
                                            keyboardType="numeric"
                                            value={quotePrice}
                                            onChangeText={setQuotePrice}
                                        />
                                    </View>
                                </View>


                                <View className="flex-row items-center mt-3">
                                    <TouchableOpacity onPress={() => setIsChecked(!isChecked)}>
                                        <Icon
                                            name={isChecked ? "check-box" : "check-box-outline-blank"}
                                            size={24}
                                            color={isChecked ? "#007BFF" : "#666"}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate("TermsAndConditions")}>
                                        <Text className="ml-2 text-blue-600 underline">I agree to the Terms & Conditions</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity className={`py-3 rounded-md mt-4 ${isChecked ? "bg-blue-700" : "bg-gray-400"}`}
                                    disabled={!isChecked}
                                    onPress={handleSubmit}>
                                    <Text className="text-white text-center text-lg font-bold">Submit</Text>
                                </TouchableOpacity>

                            </View>
                        </ScrollView>
                    </View>
            

                </KeyboardAwareScrollView>


            </SafeAreaView>
        </LinearGradient>
    );
};

export default CargoDetails;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 10, // For rounded corners
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1, // Shadow opacity
        shadowRadius: 6, // Shadow blur radius
        elevation: 5, // For Android shadow
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    selectionContainer: {
        backgroundColor: "#0047AB",
        padding: 20,
        borderRadius: 10,
        width: "90%",
        alignSelf: "center",
        marginBottom:20
      },
      inputGroup: {
        marginBottom: 15,
      },
      arrow: {
        alignSelf: "center",
        marginVertical: 5,
      },
      row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
      },
      label: {
        fontSize: 18,
        color: 'white',
        marginBottom: 10,
        paddingLeft: 10,
      },
      input: {
        backgroundColor: "white",
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
      },
    scrollViewContainer: {
        flexGrow: 1,
    },
    container: {
        marginBottom: 16,
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 16,
        borderRadius: 4,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 16,
        borderRadius: 4,
    },
    logo: {
        width: 180, // Reduced width for better fit
        height: 160, // Reduced height for better fit
        alignSelf: 'center',
        marginBottom: 30, 
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



// import React, { useState, useEffect } from 'react';
// import {
//     ScrollView,
//     SafeAreaView,
//     View,
//     Text,
//     TextInput,
//     Button,
//     Image,
//     StyleSheet,
//     Keyboard,
//     Alert,
//     TouchableOpacity,
// } from 'react-native';
// import DatePicker from 'react-native-date-picker';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import { LinearGradient } from 'expo-linear-gradient';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { API_END_POINT } from '../app.config';

// export const getCurrentDate = (today) => {
//     const day = String(today.getDate()).padStart(2, '0');
//     const month = String(today.getMonth() + 1).padStart(2, '0');
//     const year = today.getFullYear();

//     return `${day}-${month}-${year}`;
// };


// const today = new Date(); // Current date
// const twoMonthsAfter = new Date();
// twoMonthsAfter.setMonth(today.getMonth() + 2);

// const CargoDetails = ({ route }) => {
//     const navigation = useNavigation();
//     const { from, to, phoneNumber, currentLocation, userId } = route.params;
//     const [keyboardVisible, setKeyboardVisible] = useState(false);
//     const [cargoType, setCargoType] = useState('');
//     const [quotePrice, setQuotePrice] = useState('');
//     const [payloadWeight, setPayloadWeight] = useState('');
//     const [payloadHeight, setPayloadHeight] = useState('');
//     const [payloadLength, setPayloadLength] = useState('');
//     const [payloadWidth, setPayloadWidth] = useState('');
//     const [tripDate, setTripDate] = useState(new Date());
//     const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
//     const [specialInstruction, setSpecialInstruction] = useState('');

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
//     const handleSubmit = async () => {
//         if (!cargoType || !quotePrice || !payloadWeight) {
//             Alert.alert('Validation Error', 'Cargo type, payload cost, and payload weight are required!');
//             return;
//         }

//         const cargoDetails = {
//             cargoType,
//             quotePrice: parseFloat(quotePrice),
//             payloadWeight: parseFloat(payloadWeight),
//             payloadHeight: payloadHeight ? parseFloat(payloadHeight) : null,
//             payloadLength: payloadLength ? parseFloat(payloadLength) : null,
//             payloadWidth: payloadWidth ? parseFloat(payloadWidth) : null,
//         };

//         try {
//             const response = await axios.post(`${API_END_POINT}/api/trips/create`, {
//                 from,
//                 to,
//                 phoneNumber,
//                 currentLocation,
//                 cargoDetails,
//                 tripDate,
//                 specialInstruction,
//             });

//             if (response.status === 200) {
//                 Alert.alert('Cargo Details Submitted', 'Your cargo details have been successfully submitted!');

//                 // Clear form fields after successful submission
//                 setCargoType('');
//                 setQuotePrice('');
//                 setPayloadWeight('');
//                 setPayloadHeight('');
//                 setPayloadLength('');
//                 setPayloadWidth('');
//                 setTripDate(new Date());
//                 setSpecialInstruction('');

//                 // Navigate to the desired screen
//                 navigation.navigate('TripScreen', { userId });
//             }
//         } catch (error) {
//             console.log('Error while submitting cargo details:', error);
//         }
//     };


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
//                     <Image
//                         source={require('../assets/images/logo-removebg-preview 1.png')}
//                         style={styles.logo}
//                     />
//                     <View style={styles.mainContainer}>
//                         <Text style={styles.title}>Cargo Details</Text>
//                         <ScrollView contentContainerStyle={styles.scrollViewContainer}>
//                             <View style={styles.container}>
//                                 {/* Cargo Type */}
//                                 <Text style={styles.label}>Cargo Type</Text>
//                                 <TextInput
//                                     style={styles.input}
//                                     placeholder="Cargo type"
//                                     value={cargoType}
//                                     onChangeText={setCargoType}
//                                 />
//                                 {/* Payload Weight */}
//                                 <Text style={styles.label}>Payload Weight (in tonnes)</Text>
//                                 <TextInput
//                                     style={styles.input}
//                                     placeholder="Payload weight"
//                                     keyboardType="numeric"
//                                     value={payloadWeight}
//                                     onChangeText={setPayloadWeight}
//                                 />
//                                 {/* Payload Dimensions */}
//                                 <Text style={styles.label}>Payload Height (in feet)</Text>
//                                 <TextInput
//                                     style={styles.input}
//                                     placeholder="Payload height"
//                                     keyboardType="numeric"
//                                     value={payloadHeight}
//                                     onChangeText={setPayloadHeight}
//                                 />
//                                 <Text style={styles.label}>Payload Length (in feet)</Text>
//                                 <TextInput
//                                     style={styles.input}
//                                     placeholder="Payload length"
//                                     keyboardType="numeric"
//                                     value={payloadLength}
//                                     onChangeText={setPayloadLength}
//                                 />
//                                 <Text style={styles.label}>Payload Width (in feet)</Text>
//                                 <TextInput
//                                     style={styles.input}
//                                     placeholder="Payload width"
//                                     keyboardType="numeric"
//                                     value={payloadWidth}
//                                     onChangeText={setPayloadWidth}
//                                 />
//                                 {/* Trip Date */}
//                                 <Text style={styles.label}>Trip Date</Text>
//                                 <TouchableOpacity
//                                     style={styles.dateInput}
//                                     onPress={() => {
//                                         setIsDatePickerOpen(true);
//                                     }}
//                                 >
//                                     <Text>{getCurrentDate(tripDate)}</Text>
//                                 </TouchableOpacity>
//                                 <DatePicker
//                                     modal
//                                     open={isDatePickerOpen}
//                                     date={tripDate}
//                                     onConfirm={(date) => {
//                                         setIsDatePickerOpen(false);
//                                         setTripDate(date);
//                                     }}
//                                     mode="date"
//                                     onCancel={() => {
//                                         setIsDatePickerOpen(false);
//                                     }}
//                                     maximumDate={twoMonthsAfter}
//                                     minimumDate={today}
//                                 />
//                                 {/* Special Instruction */}
//                                 <Text style={styles.label}>Special Instruction</Text>
//                                 <TextInput
//                                     style={styles.input}
//                                     placeholder="Special instruction"
//                                     value={specialInstruction}
//                                     onChangeText={setSpecialInstruction}
//                                 />
//                                 {/* Quote Price */}
//                                 <Text style={styles.label}>Quote Price</Text>
//                                 <TextInput
//                                     style={styles.input}
//                                     placeholder="Quote cost"
//                                     keyboardType="numeric"
//                                     value={quotePrice}
//                                     onChangeText={setQuotePrice}
//                                 />
//                                 {/* Submit Button */}
//                                 <Button title="Submit" onPress={handleSubmit} />
//                             </View>
//                         </ScrollView>
//                     </View>

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
//         </LinearGradient>
//     );
// };

// export default CargoDetails;

// const styles = StyleSheet.create({
//     mainContainer: {
//         flex: 1,
//         padding: 16,
//         backgroundColor: '#fff',
//         borderRadius: 10, // For rounded corners
//         shadowColor: '#000', // Shadow color
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1, // Shadow opacity
//         shadowRadius: 6, // Shadow blur radius
//         elevation: 5, // For Android shadow
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         marginBottom: 16,
//     },
//     scrollViewContainer: {
//         flexGrow: 1,
//     },
//     container: {
//         marginBottom: 16,
//     },
//     label: {
//         fontSize: 16,
//         marginBottom: 8,
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         padding: 8,
//         marginBottom: 16,
//         borderRadius: 4,
//     },
//     dateInput: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         padding: 8,
//         marginBottom: 16,
//         borderRadius: 4,
//     },
//     logo: {
//         width: 180, // Reduced width for better fit
//         height: 160, // Reduced height for better fit
//         alignSelf: 'center',
//         marginBottom: 30, // Added margin below the logo
//     },
//     footer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-around',
//         marginTop: 20
//     },
//     smallImage: {
//         width: 40,
//         height: 40
//     },
//     footerTextContainer: {
//         flexDirection: 'row',
//         alignItems: 'center'
//     },
//     footerText: {
//         color: '#000',
//         paddingLeft: 2
//     },
// });