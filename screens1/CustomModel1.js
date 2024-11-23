import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Share } from 'react-native';

const CustomModal1 = ({ modalVisible, setModalVisible, navigation, user }) => {
    const visitorId = user?.data?.userId;
    const referralCode = user?.data?.myReferralCode || 'DEFAULT_CODE';  // Get referral code from user data

    console.log('CustomModel1 user', user);
    const onShare = async () => {
        try {
            const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.tsilteam.KGVHybridSol'; 
            const shareUrl = `${playStoreUrl} & referralCode=${referralCode}`;
            const result = await Share.share({
                message: `Download this amazing app using my referral link: ${shareUrl}`,
            });
    
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Shared with activity type:', result.activityType);
                } else {
                    console.log('Share was successful');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('Share was dismissed');
            }
        } catch (error) {
            console.log('Error sharing:', error.message);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Menu</Text>

                    {/* Profile Section */}
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => {
                            setModalVisible(false);
                            navigation.navigate('Profile1', { userId: user?.data?.userId, user });
                        }}
                    >
                        <Text style={styles.modalButtonText}>Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => {
                            setModalVisible(false);
                            navigation.navigate('WalletScreen1', { user });
                        }}
                    >
                        <Text style={styles.modalButtonText}> Check Wallet</Text>
                    </TouchableOpacity>

                 
                    {/* View Cart Section */}
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => {
                            setModalVisible(false);
                            navigation.navigate('ViewCartItems1', { visitorId: user?.data?.userId, visitorName: user?.data?.fullName, user });
                        }}
                    >
                        <Text style={styles.modalButtonText}>View Cart</Text>
                    </TouchableOpacity>
        

                            {/* Share Section */}
                            <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => {
                            setModalVisible(false);
                            onShare(); // Call share function
                        }}
                    >
                        <Text style={styles.modalButtonText}>Share</Text>
                    </TouchableOpacity>


               

                    {/* Close Button */}
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.modalButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: 300,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalButton: {
        backgroundColor: '#545a2c',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default CustomModal1;
