import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, Text, TextInput, StyleSheet, View, Image, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Picker } from '@react-native-picker/picker';

export default ({ navigation }) => {
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        gstin: '',
        type: '',
        companyName: '',
        website: '',
        profileImage: '',
        aadharNumber: '',
        panNumber: '',
        dob: '',
        gender: '',
    });

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleRegister = async () => {
        console.log('Form Data:', formData);
        try {
            const response = await fetch('http://192.168.1.3:8000/api/v1/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Registration successful');
                navigation.navigate('Landing');
            } else {
                Alert.alert('Error', result.message || 'Registration failed');
            }
        } catch (error) {
            Alert.alert('Error', `Error: ${error}`);
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
                    />
                    <TextInput
                        placeholder='Email'
                        style={styles.input}
                        placeholderTextColor="#000"
                        onChangeText={(text) => handleChange('email', text)}
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
                                onChangeText={(text) => handleChange('gstin', text)}
                                value={formData.gstin}
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
                            <TextInput
                                placeholder='profileImage'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('profileImage', text)}
                                value={formData.profileImage}
                            />
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
                                placeholder='Profile Image'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('profileImage', text)}
                                value={formData.profileImage}
                            />
                            <TextInput
                                placeholder='Aadhar Number'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('aadharNumber', text)}
                                value={formData.aadharNumber}
                            />
                            <TextInput
                                placeholder='PAN Number'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('panNumber', text)}
                                value={formData.panNumber}
                            />
                            <TextInput
                                placeholder='Date of Birth'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('dob', text)}
                                value={formData.dob}
                            />
                            <TextInput
                                placeholder='Gender'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('gender', text)}
                                value={formData.gender}
                            />
                        </>
                    )}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleRegister}
                    >
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
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

});



// import React, { useState, useEffect } from 'react';
// import { LinearGradient } from 'expo-linear-gradient';
// import { SafeAreaView, Text, TextInput, StyleSheet, View, Image, TouchableOpacity, Keyboard, Alert } from 'react-native';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { Picker } from '@react-native-picker/picker';

// export default ({ navigation }) => {
//     const [keyboardVisible, setKeyboardVisible] = useState(false);

//     const [formData, setFormData] = useState({
//         fullName: '',
//         phoneNumber: '',
//         email: '',
//         gstin: '',
//         type: '',
//         companyName: '',
//         website: '',
//         profileImage: '',
//     });

