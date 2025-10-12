import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SplashScreen from '../components/SplashScreen';
import AppNavigator from '../navigation/AppNavigator';
import { resetReturnToSplash } from '../redux/slices/userSlice';

/**
 * Main App Component with Splash Screen
 * This is the entry point of the Heartbeat app
 * Shows the custom splash screen with authentication-aware animations
 */
export default function AppWithSplashScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [showMainApp, setShowMainApp] = useState(false);
  const [skipAnimations, setSkipAnimations] = useState(false);
  const [navigatingToRegister, setNavigatingToRegister] = useState(false);
  const user = useSelector((state) => state.user.info);
  const returnToSplash = useSelector((state) => state.user.returnToSplash);
  const isLoggedIn = !!user;
  const dispatch = useDispatch();

  const handleSplashFinish = () => {
    // Hide splash and show main app immediately
    setShowSplash(false);
    setShowMainApp(true);
  };

  const handleNavigateToRegister = () => {
    // Navigate to Register page
    setNavigatingToRegister(true);
    setShowSplash(false);
    setShowMainApp(true);
  };

  const handleNavigateToOtp = (email) => {
    // Navigate to OTP screen with email
    setNavigatingToRegister(true); // Use same flag to prevent logout detection
    setShowSplash(false);
    setShowMainApp(true);
    // Note: We'll pass the email to AppNavigator which will route to OtpScreen
  };

  // Watch for user login state changes
  useEffect(() => {
    // If user just logged in while splash is showing, redirect immediately
    if (isLoggedIn && showSplash) {
      // Small delay to ensure Redux state is updated
      const timer = setTimeout(() => {
        setShowSplash(false);
        setShowMainApp(true);
      }, 100);
      return () => clearTimeout(timer);
    }

    // If user just logged out, show splash with login form (no animations)
    // BUT only if we're not intentionally navigating to register
    if (!isLoggedIn && showMainApp && !navigatingToRegister) {
      setShowSplash(true);
      setShowMainApp(false);
      setSkipAnimations(true);
    }
  }, [isLoggedIn, showSplash, showMainApp, navigatingToRegister]);

  // Watch for return to splash trigger
  useEffect(() => {
    if (returnToSplash && !isLoggedIn) {
      setShowSplash(true);
      setShowMainApp(false);
      setSkipAnimations(true);
      setNavigatingToRegister(false); // Reset navigation flag
      dispatch(resetReturnToSplash()); // Reset the flag
    }
  }, [returnToSplash, isLoggedIn, dispatch]);

  if (showSplash) {
    return (
      <SplashScreen
        onAnimationFinish={handleSplashFinish}
        onNavigateToRegister={handleNavigateToRegister}
        onNavigateToOtp={handleNavigateToOtp}
        skipAnimations={skipAnimations}
      />
    );
  }

  if (showMainApp) {
    return <AppNavigator />;
  }

  // Fallback - should not reach here
  return <AppNavigator />;
}

/**
 * Usage Instructions:
 *
 * To use this in your app, replace the content of src/App.js with:
 *
 * import AppWithSplashScreen from './screens/SplashScreenExample';
 * export default AppWithSplashScreen;
 *
 * Or integrate the splash screen logic directly into your App.js:
 *
 * import React, { useState } from 'react';
 * import { Provider } from 'react-redux';
 * import { store } from './redux/store';
 * import AppNavigator from './navigation/AppNavigator';
 * import { SplashScreen } from '@components';
 *
 * export default function App() {
 *   const [isLoading, setIsLoading] = useState(true);
 *
 *   const handleSplashFinish = () => {
 *     setIsLoading(false);
 *   };
 *
 *   if (isLoading) {
 *     return <SplashScreen onAnimationFinish={handleSplashFinish} />;
 *   }
 *
 *   return (
 *     <Provider store={store}>
 *       <AppNavigator />
 *     </Provider>
 *   );
 * }
 */
