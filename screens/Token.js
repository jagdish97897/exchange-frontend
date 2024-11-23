import * as SecureStore from 'expo-secure-store';

// Save token
const saveToken = async (key, value) => {
    try {
        await SecureStore.setItemAsync(key, value);
        console.log('Token saved successfully');
    } catch (error) {
        console.error('Error saving token:', error);
    }
};

// Retrieve token
const getToken = async (key) => {
    try {
        const result = await SecureStore.getItemAsync(key);
        if (result) {
            console.log('Token retrieved:', result);
            return result;
        } else {
            console.log('No token found');
            return null;
        }
    } catch (error) {
        console.error('Error retrieving token:', error);
    }
};

// Delete token
const deleteToken = async (key) => {
    try {
        await SecureStore.deleteItemAsync(key);
        console.log('Token deleted');
    } catch (error) {
        console.error('Error deleting token:', error);
    }
};

export { saveToken, getToken, deleteToken }
