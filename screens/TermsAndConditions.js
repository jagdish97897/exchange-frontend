import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const TermsAndConditions = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white p-6">
      {/* Header */}
      <Text className="text-xl font-bold text-center m-8">Terms & Conditions</Text>

      {/* Scrollable Terms Text */}
      <ScrollView className="border border-blue-400 p-3 rounded-lg h-96">
        <Text className="text-gray-700">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eget turpis a nibh lacinia
          suscipit nec nec purus. Mauris fringilla ultrices libero non placerat. Interdum et malesuada 
          fames ac ante ipsum primis in faucibus. Vestibulum aliquet eget turpis et placerat.
          
          Sed feugiat turpis vitae accumsan facilisis. Mauris faucibus, nisl ut volutpat interdum, justo 
          dolor condimentum magna, a luctus lorem lorem eget elit. Donec pulvinar viverra orci, nec 
          lacinia lacus tincidunt a. Donec vulputate sem nec tortor posuere, eu ullamcorper eros 
          venenatis.
          
          Vestibulum ac mauris dictum, posuere nulla at, finibus neque. Donec aliquam velit nunc, eu 
          interdum tortor tempor vel. Integer convallis arcu ornare justo posuere, et condimentum sem 
          mattis.
          
          (Add more terms as needed)
        </Text>
      </ScrollView>

      {/* Accept Button */}
      <TouchableOpacity 
        className="bg-blue-600 p-3 rounded-md mt-4"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-white text-center text-lg font-bold">Accept</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TermsAndConditions;

// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
// import Icon from '@expo/vector-icons/MaterialIcons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useNavigation, useRoute } from '@react-navigation/native';

// export default function TermsAndConditions() {
//     const navigation = useNavigation();
//     const route = useRoute();

//     const [isChecked, setIsChecked] = useState(false);

//     const handleAccept = () => {
//         if (isChecked) {
//             route.params.onAccept();
//             navigation.goBack();
//         }
//     };

//     return (
//         <LinearGradient colors={['#06264D', '#FFF']} style={styles.gradient}>
//             <View style={styles.imageAndHeaderContainer}>
//                 <Image
//                     source={require("../assets/images/kgv.png")} // Replace with your image URL or local file
//                     style={styles.image}
//                 />
//                 <Text style={styles.header}>Terms and Conditions</Text>
//             </View>

//             <ScrollView contentContainerStyle={styles.scrollViewContent}>

