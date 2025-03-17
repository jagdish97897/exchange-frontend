import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from './context/AuthContext.js'; // Import useAuth hook

// Import all the screens
import Landing from './screens/Landing';
// import FlowSelect from './screens/FlowSelect';
import LoginCons from './screens/LoginCons';
import LoginVsp from './screens/LoginVsp';
import FlowSelectregistation from './screens/FlowSelectregistation';
import RegisterCons from './screens/RegisterCons';
import RegisterVsp from './screens/RegisterVsp';
import ConsumerDashboard from './screens/ConsumerDashboard';
import Kyc2 from './screens/Kyc2';
import Trips from './screens/Trips';
import Profile from './screens/Profile';
import UpdateUserProfile from './screens/UpdateUserProfile';
import OwnerDashboard from './screens/OwnerDashboard';
import AddVehicleScreen from './screens/AddVehicleScreen';
import GetVehicleScreen from './screens/GetVehicleScreen';
import UpdateVehicleScreen from './screens/UpdateVehicleScreen';
import GoogleMap from './screens/GoogleMap';
import CargoDetails from './screens/CargoDetails';
import BrokerDashboard from './screens/BrokerDashboard';
import DriverDashboard from './screens/DriverDashboard';
import TripDetails from './screens/TripDetails';
import TripSummary from './screens/TripSummary';
import TripScreen from './screens/TripScreen';
import ViewDetails from './screens/ViewDetails';
import TripScreen1 from './screens/TripScreen1';
import AddWalletAmount from './screens/AddWalletAmount.js';
import Wallet from './screens/Wallet.js';
import WithdrawWalletAmount from './screens/WithdrawWalletAmount.js';
import ViewDetails1 from './screens/ViewDetails1.js';
import UserDashboard from './screens/UserDashboard.js';
import DriverLocation from './screens/DriverLocation.js';


const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // Protected routes for authenticated users
        <>
          <Stack.Screen name="Kyc2" component={Kyc2} />
          <Stack.Screen name="ConsumerDashboard" component={ConsumerDashboard} />
          <Stack.Screen name="OwnerDashboard" component={OwnerDashboard} />
          <Stack.Screen name="BrokerDashboard" component={BrokerDashboard} />
          <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
          <Stack.Screen name="Trips" component={Trips} />
          <Stack.Screen name="UserDashboard" component={UserDashboard} />
          <Stack.Screen name="DriverLocation" component={DriverLocation} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="UpdateUserProfile" component={UpdateUserProfile} />
          <Stack.Screen name="AddVehicleScreen" component={AddVehicleScreen} />
          <Stack.Screen name="GoogleMap" component={GoogleMap} />
          <Stack.Screen name="GetVehicleScreen" component={GetVehicleScreen} />
          <Stack.Screen name="UpdateVehicleScreen" component={UpdateVehicleScreen} />
          <Stack.Screen name="CargoDetails" component={CargoDetails} />
          <Stack.Screen name="TripDetails" component={TripDetails} />
          <Stack.Screen name="TripSummary" component={TripSummary} />
          <Stack.Screen name="TripScreen" component={TripScreen} />
          <Stack.Screen name="TripScreen1" component={TripScreen1} />
          <Stack.Screen name="ViewDetails" component={ViewDetails} />
          <Stack.Screen name="ViewDetails1" component={ViewDetails1} />
          <Stack.Screen name="AddWalletAmount" component={AddWalletAmount} />
          <Stack.Screen name="Wallet" component={Wallet} />
          <Stack.Screen name="WithdrawWalletAmount" component={WithdrawWalletAmount} />
        </>
      ) : (
        // Unprotected routes for unauthenticated users
        <>
          <Stack.Screen name="Landing" component={Landing} />

          {/* <Stack.Screen name="Landing" component={Notification} /> */}
          {/* <Stack.Screen name="FlowSelect" component={FlowSelect} /> */}
          <Stack.Screen name="FlowSelectregistation" component={FlowSelectregistation} />
          <Stack.Screen name="LoginCons" component={LoginCons} />
          <Stack.Screen name="LoginVsp" component={LoginVsp} />
          <Stack.Screen name="RegisterCons" component={RegisterCons} />
          <Stack.Screen name="RegisterVsp" component={RegisterVsp} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default MainNavigator;