import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, Text, TextInput, StyleSheet, View, Image, TouchableOpacity, Keyboard, Alert, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { CommonActions } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default ({ navigation }) => {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [pin, setPin] = useState('');
    const [isPinVisible, setIsPinVisible] = useState(false);

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
        try {
            const requestData = { phoneNumber, pin };

            const response = await axios.post('http://192.168.1.2:8000/api/v1/auth/login', requestData);

            if (response.status === 200) {
                Alert.alert('Success', 'Login successful');
                // console.log('response.data', response.data);

                if (response.data.data.isPremiumUser) {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'MainNavigator1', params: { screen: 'Welcome1', params: { user: response.data } } }],
                        })
                    );
                } else {
                    navigation.navigate('Welcome', { user: response.data });
                }



            } else {
                throw new Error('Operation failed');
            }
        } catch (error) {
            console.log('Login error:', error);
            Alert.alert('Error', error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <LinearGradient colors={['#06264D', "#FFF"]} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, padding: 40 }}>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    contentContainerStyle={styles.container}
                    scrollEnabled={true}
                    enableAutomaticScroll={true}
                    enableOnAndroid={true}
                    extraScrollHeight={20}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <Image
                        source={require("../assets/images/kgv.png")}
                        style={styles.logo}
                    />
                    <Text style={styles.loginText}>Login</Text>

                    <TextInput
                        placeholder='Enter your phone number'
                        style={styles.input}
                        placeholderTextColor="#000"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        maxLength={10}
                    />

                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder='Enter your PIN'
                            style={[styles.input, { flex: 1 }]} // Adjust input width
                            placeholderTextColor="#000"
                            secureTextEntry={!isPinVisible} // Toggle visibility based on state
                            value={pin}
                            onChangeText={setPin}
                            keyboardType='numeric'
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

                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPin')}>
                        <Text style={styles.forgotPinText}>Forgot PIN?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    <View style={styles.registerContain}>
                        <Text style={styles.registerText1}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.registerText2}> Register</Text>
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
        width: width * 0.6,
        height: height * 0.3,
        alignSelf: 'center',
        marginBottom: height * 0.08,
    },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        padding: height * 0.01,
        width: '80%',
        marginTop: height * 0.01,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: 'black',
        width: '80%',
        marginTop: height * 0.0001,
    },
    button: {
        backgroundColor: '#06264D',
        paddingVertical: height * 0.01,
        paddingHorizontal: width * 0.05,
        borderRadius: 5,
        marginTop: height * 0.01,
    },
    buttonText: {
        color: '#FFF',
        fontSize: width * 0.045,
        fontWeight: 'bold',
    },
    loginText: {
        fontSize: width * 0.08,
        fontWeight: 'bold',
        color: '#000',
    },
    registerContain: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: height * 0.03,
    },
    registerText1: {
        color: '#06264D',
        fontSize: width * 0.04,
    },
    registerText2: {
        color: '#06264D',
        fontSize: width * 0.04,
        textDecorationLine: 'underline',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: height * 0.03,
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
    forgotPinText: {
        color: '#06264D',
        fontSize: width * 0.04,
        textDecorationLine: 'underline',
        alignSelf: 'flex-end',
        marginTop: height * 0.01,
        marginBottom: height * 0.02,
    },
});