import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './MainNavigator';
import { AuthProvider } from './screens/AuthContext.js'; 

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}



// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { Provider } from 'react-redux';
// import store from './app/store';
// import MainNavigator from './MainNavigator';
// import { SocketProvider } from './SocketContext';
// import { getToken } from './Token';

// export default function App() {
//   // Replace with your logic to get the token (e.g., from Redux, AsyncStorage, or an API)
//   const token = getToken('token');

//   return (
//     <Provider store={store}>
//       <SocketProvider token={token}>
//         <NavigationContainer>
//           <MainNavigator />
//         </NavigationContainer>
//       </SocketProvider>
//     </Provider>
//   );
// }
