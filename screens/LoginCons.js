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
    const [loading, setLoading] = useState(false);

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

    const handlePhoneNumberChange = (text) => {
        // Regular expression to match country codes like +91, 91, or others.
        const trimmedText = text.replace(/^(?:\+?91|91)?(\d{10})$/, '$1');
        // console.log('text: ', trimmedText);
        setPhoneNumber(trimmedText);
    };

    const handleLogin = async () => {
        setLoading(true);

        if (!phoneNumber) {
            Alert.alert('Error', 'Please enter a valid phone number.');
            return;
        }

        try {
            if (!isOtpSent) {
                // Send OTP
                const response = await axios.post('http://192.168.1.9:8000/api/v1/users/sendOtp', {
                    phoneNumber,
                    type: ['consumer', 'transporter']
                });

                if (response.status === 200) {
                    setIsOtpSent(true);
                    const otpFromServer = response.data.data.otp;
                    setServerOtp(otpFromServer);
                    console.log('OTP sent:', otpFromServer);
                    Alert.alert('Success', 'OTP sent successfully.');
                } else {
                    throw new Error('Failed to send OTP.');
                }
            } else {
                // Verify OTP
                const response = await axios.post('http://192.168.1.9:8000/api/v1/users/verifyOtp', {
                    otp,
                    phoneNumber,
                });

                if (response.status === 200) {
                    saveToken('token', response.data.data.token);
                    // console.log('response data : ', response.data);
                    Alert.alert('Success', 'Login successful.');
                    navigation.navigate('ConsumerDashboard', { phoneNumber, token: response.data.data.token });
                    setOtp('');
                    setPhoneNumber('');
                    setIsOtpSent(false);
                } else {
                    throw new Error('Invalid OTP.');
                }
            }
        } catch (error) {
            // Improved error handling
            const errorMessage = error.response?.data?.message || error.message || 'An error occurred.';
            // console.log('Error:', errorMessage); // Log error for debugging
            Alert.alert('Error', errorMessage);
        } finally {
            // Remove loading indicator
            setLoading(false);
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
                        onChangeText={handlePhoneNumberChange}
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
