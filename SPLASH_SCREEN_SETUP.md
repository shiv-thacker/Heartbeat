# Heartbeat Logo Splash Screen Setup 🎨

Your beautiful Heartbeat logo has been integrated into the splash screen! Here's what has been configured and how to use it.

## ✨ What's Been Set Up

### 1. Expo Native Splash Screen

The `app.json` has been updated to use your Heartbeat logo:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/heartbeat_logo.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#FFDAB9",
          "dark": {
            "backgroundColor": "#1a1a1a"
          }
        }
      ]
    ]
  }
}
```

**Features:**

- ✅ Uses your `heartbeat_logo.png` as the splash image
- ✅ Warm peach background (`#FFDAB9`) that complements the logo
- ✅ Dark mode support with dark background
- ✅ 200px width with contain resize mode
- ✅ Also set as main app icon and web favicon

### 2. Custom Animated Splash Screen Component

Created `src/components/SplashScreen/SplashScreen.js` with:

- ✅ Smooth fade-in animation
- ✅ Scale animation for the logo
- ✅ Automatic timing (3 seconds total)
- ✅ Callback when animation finishes
- ✅ Beautiful warm peach background matching your logo

### 3. Updated Theme Colors

Added Heartbeat brand colors inspired by your logo gradient:

```javascript
export const colors = {
  // Heartbeat brand colors (inspired by the logo gradient)
  primary: '#FF6B9D', // Pink from logo gradient
  secondary: '#FFB347', // Peach from logo gradient
  tertiary: '#FF1493', // Magenta from logo gradient

  // Heartbeat gradient colors
  gradientStart: '#FFDAB9', // Light peach
  gradientEnd: '#FF1493', // Bright magenta
};
```

### 4. Gradient Background Component

Created `GradientBackground` component for consistent theming throughout your app.

## 🚀 How to Use

### Option 1: Native Splash Screen (Recommended)

The native splash screen will automatically show when your app launches. No code changes needed!

**To see it:**

1. Close your app completely
2. Reopen the app
3. You'll see your Heartbeat logo on the warm peach background

### Option 2: Custom Animated Splash Screen

For more control and animations, use the custom component:

```javascript
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AppNavigator from './navigation/AppNavigator';
import { SplashScreen } from '@components';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <SplashScreen onAnimationFinish={handleSplashFinish} />;
  }

  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
```

### Option 3: Use in Specific Screens

You can also use the splash screen component anywhere in your app:

```javascript
import { SplashScreen } from '@components';

const MyScreen = () => {
  const [showSplash, setShowSplash] = useState(true);

  return showSplash ? (
    <SplashScreen onAnimationFinish={() => setShowSplash(false)} />
  ) : (
    <YourContent />
  );
};
```

## 🎨 Customization Options

### Change Splash Screen Colors

Edit `app.json` to change the background colors:

```json
{
  "backgroundColor": "#YOUR_COLOR", // Light mode
  "dark": {
    "backgroundColor": "#YOUR_DARK_COLOR" // Dark mode
  }
}
```

### Adjust Animation Timing

Modify `src/components/SplashScreen/SplashScreen.js`:

```javascript
// Change animation duration (currently 1000ms)
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 1000, // Animation duration
  useNativeDriver: true,
}),
  // Change delay before calling onFinish (currently 2000ms for total 3 seconds)
  setTimeout(() => {
    if (onAnimationFinish) {
      onAnimationFinish();
    }
  }, 2000); // Total splash duration is 3 seconds (1s animation + 2s delay)
```

### Add True Gradient Background

For a real gradient effect, install expo-linear-gradient:

```bash
expo install expo-linear-gradient
```

Then update `src/components/GradientBackground/GradientBackground.js`:

```javascript
import { LinearGradient } from 'expo-linear-gradient';

export default function GradientBackground({ children, style }) {
  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );
}
```

## 📱 Platform-Specific Notes

### iOS

- The splash screen will show during app launch
- Uses the native iOS splash screen system
- Automatically handles different screen sizes

### Android

- Shows during app initialization
- Uses Android's splash screen API
- Respects the adaptive icon configuration

### Web

- Shows briefly during app load
- Uses the favicon as the web icon
- Falls back to the background color if image fails to load

## 🔧 Troubleshooting

### Splash Screen Not Showing

1. **Clear cache:** `expo start -c`
2. **Rebuild:** Close and reopen the app completely
3. **Check path:** Ensure `./assets/images/heartbeat_logo.png` exists

### Image Not Loading

1. **Check file size:** Keep under 1MB for best performance
2. **Check format:** PNG is recommended
3. **Check dimensions:** Square aspect ratio works best

### Animation Not Working

1. **Check import:** Ensure you're importing from `@components`
2. **Check callback:** Make sure `onAnimationFinish` is provided
3. **Check state:** Ensure you're managing the loading state properly

## 🎯 Best Practices

### Performance

- Keep splash screen duration reasonable (2-3 seconds max)
- Use optimized image formats (PNG with compression)
- Avoid heavy operations during splash screen

### User Experience

- Show splash screen only when necessary (app launch, major transitions)
- Provide visual feedback that the app is loading
- Consider showing progress indicators for longer loading times

### Branding

- Keep splash screen consistent with your app's design
- Use your brand colors and logo
- Test on both light and dark modes

## 📝 Example Implementation

Here's a complete example of integrating the splash screen with authentication:

```javascript
import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AppNavigator from './navigation/AppNavigator';
import { SplashScreen } from '@components';
import { useAuth } from '@hooks/useAuth';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { getProfile } = useAuth();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if user is already authenticated
        await getProfile();
      } catch (error) {
        // User not authenticated, that's okay
        console.log('User not authenticated');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <SplashScreen onAnimationFinish={() => {}} />;
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
```

## 🎉 Summary

Your Heartbeat logo is now beautifully integrated into:

1. ✅ **Native splash screen** - Shows on app launch
2. ✅ **App icon** - Your logo is the main app icon
3. ✅ **Web favicon** - Shows in browser tabs
4. ✅ **Custom component** - For advanced animations
5. ✅ **Theme colors** - Brand colors matching your logo
6. ✅ **Gradient background** - Consistent theming

The setup is complete and ready to use! Your users will see your beautiful gradient heart logo every time they open the app. 💖

## 🚀 Next Steps

1. **Test the splash screen:** Close and reopen your app
2. **Customize timing:** Adjust animation duration if needed
3. **Add gradient:** Install expo-linear-gradient for true gradients
4. **Integrate with auth:** Use the example above for authentication flow

Your Heartbeat app now has a professional, branded splash screen experience! 🎨✨
