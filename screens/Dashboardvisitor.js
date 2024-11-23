import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, Text, StyleSheet, View, Image } from 'react-native';

export default ({ route }) => {
    const { user } = route.params; // Get the user data from route params

    return (
        <LinearGradient colors={['#06264D', "#FFF"]} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, padding: 40 }}>
                <View style={styles.container}>
                    <Image
                        source={require("../assets/images/logo-removebg-preview 1.png")}
                        style={styles.logo}
                    />
                    <Text style={styles.dashboardText}>Welcome, {user?.name}!</Text>
                    {/* Add more user details or dashboard content here */}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: 201,
        height: 181,
        alignSelf: 'center'
    },
    dashboardText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 20
    },
});
