import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import axios from "axios";

const Trips = ({ route }) => {
  const { userId } = route.params;
  const [currentTrip, setCurrentTrips] = useState(null);
  const [pastTrip, setPastTrips] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get(`http://192.168.1.3:8000/api/trips/customer/${userId}`);
        // use reduce for inProgress completed cancelled created trips
        if (response.status === 200) {

          setCurrentTrips(response.data.trips.map(trip => trip.status === 'created'));
          setPastTrips(response.data.trips.map(trip => trip.status === 'created'));
        }
      } catch (error) {
        console.log(error);
      }

    };

    fetchTrips();
  }, [])
  const currentTrips = [
    { id: 1, driver: "John Doe", eta: "15 mins", destination: "City Center" },
    { id: 2, driver: "John Doe1", eta: "20 mins", destination: "Airport" },
    { id: 3, driver: "John Doe2", eta: "25 mins", destination: "Mallsdfghjk" },
  ];

  const pastTrips = [
    { id: 1, driver: "Jane Smith", date: "2024-12-30", cargoType: "Furniture" },
    { id: 2, driver: "John Doe1", date: "2024-12-29", cargoType: "Electronics" },
    { id: 3, driver: "John Doe2", date: "2024-12-28", cargoType: "Groceries" },
    { id: 4, driver: "John Doe3", date: "2024-12-27", cargoType: "Clothing" },
    { id: 5, driver: "Jane Smith2", date: "2024-12-30", cargoType: "Furniture" },
    { id: 6, driver: "John Doe4", date: "2024-12-29", cargoType: "Electronics" },
    { id: 7, driver: "John Doe5", date: "2024-12-28", cargoType: "Groceries" },
    { id: 8, driver: "John Doe6", date: "2024-12-27", cargoType: "Clothing" },
  ];
  const completedTrips = [
    { id: 1, driver: "John Doe", eta: "15 mins", destination: "City Center" },
    { id: 2, driver: "John Doe1", eta: "20 mins", destination: "Airport" },
    { id: 3, driver: "John Doe2", eta: "25 mins", destination: "Mallsdfghjk" },
  ];

  const canceledTrips = [
    { id: 1, driver: "Jane Smith", date: "2024-12-30", cargoType: "Furniture" },
    { id: 2, driver: "John Doe1", date: "2024-12-29", cargoType: "Electronics" },
    { id: 3, driver: "John Doe2", date: "2024-12-28", cargoType: "Groceries" },
    { id: 4, driver: "John Doe3", date: "2024-12-27", cargoType: "Clothing" },
    { id: 5, driver: "Jane Smith2", date: "2024-12-30", cargoType: "Furniture" },
    { id: 6, driver: "John Doe4", date: "2024-12-29", cargoType: "Electronics" },
    { id: 7, driver: "John Doe5", date: "2024-12-28", cargoType: "Groceries" },
    { id: 8, driver: "John Doe6", date: "2024-12-27", cargoType: "Clothing" },
  ];

  const renderCurrentTrip = ({ item }) => (
    <View style={styles.tripBox}>
      <Text style={styles.driverText}>Driver: {item.driver}</Text>
      <Text>ETA: {item.eta}</Text>
      <Text>Destination: {item.destination}</Text>
      <TouchableOpacity style={styles.downloadButton}>
        <Ionicons name="cloud-download-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  const renderPastTrip = ({ item }) => (
    <View style={styles.tripBox}>
      <Text style={styles.driverText}>Driver: {item.driver}</Text>
      <Text>Date: {item.date}</Text>
      <Text>Cargo Type: {item.cargoType}</Text>
      <TouchableOpacity style={styles.downloadButton}>
        <Ionicons name="cloud-download-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Current Trips Section */}
      <Text style={styles.header}>Current Trips</Text>
      <FlatList
        data={currentTrips}
        renderItem={renderCurrentTrip}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {/* Past Trips Section */}
      <Text style={styles.header}>Past Trips</Text>
      <FlatList
        data={pastTrips}
        renderItem={renderPastTrip}
        keyExtractor={(item) => item.id.toString()}
        style={styles.pastTripsContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />} // Adds 10px vertical space
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // backgroundColor: "red",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listContainer: {
    marginBottom: 20,
    maxHeight: '60%',

  },
  tripBox: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    // marginBottom: 10,
  },
  driverText: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  downloadButton: {
    marginTop: 10,
  },
  pastTripsContainer: {
    flex: 1, // Allows the past trips section to take available space
  },
});

export default Trips;


// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   FlatList,
//   StyleSheet,
//   TouchableWithoutFeedback,
// } from "react-native";
// import { AntDesign, Feather, Ionicons, Entypo } from "@expo/vector-icons";

