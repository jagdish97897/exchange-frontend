
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, TextInput, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const Profile1 = ({ route }) => {
    const { userId, user } = route.params;

    console.log('profile user', user);
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        phoneNumber: '',
        email: '',
        address: '',
        aadhar: '',
        dlno: '',
        gender: '',
        pan: '',
    });

    useEffect(() => {
        // Fetch data from the API
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://192.168.1.5:8005/api/v1/visitor/details/${userId}`);

                const result = await response.json();
                if (result.success) {
                    const user = result.data[0];
                    console.log('user profile1', user)
                    setUserData(user);
                    setFormData({
                        fullName: user.fullName,
                        dob: user.dob,
                        phoneNumber: user.phoneNumber,
                        email: user.email,
                        address: user.address,
                        aadhar: user.aadhar,
                        dlno: user.dlno,
                        gender: user.gender,
                        pan: user.pan,
                    });
                }
            } catch (error) {
                console.log('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleInputChange = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleUpdateProfile = async () => {
        try {
            const { _id, __v, ...updateData } = formData;

            const response = await fetch(`http://192.168.1.5:8005/api/v1/visitor/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            const result = await response.json();

            if (result.success) {
                setUserData(updateData);
                setIsEditing(false);
            } else {
                console.log('Failed to update profile:', result.message);
            }
        } catch (error) {
            console.log('Error updating profile:', error);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#673AB7" />
            </View>
        );
    }

    return (
        <LinearGradient colors={['#06264D', '#FFF']} style={styles.gradientBackground}>
            <View style={styles.container}>
                {/* Profile Image and Name */}
                <View style={styles.header}>
                    <Image
                        source={require('../assets/images/profile.jpg')} // Replace with your image URL
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>Hello, {formData.fullName}!</Text>
                </View>

                {/* User Information */}
                <View style={styles.infoContainer}>
                    {isEditing ? (
                        // Editable Form
                        <>
                            {Object.keys(formData).map(key => (
                                <View key={key} style={styles.infoRow}>
                                    <Icon name={getIconName(key)} size={24} color="#9C27B0" />
                                    <TextInput
                                        style={styles.infoTextInput}
                                        value={formData[key]}
                                        onChangeText={(text) => handleInputChange(key, text)}
                                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                    />
                                </View>
                            ))}
                            <Button title="Update Profile" onPress={handleUpdateProfile} />
                        </>
                    ) : (
                        // View Mode
                        <>
                            <View style={styles.infoRow}>
                                <Icon name="calendar-outline" size={24} color="#9C27B0" />
                                <Text style={styles.infoText}>{userData.dob}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="call-outline" size={24} color="#9C27B0" />
                                <Text style={styles.infoText}>{userData.phoneNumber}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="mail-outline" size={24} color="#9C27B0" />
                                <Text style={styles.infoText}>{userData.email}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="home-outline" size={24} color="#9C27B0" />
                                <Text style={styles.infoText}>{userData.address}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="id-card-outline" size={24} color="#9C27B0" />
                                <Text style={styles.infoText}>{userData.aadhar}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="car-outline" size={24} color="#9C27B0" />
                                <Text style={styles.infoText}>{userData.dlno}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="male-female-outline" size={24} color="#9C27B0" />
                                <Text style={styles.infoText}>{userData.gender}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Icon name="document-text-outline" size={24} color="#9C27B0" />
                                <Text style={styles.infoText}>{userData.pan}</Text>
                            </View>
                        </>
                    )}
                </View>

                {/* Edit Profile Button */}
                <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
                    <Text style={styles.editButtonText}>{isEditing ? 'Cancel' : 'Edit Profile'}</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Welcome1', { user })}
            >
                <Text style={styles.buttonText}>Let's Go</Text>
                <Icon name="arrow-forward" size={24} color="#FFF" />
            </TouchableOpacity>
        </LinearGradient>
    );
};

// Helper function to get icon names based on keys
const getIconName = (key) => {
    const icons = {
        fullName: 'person-outline',
        dob: 'calendar-outline',
        phoneNumber: 'call-outline',
        email: 'mail-outline',
        address: 'home-outline',
        aadhar: 'id-card-outline',
        dlno: 'car-outline',
        gender: 'male-female-outline',
        pan: 'document-text-outline',
    };
    return icons[key] || 'help-circle-outline';
};

const styles = StyleSheet.create({
    gradientBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#673AB7',
        marginBottom: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#673AB7',
    },
    infoContainer: {
        width: '100%',
        marginVertical: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        marginHorizontal: 10,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
    },
    infoTextInput: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        flex: 1,
    },
    editButton: {
        backgroundColor: '#545a2c',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginTop: 20,
    },
    editButtonText: {
        color: 'white',
        fontSize: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#545a2c',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        marginRight: 10,
    },
});

export default Profile1;