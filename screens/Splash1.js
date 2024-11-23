import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View, Image } from 'react-native';


export default function App() {
  return (
   <View className="flex-1 items-center">
   <View>
   <Image className="mt-60 ml-8" source={require('../assets/images/logo-removebg-preview 1.png')} style={{ width: 201, height: 181, zIndex:3,  }} />
   <Image className="mt-60" source={require('../assets/images/Frame 3.png')} style={{ width: 227, height: 159, zIndex:1, position:'absolute' }} />
   </View>
   <View className="flex-1 flex-row mt-60">
    <Text className="">Made in</Text>
   <Image className=" ml-2" source={require('../assets/images/image 10.png')} style={{ width: 40, height: 22 }} />
   </View>
    </View>
  );
}