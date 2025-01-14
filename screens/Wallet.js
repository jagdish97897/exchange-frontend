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
      const response = await axios.get(`http://192.168.1.9:8000/api/wallet/wallet/${userId}`);
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
      const response = await axios.post('http://192.168.1.9:8000/api/wallet/wallet/create', { userId });
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
      const response = await axios.get(`http://192.168.1.9:8000/api/wallet/wallet/${userId}/balance`);
      setBalance(response.data.balance || 0);
    } catch (error) {
      console.error('Error fetching balance:', error);
      Alert.alert('Error', 'Failed to fetch wallet balance.');
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`http://192.168.1.9:8000/api/wallet/wallet/${userId}/transactions`);
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





// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import axios from 'axios';

// import { useRoute } from "@react-navigation/native";
  
// const Wallet = () => {
//   const route = useRoute();
//   const { userId } = route.params; 
//   console.log(userId);
//   const [balance, setBalance] = useState(0);
//   const [amount, setAmount] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [transactions, setTransactions] = useState([]);
//   const [totalPoints, setTotalPoints] = useState(0);
//   const [converted, setConverted] = useState(false);


//   useEffect(() => {
//     if (userId) {
//       checkAndCreateWallet();
//     } else {
//       console.log('User ID is undefined');
//     }
//   }, [userId]);

//   const checkAndCreateWallet = async () => {
//     try {
//       const response = await axios.get(walletApiUrl);
//       if (response.data?.balance !== undefined) {
//         fetchWalletBalance();
//         fetchTransactions();
//       } else {
//         await createWallet();
//       }
//     } catch (error) {
//       if (error.response?.status === 404) {
//         await createWallet();
//       } else {
//         console.log('Error checking wallet:', error);
//         Alert.alert('Error', 'Failed to check wallet status.');
//       }
//     }
//   };

//   const createWallet = async () => {
//     try {
//       await axios.get('http://192.168.1.9:8000/api/wallet/createwallet', { userId });
//       Alert.alert('Wallet Created', 'Your wallet has been successfully created.');
//       fetchWalletBalance();
//       fetchTransactions();
//     } catch (error) {
//       console.log('Error creating wallet:', error);
//       Alert.alert('Error', 'Failed to create wallet.');
//     }
//   };

//   // Fetch wallet balance
//   const fetchWalletBalance = async () => {
//     try {
//       const response = await axios.get(walletApiUrl);
//       setBalance(response.data.balance);
//     } catch (error) {
//       console.log('Error fetching balance:', error);
//     }
//   };

//   // Fetch transactions
//   const fetchTransactions = async () => {
//     try {
//       const response = await axios.get('http://192.168.1.9:8000/api/wallet/wallet/transaction', { userId });
//       setTransactions(response.data.transactions);
//       const points = response.data.transactions
//         .filter(item => item.type === 'credit')
//         .reduce((sum, item) => sum + item.amount, 0);
//       setTotalPoints(points);
//     } catch (error) {
//       console.log('Error fetching transactions:', error);
//     }
//   };



//   // Render a single transaction
//   const renderTransaction = ({ item }) => (
//     <View style={styles.transactionItem}>
//       <Ionicons
//         name={item.type === 'credit' ? 'arrow-down-circle' : 'arrow-up-circle'}
//         size={24}
//         color={item.type === 'credit' ? 'green' : 'red'}
//       />
//       <View style={styles.transactionDetails}>
//         <Text style={styles.name}>{item.name}</Text>
//         <Text style={styles.date}>{item.date}</Text>
//       </View>
//       <Text style={[styles.amount, { color: item.type === 'credit' ? 'green' : 'red' }]}>
//         {item.type === 'credit' ? `+ Points.${item.amount}` : `- Points.${item.amount}`}
//       </Text>
//     </View>
//   );

//   return (
//     <LinearGradient colors={['#06264D', '#FFF']} style={styles.gradientBackground}>
//       <View style={styles.container}>
//         {/* Wallet Balance Section */}
//         <View style={styles.balanceContainer}>
//           <Text style={styles.balanceText}>Available Wallet Amount</Text>
//           <Text style={styles.balanceAmount}>{totalPoints}</Text>
//         </View>



//         {/* Conversion and Purchase Kit Buttons */}
//         <View style={styles.actionContainer}>

