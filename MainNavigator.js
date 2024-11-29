import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Landing from './screens/Landing';
import Register from './screens/Register';
import Login from './screens/Login';
import ForgotPin from './screens/ForgotPin';
import Welcome from './screens/Welcome';
import Ourproduct from './screens/Ourproduct';
import Visitordetails from './screens/Visitordetails';
import Visitorchart from './screens/Visitorchart';
import Visitorcomparechart from './screens/Visitorcomparechart';
import BookingKit from './screens/BookingKit';
import CheckoutButton from './screens/CheckoutButton';
import BookingCheckout from './screens/BookingCheckout';
import Recomanded from './screens/Recomanded';
import AddToCart from './screens/AddToCart';
import ViewCartItems from './screens/ViewCartItems';
import SummaryCart from './screens/SummaryCart';
import PaymentSuccess from './screens/PaymentSuccess';
import Viewallorders from './screens/Viewallorders';
import BillingSummary from './screens/BillingSummary';
import PaymentPage from './screens/PaymentPage';
import Congratulation from './screens/Congratulation';
import PaymentSuccessnew from './screens/PaymentSuccessnew';
import MultipleImageUpload from './screens/MediaImageUpload';
import PremiumUser from './screens/PremiumUser';
import KgvPaymentSuccess from './screens/KgvPaymantSuccess';
import UserNavigator from './UserNavigator';
import MainNavigator1 from './MainNavigator1';
import Register1 from './screens/Register1';
import SpinFeature from './screens/SpinFeature';
import TermsAndConditions from './screens/TermsAndConditions';
import PremiumPayment from './screens/PremiumPayment';
import PaymentImageUpload from './screens/PaymentImageUpload';
import ContestpaymentImageUpload from './screens/ContestpaymentImageUpload';
import PrimumpaymentImageUpload from './screens/PrimumpaymentImageUpload';
import FlowSelect from './screens/FlowSelect';
import Marketplace from './screens/Marketplace';
import LoginCons from './screens/LoginCons';
import LoginVsp from './screens/LoginVsp';
import FlowSelectregistation from './screens/FlowSelectregistation';
import RegisterCons from './screens/RegisterCons';
import RegisterVsp from './screens/RegisterVsp';
import HomePreKyc from './screens/HomePreKyc';
import Kyc2 from './screens/Kyc2';
import Trips from './screens/Trips';
import Profile from './screens/Profile';
import UpdateUserProfile from './screens/UpdateUserProfile';
import HomePreKycConsumer from './screens/HomePreKycConsumer';
import AddVehicleScreen from './screens/AddVehicleScreen';
import GetVehicleScreen from './screens/GetVehicleScreen';
import UpdateVehicleScreen from './screens/UpdateVehicleScreen';

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
            <Stack.Screen name="HomePreKyc" component={HomePreKyc} /> 
            <Stack.Screen name="HomePreKycConsumer" component={HomePreKycConsumer} /> 
            <Stack.Screen name="Kyc2" component={Kyc2} /> 
            <Stack.Screen name="Trips" component={Trips} /> 
            <Stack.Screen name="Profile" component={Profile} /> 
            <Stack.Screen name="UpdateUserProfile" component={UpdateUserProfile} /> 
            <Stack.Screen name="AddVehicleScreen" component={AddVehicleScreen} /> 
            <Stack.Screen name="GetVehicleScreen" component={GetVehicleScreen} /> 
            <Stack.Screen name="UpdateVehicleScreen" component={UpdateVehicleScreen} /> 
           
            

            <Stack.Screen name="ForgotPin" component={ForgotPin} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Register1" component={Register1} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Ourproduct" component={Ourproduct} />
            <Stack.Screen name="Visitordetails" component={Visitordetails} />
            <Stack.Screen name="Visitorchart" component={Visitorchart} />
            <Stack.Screen name="Visitorcomparechart" component={Visitorcomparechart} />
            <Stack.Screen name="Recomanded" component={Recomanded} />
            <Stack.Screen name="AddToCart" component={AddToCart} />
            <Stack.Screen name="ViewCartItems" component={ViewCartItems} />
            <Stack.Screen name="SummaryCart" component={SummaryCart} />
            <Stack.Screen name="BookingKit" component={BookingKit} />
            <Stack.Screen name="CheckoutButton" component={CheckoutButton} />
            <Stack.Screen name="BookingCheckout" component={BookingCheckout} />
            <Stack.Screen name="PaymentPage" component={PaymentPage} />
            <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
            <Stack.Screen name="Viewallorders" component={Viewallorders} />
            <Stack.Screen name="BillingSummary" component={BillingSummary} />
            <Stack.Screen name="Congratulation" component={Congratulation} />
            <Stack.Screen name="PaymentSuccessnew" component={PaymentSuccessnew} />
            <Stack.Screen name="MultipleImageUpload" component={MultipleImageUpload} />
            <Stack.Screen name="PremiumUser" component={PremiumUser} />
            <Stack.Screen name="KgvPaymentSuccess" component={KgvPaymentSuccess} />
            <Stack.Screen name="UserNavigator" component={UserNavigator} />
            <Stack.Screen name="SpinFeature" component={SpinFeature} />
            <Stack.Screen name="TermsAndConditions" component={TermsAndConditions} />
            <Stack.Screen name="PremiumPayment" component={PremiumPayment} />
            <Stack.Screen name="PaymentImageUpload" component={PaymentImageUpload} />
            <Stack.Screen name="MainNavigator1" component={MainNavigator1} />
            <Stack.Screen name="ContestpaymentImageUpload" component={ContestpaymentImageUpload} />
            <Stack.Screen name="PrimumpaymentImageUpload" component={PrimumpaymentImageUpload} />
         </Stack.Navigator>
      </>
   );

}