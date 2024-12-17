import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const UpdateUserProfile = ({ route }) => {
  const navigation = useNavigation();
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
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUserData();
  }, [phoneNumber]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://192.168.1.6:8000/api/v1/users/user/${phoneNumber}`);
      const result = await response.json();

      if (response.ok) {
        setUserData((prevData) => ({
          ...prevData,
          ...result,
          type: result.type || 'owner',
        }));
      } else {
        Alert.alert('Error', 'User not found.');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to fetch user data.');
    }
  };

  const handleInputChange = (field, value) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    if (value.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: '',
      }));
    }
  };

  const handleImagePicker = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        setUserData((prevData) => ({
          ...prevData,
          profileImage: result.assets[0].uri,
        }));
      } else {
        Alert.alert('Image selection canceled');
      }
    } else {
      Alert.alert('Permission denied', 'Please allow access to your photos.');
    }
  };

  const validateFields = () => {
    let isValid = true;
    const newErrors = {};
    const requiredFields = ['fullName', 'profileImage', 'phoneNumber'];

    if (userData.type === 'consumer') {
      requiredFields.push('email', 'gstin', 'companyName', 'website');
    } else if (userData.type === 'transporter') {
      requiredFields.push('email', 'aadharNumber', 'panNumber', 'dob', 'gender');
    } else if (userData.type === 'driver') {
      requiredFields.push('aadharNumber', 'panNumber', 'dlNumber', 'dob', 'gender');
    } else if (['owner', 'broker'].includes(userData.type)) {
      requiredFields.push('aadharNumber', 'panNumber');
    }

    requiredFields.forEach((field) => {
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
      const formData = new FormData();

      // Append text fields
      for (const key in userData) {
        if (key !== 'profileImage') { // Exclude image from this loop
          formData.append(key, userData[key]);
        }
      }

      // Append the image file
      if (userData.profileImage) {
        const uriParts = userData.profileImage.split('.');
        const fileType = uriParts[uriParts.length - 1];
        const imageName = userData.profileImage.split('/').pop();

        formData.append('profileImage', {
          uri: userData.profileImage,
          name: imageName,
          type: `image/${fileType}`,
        });

        // console.log('condition formadata',formData.profileImage);
      }

      const response = await fetch(`http://192.168.1.6:8000/api/v1/users/updateuser/${phoneNumber}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'User data updated successfully.', [
          { text: 'OK', onPress: () => navigation.navigate('Profile', { phoneNumber }) },
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
    const additionalFields = {
      consumer: ['email', 'gstin', 'companyName', 'website'],
      transporter: ['email', 'aadharNumber', 'panNumber', 'dob', 'gender'],
      driver: ['aadharNumber', 'panNumber', 'dlNumber', 'dob', 'gender'],
      owner: ['aadharNumber', 'panNumber'],
      broker: ['aadharNumber', 'panNumber'],
    };

    const fieldsToRender = additionalFields[userData.type] || [];

    return fieldsToRender.map((field) => (
      <View key={field}>
        <TextInput
          style={[styles.input, errors[field] && styles.errorInput]}
          value={userData[field]}
          onChangeText={(text) => handleInputChange(field, text)}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
        />
        {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
      </View>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Update Profile</Text>

      <Text>{userData.profileImage}</Text>

      <TouchableOpacity onPress={handleImagePicker}>
        {userData.profileImage ? (
          <Image
            source={
              userData.profileImage && userData.profileImage !== 'undefined'
                ? { uri: encodeURI(userData.profileImage) }
                : require('../assets/images/logo-removebg-preview 1.png') // Local fallback image
            }
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text>Select Image</Text>
          </View>
        )}
      </TouchableOpacity>
      {errors.profileImage && <Text style={styles.errorText}>{errors.profileImage}</Text>}

      <TextInput
        style={[styles.input, errors.fullName && styles.errorInput]}
        value={userData.fullName}
        onChangeText={(text) => handleInputChange('fullName', text)}
        placeholder="Full Name"
      />
      {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

      <TextInput
        style={[styles.input, errors.phoneNumber && styles.errorInput]}
        value={userData.phoneNumber}
        onChangeText={(text) => handleInputChange('phoneNumber', text)}
        placeholder="Phone Number"
      />
      {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

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
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
  imagePlaceholder: {
    height: 100,
    width: 100,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
});

export default UpdateUserProfile;