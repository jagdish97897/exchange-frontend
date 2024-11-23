import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // Get screen width and height


const TermsAndConditionsCheckbox1 = ({ termsAccepted, handleAcceptTerms }) => {

    return (
        <TouchableOpacity
            onPress={handleAcceptTerms}
            style={styles.termsContainer}
        >
            <View style={styles.checkboxContainer}>
                <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                    {termsAccepted && <Text style={styles.checkmark}>✔</Text>}
                </View>
                <Text style={styles.linkText}>Accept Terms and Conditions</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({

    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: height * 0.015,
    },
    checkbox: {
        width: width * 0.06,
        height: height * 0.03,
        borderWidth: 1,
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: width * 0.03,
    },
    checkmark: {
        color: '#FFF',
        fontSize: width * 0.04,
    },
    checkboxLabel: {
        fontSize: width * 0.035,
        color: '#333',
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: height * 0.015
    },
    checkboxChecked: {
        backgroundColor: '#545a2c',
    },
    linkText: {
        color: '#007BFF',
        textDecorationLine: 'underline',
        marginVertical: height * 0.015
    },
});

export default TermsAndConditionsCheckbox1;
