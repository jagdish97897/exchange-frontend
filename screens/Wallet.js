import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { API_END_POINT } from '../app.config';

const Wallet = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params || {};
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      checkAndCreateWallet();
    } else {
      Alert.alert('Error', 'User ID is undefined.');
    }
  }, [userId]);

  const checkAndCreateWallet = async () => {
    try {
      const response = await axios.get(`${API_END_POINT}/api/wallet/wallet/${userId}`);
      if (response.data?.wallet) {
        await fetchWalletData();
      } else {
        await createWallet();
      }
    } catch (error) {
      if (error.response?.status === 404) {
        await createWallet();
      } else {
        console.error('Error checking wallet:', error);
        Alert.alert('Error', 'Failed to check wallet status.');
      }
    }
  };

  const createWallet = async () => {
    try {
      const response = await axios.post(`${API_END_POINT}/api/wallet/wallet/create`, { userId });
      if (response.status === 201) {
        await fetchWalletData();
      } else {
        Alert.alert('Error', 'Failed to create wallet.');
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
      Alert.alert('Error', 'Failed to create wallet.');
    }
  };

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchWalletBalance(), fetchTransactions()]);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      Alert.alert('Error', 'Failed to fetch wallet data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const response = await axios.get(`${API_END_POINT}/api/wallet/wallet/${userId}/balance`);
      setBalance(response.data.balance || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
      Alert.alert('Error', 'Failed to fetch wallet balance.');
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_END_POINT}/api/wallet/wallet/${userId}/transactions`);
      const transactionsData = response.data.transactions || [];
      setTransactions(transactionsData);

      const points = transactionsData
        .filter(item => item.type === 'credit')
        .reduce((sum, item) => sum + item.amount, 0);
      setTotalPoints(points);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      Alert.alert('Error', 'Failed to fetch transaction history.');
    }
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Ionicons
        name={item.type === 'credit' ? 'arrow-down-circle' : 'arrow-up-circle'}
        size={24}
        color={item.type === 'credit' ? 'green' : 'red'}
      />
      <View style={styles.transactionDetails}>
        <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
        <Text style={styles.amount}>
          {item.type === 'credit' ? `+ Points ${item.amount}` : `- Points ${item.amount}`}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#06264D', '#FFF']} style={styles.gradientBackground}>
      <View style={styles.container}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Available Wallet Amount</Text>
          <Text style={styles.balanceAmount}>{totalPoints}</Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddWalletAmount', { userId })}
         
          >
            <Ionicons name="cash-outline" size={32} color="red" />
            <Text>Add Money</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddWalletAmount', { userId })}
          >
            <Ionicons name="send-outline" size={32} color="red" />
            <Text>Withdraw</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.historyTitle}>TRANSACTION HISTORY</Text>
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.transactionList}
          ListEmptyComponent={<Text>No transactions available.</Text>}
        />
      </View>
    </LinearGradient>
  );
};



const styles = StyleSheet.create({
  gradientBackground: { flex: 1 },
  container: { flex: 1, padding: 20 },
  balanceContainer: { alignItems: 'center', marginVertical: 20 },
  balanceText: { fontSize: 18, color: '#06264D' },
  balanceAmount: { fontSize: 24, fontWeight: 'bold', color: '#06264D' },
  actionContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  actionButton: { alignItems: 'center' },
  historyTitle: { fontSize: 18, fontWeight: 'bold', color: '#06264D', marginVertical: 10 },
  transactionList: { paddingBottom: 20 },
  transactionItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  transactionDetails: { marginLeft: 10 },
  date: { fontSize: 14, color: '#555' },
  amount: { fontSize: 16, fontWeight: 'bold' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default Wallet;