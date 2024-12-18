import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Landing from './screens/Landing';
import FlowSelect from './screens/FlowSelect';
import Marketplace from './screens/Marketplace';
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
import WebSocketScreen from './screens/WebSocketScreen';
import CargoDetails from './screens/CargoDetails';
import BrokerDashboard from './screens/BrokerDashboard';
import DriverDashboard from './screens/DriverDashboard';

const Stack = createNativeStackNavigator();

export default () => {
   return (
      <>
         <Stack.Navigator initialRouteName='Landing' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Landing" component={Landing} />
            <Stack.Screen name="FlowSelect" component={FlowSelect} />
            <Stack.Screen name="FlowSelectregistation" component={FlowSelectregistation} />
            <Stack.Screen name="Marketplace" component={Marketplace} />
            <Stack.Screen name="LoginCons" component={LoginCons} />
            <Stack.Screen name="LoginVsp" component={LoginVsp} />
            <Stack.Screen name="RegisterCons" component={RegisterCons} />
            <Stack.Screen name="RegisterVsp" component={RegisterVsp} />
            <Stack.Screen name="ConsumerDashboard" component={ConsumerDashboard} />
            <Stack.Screen name="OwnerDashboard" component={OwnerDashboard} />
            <Stack.Screen name="BrokerDashboard" component={BrokerDashboard} />
            <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
            <Stack.Screen name="Kyc2" component={Kyc2} />
            <Stack.Screen name="Trips" component={Trips} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="UpdateUserProfile" component={UpdateUserProfile} />
            <Stack.Screen name="AddVehicleScreen" component={AddVehicleScreen} />
            <Stack.Screen name="GoogleMap" component={GoogleMap} />
            <Stack.Screen name="GetVehicleScreen" component={GetVehicleScreen} />
            <Stack.Screen name="UpdateVehicleScreen" component={UpdateVehicleScreen} />
            <Stack.Screen name="WebSocketScreen" component={WebSocketScreen} />
            <Stack.Screen name="CargoDetails" component={CargoDetails} />
         </Stack.Navigator>
      </>
   );
}