import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, Text, TextInput, StyleSheet, View, Image, TouchableOpacity, Keyboard, Alert, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { API_END_POINT } from '../app.config';
import { getCurrentDate } from './CargoDetails';
import { useNavigation } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { validateEmail } from './AddVehicleScreen';


export default () => {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();

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
        gender: '',
        profileImage: null,
    });

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
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

        if (!validateEmail(formData.email)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        }

        const form = new FormData();

        for (const key in formData) {
            if (key === 'profileImage' && formData[key]) {
                const filename = formData.profileImage.split('/').pop();
                const fileType = filename.split('.').pop();
                form.append('profileImage', {
                    uri: formData.profileImage,
                    name: filename,
                    type: `image/${fileType}`,
                });
            }
            if (key === 'dob' && formData[key]) {
                form.append('dob', JSON.stringify(formData[key]));
            } else {
                form.append(key, formData[key]);
            }
        }

        try {
            const response = await fetch(`${API_END_POINT}/api/v1/users/signup`, {
                method: 'POST',
                body: form,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Registration successful');
                navigation.navigate('Landing');
            } else {
                Alert.alert('Error', result.message || 'Registration failed');
            }
        } catch (error) {
            Alert.alert('Error', `Error: ${error.message}`);
        } finally {
            // Remove loading indicator
            setLoading(false);
        }
    };

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);


    const today = new Date();
    const eighteenYearsAgo = new Date(today.setFullYear(today.getFullYear() - 18));

    return (
        <LinearGradient colors={['#06264D', "#FFF"]} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, padding: 20 }}>
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    contentContainerStyle={styles.container}
                    scrollEnabled={true}
                    enableAutomaticScroll={true}
                    enableOnAndroid={true}
                    extraScrollHeight={100}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                >
                    <Image
                        source={require("../assets/images/logo-removebg-preview 1.png")}
                        style={styles.logo}
                    />
                    <Text style={styles.registerText}>Register</Text>

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
                        placeholder='Email'
                        style={styles.input}
                        placeholderTextColor="#000"
                        onChangeText={(text) => handleChange('email', text.toLowerCase())}
                        value={formData.email}
                        keyboardType="email-address"
                    />
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.type}
                            style={styles.picker}
                            onValueChange={(itemValue) => handleChange('type', itemValue)}
                        >
                            <Picker.Item label="Select Type" value="" />
                            <Picker.Item label="Consumer" value="consumer" />
                            <Picker.Item label="Transporter" value="transporter" />
                        </Picker>
                    </View>

                    {formData.type === 'consumer' && (
                        <>
                            <TextInput
                                placeholder='GSTIN'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('gstin', text.toUpperCase())}
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
                                onChangeText={(text) => handleChange('website', text.toLowerCase())}
                                value={formData.website}
                            />
                            <TextInput
                                placeholder='Aadhar Number'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('aadharNumber', text)}
                                value={formData.aadharNumber}
                                maxLength={16}
                            />
                            <TextInput
                                placeholder='PAN Number'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('panNumber', text.toUpperCase())}
                                value={formData.panNumber.toUpperCase()}
                                maxLength={10}
                            />
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
                                </Picker>
                            </View>
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
                {!keyboardVisible && (
                    <View style={styles.footer}>
                        <Image
                            source={require("../assets/images/mantra.jpg")}
                            style={styles.smallImage}
                        />
                        <View style={styles.footerTextContainer}>
                            <Text style={styles.footerText}>Made in</Text>
                            <Image
                                source={require("../assets/images/image 10.png")}
                                style={styles.smallImage}
                            />
                        </View>
                        <Image
                            source={require("../assets/images/make-in-India-logo.jpg")}
                            style={styles.smallImage}
                        />
                    </View>
                )}
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    registerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    pickerContainer: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 8,
        marginBottom: 15,
        borderColor: '#ccc',
        borderWidth: 1,
        justifyContent: 'center',
    },
    picker: {
        width: '100%',
        height: '100%',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#06264D',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 20
    },
    smallImage: {
        width: 40,
        height: 40
    },
    footerTextContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    footerText: {
        color: '#000',
        paddingLeft: 2
    },
    uploadButton: {
        backgroundColor: '#06264D',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    uploadButtonText: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginVertical: 10,
        alignSelf: 'center',
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 14,
        backgroundColor: '#fff',
        marginBottom: 15,
    },
    dateText: {
        flex: 1,
        color: '#000',
        fontSize: 15,
    },
});