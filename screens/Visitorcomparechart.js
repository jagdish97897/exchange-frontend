import React, { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, Text, StyleSheet, View, Image, Alert, Keyboard, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomModal from './CustomModal.js';
import ProfileButton from './ProfileButton';

const { width, height } = Dimensions.get('window');

const LetterByLetterText = ({ texts1, texts2, carbonEmissions, savings, style }) => {
    const [currentText1, setCurrentText1] = useState('');
    const [currentText2, setCurrentText2] = useState('');
    const [showSecondBubble, setShowSecondBubble] = useState(false);
    const timerRef1 = useRef(null);
    const timerRef2 = useRef(null);
    useEffect(() => {
        if (carbonEmissions && savings) {
            startTextAnimation1();
        }

        return () => {
            clearInterval(timerRef1.current);
            clearInterval(timerRef2.current);
        };
    }, [carbonEmissions, savings]);

    const startTextAnimation1 = () => {
        let textIndex = 0;
        let letterIndex = 0;
        timerRef1.current = setInterval(() => {
            if (letterIndex < texts1[textIndex].length) {
                setCurrentText1(prev => prev + texts1[textIndex][letterIndex]);
                letterIndex++;
            } else if (textIndex < texts1.length - 1) {
                textIndex++;
                letterIndex = 0;
                setCurrentText1('');
            } else {
                clearInterval(timerRef1.current);
                setShowSecondBubble(true); // Show the second bubble after the first is done
                startTextAnimation2(); // Start the second animation
            }
        }, 100);
    };

    const startTextAnimation2 = () => {
        let textIndex = 0;
        let letterIndex = 0;
        timerRef2.current = setInterval(() => {
            if (letterIndex < texts2[textIndex].length) {
                setCurrentText2(prev => prev + texts2[textIndex][letterIndex]);
                letterIndex++;
            } else if (textIndex < texts2.length - 1) {
                textIndex++;
                letterIndex = 0;
                setCurrentText2('');
            } else {
                clearInterval(timerRef2.current);
            }
        }, 100);
    };

    return (
        <>
            <View style={[styles.bubbleContainer, styles.bubbleLeft]}>
                <Text style={[style, styles.bubbleText]}>
                    {currentText1}
                </Text>
            </View>
            {showSecondBubble && (
                <View style={[styles.bubbleContainer, styles.bubbleRight]}>
                    <Text style={[style, styles.bubbleText]}>
                        {currentText2}
                    </Text>
                </View>
            )}
        </>
    );

};

export default function BikeDetails({ navigation, route }) {
    const { vehicleno, user } = route.params;
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [bikeDetails, setBikeDetails] = useState(null);
    const [runningPerDay, setRunningPerDay] = useState('');
    const [carbonEmissions, setCarbonEmissions] = useState(null);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [savings, setSavings] = useState(null);

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

    useEffect(() => {
        const fetchBikeDetails = async () => {
            try {
                const response = await fetch(`http://192.168.1.13:8000/api/v1/visitorbikedetails/visitorbikedetails/${vehicleno}`);
                const result = await response.json();

                if (response.ok) {
                    setBikeDetails(result.data);
                    setRunningPerDay(result.data.visitorBikeDetails.runningPerDay.toString());
                    setSavings(result.data.petrolKitCostDifference);
                } else {
                    Alert.alert(result.message || 'Vehicle details not found.');
                }
            } catch (error) {
                Alert.alert('Error fetching bike details. Please try again.');
            }
        };

        fetchBikeDetails();
    }, [vehicleno]);

    useEffect(() => {
        if (runningPerDay) {
            const runningPerDayNum = parseFloat(runningPerDay);
            if (!isNaN(runningPerDayNum)) {
                const emissionFactor = 3026 / 100;
                const calculatedEmissions = emissionFactor * runningPerDayNum;
                setCarbonEmissions(calculatedEmissions.toFixed(2));
            }
        }
    }, [runningPerDay]);

    return (
        <LinearGradient colors={['#06264D', "#FFF"]} style={{ flex: 1 }}>
            <ImageBackground
                source={require('../assets/images/saving1.png')}
                style={styles.backgroundImage}
            >
                <View style={styles.overlayTextContainer} >
                    <LetterByLetterText
                        texts1={[
                            `Wow! Congratulations ${user.data.fullName} Now you can save ${savings} with KGV Mitr`
                        ]}
                        texts2={[
                            `You also become environment saviour Estimated CO2 emissions over 3 years: ${carbonEmissions} kg`
                        ]}
                        style={styles.overlayText}
                        carbonEmissions={carbonEmissions}
                        savings={savings}
                    />
                </View>

                <SafeAreaView style={styles.safeArea}>
                    <ProfileButton onPress={() => setModalVisible(true)} />
                    <KeyboardAwareScrollView
                        resetScrollToCoords={{ x: 0, y: 0 }}
                        contentContainerStyle={styles.container}
                        scrollEnabled={true}
                        enableAutomaticScroll={true}
                        enableOnAndroid={true}
                        extraScrollHeight={50}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <TouchableOpacity
                            onPress={() => setDetailsVisible(!detailsVisible)}
                            style={styles.clickableTextContainer}
                        >
                            <Text style={styles.subTitle}>Estimation taken for 3 years {detailsVisible ? '  ▲' : '  ▼'} </Text>
                        </TouchableOpacity>

                        {detailsVisible && bikeDetails && (
                            <View style={styles.detailsContainer}>
                                <Text style={styles.detailText}>Vehicle No: {bikeDetails.visitorBikeDetails.vehicleno}</Text>
                                <Text style={styles.detailText}>Running Per Day: {bikeDetails.visitorBikeDetails.runningPerDay}</Text>
                                <Text style={styles.detailText}>Fuel Type: {bikeDetails.visitorBikeDetails.fueltype}</Text>
                                <Text style={styles.detailText}>Model: {bikeDetails.visitorBikeDetails.model}</Text>
                                <Text style={styles.detailText}>CC: {bikeDetails.visitorBikeDetails.cc}</Text>
                                <Text style={styles.detailText}>Estimated running expense (Presently): {bikeDetails.threeYearPetrolCost}</Text>
                                <Text style={styles.detailText}>Estimated running expense (With KGV): {bikeDetails.threeYearKitCost}</Text>
                                <Text style={styles.detailText}>Estimated saving in hands after transforming into KGV hybrid bike : {bikeDetails.petrolKitCostDifference}</Text>
                                {carbonEmissions && (
                                    <Text style={styles.detailText}>Estimated CO2 emissions over 3 years: {carbonEmissions} kg</Text>
                                )}
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('Recomanded', { vehicleno, user })}
                        >
                            <Text style={styles.buttonText}>Go Next</Text>
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
            </ImageBackground>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    bubbleContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Bubble background color
        borderRadius: 60, // Make it circular
        padding: 15, // Padding for larger bubbles
        margin: 20, // Margin around bubbles
        shadowColor: '#000', // Shadow for depth
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // For Android shadow
        alignSelf: 'center', // Center the bubble horizontally
        width: 200,
        height: 180, // Fixed height for circular shape
        justifyContent: 'center', // Center text vertically
        alignItems: 'center', // Center text horizontally
    },
    bubbleText: {
        fontSize: width * 0.045, // Larger font size for better readability
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center', // Center text
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    bubbleLeft: {
        backgroundColor: '#FFE082',
        right: 30,
        bottom: 60
    },
    bubbleRight: {
        backgroundColor: '#B3E5FC',
        left: 160,
        bottom: 280,
        border: 20,

    },

    overlayTextContainer: {
        position: 'absolute',
        top: height * 0.15,
        left: width * 0.15,
        zIndex: 1,
        height: height * 0.08,
        width: width * 0.4,
    },
    overlayText: {
        fontSize: width * 0.035,
        fontWeight: 'bold',
        color: 'black',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    safeArea: {
        flex: 1,
        padding: height * 0.05,
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    clickableTextContainer: {
        marginVertical: height * 0.005, // Responsive vertical margin
    },
    subTitle: {
        fontSize: width * 0.045, // Responsive font size
        fontWeight: 'bold',
        color: 'yellow',
        marginBottom: height * 0.02, // Responsive margin
        marginTop: height * 0.5, // Responsive margin from top
    },
    vehicledetails: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: height * 0.03,
        marginTop: height * 0.4,
    },
    detailsContainer: {
        marginVertical: height * 0.03,
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    detailText: {
        fontSize: width * 0.04,
        marginBottom: height * 0.01,
        color: '#000',
    },
    button: {
        backgroundColor: '#06264D',
        padding: height * 0.02,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: height * 0.0,
        // marginBottom: height * 0.0001, 

    },
    buttonText: {
        fontSize: width * 0.045,
        color: '#FFF',
        marginRight: width * 0.03,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: height * 0.02,
    },
    footerImage: {
        width: width * 0.09,
        height: width * 0.09,
    },
    footerTextContainer: {
        alignItems: 'center'
    },
    footerText: {
        color: 'black',
        fontSize: width * 0.025,
    },
    footerFlag: {
        width: width * 0.06,
        height: height * 0.02,
    },
    footerLogo: {
        width: width * 0.12,
        height: height * 0.06,
    },
});