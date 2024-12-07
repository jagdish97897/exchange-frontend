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
