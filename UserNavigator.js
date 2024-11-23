import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Landing1 from './screens1/Landing1';

const Stack = createNativeStackNavigator();

export default () => {
    return (
        <Stack.Navigator initialRouteName='Landing1' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Landing1" component={Landing1} />
            {/* Add other user-related screens here */}
        </Stack.Navigator>
    );
};
