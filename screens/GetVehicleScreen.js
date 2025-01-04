import React, { useState, useEffect } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Linking } from 'react-native';


import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native";

const GetVehicleScreen = ({ route, navigation }) => {
  const { ownerId } = route.params; // Pass `ownerId` via navigation params
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  // console.log("ownerId", ownerId)

  useEffect(() => {
    fetchVehiclesByOwnerId();
  }, []);

  const fetchVehiclesByOwnerId = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://192.168.1.4:8000/api/vehicles/owner/${ownerId}`
      );
      const result = await response.json();

      if (response.ok) {
        setVehicles(result.vehicles);
      } else {
        Alert.alert("Error", result.message || "Failed to fetch vehicles.");
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      Alert.alert("Error", "An error occurred while fetching the vehicle list.");
    } finally {
      setLoading(false);
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

  const renderVehicleItem = ({ item }) => (
    <View style={styles.vehicleCard}>
      <Text style={styles.vehicleText}>Vehicle Number: {item.vehicleNumber}</Text>
      <Text style={styles.vehicleText}>Height: {item.height} m</Text>
      <Text style={styles.vehicleText}>Width: {item.width} m</Text>
      <Text style={styles.vehicleText}>Length: {item.length} m</Text>

      {/* TDS Declaration */}
      <TouchableOpacity
        style={[styles.input, styles.uploadButton]}
        onPress={() => Linking.openURL(`${item.tdsDeclaration}`).catch((err) => console.error("Failed to open URL", err))}
      >
        <Text style={styles.uploadButtonText}>
          {item.tdsDeclaration ? 'Download TDS Declaration' : 'Upload TDS Declaration (PDF/DOC)'}
        </Text>
      </TouchableOpacity>

      {/* Owner Consent */}
      <TouchableOpacity
        style={[styles.input, styles.uploadButton]}
        onPress={() => Linking.openURL(`${item.ownerConsent}`).catch((err) => console.error("Failed to open URL", err))}
      >
        <Text style={styles.uploadButtonText}>
          {item.ownerConsent ? 'Download Owner Consent' : 'Upload Owner Consent (PDF/DOC)'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() =>
          navigation.navigate("UpdateVehicleScreen", {
            vehicleNumber: item.vehicleNumber,
          })
        }
      >
        <Text style={styles.detailsButtonText}>Update Vehicle Details</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#06264D" />
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient colors={['#06264D', "#FFF"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Image
          source={require("../assets/images/logo-removebg-preview 1.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Vehicle List</Text>
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item._id}
          renderItem={renderVehicleItem}
          contentContainerStyle={[
            styles.listContent,
            { flexGrow: 1, paddingBottom: 20 },
          ]}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No vehicles found for this owner.</Text>
          }
          ListFooterComponent={
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
          }
          keyboardShouldPersistTaps="handled"
        />
      </SafeAreaView>
    </LinearGradient>
  );


  // return (
  //   <LinearGradient colors={['#06264D', "#FFF"]} style={{ flex: 1 }}>
  //     <SafeAreaView style={styles.container}>
  //       <Image
  //         source={require("../assets/images/logo-removebg-preview 1.png")}
  //         style={styles.logo}
  //       />
  //       <Text style={styles.title}>Vehicle List</Text>
  //       <FlatList
  //         data={vehicles}
  //         keyExtractor={(item) => item._id}
  //         renderItem={renderVehicleItem}
  //         contentContainerStyle={[
  //           styles.listContent,
  //           { flexGrow: 1, paddingBottom: 20 },
  //         ]}
  //         ListEmptyComponent={
  //           <Text style={styles.emptyText}>No vehicles found for this owner.</Text>
  //         }

  //         ListFooterComponent={
  //           !keyboardVisible && (
  //             <View style={styles.footer}>
  //               <Image
  //                 source={require("../assets/images/mantra.jpg")}
  //                 style={styles.smallImage}
  //               />
  //               <View style={styles.footerTextContainer}>
  //                 <Text style={styles.footerText}>Made in</Text>
  //                 <Image
  //                   source={require("../assets/images/image 10.png")}
  //                   style={styles.smallImage}
  //                 />
  //               </View>
  //               <Image
  //                 source={require("../assets/images/make-in-India-logo.jpg")}
  //                 style={styles.smallImage}
  //               />
  //             </View>
  //           )
  //         }
  //         keyboardShouldPersistTaps="handled" // Allows taps to dismiss the keyboard
  //       />
  //     </SafeAreaView>
  //   </LinearGradient>
  // );

};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 0,

  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#06264D",
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  vehicleCard: {
    backgroundColor: "#F5F5F5",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  vehicleText: {
    fontSize: 13,
    color: "#333",
    marginBottom: 5,
  },
  detailsButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#06264D",
    borderRadius: 8,
    alignItems: "center",
  },
  detailsButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
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
  uploadButton: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center', // Vertically center items
    justifyContent: 'space-between', // Space out the text and the icon
    width: '100%', // Ensure it spans the full width
  },
  uploadButtonText: {
    color: '#06264D',
    fontWeight: 'bold',
  },
  uploadedImage: {
    width: 100, // Adjust as needed
    height: 100,
    marginVertical: 10,
    borderRadius: 5,
  },

});

export default GetVehicleScreen;