// const TripBox = ({ driver, date, cargoType, isCurrent, onDownloadPress }) => (
//   <View style={isCurrent ? styles.box : styles.boxTrips}>
//     <View style={styles.contentTrips}>
//       <Text style={{ fontSize: 20 }}>{driver}</Text>
//       <Text>{date}</Text>
//       <TouchableOpacity onPress={onDownloadPress} style={styles.downloadButton}>
//         <Ionicons name="cloud-download-outline" size={30} color="black" />
//       </TouchableOpacity>
//     </View>
//     <Text style={{ fontWeight: "300", paddingLeft: 20 }}>{cargoType}</Text>
//     {!isCurrent && <View style={styles.divider} />}
//   </View>
// );

// const Footer = () => (
//   <View style={styles.footer}>
//     <TouchableOpacity>
//       <AntDesign name="home" size={24} color="white" />
//     </TouchableOpacity>
//     <TouchableOpacity style={styles.shopButton}>
//       <Entypo name="shop" size={24} color="white" />
//     </TouchableOpacity>
//     <TouchableOpacity>
//       <AntDesign name="user" size={24} color="white" />
//     </TouchableOpacity>
//   </View>
// );

// const TripsScreen = () => {
//   const [menuVisible, setMenuVisible] = useState(false);

//   const currentTrips = [
//     { id: 1, driver: "John Doe", eta: "15 mins", destination: "City Center" },
//     { id: 2, driver: "John Doe1", eta: "15 mins", destination: "City Center" },
//     { id: 3, driver: "John Doe2", eta: "15 mins", destination: "City Center" },
//     { id: 4, driver: "John Doe3", eta: "15 mins", destination: "City Center" },
//     // Add more current trips here
//   ];

//   const pastTrips = [
//     { id: 1, driver: "Jane Smith", date: "2024-12-30", cargoType: "Furniture" },
//     { id: 2, driver: "John Doe1",  date: "2024-12-30", cargoType: "Furniture" },
//     { id: 3, driver: "John Doe2",  date: "2024-12-30", cargoType: "Furniture" },
//     { id: 4, driver: "John Doe3",  date: "2024-12-30", cargoType: "Furniture" },
//     { id: 5, driver: "John Doe3",  date: "2024-12-30", cargoType: "Furniture" },
//     { id: 6, driver: "John Doe3",  date: "2024-12-30", cargoType: "Furniture" },
//     // Add more past trips here
//   ];

//   return (
//     <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
//       <View style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity>
//             <AntDesign name="arrowleft" size={24} color="black" />
//           </TouchableOpacity>
//           <Image
//             source={{ uri: "https://via.placeholder.com/150" }}
//             style={styles.profileImage}
//           />
//           <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
//             <Feather name="menu" size={24} color="black" />
//           </TouchableOpacity>
//         </View>

//         {/* Menu */}
//         {menuVisible && (
//           <View style={styles.menu}>
//             <TouchableOpacity style={styles.menuItem}>
//               <Text>Settings</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.menuItem}>
//               <Text>Help</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.menuItem}>
//               <Text>About</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.menuItem}>
//               <Text>Legal</Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* Current Trips */}
//         <Text style={styles.sectionTitle}>Current Trips</Text>
//         <ScrollView horizontal>
//           {currentTrips.map((trip) => (
//             <TripBox
//               key={trip.id}
//               driver={trip.driver}
//               cargoType={`${trip.eta} | ${trip.destination}`}
//               isCurrent
//               onDownloadPress={() => alert("Download icon pressed")}
//             />
//           ))}
//         </ScrollView>

//         {/* Past Trips */}
//         <Text style={styles.sectionTitle}>Past Trips</Text>
//         <FlatList
//           data={pastTrips}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={({ item }) => (
//             <TripBox
//               driver={item.driver}
//               date={item.date}
//               cargoType={item.cargoType}
//               onDownloadPress={() => alert("Download icon pressed")}
//             />
//           )}
//         />

//         {/* Footer */}
//         <Footer />
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, paddingTop: 50 },
//   header: {
//     backgroundColor: "grey",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     height: 60,
//     paddingHorizontal: 30,
//   },
//   profileImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//   },
//   menu: {
//     position: "absolute",
//     top: 75,
//     right: 20,
//     backgroundColor: "white",
//     padding: 10,
//     borderRadius: 5,
//     elevation: 5,
//     zIndex: 1,
//   },
//   menuItem: { marginBottom: 10 },
//   sectionTitle: { fontSize: 25, paddingLeft: 20, marginVertical: 10 },
//   box: { margin: 10, padding: 20, backgroundColor: "white", borderRadius: 10 },
//   boxTrips: {
//     marginHorizontal: 20,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "grey",
//   },
//   contentTrips: { flexDirection: "row", justifyContent: "space-between" },
//   downloadButton: { padding: 10 },
//   divider: { height: 2, backgroundColor: "grey", marginVertical: 10 },
//   footer: {
//     backgroundColor: "black",
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     paddingVertical: 10,
//   },
//   shopButton: { backgroundColor: "blue", borderRadius: 24, padding: 10 },
// });

