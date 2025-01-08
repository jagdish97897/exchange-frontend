import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import tailwind from 'tailwind-react-native-classnames';
import { API_END_POINT } from '../app.config';

const { width, height } = Dimensions.get('window');

const Profile = ({ navigation, route }) => {
  const { phoneNumber } = route.params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_URL = `${API_END_POINT}/api/v1/users/${phoneNumber}`;

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Unable to load user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [phoneNumber]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData().finally(() => setRefreshing(false));
  };

  const handleEditProfile = () => {
    navigation.navigate('UpdateUserProfile', { phoneNumber });
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => navigation.navigate('Landing') },
    ]);
  };

  if (loading && !refreshing) {
    return (
      <View style={tailwind`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={tailwind`flex-1 justify-center items-center bg-white`}>
        <Text style={tailwind`text-gray-700 text-lg`}>No user data available.</Text>
      </View>
    );
  }

  // Filter out unwanted fields from user data
  const filteredUser = { ...user };
  delete filteredUser._id;
  delete filteredUser.profileImage;
  delete filteredUser.__v;
  delete filteredUser.createdAt;
  delete filteredUser.updatedAt;
  delete filteredUser.otp;
  delete filteredUser.otpExpires;

  return (
    <ScrollView
      style={tailwind`flex-1 bg-white`}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Profile Image and Name */}
      <View style={tailwind`items-center mt-6`}>
        <Image
          source={{ uri: encodeURI(user.profileImage) || 'https://via.placeholder.com/150' }}
          style={[tailwind`rounded-full border-4 border-blue-500`, { width: width * 0.35, height: width * 0.35 }]}
        />
        <Text style={[tailwind`text-2xl font-bold mt-4`, { fontSize: width * 0.08 }]}>{user.fullName}</Text>
        <Text style={tailwind`text-gray-600 text-lg mt-2`}>{user.type}</Text>
      </View>

      {/* Dynamic User Info */}
      <View style={tailwind`mt-8 px-6`}>
        {Object.entries(filteredUser).map(([key, value]) => (
          <View key={key} style={styles.infoRow}>
            <Text style={tailwind`text-gray-700 font-semibold capitalize text-base`}>
              {key.replace(/([A-Z])/g, ' $1')}:
            </Text>
            <Text style={tailwind`ml-4 text-gray-600 text-base`}>{String(value)}</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={tailwind`mt-8 px-6 mb-6`}>
        <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
          <Feather name="edit" size={20} color="white" />
          <Text style={tailwind`text-white text-lg ml-3`}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, tailwind`bg-red-500 mt-4`]}
          onPress={handleLogout}
        >
          <AntDesign name="logout" size={20} color="white" />
          <Text style={tailwind`text-white text-lg ml-3`}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginHorizontal: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});

export default Profile;




// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
// import { AntDesign, Feather } from '@expo/vector-icons';
// import tailwind from 'tailwind-react-native-classnames';

// const { width, height } = Dimensions.get('window');

// const Profile = ({ navigation, route }) => {
//   const { phoneNumber } = route.params;
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const API_URL = `${API_END_POINT}/api/v1/users/${phoneNumber}`;

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch(API_URL);
//         if (!response.ok) {
//           throw new Error('Failed to fetch user data');
//         }
//         const data = await response.json();
//         setUser(data);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         Alert.alert('Error', 'Unable to load user data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [phoneNumber]);

//   const handleEditProfile = () => {
//     navigation.navigate('UpdateUserProfile', { phoneNumber });
//   };

//   const handleLogout = () => {
//     Alert.alert('Logout', 'Are you sure you want to log out?', [
//       { text: 'Cancel', style: 'cancel' },
//       { text: 'Logout', onPress: () => navigation.navigate('Login') },
//     ]);
//   };

//   if (loading) {
//     return (
//       <View style={tailwind`flex-1 justify-center items-center bg-white`}>
//         <ActivityIndicator size="large" color="#3B82F6" />
//       </View>
//     );
//   }

//   if (!user) {
//     return (
//       <View style={tailwind`flex-1 justify-center items-center bg-white`}>
//         <Text style={tailwind`text-gray-700 text-lg`}>No user data available.</Text>
//       </View>
//     );
//   }

//   // Filter out unwanted fields from user data
//   const filteredUser = { ...user };
//   delete filteredUser._id;
//   delete filteredUser.__v;
//   delete filteredUser.createdAt;
//   delete filteredUser.updatedAt;
//   delete filteredUser.otp;
//   delete filteredUser.otpExpires;

//   return (
//     <ScrollView style={tailwind`flex-1 bg-white`}>

//       {/* Profile Image and Name */}
//       <View style={tailwind`items-center mt-6`}>
//         <Image
//           source={{ uri: encodeURI(user.profileImage) || 'https://via.placeholder.com/150' }}

//           style={[tailwind`rounded-full border-4 border-blue-500`, { width: width * 0.35, height: width * 0.35 }]}
//         />
//         <Text style={[tailwind`text-2xl font-bold mt-4`, { fontSize: width * 0.08 }]}>{user.fullName}</Text>
//         <Text style={tailwind`text-gray-600 text-lg mt-2`}>{user.type}</Text>
//       </View>

//       {/* Dynamic User Info */}
//       <View style={tailwind`mt-8 px-6`}>
//         {Object.entries(filteredUser).map(([key, value]) => (
//           <View key={key} style={styles.infoRow}>
//             <Text style={tailwind`text-gray-700 font-semibold capitalize text-base`}>{key.replace(/([A-Z])/g, ' $1')}:</Text>
//             <Text style={tailwind`ml-4 text-gray-600 text-base`}>{String(value)}</Text>
//           </View>
//         ))}
//       </View>

//       {/* Actions */}
//       <View style={tailwind`mt-8 px-6 mb-6`}>
//         <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
//           <Feather name="edit" size={20} color="white" />
//           <Text style={tailwind`text-white text-lg ml-3`}>Edit Profile</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.button, tailwind`bg-red-500 mt-4`]} onPress={handleLogout}>
//           <AntDesign name="logout" size={20} color="white" />
//           <Text style={tailwind`text-white text-lg ml-3`}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//     marginHorizontal: 10,
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#3B82F6',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
// });

// export default Profile;



// import React, { useEffect, useState } from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
// import { AntDesign, Feather } from '@expo/vector-icons';
// import tailwind from 'tailwind-react-native-classnames';

// const { width } = Dimensions.get('window');

// const Profile = ({ navigation, route }) => {
//   const { phoneNumber } = route.params;
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const API_URL = `http://localhost:8000/api/v1/users/user/${phoneNumber}`;

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch(API_URL);
//         if (!response.ok) {
//           throw new Error('Failed to fetch user data');
//         }
//         const data = await response.json();
//         setUser(data);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         Alert.alert('Error', 'Unable to load user data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserData();
//   }, [phoneNumber]);

//   const handleEditProfile = () => {
//     navigation.navigate('UpdateUserProfile', { phoneNumber });
//   };

//   const handleLogout = () => {
//     Alert.alert('Logout', 'Are you sure you want to log out?', [
//       { text: 'Cancel', style: 'cancel' },
//       { text: 'Logout', onPress: () => navigation.navigate('Login') },
//     ]);
//   };

//   if (loading) {
//     return (
//       <View style={tailwind`flex-1 justify-center items-center bg-white`}>
//         <ActivityIndicator size="large" color="#3B82F6" />
//       </View>
//     );
//   }

//   if (!user) {
//     return (
//       <View style={tailwind`flex-1 justify-center items-center bg-white`}>
//         <Text style={tailwind`text-gray-700 text-lg`}>No user data available.</Text>
//       </View>
//     );
//   }

//   // Filter out unwanted fields from user data
//   const filteredUser = { ...user };
//   delete filteredUser._id;
//   delete filteredUser.__v;
//   delete filteredUser.createdAt;
//   delete filteredUser.updatedAt;
//   delete filteredUser.otp;
//   delete filteredUser.otpExpires;

//   return (
//     <ScrollView style={tailwind`flex-1 bg-white`}>
//       {/* Header */}
//       <View style={[tailwind`flex-row items-center px-4 py-3 bg-blue-500`, { width }]}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <AntDesign name="arrowleft" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={tailwind`text-white text-lg font-bold ml-4`}>Profile</Text>
//       </View>

//       {/* Profile Image and Name */}
//       <View style={tailwind`items-center mt-6`}>
//         <Image
//           source={{ uri: user.profileImage || 'https://via.placeholder.com/150' }}
//           style={[tailwind`rounded-full border-4 border-blue-500`, { width: width * 0.35, height: width * 0.35 }]}
//         />
//         <Text style={tailwind`text-2xl font-bold mt-4`}>{user.fullName}</Text>
//         <Text style={tailwind`text-gray-600 text-lg mt-2`}>{user.type}</Text>
//       </View>

//       {/* Dynamic User Info */}
//       <View style={tailwind`mt-8 px-6`}>
//         {Object.entries(filteredUser).map(([key, value]) => (
//           <View key={key} style={styles.infoRow}>
//             <Text style={tailwind`text-gray-700 font-semibold capitalize`}>{key.replace(/([A-Z])/g, ' $1')}:</Text>
//             <Text style={tailwind`ml-4 text-gray-600`}>{String(value)}</Text>
//           </View>
//         ))}
//       </View>

//       {/* Actions */}
//       <View style={tailwind`mt-8 px-6 mb-6`}>
//         <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
//           <Feather name="edit" size={20} color="white" />
//           <Text style={tailwind`text-white text-lg ml-3`}>Edit Profile</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.button, tailwind`bg-red-500 mt-4`]} onPress={handleLogout}>
//           <AntDesign name="logout" size={20} color="white" />
//           <Text style={tailwind`text-white text-lg ml-3`}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#3B82F6',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//   },
// });

// export default Profile;

