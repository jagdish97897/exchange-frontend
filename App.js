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
