import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, Text, TextInput, StyleSheet, View, Image, TouchableOpacity, Keyboard, Alert, Modal, Pressable } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';

export default ({ navigation }) => {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [formData, setFormData] = useState({
        phoneNumber: '',
        pin: '',
        confirmPin: '',
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [enteredOtp, setEnteredOtp] = useState('');
    const [sentOtp, setSentOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false); // Track if phone is verified
    const [otpVerified, setOtpVerified] = useState(false);

    const handleChange = (name, value) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleRegister = async () => {
        if (formData.pin !== formData.confirmPin) {
            Alert.alert('Error', 'Pin and confirm pin do not match');
            return;
        }

        try {
            const response = await fetch('http://192.168.1.14:8000/api/v1/auth/forgotPin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phoneNumber: formData.phoneNumber,
                    pin: formData.pin,
                    confirmPin: formData.confirmPin,
                })
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Registration successful');
                navigation.navigate('Login');
            } else {
                Alert.alert('Error', result.msg || 'Registration failed');
            }
        } catch (error) {
            Alert.alert('Error', `Error: ${error.message}`);
        }
    };

    const sendOtp = async () => {
        try {
            const response = await fetch('http://192.168.1.14:8000/api/v1/auth/sendExistingVisitorOtp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phoneNumber: formData.phoneNumber })
            });

            const result = await response.json();
            // console.log(result);

            if (response.ok) {
                setSentOtp(result.data.otp); // Assume the response contains the sent OTP
                setOtpSent(true); // Mark OTP as sent
                setModalVisible(true); // Open modal for OTP verification
            } else {
                Alert.alert('Error', result.msg || 'Failed to send OTP');
            }
        } catch (error) {
            Alert.alert('Error', `Error: ${error.message}`);
        }
    };

    const verifyOtp = () => {
        // console.log(enteredOtp);
        // console.log(sentOtp);
        if (enteredOtp === sentOtp) {
            setIsPhoneVerified(true); // Set phone as verified
            setModalVisible(false);
            setOtpVerified(true);
        } else {
            Alert.alert('Error', 'Invalid OTP');
        }
    };

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

    return (
        <LinearGradient colors={['#06264D', "#FFF"]} style={{ flex: 1 }} >
            <SafeAreaView style={{ flex: 1, padding: 40 }} >
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
                        source={require("../assets/images/kgv.png")}
                        style={styles.logo}
                    />
                    <Text style={styles.registerText}>ReSet Pin</Text>

                    <View style={styles.phoneNumberContainer}>
                        <TextInput
                            placeholder='Phone Number'
                            style={styles.phoneNumberInput}
                            placeholderTextColor="#000"
                            onChangeText={(text) => handleChange('phoneNumber', text)}
                            value={formData.phoneNumber}
                            keyboardType='phone-pad'
                            maxLength={10}
                        />
                        {isPhoneVerified ? ( // Conditionally render the green check icon if phone is verified
                            <MaterialIcons name="check-circle" size={24} color="green" style={styles.verifyIcon} />
                        ) : (
                            !otpSent && ( // Conditionally render button based on OTP status
                                <TouchableOpacity
                                    style={styles.otpButton}
                                    onPress={sendOtp}
                                >
                                    <Text style={styles.otpButtonText}>Send OTP</Text>
                                </TouchableOpacity>
                            )
                        )}
                    </View>
                    {otpVerified && (
                        <>


                            <TextInput
                                placeholder='PIN'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('pin', text)}
                                value={formData.pin}
                                secureTextEntry={true}
                                editable={isPhoneVerified} // Enable only after OTP verification
                            />
                            <TextInput
                                placeholder='Confirm PIN'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('confirmPin', text)}
                                value={formData.confirmPin}
                                secureTextEntry={true}
                                editable={isPhoneVerified} // Enable only after OTP verification
                            />

                            <TouchableOpacity
                                style={[styles.button, { opacity: isPhoneVerified ? 1 : 0.5 }]}
                                onPress={handleRegister}
                                disabled={!isPhoneVerified} // Disable the button until phone is verified
                            >
                                <Text style={styles.buttonText}>Reset pin</Text>
                            </TouchableOpacity>
                        </>
                    )}




                    <View style={styles.loginContain}>
                        <Text style={styles.loginText1}>Go to ? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginText2}> Login</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>

                {!keyboardVisible && (
                    <View style={styles.footer}>
                        <Image
                            source={require("../assets/images/mantra.jpg")}
                            style={styles.footerImage}
                        />
                        <View style={styles.footerTextContainer}>
                            <Text style={styles.footerText}>Made in</Text>
                            <Image
                                source={require("../assets/images/image 10.png")}
                                style={styles.footerFlag}
                            />
                        </View>
                        <Image
                            source={require("../assets/images/make-in-India-logo.jpg")}
                            style={styles.footerLogo}
                        />
                    </View>
                )}

                {/* OTP Verification Modal */}
                <Modal
                    transparent={true}
                    visible={modalVisible}
                    animationType="slide"
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Verify OTP</Text>
                            <TextInput
                                placeholder='Enter OTP'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => setEnteredOtp(text)}
                                value={enteredOtp}
                                keyboardType='numeric'
                            />
                            <TouchableOpacity
                                style={styles.button}
                                onPress={verifyOtp}
                            >
                                <Text style={styles.buttonText}>Verify OTP</Text>
                            </TouchableOpacity>
                            <Pressable onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButton}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: 201,
        height: 181,
        alignSelf: 'center',
        marginBottom: 20
    },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        borderStyle: 'solid',
        padding: 10,
        width: '80%',
        marginTop: 10
    },
    phoneNumberContainer: {
        flexDirection: 'row',
        width: '80%',
        alignItems: 'center',
        marginTop: 10
    },
    phoneNumberInput: {
        flex: 1,
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        padding: 10
    },
    verifyIcon: {
        marginLeft: 10
    },
    otpButton: {
        marginLeft: 10,
        backgroundColor: 'blue',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5
    },
    otpButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: '#06264D',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    loginContain: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20
    },
    loginText1: {
        color: '#06264D',
        fontSize: 16,

    },
    loginText2: {
        color: '#06264D',
        fontSize: 16,
        textDecorationLine: 'underline'
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20
    },
    footerImage: {
        width: 36,
        height: 36
    },
    footerTextContainer: {
        alignItems: 'center'
    },
    footerText: {
        color: 'black',
        fontSize: 10
    },
    footerFlag: {
        width: 24,
        height: 16
    },
    footerLogo: {
        width: 45,
        height: 36
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    closeButton: {
        marginTop: 20,
        color: 'blue',
        textDecorationLine: 'underline'
    },
    registerText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
    }
});
