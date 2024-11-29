import React, { useState, useEffect } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
  console.log("ownerId",ownerId)

  useEffect(() => {
    fetchVehiclesByOwnerId();
  }, []);

  const fetchVehiclesByOwnerId = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://192.168.1.2:8000/api/vehicles/owner/${ownerId}`
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
      <Text style={styles.vehicleText}>Tds Declaration: {item.tdsDeclaration}</Text>
      <Text style={styles.vehicleText}>Owner Consent: {item.ownerConsent}</Text>
      
      {item.broker && <Text style={styles.vehicleText}>Broker ID: {item.broker}</Text>}
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => navigation.navigate("UpdateVehicleScreen", { vehicleNumber: item.vehicleNumber })}
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
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
        <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.container}
            scrollEnabled={true}
            enableAutomaticScroll={true}
            enableOnAndroid={true}
            extraScrollHeight={100}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
        >
            <Image
                source={require("../assets/images/logo-removebg-preview 1.png")}
                style={styles.logo}
            />
      <Text style={styles.title}>Vehicle List</Text>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item._id}
        renderItem={renderVehicleItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No vehicles found for this owner.</Text>
        }
      />
    </KeyboardAwareScrollView>
                {!keyboardVisible && (
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
                )}
            </SafeAreaView>
        </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
},
logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
},
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#06264D",
    marginBottom: 20,
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
    fontSize: 16,
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
});

export default GetVehicleScreen;
