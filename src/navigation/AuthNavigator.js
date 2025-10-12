import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import OtpScreen from '../screens/Auth/OtpScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import SplashLoginScreen from '../screens/Auth/SplashLoginScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SplashLogin">
      <Stack.Screen name="SplashLogin" component={SplashLoginScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
