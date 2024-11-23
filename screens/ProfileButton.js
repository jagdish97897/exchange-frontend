import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

const ProfileButton = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.profileButton} onPress={onPress}>
            <Image source={require("../assets/images/kgv.png")} style={styles.img} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    profileButton: {
        position: 'absolute',
        top: 40,
        right: 10,
        padding: 10,
        backgroundColor: '#06264D',
        borderRadius: 50,
        zIndex: 1
    },
    img: {
        width: 30,
        height: 30,
        borderRadius: 10,
    },
});

export default ProfileButton;
