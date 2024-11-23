import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  View,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { CheckBox } from 'react-native-elements';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Logo from "../assets/images/logo.svg";
import Ind from "../assets/images/ind.svg";
import { AntDesign } from "@expo/vector-icons";

// import Button from '../components/Buttons/Button';

export default ({ navigation }) => {
  
       
        const [isChecked, setIsChecked] = useState(false);
      
        const handleCheckBox = () => {
          setIsChecked(!isChecked);
        };
      
        const handleNextPage = () => {
          if (isChecked) {
            // Navigate to the next page
            navigation.navigate('Home');
          } else {
            // Do nothing, stay on the same page
          }
        };
  return (
    <LinearGradient colors={["#06264D", "#FFF"]} style={{ flex: 1 }}>
      <View className="mt-[50px] ml-[20px] ">
        <AntDesign name="arrowleft" size={44} color="black" />
        <Text className="text-3xl ml-[40px]">Terms & Conditions</Text>
      </View>
      <View className=" m-5 border-black border-2">
        <Text classname="m-7">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          eget turpis a nibh lacinia suscipit nec nec purus. Mauris fringilla
          ultrices libero non placerat. Interdum et malesuada fames ac ante
          ipsum primis in faucibus. Vestibulum aliquet eget turpis et placerat.
          Sed feugiat turpis vitae accumsan facilisis. Mauris faucibus, nisl ut
          volutpat interdum, justo dolor condimentum magna, a luctus lorem lorem
          eget elit. In consequat nisl quis ex sagittis, sit amet faucibus arcu
          vestibulum. Aliquam porttitor ex id nisl venenatis eleifend. Phasellus
          lobortis ullamcorper justo. Nunc suscipit dui eu ultrices viverra.
          Praesent sodales commodo diam sit amet maximus. Maecenas eget ipsum
          lectus. Phasellus lobortis nisi non scelerisque aliquam. Morbi aliquam
          porta tempus. Suspendisse suscipit arcu a ex iaculis pellentesque.
          Class aptent taciti sociosqu ad litora torquent per conubia nostra,
          per inceptos himenaeos. Vestibulum ac mauris dictum, posuere nulla at,
          finibus neque. Sed posuere gravida risus, eu luctus orci dignissim ac.
          Donec aliquam velit nunc, eu interdum tortor tempor vel. Sed pulvinar
          viverra orci, nec lacinia lacus tincidunt a. Donec vulputate sem nec
          tortor posuere, eu ullamcorper eros venenatis. Aliquam eget sapien
          gravida, suscipit nulla id, pellentesque sem. Nam sollicitudin sodales
          risus non rhoncus. Morbi id sagittis mi, sed tincidunt lorem. Integer
          convallis arcu ornare justo posuere, et condimentum sem mattis. Sed
          ullamcorper quam justo, ac luctus purus porta ut. Praesent et feugiat
          erat. Fusce semper luctus leo, vel tincidunt enim fermentum quis.
          Integer sed diam vel dolor molestie egestas vel sed nunc. Ut non
          auctor lectus, sit amet placerat tortor. Nam vitae massa congue,
          rutrum turpis eu, posuere felis. Morbi dignissim odio in fringilla
        </Text>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <CheckBox
        title='Check this box to proceed'
        checked={isChecked}
        onPress={handleCheckBox}
      />
      <TouchableOpacity onPress={()=>{navigation.navigate('ConfirmationUi')}} disabled={!isChecked}>
        <Text style={{ marginTop: 2, color: isChecked ? 'blue' : 'gray' }}>
          Proceed to Next Page
        </Text>
      </TouchableOpacity>
    </View>
      
    </LinearGradient>
  );
};

const styles = new StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
    borderStyle: "solid",
    padding: 10,
    width: "100%",
    marginTop: 10,
  },
});
