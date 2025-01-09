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
import { API_END_POINT } from '../app.config';
import { getToken } from '../Token';

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

  const [isImageSelected, setIsImageSelected] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUserData();
  }, [phoneNumber]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_END_POINT}/api/v1/users/${phoneNumber}`);
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
        setIsImageSelected(true); // Mark that an image has been selected
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
    // if (!validateFields()) {
    //   return;
    // }

    try {
      // const formData = new FormData();
      // const formData = {};

      // // Append text fields
      // for (const key in userData) {
      //   // formData.append(key, userData[key]);
      //   // if (key !== 'profileImage') {

      //   // } else {
      //   //   formData.append(key, imageUrl);
      //   // }  

      //   formData[key] = userData[key];
      // }


      // console.log('formData values @@@@@@@@@@@', formData)
      // Append the image file
      // if (userData.profileImage) {
      //   const uriParts = userData.profileImage.split('.');
      //   const fileType = uriParts[uriParts.length - 1];
      //   const imageName = userData.profileImage.split('/').pop();

      //   formData.append('profileImage', {
      //     uri: userData.profileImage,
      //     name: imageName,
      //     type: `image/${fileType}`,
      //   });
      // }

      // console.log('userData', userData);

      const response = await fetch(`${API_END_POINT}/api/v1/users/updateuser/${phoneNumber}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json', // Specify JSON content type
          },
          body: JSON.stringify(userData),
        }
      );
      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'User data updated successfully.', [
          { text: 'OK', onPress: () => navigation.navigate('Profile', { phoneNumber }) },
        ]);
      } else {
        Alert.alert('Error', result.message || 'Failed to update user data.');
      }
    } catch (error) {
      console.log('Error updating user data:', error);
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
      <View key={field} style={styles.inputWrapper}>
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


  const handleUploadImage = async () => {
    try {
      if (isImageSelected) {
        console.log('profileImage recieved %%%%%%%%%%%%%', userData.profileImage);
        const formData = new FormData();
        const uriParts = userData.profileImage.split('.');
        const fileType = uriParts[uriParts.length - 1];
        const imageName = userData.profileImage.split('/').pop();

        formData.append('file', {
          uri: userData.profileImage,
          name: imageName,
          type: `image/${fileType}`
        });

        const response = await fetch(`${API_END_POINT}/api/v1/users/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            // Authorization: `Bearer ${getToken('token')}`, // Add authentication if required
          },
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          setUserData((prevData) => ({
            ...prevData,
            profileImage: result.fileUrl,
          }));

          setIsImageSelected(false);
          console.log('Image uploaded successfully:', result.fileUrl);
        } else {
          console.error('Image upload failed:', result.message);
        }
      }

    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Update Profile</Text>

      <TouchableOpacity onPress={handleImagePicker} style={styles.imagePicker}>
        {userData.profileImage ? (
          <Image
            source={{ uri: encodeURI(userData.profileImage) }}
            style={styles.image}
            onLoadEnd={handleUploadImage}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>Select Image</Text>
          </View>
        )}
      </TouchableOpacity>

      {errors.profileImage && <Text style={styles.errorText}>{errors.profileImage}</Text>}

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, errors.fullName && styles.errorInput]}
          value={userData.fullName}
          onChangeText={(text) => handleInputChange('fullName', text)}
          placeholder="Full Name"
        />
        {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, errors.phoneNumber && styles.errorInput]}
          value={userData.phoneNumber}
          onChangeText={(text) => handleInputChange('phoneNumber', text)}
          placeholder="Phone Number"
        />
        {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
      </View>

      {renderFieldsBasedOnType()}

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  errorInput: {
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 5,
  },
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  imagePlaceholder: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#666',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default UpdateUserProfile;