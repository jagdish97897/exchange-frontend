import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';


const ProductComparison1 = ({ navigation, route }) => {
    const { vehicleno } = route.params; 

    return (
        <LinearGradient colors={['#06264D', "#FFF"]} style={styles.gradient}>
            <ScrollView style={styles.container}>
        
                <Text style={styles.title}>Product Comparison</Text>
              
                <Image source={require('../assets/images/whykgv1.png')} style={styles.logo} />
                   

            </ScrollView>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Visitorcomparechart', { vehicleno })}
            >
                <Text style={styles.buttonText}>Go to Next Page</Text>
                <Icon name="arrow-forward" size={24} color="#FFF" />
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    logo: {
        width: 470,
        height: 800,
        alignSelf: 'center',
        marginLeft: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 16,
        marginTop: 136,
    },
  
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#06264D',
        borderBottomWidth: 1,
        borderColor: 'white',
    },
    headerCell: {
        flex: 1,
        padding: 8,
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
        padding: 8,
        color: 'white',
        textAlign: 'center',
    },
    icon: {
        width: 20,
        height: 20,
    },
    button: {
        position: 'absolute',
        bottom: 80,
        left: '50%',
        transform: [{ translateX: -100 }],
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#06264D',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        marginRight: 10,
    },
});

export default ProductComparison1;