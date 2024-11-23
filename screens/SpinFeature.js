import React, { useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import WheelOfFortune from './WheelOfFortune';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';

const SpinFeature = ({ navigation, route }) => {
  const { userId } = route.params;
  const [isSpinCompleted, setIsSpinCompleted] = useState(false);
  const [user, setUser] = useState('');


  const rewards = ['25% off on installation (Rs 1250)', 'KGV T-shirt', 'KGV Cup', '50% off on installation (Rs 2500)', 'Keychain', 'KGV Pen'];
  const wheelRef = useRef(null);

  const onSpinComplete = (value) => {
    setIsSpinCompleted(true)
    alert(`You won ${value}!`);
    const updateUserReward = async () => {
      const user1 = await axios.patch(`http://192.168.1.5:8005/api/v1/visitor/spinTheWheel/${userId}`, { reward: value });
      setUser(user1.data);

    };
    updateUserReward();
  };

  const handleNavigate = () => {
    // Navigate to the success screen
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainNavigator1', params: { screen: 'Welcome1', params: { user: user } } }],
      })
    );
  }

  return (
    <View style={styles.container}>
      <WheelOfFortune
        options={{
          rewards: rewards,
          onRef: (ref) => (wheelRef.current = ref),
          knobSize: 50,
          borderWidth: 5,
          borderColor: '#FFF',
          innerRadius: 20,
          duration: 4000,
          backgroundColor: '#E94B3C',
          textAngle: 'horizontal',
        }}
        getWinner={onSpinComplete}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: isSpinCompleted ? 'gray' : '#06264D', }]}
        onPress={() => wheelRef.current._onPress()}
        disabled={isSpinCompleted}
      >
        <Text style={styles.buttonText}>Spin Now!</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: !isSpinCompleted ? 'gray' : '#06264D', }]}
        onPress={handleNavigate}
        disabled={!isSpinCompleted}
      >
        <Text style={styles.buttonText}>Go To Main Menu!</Text>
      </TouchableOpacity>
    </View>
  );
};

// Get the screen width for dynamic font size calculation
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#06264D', // Blue background
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  rewardText: {
    fontSize: width * 0.05, // Dynamic font size (5% of screen width)
    color: '#FFF',
  },
});

export default SpinFeature;
