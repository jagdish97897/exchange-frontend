import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import * as Location from 'expo-location';

const LocationPermission = () => {
    const [permissionStatus, setPermissionStatus] = useState(null);

    useEffect(() => {
        requestLocationPermission();
    }, []);

    const requestLocationPermission = async () => {
        try {
            // Request location permissions
            const { status } = await Location.requestForegroundPermissionsAsync();
            setPermissionStatus(status);

            if (status === 'granted') {
                Alert.alert('Permission Granted', 'You have granted location access.');
            } else if (status === 'denied') {
                Alert.alert(
                    'Permission Denied',
                    'You have denied location access. Please enable it in settings if needed.',
                    [{ text: 'OK' }]
                );
            }
        } catch (error) {
            console.error('Error requesting location permission:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Location Permission Status: {permissionStatus || 'Unknown'}
            </Text>
            <Button
                title="Request Location Permission Again"
                onPress={requestLocationPermission}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    text: {
        fontSize: 18,
        marginBottom: 20,
    },
});

export default LocationPermission;
