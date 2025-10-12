# Heartbeat 💓

A scalable React Native application built with Expo, Redux Toolkit, and React Navigation.

## 🎯 Features

- ✅ **Redux Toolkit** for state management
- ✅ **React Navigation** for routing
- ✅ **Authentication flow** with login/register
- ✅ **Centralized API client** with token management
- ✅ **Theme system** for consistent design
- ✅ **Reusable components** (Button, Input, etc.)
- ✅ **Custom hooks** for business logic
- ✅ **Absolute imports** for clean code
- ✅ **TypeScript ready** with jsconfig.json

## 📁 Project Structure

```
src/
├── api/                  # API client and endpoints
├── assets/               # Images, icons, fonts
├── components/           # Reusable UI components
├── hooks/                # Custom React hooks
├── navigation/           # React Navigation setup
├── redux/                # Redux store, slices, middlewares
├── screens/              # Screen components
├── theme/                # Colors, fonts, metrics
├── utils/                # Utility functions
├── App.js                # Main app component
└── index.js              # Entry point
```

📖 See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed documentation.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start the App

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

## 📦 Tech Stack

### Core

- **React Native** - Mobile framework
- **Expo** - Development platform
- **React** 19.1.0

### State Management

- **Redux Toolkit** - State management
- **React Redux** - React bindings

### Navigation

- **React Navigation** - Navigation library
- **Native Stack Navigator** - Native navigation

### Additional

- **React Native Screens** - Native screen optimization
- **React Native Safe Area Context** - Safe area handling

## 🎨 Design System

The app uses a centralized theme system:

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

## 🔐 Authentication

The app includes a complete authentication flow:

1. **Login Screen** - Email/password login
2. **Register Screen** - New user registration
3. **Forgot Password Screen** - Password reset
4. **Protected Routes** - Auth-based navigation

Use the `useAuth` hook for authentication operations:

```javascript
import { useAuth } from '@hooks/useAuth';

const { login, register, logout, user, loading, isAuthenticated } = useAuth();
```

## 📱 Screens

### Auth Screens

- `LoginScreen` - User login
- `RegisterScreen` - New user registration
- `ForgotPasswordScreen` - Password reset

### Main Screens

- `HomeScreen` - Main dashboard
- `ProfileScreen` - User profile
- `SettingsScreen` - App settings

## 🧩 Reusable Components

### Button Component

```javascript
import Button from '@components/Button';

<Button
  title="Submit"
  variant="primary" // primary, secondary, danger, outline
  size="medium" // small, medium, large
  onPress={handlePress}
  loading={isLoading}
/>;
```

### Input Component

```javascript
import Input from '@components/Input';

<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter email"
  error={emailError}
  secureTextEntry={false}
/>;
```

## 🔧 Development

### Using Absolute Imports

```javascript
// ✅ Good
import Button from '@components/Button';
import { useAuth } from '@hooks/useAuth';
import colors from '@theme/colors';

// ❌ Bad
import Button from '../../../components/Button';
```

### Adding a New Screen

1. Create screen in `src/screens/YourFeature/YourScreen.js`
2. Add route to `src/navigation/navigationTypes.js`
3. Add to appropriate navigator

### Adding a Redux Slice

1. Create slice in `src/redux/slices/yourSlice.js`
2. Add to `src/redux/store.js`
3. Use with `useSelector`/`useDispatch`

### Adding an API Endpoint

1. Add method to `src/api/userApi.js` or create new API file
2. Use the `apiClient` for consistent error handling
3. Call from components or hooks

## 🧪 Testing

```bash
# Run tests (when configured)
npm test

# Run linter
npm run lint
```

## 📱 Building for Production

### iOS

```bash
expo build:ios
# or with EAS
eas build --platform ios
```

### Android

```bash
expo build:android
# or with EAS
eas build --platform android
```

## 📚 Documentation

- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Detailed project structure
- [src/README.md](./src/README.md) - Source directory documentation

## 🤝 Contributing

1. Follow the existing folder structure
2. Use the theme system for styling
3. Create reusable components
4. Write clean, documented code
5. Test your changes

## 📄 Scripts

```bash
npm start          # Start Expo dev server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on Web
npm run lint       # Run ESLint
```

## 🛠️ Troubleshooting

### Clear Cache

```bash
expo start -c
```

### Reset Project

```bash
rm -rf node_modules
npm install
```

### iOS Build Issues

```bash
cd ios && pod install && cd ..
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=https://api.example.com
NODE_ENV=development
```

## 🔗 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Native](https://reactnative.dev/)

## 📄 License

[Your License Here]

---

**Built with ❤️ using React Native and Expo**
