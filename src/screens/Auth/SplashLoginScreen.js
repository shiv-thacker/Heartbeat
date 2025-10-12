import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setTempEmail } from '../../redux/slices/userSlice';
import colors from '../../theme/colors';
import { fontSizes, fontWeights } from '../../theme/fonts';
import metrics from '../../theme/metrics';

export default function SplashLoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');

  // Animation value for login form fade-in
  const formOpacity = useRef(new Animated.Value(0)).current;

  const handleSendOtp = () => {
    // Validate email
    if (!email || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    // Store email in Redux for OTP screen
    dispatch(setTempEmail(email));

    // Navigate to OTP screen
    navigation.navigate('OtpScreen');
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('Register');
  };

  // Fade in the login form when component mounts
  useEffect(() => {
    Animated.timing(formOpacity, {
      toValue: 1,
      duration: 800,
      delay: 300, // Small delay for better UX
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <Image
        source={require('../../assets/images/splash_background.png')}
        style={styles.backgroundImage}
        contentFit="cover"
      />

      {/* Heart Icon */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/heart_icon.png')}
          style={styles.heartIcon}
          contentFit="contain"
        />
        <Text style={styles.logoText}>Heartbeat</Text>
      </View>

      {/* Login Form with Fade-in Animation */}
      <Animated.View
        style={[
          styles.signInContainer,
          {
            opacity: formOpacity,
          },
        ]}
      >
        <View style={styles.signInBox}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor={colors.textTertiary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleSendOtp}>
            <Text style={styles.loginButtonText}>Send OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNavigateToRegister} style={styles.registerLink}>
            <Text style={styles.linkText}>
              Don't have an account? <Text style={styles.linkBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: colors.tertiary, // Match splash background color to prevent white blink
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
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    marginBottom: 100,
  },
  heartIcon: {
    width: 170,
    height: 170,
    marginBottom: -20,
  },
  logoText: {
    fontSize: 22,
    fontWeight: fontWeights.medium,
    color: colors.white,
    letterSpacing: 1,
    textAlign: 'center',
  },
  signInContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  signInBox: {
    width: '100%',
    padding: metrics.spacing.lg,
  },
  input: {
    width: '100%',
    height: metrics.inputHeight || 50,
    borderBottomWidth: 1,
    backgroundColor: colors.transparent,
    borderBottomColor: colors.border || '#E0E0E0',
    borderRadius: metrics.borderRadius.md || 8,
    marginBottom: metrics.spacing.md || 12,
    fontSize: fontSizes.md,
    color: colors.white,
  },
  loginButton: {
    height: metrics.buttonHeight || 50,
    backgroundColor: colors.white,
    borderRadius: metrics.borderRadius.md || 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: metrics.spacing.sm || 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
  registerLink: {
    marginTop: metrics.spacing.md || 12,
    alignItems: 'center',
  },
  linkText: {
    textAlign: 'center',
    fontSize: fontSizes.sm,
    color: colors.textTertiary,
  },
  linkBold: {
    color: colors.white,
    fontWeight: fontWeights.semibold,
  },
});
