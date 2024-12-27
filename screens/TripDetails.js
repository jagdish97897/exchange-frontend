import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, Text, StyleSheet, View, Image, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
export default function TripDetails({ route }) {
    const { trip } = route.params;
    const [keyboardVisible, setKeyboardVisible] = useState(false);

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
                    <Text style={styles.title}>Trip Details</Text>
                    <View style={styles.card}>
                        <Text style={styles.detail}>
                            <Text style={styles.label}>From: </Text> {trip.from}
                        </Text>
                        <Text style={styles.detail}>
                            <Text style={styles.label}>To: </Text> {trip.to}
                        </Text>
                        <Text style={styles.detail}>
                            <Text style={styles.label}>Date: </Text> {new Date(trip.tripDate).toLocaleString()}
                        </Text>
                        <Text style={styles.detail}>
                            <Text style={styles.label}>Cargo Type: </Text> {trip.cargoDetails.cargoType}
                        </Text>
                        <Text style={styles.detail}>
                            <Text style={styles.label}>Payload Cost: </Text> {trip.cargoDetails.payloadCost}
                        </Text>
                        <Text style={styles.detail}>
                            <Text style={styles.label}>Payload Weight: </Text> {trip.cargoDetails.payloadWeight}
                        </Text>
                        <Text style={styles.detail}>
                            <Text style={styles.label}>Payload Dimensions (LxWxH): </Text>
                            {trip.cargoDetails.payloadLength} x {trip.cargoDetails.payloadWidth} x{' '}
                            {trip.cargoDetails.payloadHeight}
                        </Text>
                        <Text style={styles.detail}>
                            <Text style={styles.label}>Status: </Text> {trip.status}
                        </Text>
                        <Text style={styles.detail}>
                            <Text style={styles.label}>Amount: </Text> {trip.amount}
                        </Text>
                    </View>
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f2f2f2',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
        color: '#2c3e50',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    detail: {
        fontSize: 16,
        marginBottom: 12,
        color: '#34495e',
    },
    label: {
        fontWeight: 'bold',
        color: '#2c3e50',
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