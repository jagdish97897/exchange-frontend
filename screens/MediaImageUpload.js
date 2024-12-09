import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, ScrollView, StyleSheet, Alert, Keyboard, Dimensions, Linking, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const MultipleImageUpload = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [vehicleno, setVehicleno] = useState('');
    const [adhaarno, setAdhaarno] = useState('');
    const [email, setEmail] = useState('');
    const [dailyrunning, setDailyrunning] = useState('');
    const [images, setImages] = useState({ image1: null, image2: null, image3: null, image4: null });
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    // Request media library permissions
    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
        }
    };

    useEffect(() => {
        requestPermission();
    }, []);

    const pickImage = async (imageKey) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setImages((prevImages) => ({ ...prevImages, [imageKey]: result.assets[0] }));
        }
    };

    const uploadImage = async () => {
        const formData = new FormData();

        // Add form data fields
        formData.append('name', name);
        formData.append('phone', phone);
        formData.append('vehicleno', vehicleno);
        formData.append('adhaarno', adhaarno);
        formData.append('email', email);
        formData.append('dailyrunning', dailyrunning);

        // Add images to the form data
        Object.keys(images).forEach((key) => {
            const image = images[key];
            if (image && image.uri) {
                const uri = image.uri;
                const fileType = uri.split('.').pop();
                const type = `image/${fileType}`;
                const name = `${key}.${fileType}`;

                // console.log('uri', uri)

                // Append the image to formData
                formData.append('images', {
                    uri,
                    type,
                    name,
                });
            }
        });

        try {
            const response = await axios.post('http://localhost:8000/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(`Image uploaded successfully:`, response.data);
            return response.data;
        } catch (error) {
            // // console.log(`Upload error for image :`, error.response ? error.response.data : error.message);
            // // throw new Error(error.message);
            // Alert.alert('Error', error.message);
            // Check if error has a response (server-side error)
            if (error.response) {
                // Log full error details (useful for debugging)
                // console.error('Error response:', error.response.data);

                // Provide a user-friendly error message based on status code
                if (error.response.status === 400) {
                    Alert.alert('Error', error.response.data.error);
                } else if (error.response.status === 500) {
                    Alert.alert('Error', 'Server is down. Please try again later.');
                } else {
                    Alert.alert('Error', 'An unknown error occurred.');
                }
            } else if (error.request) {
                // Request made but no response (network error or server issue)
                // console.error('Error request:', error.request);
                Alert.alert('Error', 'Unable to connect to the server. Please check your network.');
            } else {
                // Something else triggered the error
                // console.error('Error', error.message);
                Alert.alert('Error', error.message);
            }

        }
    };

    const handleUpload = async () => {
        setLoading(true);

        if (!name || !phone || !vehicleno || !adhaarno || !email || !dailyrunning) {
            Alert.alert('Missing Fields', 'Please fill out all the fields before submitting.');
            return;
        }

        if (Object.keys(images).filter((key) =>
            !(key === 'imageTwitter' || key === 'imageFacebook')
        ).length < 2) {
            Alert.alert('Error', 'Please select all images.');
            return;
        }

        try {
            const data = await uploadImage(); // Wait for all uploads to complete
            // console.log('data after upload', data);
            if (data) {
                Alert.alert('Success', `Congratulations ${name}!`);   // Create form data object without images
                const formDataWithoutImages = {
                    name,
                    phone,
                    vehicleno,
                    adhaarno,
                    email,
                    dailyrunning,
                    userId: data?.user?._id
                };

                // Navigate to the Congratulation screen with the form data (excluding images)
                navigation.navigate('Congratulation', { formData: formDataWithoutImages });
            }
        } catch (error) {
            console.log('error in handle upload', error.message)
            Alert.alert('Error8', error.message);
        }
        finally {
            // Stop the loader after getting the response
            setLoading(false);
        }
    }

    const openSocialLink = (platform) => {
        let url = '';

        switch (platform) {
            case 'Instagram':
                url = 'https://www.instagram.com/kgvllp?igsh=MWZwbnZxbG4xZnZz';
                break;
            case 'Youtube':
                url = 'https://youtube.com/@karishmaglobalventures-et5ny?si=NBwoHS1l0pCOVXPC';
                break;
            case 'Twitter':
                url = 'https://x.com/KGVllp?t=LyZz_BWLQevEMsUFA8ggew&s=08';
                break;
            case 'Facebook':
                url = 'https://www.facebook.com/share/DfiunaneErmM6FqR/?mibextid=qi2Omg';
                break;
            default:
                url = 'https://www.google.com';
        }

        Linking.openURL(url).catch((err) => console.log('Error opening URL', err));
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
        <LinearGradient
            colors={['#06264D', '#FFF']}
            style={styles.gradient}
        >
            <Image
                source={require("../assets/images/kgvmitr.png")}
                style={styles.logo}
            />
            <Text style={styles.vehicledetails}>Participate & Win</Text>
            <Text style={styles.vehicledetails1}>
                Get a chance to convert your motorbike into KGV hybrid bike & save more than 90% expense {' '}
                <Text style={{ color: 'yellow', fontSize: 30 }}>FREE*</Text>
            </Text>
            <ScrollView contentContainerStyle={styles.container}>

                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                />

                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    maxLength={10}
                />

                <TextInput
                    style={styles.input}
                    value={vehicleno}
                    onChangeText={setVehicleno}
                    placeholder="Enter your RC number"
                    maxLength={10}
                />

                <TextInput
                    style={styles.input}
                    value={adhaarno}
                    onChangeText={setAdhaarno}
                    placeholder="Enter your Aadhaar number"
                    keyboardType="phone-pad"
                    maxLength={12}
                />

                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    value={dailyrunning}
                    onChangeText={setDailyrunning}
                    placeholder="Enter daily running distance"
                    keyboardType="numeric"
                    maxLength={3}
                />

                {["Instagram", "Youtube", "Twitter", "Facebook"].map((platform) => (
                    <View key={platform} style={styles.imagePickerContainer}>
                        <View style={styles.rowContainer}>

                            <Text style={styles.imageText}>{platform}</Text>

                            {/* Conditionally render "Follow Us" and "Pick" buttons */}
                            {!images[`image${platform}`] && (
                                <>
                                    <Text
                                        style={styles.socialMediaLink}
                                        onPress={() => openSocialLink(platform)}
                                    >
                                        Follow Us
                                    </Text>

                                </>
                            )}
                        </View>

                        {/* Conditionally render the image if it exists */}
                        {images[`image${platform}`] && (
                            <Image
                                source={{ uri: images[`image${platform}`].uri }}
                                style={styles.image}
                            />
                        )}
                        <Button title="Pick" onPress={() => pickImage(`image${platform}`)} />

                    </View>
                ))}

                {loading ? (
                    // Display the loader while registering
                    <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
                ) : (

                    <TouchableOpacity
                        style={[styles.button, styles.submitButton]}
                        onPress={handleUpload}
                    >
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                )
                }
            </ScrollView>

            {!keyboardVisible && (
                <View style={styles.footer}>
                    <Image
                        source={require("../assets/images/mantra.jpg")}
                        style={styles.footerImage}
                    />
                    <View style={styles.footerTextContainer}>
                        <Text style={styles.footerText}>Made in</Text>
                        <Image
                            source={require("../assets/images/image 10.png")}
                            style={styles.footerFlag}
                        />
                    </View>
                    <Image
                        source={require("../assets/images/make-in-India-logo.jpg")}
                        style={styles.footerLogo}
                    />
                </View>
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        padding: width * 0.05,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 130,
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        borderStyle: 'solid',
        padding: 10,
        width: '80%',
        marginTop: 10,
    },
    imagePickerContainer: {
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        borderStyle: 'solid',
        padding: 10,
        width: '80%',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    imageText: {
        fontSize: 16,
        color: 'black',
    },
    image: {
        width: width * 0.1,
        height: width * 0.1,
        borderRadius: 10,
        marginTop: 10,
        marginLeft: 20,
    },
    vehicledetails: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    vehicledetails1: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 10,
        textAlign: 'center',
    },
    socialMediaLink: {
        fontSize: 14,
        color: '#1DA1F2', // Example color for Twitter-like link
        textDecorationLine: 'underline',
        marginHorizontal: 20,
    },
    button: {
        backgroundColor: '#06264D', // Blue background
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
    submitButton: {
        marginTop: 20,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: height * 0.04,

    },
    footerImage: {
        width: width * 0.09, // 9% of screen width
        height: height * 0.05, // 5% of screen height
    },
    footerTextContainer: {
        alignItems: 'center',
    },
    footerText: {
        color: 'black',
        fontSize: width * 0.025, // Font size relative to screen width
    },
    footerFlag: {
        width: width * 0.06, // 6% of screen width
        height: height * 0.02, // 2% of screen height
    },
    footerLogo: {
        width: width * 0.12, // 12% of screen width
        height: height * 0.05, // 5% of screen height
    },
});

export default MultipleImageUpload;



// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Image, ScrollView, StyleSheet, Alert, Dimensions, Linking, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import axios from 'axios';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useNavigation } from '@react-navigation/native';

// const { width, height } = Dimensions.get('window');

// const MultipleImageUpload = () => {
//     const [name, setName] = useState('');
//     const [phone, setPhone] = useState('');
//     const [dlno, setDlno] = useState('');
//     const [adhaarno, setAdhaarno] = useState('');
//     const [email, setEmail] = useState('');
//     const [dailyrunning, setDailyrunning] = useState('');
//     const [images, setImages] = useState({ image1: null, image2: null, image3: null, image4: null });
//     const [loading, setLoading] = useState(false);
//     const navigation = useNavigation();

//     // Request media library permissions
//     const requestPermission = async () => {
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== 'granted') {
//             Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
//         }
//     };

//     useEffect(() => {
//         requestPermission();
//     }, []);

//     const pickImage = async (imageKey) => {
//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             quality: 1,
//         });

//         if (!result.canceled) {
//             setImages((prevImages) => ({ ...prevImages, [imageKey]: result.assets[0] }));
//         }
//     };

//     const uploadImage = async () => {
//         const formData = new FormData();

//         // Add form data fields
//         formData.append('name', name);
//         formData.append('phone', phone);
//         formData.append('dlno', dlno);
//         formData.append('adhaarno', adhaarno);
//         formData.append('email', email);
//         formData.append('dailyrunning', dailyrunning);

//         // Add images to the form data
//         Object.keys(images).forEach((key) => {
//             const image = images[key];
//             if (image && image.uri) {
//                 const uri = image.uri;
//                 const fileType = uri.split('.').pop();
//                 const type = `image/${fileType}`;
//                 const name = `${key}.${fileType}`;

//                 // console.log('uri', uri)

//                 // Append the image to formData
//                 formData.append('images', {
//                     uri,
//                     type,
//                     name,
//                 });
//             }
//         });

//         try {
//             const response = await axios.post('http://localhost:8000/api/files/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//             });

//             console.log(`Image uploaded successfully:`, response.data);
//             return response.data;
//         } catch (error) {
//             // // console.log(`Upload error for image :`, error.response ? error.response.data : error.message);
//             // // throw new Error(error.message);
//             // Alert.alert('Error', error.message);
//             // Check if error has a response (server-side error)
//             if (error.response) {
//                 // Log full error details (useful for debugging)
//                 // console.error('Error response:', error.response.data);

//                 // Provide a user-friendly error message based on status code
//                 if (error.response.status === 400) {
//                     Alert.alert('Error', error.response.data.error);
//                 } else if (error.response.status === 500) {
//                     Alert.alert('Error', 'Server is down. Please try again later.');
//                 } else {
//                     Alert.alert('Error', 'An unknown error occurred.');
//                 }
//             } else if (error.request) {
//                 // Request made but no response (network error or server issue)
//                 // console.error('Error request:', error.request);
//                 Alert.alert('Error', 'Unable to connect to the server. Please check your network.');
//             } else {
//                 // Something else triggered the error
//                 // console.error('Error', error.message);
//                 Alert.alert('Error', error.message);
//             }

//         }
//     };

//     const handleUpload = async () => {
//         setLoading(true);

//         if (!name || !phone || !dlno || !adhaarno || !email || !dailyrunning) {
//             Alert.alert('Missing Fields', 'Please fill out all the fields before submitting.');
//             return;
//         }

//         if (Object.keys(images).filter((key) =>
//             !(key === 'imageTwitter' || key === 'imageFacebook')
//         ).length < 2) {
//             Alert.alert('Error', 'Please select all images.');
//             return;
//         }

//         try {
//             const data = await uploadImage(); // Wait for all uploads to complete
//             // console.log('data after upload', data);
//             if (data) {
//                 Alert.alert('Success', `Congratulations ${name}!`);   // Create form data object without images
//                 const formDataWithoutImages = {
//                     name,
//                     phone,
//                     dlno,
//                     adhaarno,
//                     email,
//                     dailyrunning,
//                     userId: data?.user?._id
//                 };

//                 // Navigate to the Congratulation screen with the form data (excluding images)
//                 navigation.navigate('Congratulation', { formData: formDataWithoutImages });
//             }
//         } catch (error) {
//             console.log('error in handle upload', error.message)
//             Alert.alert('Error8', error.message);
//         }
//         finally {
//             // Stop the loader after getting the response
//             setLoading(false);
//         }
//     }

//     const openSocialLink = (platform) => {
//         let url = '';

//         switch (platform) {
//             case 'Instagram':
//                 url = 'https://www.instagram.com/kgvllp?igsh=MWZwbnZxbG4xZnZz';
//                 break;
//             case 'Youtube':
//                 url = 'https://youtube.com/@karishmaglobalventures-et5ny?si=NBwoHS1l0pCOVXPC';
//                 break;
//             case 'Twitter':
//                 url = 'https://x.com/KGVllp?t=LyZz_BWLQevEMsUFA8ggew&s=08';
//                 break;
//             case 'Facebook':
//                 url = 'https://www.facebook.com/share/DfiunaneErmM6FqR/?mibextid=qi2Omg';
//                 break;
//             default:
//                 url = 'https://www.google.com';
//         }

//         Linking.openURL(url).catch((err) => console.log('Error opening URL', err));
//     };

//     return (
//         <LinearGradient
//             colors={['#06264D', '#FFF']}
//             style={styles.gradient}
//         >
//             <Image
//                 source={require("../assets/images/kgvmitr.png")}
//                 style={styles.logo}
//             />
//             <Text style={styles.vehicledetails}>Please share your Details</Text>
//             <ScrollView contentContainerStyle={styles.container}>

//                 <TextInput
//                     style={styles.input}
//                     value={name}
//                     onChangeText={setName}
//                     placeholder="Enter your name"
//                 />

//                 <TextInput
//                     style={styles.input}
//                     value={phone}
//                     onChangeText={setPhone}
//                     placeholder="Enter your phone number"
//                     keyboardType="phone-pad"
//                     maxLength={10}
//                 />

//                 <TextInput
//                     style={styles.input}
//                     value={dlno}
//                     onChangeText={setDlno}
//                     placeholder="Enter your RC number"
//                     maxLength={10}
//                 />

//                 <TextInput
//                     style={styles.input}
//                     value={adhaarno}
//                     onChangeText={setAdhaarno}
//                     placeholder="Enter your Aadhaar number"
//                     keyboardType="phone-pad"
//                     maxLength={12}
//                 />

//                 <TextInput
//                     style={styles.input}
//                     value={email}
//                     onChangeText={setEmail}
//                     placeholder="Enter your email"
//                     keyboardType="email-address"
//                 />

//                 <TextInput
//                     style={styles.input}
//                     value={dailyrunning}
//                     onChangeText={setDailyrunning}
//                     placeholder="Enter daily running distance"
//                     keyboardType="numeric"
//                     maxLength={3}
//                 />

//                 {["Instagram", "Youtube", "Twitter", "Facebook"].map((platform) => (
//                     <View key={platform} style={styles.imagePickerContainer}>
//                         <View style={styles.rowContainer}>

//                             <Text style={styles.imageText}>{platform}</Text>

//                             {/* Conditionally render "Follow Us" and "Pick" buttons */}
//                             {!images[`image${platform}`] && (
//                                 <>
//                                     <Text
//                                         style={styles.socialMediaLink}
//                                         onPress={() => openSocialLink(platform)}
//                                     >
//                                         Follow Us
//                                     </Text>

//                                 </>
//                             )}
//                         </View>

//                         {/* Conditionally render the image if it exists */}
//                         {images[`image${platform}`] && (
//                             <Image
//                                 source={{ uri: images[`image${platform}`].uri }}
//                                 style={styles.image}
//                             />
//                         )}
//                         <Button title="Pick" onPress={() => pickImage(`image${platform}`)} />

//                     </View>
//                 ))}

//                 {loading ? (
//                     // Display the loader while registering
//                     <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
//                 ) : (

//                     <TouchableOpacity
//                         style={[styles.button, styles.submitButton]}
//                         onPress={handleUpload}
//                     >
//                         <Text style={styles.buttonText}>Submit</Text>
//                     </TouchableOpacity>
//                 )
//                 }
//             </ScrollView>
//         </LinearGradient>
//     );
// };

// const styles = StyleSheet.create({
//     gradient: {
//         flex: 1,
//     },
//     container: {
//         padding: width * 0.05,
//         backgroundColor: 'transparent',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     logo: {
//         width: 100,
//         height: 100,
//         alignSelf: 'center',
//         marginBottom: 20,
//         marginTop: 20,
//     },
//     input: {
//         borderBottomWidth: 2,
//         borderBottomColor: 'black',
//         borderStyle: 'solid',
//         padding: 10,
//         width: '80%',
//         marginTop: 10,
//     },
//     imagePickerContainer: {
//         borderBottomWidth: 2,
//         borderBottomColor: 'black',
//         borderStyle: 'solid',
//         padding: 10,
//         width: '80%',
//         marginTop: 10,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     rowContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     imageText: {
//         fontSize: 16,
//         color: 'black',
//     },
//     image: {
//         width: width * 0.1,
//         height: width * 0.1,
//         borderRadius: 10,
//         marginTop: 10,
//         marginLeft: 20,
//     },
//     vehicledetails: {
//         fontSize: 32,
//         fontWeight: 'bold',
//         color: '#FFF',
//         marginBottom: 20,
//         textAlign: 'center',
//     },
//     socialMediaLink: {
//         fontSize: 14,
//         color: '#1DA1F2', // Example color for Twitter-like link
//         textDecorationLine: 'underline',
//         marginHorizontal: 20,
//     },
//     button: {
//         backgroundColor: '#06264D', // Blue background
//         borderRadius: 5,
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: '#FFF',
//         fontSize: 16,
//     },
//     submitButton: {
//         marginTop: 20,
//     },
// });

// export default MultipleImageUpload;