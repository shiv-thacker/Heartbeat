# Splash Screen with Integrated Login

## Overview

The splash screen now includes a full login form that appears after the heart animation when the user is not logged in.

## Features

### ✨ Animations

- **Heart Icon**: Pops up with dramatic bounce effect (0-1.2x-1.0x scale)
- **Text**: "Heartbeat" text fades in smoothly after the icon
- **Login Form**: Slides in from bottom when user is not logged in

### 🔐 Authentication States

#### **Logged In User**

```
1. Heart icon pops up with bounce
2. "Heartbeat" text fades in
3. After 2.5 seconds → Auto-redirects to MainNavigator (HomeScreen)
```

#### **Not Logged In User**

```
1. Heart icon pops up with bounce
2. "Heartbeat" text fades in
3. After 1.5 seconds → Heart moves up, login form appears
4. User can enter credentials and login
```

## Login Form Fields

The login form includes:

- ✅ **Email input** (with email keyboard type)
- ✅ **Password input** (with secure text entry)
- ✅ **Login button** (with validation)
- ✅ **Sign Up link** (navigates to registration)

## Redux Persist

User authentication is persisted using `redux-persist` and `AsyncStorage`:

- User data is automatically saved to device storage
- Authentication survives app restarts
- Logout clears persisted data

## Usage

### Login

1. Enter email and password in the splash screen form
2. Click "Login" button
3. User data is saved to Redux and persisted
4. Automatically redirects to MainNavigator

### Logout

1. Navigate to HomeScreen
2. Click "Logout" button
3. User data is cleared
4. App returns to splash screen with login form

## Customization

### Animation Timing

Located in `src/components/SplashScreen/SplashScreen.js`:

```javascript
// Icon fade in
duration: 500ms

// Icon pop-up bounce
tension: 400, friction: 8

// Icon settle back
tension: 600, friction: 12

// Text fade in
delay: 1200ms, duration: 600ms

// Heart move up (not logged in)
delay: 1500ms, duration: 800ms

// Auto-redirect (logged in)
delay: 2500ms
```

### Styling

All styles can be customized in the `styles` object at the bottom of `SplashScreen.js`:

- Form container: `signInBox`
- Input fields: `input`
- Login button: `loginButton`
- Text styles: `signInTitle`, `signInSubtitle`, `linkText`

## API Integration

To connect to a real API, replace the `handleLogin` function:

```javascript
const handleLogin = async () => {
  if (email && password) {
    try {
      // Replace with your API call
      const response = await fetch('https://your-api.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const userData = await response.json();

      dispatch(setUser(userData));
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    }
  } else {
    Alert.alert('Error', 'Please enter email and password');
  }
};
```

## File Structure

```
src/
├── components/
│   └── SplashScreen/
│       ├── SplashScreen.js    # Main component with login form
│       └── index.js
├── redux/
│   ├── store.js               # Redux store with persist config
│   └── slices/
│       └── userSlice.js       # User state management
└── screens/
    └── SplashScreenExample.js # Splash screen wrapper
```

## Testing

### Test Login Flow

1. Start app → Should show splash screen with login form
2. Enter any email/password
3. Click login → Should save user and redirect to home
4. Restart app → Should remember login and auto-redirect

### Test Logout Flow

1. From HomeScreen, click "Logout"
2. Should clear user data
3. Should return to splash screen with login form

### Test Persistence

1. Login with credentials
2. Close app completely
3. Reopen app
4. Should auto-redirect to home without showing login form

## Troubleshooting

### Login form not showing

- Check Redux state: User should be `null`
- Check console logs for user state
- Verify `isLoggedIn` is `false`

### Auto-redirect not working

- Check if user data is properly set in Redux
- Verify `onAnimationFinish` callback is working
- Check console logs for user state

### Persistence not working

- Clear app data and restart
- Check AsyncStorage permissions
- Verify `redux-persist` is properly configured
