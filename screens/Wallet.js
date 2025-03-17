import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { API_END_POINT } from '../app.config';
import Toast from 'react-native-toast-message';


const Wallet = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params || {};
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [totalCreditPoints, setTotalCreditPoints] = useState(0);
  const [totalDebitPoints, setTotalDebitPoints] = useState(0);
  const [walletCardNumber, setWalletCardNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // useEffect(() => {
  //   if (!userId) {
  //     navigation.replace('LoginCons');
  //   } else {
  //     checkAndCreateWallet();
  //   }
  // }, [userId]);

  useEffect(() => {
    if (userId) {
      checkAndCreateWallet();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'User ID is missing. Please provide a valid user ID.',
      });
    }
  }, [userId]);


  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      fetchWalletData();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  const checkAndCreateWallet = async () => {
    try {
      const response = await axios.get(`${API_END_POINT}/api/wallet/wallet/${userId}`);
      if (response.data?.wallet) {
        setWalletCardNumber(response.data.wallet.walletCardNumber);
        await fetchWalletData();
      } else {
        await createWallet();
      }
    } catch (error) {
      if (error.response?.status === 404) {
        await createWallet();
      } else {
        console.setLoading('Error checking wallet:', error);
        Alert.alert('Error', 'Failed to check wallet status.');
      }
    }
  };

  const createWallet = async () => {
    try {
      const response = await axios.post(`${API_END_POINT}/api/wallet/wallet/create`, { userId });
      if (response.status === 201) {
        Alert.alert('Success', 'Wallet created successfully.');
        await fetchWalletData();
      } else {
        Alert.alert('Error', 'Failed to create wallet.');
      }
    } catch (error) {
      console.log('Error creating wallet:', error);
      Alert.alert('Error', 'Failed to create wallet.');
    }
  };

  // const fetchWalletData = async () => {
  //   try {
  //     setLoading(true);
  //     await Promise.all([fetchWalletBalance(), fetchTransactions()]);
  //   } catch (error) {
  //     console.log('Error fetching wallet data:', error);
  //     Alert.alert('Error', 'Failed to fetch wallet data.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const fetchWalletData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchWalletBalance(), fetchTransactions()]);
    } catch (error) {
      console.log('Error fetching wallet data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch wallet data.',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletBalance = async () => {
    try {
      const response = await axios.get(`${API_END_POINT}/api/wallet/wallet/${userId}/balance`);
      setBalance(response.data.balance || 0);
    } catch (error) {
      console.log('Error fetching balance:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch wallet balance.',
      });
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${API_END_POINT}/api/wallet/wallet/${userId}/transactions`);
      const transactionsData = response.data.transactions || [];
      setTransactions(transactionsData);

      const creditPoints = transactionsData
        .filter((item) => item.type === 'credit')
        .reduce((sum, item) => sum + item.amount, 0);

      const debitPoints = transactionsData
        .filter((item) => item.type === 'debit')
        .reduce((sum, item) => sum + item.amount, 0);

      setTotalCreditPoints(creditPoints);
      setTotalDebitPoints(debitPoints);
    } catch (error) {
      console.log('Error fetching transactions:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch transaction history.',
      });
    }
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionDate}>{item.type}</Text>
      <Text style={styles.transactionDescription}>{item.description}</Text>
      <Text style={[styles.transactionAmount, { color: item.amount > 0 ? 'green' : 'red' }]}>
        {item.amount > 0 ? `+₹${item.amount}` : `-₹${Math.abs(item.amount)}`}
      </Text>
    </View>
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWalletData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#06264D', '#0C3D72']} style={styles.gradientBackground}>
      <View style={styles.container}>

        <View style={styles.walletCard}>
          <View style={styles.chipContainer}>
            <Text style={styles.chipIcon}>💳</Text>
          </View>
          <Text style={styles.cardNumber}>{walletCardNumber}</Text>
          <View style={styles.cardDetails}>
            <View>
              <Text style={styles.cardHolderLabel}>Card Holder</Text>
              <Text style={styles.cardHolderName}>John Doe</Text>
            </View>
            <Text style={styles.cardBrand}>VISA</Text>
          </View>
        </View>


        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>Available Wallet Amount</Text>
          <Text style={styles.balanceAmount}>{balance}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddWalletAmount', { userId })}
          >
            <Ionicons name="cash-outline" size={28} color="#FFF" />
            <Text style={styles.actionButtonText}>Add Money</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('WithdrawWalletAmount', { userId })}
          // onPress={() => navigation.navigate('WithdrawAmount', { userId })}
          >
            <Ionicons name="send-outline" size={28} color="#FFF" />
            <Text style={styles.actionButtonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <Text style={styles.historyTitle}>Transaction History</Text>
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item, index) => item._id?.toString() || index.toString()}
          contentContainerStyle={styles.transactionList}
          ListEmptyComponent={<Text>No transactions available.</Text>}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        // keyExtractor={(item) => item._id}
        // contentContainerStyle={styles.transactionList}
        // ListEmptyComponent={<Text style={styles.emptyText}>No transactions yet.</Text>}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: { flex: 1 },
  container: { flex: 1, padding: 20 },
  balanceContainer: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  balanceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6c757d', // Grey color for description
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#28a745', // Green for available amount
    marginBottom: 10,
  },

  actionContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  actionButton: { alignItems: 'center' },
  historyTitle: { fontSize: 18, fontWeight: 'bold', color: '#06264D', marginVertical: 10 },
  transactionList: { paddingBottom: 20 },
  transactionItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  transactionDetails: { marginLeft: 10 },
  date: { fontSize: 14, color: '#555' },
  amount: { fontSize: 16, fontWeight: 'bold' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  walletCard: {
    backgroundColor: '#1A1A2E', // Dark background
    borderRadius: 15,
    padding: 20,
    width: '90%',
    alignSelf: 'center',
    marginVertical: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  chipContainer: {
    height: 30,
    width: 40,
    backgroundColor: '#F4C542', // Gold chip color
    borderRadius: 5,
    marginBottom: 20,
  },
  chipIcon: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 30,
    color: '#fff',
  },
  cardNumber: {
    fontSize: 20,
    letterSpacing: 4,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHolderLabel: {
    fontSize: 12,
    color: '#BDBDBD',
    marginBottom: 5,
  },
  cardHolderName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardBrand: {
    fontSize: 18,
    color: '#F4C542',
    fontWeight: 'bold',
  }

});

export default Wallet;
