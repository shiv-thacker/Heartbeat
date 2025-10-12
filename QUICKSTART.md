# Quick Start Guide 🚀

Get your Heartbeat app up and running in minutes!

## ⚡ Installation

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm start
```

That's it! All packages are already installed.

## 📱 Running the App

### Option 1: Expo Go (Easiest)

1. Download "Expo Go" app on your phone
2. Scan the QR code from the terminal
3. App will load on your device

### Option 2: iOS Simulator

```bash
npm run ios
```

### Option 3: Android Emulator

```bash
npm run android
```

### Option 4: Web Browser

```bash
npm run web
```

## 🎯 Testing the App

### Login Flow

1. App opens → Login screen appears
2. Enter any email/password (it's simulated)
3. Click "Login" → Home screen appears
4. Click "Logout" → Back to login

### Navigation

- From Home → Navigate to Settings
- From Home → Navigate to Profile
- From Login → Navigate to Register
- From Login → Navigate to Forgot Password

## 🔧 Configuration

### API Endpoint (Optional)

If you have a real API, configure it:

1. Create `.env` file:

```bash
cp .env.example .env
```

2. Edit `.env`:

```env
REACT_APP_API_URL=https://your-api.com
```

## 📝 Common Tasks

### Add a New Screen

```javascript
// 1. Create file: src/screens/YourFeature/NewScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '@theme/colors';

export default function NewScreen() {
  return (
    <View style={styles.container}>
      <Text>Your New Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

// 2. Add to MainNavigator.js
import NewScreen from '../screens/YourFeature/NewScreen';

<Stack.Screen name="NewScreen" component={NewScreen} />;

// 3. Navigate to it
navigation.navigate('NewScreen');
```

### Add Redux State

```javascript
// 1. Create slice: src/redux/slices/newSlice.js
import { createSlice } from '@reduxjs/toolkit';

const newSlice = createSlice({
  name: 'newFeature',
  initialState: { data: null },
  reducers: {
    setData(state, action) {
      state.data = action.payload;
    },
  },
});

export const { setData } = newSlice.actions;
export default newSlice.reducer;

// 2. Add to store.js
import newReducer from './slices/newSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    settings: settingsReducer,
    newFeature: newReducer, // Add this
  },
});

// 3. Use in components
import { useSelector, useDispatch } from 'react-redux';
import { setData } from '@redux/slices/newSlice';

const data = useSelector((state) => state.newFeature.data);
const dispatch = useDispatch();
dispatch(setData('Hello'));
```

### Add API Endpoint

```javascript
// Add to src/api/userApi.js
export const userApi = {
  // ... existing methods

  getStats: async () => {
    try {
      const response = await apiClient.get('/users/stats');
      return response;
    } catch (error) {
      throw error;
    }
  },
};
```

### Style with Theme

```javascript
import colors from '@theme/colors';
import { fontSizes, fontWeights } from '@theme/fonts';
import metrics from '@theme/metrics';

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary, // Use theme color
    padding: metrics.spacing.md, // Use theme spacing
    borderRadius: metrics.borderRadius.md, // Use theme radius
  },
  text: {
    fontSize: fontSizes.lg, // Use theme font size
    fontWeight: fontWeights.bold, // Use theme font weight
    color: colors.white, // Use theme color
  },
});
```

## 🐛 Troubleshooting

### Metro Bundler Issues

```bash
# Clear cache and restart
npm start -- --reset-cache
# or
expo start -c
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### iOS Specific Issues

```bash
# Clear iOS build
cd ios && pod install && cd ..
expo start -c
```

### Android Specific Issues

```bash
# Clear Android build
cd android && ./gradlew clean && cd ..
expo start -c
```

## 📚 Next Steps

1. **Read Documentation**

   - [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Detailed architecture
   - [src/README.md](./src/README.md) - Source code guide

2. **Explore the Code**

   - Check out `src/screens/` for screen examples
   - Look at `src/components/` for reusable components
   - Review `src/redux/slices/` for state management

3. **Customize**

   - Update colors in `src/theme/colors.js`
   - Add your logo to `src/assets/images/`
   - Configure your API in `.env`

4. **Build Features**
   - Add new screens
   - Create new components
   - Implement real API calls
   - Add more Redux slices

## 🎨 Customization Ideas

### Change Primary Color

```javascript
// src/theme/colors.js
export const colors = {
  primary: '#FF6B6B', // Change this to your brand color
  // ... rest
};
```

### Add Dark Mode

Already set up! Just toggle in Settings screen.

### Add More Fonts

```javascript
// src/theme/fonts.js
export const fonts = {
  regular: 'YourFont-Regular',
  bold: 'YourFont-Bold',
  // ... etc
};
```

## 💡 Tips

- ✅ Use absolute imports: `@components/Button` not `../../../components/Button`
- ✅ Use theme system for all styling
- ✅ Keep screens simple, move logic to hooks
- ✅ Handle API errors gracefully
- ✅ Test on both iOS and Android

## 🆘 Need Help?

- Check the [documentation](./PROJECT_STRUCTURE.md)
- Review example screens in `src/screens/`
- Look at existing components in `src/components/`

## 🎉 You're Ready!

Your app is fully set up with:

- ✅ Redux for state management
- ✅ Navigation with auth flow
- ✅ API client ready to use
- ✅ Theme system for styling
- ✅ Reusable components
- ✅ Custom hooks

Start building your amazing app! 🚀
