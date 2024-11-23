import {LinearGradient} from 'expo-linear-gradient';
import { SafeAreaView, Text, TextInput, StyleSheet, View, Button } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useState } from 'react';
// import Button from '../components/Buttons/Button';

export default ({navigation}) => {

    const [qoute, setQoute] = useState('')
    const [show, setShow] = useState(false)

    return (
        <LinearGradient colors={['#06264D', "#FFF"]} style={{flex: 1}}>
            <SafeAreaView style={{flex: 1, padding: 10}}>
            <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.container}
            scrollEnabled={true}
            enableAutomaticScroll={true}
            enableOnAndroid={true}
            >
                <View style={{width: '90%', backgroundColor: '#FFF', borderRadius: 14, padding: 15}}>
                    <Text style={{textAlign: 'center', fontSize: 20, fontWeight: '700'}}>Order Details</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 14}}>
                        <View>
                            <Text style={{fontSize: 15, fontWeight: '700'}}>From</Text>
                            <Text>New Delhi</Text>

                            <View style={{marginTop: 15}}>
                                <Text style={{fontSize: 15, fontWeight: '700'}}>Pickup Time</Text>
                                <Text>3 PM</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={{fontSize: 15, fontWeight: '700'}}>To</Text>
                            <Text>Jaipur</Text>

                            <View style={{marginTop: 15}}>
                                <Text style={{fontSize: 15, fontWeight: '700'}}>ETA</Text>
                                <Text>1 hour 25 min</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {!show && <TextInput placeholder='Qoute Price' style={styles.input} placeholderTextColor="#000" onChangeText={e => setQoute(e)} />}
                {show && <View style={{justifyContent: 'flex-end', marginTop: 20, width: '100%', flexDirection: 'row'}}>
                        <View style={styles.textBubble}><Text>{qoute} Rs</Text></View>
                    </View>}
            </KeyboardAwareScrollView>
            
            <Button title={qoute === '' ? "Qoute" : "Accept"} style={{marginTop: 20}} onPress={() => setShow(true)} />
           
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
