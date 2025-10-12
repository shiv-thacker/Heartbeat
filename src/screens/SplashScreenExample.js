import { useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import SplashScreen from '../components/SplashScreen';
import AppNavigator from '../navigation/AppNavigator';

/**
 * Main App Component with Splash Screen
 * This is the entry point of the Heartbeat app
 * Shows the custom splash screen with authentication-aware animations
 */
export default function AppWithSplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [showNavigator, setShowNavigator] = useState(false);
  const user = useSelector((state) => state.user.info);
  const isLoggedIn = !!user;

  // Animated values for smooth transition
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const navigatorOpacity = useRef(new Animated.Value(0)).current;

  const handleAnimationFinish = () => {
    // Start smooth transition
    startTransition();
  };

  const startTransition = () => {
    // Show navigator first (but invisible)
    setShowNavigator(true);

    // Small delay to ensure Navigator is fully mounted and rendered
    setTimeout(() => {
      // Fade out splash and fade in navigator simultaneously
      Animated.parallel([
        Animated.timing(splashOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(navigatorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // After fade completes, hide splash completely
        setShowSplash(false);
      });
    }, 50); // Small delay to prevent white blink
  };

  // Watch for user login (only when user logs in during this session)
  // This useEffect should NOT trigger on app start when user is already logged in
  // The splash animation will handle the timing via onAnimationFinish callback

  return (
    <>
      {/* Splash Screen with fade out */}
      {showSplash && (
        <Animated.View style={[styles.screen, { opacity: splashOpacity }]}>
          <SplashScreen onAnimationFinish={handleAnimationFinish} skipAnimations={false} />
        </Animated.View>
      )}

      {/* App Navigator with fade in */}
      {showNavigator && (
        <Animated.View style={[styles.screen, { opacity: navigatorOpacity }]}>
          <AppNavigator />
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
  },
});
