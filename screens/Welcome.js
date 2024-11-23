import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import CustomModal from './CustomModal.js';
import ProfileButton from './ProfileButton';

const { width, height } = Dimensions.get('window');

const Welcome = ({ route }) => {
    const { user } = route.params;
    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);

    const visitorId = user?.data?.userId;

    return (
        <LinearGradient colors={['#06264D', '#FFF']} style={styles.gradientBackground}>
            <LottieView
                source={require('../assets/images/animation4.json')}
                autoPlay
                loop
                style={styles.backgroundAnimation}
            />
            <SafeAreaView contentContainerStyle={styles.container}>
                <View style={styles.banner}>
                    <Text style={styles.bannerText}>Welcome to the KGV World of Hybrid E-Mobility</Text>
                </View>

                {/* Use the ProfileButton component */}
                <ProfileButton onPress={() => setModalVisible(true)} />

                <View style={styles.nav}>
                    <View style={styles.textContainer}>
                        <Text style={styles.welcomeText}>नमस्ते, {user?.data?.fullName}!</Text>
                    </View>
                </View>

                <Text style={styles.descriptionText}>
                    It is a smart e-mobility solution provider that aims to cater to the society as it reduces the immense burden on the middle and lower segment of the community by reducing the cost of commuting by more than 90%.
                </Text>

                <Image
                    source={require("../assets/images/kgvmitr.png")}
                    style={styles.photo}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Ourproduct', { user })}
                >
                    <Text style={styles.buttonText}>Let's Go</Text>
                    <Icon name="arrow-forward" size={24} color="#FFF" />
                </TouchableOpacity>
            </SafeAreaView>

            {/* Use the custom modal */}
            <CustomModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                navigation={navigation}
                user={user}
            />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientBackground: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: height * 0.1,
    },
    banner: {
        width: '100%',
        backgroundColor: '#06264D',
        paddingVertical: height * 0.015,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: height * 0.02,
        marginTop: height * 0.13,
    },
    bannerText: {
        color: 'white',
        fontSize: width * 0.05,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    nav: {
        width: '100%',
        paddingHorizontal: width * 0.05,
        justifyContent: 'center',
    },
    textContainer: {
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: 'white',
    },
    descriptionText: {
        paddingTop: height * 0.02,
        fontSize: width * 0.045,
        color: 'white',
        textAlign: 'center',
        paddingHorizontal: width * 0.05,
        marginBottom: height * 0.02,
        lineHeight: height * 0.03,
    },
    photo: {
        width: width * 0.5,
        height: height * 0.35,
        borderRadius: width * 0.05,
        marginTop: height * 0.05,
        marginLeft: width * 0.25,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#06264D',
        padding: height * 0.015,
        borderRadius: 5,
        marginTop: height * 0.05,
        marginHorizontal: width * 0.33,
    },
    buttonText: {
        color: 'white',
        fontSize: width * 0.045,
        marginHorizontal: width * 0.02,
    },
    backgroundAnimation: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: width * 1.05,
        height: height * 0.8,
        top: height * 0.2,
    },
});

export default Welcome;