import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Dashboard1 = ({ route }) => {
    const { vehicleno } = route.params;
    const [products, setProducts] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchKits = async () => {
            try {
                const response = await axios.get('http://192.168.1.13:8000/api/kits/get');
                setProducts(response.data.data);
            } catch (error) {
                console.log("Error fetching kits:", error);
            }
        };

        fetchKits();
    }, []);

    const renderProduct = ({ item }) => {
        // You can dynamically change the images and descriptions based on the product
        const imageSource = (item.name === 'HX1') ? require('../assets/images/cart3.png') :
            (item.name === 'HX2') ? require('../assets/images/cart2.png') :
                require('../assets/images/cart1.png');

        const description = (item.name === 'HX1') ? 'Discover how our innovative solutions infuse new life into discarded materials. Our Waste to Wealth initiative seamlessly combines sustainability with performance, providing riders with an eco-friendly ride. Explore the journey of every mile, showcasing the transformation of waste into valuable resources.' :
            (item.name === 'HX2') ? 'Make your journey a blissful, joyful, pocket-friendly, eco-friendly, and stress-free with our HX-2 Series specially designed for the hustlers heroes.' :
                'Prepare to take your bike adventures to new heights with our electrifying hybrid upgrade! Brace yourself for an exciting journey into the future as you seamlessly ride with sustainable fuel, making a positive impact on the climate along the way.';

        return (
            <View style={styles.productContainer}>
                <Image source={imageSource} style={styles.productImage} />
                <Text style={styles.productHeading}>{item.name}</Text>
                <Text style={styles.productDescription}>{description}</Text>
                <TouchableOpacity
                    style={styles.priceButton}
                    onPress={() => navigation.navigate('Recomanded', { vehicleno })}
                >
                    <Text style={styles.priceButtonText}>Price: {item.price}₹</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <LinearGradient colors={['#06264D', '#FFF']} style={styles.gradientBackground}>
            <View style={styles.container}>
                <View style={styles.nav}>
                    <View style={styles.textContainer}>

                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Recomanded', { vehicleno })}>
                        <Icon name="cart" size={30} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.descriptionText}>
                    KGV is a smart e-mobility solution provider that aims to cater to the society as it reduces the immense burden on the middle and lower segment of the community by reducing the cost of commuting by more than 90%.
                </Text>

                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.productList}
                    showsVerticalScrollIndicator={false}
                />
            </View>
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
        paddingTop: 80,
    },
    nav: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
        alignItems: 'center',
    },
    descriptionText: {
        paddingTop: 20,
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        lineHeight: 24,
    },
    productList: {
        alignItems: 'center',
    },
    productContainer: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    productImage: {
        width: 260,
        height: 180,
        marginBottom: 10,
    },
    productHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    productDescription: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    priceButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    priceButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Dashboard1;