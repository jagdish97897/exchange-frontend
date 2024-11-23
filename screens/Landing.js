import { SafeAreaView, Text, View, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";

export default ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Logo at the top */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/logo-removebg-preview 1.png")}
          style={styles.logo}
        />
      </View>

      {/* Buttons in the middle */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate("FlowSelect")}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#8cb8ed", "#4A90E2"]}
            style={styles.linearGradient}
          >
            <Text style={styles.buttonText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate("FlowSelectregistation")}
        >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#FF7F50", "#E74C3C"]}
            style={styles.linearGradient}
          >
            <Text style={styles.buttonText}>SignUp</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* "Made in India" fixed at the bottom */}
      <View style={styles.madeInContainer}>
        <Text style={styles.madeInText}>Made in</Text>
        <Image
          source={require("../assets/images/image 10.png")}
          style={styles.flag}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  logo: {
    width: 280,
    height: 220,
    resizeMode: "contain",
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginVertical: 10,
  },
  linearGradient: {
    borderRadius: 25,
    height: 50,
    width: 220,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  madeInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
  },
  madeInText: {
    fontSize: 16,
    color: "#4B5563",
    fontWeight: "500",
  },
  flag: {
    width: 40,
    height: 22,
    marginLeft: 8,
    resizeMode: "contain",
  },
});


// import { SafeAreaView, Text, View, Button, Image  } from "react-native";
// import {LinearGradient} from 'expo-linear-gradient';
// import { TouchableOpacity, StyleSheet } from 'react-native';
// import Logo from '../assets/images/logo.svg';
// import Ind from '../assets/images/ind.svg'
// // import Button from "../components/Buttons/Button";

// export default ({navigation}) => {
//     return (
//         <>
//             {/* <Logo /> */}
//             <Image
//           className="mt-[50px] ml-[110px]"
//           source={require("../assets/images/logo-removebg-preview 1.png")}
//           style={{ width: 201, height: 181 }}
//         />
//         <TouchableOpacity className="ml-[80px] my-8 mt-[60%]" onPress={() => navigation.navigate('FlowSelect')}>
//     <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#A9CBF4', '#06264D']} style={styles.linearGradient}>
//         <Text style={styles.buttonText}>
//         Login
//         </Text>
//     </LinearGradient>
//     </TouchableOpacity >
//     <TouchableOpacity className="ml-[80px]" onPress={() => navigation.navigate('FlowSelectregistation')}>
//     <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#A9CBF4', '#06264D']} style={styles.linearGradient}>
//         <Text style={styles.buttonText}>
//         SignUp
//         </Text>
//     </LinearGradient>
//     </TouchableOpacity>
           
//             <View className="flex-1 flex-row mt-[50%] ml-[35%]">
//         <Text className="">Made in</Text>
//         <Image
//           className=" ml-2"
//           source={require("../assets/images/image 10.png")}
//           style={{ width: 40, height: 22 }}
//         />
//       </View>
//         </>
//     )
// }


// var styles = StyleSheet.create({
//     linearGradient: {
//       paddingLeft: 15,
//       paddingRight: 15,
//       borderRadius: 20,
//       height: 38,
//       width:200
//     },
//     buttonText: {
//       fontSize: 18,
//       textAlign: 'center',
//       margin: 5,
//       color: '#ffffff',
//       backgroundColor: 'transparent',
//     },
//   });

// import React from 'react';
// import { SafeAreaView, Text, View, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import LottieView from 'lottie-react-native';

// // Get device screen width and height
// const { width, height } = Dimensions.get('window');

// export default ({ navigation }) => {
//     return (
//         <LinearGradient colors={['#06264D', '#FFF']} style={styles.gradientBackground}>
//             <SafeAreaView style={styles.container}>
//                 <View style={styles.contentContainer}>
//                     <Image
//                         source={require("../assets/images/kgv1.png")}
//                         style={styles.logo}
//                     />
//                     <LottieView
//                         source={require('../assets/images/animation1.json')}
//                         autoPlay
//                         loop
//                         style={styles.backgroundAnimation}
//                     />
//                     <View style={styles.welcomeContainer}>
//                         <Text style={styles.welcomeText}>Welcome to KGV</Text>
//                     </View>
//                     <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('Register')}>
//                         <LinearGradient
//                             start={{ x: 0, y: 0 }}
//                             end={{ x: 1, y: 0 }}
//                             colors={['#A9CBF4', '#06264D']}
//                             style={styles.button}
//                         >
//                             <Text style={styles.buttonText}>
//                                 Let's Explore
//                             </Text>
//                         </LinearGradient>
//                     </TouchableOpacity>
//                 </View>
//             </SafeAreaView>
//         </LinearGradient>
//     );
// }

// const styles = StyleSheet.create({
//     gradientBackground: {
//         flex: 1,
//     },
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: '100%',
//         height: '100%',
//     },
//     backgroundAnimation: {
//         position: 'absolute',
//         width: '140%',
//         height: height, // 50% of the screen height for animation
//         top: height * 0.1, // 10% from the top
//         zIndex: -1,
//     },
//     contentContainer: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: '100%',
//         height: '100%',
//         paddingHorizontal: width * 0.05, // 5% of the screen width for padding
//         zIndex: 1,
//     },
//     logo: {
//         width: width * 0.6, // 50% of the screen width
//         height: height * 0.30, // 25% of the screen height
//         marginBottom: height * 0.45, // 10% of screen height for spacing
//     },
//     welcomeContainer: {
//         marginBottom: height * 0.05, // 2% of the screen height for spacing
//     },
//     welcomeText: {
//         fontSize: width * 0.06, // 6% of screen width for text size
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     buttonContainer: {
//         marginTop: height * 0.01, // 2% of the screen height for spacing
//     },
//     button: {
//         paddingLeft: width * 0.04, // 4% of screen width for padding
//         paddingRight: width * 0.04,
//         borderRadius: 20,
//         height: height * 0.05, // 5% of the screen height for button height
//         width: width * 0.5, // 50% of the screen width for button width
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     buttonText: {
//         fontSize: width * 0.045, // 4.5% of the screen width for text size
//         textAlign: 'center',
//         color: 'white',
//         backgroundColor: 'transparent',
//     },
// });

