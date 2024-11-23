import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './app/store';
import MainNavigator from './MainNavigator';
import { useSelector, useDispatch } from 'react-redux';
import { checkUserAsync, selectError, selectLoggedInUser } from './features/auth/authSlice';
import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DeepLinkHandler from './DeepLinkHandler';

export default function App() {

  useEffect(() => {
    handleReferralLink();
  }, []);


  const handleReferralLink = async () => {
    try {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        const urlParams = new URLSearchParams(initialUrl.split('?')[1]);
        const referralCode = urlParams.get('referralCode');

        if (referralCode) {
          trackReferral(referralCode);
        }
      }
    } catch (error) {
      console.log('Error extracting referral code:', error.message);
    }
  };

  const trackReferral = async (referralCode) => {
    try {
      // Make an API call to track the referral
      const response = await fetch('http://192.168.1.5:8005/api/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referralCode,
          referredUser: 'NEW_USER_ID', // Replace with logic to get new user's ID
        }),
      });

      if (response.ok) {
        console.log('Referral tracked successfully');
      }
    } catch (error) {
      console.log('Error tracking referral:', error.message);
    }
  };



  return (
    <Provider store={store} >
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </Provider>
  );
}

// import { NavigationContainer } from '@react-navigation/native';
// // import { ToastProvider } from 'react-native-toast-notifications'
// import { Provider } from 'react-redux';
// import store from './app/store';
// import MainNavigator from './MainNavigator';
// import { useSelector, useDispatch } from 'react-redux';
// import { checkUserAsync, selectError, selectLoggedInUser } from './features/auth/authSlice';
// import { useEffect } from 'react';
// import { Linking } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import MainNavigator1 from './MainNavigator1';

// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// const Tab = createBottomTabNavigator();

// export default function App() {
//   // const navigation = useNavigation();

//   useEffect(() => {
//     // Extract referral code when app starts
//     handleReferralLink();
//   }, []);


//   const handleReferralLink = async () => {
//     try {
//       const initialUrl = await Linking.getInitialURL();
//       if (initialUrl) {
//         const urlParams = new URLSearchParams(initialUrl.split('?')[1]);
//         const referralCode = urlParams.get('referralCode');

//         if (referralCode) {
//           // console.log("Referral code:", referralCode);
//           // Call a function to track the referral
//           trackReferral(referralCode);
//         }
//       }
//     } catch (error) {
//       console.log('Error extracting referral code:', error.message);
//     }
//   };
//   const trackReferral = async (referralCode) => {
//     try {
//       // Make an API call to track the referral
//       const response = await fetch('http://192.168.1.5:8005/api/referrals', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           referralCode,
//           referredUser: 'NEW_USER_ID', 
//         }),
//       });

//       if (response.ok) {
//         console.log('Referral tracked successfully');
//       }
//     } catch (error) {
//       console.log('Error tracking referral:', error.message);
//     }
//   };



//   return (
//     // <ToastProvider>
//     <Provider store={store} >
//       <NavigationContainer>
//       <Tab.Navigator>
//           <Tab.Screen name="Module1" component={MainNavigator} />
//           <Tab.Screen name="Module2" component={MainNavigator1} />
//         </Tab.Navigator>
//       </NavigationContainer>
//     </Provider>
//     // </ToastProvider>
//   );
// }