

import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import DatePicker from 'react-native-date-picker';

export const getCurrentDate = (today) => {
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = today.getFullYear();

    return `${day}-${month}-${year}`;
};

const CargoDetails = ({ route }) => {
    const { from, to, phoneNumber, currentLocation } = route.params;

    const [formData, setFormData] = useState({
        cargoType: '',
        payloadCost: '',
        payloadWeight: '',
        payloadHeight: '',
        payloadLength: '',
        payloadWidth: '',
        tripDate: new Date(),
        isDatePickerOpen: false,
        specialInstruction: '',
    });

    const handleInputChange = (key, value) => {
        setFormData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleSubmit = async () => {
        const { cargoType, payloadCost, payloadWeight, payloadHeight, payloadLength, payloadWidth, tripDate } = formData;

        if (!cargoType || !payloadCost || !payloadWeight) {
            Alert.alert('Validation Error', 'Cargo type, payload cost, and payload weight are required!');
            return;
        }

        const cargoDetails = {
            cargoType,
            payloadCost: parseFloat(payloadCost),
            payloadWeight: parseFloat(payloadWeight),
            payloadHeight: payloadHeight ? parseFloat(payloadHeight) : null,
            payloadLength: payloadLength ? parseFloat(payloadLength) : null,
            payloadWidth: payloadWidth ? parseFloat(payloadWidth) : null,
        };

        try {
            const response = await axios.post(`http://192.168.1.6:8000/api/trips/create`, {
                from,
                to,
                phoneNumber,
                currentLocation,
                cargoDetails,
                tripDate,
            });

            if (response.status === 200) {
                Alert.alert('Cargo Details Submitted', 'Your cargo details have been successfully submitted!');
            }
        } catch (error) {
            console.log('Error while submitting cargo details:', error);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <Text style={styles.title}>Cargo Details</Text>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={styles.container}>
                    {/* Input Fields */}
                    {[
                        { label: 'Cargo Type', key: 'cargoType', placeholder: 'Cargo type' },
                        { label: 'Payload Cost', key: 'payloadCost', placeholder: 'Payload cost', keyboardType: 'numeric' },
                        { label: 'Payload Weight (in tonnes)', key: 'payloadWeight', placeholder: 'Payload weight', keyboardType: 'numeric' },
                        { label: 'Payload Height (in feet)', key: 'payloadHeight', placeholder: 'Payload height', keyboardType: 'numeric' },
                        { label: 'Payload Length (in feet)', key: 'payloadLength', placeholder: 'Payload length', keyboardType: 'numeric' },
                        { label: 'Payload Width (in feet)', key: 'payloadWidth', placeholder: 'Payload width', keyboardType: 'numeric' },
                        { label: 'Special Instruction', key: 'specialInstruction', placeholder: 'Special Instruction' },
                    ].map((field) => (
                        <View key={field.key}>
                            <Text style={styles.label}>{field.label}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={field.placeholder}
                                keyboardType={field.keyboardType || 'default'}
                                value={formData[field.key]}
                                onChangeText={(value) => handleInputChange(field.key, value)}
                            />
                        </View>
                    ))}

                    {/* Trip Date */}
                    <Text style={styles.label}>Trip Date</Text>
                    <TouchableOpacity
                        style={styles.dateInput}
                        onPress={() => handleInputChange('isDatePickerOpen', true)}
                    >
                        <Text>{getCurrentDate(formData.tripDate)}</Text>
                    </TouchableOpacity>
                    <DatePicker
                        modal
                        mode="date"
                        open={formData.isDatePickerOpen}
                        date={formData.tripDate}
                        onConfirm={(date) => {
                            handleInputChange('isDatePickerOpen', false);
                            handleInputChange('tripDate', date);
                        }}
                        onCancel={() => handleInputChange('isDatePickerOpen', false)}
                    />

                    {/* Submit Button */}
                    <Button title="Submit" onPress={handleSubmit} />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f4f4f9',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1d3557',
        marginVertical: 30,
        paddingHorizontal: 20,
    },
    scrollViewContainer: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    container: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        color: '#457b9d',
        marginBottom: 5,
    },
    input: {
        height: 45,
        borderColor: '#a8dadc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#ffffff',
        fontSize: 15,
        marginBottom: 15,
    },
    dateInput: {
        height: 45,
        borderColor: '#a8dadc',
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        paddingHorizontal: 10,
        backgroundColor: '#ffffff',
        fontSize: 15,
        marginBottom: 15,
    },
});

export default CargoDetails;


// import React, { useState } from 'react';
// import { ScrollView, View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
// import axios from 'axios';
// import DatePicker from 'react-native-date-picker';

// export const getCurrentDate = (today) => {
//     // const today = new Date();
//     const day = String(today.getDate()).padStart(2, '0');
//     const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//     const year = today.getFullYear();

//     return `${day}-${month}-${year}`;
// };

// const CargoDetails = ({ route }) => {
//     const { from, to, phoneNumber, currentLocation } = route.params;
//     const [cargoType, setCargoType] = useState('');
//     const [payloadCost, setPayloadCost] = useState('');
//     const [payloadWeight, setPayloadWeight] = useState('');
//     const [payloadHeight, setPayloadHeight] = useState('');
//     const [payloadLength, setPayloadLength] = useState('');
//     const [payloadWidth, setPayloadWidth] = useState('');
//     const [tripDate, setTripDate] = useState(new Date());
//     const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
//     const [SpecialInstruction, setSpecialInstruction] = useState('');


