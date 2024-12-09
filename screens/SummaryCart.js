
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from 'react-native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import { useWindowDimensions } from 'react-native';
import ProfileButton from './ProfileButton'; // Import the new component
import CustomModal from './CustomModal';

const { width, height } = Dimensions.get('window');

// Define a mapping of item names to image paths
const itemImages = {
    HX1: require('../assets/images/cart3.png'),
    HX2: require('../assets/images/cart2.png'),
    HX3: require('../assets/images/cart1.png'),
    // Add more mappings as needed
};

const CustomCheckbox = ({ isChecked, onPress, label }) => (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onPress}>
        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
            {isChecked && <Text style={styles.checkmark}>✔</Text>}
        </View>
        <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
);

const SummaryCart = ({ route, navigation }) => {
    const { visitorId: userId, user } = route.params;
    const [cartId, setCartId] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // console.log('user summary', user);

    const { width, height } = useWindowDimensions();

    useEffect(() => {
        axios.get(`http://localhost:8000/api/cart/${userId}`)
            .then(response => {
                setCartId(response.data._id);
            })
            .catch(error => {
                console.log('Error fetching cartId:', error);
                Alert.alert('Error', 'Unable to fetch cart information');
                setLoading(false);
            });
    }, [userId]);

    useEffect(() => {
        if (cartId) {
            axios.get(`http://localhost:8000/api/cart/item/${cartId}`)
                .then(response => {
                    const items = response.data.cartItems;
                    setCartItems(items);

                    const total = items.reduce((sum, item) => sum + item.item.totalPrice, 0);
                    setTotalPrice(total);

                    const totalItemsCount = items.reduce((sum, item) => sum + item.item.quantity, 0);
                    setTotalItems(totalItemsCount);
                })
                .catch(error => {
                    console.log('Error fetching cart items:', error);
                    Alert.alert('Error', 'Unable to fetch cart items');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [cartId]);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/v1/visitor/details/${userId}`)
            .then(response => {
                if (response.data.success) {
                    setUserDetails(response.data.data[0]);
                } else {
                    Alert.alert('Error', 'Unable to fetch user details');
                }
            })
            .catch(error => {
                console.log('Error fetching user details:', error);
                Alert.alert('Error', 'Unable to fetch user details');
            });
    }, [userId]);

    const handleContinueToPayment = () => {
        navigation.navigate('BookingKit', { visitorId: userId, totalItems: totalItems, totalPrice, cartId, user });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00aaff" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    const renderCartItem = ({ item }) => {
        const itemImage = itemImages[item.item.name] || require('../assets/images/cart2.png');

        return (
            <View style={styles.itemContainer}>
                <View style={styles.imageContainer}>
                    <Image source={itemImage} style={styles.itemImage} />
                </View>
                <View style={styles.itemDetails}>
                    <Text style={styles.itemTitle}>{item.item.name}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.originalPrice}>₹{item.item.originalPrice}</Text>
                        <Text style={styles.discountedPrice}>₹{item.item.totalPrice}</Text>
                    </View>
                    <Text style={styles.ratingText}>Rating: {item.item.rating} ★★★★★</Text>
                    <Text style={styles.quantityText}>Qty: {item.item.quantity}</Text>
                </View>
            </View>
        );
    };

    const handleAcceptTerms = () => {
        setTermsAccepted(true); // Set terms as accepted
    }

    return (
        <LinearGradient colors={['#06264D', '#FFF']} style={styles.gradient}>
            {/* Use the ProfileButton component */}
            <ProfileButton onPress={() => setModalVisible(true)} />
            <View style={styles.container}>
                {/* <Image source={require("../assets/images/kgv.png")} style={styles.logo} /> */}
                <Text style={styles.heading}>Order Summary</Text>

                {userDetails && (
                    <View style={styles.addressSection}>
                        <Text style={styles.addressTitle}>Receiver Details:</Text>
                        <Text style={styles.addressText}>{userDetails.fullName}</Text>
                        <Text style={styles.addressText}>{userDetails.address}</Text>
                        <Text style={styles.addressText}>{userDetails.phoneNumber}</Text>
                        <TouchableOpacity style={styles.changeButton}>
                            <Text style={styles.changeButtonText}>Change</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <FlatList
                    data={cartItems}
                    keyExtractor={(item) => item._id.toString()}
                    renderItem={renderCartItem}
                    contentContainerStyle={styles.itemList}
                />
                <CustomCheckbox
                    isChecked={termsAccepted}
                    onPress={() => setTermsAccepted(!termsAccepted)}
                    label="Accept Terms and Conditions"
                />
                <View style={styles.totalSection}>
                    <Text style={styles.totalText}>Total Amount ({totalItems} items): ₹{totalPrice}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.continueButton, { backgroundColor: termsAccepted ? '#ff9800' : '#ccc' }]}
                    disabled={!termsAccepted}
                    onPress={handleContinueToPayment}
                >
                    <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
            </View>
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
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: width * 0.05, // Use percentage-based padding
        paddingTop: height * 0.05,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: width * 0.045, // Responsive font size
        color: '#007acc',
        textAlign: 'center',
        marginTop: 20,
    },
    heading: {
        fontSize: width * 0.06, // Responsive font size
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        marginVertical: 20,
    },
    addressSection: {
        backgroundColor: '#FFF',
        padding: width * 0.05, // Responsive padding
        marginVertical: 10,
        borderRadius: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    addressTitle: {
        fontSize: width * 0.04, // Responsive font size
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    addressText: {
        fontSize: width * 0.035, // Responsive font size
        color: '#555',
    },
    logo: {
        width: '50%',
        height: undefined,
        aspectRatio: 201 / 181, // Maintain aspect ratio
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 40,
    },
    changeButton: {
        marginTop: 10,
        padding: width * 0.02, // Responsive padding
        backgroundColor: '#007acc',
        borderRadius: 5,
        alignItems: 'center',
    },
    changeButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    itemList: {
        paddingBottom: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        padding: width * 0.025, // Responsive padding
        backgroundColor: '#FFF',
        marginVertical: 5,
        marginHorizontal: width * 0.025, // Responsive margin
        borderRadius: 8,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    imageContainer: {
        flex: 1,
        marginRight: 10,
    },
    itemImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 4 / 3,
        borderRadius: 8,
    },
    itemDetails: {
        flex: 3,
    },
    itemTitle: {
        fontSize: width * 0.04, // Responsive font size
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    originalPrice: {
        fontSize: width * 0.035, // Responsive font size
        color: '#888',
        textDecorationLine: 'line-through',
        marginRight: 5,
    },
    discountedPrice: {
        fontSize: width * 0.04, // Responsive font size
        fontWeight: 'bold',
        color: '#e53935',
    },
    ratingText: {
        fontSize: width * 0.035, // Responsive font size
        color: '#777',
        marginTop: 5,
    },
    quantityText: {
        fontSize: width * 0.035, // Responsive font size
        color: '#777',
    },
    totalSection: {
        backgroundColor: '#FFF',
        padding: width * 0.05, // Responsive padding
        borderTopWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
    },
    totalText: {
        fontSize: width * 0.045, // Responsive font size
        fontWeight: 'bold',
        marginBottom: 10,
    },
    continueButton: {
        backgroundColor: '#ff9800',
        paddingVertical: height * 0.015, // Responsive padding
        paddingHorizontal: width * 0.05,
        borderRadius: 5,
        alignItems: 'center',
    },
    continueButtonText: {
        color: '#FFF',
        fontSize: width * 0.045, // Responsive font size
        fontWeight: 'bold',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    checkbox: {
        width: width * 0.05, // Responsive size
        height: width * 0.05, // Responsive size
        borderWidth: 1,
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    checkboxChecked: {
        backgroundColor: '#007acc',
    },
    checkmark: {
        color: '#FFF',
        fontSize: width * 0.03, // Responsive font size
    },
    checkboxLabel: {
        fontSize: width * 0.035, // Responsive font size
        color: '#333',
    },
});

export default SummaryCart;