import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import CommonText from '../../components/Text/index';
import { setUser } from '../../redux/slices/userSlice';
import colors from '../../theme/colors';
import { fontSizes, fontWeights } from '../../theme/fonts';
import metrics from '../../theme/metrics';

export default function OtpScreen({ navigation }) {
  const dispatch = useDispatch();
  const email = useSelector((state) => state.user.tempEmail);

  const ios = Platform.OS === 'ios';
  const { top } = useSafeAreaInsets();

  // State for 6 OTP digits
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isValidating, setIsValidating] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Refs for each input box
  const inputRefs = useRef([]);
  const timerRef = useRef(null);

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
      // Invalid OTP99
      setTimeout(() => {
        Alert.alert('Invalid Code', 'Please enter the correct OTP code (999999)', [
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
    if (!canResend) return;

    // Start 30-second countdown
    setResendTimer(30);
    setCanResend(false);

    // Start timer
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <Image
        source={require('../../assets/images/splash_background.png')}
        style={styles.backgroundImage}
        contentFit="cover"
      />

      {/* OTP Overlay */}
      <Image
        source={require('../../assets/images/otp_overlay.png')}
        style={styles.overlayImage}
        contentFit="cover"
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: ios ? top + metrics.Hspacing.lg : metrics.Hspacing.lg + 10 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <CommonText type="b1" color={colors.white}>
                Heartbeat
              </CommonText>
              <View style={{ height: metrics.Vspacing.md }}></View>
              <CommonText
                type="h3"
                style={{
                  textAlign: 'center',
                  letterSpacing: 1.5,
                  fontFamily: 'Times New Roman',
                  fontWeight: '400',
                }}
                color={colors.white}
              >
                WELCOME BACK{'\n'}MR.SHIVANG
              </CommonText>
              <View style={{ height: metrics.Vspacing.xxs }}></View>
              <CommonText
                type="body"
                color={colors.backgroundSecondary}
                style={{ textAlign: 'center' }}
              >
                Enter the verification code sent to your email{' '}
                <CommonText
                  type="body"
                  color={colors.backgroundSecondary}
                  style={{ fontWeight: 'bold' }}
                >
                  {email || 'your email'}
                </CommonText>
              </CommonText>
            </View>
            {/* OTP Input Boxes */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    styles.otpInput,
                    // digit ? styles.otpInputFilled : null,
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
          </View>
        </ScrollView>
        <View style={[styles.resendSection, { paddingBottom: ios ? 34 : metrics.Hspacing.lg }]}>
          <TouchableOpacity
            style={styles.resendButton}
            onPress={handleResendOtp}
            disabled={!canResend}
          >
            <Text style={[styles.resendButtonText, !canResend && styles.resendButtonDisabled]}>
              {canResend
                ? 'Resend Code'
                : `Resend Code in 00:${resendTimer.toString().padStart(2, '0')}`}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Resend OTP Section - Fixed at Bottom */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.tertiary, // Match splash background color
  },
  logoname: {
    color: colors.white,
    fontSize: fontSizes.md,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlayImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0, // Semi-transparent overlay
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'start',
    padding: metrics.Hspacing.lg,
  },
  content: {
    width: '100%',

    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: metrics.Vspacing.md || 40,
  },
  title: {
    fontSize: fontSizes.xxxl || 32,

    color: colors.white,
    letterSpacing: 1.5,
    marginBottom: metrics.Hspacing.sm || 8,
    fontFamily: 'Times New Roman',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.md || 16,
    color: colors.backgroundSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  email: {
    color: colors.backgroundSecondary,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: metrics.Hspacing.xl || 32,
    gap: 12,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: colors.backgroundSecondary,
    borderRadius: metrics.borderRadius.md || 12,
    textAlign: 'center',
    fontSize: fontSizes.xl || 24,

    color: colors.text,
    backgroundColor: colors.backgroundSecondary,
  },
  otpInputFilled: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(255, 107, 157, 0.05)',
  },
  otpInputValidating: {},
  validatingText: {
    fontSize: fontSizes.md,
    color: colors.white,
    fontWeight: fontWeights.semibold,
    marginTop: -metrics.Hspacing.lg || -16,
    marginBottom: metrics.Hspacing.lg || 16,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: metrics.Hspacing.lg || 16,
  },
  resendText: {
    fontSize: fontSizes.md,
    color: colors.white,
  },
  resendLink: {
    fontSize: fontSizes.md,
    color: colors.white,
    fontWeight: fontWeights.bold,
    textDecorationLine: 'underline',
  },
  backButton: {
    marginTop: metrics.Hspacing.xxl || 40,
    paddingVertical: metrics.Hspacing.md || 12,
  },
  backButtonText: {
    fontSize: fontSizes.md,
    color: colors.white,
    fontWeight: fontWeights.medium,
  },
  hintContainer: {
    marginTop: metrics.Hspacing.xxl || 40,
    padding: metrics.Hspacing.md || 12,
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
  resendSection: {
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    padding: metrics.Hspacing.md,
    alignItems: 'center',
  },
  resendButton: {
    paddingVertical: metrics.Hspacing.md,
    paddingHorizontal: metrics.Hspacing.xl,
  },
  resendButtonText: {
    fontSize: fontSizes.md,
    color: colors.white,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
  },
  resendButtonDisabled: {
    color: colors.backgroundSecondary,
    opacity: 0.7,
  },
});