//     const handleSubmit = async () => {
//         try {
//             if (!cargoType || !payloadCost || !payloadWeight) {
//                 Alert.alert('Validation Error', 'Cargo type, payload cost, and payload weight are required!');
//                 return;
//             }

//             const cargoDetails = {
//                 cargoType,
//                 payloadCost: parseFloat(payloadCost),
//                 payloadWeight: parseFloat(payloadWeight),
//                 payloadHeight: payloadHeight ? parseFloat(payloadHeight) : null,
//                 payloadLength: payloadLength ? parseFloat(payloadLength) : null,
//                 payloadWidth: payloadWidth ? parseFloat(payloadWidth) : null,
//             };

//             const response = await axios.post(`http://192.168.1.6:8000/api/trips/create`, {
//                 from,
//                 to,
//                 phoneNumber,
//                 currentLocation,
//                 cargoDetails,
//                 tripDate,
//             });

//             if (response.status === 200) {
//                 Alert.alert('Cargo Details Submitted', 'Your cargo details have been successfully submitted!');
//             }


//         } catch (error) {
//             console.log('error  while submitting cargo details', error)
//         }
//     };

//     return (
//         <View style={styles.mainContainer}>
//             <Text style={styles.title}>Cargo Details</Text>
//             <ScrollView contentContainerStyle={styles.scrollViewContainer}>
//                 <View style={styles.container}>
//                     {/* Cargo Type */}
//                     <Text style={styles.label}>Cargo Type</Text>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Cargo type"
//                         value={cargoType}
//                         onChangeText={setCargoType}
//                     />

//                     {/* Payload Cost */}
//                     <Text style={styles.label}>Payload Cost</Text>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Payload cost"
//                         keyboardType="numeric"
//                         value={payloadCost}
//                         onChangeText={setPayloadCost}
//                     />

//                     {/* Payload Weight */}
//                     <Text style={styles.label}>Payload Weight (in tonnes)</Text>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Payload weight"
//                         keyboardType="numeric"
//                         value={payloadWeight}
//                         onChangeText={setPayloadWeight}
//                     />

//                     {/* Payload Height */}
//                     <Text style={styles.label}>Payload Height (in feet)</Text>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Payload height"
//                         keyboardType="numeric"
//                         value={payloadHeight}
//                         onChangeText={setPayloadHeight}
//                     />

//                     {/* Payload Length */}
//                     <Text style={styles.label}>Payload Length (in feet)</Text>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Payload length"
//                         keyboardType="numeric"
//                         value={payloadLength}
//                         onChangeText={setPayloadLength}
//                     />

//                     {/* Payload Width */}
//                     <Text style={styles.label}>Payload Width (in feet)</Text>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Payload width"
//                         keyboardType="numeric"
//                         value={payloadWidth}
//                         onChangeText={setPayloadWidth}
//                     />

//                     {/* Trip date */}
//                     <Text style={styles.label}>Trip date</Text>
//                     <TouchableOpacity
//                         style={styles.dateInput}
//                         onPress={() => { setIsDatePickerOpen(true) }}
//                     >
//                         <Text>{getCurrentDate(tripDate)}</Text>
//                     </TouchableOpacity>
//                     <DatePicker
//                         modal
//                         mode="date"
//                         open={isDatePickerOpen}
//                         date={tripDate}
//                         onConfirm={(date) => {
//                             setIsDatePickerOpen(false);
//                             setTripDate(date);
//                         }}
//                         onCancel={() => { setIsDatePickerOpen(false) }}
//                     >
//                     </DatePicker>

//                     <Text style={styles.label}>Special Instruction</Text>
//                     <TextInput
//                         style={styles.input}
//                         placeholder='Special Instruction'
//                         value={SpecialInstruction}
//                         onChangeText={setSpecialInstruction}
//                     />

//                     {/* Submit Button */}
//                     <Button title="Submit" onPress={handleSubmit} />
//                 </View>
//             </ScrollView>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     mainContainer: {
//         flex: 1,
//         backgroundColor: '#f4f4f9',
//     },
//     title: {
//         fontSize: 26,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         color: '#1d3557',
//         marginVertical: 30,
//         paddingHorizontal: 20,
//     },
//     scrollViewContainer: {
//         flexGrow: 1,
//         paddingBottom: 20,
//     },
//     container: {
//         padding: 20,
//     },
//     label: {
//         fontSize: 16,
//         color: '#457b9d',
//         marginBottom: 5,
//     },
//     input: {
//         height: 45,
//         borderColor: '#a8dadc',
//         borderWidth: 1,
//         borderRadius: 8,
//         paddingHorizontal: 10,
//         backgroundColor: '#ffffff',
//         fontSize: 15,
//         marginBottom: 15,
//     },
//     dateInput: {
//         height: 45,
//         borderColor: '#a8dadc',
//         borderWidth: 1,
//         borderRadius: 8,
//         justifyContent: 'center',
//         paddingHorizontal: 10,
//         backgroundColor: '#ffffff',
//         fontSize: 15,
//         marginBottom: 15,
//     },
// });

// export default CargoDetails;
