import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, Text, StyleSheet, View, Image, Keyboard, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Picker } from '@react-native-picker/picker';
import ProfileButton1 from './ProfileButton1';
import CustomModal1 from './CustomModel1.js';

const { width, height } = Dimensions.get('window');

export default function BookingKit2({ navigation, route }) {
    const { visitorId, totalItems, user, cartId, totalPrice } = route.params;
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    console.log(totalPrice)
    const [modalVisible, setModalVisible] = useState(false);
    console.log(cartId)

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

    // Adjust this useEffect to handle navigation correctly
    useEffect(() => {
        if (selectedOption === 'Other') {
            navigation.navigate('CheckoutButton2', { selectedOption, visitorId, totalItems, user });
        } else if (selectedOption === 'Self') {
            navigation.navigate('BookingCheckout2', { selectedOption, visitorId, totalItems, user, cartId, totalPrice });
        }
    }, [selectedOption, navigation, visitorId]);

    return (
        <LinearGradient colors={['#545a2c', "#FFF"]} style={{ flex: 1 }}>
            {/* Use the ProfileButton component */}
            <ProfileButton1 onPress={() => setModalVisible(true)} />
            <SafeAreaView style={styles.safeArea}>
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
                        source={require("../assets/images/kgvmitr.png")}
                        style={styles.logo}
                    />
                    <Text style={styles.vehicledetails}>Please Select User 2</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedOption}
                            onValueChange={(itemValue) => setSelectedOption(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Please Select" value="" />
                            <Picker.Item label="Self" value="Self" />
                            <Picker.Item label="Other" value="Other" />
                        </Picker>
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
            <CustomModal1
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                navigation={navigation}
                user={user}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        padding: width * 0.1, // 10% of the screen width as padding
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: width * 0.5, // 50% of screen width
        height: height * 0.35, // 35% of screen height
        alignSelf: 'center',
        marginBottom: height * 0.02, // 2% of screen height
    },
    vehicledetails: {
        fontSize: width * 0.08, // Responsive font size based on screen width
        fontWeight: 'bold',
        color: '#000',
        marginBottom: height * 0.02, // 2% of screen height
        textAlign: 'center',
    },
    pickerContainer: {
        width: '100%',
        marginVertical: height * 0.025, // 2.5% of screen height as vertical margin
    },
    picker: {
        height: height * 0.06, // 6% of screen height
        width: '100%',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: height * 0.025, // 2.5% of screen height
    },
    footerImage: {
        width: width * 0.1, // Responsive width (10% of screen width)
        height: height * 0.05, // Responsive height (5% of screen height)
    },
    footerTextContainer: {
        alignItems: 'center',
    },
    footerText: {
        color: 'black',
        fontSize: width * 0.025, // 2.5% of screen width
    },
    footerFlag: {
        width: width * 0.06, // 6% of screen width
        height: height * 0.02, // 2% of screen height
    },
    footerLogo: {
        width: width * 0.12, // 12% of screen width
        height: height * 0.05, // 5% of screen height
    },
});

