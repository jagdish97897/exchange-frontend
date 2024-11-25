import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, ScrollView } from 'react-native';

const UpdateUserProfile = ({ route, navigation }) => {
    const { phoneNumber } = route.params;

    const [userData, setUserData] = useState({
        phoneNumber: phoneNumber || '',
        fullName: '',
        profileImage: '',
        type: '',
        aadharNumber: '',
        panNumber: '',
        gstin: '',
        companyName: '',
        website: '',
        dob: '',
        gender: '',
        dlNumber: '',
        email: '',
        createdAt: '',
        updatedAt: '',
    });

    const [updatedData, setUpdatedData] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchUserData();
    }, [phoneNumber]);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`http://192.168.1.6:8000/api/v1/users/user/${phoneNumber}`);
            const result = await response.json();

            if (response.ok) {
                setUserData(prevData => ({
                    ...prevData,
                    ...result,
                    type: result.type || 'owner',
                }));
            } else {
                Alert.alert('Error', 'User not found.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleInputChange = (field, value) => {
        setUserData(prevData => ({
            ...prevData,
            [field]: value,
        }));

        if (value.trim()) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [field]: '',
            }));
        }
    };

    const validateFields = () => {
        let isValid = true;
        const newErrors = {};

        const requiredFields = ['fullName', 'email', 'profileImage'];
        if (userData.type === 'consumer') {
            requiredFields.push('gstin', 'companyName', 'website');
        } else if (userData.type === 'transporter') {
            requiredFields.push('aadharNumber', 'panNumber', 'dob', 'gender');
        } else if (userData.type === 'driver') {
            requiredFields.push('dlNumber', 'dob');
        } else if (['owner', 'broker'].includes(userData.type)) {
            requiredFields.push('aadharNumber', 'panNumber');
        }

        requiredFields.forEach(field => {
            if (!userData[field] || !userData[field].trim()) {
                newErrors[field] = 'This field is required';
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateFields()) {
            return;
        }
    
        try {
            const response = await fetch(`http://192.168.1.6:8000/api/v1/users/updateuser/${phoneNumber}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const result = await response.json();
    
            if (response.ok) {
                setUpdatedData(result.data);
                Alert.alert('Success', 'User data updated successfully.', [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Navigate to Profile screen after successful update
                            navigation.navigate('Profile', { phoneNumber }); // Pass any necessary params
                        },
                    },
                ]);
            } else {
                Alert.alert('Error', result.message || 'Failed to update user data.');
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            Alert.alert('Error', 'An error occurred while updating user data.');
        }
    };

    const renderFieldsBasedOnType = () => {
        switch (userData.type) {
            case 'consumer':
                return (
                    <>
                        <TextInput
                            style={[styles.input, errors.gstin && styles.errorInput]}
                            value={userData.gstin}
                            onChangeText={(text) => handleInputChange('gstin', text)}
                            placeholder="GSTIN"
                        />
                        <Text style={styles.errorText}>{errors.gstin}</Text>
                        <TextInput
                            style={[styles.input, errors.companyName && styles.errorInput]}
                            value={userData.companyName}
                            onChangeText={(text) => handleInputChange('companyName', text)}
                            placeholder="Company Name"
                        />
                        <Text style={styles.errorText}>{errors.companyName}</Text>
                        <TextInput
                            style={[styles.input, errors.website && styles.errorInput]}
                            value={userData.website}
                            onChangeText={(text) => handleInputChange('website', text)}
                            placeholder="Website"
                        />
                        <Text style={styles.errorText}>{errors.website}</Text>
                    </>
                );
            case 'transporter':
                return (
                    <>
                        <TextInput
                            style={[styles.input, errors.aadharNumber && styles.errorInput]}
                            value={userData.aadharNumber}
                            onChangeText={(text) => handleInputChange('aadharNumber', text)}
                            placeholder="Aadhar Number"
                            keyboardType="numeric"
                        />
                        <Text style={styles.errorText}>{errors.aadharNumber}</Text>
                        <TextInput
                            style={[styles.input, errors.panNumber && styles.errorInput]}
                            value={userData.panNumber}
                            onChangeText={(text) => handleInputChange('panNumber', text)}
                            placeholder="PAN Number"
                        />
                        <Text style={styles.errorText}>{errors.panNumber}</Text>
                        <TextInput
                            style={[styles.input, errors.dob && styles.errorInput]}
                            value={userData.dob}
                            onChangeText={(text) => handleInputChange('dob', text)}
                            placeholder="Date of Birth"
                        />
                        <Text style={styles.errorText}>{errors.dob}</Text>
                        <TextInput
                            style={[styles.input, errors.gender && styles.errorInput]}
                            value={userData.gender}
                            onChangeText={(text) => handleInputChange('gender', text)}
                            placeholder="Gender"
                        />
                        <Text style={styles.errorText}>{errors.gender}</Text>
                    </>
                );
            case 'driver':
                return (
                    <>
                        <TextInput
                            style={[styles.input, errors.dlNumber && styles.errorInput]}
                            value={userData.dlNumber}
                            onChangeText={(text) => handleInputChange('dlNumber', text)}
                            placeholder="Driving License Number"
                        />
                        <Text style={styles.errorText}>{errors.dlNumber}</Text>
                        <TextInput
                            style={[styles.input, errors.dob && styles.errorInput]}
                            value={userData.dob}
                            onChangeText={(text) => handleInputChange('dob', text)}
                            placeholder="Date of Birth"
                        />
                        <Text style={styles.errorText}>{errors.dob}</Text>
                    </>
                );
            case 'owner':
            case 'broker':
                return (
                    <>
                        <TextInput
                            style={[styles.input, errors.aadharNumber && styles.errorInput]}
                            value={userData.aadharNumber}
                            onChangeText={(text) => handleInputChange('aadharNumber', text)}
                            placeholder="Aadhar Number"
                            keyboardType="numeric"
                        />
                        <Text style={styles.errorText}>{errors.aadharNumber}</Text>
                        <TextInput
                            style={[styles.input, errors.panNumber && styles.errorInput]}
                            value={userData.panNumber}
                            onChangeText={(text) => handleInputChange('panNumber', text)}
                            placeholder="PAN Number"
                        />
                        <Text style={styles.errorText}>{errors.panNumber}</Text>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Update Profile</Text>

            <TextInput
                style={[styles.input, errors.fullName && styles.errorInput]}
                value={userData.fullName}
                onChangeText={(text) => handleInputChange('fullName', text)}
                placeholder="Full Name"
            />
            <Text style={styles.errorText}>{errors.fullName}</Text>

            <TextInput
                style={[styles.input, errors.email && styles.errorInput]}
                value={userData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="Email"
                keyboardType="email-address"
            />
            <Text style={styles.errorText}>{errors.email}</Text>

            <TextInput
                style={[styles.input, errors.profileImage && styles.errorInput]}
                value={userData.profileImage}
                onChangeText={(text) => handleInputChange('profileImage', text)}
                placeholder="Profile Image URL"
            />
            <Text style={styles.errorText}>{errors.profileImage}</Text>

            {renderFieldsBasedOnType()}

            <Button title="Update Profile" onPress={handleSubmit} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
});

export default UpdateUserProfile;



// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, Image, StyleSheet, Alert, ScrollView } from 'react-native';

// const UpdateUserProfile = ({ route }) => {
//     const { phoneNumber } = route.params;

//     const [userData, setUserData] = useState({
//         phoneNumber: phoneNumber || '',
//         fullName: '',
//         profileImage: '',
//         type: '',
//         aadharNumber: '',
//         panNumber: '',
//         gstin: '',
//         companyName: '',
//         website: '',
//         dob: '',
//         gender: '',
//         dlNumber: '',
//         email: '',
//         createdAt: '',
//         updatedAt: '',
//     });

//     const [updatedData, setUpdatedData] = useState(null);
//     const [errors, setErrors] = useState({});

//     useEffect(() => {
//         fetchUserData();
//     }, [phoneNumber]);

//     const fetchUserData = async () => {
//         try {
//             const response = await fetch(`http://192.168.1.6:8000/api/v1/users/user/${phoneNumber}`);
//             const result = await response.json();

//             if (response.ok) {
//                 setUserData(prevData => ({
//                     ...prevData,
//                     ...result,
//                     type: result.type || 'owner',
//                 }));
//             } else {
//                 Alert.alert('Error', 'User not found.');
//             }
//         } catch (error) {
//             console.error('Error fetching user data:', error);
//         }
//     };

//     const handleInputChange = (field, value) => {
//         setUserData(prevData => ({
//             ...prevData,
//             [field]: value,
//         }));

//         if (value.trim()) {
//             setErrors(prevErrors => ({
//                 ...prevErrors,
//                 [field]: '',
//             }));
//         }
//     };

//     const validateFields = () => {
//         let isValid = true;
//         const newErrors = {};

//         const requiredFields = ['fullName', 'email', 'profileImage'];
//         if (userData.type === 'consumer') {
//             requiredFields.push('gstin', 'companyName', 'website');
//         } else if (userData.type === 'transporter') {
//             requiredFields.push('aadharNumber', 'panNumber', 'dob', 'gender');
//         } else if (userData.type === 'driver') {
//             requiredFields.push('dlNumber', 'dob');
//         } else if (['owner', 'broker'].includes(userData.type)) {
//             requiredFields.push('aadharNumber', 'panNumber');
//         }

//         requiredFields.forEach(field => {
//             if (!userData[field] || !userData[field].trim()) {
//                 newErrors[field] = 'This field is required';
//                 isValid = false;
//             }
//         });

//         setErrors(newErrors);
//         return isValid;
//     };

//     const handleSubmit = async () => {
//         if (!validateFields()) {
//             return;
//         }
    
//         try {
//             const response = await fetch(`http://192.168.1.6:8000/api/v1/users/updateuser/${phoneNumber}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(userData),
//             });
//             const result = await response.json();
    
//             if (response.ok) {
//                 setUpdatedData(result.data);
//                 Alert.alert('Success', 'User data updated successfully.', [
//                     {
//                         text: 'OK',
//                         onPress: () => {
//                             // Navigate to Profile screen after successful update
//                             navigation.navigate('Profile', {phoneNumber }); // Pass any necessary params
//                         },
//                     },
//                 ]);
//             } else {
//                 Alert.alert('Error', result.message || 'Failed to update user data.');
//             }
//         } catch (error) {
//             console.error('Error updating user data:', error);
//             Alert.alert('Error', 'An error occurred while updating user data.');
//         }
//     };
    

//     const renderFieldsBasedOnType = () => {
//         switch (userData.type) {
//             case 'consumer':
//                 return (
//                     <>
//                         <TextInput
//                             style={[styles.input, errors.gstin && styles.errorInput]}
//                             value={userData.gstin}
//                             onChangeText={(text) => handleInputChange('gstin', text)}
//                             placeholder="GSTIN"
//                         />
//                         <Text style={styles.errorText}>{errors.gstin}</Text>
//                         <TextInput
//                             style={[styles.input, errors.companyName && styles.errorInput]}
//                             value={userData.companyName}
//                             onChangeText={(text) => handleInputChange('companyName', text)}
//                             placeholder="Company Name"
//                         />
//                         <Text style={styles.errorText}>{errors.companyName}</Text>
//                         <TextInput
//                             style={[styles.input, errors.website && styles.errorInput]}
//                             value={userData.website}
//                             onChangeText={(text) => handleInputChange('website', text)}
//                             placeholder="Website"
//                         />
//                         <Text style={styles.errorText}>{errors.website}</Text>
//                     </>
//                 );
//             case 'transporter':
//                 return (
//                     <>
//                         <TextInput
//                             style={[styles.input, errors.aadharNumber && styles.errorInput]}
//                             value={userData.aadharNumber}
//                             onChangeText={(text) => handleInputChange('aadharNumber', text)}
//                             placeholder="Aadhar Number"
//                             keyboardType="numeric"
//                         />
//                         <Text style={styles.errorText}>{errors.aadharNumber}</Text>
//                         <TextInput
//                             style={[styles.input, errors.panNumber && styles.errorInput]}
//                             value={userData.panNumber}
//                             onChangeText={(text) => handleInputChange('panNumber', text)}
//                             placeholder="PAN Number"
//                         />
//                         <Text style={styles.errorText}>{errors.panNumber}</Text>
//                         <TextInput
//                             style={[styles.input, errors.dob && styles.errorInput]}
//                             value={userData.dob}
//                             onChangeText={(text) => handleInputChange('dob', text)}
//                             placeholder="Date of Birth"
//                         />
//                         <Text style={styles.errorText}>{errors.dob}</Text>
//                         <TextInput
//                             style={[styles.input, errors.gender && styles.errorInput]}
//                             value={userData.gender}
//                             onChangeText={(text) => handleInputChange('gender', text)}
//                             placeholder="Gender"
//                         />
//                         <Text style={styles.errorText}>{errors.gender}</Text>
//                     </>
//                 );
//             case 'driver':
//                 return (
//                     <>
//                         <TextInput
//                             style={[styles.input, errors.dlNumber && styles.errorInput]}
//                             value={userData.dlNumber}
//                             onChangeText={(text) => handleInputChange('dlNumber', text)}
//                             placeholder="Driving License Number"
//                         />
//                         <Text style={styles.errorText}>{errors.dlNumber}</Text>
//                         <TextInput
//                             style={[styles.input, errors.dob && styles.errorInput]}
//                             value={userData.dob}
//                             onChangeText={(text) => handleInputChange('dob', text)}
//                             placeholder="Date of Birth"
//                         />
//                         <Text style={styles.errorText}>{errors.dob}</Text>
//                     </>
//                 );
//             case 'owner':
//             case 'broker':
//                 return (
//                     <>
//                         <TextInput
//                             style={[styles.input, errors.aadharNumber && styles.errorInput]}
//                             value={userData.aadharNumber}
//                             onChangeText={(text) => handleInputChange('aadharNumber', text)}
//                             placeholder="Aadhar Number"
//                             keyboardType="numeric"
//                         />
//                         <Text style={styles.errorText}>{errors.aadharNumber}</Text>
//                         <TextInput
//                             style={[styles.input, errors.panNumber && styles.errorInput]}
//                             value={userData.panNumber}
//                             onChangeText={(text) => handleInputChange('panNumber', text)}
//                             placeholder="PAN Number"
//                         />
//                         <Text style={styles.errorText}>{errors.panNumber}</Text>
//                     </>
//                 );
//             default:
//                 return null;
//         }
//     };

//     return (
//         <ScrollView contentContainerStyle={styles.container}>
//             <Text style={styles.title}>Update Profile</Text>

//             {updatedData && (
//                 <View style={styles.updatedData}>
//                     <Text>Updated User ID: {updatedData._id}</Text>
//                     <Text>Full Name: {updatedData.fullName}</Text>
//                     <Text>Phone Number: {updatedData.phoneNumber}</Text>
//                     <Text>Email: {updatedData.email}</Text>
//                     <Image source={{ uri: updatedData.profileImage }} style={styles.profileImage} />
//                     <Text>Created At: {updatedData.createdAt}</Text>
//                     <Text>Updated At: {updatedData.updatedAt}</Text>
//                 </View>
//             )}

//             <TextInput
//                 style={[styles.input, errors.fullName && styles.errorInput]}
//                 value={userData.fullName}
//                 onChangeText={(text) => handleInputChange('fullName', text)}
//                 placeholder="Full Name"
//             />
//             <Text style={styles.errorText}>{errors.fullName}</Text>

//             <TextInput
//                 style={[styles.input, errors.email && styles.errorInput]}
//                 value={userData.email}
//                 onChangeText={(text) => handleInputChange('email', text)}
//                 placeholder="Email"
//                 keyboardType="email-address"
//             />
//             <Text style={styles.errorText}>{errors.email}</Text>

//             <TextInput
//                 style={[styles.input, errors.profileImage && styles.errorInput]}
//                 value={userData.profileImage}
//                 onChangeText={(text) => handleInputChange('profileImage', text)}
//                 placeholder="Profile Image URL"
//             />
//             <Text style={styles.errorText}>{errors.profileImage}</Text>

//             {renderFieldsBasedOnType()}

//             <Button title="Update Profile" onPress={handleSubmit} />
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         padding: 20,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 8,
//         padding: 10,
//         marginBottom: 10,
//     },
//     errorInput: {
//         borderColor: 'red',
//     },
//     errorText: {
//         color: 'red',
//         marginBottom: 10,
//     },
//     updatedData: {
//         padding: 10,
//         backgroundColor: '#e0e0e0',
//         marginBottom: 20,
//         borderRadius: 8,
//     },
//     profileImage: {
//         width: 100,
//         height: 100,
//         borderRadius: 50,
//         marginTop: 10,
//     },
// });

// export default UpdateUserProfile;


