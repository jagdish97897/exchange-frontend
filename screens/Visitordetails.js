import React, { useState, useEffect, useCallback } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, Text, TextInput, StyleSheet, View, Image, TouchableOpacity, Keyboard, Alert, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import Icon from '@expo/vector-icons/MaterialIcons';
import CustomModal from './CustomModal.js';
import ProfileButton from './ProfileButton';
import TermsAndConditionsCheckbox from './TermsAndConditionsCheckbox';

const { width, height } = Dimensions.get('window'); // Get screen width and height

export default ({ navigation, route }) => {
    const { user } = route.params;
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [visitorName, setVisitorName] = useState('');
    const [bikes, setBikes] = useState([]);
    const userId = user?.data?.userId;
    const [modalVisible, setModalVisible] = useState(false);

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [formData, setFormData] = useState({
        vehiclenoPart1: '',
        vehiclenoPart2: '',
        runningPerDay: '',
        fueltype: '',
        model: '',
        cc: '',
        visitorId: userId || '',
    });

    // Reference to control Lottie animation


    useFocusEffect(
        useCallback(() => {
            if (!termsAccepted) {
                setFormData({
                    vehiclenoPart1: '',
                    vehiclenoPart2: '',
                    runningPerDay: '',
                    fueltype: '',
                    model: '',
                    cc: '',
                    visitorId: userId || '',
                });
            }
        }, [userId, termsAccepted])
    );

    useEffect(() => {
        if (userId) {
            setFormData(prevData => ({
                ...prevData,
                visitorId: userId,
            }));
        }
        fetchBikeDetails();
    }, [userId]);

    const fetchBikeDetails = async () => {
        try {
            const response = await fetch('http://192.168.1.5:8005/api/bikes');
            const result = await response.json();

            if (response.ok) {
                setBikes(result.bikes);
            } else {
                Alert.alert('Error', result.message || 'Failed to fetch bike details');
            }
        } catch (error) {
            Alert.alert('Error', `Error: ${error.message}`);
        }
    };

    const handleChange = (name, value) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));

        if (name === 'model') {
            const selectedBike = bikes.find(bike => bike.bike === value);
            if (selectedBike) {
                setFormData(prevData => ({
                    ...prevData,
                    cc: selectedBike.cc,
                }));
            }
        }
    };

    const handleRegister = async () => {
        const completeVehicleNo = `${formData.vehiclenoPart1}${formData.vehiclenoPart2}`;
        const submitData = {
            ...formData,
            vehicleno: completeVehicleNo,
        };

        try {
            const response = await fetch('http://192.168.1.5:8005/api/v1/visitorbikedetails/v1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            const result = await response.json();

            if (response.ok) {
                navigation.navigate('Visitorchart', { vehicleno: completeVehicleNo, user });
                setTermsAccepted(false);
            } else {
                Alert.alert('Error', result.message || 'Submission failed');
            }
        } catch (error) {
            Alert.alert('Error', `Error: ${error.message}`);
        }
    };

    useEffect(() => {
        const fetchVisitorDetails = async () => {
            try {
                const response = await fetch(`http://192.168.1.5:8005/api/v1/visitor/details/${userId}`);
                const result = await response.json();

                if (response.ok && result.success) {
                    setVisitorName(result.data[0].fullName);
                } else {
                    Alert.alert('Error', result.message || 'Failed to fetch visitor details');
                }
            } catch (error) {
                Alert.alert('Error', `Error: ${error.message}`);
            }
        };

        fetchVisitorDetails();

        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [userId]);

    const handleAcceptTerms = () => {
        setTermsAccepted(true); // Set terms as accepted
    };

    return (
        <LinearGradient colors={['#06264D', '#FFF']} style={{ flex: 1 }}>
            {/* Use the ProfileButton component */}
            <ProfileButton onPress={() => setModalVisible(true)} />
            <SafeAreaView style={styles.contentContainer}>
                <Image
                    source={require("../assets/images/Mitra-full-img.png")}
                    style={styles.kgvMitra}
                />
                <Text style={styles.overlayText}>Kindly share your bike details!</Text>

            </SafeAreaView>
            <SafeAreaView style={{ flex: 1, padding: 40, }}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.container}
                    enableOnAndroid={true}
                    extraScrollHeight={20} // Adjust this value to control the scroll height
                    enableAutomaticScroll={true} // Keep automatic scrolling enabled
                    keyboardShouldPersistTaps="handled" // Consider setting it to 'always' or 'handled'
                    keyboardDismissMode="on-drag"
                >

                    <View style={styles.vehicleInputContainer}>
                        <TextInput
                            placeholder="Vehicle No "
                            style={styles.vehicleInput}
                            placeholderTextColor="#000"
                            maxLength={6}
                            onChangeText={text => handleChange('vehiclenoPart1', text)}
                            value={formData.vehiclenoPart1}
                        />
                        <TextInput
                            placeholder=""
                            style={styles.vehicleInput}
                            placeholderTextColor="#000"
                            maxLength={4}
                            keyboardType="numeric"
                            onChangeText={text => handleChange('vehiclenoPart2', text)}
                            value={formData.vehiclenoPart2}
                        />
                    </View>

                    <TextInput
                        placeholder="Running Per Day"
                        style={styles.input}
                        placeholderTextColor="#000"
                        onChangeText={text => handleChange('runningPerDay', text)}
                        value={formData.runningPerDay}
                        keyboardType="numeric"
                        maxLength={3}
                    />
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.fueltype}
                            style={styles.picker}
                            onValueChange={itemValue => handleChange('fueltype', itemValue)}
                        >
                            <Picker.Item label="Select Fuel Type" value="" />
                            <Picker.Item label="Petrol" value="Petrol" />
                            <Picker.Item label="Diesel" value="Diesel" />
                            <Picker.Item label="CNG" value="CNG" />
                        </Picker>
                    </View>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.model}
                            style={styles.picker}
                            onValueChange={itemValue => handleChange('model', itemValue)}
                        >
                            <Picker.Item label="Select Model" value="" />
                            {bikes.map((bike, index) => (
                                <Picker.Item key={index} label={bike.bike} value={bike.bike} />
                            ))}
                        </Picker>
                    </View>

                    <TermsAndConditionsCheckbox
                        termsAccepted={termsAccepted}
                        handleAcceptTerms={handleAcceptTerms}
                    />

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: termsAccepted ? '#06264D' : '#ccc' }]}
                        disabled={!termsAccepted}
                        onPress={handleRegister}
                    >
                        <Text style={styles.buttonText}>Submit</Text>
                        <Icon name="arrow-forward" size={24} color="#FFF" />
                    </TouchableOpacity>

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
                <CustomModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    navigation={navigation}
                    user={user}
                />
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
    input: {
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        padding: height * 0.015,
        width: '80%',
        marginTop: height * 0.02,
    },
    contentContainer: {
        flexDirection: 'row',
        marginTop: height * 0.05, // Adjust margin based on screen height
        height: height * 0.2, // Responsive height
        width: '100%',
    },
    kgvMitra: {
        marginTop: height * 0.01,
        marginLeft: -width * 0.30,
        height: height * 0.87,
        width: width * 0.9,
    },
    pickerContainer: {
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        marginTop: height * 0.015,
        width: '80%',
    },
    picker: {
        height: height * 0.07,
        width: '100%',
    },
    vehicledetails: {
        fontSize: width * 0.045,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: height * 0.015,
        textAlign: 'center',
        marginTop: height * 0.08,
        marginRight: width * 0.03,
    },
    lottieButton: {
        width: width * 0.3,
        height: height * 0.15,
        marginTop: height * 0.02,
        marginLeft: 0,
    },
    lottieAnimation: {
        marginLeft: 0,
        width: '100%',
        height: '100%',
    },
    backgroundAnimation: {
        width: width * 0.5,
        height: height * 0.25,
        alignSelf: 'center',
        position: 'absolute',
        bottom: -height * 0.015,
        zIndex: -1,
    },
    vehicleInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        paddingTop: height * 0.01,
    },
    vehicleInput: {
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        padding: height * 0.015,
        width: '48%',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: height * 0.02,
    },
    footerImage: {
        width: width * 0.1,
        height: height * 0.05,
    },
    footerTextContainer: {
        alignItems: 'center',
    },
    footerText: {
        color: 'black',
        fontSize: width * 0.025,
    },
    footerFlag: {
        width: width * 0.06,
        height: height * 0.03,
    },
    footerLogo: {
        width: width * 0.12,
        height: height * 0.05,
    },
    button: {
        backgroundColor: '#06264D',
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.05,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: height * 0.12,
    },
    buttonText: {
        color: 'white',
        fontSize: width * 0.045,
        marginRight: width * 0.02,
    },
    overlayText: {
        position: 'absolute',
        top: '100%',
        left: '10%',
        color: '#FFF',
        fontSize: width * 0.05,
        fontWeight: 'bold',
        textAlign: 'center',
    },

});
