# Heartbeat - Project Structure Documentation

This document provides a comprehensive overview of the Heartbeat React Native application structure.

## 🏗️ Architecture Overview

This project follows a **scalable, maintainable architecture** with:

- **Redux Toolkit** for state management
- **React Navigation** for routing
- **Centralized API client** for networking
- **Theme system** for consistent design
- **Absolute imports** for clean code

---

## 📁 Complete Project Structure

```
Heartbeat/
├── android/                          # Android native code
├── ios/                             # iOS native code
├── node_modules/                    # Dependencies
│
├── src/                             # 🎯 Main source directory
│   ├── api/                         # API layer
│   │   ├── client.js               # Axios/fetch client with interceptors
│   │   └── userApi.js              # User-related API endpoints
│   │
│   ├── assets/                      # Static assets
│   │   ├── images/                 # Image files
│   │   └── icons/                  # Icon files
│   │
│   ├── components/                  # Reusable UI components
│   │   ├── Button/
│   │   │   ├── Button.js          # Component implementation
│   │   │   ├── styles.js          # Component styles
│   │   │   └── index.js           # Export file
│   │   └── Input/
│   │       ├── Input.js
│   │       ├── styles.js
│   │       └── index.js
│   │
│   ├── hooks/                       # Custom React hooks
│   │   └── useAuth.js              # Authentication hook
│   │
│   ├── navigation/                  # Navigation configuration
│   │   ├── AppNavigator.js         # Root navigator
│   │   ├── AuthNavigator.js        # Auth flow (Login, Register)
│   │   ├── MainNavigator.js        # Main app flow
│   │   └── navigationTypes.js      # Route names & types
│   │
│   ├── redux/                       # State management
│   │   ├── store.js                # Redux store configuration
│   │   ├── slices/
│   │   │   ├── userSlice.js       # User state
│   │   │   └── settingsSlice.js   # App settings state
│   │   └── middlewares/
│   │       └── logger.js          # Redux logger
│   │
│   ├── screens/                     # Screen components
│   │   ├── Auth/
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   └── ForgotPasswordScreen.js
│   │   ├── Home/
│   │   │   ├── HomeScreen.js
│   │   │   └── ProfileScreen.js
│   │   └── Settings/
│   │       └── SettingsScreen.js
│   │
│   ├── theme/                       # Design system
│   │   ├── colors.js               # Color palette
│   │   ├── fonts.js                # Typography
│   │   ├── metrics.js              # Spacing, sizes
│   │   └── index.js                # Theme exports
│   │
│   ├── utils/                       # Utility functions
│   │   ├── constants.js            # App constants
│   │   ├── helpers.js              # Helper functions
│   │   └── validation.js           # Form validation
│   │
│   ├── App.js                       # Main app component
│   ├── index.js                     # Entry point
│   └── README.md                    # Source docs
│
├── app/                             # (Old Expo Router structure - can be removed)
├── assets/                          # (Old assets - can be removed)
├── components/                      # (Old components - can be removed)
├── constants/                       # (Old constants - can be removed)
├── hooks/                           # (Old hooks - can be removed)
│
├── .env                             # Environment variables (create from .env.example)
├── .env.example                     # Environment template
├── .prettierrc                      # Prettier config
├── app.json                         # Expo configuration
├── eslint.config.js                 # ESLint configuration
├── expo-env.d.ts                    # Expo types
├── jsconfig.json                    # Absolute imports config
├── package.json                     # Dependencies
├── package-lock.json                # Locked dependencies
├── PROJECT_STRUCTURE.md             # This file
├── README.md                        # Main readme
└── tsconfig.json                    # TypeScript config
```

---

## 🔧 Key Technologies

### State Management

- **Redux Toolkit**: Modern Redux with less boilerplate
- **React Redux**: React bindings for Redux
- Slices: `userSlice`, `settingsSlice`

### Navigation

- **React Navigation**: Industry-standard navigation
- **Native Stack Navigator**: Native performance
- Conditional rendering based on auth state

### API Layer

- **Centralized client**: One place to configure all API calls
- **Token management**: Automatic auth token handling
- **Error handling**: Consistent error responses

### Styling

- **Theme system**: Centralized colors, fonts, metrics
- **StyleSheet**: React Native's optimized styles
- **Responsive**: Using metrics for consistent spacing

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API URL and other configs
```

### 3. Run the App

```bash
# Start Expo dev server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

---

## 📦 Installed Packages

### Core Dependencies

```json
{
  "@reduxjs/toolkit": "^2.9.0",
  "react-redux": "^9.2.0",
  "@react-navigation/native": "^7.1.18",
  "@react-navigation/native-stack": "^7.3.27",
  "react-native-screens": "~4.16.0",
  "react-native-safe-area-context": "~5.6.0",
  "expo": "~54.0.13"
}
```

All required packages are already installed. No need to run additional npm install commands.

---

## 💡 Usage Examples

### 1. Using Redux

#### Read from Store

