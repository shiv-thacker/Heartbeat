import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/store';
import AppWithSplashScreen from './screens/SplashScreenExample';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppWithSplashScreen />
      </PersistGate>
    </Provider>
  );
}
