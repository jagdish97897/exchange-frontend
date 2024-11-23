
import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, ScrollView, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';
const { width, height } = Dimensions.get('window');

const PaymentPage1 = ({ route, navigation }) => {
  const { formData, user, amount, visitorId, cartId, totalPrice } = route.params;

  console.log(formData)
  console.log(amount)

  const [data, setData] = useState(null);
  const [buyerDetails, setBuyerDetails] = useState(null);
  const bookingAmountPerItem = 5000;
  const installationfeeperkit = 5000;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://192.168.1.5:8005/api/cart/item/${cartId}`);
        setData(response.data);
      } catch (error) {
        console.log('Error fetching cart data:', error);
      }
    };
    fetchData();
  }, [cartId]);

  useEffect(() => {

    const fetchBuyerDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.1.5:8005/api/v1/visitor/details/${visitorId}`);
        setBuyerDetails(response.data.data[0]);
      } catch (error) {
        console.log('Error fetching buyer details:', error);
      }
    };
    if (visitorId) {
      fetchBuyerDetails();
    }
  }, [visitorId]);

  if (!data || !buyerDetails) {
    return <Text>Loading...</Text>;
  }

  const { cartItems } = data;

  const calculateTax = (price) => {
    const cgstRate = 0;
    const sgstRate = 0;
    const igstRate = 0.18; // 18%
    const cgst = price * cgstRate;
    const sgst = price * sgstRate;
    const igst = price * igstRate;
    return { cgst, sgst, igst };
  };
  const totalBeforeTax = cartItems.reduce((sum, item) => sum + item.item.totalPrice, 0);
  const totalTax = cartItems.reduce((sum, item) => {
    const { igst } = calculateTax(item.item.totalPrice);
    return sum + igst;
  }, 0);

  const totalBookingAmount = cartItems.length * bookingAmountPerItem;
  const totalInstallationFee = cartItems.length * installationfeeperkit;
  const totalAmount = totalBeforeTax + totalTax + totalInstallationFee;
  const totalAmountToBePaid = totalAmount - totalBookingAmount;

  const handlePayment = () => {
    if (formData && user && visitorId && cartId && totalPrice) {
      navigation.navigate('PaymentImageUpload1', {
        formData,        
        user,            
        amount: formData.amount,  
        visitorId,      
        cartId,          
        totalPrice       
      });
    } else {
      // Handle case where required data is missing
      console.log('Missing required data for navigation.');
    }
  };
  
  const htmlContent = `
jhjgjgjhghjgj
    `;

  const generatePDF = async () => {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };


  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient  colors={['#545a2c', '#FFF']} style={styles.gradientBackground}>
        {/* Heading Section */}
        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>Billing Details</Text>
        </View>

        {/* Details Section */}
        <Card style={styles.detailsCard}>
          <View style={styles.detailsContainer}>
            <View style={styles.detailsColumn}>
              <Text style={styles.detailsTitle}>Buyer:</Text>
              <Text style={styles.detailsText}>{buyerDetails.fullName}</Text>
              <Text style={styles.detailsText}>{buyerDetails.address}</Text>
              <Text style={styles.detailsText}>{buyerDetails.phoneNumber}</Text>
            </View>
          </View>
        </Card>

        {/* Table Section */}
        <ScrollView style={styles.tableContainer}>
          <Card style={styles.tableCard}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>S.No</Text>
              <Text style={styles.tableHeaderText}>Product Name</Text>
              <Text style={styles.tableHeaderText}>Rate</Text>
              {/* <Text style={styles.tableHeaderText}>CGST</Text>
              <Text style={styles.tableHeaderText}>SGST</Text> */}
              <Text style={styles.tableHeaderText}>IGST</Text>
              <Text style={styles.tableHeaderText}>Addons</Text>
              <Text style={styles.tableHeaderText}>Total Amount</Text>
            </View>
            {cartItems.map((item, index) => {
              const { igst } = calculateTax(item.item.totalPrice);
              return (
                <View key={item._id} style={styles.tableRow}>
                  <Text style={styles.tableData}>{index + 1}</Text>
                  <Text style={styles.tableData}>{item.item.name}</Text>
                  <Text style={styles.tableData}>{item.item.kitPrice}</Text>
                  {/* <Text style={styles.tableData}>0%</Text>
                                    <Text style={styles.tableData}>0%</Text> */}
                  <Text style={styles.tableData}>{(igst * 100 / item.item.totalPrice).toFixed(2)}%</Text>
                  <View style={styles.addonsContainer}>
                    {item.item.addons.map((addon) => (
                      <Text key={addon._id} style={styles.addonText}>
                        {addon.name} - ₹{addon.price}
                      </Text>
                    ))}
                  </View>
                  <Text style={styles.tableData}>{item.item.totalPrice}</Text>
                </View>
              );
            })}
          </Card>
        </ScrollView>

        <Card style={styles.footerCard}>
          <View style={styles.footerContainer}>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Total Before Tax:</Text>
              <Text style={styles.footerValue}>₹{totalBeforeTax}</Text>
            </View>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Total Tax Amount:</Text>
              <Text style={styles.footerValue}>₹{totalTax}</Text>
            </View>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Total Installation Amount (₹5000/kit):</Text>
              <Text style={styles.footerValue}>₹{totalInstallationFee}</Text>
            </View>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Total Amount:</Text>
              <Text style={styles.footerValue}>₹{totalAmount}</Text>
            </View>
            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Total Booking Amount (₹5000/kit):</Text>
              <Text style={styles.footerValue}>₹{totalBookingAmount}</Text>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerLabel}>Total Amount to be Paid:</Text>
              <Text style={styles.footerValue}>₹{totalAmountToBePaid}</Text>
            </View>
          </View>
        </Card>


        <View style={styles.buttonContainer}>
          <Button title="Download PDF" onPress={generatePDF} color="#ff6347" />
          <Button title="Proceed to Pay" onPress={handlePayment} color="#841584" disabled={false} />
        </View>
      </LinearGradient>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    paddingHorizontal: width * 0.05, // 5% of screen width
    paddingVertical: height * 0.02, // 2% of screen height
  },
  headingContainer: {
    alignItems: 'center',
    marginVertical: height * 0.01, // 1% of screen height
  },
  headingText: {
    fontSize: width * 0.06, // Scales with screen width
    fontWeight: 'bold',
    color: '#FFF',
  },
  detailsCard: {
    marginVertical: height * 0.01, // 1% of screen height
    borderRadius: 10,
    elevation: 2,
    padding: width * 0.04, // 4% of screen width
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsColumn: {
    flex: 1,
    paddingHorizontal: width * 0.02, // 2% of screen width
  },
  detailsTitle: {
    fontSize: width * 0.04, // Scales with screen width
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  detailsText: {
    fontSize: width * 0.035, // Scales with screen width
    color: '#666',
    marginBottom: 3,
  },
  tableCard: {
    marginVertical: height * 0.01, // 1% of screen height
    borderRadius: 10,
    elevation: 2,
  },
  tableContainer: {
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0073e6',
    padding: width * 0.02, // 2% of screen width
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: width * 0.035, // Scales with screen width
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: width * 0.02, // 2% of screen width
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableData: {
    flex: 1,
    fontSize: width * 0.035,
    color: '#333',
    textAlign: 'center',
  },
  addonsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addonText: {
    fontSize: width * 0.03, // Scales with screen width
    color: '#333',
  },
  footerCard: {
    marginVertical: height * 0.01, // 1% of screen height
    borderRadius: 10,
    elevation: 2,
    padding: width * 0.04, // 4% of screen width
    backgroundColor: '#0073e6',
  },
  footerContainer: {
    flexDirection: 'column',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  footerLabel: {
    fontSize: width * 0.04, // Scales with screen width
    fontWeight: 'bold',
    color: '#ffffff',
  },
  footerValue: {
    fontSize: width * 0.04, // Scales with screen width
    // fontWeight: 'bold',
    color: '#ffffff',
  },
  buttonContainer: {
    marginTop: height * 0.02, // 2% of screen height
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});


export default PaymentPage1;




// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, Alert, ScrollView, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
// import RazorpayCheckout from 'react-native-razorpay';
// import { Card } from 'react-native-paper';
// import axios from 'axios';
// import LinearGradient from 'react-native-linear-gradient';
// import * as Print from 'expo-print';
// import { shareAsync } from 'expo-sharing';
// const { width, height } = Dimensions.get('window');

// const PaymentPage11 = ({ route, navigation }) => {
//   const { formData, user, amount, visitorId, cartId, totalPrice } = route.params;
//   const [data, setData] = useState(null);
//   const [buyerDetails, setBuyerDetails] = useState(null);
//   const bookingAmountPerItem = 5000;
//   const installationfeeperkit = 5000;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`http://192.168.1.5:8005/api/cart/item/${cartId}`);
//         setData(response.data);
//       } catch (error) {
//         console.log('Error fetching cart data:', error);
//       }
//     };
//     fetchData();
//   }, [cartId]);

//   useEffect(() => {

//     const fetchBuyerDetails = async () => {
//       try {
//         const response = await axios.get(`http://192.168.1.5:8005/api/v1/visitor/details/${visitorId}`);
//         setBuyerDetails(response.data.data[0]);
//       } catch (error) {
//         console.log('Error fetching buyer details:', error);
//       }
//     };
//     if (visitorId) {
//       fetchBuyerDetails();
//     }
//   }, [visitorId]);

//   if (!data || !buyerDetails) {
//     return <Text>Loading...</Text>;
//   }

//   const { cartItems } = data;

//   const calculateTax = (price) => {
//     const cgstRate = 0;
//     const sgstRate = 0;
//     const igstRate = 0.18; // 18%
//     const cgst = price * cgstRate;
//     const sgst = price * sgstRate;
//     const igst = price * igstRate;
//     return { cgst, sgst, igst };
//   };
//   const totalBeforeTax = cartItems.reduce((sum, item) => sum + item.item.totalPrice, 0);
//   const totalTax = cartItems.reduce((sum, item) => {
//     const { igst } = calculateTax(item.item.totalPrice);
//     return sum + igst;
//   }, 0);


//   const totalBookingAmount = cartItems.length * bookingAmountPerItem;
//   const totalInstallationFee = cartItems.length * installationfeeperkit;
//   const totalAmount = totalBeforeTax + totalTax + totalInstallationFee;
//   const totalAmountToBePaid = totalAmount - totalBookingAmount;



//   const handlePayment = async () => {
//     try {
//       const amountInPaise = Math.round(Number(amount) * 100);

//       // Fetch Razorpay key
//       const { data: { key } } = await axios.get("http://192.168.1.5:8005/api/getkey");

//       const { data: { order } } = await axios.post("http://192.168.1.5:8005/api/v1/bookingkit/checkout", { amount: amountInPaise });

//       const options = {
//         key,
//         amount: order.amount,
//         currency: "INR",
//         name: "Payment to KGV",
//         description: "Passionate about KGV",
//         image: "https://raw.githubusercontent.com/jagdish97897/kgvl/main/logokgv.cb6e50d56b55ae361cd7-removebg-preview.png",
//         order_id: order.id,
//         prefill: {
//           name: formData.fullName,
//           email: formData.email,
//           contact: formData.phoneNumber,
//         },
//         notes: {
//           fullName: formData.fullName,
//           phoneNumber: formData.phoneNumber,
//           address: formData.address,
//           aadhar: formData.aadhar,
//           dlno: formData.dlno,
//           dob: formData.dob,
//           gender: formData.gender,
//           email: formData.email,
//           amount: formData.amount,
//           pan: formData.pan,
//         },
//         theme: {
//           color: "#121212",
//         },
//       };

//       RazorpayCheckout.open(options)
//         .then(async (data) => {
//           // console.log(`Payment Successful: ${data.razorpay_payment_id}`);

//           try {
//             // Verify cartId before proceeding
//             if (!cartId) {
//               console.log('Cart ID is missing');
//               Alert.alert('Error', 'Cart ID is missing. Cannot proceed with the order.');
//               return;
//             }

//             // console.log('Sending order data:', { visitorId, cartId });

//             // Post the cart items to order schema
//             const orderResponse = await axios.post("http://192.168.1.5:8005/api/order/item", { visitorId, cartId, totalAmount, amountPaid: amount });
//             // console.log('Order saved successfully:', orderResponse.data);
//             // console.log('Order saved successfully:', orderResponse.data.order._id);

//             navigation.navigate('PaymentSuccess1', {
//               data,
//               orderId: orderResponse.data.order._id,
//               user,
//               referralCode: buyerDetails.referralCode
//             })

//           } catch (orderError) {
//             // Log the error response for more details
//             if (orderError.response) {
//               console.log('Error response from API:', orderError.response.data);
//               Alert.alert('Error', `Failed to save order data: ${orderError.response.data.message}`);
//             } else {
//               console.log('Error saving order data:', orderError.message);
//               Alert.alert('Error', 'Failed to save order data.');
//             }
//           }

//         })
//         .catch((error) => {
//           console.log("Razorpay Error:", error);
//           Alert.alert(`Error: ${error.code} | ${error.description}`);
//         });
//     } catch (error) {
//       console.log("Error:", error);
//       Alert.alert('Error', 'Something went wrong. Please try again.');
//     }
//   };


//   const htmlContent = `
//   <style>
//     body {
//       font-family: 'Helvetica Neue', sans-serif;
//       margin: 0;
//       padding: 20px;
//       color: #333;
//       background-color: #f9f9f9;
//     }
//     h1, h2 {
//       color: #34495e;
//       text-align: center;
//       margin-bottom: 20px;
//     }
//     h1 {
//       font-size: 26px;
//       border-bottom: 2px solid #34495e;
//       padding-bottom: 10px;
//       text-transform: uppercase;
//       letter-spacing: 1.5px;
//     }
//     h2 {
//       font-size: 20px;
//       margin-top: 40px;
//       text-transform: uppercase;
//     }
//     p {
//       font-size: 14px;
//       line-height: 1.8;
//     }
//     .buyer-details, .summary {
//       margin-bottom: 20px;
//     }
//     table {
//       width: 100%;
//       border-collapse: collapse;
//       margin: 30px 0;
//       box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//     }
//     th, td {
//       border: 1px solid #ddd;
//       padding: 10px 15px;
//       text-align: left;
//       font-size: 14px;
//     }
//     th {
//       background-color: #2c3e50;
//       color: white;
//       font-weight: bold;
//     }
//     tr:nth-child(even) {
//       background-color: #f4f4f4;
//     }
//     tr:hover {
//       background-color: #ecf0f1;
//     }
//     .summary {
//       background-color: #ecf0f1;
//       padding: 20px;
//       border-radius: 10px;
//       font-size: 15px;
//     }
//     .summary p {
//       font-weight: bold;
//       font-size: 16px;
//     }
//     .summary p span {
//       font-weight: normal;
//       float: right;
//     }
//     footer {
//       text-align: center;
//       color: black;
//       font-size: 12px;
//       color: #888;
//       margin-top: 40px;
//     }
//   </style>

//   <h1>Billing Details</h1>
  
//   <div class="buyer-details">
//     <p><strong>Buyer:</strong> ${buyerDetails.fullName}</p>
//     <p><strong>Address:</strong> ${buyerDetails.address}</p>
//     <p><strong>Phone Number:</strong> ${buyerDetails.phoneNumber}</p>
//   </div>
  
//   <h2>Cart Items</h2>
//   <table>
//     <thead>
//       <tr>
//         <th>S.No</th>
//         <th>Product Name</th>
//         <th>Rate</th>
//         <th>Addons</th>
//         <th>IGST</th>
//         <th>Total Amount</th>
//       </tr>
//     </thead>
//     <tbody>
//       ${cartItems.map((item, index) => `
//         <tr>
//           <td>${index + 1}</td>
//           <td>${item.item.name}</td>
//           <td>₹${item.item.kitPrice}</td>
//           <td>${item.item.addons.map(addon => `${addon.name} - ₹${addon.price}`).join('<br>')}</td>
//           <td>18%</td>
//           <td>₹${item.item.totalPrice}</td>
//         </tr>
//       `).join('')}
//     </tbody>
//   </table>

//   <h2>Summary</h2>
//   <div class="summary">
//     <p>Total Amount Before Tax: <span>₹${totalBeforeTax}</span></p>
//     <p>Total Tax Amount: <span>₹${totalTax}</span></p>
//     <p>Total Installation Amount (₹5000/kit): <span>₹${totalInstallationFee}</span></p>
//     <p>Total Amount: <span>₹${totalAmount}</span></p>
//     <p>Total Booking Amount (₹5000/kit): <span>₹${totalBookingAmount}</span></p>
//     <p>Total Amount to be Paid: <span>₹${totalAmountToBePaid}</span></p>
//   </div>
  
//   <footer>
//     Thank you for your purchase! | http://kgvl.co.in/ | team@kgvl.co.in
//   </footer>
// `;




//   const generatePDF = async () => {
//     const { uri } = await Print.printToFileAsync({ html: htmlContent });
//     await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
//   };


//   return (
//     <SafeAreaView style={styles.container}>

//       <LinearGradient colors={['#545a2c', '#FFF']} style={styles.gradientBackground}>
//         {/* Heading Section */}
//         <View style={styles.headingContainer}>
//           <Text style={styles.headingText}>Billing Details</Text>
//         </View>

//         {/* Details Section */}
//         <Card style={styles.detailsCard}>
//           <View style={styles.detailsContainer}>
//             <View style={styles.detailsColumn}>
//               <Text style={styles.detailsTitle}>Buyer:</Text>
//               <Text style={styles.detailsText}>{buyerDetails.fullName}</Text>
//               <Text style={styles.detailsText}>{buyerDetails.address}</Text>
//               <Text style={styles.detailsText}>{buyerDetails.phoneNumber}</Text>
//             </View>
//           </View>
//         </Card>

//         {/* Table Section */}
//         <ScrollView style={styles.tableContainer}>
//           <Card style={styles.tableCard}>
//             <View style={styles.tableHeader}>
//               <Text style={styles.tableHeaderText}>S.No</Text>
//               <Text style={styles.tableHeaderText}>Product Name</Text>
//               <Text style={styles.tableHeaderText}>Rate</Text>
//               {/* <Text style={styles.tableHeaderText}>CGST</Text>
//               <Text style={styles.tableHeaderText}>SGST</Text> */}
//               <Text style={styles.tableHeaderText}>IGST</Text>
//               <Text style={styles.tableHeaderText}>Addons</Text>
//               <Text style={styles.tableHeaderText}>Total Amount</Text>
//             </View>
//             {cartItems.map((item, index) => {
//               const { igst } = calculateTax(item.item.totalPrice);
//               return (
//                 <View key={item._id} style={styles.tableRow}>
//                   <Text style={styles.tableData}>{index + 1}</Text>
//                   <Text style={styles.tableData}>{item.item.name}</Text>
//                   <Text style={styles.tableData}>{item.item.kitPrice}</Text>
//                   {/* <Text style={styles.tableData}>0%</Text>
//                                     <Text style={styles.tableData}>0%</Text> */}
//                   <Text style={styles.tableData}>{(igst * 100 / item.item.totalPrice).toFixed(2)}%</Text>
//                   <View style={styles.addonsContainer}>
//                     {item.item.addons.map((addon) => (
//                       <Text key={addon._id} style={styles.addonText}>
//                         {addon.name} - ₹{addon.price}
//                       </Text>
//                     ))}
//                   </View>
//                   <Text style={styles.tableData}>{item.item.totalPrice}</Text>
//                 </View>
//               );
//             })}
//           </Card>
//         </ScrollView>

//         <Card style={styles.footerCard}>
//           <View style={styles.footerContainer}>
//             <View style={styles.footerRow}>
//               <Text style={styles.footerLabel}>Total Before Tax:</Text>
//               <Text style={styles.footerValue}>₹{totalBeforeTax}</Text>
//             </View>
//             <View style={styles.footerRow}>
//               <Text style={styles.footerLabel}>Total Tax Amount:</Text>
//               <Text style={styles.footerValue}>₹{totalTax}</Text>
//             </View>
//             <View style={styles.footerRow}>
//               <Text style={styles.footerLabel}>Total Installation Amount (₹5000/kit):</Text>
//               <Text style={styles.footerValue}>₹{totalInstallationFee}</Text>
//             </View>
//             <View style={styles.footerRow}>
//               <Text style={styles.footerLabel}>Total Amount:</Text>
//               <Text style={styles.footerValue}>₹{totalAmount}</Text>
//             </View>
//             <View style={styles.footerRow}>
//               <Text style={styles.footerLabel}>Total Booking Amount (₹5000/kit):</Text>
//               <Text style={styles.footerValue}>₹{totalBookingAmount}</Text>
//             </View>

//             <View style={styles.footerRow}>
//               <Text style={styles.footerLabel}>Total Amount to be Paid:</Text>
//               <Text style={styles.footerValue}>₹{totalAmountToBePaid}</Text>
//             </View>
//           </View>
//         </Card>


//         <View style={styles.buttonContainer}>
//           <Button title="Download PDF" onPress={generatePDF} color="#ff6347" />
//           <Button title="Proceed to Pay" onPress={handlePayment} color="#841584" disabled={false} />
//         </View>
//       </LinearGradient>

//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   gradientBackground: {
//     flex: 1,
//     paddingHorizontal: width * 0.05, // 5% of screen width
//     paddingVertical: height * 0.02, // 2% of screen height
//   },
//   headingContainer: {
//     alignItems: 'center',
//     marginVertical: height * 0.01, // 1% of screen height
//   },
//   headingText: {
//     fontSize: width * 0.06, // Scales with screen width
//     fontWeight: 'bold',
//     color: '#FFF',
//   },
//   detailsCard: {
//     marginVertical: height * 0.01, // 1% of screen height
//     borderRadius: 10,
//     elevation: 2,
//     padding: width * 0.04, // 4% of screen width
//   },
//   detailsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   detailsColumn: {
//     flex: 1,
//     paddingHorizontal: width * 0.02, // 2% of screen width
//   },
//   detailsTitle: {
//     fontSize: width * 0.04, // Scales with screen width
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   detailsText: {
//     fontSize: width * 0.035, // Scales with screen width
//     color: '#666',
//     marginBottom: 3,
//   },
//   tableCard: {
//     marginVertical: height * 0.01, // 1% of screen height
//     borderRadius: 10,
//     elevation: 2,
//   },
//   tableContainer: {
//     flex: 1,
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: '#0073e6',
//     padding: width * 0.02, // 2% of screen width
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//   },
//   tableHeaderText: {
//     flex: 1,
//     fontSize: width * 0.035, // Scales with screen width
//     fontWeight: 'bold',
//     color: '#FFF',
//     textAlign: 'center',
//   },
//   tableRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: width * 0.02, // 2% of screen width
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   tableData: {
//     flex: 1,
//     fontSize: width * 0.035,
//     color: '#333',
//     textAlign: 'center',
//   },
//   addonsContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   addonText: {
//     fontSize: width * 0.03, // Scales with screen width
//     color: '#333',
//   },
//   footerCard: {
//     marginVertical: height * 0.01, // 1% of screen height
//     borderRadius: 10,
//     elevation: 2,
//     padding: width * 0.04, // 4% of screen width
//     backgroundColor: '#0073e6',
//   },
//   footerContainer: {
//     flexDirection: 'column',
//   },
//   footerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//   },
//   footerLabel: {
//     fontSize: width * 0.04, // Scales with screen width
//     fontWeight: 'bold',
//     color: '#ffffff',
//   },
//   footerValue: {
//     fontSize: width * 0.04, // Scales with screen width
//     // fontWeight: 'bold',
//     color: '#ffffff',
//   },
//   buttonContainer: {
//     marginTop: height * 0.02, // 2% of screen height
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
// });


// export default PaymentPage11;
