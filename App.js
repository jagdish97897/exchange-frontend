import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './app/store';
import MainNavigator from './MainNavigator';

export default function App() {

  return (
    <Provider store={store} >
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </Provider>
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
