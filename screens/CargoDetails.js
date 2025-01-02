import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    TouchableOpacity,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export const getCurrentDate = (today) => {
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    return ` ${day} -${month} -${year}`;
};

const CargoDetails = ({ route }) => {
    const navigation = useNavigation();
    const { from, to, phoneNumber, currentLocation } = route.params;

    const [cargoType, setCargoType] = useState('');
    const [quotePrice, setQuotePrice] = useState('');
    const [payloadWeight, setPayloadWeight] = useState('');
    const [payloadHeight, setPayloadHeight] = useState('');
    const [payloadLength, setPayloadLength] = useState('');
    const [payloadWidth, setPayloadWidth] = useState('');
    const [tripDate, setTripDate] = useState(new Date());
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [specialInstruction, setSpecialInstruction] = useState('');

    const handleSubmit = async () => {
        if (!cargoType || !quotePrice || !payloadWeight) {
            Alert.alert('Validation Error', 'Cargo type, payload cost, and payload weight are required!');
            return;
        }

        const cargoDetails = {
            cargoType,
            quotePrice: parseFloat(quotePrice),
            payloadWeight: parseFloat(payloadWeight),
            payloadHeight: payloadHeight ? parseFloat(payloadHeight) : null,
            payloadLength: payloadLength ? parseFloat(payloadLength) : null,
            payloadWidth: payloadWidth ? parseFloat(payloadWidth) : null,
        };

        try {
            const response = await axios.post(`http://192.168.1.3:8000/api/trips/create`, {
                from,
                to,
                phoneNumber,
                currentLocation,
                cargoDetails,
                tripDate,
                specialInstruction,
            });

            if (response.status === 200) {
                Alert.alert('Cargo Details Submitted', 'Your cargo details have been successfully submitted!');
                // Navigate to TripSummary or any other screen
                navigation.navigate('TripSummary', { tripId: response.data.tripId });
            }
        } catch (error) {
            console.log('Error while submitting cargo details:', error);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title}>Cargo Details</Text>
            <Text style={styles.title}>{phoneNumber}</Text>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.container}>
                    {/* Cargo Type */}
                    <Text style={styles.label}>Cargo Type</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Cargo type"
                        value={cargoType}
                        onChangeText={setCargoType}
                    />
                    {/* Payload Weight */}
                    <Text style={styles.label}>Payload Weight (in tonnes)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Payload weight"
                        keyboardType="numeric"
                        value={payloadWeight}
                        onChangeText={setPayloadWeight}
                    />
                    {/* Payload Dimensions */}
                    <Text style={styles.label}>Payload Height (in feet)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Payload height"
                        keyboardType="numeric"
                        value={payloadHeight}
                        onChangeText={setPayloadHeight}
                    />
                    <Text style={styles.label}>Payload Length (in feet)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Payload length"
                        keyboardType="numeric"
                        value={payloadLength}
                        onChangeText={setPayloadLength}
                    />
                    <Text style={styles.label}>Payload Width (in feet)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Payload width"
                        keyboardType="numeric"
                        value={payloadWidth}
                        onChangeText={setPayloadWidth}
                    />
                    {/* Trip Date */}
                    <Text style={styles.label}>Trip Date</Text>
                    <TouchableOpacity
                        style={styles.dateInput}
                        onPress={() => {
                            setIsDatePickerOpen(true);
                        }}
                    >
                        <Text>{getCurrentDate(tripDate)}</Text>
                    </TouchableOpacity>
                    <DatePicker
                        modal
                        open={isDatePickerOpen}
                        date={tripDate}
                        onConfirm={(date) => {
                            setIsDatePickerOpen(false);
                            setTripDate(date);
                        }}
                        onCancel={() => {
                            setIsDatePickerOpen(false);
                        }}
                    />
                    {/* Special Instruction */}
                    <Text style={styles.label}>Special Instruction</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Special instruction"
                        value={specialInstruction}
                        onChangeText={setSpecialInstruction}
                    />
                    {/* Quote Price */}
                    <Text style={styles.label}>Quote Price</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Payload cost"
                        keyboardType="numeric"
                        value={quotePrice}
                        onChangeText={setQuotePrice}
                    />
                    {/* Submit Button */}
                    <Button title="Submit" onPress={handleSubmit} />
                </View>
            </ScrollView>
        </View>
    );
};

export default CargoDetails;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    scrollViewContainer: {
        flexGrow: 1,
    },
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 16,
        borderRadius: 4,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 16,
        borderRadius: 4,
    },
});