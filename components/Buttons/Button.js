import {LinearGradient} from 'expo-linear-gradient';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default ({title, style, onClick, colors}) => {
    return (
    <TouchableOpacity style={style} onPress={onClick}>
    <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#A9CBF4', '#06264D']} style={styles.linearGradient}>
        <Text style={styles.buttonText}>
        {title}
        </Text>
    </LinearGradient>
    </TouchableOpacity>
    );
}


// Later on in your styles..
var styles = StyleSheet.create({
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 20
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});