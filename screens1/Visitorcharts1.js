import React, { useState } from 'react';
import { Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileButton1 from './ProfileButton1.js';
import CustomModal1 from './CustomModel1.js';

const { width, height } = Dimensions.get('window');

const ProductComparison1 = ({ navigation, route }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { vehicleno, user } = route.params;

    return (
        <LinearGradient colors={['#545a2c', "#FFF"]} style={styles.gradient}>
            {/* Use the ProfileButton component */}
            <ProfileButton1 onPress={() => setModalVisible(true)} />
            <Text style={styles.title}>Why KGV ?</Text>
            <ScrollView style={styles.container}>

                <Image source={require('../assets/images/Why KGV.png')} style={styles.logo} />
            </ScrollView>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Visitorcomparechart1', { vehicleno, user })}
            >
                <Text style={styles.buttonText}>Let's Go</Text>
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
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: width * 0.01,
        paddingTop: 0  // Adjust padding based on screen width
    },
    logo: {
        width: width * 1.2, // 80% of the screen width
        height: height * 0.98, // 40% of the screen height
        alignSelf: 'center',
        marginLeft: width * 0.253, // Responsive margin
        // marginTop: height * 0.01
        marginRight: width * 0.08
    },
    title: {
        fontSize: width * 0.06, // Responsive font size (6% of screen width)
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: height * 0, // Adjust margin based on screen height
        marginTop: height * 0.08, // Adjust margin based on screen height
    },

    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#06264D',
        borderBottomWidth: 1,
        borderColor: 'white',
    },
    headerCell: {
        flex: 1,
        padding: height * 0.01, // Responsive padding
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: 'white',
    },
    cell: {
        flex: 1,
        padding: height * 0.01, // Responsive padding
        color: 'white',
        textAlign: 'center',
    },
    icon: {
        width: width * 0.05, // Responsive icon size
        height: width * 0.05, // Keep it square
    },
    button: {
        position: 'absolute',
        bottom: height * 0.031, // 10% from the bottom of the screen
        left: '60%',
        transform: [{ translateX: -width * 0.25 }], // Responsive horizontal translation
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#545a2c',
        padding: width * 0.03, // Responsive padding
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: width * 0.05, // Responsive font size (5% of screen width)
        marginRight: width * 0.02, // Responsive margin
    },
});

export default ProductComparison1;

