# Navigation Flow Documentation

## Overview

This document explains how navigation works between the Splash Screen, Register Screen, and Login functionality.

## Navigation States

### 1. **Initial App Load (Not Logged In)**

```
App Start → SplashScreen
  ↓
Heart animation + Text fade in (1.5s)
  ↓
Heart moves up + Login form appears
  ↓
User enters credentials → Login button
  ↓
Form fades out (300ms) → MainNavigator (HomeScreen)
```

### 2. **App Load (Already Logged In)**

```
App Start → SplashScreen
  ↓
Heart animation + Text fade in (2.5s)
  ↓
Auto-redirect → MainNavigator (HomeScreen)
```

### 3. **From Register Screen to Login**

```
RegisterScreen → User clicks "Login"
  ↓
dispatch(triggerReturnToSplash())
  ↓
SplashScreen with skipAnimations=true
  ↓
Login form visible immediately (no animations)
  ↓
User enters credentials → Login
  ↓
MainNavigator (HomeScreen)
```

## Key Components

### **SplashScreenExample.js**

- Main entry point that manages splash screen visibility
- Monitors Redux state for `returnToSplash` flag
- Controls `skipAnimations` prop based on navigation source

### **SplashScreen.js**

- Handles all animations and login form display
- Accepts `skipAnimations` prop to bypass animations
- Directly integrates login functionality

### **Redux State (userSlice.js)**

```javascript
{
  info: null | UserObject,        // User data when logged in
  loading: false,                 // Loading state
  returnToSplash: false,          // Flag to trigger splash return
}
```

### **Actions**

- `setUser(userData)` - Set logged-in user
- `logout()` - Clear user data
- `triggerReturnToSplash()` - Navigate back to splash with login
- `resetReturnToSplash()` - Clear the return flag

## Animation Behavior

### **Normal Flow (skipAnimations = false)**

1. Heart icon fades in (500ms)
2. Heart pops up to 1.2x (bounce effect)
3. Heart settles to 1.0x
4. Text fades in (600ms) after 1.2s
5. Heart moves up + login form appears (after 1.5s)

### **Direct Login Flow (skipAnimations = true)**

1. All animations skipped
2. Heart already at top position
3. Login form immediately visible
4. User can login right away

## Usage Examples

### **Navigate to Login from Register**

```javascript
import { useDispatch } from 'react-redux';
import { triggerReturnToSplash } from '../../redux/slices/userSlice';

const dispatch = useDispatch();

// When user clicks "Login" link
dispatch(triggerReturnToSplash());
```

### **Login Flow**

```javascript
// User enters email and password
// Clicks login button
// SplashScreen handles:
1. Validates credentials
2. Fades out login form (200ms)
3. Moves heart back to center (300ms)
4. Dispatches setUser(userData)
5. Triggers redirect to MainNavigator
```

### **Logout Flow**

```javascript
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/userSlice';

const dispatch = useDispatch();

// When user clicks logout
dispatch(logout());
// App automatically shows splash screen with login form
```

## Redux Persist

User authentication state is persisted using `redux-persist`:

- User data saved to AsyncStorage
- Survives app restarts
- Logout clears persisted data
- `returnToSplash` flag is NOT persisted (intentional)

## Troubleshooting

### **Login form not showing immediately**

- Check if `skipAnimations` prop is passed correctly
- Verify `returnToSplash` flag in Redux state
- Check console logs in SplashScreen component

### **Stuck on splash screen**

- Verify `onAnimationFinish` callback is working
- Check if user data is properly set in Redux
- Look for animation timeout issues

### **Navigation not working from Register**

- Ensure `triggerReturnToSplash` is imported correctly
- Check if Redux dispatch is working
- Verify SplashScreenExample is monitoring `returnToSplash`

## Benefits of This Approach

✅ **Clean separation** - Splash screen handles both initial load and login
✅ **No duplicate screens** - Single login form in splash screen
✅ **Smooth UX** - Skip animations when returning to login
✅ **State management** - Redux handles all navigation flags
✅ **Persistent auth** - User stays logged in across sessions
✅ **Flexible** - Easy to add more navigation triggers
