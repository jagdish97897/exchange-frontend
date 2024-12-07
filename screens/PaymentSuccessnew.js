import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const PaymentSuccessnew = ({ route }) => {
    const navigation = useNavigation();
    const { paymentId, formData } = route.params;
    const [isParticipated, setIsParticipated] = useState(false);
    console.log('formData', formData);

    const handleSpinFeature = () => {
        // Navigate to the home screen or any other screen
        navigation.navigate('Landing', { userId: formData.userId });
    };

    useEffect(() => {
        const userInfo = async () => {
            try {
                const response = await axios.get(`http://192.168.1.13:8000/api/files/user/${formData.phone}`);
                console.log(response.data)
                setIsParticipated(response.data.data.user.isParticipated);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };

        userInfo();
    }, [formData.phone]); // Add formData.phone as a dependency

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.successText}>Payment Successful!</Text>

            <Text style={styles.paymentIdText}>Payment ID: {paymentId}</Text>

            <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>Payment Details:</Text>
                <Text style={styles.detailText}>Name: {formData.name}</Text>
                <Text style={styles.detailText}>Email: {formData.email}</Text>
                <Text style={styles.detailText}>Phone: {formData.phone}</Text>
                <Text style={styles.detailText}>Adhaar No: {formData.adhaarno}</Text>
                <Text style={styles.detailText}>Daily Running: {formData.dailyrunning}</Text>
                <Text style={styles.detailText}>Vehicle No: {formData.vehicleno}</Text>
            </View>

            <Text style={styles.text}>You will get all update at your mail.</Text>

            <TouchableOpacity
                style={styles.button}
                onPress={handleSpinFeature}
            >
                <Text style={styles.buttonText}>{isParticipated ? 'Already Participated' : 'Go To Main menu'}</Text>
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

export default PaymentSuccessnew;