//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => navigation.navigate('AddWalletAmount', { userId })}
//             disabled={true}
//           >
//             <Ionicons name="cash-outline" size={32} color="red" />
//             <Text>Add Money</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => navigation.navigate('withdrawal', { userId })}
//             disabled={true}
//           >
//             <Ionicons name="send-outline" size={32} color="red" />
//             <Text>withdrawal</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Transaction History */}
//         <Text style={styles.historyTitle}>TRANSACTION HISTORY</Text>
//         <FlatList
//           data={transactions}
//           renderItem={renderTransaction}
//           keyExtractor={item => item.id}
//           contentContainerStyle={styles.transactionList}
//         />
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   gradientBackground: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 40,
//   },
//   balanceContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   balanceText: {
//     fontSize: 16,
//     color: '#FFF',
//   },
//   balanceAmount: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     color: '#FFD700',
//   },
//   actionContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginVertical: 20,
//   },
//   actionButton: {
//     alignItems: 'center',
//   },
//   historyTitle: {
//     fontSize: 18,
//     marginVertical: 10,
//     color: '#000',
//     fontWeight: 'bold',
//   },
//   transactionItem: {
//     flexDirection: 'row',
//     padding: 15,
//     marginVertical: 5,
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     elevation: 2,
//   },
//   transactionDetails: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   date: {
//     fontSize: 14,
//     color: '#888',
//   },
//   amount: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default Wallet;

// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import axios from 'axios';

// import { useRoute } from "@react-navigation/native";
  
// const Wallet = () => {
//   const route = useRoute();
//   const { userId } = route.params; 
//   console.log(userId);
//   const [balance, setBalance] = useState(0);
//   const [amount, setAmount] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [transactions, setTransactions] = useState([]);
//   const [totalPoints, setTotalPoints] = useState(0);
//   const [converted, setConverted] = useState(false);

//   const walletApiUrl = `https://kgvapp.pureprakruti.com/api/wallet/${userId}`;

//   useEffect(() => {
//     if (userId) {
//       checkAndCreateWallet();
//     } else {
//       console.log('User ID is undefined');
//     }
//   }, [userId]);

//   const checkAndCreateWallet = async () => {
//     try {
//       const response = await axios.get(walletApiUrl);
//       if (response.data?.balance !== undefined) {
//         fetchWalletBalance();
//         fetchTransactions();
//       } else {
//         await createWallet();
//       }
//     } catch (error) {
//       if (error.response?.status === 404) {
//         await createWallet();
//       } else {
//         console.log('Error checking wallet:', error);
//         Alert.alert('Error', 'Failed to check wallet status.');
//       }
//     }
//   };

//   const createWallet = async () => {
//     try {
//       await axios.post('https://kgvapp.pureprakruti.com/api/wallet/create', { userId });
//       Alert.alert('Wallet Created', 'Your wallet has been successfully created.');
//       fetchWalletBalance();
//       fetchTransactions();
//     } catch (error) {
//       console.log('Error creating wallet:', error);
//       Alert.alert('Error', 'Failed to create wallet.');
//     }
//   };

//   // Fetch wallet balance
//   const fetchWalletBalance = async () => {
//     try {
//       const response = await axios.get(walletApiUrl);
//       setBalance(response.data.balance);
//     } catch (error) {
//       console.log('Error fetching balance:', error);
//     }
//   };

//   // Fetch transactions
//   const fetchTransactions = async () => {
//     try {
//       const response = await axios.get(`${walletApiUrl}/transactions`);
//       setTransactions(response.data.transactions);
//       const points = response.data.transactions
//         .filter(item => item.type === 'credit')
//         .reduce((sum, item) => sum + item.amount, 0);
//       setTotalPoints(points);
//     } catch (error) {
//       console.log('Error fetching transactions:', error);
//     }
//   };

//   // Refresh wallet balance and transactions after adding or paying amount
//   const refreshData = async () => {
//     await fetchWalletBalance();
//     await fetchTransactions();
//   };

//   // Handle wallet recharge
//   const handleRecharge = async () => {
//     if (!amount) return Alert.alert('Enter an amount');

//     try {
//       setLoading(true);
//       const response = await axios.post(`${walletApiUrl}/recharge`, { amount });
//       setBalance(response.data.balance); // update balance
//       Alert.alert('Success', `Wallet recharged by ₹${amount}`);
//       setAmount('');
//       refreshData(); // Refresh data after recharge
//     } catch (error) {
//       console.log('Error during recharge:', error);
//       Alert.alert('Error', 'Failed to recharge');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle wallet payment
//   const handlePayment = async () => {
//     const paymentAmount = 1000; // Example: Payment of 1000