```javascript
import { useSelector } from 'react-redux';

const MyComponent = () => {
  const user = useSelector((state) => state.user.info);
  const darkMode = useSelector((state) => state.settings.darkMode);

  return <Text>Hello, {user?.name}</Text>;
};
```

#### Dispatch Actions

```javascript
import { useDispatch } from 'react-redux';
import { setUser, logout } from '@redux/slices/userSlice';

const MyComponent = () => {
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(setUser({ name: 'John', email: 'john@example.com' }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };
};
```

### 2. Using Navigation

```javascript
const MyScreen = ({ navigation }) => {
  return <Button title="Go to Profile" onPress={() => navigation.navigate('Profile')} />;
};
```

### 3. Using API Client

```javascript
import { userApi } from '@api/userApi';

const fetchProfile = async () => {
  try {
    const profile = await userApi.getProfile();
    console.log(profile);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  }
};
```

### 4. Using Custom Hooks

```javascript
import { useAuth } from '@hooks/useAuth';

const LoginScreen = () => {
  const { login, loading, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      console.log('Login successful!');
    } else {
      console.error('Login failed:', result.error);
    }
  };
};
```

### 5. Using Theme

```javascript
import colors from '@theme/colors';
import { fontSizes, fontWeights } from '@theme/fonts';
import metrics from '@theme/metrics';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: metrics.spacing.md,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
});
```

### 6. Using Reusable Components

```javascript
import Button from '@components/Button';
import Input from '@components/Input';

const MyForm = () => {
  const [text, setText] = useState('');

  return (
    <>
      <Input label="Email" value={text} onChangeText={setText} placeholder="Enter email" />

      <Button title="Submit" variant="primary" size="medium" onPress={handleSubmit} />
    </>
  );
};
```

---

## 🎨 Theme System

### Colors

```javascript
colors.primary; // #007AFF
colors.secondary; // #5856D6
colors.success; // #34C759
colors.danger; // #FF3B30
colors.warning; // #FF9500
colors.background; // #FFFFFF
colors.text; // #000000
// ... and more
```

### Spacing

```javascript
metrics.spacing.xs; // 4
metrics.spacing.sm; // 8
metrics.spacing.md; // 16
metrics.spacing.lg; // 24
metrics.spacing.xl; // 32
```

### Font Sizes

```javascript
fontSizes.xs; // 12
fontSizes.sm; // 14
fontSizes.md; // 16
fontSizes.lg; // 18
fontSizes.xl; // 20
fontSizes.xxl; // 24
fontSizes.xxxl; // 32
```

---

## 🔐 Authentication Flow

1. User opens app → `AppNavigator` checks Redux state
2. If no user → Show `AuthNavigator` (Login/Register)
3. User logs in → `useAuth` hook calls API
4. API returns token + user data
5. Token saved, user data stored in Redux
6. `AppNavigator` re-renders → Shows `MainNavigator`
7. User logs out → Token removed, Redux cleared
8. Back to `AuthNavigator`

---

## 📝 Best Practices

### ✅ DO

- Use absolute imports (`@components/Button` instead of `../../../components/Button`)
- Use the theme system for all colors, spacing, fonts
- Create reusable components for repeated UI patterns
- Keep screens lightweight, move logic to hooks/slices
- Handle all API errors gracefully
- Use TypeScript or PropTypes for type safety
- Keep Redux slices focused on one domain

### ❌ DON'T

- Don't hardcode colors or spacing values
- Don't put business logic in screen components
- Don't create inline styles for repeated patterns
- Don't ignore error handling
- Don't create massive components (split them!)
- Don't commit `.env` file

---

## 🆕 Adding New Features

### Add a New Screen

1. Create screen in `src/screens/YourFeature/YourScreen.js`
2. Add route to `src/navigation/navigationTypes.js`
3. Add screen to appropriate navigator

### Add a New Redux Slice

1. Create slice in `src/redux/slices/yourSlice.js`
2. Import and add to `src/redux/store.js`
3. Use in components with `useSelector`/`useDispatch`

### Add a New API Endpoint

1. Add method to appropriate API file (e.g., `userApi.js`)
2. Or create new API file for new domain
3. Use in hooks or components

### Add a New Component

1. Create folder in `src/components/YourComponent/`
2. Create `YourComponent.js`, `styles.js`, `index.js`
3. Use theme system for styling
4. Export from `index.js`

---

## 🧪 Testing Strategy

### Unit Tests

- Test Redux slices (actions, reducers)
- Test utility functions
- Test custom hooks

### Integration Tests

- Test API client
- Test navigation flows
- Test authentication flow

### E2E Tests

- Test critical user journeys
- Test on real devices

---

## 🚢 Deployment

### iOS

```bash
expo build:ios
# or
eas build --platform ios
```

### Android

```bash
expo build:android
# or
eas build --platform android
```

---

## 📚 Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Navigation Documentation](https://reactnavigation.org/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)

---

## 🤝 Contributing

1. Follow the existing folder structure
2. Use the established patterns
3. Write clean, readable code
4. Comment complex logic
5. Test your changes
6. Update documentation

---

## 📄 License

[Your License Here]

---

**Happy Coding! 🚀**
