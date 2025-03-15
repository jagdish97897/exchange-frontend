import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import axios from 'axios';
import { saveToken } from '../Token.js';
import { useAuth } from '../context/AuthContext.js';
import { initializeSocket } from './SocketIO.js';
import { API_END_POINT } from '../app.config';


export default ({ navigation }) => {
    const { login } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [serverOtp, setServerOtp] = useState('');
    const [loading, setLoading] = useState(false);

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
                const response = await axios.post(`${API_END_POINT}/api/v1/users/sendOtp`, { phoneNumber });

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
                const response = await axios.post(`${API_END_POINT}/api/v1/users/verifyOtp`, {
                    otp,
                    phoneNumber,
                });

                if (response.status === 200) {
                    saveToken('token', response.data.data.token);
                    Alert.alert('Success', 'Login successful.');
                    login();

                    const userType = response.data.data.type;

                    initializeSocket(response.data.data.token);

                    switch (userType) {
                        case 'owner':
                            navigation.navigate('OwnerDashboard', {
                                phoneNumber,
                                token: response.data.data.token,
                                userId: response.data.data.id
                            });
                            break;
                        case 'broker':
                            navigation.navigate('BrokerDashboard', {
                                phoneNumber,
                                token: response.data.data.token,
                                userId: response.data.data.id
                            });
                            break;
                        case 'driver':
                            navigation.navigate('DriverDashboard', {
                                phoneNumber,
                                token: response.data.data.token,
                                userId: response.data.data.id
                            });
                            break;
                        case 'consumer':
                        case 'transporter':
                            navigation.navigate('ConsumerDashboard', {
                                phoneNumber,
                                token: response.data.data.token,
                                userId: response.data.data.id
                            });
                    }
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
        <View style={styles.container}>
            <View style={styles.whiteContainer}>

                <Text style={styles.title}>Start Your Journey</Text>
                <Text style={styles.subtitle}>
                    Log in to access seamless transportation solutions for your goods.
                </Text>

                <TextInput
                    placeholder="Enter your phone number"
                    style={styles.input}
                    placeholderTextColor="#000"
                    keyboardType="phone-pad"
                    value={phoneNumber}
                    onChangeText={handlePhoneNumberChange}
                    maxLength={10}
                    editable={!isOtpSent}  // Disable when OTP is sent
                />

                {isOtpSent && (
                    <TextInput
                        placeholder="Enter OTP"
                        style={styles.input}
                        placeholderTextColor="#000"
                        keyboardType="numeric"
                        value={otp}
                        onChangeText={setOtp}
                        maxLength={4}
                    />
                )}

                {loading ?
                    <ActivityIndicator size="large" color="#0000ff" />
                    :
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>{isOtpSent ? 'Login' : 'Send OTP'}</Text>
                    </TouchableOpacity>}
                <Text style={styles.signupText}>
                    Don't have an account?{' '}
                    <Text
                        style={styles.signupLink}
                        onPress={() => navigation.navigate('RegisterCons')}>
                        Sign Up
                    </Text>
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#002F87', // Dark Blue Background
        justifyContent: 'center',
    },
    whiteContainer: {
        backgroundColor: '#FFF',
        borderTopWidth: wp('15%'),
        borderBottomWidth: wp('15%'),
        borderColor: '#002F87',
        borderTopLeftRadius: wp('50%'),
        borderTopRightRadius: wp('50%'),
        borderBottomRightRadius: wp('50%'),
        borderBottomLeftRadius: wp('50%'),
        padding: wp('8%'),
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: wp('6%'),
        fontWeight: 'bold',
        color: '#002F87',
        marginBottom: hp('1%'),
        textAlign: 'center',
    },
    subtitle: {
        fontSize: wp('4%'),
        color: '#666',
        marginBottom: hp('2%'),
        textAlign: 'center',
    },
    input: {
        width: wp('80%'),
        height: hp('6%'),
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: wp('2%'),
        paddingHorizontal: wp('4%'),
        marginBottom: hp('2%'),
        fontSize: wp('4%'),
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#002F87',
        paddingVertical: hp('1.5%'),
        borderRadius: wp('2%'),
        alignItems: 'center',
        width: wp('80%'),
    },
    buttonText: {
        color: '#fff',
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
    },
    signupText: {
        marginTop: hp('2%'),
        textAlign: 'center',
        fontSize: wp('3.5%'),
        color: '#666',
    },
    signupLink: {
        color: '#004AAD',
        fontWeight: 'bold',
    },
});