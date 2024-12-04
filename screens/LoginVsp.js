import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, Text, TextInput, StyleSheet, View, Image, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { saveToken } from './Token.js';

export default ({ navigation }) => {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [serverOtp, setServerOtp] = useState('');

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

    const handleLogin = async () => {
        if (!phoneNumber) {
            Alert.alert('Error', 'Please enter a valid phone number.');
            return;
        }
    
        try {
            if (!isOtpSent) {
                // Send OTP
                const response = await axios.post('http://192.168.1.6:8000/api/v1/users/sendOtp', {
                    phoneNumber,
                    type: ['owner', 'broker', 'driver']
                });
    
                if (response.status === 200) {
                    setIsOtpSent(true);
                    const otpFromServer = response.data.data.otp;
                    setServerOtp(otpFromServer); 
                    console.log('OTP sent:', otpFromServer);
                    Alert.alert('Success', 'OTP sent successfully.');
                } else {
                    throw new Error('Failed to send OTP.'); // This block might never be reached due to the 200 check above
                }
            } else {
                // Verify OTP
                const response = await axios.post('http://192.168.1.6:8000/api/v1/users/verifyOtp', {
                    otp,
                    phoneNumber,
                });
    
                if (response.status === 200) {
                    saveToken('token',response.data.data.token);
                    // console.log('response data : ', response.data);
                    Alert.alert('Success', 'Login successful.');
                    navigation.navigate('HomePreKycConsumer', { phoneNumber });
                } else {
                    throw new Error('Invalid OTP.');
                }
            }
        } catch (error) {
            // Improved error handling
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred.';
            // console.log('Error:', errorMessage); // Log error for debugging
            Alert.alert('Error', errorMessage);
        }
    };
    

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
                    <Text style={styles.loginText}>Login</Text>

                    <TextInput
                        placeholder="Enter your phone number"
                        style={styles.input}
                        placeholderTextColor="#000"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                    />

                    {isOtpSent && (
                        <TextInput
                            placeholder="Enter OTP"
                            style={styles.input}
                            placeholderTextColor="#000"
                            keyboardType="numeric"
                            value={otp}
                            onChangeText={setOtp}
                        />
                    )}

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>{isOtpSent ? 'Login' : 'Send OTP'}</Text>
                    </TouchableOpacity>
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
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 30, // Added padding to the bottom
    },
    logo: {
        width: 180, // Reduced width for better fit
        height: 160, // Reduced height for better fit
        alignSelf: 'center',
        marginBottom: 30, // Added margin below the logo
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        fontSize: 16, // Increased font size for readability
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#06264D',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20, // Added margin top for better spacing
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20, // Added margin below the login text
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


// import {LinearGradient} from 'expo-linear-gradient';
// import { SafeAreaView, Text, TextInput, StyleSheet, View, Button } from 'react-native';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import Logo from '../assets/images/logo.svg';
// import Ind from '../assets/images/ind.svg';
// // import Button from '../components/Buttons/Button';

// export default ({navigation}) => {
//     return (
//         <LinearGradient colors={['#FFF', "#FFF"]} style={{flex: 1}}>
//             <SafeAreaView style={{flex: 1, padding: 10}}>
//             <KeyboardAwareScrollView
//             resetScrollToCoords={{ x: 0, y: 0 }}
//             contentContainerStyle={styles.container}
//             scrollEnabled={true}
//             enableAutomaticScroll={true}
//             enableOnAndroid={true}
//             >
//                 {/* <Logo /> */}
//                 <TextInput placeholder='Vendor Firm Name' style={styles.input} placeholderTextColor="#000" />
//                 <TextInput placeholder='Owner Name' style={styles.input} placeholderTextColor="#000" />
//                 <TextInput placeholder='Whatsapp Number' style={styles.input} placeholderTextColor="#000" />
//                 <TextInput placeholder='Email ID' style={styles.input} placeholderTextColor="#000" />
//                 <TextInput placeholder='Address' style={styles.input} placeholderTextColor="#000" />
//                 <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
//                     <TextInput placeholder='City' style={[styles.input, {width: 100}]} placeholderTextColor="#000" />
//                     <TextInput placeholder='State' style={[styles.input, {width: 150, marginLeft: 50}]} placeholderTextColor="#000" />
//                 </View>
//                 <TextInput placeholder='Pincode' style={styles.input} placeholderTextColor="#000" />
//                 <Button title="Login" style={{marginTop: 20}} onPress={() => navigation.navigate('Home')} />
//             </KeyboardAwareScrollView>
            
//             <View style={{alignItems: 'center', flexDirection: 'row', width: '100%', justifyContent: 'center'}}>
//                 {/* <Ind /> */}
//                 <Text> Made In India</Text>
//             </View>
           
//             </SafeAreaView>
//         </LinearGradient>
//     );
// };

// const styles = new StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     input: {
//         borderBottomWidth: 2,
//         borderBottomColor: 'black',
//         borderStyle: 'solid',
//         padding: 10,
//         width: '100%',
//         marginTop: 10
//     }
// })