//     const handleChange = (name, value) => {
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleRegister = async () => {
//         console.log('Form Data:', formData);
//         try {
//             const response = await fetch('http://192.168.1.3:8000/api/v1/users/signup', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(formData)
//             });

//             const result = await response.json();

//             console.log('Response:', result);

//             if (response.ok) {
//                 Alert.alert('Success', 'Registration successful');
//                 navigation.navigate('Landing');
//             } else {
//                 Alert.alert('Error', result.message || 'Registration failed');
//             }
//         } catch (error) {
//             console.log('Error:', error); // Added log
//             Alert.alert('Error', `Error: ${error}`);
//         }
//     };

//     useEffect(() => {
//         const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
//             setKeyboardVisible(true);
//         });
//         const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
//             setKeyboardVisible(false);
//         });

//         return () => {
//             keyboardDidShowListener.remove();
//             keyboardDidHideListener.remove();
//         };
//     }, []);

//     return (
//         <LinearGradient colors={['#06264D', "#FFF"]} style={{ flex: 1 }}>
//             <SafeAreaView style={{ flex: 1, padding: 20 }}>
//                 <KeyboardAwareScrollView
//                     resetScrollToCoords={{ x: 0, y: 0 }}
//                     contentContainerStyle={styles.container}
//                     scrollEnabled={true}
//                     enableAutomaticScroll={true}
//                     enableOnAndroid={true}
//                     extraScrollHeight={100}
//                     showsVerticalScrollIndicator={false}
//                     showsHorizontalScrollIndicator={false}
//                 >
//                     <Image
//                         source={require("../assets/images/logo-removebg-preview 1.png")}
//                         style={styles.logo}
//                     />
//                     <Text style={styles.registerText}>Register</Text>

//                     <TextInput
//                         placeholder='Full Name'
//                         style={styles.input}
//                         placeholderTextColor="#000"
//                         onChangeText={(text) => handleChange('fullName', text)}
//                         value={formData.fullName}
            
//                     />

//                     <TextInput
//                         placeholder='Phone Number'
//                         style={styles.input}
//                         placeholderTextColor="#000"
//                         onChangeText={(text) => handleChange('phoneNumber', text)}
//                         value={formData.phoneNumber}
//                         keyboardType="phone-pad"
//                     />
//                     <TextInput
//                         placeholder='Email'
//                         style={styles.input}
//                         placeholderTextColor="#000"
//                         onChangeText={(text) => handleChange('email', text)}
//                         value={formData.email}
//                         keyboardType="email-address"
//                     />
//                     <TextInput
//                         placeholder='Gstin'
//                         style={styles.input}
//                         placeholderTextColor="#000"
//                         onChangeText={(text) => handleChange('gstin', text)}
//                         value={formData.gstin}
//                     />
//                     <View style={styles.pickerContainer}>
//                         <Picker
//                             selectedValue={formData.type}
//                             style={styles.picker}
//                             onValueChange={(itemValue) => handleChange('type', itemValue)}
//                         >
//                             <Picker.Item label="Consumer" value="consumer" />
//                             <Picker.Item label="Transporter" value="transporter" />
//                         </Picker>
//                     </View>
//                     <TextInput
//                         placeholder='Company Name'
//                         style={styles.input}
//                         placeholderTextColor="#000"
//                         onChangeText={(text) => handleChange('companyName', text)}
//                         value={formData.companyName}
//                     />
                   
//                     <TextInput
//                         placeholder='Website'
//                         style={styles.input}
//                         placeholderTextColor="#000"
//                         onChangeText={(text) => handleChange('website', text)}
//                         value={formData.website}
//                     />
//                     <TextInput
//                         placeholder='ProfileImage'
//                         style={styles.input}
//                         placeholderTextColor="#000"
//                         onChangeText={(text) => handleChange('profileImage', text)}
//                         value={formData.profileImage}
//                     />
//                     <TouchableOpacity
//                         style={styles.button}
//                         onPress={handleRegister}
//                     >
//                         <Text style={styles.buttonText}>Register</Text>
//                     </TouchableOpacity>
//                 </KeyboardAwareScrollView>

//                 {!keyboardVisible && (
//                     <View style={styles.footer}>
//                         <Image
//                             source={require("../assets/images/mantra.jpg")}
//                             style={styles.smallImage}
//                         />
//                         <View style={styles.footerTextContainer}>
//                             <Text style={styles.footerText}>Made in</Text>
//                             <Image
//                                 source={require("../assets/images/image 10.png")}
//                                 style={styles.smallImage}
//                             />
//                         </View>
//                         <Image
//                             source={require("../assets/images/make-in-India-logo.jpg")}
//                             style={styles.largeImage}
//                         />
//                     </View>
//                 )}
//             </SafeAreaView>
//         </LinearGradient>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flexGrow: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         paddingBottom: 20
//     },
//     logo: {
//         width: 201,
//         height: 181,
//         alignSelf: 'center',
//         marginBottom: 20
//     },
//     input: {
//         borderBottomWidth: 2,
//         borderBottomColor: 'black',
//         padding: 10,
//         width: '80%',
//         marginVertical: 10,
//         fontSize: 16
//     },
//     button: {
//         backgroundColor: '#007BFF',
//         padding: 15,
//         borderRadius: 50,
//         alignItems: 'center',
//         width: '80%',
//         marginTop: 20
//     },
//     buttonText: {
//         color: '#FFF',
//         fontSize: 16,
//         fontWeight: 'bold'
//     },
//     registerText: {
//         fontSize: 32,
//         fontWeight: 'bold',
//         color: '#000',
//         marginBottom: 20
//     },
//     pickerContainer: {
//         borderBottomWidth: 2,
//         borderBottomColor: 'black',
//         width: '80%',
//         marginVertical: 10
//     },
//     picker: {
//         width: '100%'
//     },
//     rowContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: '80%'
//     },
//     halfInput: {
//         width: '45%'
//     },
//     leftMargin: {
//         marginLeft: 10
//     },
//     footer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-around',
//         marginTop: 20
//     },
//     smallImage: {
//         width: 60,
//         height: 60
//     },
//     footerTextContainer: {
//         flexDirection: 'row',
//         alignItems: 'center'
//     },
//     footerText: {
//         color: '#000',
//         paddingLeft: 2
//     },
//     largeImage: {
//         width: 80,
//         height: 80
//     }
// });

