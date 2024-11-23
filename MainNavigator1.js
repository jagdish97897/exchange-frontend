import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Landing1 from './screens1/Landing1';
import Login1 from './screens1/Login1';
import ForgotPin1 from './screens1/ForgotPin1';
import Welcome1 from './screens1/Welcome1';
import Profile1 from './screens1/Profile1';
import Ourproduct1 from './screens1/Ourproduct1';
import Visitordetails1 from './screens1/Visitordetails1';
import Visitorcharts1 from './screens1/Visitorcharts1';
import Visitorcharts2 from './screens1/Visitorcharts2';
import Visitorcomparechart1 from './screens1/Visitorcomparechart1';
import Visitorcomparechart2 from './screens1/Visitorcomparechart2';
import Recomanded1 from './screens1/Recomanded1';
import Recomanded2 from './screens1/Recomanded2';
import AddonitemToCart1 from './screens1/AddToCart1';
import AddonitemToCart2 from './screens1/AddToCart2';
import ViewCartItems1 from './screens1/ViewCartItems1';
import ViewCartItem2 from './screens1/ViewCartItem2';
import SummaryCart1 from './screens1/SummaryCart1';
import BookingKit1 from './screens1/BookingKit1';
import BookingCheckout1 from './screens1/BookingCheckout1';
import PaymentPage1 from './screens1/PaymentPage1';
import WalletScreen1 from './screens1/WalletScreen1';
import Visitordetails2 from './screens1/Visitordetails2';
import SummaryCart2 from './screens1/SummaryCart2';
import BookingKit2 from './screens1/BookingKit2';
import BookingCheckout2 from './screens1/BookingCheckout2';
import PaymentPage2 from './screens1/PaymentPage2';
import PaymentSuccess1 from './screens1/PaymentSuccess1';
import Viewallorders1 from './screens1/Viewallorders1';
import TermsAndConditions1 from './screens1/TermsAndConditions1';
import MediaImageUpload1 from './screens1/MediaImageUpload1';
import PaymentImageUpload1 from './screens1/PaymentImageUpload1';

const Stack = createNativeStackNavigator();

export default () => {
   return (
      <>
         <Stack.Navigator initialRouteName='Landing1' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Landing1" component={Landing1} />
            <Stack.Screen name="Login1" component={Login1} />
            <Stack.Screen name="ForgotPin1" component={ForgotPin1} />
            <Stack.Screen name="Welcome1" component={Welcome1} />
            <Stack.Screen name="Profile1" component={Profile1} />
            <Stack.Screen name="Ourproduct1" component={Ourproduct1} />
            <Stack.Screen name="Visitordetails1" component={Visitordetails1} />
            <Stack.Screen name="Visitordetails2" component={Visitordetails2} />
            <Stack.Screen name="Visitorcharts1" component={Visitorcharts1} />
            <Stack.Screen name="Visitorcharts2" component={Visitorcharts2} />
            <Stack.Screen name="Visitorcomparechart1" component={Visitorcomparechart1} />
            <Stack.Screen name="Visitorcomparechart2" component={Visitorcomparechart2} />
            <Stack.Screen name="Recomanded1" component={Recomanded1} />
            <Stack.Screen name="Recomanded2" component={Recomanded2} />
            <Stack.Screen name="AddToCart1" component={AddonitemToCart1} />
            <Stack.Screen name="AddToCart2" component={AddonitemToCart2} />
            <Stack.Screen name="ViewCartItems1" component={ViewCartItems1} />
            <Stack.Screen name="ViewCartItem2" component={ViewCartItem2} />
            <Stack.Screen name="SummaryCart1" component={SummaryCart1} />
            <Stack.Screen name="SummaryCart2" component={SummaryCart2} />
            <Stack.Screen name="BookingKit1" component={BookingKit1} />
            <Stack.Screen name="BookingKit2" component={BookingKit2} />
            <Stack.Screen name="BookingCheckout1" component={BookingCheckout1} />
            <Stack.Screen name="PaymentPage1" component={PaymentPage1} />
            <Stack.Screen name="PaymentPage2" component={PaymentPage2} />
            <Stack.Screen name="WalletScreen1" component={WalletScreen1} />
            <Stack.Screen name="BookingCheckout2" component={BookingCheckout2} />
            <Stack.Screen name="PaymentSuccess1" component={PaymentSuccess1} />
            <Stack.Screen name="Viewallorders1" component={Viewallorders1} />
            <Stack.Screen name="TermsAndConditions1" component={TermsAndConditions1} />
            <Stack.Screen name="MediaImageUpload1" component={MediaImageUpload1} />
            <Stack.Screen name="PaymentImageUpload1" component={PaymentImageUpload1} />
         </Stack.Navigator>
      </>
   );

}