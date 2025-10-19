import { Image } from 'expo-image';
import { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import colors from '../../theme/colors';
import { fontWeights } from '../../theme/fonts';

export default function SplashScreen({ onAnimationFinish, skipAnimations = false }) {
  const user = useSelector((state) => state.user.info);
  const isLoggedIn = !!user;

  // Animation values for pop-up effect
  const iconScale = new Animated.Value(skipAnimations ? 1 : 0);
  const iconOpacity = new Animated.Value(skipAnimations ? 1 : 0);
  const textOpacity = new Animated.Value(skipAnimations ? 1 : 0);

  useEffect(() => {
    // If skipAnimations is true, don't run any animations
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

    // After all animations complete, call finish callback
    setTimeout(() => {
      if (onAnimationFinish) {
        onAnimationFinish();
      }
    }, 2000);
  }, [skipAnimations]);

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <Image
        source={require('../../assets/images/splash_background.png')}
        style={styles.backgroundImage}
        contentFit="cover"
      />

      {/* Heart Icon with Pop-up Animation */}
      <Animated.View style={styles.logoContainer}>
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
    zIndex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -20,
  },
  heartIcon: {
    width: 170,
    height: 170,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: fontWeights.medium,
    color: colors.white,
    letterSpacing: 1,
    textAlign: 'center',
  },
});
