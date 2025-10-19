import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, fontWeights } from '../../theme/fonts';
import metrics from '../../theme/metrics';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    // Simulate password reset - replace with actual API call
    Alert.alert('Success', 'Password reset link has been sent to your email', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we'll send you a link to reset your password
      </Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>
            <Text style={styles.linkBold}>Back to Login</Text>
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
    lineHeight: 22,
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
  },
  linkBold: {
    color: colors.primary,
    fontWeight: fontWeights.semibold,
  },
});
