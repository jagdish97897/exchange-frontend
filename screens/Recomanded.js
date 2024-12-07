import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import CustomModal from './CustomModal.js';
import ProfileButton from './ProfileButton';
import TermsAndConditionsCheckbox from './TermsAndConditionsCheckbox';

const { width, height } = Dimensions.get('window');


const Recomanded = ({ route }) => {
    const { vehicleno, user } = route.params;
    const navigation = useNavigation();
    const [recommendedKits, setRecommendedKits] = useState([]);
    const [cc, setCc] = useState(null);
    const [visitor, setVisitor] = useState({ id: '', name: '' });
    const [visitorBikeDetailsId, setVisitorBikeDetailsId] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false); // New state for terms acceptance

    useEffect(() => {
        const fetchVehicleDetails = async () => {
            try {
                const response = await axios.get(`http://192.168.1.13:8000/api/v1/visitorbikedetails/visitorbikedetails/${vehicleno}`);
                console.log("Vehicle Details Response:", response.data);

                if (response.status === 200) {
                    const { visitor, cc, _id } = response.data.data.visitorBikeDetails;
                    setCc(parseInt(cc, 10));
                    setVisitor({ id: visitor._id, name: visitor.fullName });
                    setVisitorBikeDetailsId(_id);

                    const kitsResponse = await axios.get('http://192.168.1.13:8000/api/kits/get');
                    console.log("Kits Response:", kitsResponse.data);

                    if (kitsResponse.status === 200) {
                        const kitsData = kitsResponse.data.data;
                        let applicableKits = kitsData.map(kit => {
                            if (cc <= 100 && ['HX1', 'HX2', 'HX3'].includes(kit.name)) {
                                return { ...kit, isApplicable: true };
                            } else if (cc > 100 && cc <= 125 && ['HX2', 'HX3'].includes(kit.name)) {
                                return { ...kit, isApplicable: true };
                            } else if (cc > 125 && cc <= 150 && ['HX3'].includes(kit.name)) {
                                return { ...kit, isApplicable: true };
                            } else {
                                return { ...kit, isApplicable: false };
                            }
                        });
                        setRecommendedKits(applicableKits);
                    } else {
                        console.log('Failed to fetch kits:', kitsResponse.data.message);
                    }
                } else {
                    console.log('Failed to fetch vehicle details:', response.data.message);
                }
            } catch (error) {
                console.log('Error fetching vehicle details or kits:', error);
            }
        };

        fetchVehicleDetails();
    }, [vehicleno]);

    const addKit = async (kitId, kitName) => {
        if (!termsAccepted) {
            Alert.alert('Terms & Conditions', 'You must accept the terms and conditions to proceed.');
            return;
        }

        try {
            const payload = {
                visitorId: visitor.id,
                visitorbikedetailsId: visitorBikeDetailsId,
                kitId,
                vehicleno
            };

            const response = await axios.post('http://192.168.1.13:8000/api/cart/item', payload);
            console.log("cartItemId", response.data.cartItemId);
            if (response.status === 200) {
                Alert.alert('Success', 'Item added successfully!');
                navigation.navigate('AddToCart', {
                    vehicleno,
                    kitId,
                    kitName,
                    visitorId: visitor.id,
                    visitorName: visitor.name,
                    visitorBikeDetailsId,
                    cartItemId: response.data.cartItemId,
                    user
                });
            } else {
                Alert.alert('Error', 'Failed to add the kit.');
            }
        } catch (error) {
            if (error.response) {
                // Server responded with a status code outside the 2xx range
                console.log('Error response data:', error.response.data);
                console.log('Error status:', error.response.status);
                console.log('Error headers:', error.response.headers);
                Alert.alert('Error', `${error.response.data.message || error.message}`);
            } else if (error.request) {
                // Request was made but no response received
                console.log('Error request:', error.request);
                Alert.alert('Error', 'No response from server. Please check your connection.');
            } else {
                // Something else caused the error
                console.log('Error message:', error.message);
                Alert.alert('Error', error.message);
            }
        }
    };

    const getKitDescription = (kitName) => {
        switch (kitName) {
            case 'HX1':
                return 'Discover how our innovative solutions infuse new life into discarded materials...';
            case 'HX2':
                return 'Make your journey a blissful, joyful, pocket-friendly, eco-friendly...';
            case 'HX3':
                return 'Prepare to take your bike adventures to new heights with our electrifying hybrid upgrade...';
            default:
                return 'No description available for this kit.';
        }
    };

    const getKitImage = (kitName) => {
        switch (kitName) {
            case 'HX1':
                return require('../assets/images/HX-1.png');
            case 'HX2':
                return require('../assets/images/cart2.png');
            case 'HX3':
                return require('../assets/images/cart1.png');
            default:
                return require('../assets/images/cart1.png');
        }
    };

    const getRecommendedIcon = (kitName) => {
        if (cc > 125 && cc <= 150 && kitName === 'HX3') {
            return require('../assets/images/recomended.png');
        } else if (cc >= 100 && cc <= 125 && kitName === 'HX2') {
            return require('../assets/images/recomended.png');
        }
        else {
            return null;
        }
    };

    const renderProduct = ({ item }) => {
        const currentPrice = item.price;
        const mrp = currentPrice + 5000;

        return (
            <View style={[styles.productContainer, { backgroundColor: 'white' }]}>
                <Image source={getKitImage(item.name)} style={styles.productImage} />
                {getRecommendedIcon(item.name) && (
                    <Image source={getRecommendedIcon(item.name)} style={styles.recommendedIcon} />
                )}
                <Text style={styles.productHeading}>{item.name}</Text>
                <Text style={styles.productPrice}>Current Price: {currentPrice}</Text>
                <Text style={styles.mrpPrice}>MRP: {mrp}</Text>
                <Text style={styles.productDescription}>{getKitDescription(item.name)}</Text>

                <TouchableOpacity
                    style={[styles.addButton, (!item.isApplicable || !termsAccepted) && styles.disabledButton]}
                    onPress={() => item.isApplicable && addKit(item._id, item.name, item.price)}
                    disabled={!item.isApplicable || !termsAccepted}
                >
                    <Text style={styles.addButtonText}>Add Kit</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const handleAcceptTerms = () => {
        setTermsAccepted(true); // Set terms as accepted
    };

    return (
        <LinearGradient colors={['#06264D', '#FFF']} style={styles.gradientBackground}>
            {/* Use the ProfileButton component */}
            <ProfileButton onPress={() => setModalVisible(true)} />
            <View style={styles.container}>
                <Text style={styles.descriptionText}>
                    Based on your bike's CC ({cc}), the following kits are suitable:
                </Text>

                <FlatList
                    data={recommendedKits}
                    renderItem={renderProduct}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.productList}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            {/* Checkbox for Terms and Conditions at the bottom */}
            <View style={styles.termsContainer}>
                <TouchableOpacity
                    style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}
                    onPress={() => setTermsAccepted(!termsAccepted)}
                >
                    {termsAccepted && <Text style={styles.checkmark}>✔</Text>}
                </TouchableOpacity>
                <Text style={styles.checkboxLabel}>I accept the terms and conditions (Above bike are not part of the kit) </Text>
            </View>

            {/* <View style={styles.container2}>
                <TermsAndConditionsCheckbox
                    navigation={navigation}
                    termsAccepted={termsAccepted}
                    handleAcceptTerms={handleAcceptTerms}
                />
                <Text style={styles.checkboxLabel}>(Above bikes are not part of the kit)</Text>
            </View> */}


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
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: height * 0.1, // Adjusted padding to 10% of screen height
    },
    descriptionText: {
        paddingTop: height * 0.03, // 3% of height
        fontSize: width * 0.045,   // Adjust font size based on screen width (4.5%)
        color: 'white',
        textAlign: 'center',
        paddingHorizontal: width * 0.05,  // 5% of width
        marginBottom: height * 0.03, // 3% of height
        lineHeight: width * 0.06,    // Adjusted line height based on screen width
    },
    productList: {
        alignItems: 'center',
    },
    productContainer: {
        marginBottom: height * 0.025, // Adjusted margin based on height (2.5%)
        padding: width * 0.04,        // 4% of width
        borderRadius: 10,
        width: width * 0.8,           // 80% of screen width
        height: height * 0.5,         // 50% of screen height
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    productImage: {
        width: width * 0.4,           // 40% of width
        height: height * 0.15,        // 15% of height
        resizeMode: 'contain',
    },
    recommendedIcon: {
        position: 'absolute',
        top: 10,
        right: 5,
        width: width * 0.13,          // Adjust icon size (13%)
        height: height * 0.07,
        resizeMode: 'contain',
    },
    productHeading: {
        fontSize: width * 0.045,      // Font size 4.5% of width
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: height * 0.01,  // Margin 1% of height
        color: '#06264D',
    },
    productPrice: {
        fontSize: width * 0.04,       // 4% of width
        color: 'green',
        fontWeight: 'bold',
    },
    mrpPrice: {
        fontSize: width * 0.035,      // 3.5% of width
        textDecorationLine: 'line-through',
        color: 'red',
    },
    productDescription: {
        fontSize: width * 0.03,       // 3% of width
        textAlign: 'center',
        marginTop: height * 0.01,     // 1% of height
        color: '#333',
    },
    addButton: {
        backgroundColor: '#06264D',
        paddingVertical: height * 0.015,  // 1.5% of height
        paddingHorizontal: width * 0.05,  // 5% of width
        borderRadius: 5,
        marginTop: height * 0.015,  // 1.5% of height
    },
    disabledButton: {
        backgroundColor: '#d3d3d3',
    },
    addButtonText: {
        color: 'white',
        fontSize: width * 0.045, // 4.5% of width
        fontWeight: 'bold',
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: height * 0.05,  // 5% of height
    },
    checkbox: {
        width: width * 0.06,     // 6% of width
        height: width * 0.06,    // 6% of width
        borderWidth: 2,
        borderColor: '#06264D',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: width * 0.02, // 2% of width
    },
    checkboxChecked: {
        backgroundColor: '#06264D',
    },
    checkboxLabel: {
        fontSize: width * 0.035, // 3.5% of width
        color: '#06264D',
        textAlign: 'center',
    },
    container2: {
        flexDirection: 'column', // Aligns children vertically
        alignItems: 'center',     // Centers children horizontally
        justifyContent: 'center',  // Centers children vertically
        padding: 16,              // Optional: add padding for aesthetics
    },
});

export default Recomanded;