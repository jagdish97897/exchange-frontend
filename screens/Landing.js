import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const OnboardingScreen = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white justify-center items-center relative">

      <View className="absolute top-0 left-0 w-0 h-0 border-r-[2000px] border-r-transparent border-t-[460px] border-t-teal-800" />


      {/* Image Container */}
      <View className="mt-16 bg-white  rounded-full shadow-lg border-8 border-blue-900">
        <Image
          source={require("../assets/images/truckmain.png")}
          className="w-56 h-56"
          resizeMode="contain"
        />
      </View>

      {/* Content Container */}
      <View className="items-center justify-center px-6 mt-6">
        <Text className="text-gray-500 text-lg">Welcome to</Text>
        <Text className="text-blue-900 text-3xl font-bold">Exchange</Text>
        <Text className="text-gray-600 text-center mt-2 leading-5">
          Seamless and reliable transport, just a tap away! Move your goods with
          ease and confidence.
        </Text>

        {/* Get Started Button */}
        <TouchableOpacity
          className="bg-blue-700 w-full py-3 px-6 rounded-lg mt-6 shadow-md"
          onPress={() => navigation.navigate("LoginCons")}
        >
          <Text className="text-white text-lg font-semibold text-center">
            Get Started ➤
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;


// import { SafeAreaView, Text, View, Image, StyleSheet } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { TouchableOpacity } from "react-native";
// import { useNavigation } from '@react-navigation/native';


// export default () => {
//   const navigation = useNavigation();

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Logo at the top */}
//       <View style={styles.logoContainer}>
//         <Image
//           source={require("../assets/images/logo-removebg-preview 1.png")}
//           style={styles.logo}
//         />
//       </View>

//       {/* Buttons in the middle */}
//       <View style={styles.buttonsContainer}>
//         <TouchableOpacity
//           style={styles.buttonContainer}
//           onPress={() => navigation.navigate("FlowSelect")}
//         >
//           <LinearGradient
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             colors={["#8cb8ed", "#4A90E2"]}
//             style={styles.linearGradient}
//           >
//             <Text style={styles.buttonText}>Login</Text>
//           </LinearGradient>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.buttonContainer}
//           onPress={() => navigation.navigate("FlowSelectregistation")}
//         >
//           <LinearGradient
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             colors={["#FF7F50", "#E74C3C"]}
//             style={styles.linearGradient}
//           >
//             <Text style={styles.buttonText}>SignUp</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </View>

//       {/* "Made in India" fixed at the bottom */}
//       <View style={styles.madeInContainer}>
//         <Text style={styles.madeInText}>Made in</Text>
//         <Image
//           source={require("../assets/images/image 10.png")}
//           style={styles.flag}
//         />
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//   },
//   logoContainer: {
//     alignItems: "center",
//     marginTop: 60,
//   },
//   logo: {
//     width: 280,
//     height: 220,
//     resizeMode: "contain",
//   },
//   buttonsContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   buttonContainer: {
//     marginVertical: 10,
//   },
//   linearGradient: {
//     borderRadius: 25,
//     height: 50,
//     width: 220,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//   },
//   buttonText: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#FFFFFF",
//     textTransform: "uppercase",
//   },
//   madeInContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 60,
//   },
//   madeInText: {
//     fontSize: 16,
//     color: "#4B5563",
//     fontWeight: "500",
//   },
//   flag: {
//     width: 40,
//     height: 22,
//     marginLeft: 8,
//     resizeMode: "contain",
//   },
// });
