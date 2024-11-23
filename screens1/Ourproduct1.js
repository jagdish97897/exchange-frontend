import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ProfileButton1 from './ProfileButton1';
import CustomModal1 from './CustomModel1.js';

const { width, height } = Dimensions.get('window'); // Get screen width and height

const Ourproduct1 = ({ route }) => {
    const { user } = route.params;
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

    const products = [
        { id: '1', heading: 'KGV HX3', description: 'Prepare to take your bike adventures to new heights with our electrifying hybrid upgrade! Brace yourself for an exciting journey into the future as you seamlessly ride with sustainable fuel, making a positive impact on the climate along the way.' },
        { id: '2', heading: 'KGV HX2', description: 'Are you passionate about cycling and interested in bringing the joy of riding KGV hybrid bikes to your community? Join us as a distributor and be a part of our journey to redefine urban commuting!' },
        { id: '3', heading: 'KGV HX1', description: 'Discover how our innovative solutions infuse new life into discarded materials. Our Waste to Wealth initiative seamlessly combines sustainability with performance, providing riders with an eco-friendly ride. Explore the journey of every mile, showcasing the transformation of waste into valuable resources. Join us in our mission to smart e-mobility hybrid revolution for a cleaner,brighter future.' },
        { id: '4', heading: 'Coming Soon', description: 'Stay tuned for our exciting new product launch. Something amazing is on its way!' },
    ];

    const renderProduct = ({ item }) => (
        <View style={styles.productContainer}>
            <Text style={styles.productHeading}>{item.heading}</Text>
            <Text style={styles.productDescription}>{item.description}</Text>
        </View>
    );

    return (
        <LinearGradient colors={['#545a2c', '#FFF']} style={styles.gradientBackground}>
            <View style={styles.container}>
                <Text style={styles.ourproduct}>Product Catalogue</Text>
                <Text style={styles.description}>Hybrid Electric-Vehicle-Kit For Bikes</Text>
                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.productList}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            <ProfileButton1 onPress={() => setModalVisible(true)} />

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Visitordetails1', { user })}
            >
                <Text style={styles.buttonText}>Let's move</Text>
                <Icon name="arrow-forward" size={24} color="#FFF" />
            </TouchableOpacity>

            <CustomModal1
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
        paddingTop: height * 0.11, // Responsive top padding
    },
    ourproduct: {
        fontSize: width * 0.08, // Responsive font size
        fontWeight: 'bold',
        color: 'white',
        marginBottom: height * 0.03, // Responsive margin
    },
    description: {
        fontSize: width * 0.05, // Responsive font size
        fontWeight: 'bold',
        color: 'white',
        marginBottom: height * 0.03, // Responsive margin
    },
    productList: {
        alignItems: 'center',
    },
    productContainer: {
        marginBottom: height * 0.02, // Responsive margin
        padding: width * 0.05, // Responsive padding
        backgroundColor: '#f8f8f8',
        borderRadius: width * 0.08, // Responsive border radius
        borderWidth: 2,
        borderColor: '#acced8',
        width: width * 0.9, // Responsive width
        alignItems: 'center',
    },
    productHeading: {
        fontSize: width * 0.06, // Responsive font size
        fontWeight: 'bold',
        marginBottom: height * 0.01, // Responsive margin
    },
    productDescription: {
        fontSize: width * 0.045, // Responsive font size
        textAlign: 'center',
    },
    button: {
        position: 'absolute',
        bottom: height * 0.08,
        left: width * 0.5,
        transform: [{ translateX: -width * 0.2 }],
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#545a2c',
        padding: width * 0.03,
        borderRadius: width * 0.02,
    },
    buttonText: {
        color: 'white',
        fontSize: width * 0.05,
        marginRight: width * 0.02,
    },
});

export default Ourproduct1;
