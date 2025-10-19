import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/userSlice';
import colors from '../../theme/colors';
import { fontSizes, fontWeights } from '../../theme/fonts';
import metrics from '../../theme/metrics';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = () => {
    // Simulate login - replace with actual API call
    if (email && password) {
      dispatch(setUser({ email, name: 'User' }));
    } else {
      Alert.alert('Error', 'Please enter email and password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.linkBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: metrics.Hspacing.xl,
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: metrics.Hspacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    marginBottom: metrics.Hspacing.xl,
  },
  formContainer: {
    marginTop: metrics.Hspacing.lg,
  },
  input: {
    height: metrics.inputHeight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: metrics.borderRadius.md,
    paddingHorizontal: metrics.Hspacing.md,
    marginBottom: metrics.Hspacing.md,
    fontSize: fontSizes.md,
    backgroundColor: colors.white,
  },
  button: {
    height: metrics.buttonHeight,
    backgroundColor: colors.primary,
    borderRadius: metrics.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: metrics.Hspacing.md,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
  linkText: {
    textAlign: 'center',
    marginTop: metrics.Hspacing.lg,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  linkBold: {
    color: colors.primary,
    fontWeight: fontWeights.semibold,
  },
});
