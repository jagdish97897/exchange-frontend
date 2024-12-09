import React, { useState }  from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView,TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo for icons
import { AntDesign, Feather, Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';


const Trips = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  const handleDocumentsClick = () => {
    // Navigate to the Documents page
    navigation.navigate('Documents');
  };

  const handleAccountTypeClick = () => {
    // Navigate to the Account Type page
    navigation.navigate('AccountType');
  };

  const handleDeleteAccountClick = () => {
    // Navigate to the Delete Account page
    navigation.navigate('DeleteAccount');
  };

  const handleLogoutClick = () => {
    // Navigate to the Logout page
    navigation.navigate('Logout');
  };

  const navigateBack = () => {
    // Add navigation logic to go back to the previous page
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const navigateToSettings = () => {
    // Add navigation logic to go to settings page
  };

  const navigateToHelp = () => {
    // Add navigation logic to go to help page
  };

  const navigateToAbout = () => {
    // Add navigation logic to go to about page
  };

  const navigateToLegal = () => {
    // Add navigation logic to go to legal page
  };

  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [gstin, setGstin] = useState('');
  const [photo, setPhoto] = useState(null); // State for storing the photo URI
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  // Function to handle photo selection
  const handlePhotoSelection = () => {
    // Logic to select a photo from the device
    // Update the 'photo' state with the selected photo URI
  };

  // Function to handle form submission
  const handleSubmit = () => {
    // Logic to handle form submission
  };
  return (
    <>
   <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
      <View style={{ flex: 1, paddingTop: 50 }}>
        {/* Header */}
        <View style={{ backgroundColor:"grey", flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height:60,  paddingHorizontal: 30 }}>
          {/* Left Arrow */}
          <TouchableOpacity onPress={navigateBack}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
          <Image source={{ uri: "https://via.placeholder.com/150" }} style={{width: 80,
    height: 40,
    width:40,
    borderRadius: 40,
    }} />
      {/* {image && <Image source={{ uri: image }} style={styles.image} onPress={pickImage}/>} */}
      </View>
          {/* Right Menu */}
          <TouchableOpacity onPress={toggleMenu}>
            <Feather name="menu" size={24} color="black" />
          </TouchableOpacity>
        </View>

        

        {/* Menu Options */}
        {menuVisible && (
          <View style={{ position: 'absolute', top: 75, right: 20, backgroundColor: 'white', padding: 10, borderRadius: 5, elevation: 5, position:'absolute', zIndex:1 }}>
            <TouchableOpacity onPress={navigateToSettings} style={{ marginBottom: 10 }}>
              <Text>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToHelp} style={{ marginBottom: 10 }}>
              <Text>Help</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToAbout} style={{ marginBottom: 10 }}>
              <Text>About</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigateToLegal}>
              <Text>Legal</Text>
            </TouchableOpacity>
          </View>
        )}

<ScrollView horizontal style = {{gap:20, paddingHorizontal:0, marginTop:0}}>
    <View style={styles.container}>
      <View style={styles.box}>
        <Image
          source={{ uri: "https://via.placeholder.com/150" }} // Replace with your image source
          style={styles.image}
        />
        <View style={styles.content}>
          <Text >Driver</Text>
          <TouchableOpacity onPress={() => alert('Download icon pressed')} style={styles.downloadButton}>
            <Ionicons name="cloud-download-outline" size={30} color="black" />
          </TouchableOpacity>
          
        </View>
        <Text style={styles.belowText}>ETA | Destination</Text>

      </View>
    </View>
    <View style={styles.container}>
      <View style={styles.box}>
        <Image
          source={{ uri: "https://via.placeholder.com/150" }} // Replace with your image source
          style={styles.image}
        />
        <View style={styles.content}>
          <Text >Driver</Text>
          <TouchableOpacity onPress={() => alert('Download icon pressed')} style={styles.downloadButton}>
            <Ionicons name="cloud-download-outline" size={30} color="black" />
          </TouchableOpacity>
          
        </View>
        <Text style={styles.belowText}>ETA | Destination</Text>

      </View>
    </View>
    <View style={styles.container}>
      <View style={styles.box}>
        <Image
          source={{ uri: "https://via.placeholder.com/150" }} // Replace with your image source
          style={styles.image}
        />
        <View style={styles.content}>
          <Text >Driver</Text>
          <TouchableOpacity onPress={() => alert('Download icon pressed')} style={styles.downloadButton}>
            <Ionicons name="cloud-download-outline" size={30} color="black" />
          </TouchableOpacity>
          
        </View>
        <Text style={styles.belowText}>ETA | Destination</Text>

      </View>
    </View>
    </ScrollView>

    <View>
      <Text style={{fontSize:25, paddingLeft:130, paddingBottom:20}}>Past Trips</Text>
    </View>
    <View style={styles.boxTrips}>
        
        <View style={styles.contentTrips}>
          <Text style={{fontSize:20}} >Driver</Text>
          <Text >Date</Text>
          <TouchableOpacity onPress={() => alert('Download icon pressed')} style={styles.downloadButton}>
            <Ionicons name="cloud-download-outline" size={30} color="black" />
          </TouchableOpacity>
          
        </View>
        <Text style={{fontWeight:300, paddingLeft:20}}>Cargo Type</Text>

      </View>

    <View style={{height: 2,
    backgroundColor: 'grey',
    }}></View>

<View style={styles.boxTrips}>
        
        <View style={styles.contentTrips}>
          <Text style={{fontSize:20}} >Driver</Text>
          <Text >Date</Text>
          <TouchableOpacity onPress={() => alert('Download icon pressed')} style={styles.downloadButton}>
            <Ionicons name="cloud-download-outline" size={30} color="black" />
          </TouchableOpacity>
          
        </View>
        <Text style={{fontWeight:300, paddingLeft:20}}>Cargo Type</Text>

      </View>

    <View style={{height: 2,
    backgroundColor: 'grey',
    }}></View>

<View style={styles.boxTrips}>
        
        <View style={styles.contentTrips}>
          <Text style={{fontSize:20}} >Driver</Text>
          <Text >Date</Text>
          <TouchableOpacity onPress={() => alert('Download icon pressed')} style={styles.downloadButton}>
            <Ionicons name="cloud-download-outline" size={30} color="black" />
          </TouchableOpacity>
          
        </View>
        <Text style={{fontWeight:300, paddingLeft:20}}>Cargo Type</Text>

      </View>

    <View style={{height: 2,
    backgroundColor: 'grey', marginBottom:60,
    }}></View>

        {/* Footer */}
        <View style={{ backgroundColor: 'black', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 20 }}>
          <TouchableOpacity>
            <AntDesign name="home" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: 'blue', borderRadius: 24, padding: 10 }}>
            <Entypo name="shop" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <AntDesign name="user" size={24} color="white" />
          </TouchableOpacity>
        </View>

      </View>
      </TouchableWithoutFeedback>


   
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    marginRight: 15,
    marginLeft: 15,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 300, // Adjust the width as needed
  },
  boxTrips: {
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingHorizontal:40,
    borderRadius: 10,
    width: 500, // Adjust the width as needed
  },
  image: {
    width: '100%',
    height: 150, // Adjust the height as needed
    resizeMode: 'cover',
    borderRadius: 10,
    // marginBottom: 10,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentTrips: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 350,
  },
  text: {
    fontSize: 16,
    // fontWeight: 'bold',
  },
  downloadButton: {
    padding: 5
  },
});

export default Trips;

