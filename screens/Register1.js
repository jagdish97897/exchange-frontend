

import React, { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, Text, TextInput, StyleSheet, View, Image, TouchableOpacity, Keyboard, Alert, Modal, Pressable, Dimensions, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Icon from react-native-vector-icons
import DatePicker from 'react-native-date-picker'; // Import DatePicker
import CheckBox from '@react-native-community/checkbox';


// Get device screen width and height
const { width, height } = Dimensions.get('window');

export default ({ navigation }) => {

    const [isReferralChecked, setIsReferralChecked] = useState(false);
    const [referralCode, setReferralCode] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        pin: '',
        confirmPin: '',
        aadhar: '',
        pan: '',
        address: '',
        dlno: '',
        dob: new Date(),
        gender: '',
        email: '',
    });
    const [modalVisible, setModalVisible] = useState(false);
    const [enteredOtp, setEnteredOtp] = useState('');
    const [sentOtp, setSentOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [isPinVisible, setIsPinVisible] = useState(false);
    const [isConfirmPinVisible, setIsConfirmPinVisible] = useState(false); // State to toggle pin visibility
    const [openDatePicker, setOpenDatePicker] = useState(false); // For opening the calendar


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
            const response = await fetch('http://192.168.1.5:8005/api/v1/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    phoneNumber: formData.phoneNumber,
                    pin: formData.pin,
                    confirmPin: formData.confirmPin,
                    aadhar: formData.aadhar,
                    pan: formData.pan,
                    address: formData.address,
                    dlno: formData.dlno,
                    gender: formData.gender,
                    dob: `${formData.dob.getDate() > 9 ? formData.dob.getDate() : '0' + formData.dob.getDate()}${(formData.dob.getMonth() + 1) > 9 ? (formData.dob.getMonth() + 1) : '0' + (formData.dob.getMonth() + 1)}${formData.dob.getFullYear()}`, // Corrected date format
                    email: formData.email,

                })
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Registration successful');
                navigation.navigate('PremiumUser');
            } else {
                Alert.alert('Error', result.msg || 'Registration failed');
            }
        } catch (error) {
            Alert.alert('Error', `Error: ${error.message}`);
        }
    };

    const validatePhoneNumber = (number) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(number);
    };

    const sendOtp = async () => {
        if (!validatePhoneNumber(formData.phoneNumber)) {
            Alert.alert('Error', 'Please enter a valid phone number');
            return;
        }
        try {
            const response = await fetch('http://192.168.1.5:8005/api/v1/auth/sendOtp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phoneNumber: formData.phoneNumber })
            });

            const result = await response.json();
            console.log(result);

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
        console.log(enteredOtp);
        console.log(sentOtp);
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
                <Image
                    source={require("../assets/images/kgv.png")}
                    style={styles.logo}
                />
                <Text style={styles.registerText}>Register</Text>
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

                    <TextInput
                        placeholder='Full Name'
                        style={styles.input}
                        placeholderTextColor="#000"
                        onChangeText={(text) => handleChange('fullName', text)}
                        value={formData.fullName}
                    />
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
                        {isPhoneVerified ? (
                            <MaterialIcons name="check-circle" size={24} color="green" style={styles.verifyIcon} />
                        ) : (
                            !otpSent && (
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
                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder='Enter your PIN'
                                    style={[styles.input, { flex: 1 }]} // Adjust input width
                                    placeholderTextColor="#000"
                                    secureTextEntry={!isPinVisible}
                                    onChangeText={(text) => handleChange('pin', text)}
                                    value={formData.pin}
                                    keyboardType='numeric'
                                    editable={isPhoneVerified}
                                    maxLength={4}
                                />
                                <TouchableOpacity onPress={() => setIsPinVisible(!isPinVisible)}>
                                    <Icon
                                        name={isPinVisible ? "eye-off" : "eye"} // Change icon based on state
                                        size={24}
                                        color="#000"
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder='Confirm PIN'
                                    style={[styles.input, { flex: 1 }]} // Adjust input width
                                    placeholderTextColor="#000"
                                    secureTextEntry={!isConfirmPinVisible} // Toggle visibility based on state
                                    onChangeText={(text) => handleChange('confirmPin', text)}
                                    value={formData.confirmPin}
                                    keyboardType='numeric'
                                    editable={isPhoneVerified}
                                    maxLength={4}
                                />
                                <TouchableOpacity onPress={() => setIsConfirmPinVisible(!isConfirmPinVisible)}>
                                    <Icon
                                        name={isConfirmPinVisible ? "eye-off" : "eye"} // Change icon based on state
                                        size={24}
                                        color="#000"
                                    />
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                placeholder='email'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('email', text)}
                                value={formData.email}
                                editable={isPhoneVerified} // Enable only after OTP verification
                            />

                            <TextInput
                                placeholder='Aadhar Number'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('aadhar', text)}
                                value={formData.aadhar}
                                keyboardType='number-pad'
                                editable={isPhoneVerified}
                                maxLength={12}
                            />

                            <TextInput
                                placeholder='PAN Number'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('pan', text.toUpperCase())}
                                value={formData.pan}
                                keyboardType='default'
                                editable={isPhoneVerified}
                                maxLength={10}
                            />
                            <TextInput
                                placeholder='Address'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('address', text)}
                                value={formData.address}
                                editable={isPhoneVerified} // Enable only after OTP verification
                            />
                            <TextInput
                                placeholder='Dl No'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('dlno', text)}
                                value={formData.dlno}
                                editable={isPhoneVerified} // Enable only after OTP verification
                            />

                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setOpenDatePicker(true)} // Open the date picker
                            >

                                <Text style={styles.dateText}>
                                    {formData.dob
                                        ? `${formData.dob.getDate() > 9 ? formData.dob.getDate() : '0' + formData.dob.getDate()}/${(formData.dob.getMonth() + 1) > 9 ? (formData.dob.getMonth() + 1) : '0' + (formData.dob.getMonth() + 1)}/${formData.dob.getFullYear()}`
                                        : 'Select DOB'}
                                </Text>
                            </TouchableOpacity>

                            <DatePicker
                                modal
                                open={openDatePicker}
                                date={formData.dob}
                                style={styles.datePicker}
                                mode="date"
                                onConfirm={(date) => {
                                    setOpenDatePicker(false);
                                    handleChange('dob', date);
                                }}
                                onCancel={() => {
                                    setOpenDatePicker(false);
                                }}
                            />

                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={formData.gender}
                                    style={styles.input}
                                    onValueChange={(itemValue) => handleChange('gender', itemValue)}
                                    enabled={isPhoneVerified}
                                >
                                    <Picker.Item label="Select Gender" value="" />
                                    <Picker.Item label="Male" value="M" />
                                    <Picker.Item label="Female" value="F" />
                                </Picker>
                            </View>

                            {/* Conditionally render the checkbox and text */}
                            {!isReferralChecked && (
                                <View style={styles.referralContainer}>
                                    <CheckBox
                                        value={isReferralChecked}
                                        onValueChange={setIsReferralChecked}
                                        style={styles.checkbox}
                                    />
                                    <Text style={styles.checkboxLabel}>Have a referral code?</Text>
                                </View>
                            )}

                            {/* Render the input when the checkbox is checked */}
                            {isReferralChecked && (
                                <TextInput
                                    placeholder='Referral Code'
                                    style={[styles.input, { marginTop: 10 }]}
                                    placeholderTextColor="#000"
                                    onChangeText={(text) => setReferralCode(text)}
                                    value={referralCode}
                                    editable={isPhoneVerified}
                                />
                            )}


                            <TouchableOpacity
                                style={[styles.button, { opacity: isPhoneVerified ? 1 : 0.5 }]}
                                onPress={handleRegister}
                                disabled={!isPhoneVerified} // Disable the button until phone is verified
                            >
                                <Text style={styles.buttonText}>Register</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    <View style={styles.loginContain}>
                        <Text style={styles.loginText1}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register1')}>
                            <Text style={styles.loginText2}>Login</Text>
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
        justifyContent: 'center',
    },
    logo: {
        width: width * 0.6, // 50% of screen width
        height: height * 0.3, // 20% of screen height
        alignSelf: 'center',
        marginTop: height * 0, // 2% of screen height for spacing
        marginBottom: height * 0,
    },
    referralContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    checkbox: {
        marginRight: 10,
    },
    checkboxLabel: {
        fontSize: 16,
        color: '#000',
    },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        padding: height * 0.015, // Padding relative to screen height
        width: width * 0.7, // 80% of screen width
        marginTop: height * 0.001, // 1% of screen height for spacing
    },
    phoneNumberContainer: {
        flexDirection: 'row',
        width: width * 0.7, // 80% of screen width
        alignItems: 'center',
        marginTop: height * 0.01, // 1% of screen height for spacing
    },
    phoneNumberInput: {
        flex: 1,
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        padding: height * 0.015, // Padding relative to screen height
    },
    verifyIcon: {
        marginLeft: width * 0.02, // 2% of screen width for spacing
    },
    otpButton: {
        marginLeft: width * 0.02, // 2% of screen width for spacing
        backgroundColor: 'blue',
        paddingVertical: height * 0.007, // Padding based on screen height
        paddingHorizontal: width * 0.03, // Padding based on screen width
        borderRadius: 5,
    },
    otpButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    pickerContainer: {
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        marginTop: height * 0.01, // 1% of screen height for spacing
        width: width * 0.7, // 70% of screen width
    },
    button: {
        backgroundColor: '#06264D',
        paddingVertical: height * 0.015, // Padding relative to screen height
        paddingHorizontal: width * 0.05, // Padding relative to screen width
        borderRadius: 5,
        marginTop: height * 0.02, // Margin relative to screen height
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    loginContain: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: height * 0.02, // 2% of screen height for spacing
    },
    loginText1: {
        color: '#06264D',
        fontSize: width * 0.04, // Font size relative to screen width
    },
    loginText2: {
        color: '#06264D',
        fontSize: width * 0.04, // Font size relative to screen width
        textDecorationLine: 'underline',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: height * 0.02, // 2% of screen height for spacing
    },
    footerImage: {
        width: width * 0.09, // 9% of screen width
        height: height * 0.05, // 5% of screen height
    },
    footerTextContainer: {
        alignItems: 'center',
    },
    footerText: {
        color: 'black',
        fontSize: width * 0.025, // Font size relative to screen width
    },
    footerFlag: {
        width: width * 0.06, // 6% of screen width
        height: height * 0.02, // 2% of screen height
    },
    footerLogo: {
        width: width * 0.12, // 12% of screen width
        height: height * 0.05, // 5% of screen height
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: width * 0.8, // 80% of screen width
        backgroundColor: 'white',
        padding: height * 0.02, // Padding relative to screen height
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: width * 0.05, // Font size relative to screen width
        fontWeight: 'bold',
        marginBottom: height * 0.02, // 2% of screen height for spacing
    },
    closeButton: {
        marginTop: height * 0.02, // 2% of screen height for spacing
        color: 'blue',
        textDecorationLine: 'underline',
    },
    registerText: {
        fontSize: width * 0.08,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 0,
        marginBottom: height * 0,
        marginLeft: width * 0.24
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: 'black',
        width: '90%',
        marginTop: height * 0.02,
        marginLeft: 0
    },
    datePicker: {
        borderRadius: '50'
    }
});