//                 <Text style={styles.text}>
//                     <Text style={{ fontWeight: 'bold' }}>1. Warranty:</Text> The company warrants the kit from the delivery date.
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>2. Maintenance:</Text> The customer is responsible for ensuring regular maintenance of the kit in accordance with the company's guidelines. Failure to perform such maintenance will result in the warranty becoming void. It is the customer's duty to properly maintain the kit to ensure optimal performance and extend its lifespan. Neglecting regular maintenance will not only compromise the kit's performance but also render the warranty invalid.
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>3. Battery:</Text> If the battery is installed by us, the battery is warranted for 3 years, but the company shall not be responsible for any issues or defects; in case of any claims, the customer shall directly approach the manufacturer, who shall be solely responsible for addressing such claims.
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>4. Charging:</Text> Only use the provided charger to avoid damage.
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>5. Safety:</Text> Always wear a helmet and follow traffic rules.
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>6. Registration:</Text> Register the bike at the time of delivery of the vehicle.
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>7. Insurance:</Text>Insure the bike at the time of delivery of the vehicle.
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>8. Return/Refund:</Text> After paying the registration fees of Rs.5,000/- for the kit, if you fail to install the kit within the specified period, you will be liable to pay the full amount for the kit, and your initial registration fees will also be forfeited.
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>9. Offers:</Text> Failure to install the kit within the designated timeframe will render the customer ineligible for the specially priced offer, as determined by the company.
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>10. Liability:</Text> The company is not liable for any damage or injury caused by misuse.
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>11. Software Updates:</Text> The company reserves the right to update software without prior notice.
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>12. Data Collection:</Text> The company may collect data for improvement and research purposes.
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>13. Governing Law:</Text> These terms are governed by [State/Country] laws.
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>14. Dispute Resolution:</Text> Disputes will be resolved through arbitration as per [Arbitration Rules].
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>15. Changes:</Text> The company reserves the right to modify these terms without prior notice.
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>16. Performance:</Text> The vehicle's performance is guaranteed to meet the specified parameters, subject to normal usage and maintenance conditions, and the company shall not be liable for any deviations due to misuse, neglect, unauthorized modifications, or external factors such as extreme weather conditions. The company reserves the right to update or modify vehicle performance parameters through software updates and shall not be responsible for any damage or issues caused by exceeding recommended payload or towing capacity, third-party accessories, or modifications. The vehicle performance warranty is valid for a specified period or mileage, whichever comes first, and the company's liability is limited to repairing or replacing defective parts only.
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>17. Intellectual Property Rights:</Text> It belong to KGV. The Intellectual Property rights therein may not be copied, distributed, published, licensed, used or reproduced in any way (save to the extent strictly necessary for, and to access and use this Website). 'KGV' and the trademarks belonging to KGV may not be used, copied or reproduced in any way without written consent from KGV.
//                     {"\n"}For these purposes 'Intellectual Property Rights' includes the following (wherever and whenever arising and for the full term of each of them): any patent, trademark, trade name, service mark, service name, design, design right, copyright, database right, moral rights, know how, trade secret and other confidential information, rights in the nature of any of these items in any country, rights in the nature of unfair competition rights and rights to sue for passing off and other similar intellectual and commercial right (in each case whether or not registered or registrable) and registrations of and applications to register any of them. KGV retains and reserves all rights in such Intellectual Property Rights.{"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>18.</Text> You agree to indemnify and keep indemnified always and hold KGV and its employees and agents harmless from and against all liabilities, legal fees, damages, losses, costs and other expenses in relation to any claims or actions brought against KGV arising out of any breach by you of these Terms and Conditions or other liabilities arising out of your use.
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>19.</Text> No ideas, material, computer code, information or other communication you submit or post to the Website will be considered confidential or proprietary. All such material becomes the exclusive property of KGV, which is entitled to use such material for any purpose without restriction or compensation. You are prohibited from posting or transmitting to or from the Website any unlawful, infringing, threatening, libellous, defamatory, obscene or pornographic material or any other material that would violate any law and KGV. reserves the right to delete such material without giving any notice. KGV reserves the right to block such user/ Member from entering the website permanently. Views expressed or comments offered by the users/ members shall be personal in nature of the users/members and KGV. shall not have any responsibility whatsoever in this regard.
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>20.</Text> No ideas, material, computer code, information or other communication you submit or post to the Website will be considered confidential or proprietary. All such material becomes the exclusive property of KGV, which is entitled to use such material for any purpose without restriction or compensation. You are prohibited from posting or transmitting to or from the Website any unlawful, infringing, threatening, libellous, defamatory, obscene or pornographic material or any other material that would violate any law and KGV. reserves the right to delete such material without giving any notice. KGV reserves the right to block such user/ Member from entering the website permanently. Views expressed or comments offered by the users/ members shall be personal in nature of the users/members and KGV. shall not have any responsibility whatsoever in this regard.
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>21.</Text>If there is any dispute about or involving these Terms and Conditions, the service/products between you and KGV, the dispute shall be governed by the laws of India and the courts of Delhi alone, to the exclusion of any other, shall have the jurisdiction to try and entertain any disputes.
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>22.</Text>If there is any dispute about or involving these Terms and Conditions, the service/products between you and KGV, the dispute shall be governed by the laws of India and the courts of Delhi alone, to the exclusion of any other, shall have the jurisdiction to try and entertain any disputes.
//                     {"\n"}
//                     <Text style={{ fontWeight: 'bold' }}>23. Force Majeure: </Text>The Company shall not be liable for any failure or delay in performing its obligations under this contract if caused by an event beyond its reasonable control, including natural disasters, wars, epidemics, government actions, strikes, or unforeseen circumstances. The Company's obligations shall be suspended during the Force Majeure event, and it shall notify the other party promptly and take reasonable steps to mitigate the effects. If the event continues for 60 days, either party may terminate this contract upon written notice. The Company shall not be liable for any loss, damage, or expense resulting from a Force Majeure event, and this clause shall excuse non-performance or delayed performance and allocate risk between the parties

//                 </Text>

//             </ScrollView>

//             <View style={styles.imageAndHeaderContainer}>
//                 <View style={styles.checkboxContainer}>
//                     <TouchableOpacity
//                         style={[styles.checkbox, { backgroundColor: isChecked ? '#06264D' : '#ccc' }]}
//                         onPress={() => setIsChecked(!isChecked)}
//                     >
//                         {isChecked && <Text style={styles.checkmark}>✔</Text>}
//                     </TouchableOpacity>
//                     <Text style={styles.checkboxLabel}>I have read and agree to the terms</Text>
//                 </View>
//                 <TouchableOpacity
//                     style={[styles.button, { backgroundColor: isChecked ? '#06264D' : '#ccc' }]}
//                     disabled={!isChecked}
//                     onPress={handleAccept}
//                 >
//                     <Text style={styles.buttonText}>Accept and Continue</Text>
//                     <Icon name="arrow-forward" size={24} color="#FFF" />
//                 </TouchableOpacity>
//             </View>
//         </LinearGradient>
//     );
// }