// export default TripsScreen;


// import React, { useState } from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native';
// import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo for icons
// import { AntDesign, Feather, Entypo } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
// import { useNavigation } from '@react-navigation/native';


// const Trips = () => {
//   const [menuVisible, setMenuVisible] = useState(false);
//   const navigation = useNavigation();

//   const handleDocumentsClick = () => {
//     // Navigate to the Documents page
//     navigation.navigate('Documents');
//   };

//   const handleAccountTypeClick = () => {
//     // Navigate to the Account Type page
//     navigation.navigate('AccountType');
//   };

//   const handleDeleteAccountClick = () => {
//     // Navigate to the Delete Account page
//     navigation.navigate('DeleteAccount');
//   };

//   const handleLogoutClick = () => {
//     // Navigate to the Logout page
//     navigation.navigate('Logout');
//   };

//   const navigateBack = () => {
//     // Add navigation logic to go back to the previous page
//   };

//   const toggleMenu = () => {
//     setMenuVisible(!menuVisible);
//   };

//   const navigateToSettings = () => {
//     // Add navigation logic to go to settings page
//   };

//   const navigateToHelp = () => {
//     // Add navigation logic to go to help page
//   };

//   const navigateToAbout = () => {
//     // Add navigation logic to go to about page
//   };

//   const navigateToLegal = () => {
//     // Add navigation logic to go to legal page
//   };

//   const [name, setName] = useState('');
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [gstin, setGstin] = useState('');
//   const [photo, setPhoto] = useState(null); // State for storing the photo URI
//   const [image, setImage] = useState(null);

//   const pickImage = async () => {
//     // No permissions request is necessary for launching the image library
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     // console.log(result);

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     }
//   };
//   // Function to handle photo selection
//   const handlePhotoSelection = () => {
//     // Logic to select a photo from the device
//     // Update the 'photo' state with the selected photo URI
//   };

//   // Function to handle form submission
//   const handleSubmit = () => {
//     // Logic to handle form submission
//   };

//   return (
//     <>
//       <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
//         <View style={{ flex: 1, paddingTop: 50 }}>
//           {/* Header */}
//           <View style={{ backgroundColor: "grey", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 60, paddingHorizontal: 30 }}>
//             {/* Left Arrow */}
//             <TouchableOpacity onPress={navigateBack}>
//               <AntDesign name="arrowleft" size={24} color="black" />
//             </TouchableOpacity>
//             <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
//               <Image source={{ uri: "https://via.placeholder.com/150" }} style={{
//                 width: 80,
//                 height: 40,
//                 width: 40,
//                 borderRadius: 40,
//               }} />
//               {/* {image && <Image source={{ uri: image }} style={styles.image} onPress={pickImage}/>} */}
//             </View>
//             {/* Right Menu */}
//             <TouchableOpacity onPress={toggleMenu}>
//               <Feather name="menu" size={24} color="black" />
//             </TouchableOpacity>
//           </View>



//           {/* Menu Options */}
//           {menuVisible && (
//             <View style={{ position: 'absolute', top: 75, right: 20, backgroundColor: 'white', padding: 10, borderRadius: 5, elevation: 5, position: 'absolute', zIndex: 1 }}>
//               <TouchableOpacity onPress={navigateToSettings} style={{ marginBottom: 10 }}>
//                 <Text>Settings</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={navigateToHelp} style={{ marginBottom: 10 }}>
//                 <Text>Help</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={navigateToAbout} style={{ marginBottom: 10 }}>
//                 <Text>About</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={navigateToLegal}>
//                 <Text>Legal</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           <ScrollView horizontal style={{ gap: 20, paddingHorizontal: 0, marginTop: 0 }}>
//             <View style={styles.container}>
//               <View style={styles.box}>
//                 <Image
//                   source={{ uri: "https://via.placeholder.com/150" }} // Replace with your image source
//                   style={styles.image}
//                 />
//                 <View style={styles.content}>
//                   <Text >Driver</Text>
//                   <TouchableOpacity onPress={() => alert('Download icon pressed')} style={styles.downloadButton}>
//                     <Ionicons name="cloud-download-outline" size={30} color="black" />
//                   </TouchableOpacity>

//                 </View>
//                 <Text style={styles.belowText}>ETA | Destination</Text>

