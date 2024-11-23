import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';

const UpdateUserProfile = ({route}) => {
    const { phoneNumber } = route.params; 
    console.log(phoneNumber);

    const [userData, setUserData] = useState({
        phoneNumber: '',
        fullName: '',
        profileImage: '',
        type: 'owner',
        aadharNumber: '',
        panNumber: '',
    });

    const [updatedData, setUpdatedData] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`http://192.168.1.6:8000/api/v1/users/user/${phoneNumber}`);
            const result = await response.json();
            console.log('API Response:', result);
    
            if (result.data) {
                setUserData(result.data);
            } else {
                console.error('User not found');
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
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://192.168.1.6:8000/api/v1/users/updateuser', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            const result = await response.json();
            setUpdatedData(result.data);
            console.log(result.message);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Update Profile</Text>

            {updatedData && (
                <View style={styles.updatedData}>
                    <Text>Updated User ID: {updatedData._id}</Text>
                    <Text>Full Name: {updatedData.fullName}</Text>
                    <Text>Phone Number: {updatedData.phoneNumber}</Text>
                    <Text>Profile Image: </Text>
                    <Image source={{ uri: updatedData.profileImage }} style={styles.profileImage} />
                </View>
            )}

            <TextInput
                style={styles.input}
                value={userData.fullName}
                onChangeText={(text) => handleInputChange('fullName', text)}
                placeholder="Full Name"
            />

            <TextInput
                style={styles.input}
                value={userData.phoneNumber}
                onChangeText={(text) => handleInputChange('phoneNumber', text)}
                placeholder="Phone Number"
                keyboardType="numeric"
            />
            
            <TextInput
                style={styles.input}
                value={userData.profileImage}
                onChangeText={(text) => handleInputChange('profileImage', text)}
                placeholder="Profile Image URL"
            />

            <TextInput
                style={styles.input}
                value={userData.aadharNumber}
                onChangeText={(text) => handleInputChange('aadharNumber', text)}
                placeholder="Aadhar Number"
                keyboardType="numeric"
            />

            <TextInput
                style={styles.input}
                value={userData.panNumber}
                onChangeText={(text) => handleInputChange('panNumber', text)}
                placeholder="PAN Number"
            />

            <Button title="Update Profile" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        borderRadius: 5,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    updatedData: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#f1f1f1',
        borderRadius: 5,
    },
});

export default UpdateUserProfile;


// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';

// const UpdateUserProfile = ({route}) => {
//     const { phoneNumber } = route.params; 
//     console.log(phoneNumber)

//   const [userData, setUserData] = useState({
//     phoneNumber: '',
//     fullName: '',
//     profileImage: '',
//     type: 'owner',
//     aadharNumber: '',
//     panNumber: '',
//   });

//   const [updatedData, setUpdatedData] = useState(null);

//   useEffect(() => {
//     // You can fetch the current user data if needed
//     // fetchUserData();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       const response = await fetch('http://192.168.1.6:8000/api/v1/users/updateuser');
//       const result = await response.json();
//       setUserData(result.data);
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//     }
//   };

//   const handleInputChange = (field, value) => {
//     setUserData(prevData => ({
//       ...prevData,
//       [field]: value,
//     }));
//   };

//   const handleSubmit = async () => {
//     try {
//       const response = await fetch('http://192.168.1.6:8000/api/v1/users/updateuser', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//       });
//       const result = await response.json();
//       setUpdatedData(result.data);
//       console.log(result.message);
//     } catch (error) {
//       console.error('Error updating user data:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Update Profile</Text>

//       {updatedData && (
//         <View style={styles.updatedData}>
//           <Text>Updated User ID: {updatedData._id}</Text>
//           <Text>Full Name: {updatedData.fullName}</Text>
//           <Text>Phone Number: {updatedData.phoneNumber}</Text>
//           <Text>Profile Image: </Text>
//           <Image source={{ uri: updatedData.profileImage }} style={styles.profileImage} />
//         </View>
//       )}

//       <TextInput
//         style={styles.input}
//         value={userData.fullName}
//         onChangeText={(text) => handleInputChange('fullName', text)}
//         placeholder="Full Name"
//       />

//       <TextInput
//         style={styles.input}
//         value={userData.phoneNumber}
//         onChangeText={(text) => handleInputChange('phoneNumber', text)}
//         placeholder="Phone Number"
//         keyboardType="numeric"
//       />

//       <TextInput
//         style={styles.input}
//         value={userData.profileImage}
//         onChangeText={(text) => handleInputChange('profileImage', text)}
//         placeholder="Profile Image URL"
//       />

//       <TextInput
//         style={styles.input}
//         value={userData.aadharNumber}
//         onChangeText={(text) => handleInputChange('aadharNumber', text)}
//         placeholder="Aadhar Number"
//         keyboardType="numeric"
//       />

//       <TextInput
//         style={styles.input}
//         value={userData.panNumber}
//         onChangeText={(text) => handleInputChange('panNumber', text)}
//         placeholder="PAN Number"
//       />

//       <Button title="Update Profile" onPress={handleSubmit} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingLeft: 10,
//     borderRadius: 5,
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 10,
//   },
//   updatedData: {
//     marginBottom: 20,
//     padding: 10,
//     backgroundColor: '#f1f1f1',
//     borderRadius: 5,
//   },
// });

// export default UpdateUserProfile;
