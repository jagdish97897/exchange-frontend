import {LinearGradient} from 'expo-linear-gradient';
import { SafeAreaView, Text, TextInput, StyleSheet, View, Button, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView,Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Logo from '../assets/images/logo.svg';
import Ind from '../assets/images/ind.svg';
import { AntDesign } from '@expo/vector-icons';

// import Button from '../components/Buttons/Button';

export default ({navigation}) => {
    return (
        <LinearGradient colors={['#06264D', "#FFF"]} style={{flex: 1}}>
            <View className="mt-[50px] ml-[20px] flex-row">       
            <AntDesign name="arrowleft" size={44} color="black" onPress={() => navigation.navigate('HomePreKyc')}/>
            <Text className="text-3xl ml-[40px]">KYC Verification</Text>
            </View> 
            <SafeAreaView style={{flex: 1, padding: 10}}>
            <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} 
      >
         <ScrollView contentContainerStyle={styles.container}>
      <Image source={require("../assets/images/logo-removebg-preview 1.png")} style={styles.logo} />
      <TextInput placeholder='Business Name' style={styles.input} placeholderTextColor="#000" />
      <TextInput placeholder='Email Id' style={styles.input} placeholderTextColor="#000" />
      <TextInput placeholder='Telephone number' style={styles.input} placeholderTextColor="#000" />
      <TextInput placeholder='Permissible Item' style={styles.input} placeholderTextColor="#000" />
      <TextInput placeholder='Website' style={styles.input} placeholderTextColor="#000" />
    </ScrollView>
    
      </KeyboardAvoidingView>
            
            <TouchableOpacity onPress={() => navigation.navigate('Kyc1')}>
            <View className="flex-row" >
                <Text className="ml-[250px] mr-[10px] text-xl ">Next</Text>
                <AntDesign className="ml-[280px]" name="right" size={27} color="black" />
            </View>
            </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        borderStyle: 'solid',
        padding: 10,
        width: '80%',
        marginTop: 10
    },
    logo: {
        width: 201,
        height: 181,
        alignSelf: 'center'
    },
})