//               </View>
//             </View>
//             <View style={styles.container}>
//               <View style={styles.box}>
//                 <Image
//                   source={{ uri: "https://via.placeholder.com/150" }} // Replace with your image source
//                   style={styles.image}
//                 />
//                 <View style={styles.content}>
//                   <Text >Driver</Text>
//                   <TouchableOpacity onPress={() => alert('Download icon pressed')} style={styles.downloadButton}>
//                     <Ionicons name="cloud-download-outline" size={30} color="black" />
//                   </TouchableOpacity>

//                 </View>
//                 <Text style={styles.belowText}>ETA | Destination</Text>

//               </View>
//             </View>
//             <View style={styles.container}>
//               <View style={styles.box}>
//                 <Image
//                   source={{ uri: "https://via.placeholder.com/150" }} // Replace with your image source
//                   style={styles.image}
//                 />
//                 <View style={styles.content}>
//                   <Text >Driver</Text>
//                   <TouchableOpacity onPress={() => alert('Download icon pressed')} style={styles.downloadButton}>
//                     <Ionicons name="cloud-download-outline" size={30} color="black" />
//                   </TouchableOpacity>

//                 </View>
//                 <Text style={styles.belowText}>ETA | Destination</Text>

//               </View>
//             </View>
//           </ScrollView>

//           <View>
//             <Text style={{ fontSize: 25, paddingLeft: 130, paddingBottom: 20 }}>Past Trips</Text>
//           </View>
//           <View style={styles.boxTrips}>

//             <View style={styles.contentTrips}>
//               <Text style={{ fontSize: 20 }} >Driver</Text>
//               <Text >Date</Text>
//               <TouchableOpacity onPress={() => alert('Download icon pressed')} style={styles.downloadButton}>
//                 <Ionicons name="cloud-download-outline" size={30} color="black" />
//               </TouchableOpacity>

//             </View>
//             <Text style={{ fontWeight: 300, paddingLeft: 20 }}>Cargo Type</Text>

//           </View>

//           <View style={{
//             height: 2,
//             backgroundColor: 'grey',
//           }}></View>

//           <View style={styles.boxTrips}>

//             <View style={styles.contentTrips}>
//               <Text style={{ fontSize: 20 }} >Driver</Text>
//               <Text >Date</Text>
//               <TouchableOpacity onPress={() => alert('Download icon pressed')} style={styles.downloadButton}>
//                 <Ionicons name="cloud-download-outline" size={30} color="black" />
//               </TouchableOpacity>

//             </View>
//             <Text style={{ fontWeight: 300, paddingLeft: 20 }}>Cargo Type</Text>

//           </View>

//           <View style={{
//             height: 2,
//             backgroundColor: 'grey',
//           }}></View>

//           <View style={styles.boxTrips}>

//             <View style={styles.contentTrips}>
//               <Text style={{ fontSize: 20 }} >Driver</Text>
//               <Text >Date</Text>
//               <TouchableOpacity onPress={() => alert('Download icon pressed')} style={styles.downloadButton}>
//                 <Ionicons name="cloud-download-outline" size={30} color="black" />
//               </TouchableOpacity>

//             </View>
//             <Text style={{ fontWeight: 300, paddingLeft: 20 }}>Cargo Type</Text>

//           </View>

//           <View style={{
//             height: 2,
//             backgroundColor: 'grey', marginBottom: 60,
//           }}></View>

//           {/* Footer */}
//           <View style={{ backgroundColor: 'black', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 20 }}>
//             <TouchableOpacity>
//               <AntDesign name="home" size={24} color="white" />
//             </TouchableOpacity>
//             <TouchableOpacity style={{ backgroundColor: 'blue', borderRadius: 24, padding: 10 }}>
//               <Entypo name="shop" size={24} color="white" />
//             </TouchableOpacity>
//             <TouchableOpacity>
//               <AntDesign name="user" size={24} color="white" />
//             </TouchableOpacity>
//           </View>

//         </View>
//       </TouchableWithoutFeedback>



//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   box: {
//     marginRight: 15,
//     marginLeft: 15,
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     width: 300, // Adjust the width as needed
//   },
//   boxTrips: {
//     backgroundColor: 'white',
//     paddingLeft: 20,
//     paddingHorizontal: 40,
//     borderRadius: 10,
//     width: 500, // Adjust the width as needed
//   },
//   image: {
//     width: '100%',
//     height: 150, // Adjust the height as needed
//     resizeMode: 'cover',
//     borderRadius: 10,
//     // marginBottom: 10,
//   },
//   content: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   contentTrips: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: 350,
//   },
//   text: {
//     fontSize: 16,
//     // fontWeight: 'bold',
//   },
//   downloadButton: {
//     padding: 5
//   },
// });

// export default Trips;

