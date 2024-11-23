import React from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

// Get device screen width and height
const { width, height } = Dimensions.get('window');

const Landing1 = ({ route, navigation }) => {

    const { data } = route.params;
    console.log(data.razorpay_payment_id)
    console.log(data.razorpay_order_id)
    console.log(data.razorpay_signature)

    return (
        <LinearGradient colors={['#545a2c', '#FFF']} style={styles.gradientBackground}>
            <SafeAreaView style={styles.container}>
                <View style={styles.contentContainer}>
                    <Image
                        source={require("../assets/images/kgv1.png")}
                        style={styles.logo}
                    />
                    <LottieView
                        source={require('../assets/images/animation1.json')}
                        autoPlay
                        loop
                        style={styles.backgroundAnimation}
                    />
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeText}>Welcome to KGV Mitra Club</Text>
                    </View>
                    <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Login1')}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={['#a6a887', '#545a2c']}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>
                                Let's Explore
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradientBackground: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    backgroundAnimation: {
        position: 'absolute',
        width: '140%',
        height: height, // 50% of the screen height for animation
        top: height * 0.1, // 10% from the top
        zIndex: -1,
    },
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        paddingHorizontal: width * 0.05, // 5% of the screen width for padding
        zIndex: 1,
    },
    logo: {
        width: width * 0.6, // 50% of the screen width
        height: height * 0.30, // 25% of the screen height
        marginBottom: height * 0.45, // 10% of screen height for spacing
    },
    welcomeContainer: {
        marginBottom: height * 0.05, // 2% of the screen height for spacing
    },
    welcomeText: {
        fontSize: width * 0.06, // 6% of screen width for text size
        fontWeight: 'bold',
        color: '#333',
    },
    buttonContainer: {
        marginTop: height * 0.01, // 2% of the screen height for spacing
    },
    button: {
        paddingLeft: width * 0.04, // 4% of screen width for padding
        paddingRight: width * 0.04,
        borderRadius: 20,
        height: height * 0.05, // 5% of the screen height for button height
        width: width * 0.5, // 50% of the screen width for button width
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: width * 0.045, // 4.5% of the screen width for text size
        textAlign: 'center',
        color: 'white',
        backgroundColor: 'transparent',
    },
});

export default Landing1;