//     if (balance < paymentAmount) {
//       Alert.alert('Insufficient Balance');
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.post(`${walletApiUrl}/pay`, { amount: paymentAmount });
//       setBalance(response.data.balance); // update balance after payment
//       Alert.alert('Payment Success', `Paid ₹${paymentAmount} from Wallet`);
//       refreshData(); // Refresh data after payment
//     } catch (error) {
//       console.log('Error during payment:', error);
//       Alert.alert('Error', 'Payment failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to convert points to money (assuming 1 point = 0.1 rupees)
//   const convertPointsToMoney = () => {
//     if (totalPoints > 0 && !converted) {
//       const rupees = totalPoints / 10; // Example: 10 points = 1 rupee
//       setTotalPoints(0); // Deduct all points after conversion
//       setConverted(true); // Disable further conversions
//       Alert.alert('Success', `You have converted ₹${rupees} points to rupees.`);
//     } else if (converted) {
//       Alert.alert('Already Converted', 'You have already converted your points to rupees.');
//     } else {
//       Alert.alert('Insufficient Points', "You don't have enough points to convert.");
//     }
//   };

//   // Render a single transaction
//   const renderTransaction = ({ item }) => (
//     <View style={styles.transactionItem}>
//       <Ionicons
//         name={item.type === 'credit' ? 'arrow-down-circle' : 'arrow-up-circle'}
//         size={24}
//         color={item.type === 'credit' ? 'green' : 'red'}
//       />
//       <View style={styles.transactionDetails}>
//         <Text style={styles.name}>{item.name}</Text>
//         <Text style={styles.date}>{item.date}</Text>
//       </View>
//       <Text style={[styles.amount, { color: item.type === 'credit' ? 'green' : 'red' }]}>
//         {item.type === 'credit' ? `+ Points.${item.amount}` : `- Points.${item.amount}`}
//       </Text>
//     </View>
//   );

//   return (
//     <LinearGradient colors={['#06264D', '#FFF']} style={styles.gradientBackground}>
//       <View style={styles.container}>
//         {/* Wallet Balance Section */}
//         <View style={styles.balanceContainer}>
//           <Text style={styles.balanceText}>Available Wallet Points</Text>
//           <Text style={styles.balanceAmount}>{totalPoints}</Text>
//         </View>

//         {/* Recharge Section */}
//         {/* <TextInput
//           placeholder="Enter Amount"
//           value={amount}
//           onChangeText={setAmount}
//           keyboardType="numeric"
//           style={{ borderWidth: 1, marginVertical: 20, padding: 10 }}
//         />
//         <Button
//           title={loading ? 'Recharging...' : 'Recharge Wallet'}
//           onPress={handleRecharge}
//           disabled={loading}
//         /> */}

//         {/* Payment Button */}
//         {/* <Button
//           title={loading ? 'Processing Payment...' : 'Pay ₹1000 using Wallet'}
//           onPress={handlePayment}
//           color="green"
//           disabled={loading}
//           style={{ marginTop: 20 }}
//         /> */}

//         {/* Conversion and Purchase Kit Buttons */}
//         <View style={styles.actionContainer}>
//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={convertPointsToMoney}
//             disabled={true} // Disable button if already converted
//           >
//             <Ionicons name="cash-outline" size={32} color={converted ? 'gray' : 'green'} />
//             <Text>Convert to money</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => navigation.navigate('Visitordetails1', { user })}
//             disabled={true}
//           >
//             <Ionicons name="send-outline" size={32} color="red" />
//             <Text>Purchase Kit</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Transaction History */}
//         <Text style={styles.historyTitle}>TRANSACTION HISTORY</Text>
//         <FlatList
//           data={transactions}
//           renderItem={renderTransaction}
//           keyExtractor={item => item.id}
//           contentContainerStyle={styles.transactionList}
//         />
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   gradientBackground: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 40,
//   },
//   balanceContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   balanceText: {
//     fontSize: 16,
//     color: '#FFF',
//   },
//   balanceAmount: {
//     fontSize: 30,
//     fontWeight: 'bold',
//     color: '#FFD700',
//   },
//   actionContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginVertical: 20,
//   },
//   actionButton: {
//     alignItems: 'center',
//   },
//   historyTitle: {
//     fontSize: 18,
//     marginVertical: 10,
//     color: '#000',
//     fontWeight: 'bold',
//   },
//   transactionItem: {
//     flexDirection: 'row',
//     padding: 15,
//     marginVertical: 5,
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     elevation: 2,
//   },
//   transactionDetails: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   date: {
//     fontSize: 14,
//     color: '#888',
//   },
//   amount: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default Wallet;

