import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TextInput, StyleSheet, View, Image, TouchableOpacity, Keyboard, Alert, ActivityIndicator  } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { API_END_POINT } from '../app.config';
import { MaterialIcons } from '@expo/vector-icons';
import DatePicker from 'react-native-date-picker';
import { getCurrentDate } from './CargoDetails';

export default ({ navigation }) => {

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        gstin: '',
        type: '',
        companyName: '',
        website: '',
        aadharNumber: '',
        panNumber: '',
        dob: new Date(),
        profileImage: null,
        gender: '',
    });

    const handleChange = (field, value) => {
        if (field === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setEmailError('Invalid email format');
            } else {
                setEmailError('');
            }
        }
        setFormData({ ...formData, [field]: value });
    };


    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission Denied', 'Permission to access media library is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            handleChange('profileImage', result.assets[0].uri);
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        const form = new FormData();
        for (const key in formData) {
            if (key === 'profileImage' && formData[key]) {
                const filename = formData.profileImage.split('/').pop();
                const fileType = filename.split('.').pop();
                form.append('profileImage', {
                    uri: formData.profileImage,
                    name: filename,
                    type: `image/${fileType}`, // remove any extra space
                });
            }
            else if (key === 'dob') {
                form.append('dob', JSON.stringify(formData.dob));
            }
            else {
                form.append(key, formData[key]);
            }
        }

        try {
            // console.log('form', form);
            const response = await fetch(`${API_END_POINT}/api/v1/users/signup`, {
                method: 'POST',
                body: form,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = await response.json();
            console.log('finish')

            if (response.ok) {
                Alert.alert('Success', 'Registration successful');
                navigation.navigate('Landing');
            } else {
                Alert.alert('Error', result.message || 'Registration failed');
            }
        } catch (error) {
            console.log(`Error: ${error}`);
            Alert.alert('Error', `Error: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const today = new Date();
    const eighteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 18));


    return (

        <View style={styles.container}>
            <View style={styles.whiteContainer}>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    scrollEnabled={true}
                    enableAutomaticScroll={true}
                    enableOnAndroid={true}
                    extraScrollHeight={100}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <Text style={styles.title}>Start Your Journey</Text>
                    <Text style={styles.subtitle}>
                        Signup to access seamless transportation solutions for your goods.
                    </Text>

                    <TextInput
                        placeholder='Full Name'
                        style={styles.input}
                        placeholderTextColor="#000"
                        onChangeText={(text) => handleChange('fullName', text)}
                        value={formData.fullName}
                    />
                    <TextInput
                        placeholder='Phone Number'
                        style={styles.input}
                        placeholderTextColor="#000"
                        onChangeText={(text) => handleChange('phoneNumber', text)}
                        value={formData.phoneNumber}
                        keyboardType="phone-pad"
                        maxLength={10}
                    />
                    <TextInput
                        placeholder="Email"
                        style={styles.input}
                        placeholderTextColor="#000"
                        onChangeText={(text) => handleChange('email', text)}
                        value={formData.email}
                        keyboardType="email-address"
                    />
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.type}
                            style={styles.picker}
                            onValueChange={(itemValue) => handleChange('type', itemValue)}
                        >
                            <Picker.Item label="Select Type" value="" />
                            <Picker.Item label="Consumer" value="consumer" />
                            <Picker.Item label="Transporter" value="transporter" />
                            <Picker.Item label="Owner" value="owner" />
                            <Picker.Item label="Broker" value="broker" />
                        </Picker>
                    </View>

                    {formData.type !== '' && formData.type !== 'consumer' &&
                        <>
                            <TouchableOpacity
                                style={[styles.dateInput]}
                                onPress={() => setIsDatePickerOpen(true)}
                            >
                                <Text style={styles.dateText}>{formData.dob > eighteenYearsAgo ? 'Dob' : getCurrentDate(formData.dob)}</Text>
                                <MaterialIcons name="calendar-month" size={20} color="#888" />
                            </TouchableOpacity>
                            <DatePicker
                                modal
                                open={isDatePickerOpen}
                                date={formData.dob}
                                onConfirm={(date) => {
                                    setIsDatePickerOpen(false);
                                    handleChange('dob', date);
                                }}
                                mode="date"
                                onCancel={() => {
                                    setIsDatePickerOpen(false);
                                }}
                                maximumDate={eighteenYearsAgo}
                            />
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={formData.gender}
                                    style={styles.picker}
                                    onValueChange={(itemValue) => handleChange('gender', itemValue)}
                                >
                                    <Picker.Item label="Gender" value="" />
                                    <Picker.Item label="Male" value="male" />
                                    <Picker.Item label="Female" value="female" />
                                    <Picker.Item label="Other" value="other" />
                                </Picker>
                            </View>
                        </>
                    }

                    {formData.type === 'consumer' && (
                        <>
                            <TextInput
                                placeholder='GSTIN'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('gstin', text)}
                                value={formData.gstin.toUpperCase()}
                                maxLength={15}
                            />
                            <TextInput
                                placeholder='Company Name'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('companyName', text)}
                                value={formData.companyName}
                            />
                            <TextInput
                                placeholder='Website'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('website', text)}
                                value={formData.website}
                            />
                            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                                <Text style={styles.uploadButtonText}>Pick Profile Image</Text>
                            </TouchableOpacity>
                            {formData.profileImage && (
                                <Image
                                    source={{ uri: formData.profileImage }}
                                    style={styles.previewImage}
                                />
                            )}
                        </>
                    )}

                    {formData.type === 'transporter' && (
                        <>
                            <TextInput
                                placeholder='Company Name'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('companyName', text)}
                                value={formData.companyName}
                            />
                            <TextInput
                                placeholder='Website'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('website', text)}
                                value={formData.website}
                            />
                            <TextInput
                                placeholder='Aadhar Number'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('aadharNumber', text)}
                                value={formData.aadharNumber}
                                maxLength={16}
                                keyboardType="phone-pad"
                            />
                            <TextInput
                                placeholder='PAN Number'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('panNumber', text)}
                                value={formData.panNumber.toUpperCase()}
                                maxLength={10}
                            />
                            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                                <Text style={styles.uploadButtonText}>Pick Profile Image</Text>
                            </TouchableOpacity>
                            {formData.profileImage && (
                                <Image
                                    source={{ uri: formData.profileImage }}
                                    style={styles.previewImage}
                                />
                            )}

                        </>
                    )}

                    {(formData.type === 'owner' || formData.type === 'broker') && (
                        <>
                            <TextInput
                                placeholder='Aadhar Number'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('aadharNumber', text)}
                                value={formData.aadharNumber}
                                maxLength={16}
                                keyboardType="phone-pad"
                            />
                            <TextInput
                                placeholder='Pan Number'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('panNumber', text.toUpperCase())}
                                value={formData.panNumber.toUpperCase()}
                                maxLength={10}
                            />

                            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                                <Text style={styles.uploadButtonText}>Pick Profile Image</Text>
                            </TouchableOpacity>
                            {formData.profileImage && (
                                <Image
                                    source={{ uri: formData.profileImage }}
                                    style={styles.previewImage}
                                />
                            )}
                        </>
                    )}

                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : <TouchableOpacity
                        style={styles.button}
                        onPress={handleRegister}
                    >
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>}
                </KeyboardAwareScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#002F87',
        justifyContent: 'center',
    },
    whiteContainer: {
        backgroundColor: '#FFF',
        borderTopWidth: wp('15%'),
        borderBottomWidth: wp('15%'),
        borderColor: '#002F87',
        borderTopLeftRadius: wp('50%'),
        borderTopRightRadius: wp('50%'),
        borderBottomRightRadius: wp('50%'),
        borderBottomLeftRadius: wp('50%'),
        padding: wp('8%'),
        paddingTop: wp('22%'),
        paddingBottom: wp('22%'),
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: wp('6%'),
        fontWeight: 'bold',
        color: '#002F87',
        marginBottom: hp('1%'),
        textAlign: 'center',
    },
    subtitle: {
        fontSize: wp('4%'),
        color: '#666',
        marginBottom: hp('2%'),
        textAlign: 'center',
    },
    input: {
        width: wp('80%'),
        height: hp('6%'),
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: wp('2%'),
        paddingHorizontal: wp('4%'),
        marginBottom: hp('2%'),
        fontSize: wp('4%'),
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#002F87',
        paddingVertical: hp('1.5%'),
        borderRadius: wp('2%'),
        alignItems: 'center',
        width: wp('80%'),
    },
    buttonText: {
        color: '#fff',
        fontSize: wp('4.5%'),
        fontWeight: 'bold',
    },
    signupText: {
        marginTop: hp('2%'),
        textAlign: 'center',
        fontSize: wp('3.5%'),
        color: '#666',
    },
    signupLink: {
        color: '#004AAD',
        fontWeight: 'bold',
    },
    pickerContainer: {
        width: wp('80%'),
        borderRadius: wp('2%'),
        borderColor: '#ccc',
        borderWidth: 1,
        backgroundColor: '#FFF',
        marginBottom: hp('2%'),
    },
    picker: {
        width: '100%',
        height: hp('6%'),
    },
    uploadButton: {
        backgroundColor: '#004AAD',
        padding: wp('3%'),
        borderRadius: wp('2%'),
        marginBottom: hp('2%'),
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: wp('4%'),
        fontWeight: 'bold',
    },
    previewImage: {
        width: wp('30%'),
        height: wp('30%'),
        borderRadius: wp('2%'),
        marginTop: hp('1%'),
        alignSelf: 'center',  // Center horizontally
        marginBottom: hp('3%'),
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center', // Align items vertically
        justifyContent: 'space-between', // Push icon to the right
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 14,
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    errorText: {
        color: 'red',  // Display error in red
        fontSize: 12,   // Slightly smaller than normal text
        marginTop: 0,   // Add space above the error message
        marginLeft: 5,  // Slightly indent it from the left
        marginBottom: 2,
    }
});