// const styles = StyleSheet.create({
//     gradient: {
//         flex: 1,
//     },
//     imageAndHeaderContainer: {
//         flexGrow: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 10,
//         paddingTop: 30,
//     },
//     scrollViewContent: {
//         flexGrow: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 10,
//         paddingHorizontal: 20,
//     },
//     boxContainer: {
//         backgroundColor: '#fff', // White background for the box
//         borderRadius: 10, // Rounded corners for the box
//         borderWidth: 4, // Light border
//         borderColor: '#E0E0E0', // Light gray border color
//         padding: 20, // Padding inside the box
//         shadowColor: '#000', // Subtle shadow for elevation
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//         elevation: 3, // Elevation for Android shadow
//     },
//     content: {
//         flex: 1,
//     },
//     header: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#06264D',
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     text: {
//         fontSize: 16,
//         lineHeight: 24,
//         color: '#333',
//         marginBottom: 20,
//         textAlign: 'justify',
//     },
//     checkboxContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 30,
//     },
//     checkbox: {
//         width: 24,
//         height: 24,
//         borderWidth: 2,
//         borderColor: '#06264D',
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 4,
//         marginRight: 10,
//     },
//     checkmark: {
//         fontSize: 18,
//         color: '#FFF',
//     },
//     checkboxLabel: {
//         fontSize: 16,
//         color: '#333',
//         fontWeight: '500',
//     },
//     button: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#06264D',
//         borderRadius: 6,
//         paddingVertical: 12,
//         paddingHorizontal: 20,
//         marginTop: 20,
//     },
//     buttonDisabled: {
//         backgroundColor: '#B0BEC5',
//     },
//     buttonText: {
//         fontSize: 16,
//         color: '#FFF',
//         fontWeight: '600',
//         marginRight: 10,
//     },
//     image: {
//         width: 100, // Adjust width according to your need
//         height: 100, // Adjust height according to your need
//         marginBottom: 20,
//     },
// });


// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
// import Icon from '@expo/vector-icons/MaterialIcons';
// import { LinearGradient } from 'expo-linear-gradient';
// export default function TermsAndConditions({ navigation, route }) {
//     const [isChecked, setIsChecked] = useState(false);

//     const handleAccept = () => {
//         if (isChecked) {
//             route.params.onAccept();
//             navigation.goBack();
//         }
//     };

//     return (
//         <LinearGradient colors={['#06264D', '#FFF']} style={styles.gradient}>
//             <ScrollView contentContainerStyle={styles.scrollViewContent}>
//             <Image
//                     source={require("../assets/images/kgv.png")}
//                     style={styles.image}
//                 />
//                 <Text style={styles.header}>Terms and Conditions</Text>
//                 <Text style={styles.text}>
//                     These are the terms and conditions...
//                 </Text>
//                 <View style={styles.checkboxContainer}>
//                     <TouchableOpacity
//                         style={[styles.checkbox,{backgroundColor: isChecked ? '#06264D' : '#ccc'}]}
//                         onPress={() => setIsChecked(!isChecked)}
//                     >
//                         {isChecked && <Text style={styles.checkmark}>✔</Text>}
//                     </TouchableOpacity>
//                     <Text style={styles.checkboxLabel}>I have read and agree to the terms</Text>
//                 </View>
//                 <TouchableOpacity
//                     style={[styles.button, { backgroundColor: isChecked ? '#06264D' : '#ccc' }]}
//                     disabled={!isChecked}
//                     onPress={handleAccept}
//                 >
//                     <Text style={styles.buttonText}>Accept and Continue</Text>
//                     <Icon name="arrow-forward" size={24} color="#FFF" />
//                 </TouchableOpacity>
//             </ScrollView>
//             </LinearGradient>
//     );
// }

// const styles = StyleSheet.create({
//     gradient: {
//         flex: 1,
//     },
//     scrollViewContent: {
//         flexGrow: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         padding: 20,
//     },
//     boxContainer: {
//         backgroundColor: '#fff', // White background for the box
//         borderRadius: 10, // Rounded corners for the box
//         borderWidth: 4, // Light border
//         borderColor: '#E0E0E0', // Light gray border color
//         padding: 20, // Padding inside the box
//         shadowColor: '#000', // Subtle shadow for elevation
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//         elevation: 3, // Elevation for Android shadow
//     },
//     content: {
//         flex: 1,
//     },
//     header: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#06264D',
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     text: {
//         fontSize: 16,
//         lineHeight: 24,
//         color: '#333',
//         marginBottom: 20,
//         textAlign: 'justify',
//     },
//     checkboxContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 30,
//     },
//     checkbox: {
//         width: 24,
//         height: 24,
//         borderWidth: 2,
//         borderColor: '#06264D',
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 4,
//         marginRight: 10,
//     },
//     checkmark: {
//         fontSize: 18,
//         color: '#FFF',
//     },
//     checkboxLabel: {
//         fontSize: 16,
//         color: '#333',
//         fontWeight: '500',
//     },
//     button: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#06264D',
//         borderRadius: 6,
//         paddingVertical: 12,
//         paddingHorizontal: 20,
//         marginTop: 20,
//     },
//     buttonDisabled: {
//         backgroundColor: '#B0BEC5',
//     },
//     buttonText: {
//         fontSize: 16,
//         color: '#FFF',
//         fontWeight: '600',
//         marginRight: 10,
//     },
//     image: {
//         width: 100, // Adjust width according to your need
//         height: 100, // Adjust height according to your need
//         marginBottom: 20,
//     },
// });