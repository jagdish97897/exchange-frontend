import {LinearGradient} from 'expo-linear-gradient';
import { SafeAreaView, Text, TextInput, StyleSheet, View, Button, Image, TouchableOpacity, Modal } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useState } from 'react';
import { AntDesign, Feather, Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
// import Button from '../components/Buttons/Button';

export default ({navigation}) => {

    const [qoute, setQoute] = useState('')
    const [show, setShow] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    navigation.navigate('tripStatus')
  };
    return (
        <TouchableOpacity onPress={openModal}>
        <View className="my-8 mx-5">
                    <Text className="" style={{textAlign: 'center', fontSize: 25, fontWeight: '700', marginTop: 40}}>Booking Confirmation</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 60}}>
                        <View>
                            <Text style={{fontSize: 15, fontWeight: '700'}}>From</Text>
                            <Text>New Delhi</Text>

                            <View style={{marginTop: 15}}>
                                <Text style={{fontSize: 15, fontWeight: '700'}}>Pickup Time</Text>
                                <Text>3 PM</Text>
                            </View>
                        </View>
                        <AntDesign name="swap" size={24} color="black" />
                        <View>
                            <Text style={{fontSize: 15, fontWeight: '700'}}>To</Text>
                            <Text>Jaipur</Text>

                            <View style={{marginTop: 15}}>
                                <Text style={{fontSize: 15, fontWeight: '700'}}>ETA</Text>
                                <Text>1 hour 25 min</Text>
                            </View>
                        </View>
                    </View>

                    <View className="mt-6">
        <Image className="h-[200px] w-[100%]" source={{ uri: "https://via.placeholder.com/150" }} />
        </View>

        <Text className="" style={{textAlign: 'center', fontSize: 20, fontWeight: '500', marginTop: 40}}>Package Details</Text>
         
         <View className="flex-row space-x-11 pl-11 py-5 ">
            <Text className="font-light text-base">Payload Dimensions</Text>
         </View>
         <View className="flex-row space-x-11 pl-11 py-5">
            <Text className="font-light text-base">Payload Weight</Text>
            <Text className="font-light text-base">Type</Text>
         </View>
         <View className="flex-row space-x-11 pl-11 py-5">
            <Text className="font-light text-base">Payload Cost</Text>
            <Text className="font-light text-base">Payload Vechile</Text>
         </View>
                </View>

                <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View className="" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View className="h-[300px] flex-column" style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' }}>
          <View  className="ml-[250px]"><AntDesign name="close" size={24} color="black" onPress={closeModal}  /></View>
            <Text className="text-2xl ml-[80px]">Congrats</Text>
            <Text className=" mt-[40px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor .</Text>
            
          </View>
        </View>
      </Modal>
                <View style={{ backgroundColor: 'black', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 20 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <AntDesign name="home" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: 'blue', borderRadius: 24, padding: 10 }}>
            <Entypo name="shop" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <AntDesign name="user" size={24} color="white" />
          </TouchableOpacity>
        </View>

                </TouchableOpacity>
        
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
        width: '100%',
        marginTop: 10
    },
    textBubble: {
        borderRadius: 10,
        backgroundColor: '#A9CBF4',
        paddingVertical: 12,
        paddingHorizontal: 25,
    }
})
