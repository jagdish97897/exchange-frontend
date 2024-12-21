import React, { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, Text, TextInput, StyleSheet, View, Image, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

export default ({ navigation }) => {
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        type: '',
        aadharNumber: '',
        panNumber: '',
        profileImage: null, // Change to handle image URI
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
        const form = new FormData();
        form.append('fullName', formData.fullName);
        form.append('phoneNumber', formData.phoneNumber);
        form.append('type', formData.type);
        form.append('aadharNumber', formData.aadharNumber);
        form.append('panNumber', formData.panNumber);

        if (formData.profileImage) {
            const filename = formData.profileImage.split('/').pop();
            const fileType = filename.split('.').pop();
            form.append('profileImage', {
                uri: formData.profileImage,
                name: filename,
                type: `image/${fileType}`,
            });
        }

        try {
            const response = await fetch('http://192.168.1.9:8000/api/v1/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: form,
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
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.type}
                            style={styles.picker}
                            onValueChange={(itemValue) => handleChange('type', itemValue)}
                        >
                            <Picker.Item label="Select Type" value="" />
                            <Picker.Item label="owner" value="owner" />
                            <Picker.Item label="broker" value="broker" />
                        </Picker>
                    </View>

                    {formData.type && (
                        <>
                            <TextInput
                                placeholder='Aadhar Number'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('aadharNumber', text)}
                                value={formData.aadharNumber}
                            />
                            <TextInput
                                placeholder='Pan Number'
                                style={styles.input}
                                placeholderTextColor="#000"
                                onChangeText={(text) => handleChange('panNumber', text)}
                                value={formData.panNumber.toUpperCase()}
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
//         type: '',
//         aadharNumber: '',
//         panNumber: '',
//         profileImage: '',
//     });

//     const handleChange = (name, value) => {
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleRegister = async () => {
//         console.log('Form Data:', formData);
//         try {
//             const response = await fetch('http://192.168.1.9:8000/api/v1/users/signup', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(formData)
//             });

//             const result = await response.json();

//             if (response.ok) {
//                 Alert.alert('Success', 'Registration successful');
//                 navigation.navigate('Landing');
//             } else {
//                 Alert.alert('Error', result.message || 'Registration failed');
//             }
//         } catch (error) {
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
//                     <View style={styles.pickerContainer}>
//                         <Picker
//                             selectedValue={formData.type}
//                             style={styles.picker}
//                             onValueChange={(itemValue) => handleChange('type', itemValue)}
//                         >
//                             <Picker.Item label="Select Type" value="" />
//                             <Picker.Item label="owner" value="owner" />
//                             <Picker.Item label="broker" value="broker" />
//                         </Picker>
//                     </View>

//                     {formData.type === 'owner' && (
//                         <>
//                             <TextInput
//                                 placeholder='Aadhar Number'
//                                 style={styles.input}
//                                 placeholderTextColor="#000"
//                                 onChangeText={(text) => handleChange('aadharNumber', text)}
//                                 value={formData.aadharNumber}
//                             />
//                             <TextInput
//                                 placeholder='Pan Number'
//                                 style={styles.input}
//                                 placeholderTextColor="#000"
//                                 onChangeText={(text) => handleChange('panNumber', text)}
//                                 value={formData.panNumber}
//                             />
//                             <TextInput
//                                 placeholder='Profile Image'
//                                 style={styles.input}
//                                 placeholderTextColor="#000"
//                                 onChangeText={(text) => handleChange('profileImage', text)}
//                                 value={formData.profileImage}
//                             />
//                         </>
//                     )}

//                     {formData.type === 'broker' && (
//                         <>
//                             <TextInput
//                                 placeholder='Aadhar Number'
//                                 style={styles.input}
//                                 placeholderTextColor="#000"
//                                 onChangeText={(text) => handleChange('aadharNumber', text)}
//                                 value={formData.aadharNumber}
//                             />
//                             <TextInput
//                                 placeholder='Pan Number'
//                                 style={styles.input}
//                                 placeholderTextColor="#000"
//                                 onChangeText={(text) => handleChange('panNumber', text)}
//                                 value={formData.panNumber}
//                             />
//                             <TextInput
//                                 placeholder='Profile Image'
//                                 style={styles.input}
//                                 placeholderTextColor="#000"
//                                 onChangeText={(text) => handleChange('profileImage', text)}
//                                 value={formData.profileImage}
//                             />
//                         </>
//                     )}

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
//                             style={styles.smallImage}
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
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     logo: {
//         width: 150,
//         height: 150,
//         resizeMode: 'contain',
//         marginBottom: 20,
//     },
//     registerText: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#000',
//         marginBottom: 20,
//     },
//     input: {
//         width: '100%',
//         height: 50,
//         backgroundColor: '#FFF',
//         borderRadius: 8,
//         marginBottom: 15,
//         paddingHorizontal: 15,
//         borderColor: '#ccc',
//         borderWidth: 1,
//     },
//     pickerContainer: {
//         width: '100%',
//         height: 50,
//         backgroundColor: '#FFF',
//         borderRadius: 8,
//         marginBottom: 15,
//         borderColor: '#ccc',
//         borderWidth: 1,
//         justifyContent: 'center',
//     },
//     picker: {
//         width: '100%',
//         height: '100%',
//     },
//     button: {
//         width: '100%',
//         height: 50,
//         backgroundColor: '#06264D',
//         borderRadius: 8,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: '#FFF',
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     footer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-around',
//         marginTop: 20
//     },
//     smallImage: {
//         width: 40,
//         height: 40
//     },
//     footerTextContainer: {
//         flexDirection: 'row',
//         alignItems: 'center'
//     },
//     footerText: {
//         color: '#000',
//         paddingLeft: 2
//     },

// });