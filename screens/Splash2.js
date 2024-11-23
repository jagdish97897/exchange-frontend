import { StatusBar } from "expo-status-bar";
import React from "react";
import { Text, View, Image } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center bg-[#BED3ED] ">
      
        <Image
          className="mt-[50px] ml-[30px]"
          source={require("../assets/images/logo-removebg-preview 1.png")}
          style={{ width: 201, height: 181 }}
        />
      
      <View className="flex items-center mt-[80px]">
        <Text className="text-white text-2xl w-[118px] h-[41px] ">About Us</Text>
        <Text className="text-white w-[301px] h-[194px] mt-[30px]">
          Since 1956, Transport Wings (Cal) Pvt. Ltd. has been a market leader
          in logistics.Moving cargo across India within various states has its
          own unforeseen challenges.Over 66 years of intensive, accurate,
          efficient, innovative, and dedicated operations have earned TWI a
          prestigious reputation in the domestic inland transportation industry.
          Our extensive network covers not only over 100 locations spread all
          over India but also neighbouring countries like Nepal, Bangladesh, and
          Bhutan.
        </Text>
      </View>
      <View className="flex-1 flex-row mt-[50%]">
        <Text className="text-white">Made in</Text>
        <Image
          className=" ml-2"
          source={require("../assets/images/image 10.png")}
          style={{ width: 40, height: 22 }}
        />
      </View>
    </View>
  );
}
