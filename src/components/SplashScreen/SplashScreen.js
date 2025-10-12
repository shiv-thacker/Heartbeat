import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Alert, Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setTempEmail } from '../../redux/slices/userSlice';
import colors from '../../theme/colors';
import { fontSizes, fontWeights } from '../../theme/fonts';
import metrics from '../../theme/metrics';

export default function SplashScreen({
  onAnimationFinish,
  onNavigateToRegister,
  onNavigateToOtp,
  skipAnimations = false,
}) {
  const user = useSelector((state) => state.user.info);
  const isLoggedIn = !!user;
  const dispatch = useDispatch();

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Debug logging
  console.log('SplashScreen - User:', user);
  console.log('SplashScreen - IsLoggedIn:', isLoggedIn);
  console.log('SplashScreen - SkipAnimations:', skipAnimations);

  // Animation values for pop-up effect
  const iconScale = new Animated.Value(skipAnimations ? 1 : 0);
  const iconOpacity = new Animated.Value(skipAnimations ? 1 : 0);
  const textOpacity = new Animated.Value(skipAnimations ? 1 : 0);
  const iconTranslateY = new Animated.Value(skipAnimations ? -100 : 0);
  const signInOpacity = new Animated.Value(skipAnimations ? 1 : 0);

  const handleSendOtp = () => {
    // Validate email
    if (!email || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    // Store email in Redux for OTP screen
    dispatch(setTempEmail(email));

    // Navigate to OTP screen
    if (onNavigateToOtp) {
      onNavigateToOtp(email);
    }
  };

  useEffect(() => {
    // If skipAnimations is true, don't run any animations - login form is already visible
    if (skipAnimations) {
      return;
    }

    // Start icon fade in immediately
    Animated.timing(iconOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Start the pop-up animation with dramatic bounce
    Animated.spring(iconScale, {
      toValue: 1.2, // Overshoot for bounce effect
      tension: 400, // High tension for dramatic pop
      friction: 8, // Balanced friction for smooth bounce
      useNativeDriver: true,
    }).start(() => {
      // Immediately start settling back (no delay)
      Animated.spring(iconScale, {
        toValue: 1, // Back to normal size
        tension: 600, // Very high tension for quick settle
        friction: 12, // High friction for immediate stop
        useNativeDriver: true,
      }).start();
    });

    // Start text fade in after a short delay
    setTimeout(() => {
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 1200);

    if (isLoggedIn) {
      // User is logged in - redirect to main app after animations complete (2.5 seconds)
      setTimeout(() => {
        if (onAnimationFinish) {
          onAnimationFinish();
        }
      }, 2500);
    } else {
      // User not logged in - after 1.5 seconds, move heart up and show sign-in fragment
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(iconTranslateY, {
            toValue: -100, // Move heart up
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(signInOpacity, {
            toValue: 1, // Show sign-in fragment
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();
      }, 1500);

      // Don't auto-finish - wait for user interaction
    }
  }, [isLoggedIn, skipAnimations]);

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <Image
        source={require('../../assets/images/splash_background.png')}
        style={styles.backgroundImage}
        contentFit="cover"
      />

      {/* Heart Icon with Pop-up Animation */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ translateY: iconTranslateY }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: iconOpacity,
              transform: [{ scale: iconScale }],
            },
          ]}
        >
          <Image
            source={require('../../assets/images/heart_icon.png')}
            style={styles.heartIcon}
            contentFit="contain"
          />
        </Animated.View>

        {/* Heartbeat Text */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textOpacity,
            },
          ]}
        >
          <Text style={styles.logoText}>Heartbeat</Text>
        </Animated.View>
      </Animated.View>

      {/* Login Form (only shown when not logged in) */}
      {!isLoggedIn && (
        <Animated.View
          style={[
            styles.signInContainer,
            {
              opacity: signInOpacity,
            },
          ]}
        >
          <View style={styles.signInBox}>
            {/* <Text style={styles.signInTitle}>Welcome to Heartbeat</Text>
            <Text style={styles.signInSubtitle}>Sign in to continue</Text> */}

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            /> */}

            <TouchableOpacity style={styles.loginButton} onPress={handleSendOtp}>
              <Text style={styles.loginButtonText}>Send OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onNavigateToRegister} style={styles.registerLink}>
              <Text style={styles.linkText}>
                Don't have an account? <Text style={styles.linkBold}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
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
    zIndex: 1, // Ensure content appears above background
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -20, // Reduced space between icon and text
  },
  heartIcon: {
    width: 170,
    height: 170,
  },
  textContainer: {
    alignItems: 'start',
    justifyContent: 'start',
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
    // backgroundColor: 'rgba(255, 255, 255, 0.98)',
    // borderRadius: 20,
    // padding: 24,
    // marginHorizontal: 24,
    // width: '90%',
    // maxWidth: 400,
    // shadowColor: colors.black,
    // shadowOffset: { width: 0, height: 8 },
    // shadowOpacity: 0.3,
    // shadowRadius: 12,
    // elevation: 12,
    padding: metrics.spacing.lg,
  },
  signInTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  signInSubtitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: metrics.spacing.lg,
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

    color: colors.textWhite,
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
