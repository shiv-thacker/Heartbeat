# Source Directory Structure

This is the main source directory for the Heartbeat React Native application. It follows a scalable and maintainable architecture pattern.

## Directory Structure

```
src/
├── api/                  # API calls, endpoints, networking helpers
│   ├── client.js        # API client configuration with interceptors
│   └── userApi.js       # User-related API endpoints
│
├── assets/              # Images, icons, fonts, etc.
│   ├── images/
│   └── icons/
│
├── components/          # Reusable UI components
│   ├── Button/
│   │   ├── Button.js
│   │   ├── styles.js
│   │   └── index.js
│   └── Input/
│       ├── Input.js
│       ├── styles.js
│       └── index.js
│
├── navigation/          # React Navigation setup
│   ├── AppNavigator.js      # Root navigator with conditional rendering
│   ├── AuthNavigator.js     # Authentication flow screens
│   ├── MainNavigator.js     # Main app screens
│   └── navigationTypes.js   # Route names and types
│
├── redux/               # Redux store, slices, actions, reducers
│   ├── store.js
│   ├── slices/
│   │   ├── userSlice.js      # User state management
│   │   └── settingsSlice.js  # App settings state
│   └── middlewares/
│       └── logger.js         # Redux logging middleware
│
├── screens/             # All screen components
│   ├── Auth/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   └── ForgotPasswordScreen.js
│   ├── Home/
│   │   ├── HomeScreen.js
│   │   └── ProfileScreen.js
│   └── Settings/
│       └── SettingsScreen.js
│
├── utils/               # Utility functions, constants, helpers
│   ├── constants.js
│   ├── helpers.js
│   └── validation.js
│
├── hooks/               # Custom React hooks
│   └── useAuth.js      # Authentication hook
│
├── theme/               # Design system (colors, spacing, typography)
│   ├── colors.js
│   ├── fonts.js
│   ├── metrics.js
│   └── index.js
│
├── App.js              # Entry point with Redux Provider
└── index.js            # Root component registration
```

## Key Features

### 1. Redux State Management

- Uses Redux Toolkit for simplified state management
- Pre-configured store with user and settings slices
- Easy to add new slices as your app grows

### 2. React Navigation

- Conditional navigation based on authentication state
- Separate navigators for auth and main flows
- Type-safe navigation with route definitions

### 3. API Client

- Centralized API client with automatic token management
- Built-in error handling and response parsing
- Easy to extend with new endpoints

### 4. Reusable Components

- Button and Input components with variants
- Consistent styling using theme system
- Easy to add new components

### 5. Theme System

- Centralized colors, fonts, and metrics
- Consistent spacing and sizing across the app
- Easy to switch between light/dark themes

### 6. Custom Hooks

- `useAuth` hook for all authentication operations
- Easy to create new custom hooks

## Usage Examples

### Using the Auth Hook

```javascript
import { useAuth } from '@hooks/useAuth';

const MyComponent = () => {
  const { login, loading, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      // Handle success
    }
  };
};
```

### Using Redux State

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@redux/slices/userSlice';

const MyComponent = () => {
  const user = useSelector((state) => state.user.info);
  const dispatch = useDispatch();

  dispatch(setUser({ name: 'John' }));
};
```

### Using API Client

```javascript
import { userApi } from '@api/userApi';

const getProfile = async () => {
  try {
    const data = await userApi.getProfile();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};
```

### Using Theme

```javascript
import colors from '@theme/colors';
import metrics from '@theme/metrics';

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: metrics.spacing.md,
    borderRadius: metrics.borderRadius.md,
  },
});
```

## Absolute Imports

This project is configured with absolute imports using `jsconfig.json`. You can import modules using the `@` prefix:

```javascript
import Button from '@components/Button';
import { useAuth } from '@hooks/useAuth';
import colors from '@theme/colors';
import { setUser } from '@redux/slices/userSlice';
```

## Best Practices

1. **Keep screens lightweight** - Move business logic to hooks, utils, or Redux slices
2. **Use the theme system** - Don't hardcode colors or spacing values
3. **Create reusable components** - If you use something more than once, make it a component
4. **Type your navigation** - Use TypeScript or add PropTypes for route params
5. **Handle errors gracefully** - Always handle API errors and show user-friendly messages
6. **Keep Redux slices focused** - Each slice should manage one domain of state
7. **Use custom hooks** - Extract complex logic into custom hooks for reusability

## Adding New Features

### Adding a New Screen

1. Create the screen component in `src/screens/YourFeature/`
2. Add the route to `src/navigation/navigationTypes.js`
3. Add the screen to the appropriate navigator

### Adding a New Redux Slice

1. Create the slice in `src/redux/slices/yourSlice.js`
2. Add the reducer to `src/redux/store.js`
3. Use the slice in your components

### Adding a New API Endpoint

1. Add the endpoint to the appropriate API file (e.g., `userApi.js`)
2. Or create a new API file for a new domain
3. Use the endpoint in your hooks or components

## Environment Variables

Copy `.env.example` to `.env` and configure your environment variables:

```
REACT_APP_API_URL=https://api.example.com
```
