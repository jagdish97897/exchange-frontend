import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import ProfileButton from './ProfileButton';
import CustomModal from './CustomModal';

const { width, height } = Dimensions.get('window');

const ViewCartItems = ({ route, navigation }) => {
    // console.log('route.params', route.params);
    const { visitorId: userId, visitorName, user } = route.params;
    const [cartId, setCartId] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        // Fetch cart ID
        axios.get(`http://192.168.1.5:8005/api/cart/${userId}`)
            .then(response => {
                setCartId(response.data._id);
            })
            .catch(error => {
                console.log('Error fetching cartId:', error);
                // Alert.alert('Error', 'Unable to fetch cart information');
                setLoading(false);
            });
    }, [userId]);

    useEffect(() => {
        if (cartId) {
            // Fetch cart items
            axios.get(`http://192.168.1.5:8005/api/cart/item/${cartId}`)
                .then(response => {
                    const items = response.data.cartItems;
                    setCartItems(items);
                })
                .catch(error => {
                    console.log('Error fetching cart items: ', error);
                    // Alert.alert('Error', 'Unable to fetch cart items');
                });
        }

        // Fetch wishlist items
        axios.get(`http://192.168.1.5:8005/api/wishlist/${userId}`)
            .then(response => {
                const items = response.data.wishlistItems;
                // console.log('wishlistsItems', items)
                setWishlistItems(items);
            })
            .catch(error => {
                console.log('Error fetching wishlist items:', error);
                // Alert.alert('Error', 'Unable to fetch wishlist items');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [cartId]);

    const handleMoveToWishlist = (itemId) => {
        axios.post(`http://192.168.1.5:8005/api/wishlist/moveToWishlist/${itemId}`, { userId })
            .then((response) => {
                // Remove item from cart and add to wishlist
                setCartItems(cartItems.filter(item => item._id !== itemId));
                setWishlistItems(response.data.wishlistItems);
                Alert.alert('Success', 'Item moved to wishlist');
            })
            .catch(error => {
                console.log('Error moving item to wishlist:', error);
                Alert.alert('Error', 'Unable to move item to wishlist');
            });
    };

    const handleMoveToCart = (itemId) => {
        axios.post(`http://192.168.1.5:8005/api/cart/moveToCart/${itemId}`, { userId })
            .then((response) => {
                // Remove item from wishlist and add to cart
                setWishlistItems(wishlistItems.filter(item => item._id !== itemId));
                setCartItems(response.data.cartItems);
                Alert.alert('Success', 'Item moved to cart');
            })
            .catch(error => {
                console.log('Error moving item to cart:', error);
                Alert.alert('Error', 'Unable to move item to cart');
            });
    };


    const handleDeleteCartItem = (itemId) => {
        console.log('Attempting to delete item with ID:', itemId);
        axios.delete(`http://192.168.1.5:8005/api/cart/cart/item/${itemId}`)
            .then(() => {
                setCartItems(cartItems.filter(item => item._id !== itemId));
                Alert.alert('Success', 'Item removed from cart');
            })
            .catch(error => {
                console.log('Error deleting item:', error);
                Alert.alert('Error', 'Unable to delete item');
            });
    };

    const handleDeleteWishlistItem = (itemId) => {
        console.log('Attempting to delete item with ID:', itemId);
        axios.delete(`http://192.168.1.5:8005/api/wishlist/${userId}/${itemId}`)
            .then(() => {
                setWishlistItems(wishlistItems.filter(item => item._id !== itemId));
                Alert.alert('Success', 'Item removed from wishlist');
            })
            .catch(error => {
                console.log('Error deleting item:', error);
                Alert.alert('Error', 'Unable to delete item');
            });
    };

    const handleAddItem = () => {
        // Navigate to the screen where the user can add items to the cart and pass userId
        navigation.navigate('Visitordetails', { user });
    };

    const handleContinue = () => {
        // Handle the continue action here
        navigation.navigate('SummaryCart', { visitorId: userId, user });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00aaff" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <LinearGradient colors={['#06264D', '#FFF']} style={styles.gradient}>
            <View style={styles.container}>
                <Text style={styles.headerText}>Cart for {visitorName}</Text>
                <ProfileButton onPress={() => setModalVisible(true)} />
                {/* Cart Items */}
                {cartItems.length > 0 ? (
                    <FlatList
                        data={cartItems}
                        keyExtractor={(item) => item._id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.itemContainer}>
                                <View style={styles.itemDetails}>
                                    <Text style={styles.itemTitle}>Kit Name: {item.item.name}</Text>
                                    <Text style={styles.itemText}>Price: ₹{item.item.totalPrice}</Text>
                                    <Text style={styles.itemText}>Vehicle No: {item.item.vehicleno}</Text>

                                    {item.item.addons && item.item.addons.length > 0 && (
                                        <View style={styles.addonContainer}>
                                            <Text style={styles.addonTitle}>Items:</Text>
                                            {item.item.addons.map((addon) => (
                                                <View key={addon._id} style={styles.addonItem}>
                                                    <Text style={styles.addonText}>Name: {addon.name}</Text>
                                                    <Text style={styles.addonText}>Quantity: {addon.quantity}</Text>
                                                    <Text style={styles.addonText}>Price: ₹{addon.price}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                    {/* Move to wishlist button */}
                                    <TouchableOpacity onPress={() => handleMoveToWishlist(item._id)}>
                                        <Text style={styles.moveButton}>Move to Wishlist</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteCartItem(item._id)}>
                                    <Icon name="delete" size={24} color="#ff4d4d" />
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                ) : (
                    <Text style={styles.emptyText}>No items in the cart.</Text>
                )}

                {/* Wishlist Items */}
                {wishlistItems.length > 0 ? (
                    <>
                        <Text style={styles.headerText}>Wishlist</Text>
                        <FlatList
                            data={wishlistItems}
                            keyExtractor={(item) => item._id.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.itemContainer}>
                                    <View style={styles.itemDetails}>
                                        <Text style={styles.itemTitle}>Kit Name: {item.item.name}</Text>
                                        <Text style={styles.itemText}>Price: ₹{item.item.totalPrice}</Text>
                                        <Text style={styles.itemText}>Vehicle No: {item.item.vehicleno}</Text>

                                        {item.item.addons && item.item.addons.length > 0 && (
                                            <View style={styles.addonContainer}>
                                                <Text style={styles.addonTitle}>Items:</Text>
                                                {item.item.addons.map((addon) => (
                                                    <View key={addon._id} style={styles.addonItem}>
                                                        <Text style={styles.addonText}>Name: {addon.name}</Text>
                                                        <Text style={styles.addonText}>Quantity: {addon.quantity}</Text>
                                                        <Text style={styles.addonText}>Price: ₹{addon.price}</Text>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                        {/* Move to cart button */}
                                        <TouchableOpacity onPress={() => handleMoveToCart(item._id)}>
                                            <Text style={styles.moveButton}>Move to Cart</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteWishlistItem(item._id)}>
                                        <Icon name="delete" size={24} color="#ff4d4d" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </>
                ) : (
                    <Text style={styles.emptyText}>No items in the wishlist.</Text>
                )}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
                    <Text style={styles.addButtonText}>Add Item</Text>
                </TouchableOpacity>
                {/* 
                <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                    <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                    style={[styles.continueButton, cartItems.length === 0 && styles.disabledButton]}
                    onPress={handleContinue}
                    disabled={cartItems.length === 0}  // Disable button if no cart items
                >
                    <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
            </View>

            {<CustomModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                navigation={navigation}
                user={user}
            />}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: width * 0.05,           // 5% of the screen width
        marginBottom: height * 0.08,     // 8% of the screen height for button space
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContainer: {
        marginBottom: height * 0.02,     // 2% of the screen height
        padding: width * 0.05,           // 5% of the screen width
        backgroundColor: '#ffffff',
        borderRadius: width * 0.04,      // Adjust the radius for responsiveness
        borderLeftWidth: 6,
        borderLeftColor: '#00aaff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemDetails: {
        flex: 1,
    },
    itemTitle: {
        fontSize: width * 0.045,          // Dynamic font size (4.5% of the screen width)
        fontWeight: 'bold',
        marginBottom: height * 0.01,     // 1% of the screen height
        color: '#007acc',
    },
    itemText: {
        fontSize: width * 0.04,           // 4% of the screen width
        color: '#555',
        marginBottom: height * 0.01,     // 1% of the screen height
    },
    addonContainer: {
        marginTop: height * 0.015,       // 1.5% of the screen height
        paddingLeft: width * 0.03,       // 3% of the screen width
        borderLeftWidth: 2,
        borderLeftColor: '#007acc',
    },
    addonTitle: {
        fontSize: width * 0.04,           // 4% of the screen width
        fontWeight: 'bold',
        color: '#007acc',
        marginBottom: height * 0.01,     // 1% of the screen height
    },
    addonItem: {
        marginBottom: height * 0.01,     // 1% of the screen height
    },
    addonText: {
        fontSize: width * 0.035,          // 3.5% of the screen width
        color: '#555',
    },
    loadingText: {
        fontSize: width * 0.045,          // 4.5% of the screen width
        color: '#007acc',
        textAlign: 'center',
        marginTop: height * 0.02,        // 2% of the screen height
    },
    emptyText: {
        fontSize: width * 0.045,          // 4.5% of the screen width
        color: '#777',
        textAlign: 'center',
        marginTop: height * 0.02,        // 2% of the screen height
    },
    headerText: {
        fontSize: width * 0.06,           // 6% of the screen width
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: height * 0.03,     // 3% of the screen height
    },
    visitorNameText: {
        fontSize: width * 0.05,           // 5% of the screen width
        color: '#333',
        textAlign: 'center',
        marginBottom: height * 0.03,     // 3% of the screen height
    },
    deleteButton: {
        padding: width * 0.025,           // 2.5% of the screen width
        backgroundColor: '#ffebee',
        borderRadius: width * 0.08,       // Adjust the radius for responsiveness
        borderColor: '#ff4d4d',
        borderWidth: 1,
    },
    disabledButton: {
        backgroundColor: 'gray',
        opacity: 0.5,
    },
    cartButton: {
        alignSelf: 'flex-end',
        padding: width * 0.025,           // 2.5% of the screen width
        backgroundColor: '#06264D',
        borderRadius: width * 0.08,       // Adjust the radius for responsiveness
        marginTop: height * 0.05,        // 5% of the screen height
    },
    buttonContainer: {
        position: 'absolute',
        bottom: height * 0.01,            // 1% of the screen height
        right: width * 0.15,              // 15% of the screen width
        flexDirection: 'row',
    },
    addButton: {
        marginRight: width * 0.2,         // 20% of the screen width
        padding: height * 0.02,           // 2% of the screen height
        backgroundColor: '#007acc',
        borderRadius: width * 0.08,       // Adjust the radius for responsiveness
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: width * 0.045,          // 4.5% of the screen width
        color: '#FFF',
        fontWeight: 'bold',
    },
    continueButton: {
        padding: height * 0.02,           // 2% of the screen height
        backgroundColor: '#007acc',
        borderRadius: width * 0.08,       // Adjust the radius for responsiveness
        alignItems: 'center',
    },
    continueButtonText: {
        fontSize: width * 0.045,          // 4.5% of the screen width
        color: '#FFF',
        fontWeight: 'bold',
    },
    moveButton: {
        fontSize: width * 0.04,           // 4% of the screen width
        color: '#007acc',
        marginTop: height * 0.015,        // 1.5% of the screen height
    },
});

export default ViewCartItems;