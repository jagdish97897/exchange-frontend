import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';

const PremiumPayment = ({ route }) => {
    const navigation = useNavigation();
    const { paymentId, formData } = route.params;
    const [spinTheWheel, setSpinTheWheel] = useState(false);
    // console.log('formData', formData);

    const handleSpinFeature = () => {
        if (spinTheWheel) {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'MainNavigator1', params: { screen: 'Welcome1', params: { visitorId: formData.userId } } }],
                })
            );
        }
        else {
            //  Navigate to the success screen
            navigation.navigate('SpinFeature', { userId: formData.userId });
        }
    };

    useEffect(() => {
        const userInfo = async () => {
            try {
                const response = await axios.get(`http://192.168.1.13:8000/api/v1/visitor/details/${formData.userId}`);
                // console.log('response.data.data[0].spinTheWheel', response.data.data[0].spinTheWheel)
                setSpinTheWheel(response.data.data[0].spinTheWheel);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        userInfo();
    }, [formData.phoneNumber]); // Add formData.phone as a dependency

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.successText}>Payment Successful!</Text>

            <Text style={styles.paymentIdText}>Payment ID: {paymentId}</Text>

            <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>Payment Details:</Text>
                <Text style={styles.detailText}>Name: {formData.fullName}</Text>
                <Text style={styles.detailText}>Email: {formData.email}</Text>
                <Text style={styles.detailText}>Phone: {formData.phoneNumber}</Text>
                <Text style={styles.detailText}>Adhaar No: {formData.aadhar}</Text>
                <Text style={styles.detailText}>DL No: {formData.dlno}</Text>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={handleSpinFeature}
            >
                <Text style={styles.buttonText}>{!spinTheWheel ? 'Spin The WheelOfFortune' : 'Go To Main menu'}</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    animation: {
        width: 150,
        height: 150,
    },
    successText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
        color: '#28a745',
    },
    text: {
        fontSize: 14,
        fontWeight: 'bold',
        marginVertical: 20,
        color: '#28a750',
    },
    paymentIdText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
    },
    detailsContainer: {
        width: '100%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 30,
    },
    detailsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#444',
    },
    detailText: {
        fontSize: 16,
        marginBottom: 5,
        color: '#666',
    },
    button: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PremiumPayment;