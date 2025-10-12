import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, triggerReturnToSplash } from '../../redux/slices/userSlice';
import colors from '../../theme/colors';
import { fontSizes, fontWeights } from '../../theme/fonts';
import metrics from '../../theme/metrics';

export default function OtpScreen({ navigation }) {
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user.tempEmail);

  // State for 6 OTP digits
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isValidating, setIsValidating] = useState(false);

  // Refs for each input box
  const inputRefs = useRef([]);

  useEffect(() => {
    // Auto-focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Auto-validate when all 6 digits are entered
  useEffect(() => {
    const otpValue = otp.join('');
    if (otpValue.length === 6 && !isValidating) {
      validateOtp(otpValue);
    }
  }, [otp]);

  const handleOtpChange = (value, index) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      return;
    }

    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validateOtp = (otpValue) => {
    setIsValidating(true);

    // Check if OTP is 999999
    if (otpValue === '999999') {
      // Success! Log in the user
      setTimeout(() => {
        dispatch(
          setUser({
            id: Date.now(),
            email: email || 'user@example.com',
            name: email?.split('@')[0] || 'User',
            avatar: null,
          })
        );
        setIsValidating(false);
      }, 500);
    } else {
      // Invalid OTP
      setTimeout(() => {
        Alert.alert('Invalid OTP', 'Please enter the correct OTP code (999999)', [
          {
            text: 'OK',
            onPress: () => {
              setOtp(['', '', '', '', '', '']);
              inputRefs.current[0]?.focus();
              setIsValidating(false);
            },
          },
        ]);
      }, 500);
    }
  };

  const handleResendOtp = () => {
    Alert.alert('OTP Sent', 'A new OTP has been sent to your email');
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.subtitle}>
              We've sent a verification code to{'\n'}
              <Text style={styles.email}>{email || 'your email'}</Text>
            </Text>
          </View>

          {/* OTP Input Boxes */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  digit ? styles.otpInputFilled : null,
                  isValidating ? styles.otpInputValidating : null,
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                editable={!isValidating}
              />
            ))}
          </View>

          {/* Validating Text */}
          {isValidating && <Text style={styles.validatingText}>Validating OTP...</Text>}

          {/* Resend OTP */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code? </Text>
            <TouchableOpacity onPress={handleResendOtp} disabled={isValidating}>
              <Text style={styles.resendLink}>Resend OTP</Text>
            </TouchableOpacity>
          </View>

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => dispatch(triggerReturnToSplash())}
            disabled={isValidating}
          >
            <Text style={styles.backButtonText}>← Back to Login</Text>
          </TouchableOpacity>

          {/* Hint Text */}
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>💡 Hint: Enter 999999 to verify</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: metrics.spacing.xl,
  },
  content: {
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: metrics.spacing.xxl || 40,
  },
  title: {
    fontSize: fontSizes.xxxl || 32,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: metrics.spacing.sm || 8,
  },
  subtitle: {
    fontSize: fontSizes.md || 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  email: {
    color: colors.primary,
    fontWeight: fontWeights.semibold,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: metrics.spacing.xl || 32,
    gap: 12,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: colors.border || '#E0E0E0',
    borderRadius: metrics.borderRadius.md || 12,
    textAlign: 'center',
    fontSize: fontSizes.xxl || 24,
    fontWeight: fontWeights.bold,
    color: colors.text,
    backgroundColor: colors.white,
  },
  otpInputFilled: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(255, 107, 157, 0.05)',
  },
  otpInputValidating: {
    borderColor: colors.success || '#34C759',
    backgroundColor: 'rgba(52, 199, 89, 0.05)',
  },
  validatingText: {
    fontSize: fontSizes.md,
    color: colors.success || '#34C759',
    fontWeight: fontWeights.semibold,
    marginTop: -metrics.spacing.lg || -16,
    marginBottom: metrics.spacing.lg || 16,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: metrics.spacing.lg || 16,
  },
  resendText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  resendLink: {
    fontSize: fontSizes.md,
    color: colors.primary,
    fontWeight: fontWeights.semibold,
  },
  backButton: {
    marginTop: metrics.spacing.xxl || 40,
    paddingVertical: metrics.spacing.md || 12,
  },
  backButtonText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  hintContainer: {
    marginTop: metrics.spacing.xxl || 40,
    padding: metrics.spacing.md || 12,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: metrics.borderRadius.md || 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 157, 0.2)',
  },
  hintText: {
    fontSize: fontSizes.sm || 14,
    color: colors.primary,
    textAlign: 'center',
  },
});
