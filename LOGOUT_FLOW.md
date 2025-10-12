# Logout Flow Documentation

## Overview

Complete documentation of how the logout functionality works and redirects to the Splash Screen.

## 🎯 Logout Flow

### **User Journey:**

```
HomeScreen (Logged In)
     ↓
User clicks "Logout" button
     ↓
dispatch(logout())
     ↓
Redux: user.info = null
     ↓
SplashScreenExample detects: !isLoggedIn && showMainApp
     ↓
After 50ms:
  - setShowSplash(true)
  - setShowMainApp(false)
  - setSkipAnimations(true)
     ↓
SplashScreen appears with Login Form
     ↓
✅ User can login again
```

## 🔧 Technical Implementation

### **1. HomeScreen - Logout Button**

**File:** `src/screens/Home/HomeScreen.js`

```javascript
const handleLogout = () => {
  dispatch(logout()); // Dispatch logout action
};
```

### **2. Redux - Logout Action**

**File:** `src/redux/slices/userSlice.js`

```javascript
logout(state) {
  state.info = null;              // ✅ Clear user data
  state.tempEmail = null;         // ✅ Clear temp email
  state.returnToSplash = false;   // ✅ Reset navigation flag
  state.navigateToOtp = false;    // ✅ Reset OTP flag
}
```

**What gets cleared:**

- ✅ User information (`info`)
- ✅ Temporary email (`tempEmail`)
- ✅ Navigation flags (`returnToSplash`, `navigateToOtp`)

### **3. SplashScreenExample - Logout Detection**

**File:** `src/screens/SplashScreenExample.js`

```javascript
useEffect(() => {
  // Detect logout
  if (!isLoggedIn && showMainApp && !navigatingToRegister) {
    console.log('🚪 Logout detected - Returning to Splash Screen');

    const timer = setTimeout(() => {
      setShowSplash(true); // ✅ Show splash screen
      setShowMainApp(false); // ✅ Hide main app
      setSkipAnimations(true); // ✅ Skip animations
      setNavigatingToRegister(false); // ✅ Reset flag

      console.log('✅ Splash Screen shown after logout');
    }, 50);

    return () => clearTimeout(timer);
  }
}, [isLoggedIn, showSplash, showMainApp, navigatingToRegister]);
```

**Conditions checked:**

- `!isLoggedIn` - User is not logged in (user.info is null)
- `showMainApp` - Currently showing main app (before logout)
- `!navigatingToRegister` - Not navigating to register screen

### **4. AppNavigator - Route Selection**

**File:** `src/navigation/AppNavigator.js`

```javascript
export default function AppNavigator() {
  const user = useSelector((state) => state.user.info);

  return <NavigationContainer>{user ? <MainNavigator /> : <AuthNavigator />}</NavigationContainer>;
}
```

**Note:** This component is only rendered when `showMainApp = true`. After logout, `SplashScreenExample` sets `showMainApp = false` and `showSplash = true`, so `AppNavigator` is not rendered.

## 🎨 Visual Flow

### **Before Logout:**

```
┌─────────────────────────┐
│  AppWithSplashScreen    │
│                         │
│  showSplash = false     │
│  showMainApp = true     │
│  isLoggedIn = true      │
│                         │
│  ├── AppNavigator       │
│      ├── MainNavigator  │
│          └── HomeScreen │ ← User sees this
└─────────────────────────┘
```

### **After Logout (Transition):**

```
┌─────────────────────────┐
│  AppWithSplashScreen    │
│                         │
│  User clicks Logout     │
│  ↓                      │
│  dispatch(logout())     │
│  ↓                      │
│  user.info = null       │
│  isLoggedIn = false     │
│                         │
│  useEffect detects:     │
│  - !isLoggedIn ✓        │
│  - showMainApp ✓        │
│  - !navigatingTo... ✓   │
│                         │
│  setTimeout(50ms)       │
└─────────────────────────┘
```

### **After Logout (Final State):**

```
┌─────────────────────────┐
│  AppWithSplashScreen    │
│                         │
│  showSplash = true      │
│  showMainApp = false    │
│  isLoggedIn = false     │
│  skipAnimations = true  │
│                         │
│  ├── SplashScreen       │ ← User sees this
│      ├── Heart (top)    │
│      ├── "Heartbeat"    │
│      └── Login Form     │
│          - Email input  │
│          - Send OTP btn │
└─────────────────────────┘
```

## 🧪 Testing

### **Test Logout Flow:**

1. **Login to app:**

   - Enter email: `test@example.com`
   - Click "Send OTP"
   - Enter OTP: `999999`
   - Should navigate to HomeScreen

2. **Check user is logged in:**

   - Should see: "Hello, test!"
   - Should see logout button at bottom

3. **Click "Logout" button:**

   - Watch console logs:
     ```
     🚪 Logout detected - Returning to Splash Screen
     ✅ Splash Screen shown after logout
     ```

4. **Verify splash screen appears:**

   - ✅ Heart icon at top (no animation)
   - ✅ "Heartbeat" text visible
   - ✅ Email input field visible
   - ✅ "Send OTP" button visible
   - ✅ "Don't have an account? Sign Up" link visible

5. **Verify user data is cleared:**
   - Check Redux state: `user.info` should be `null`
   - Check console: `isLoggedIn: false`

### **Expected Console Output:**

```javascript
📱 AppWithSplashScreen State: {
  isLoggedIn: true,
  showSplash: false,
  showMainApp: true,
  navigatingToRegister: false,
  user: 'test@example.com'
}

// After clicking logout:

🚪 Logout detected - Returning to Splash Screen

📱 AppWithSplashScreen State: {
  isLoggedIn: false,
  showSplash: true,
  showMainApp: false,
  navigatingToRegister: false,
  user: 'null'
}

✅ Splash Screen shown after logout
```

## 🔍 Debugging

### **If Splash Screen Doesn't Appear After Logout:**

1. **Check Redux state:**

   - Open Redux DevTools
   - Verify `user.info` is `null` after logout

2. **Check console logs:**

   - Should see: "🚪 Logout detected"
   - Should see: "✅ Splash Screen shown after logout"

3. **Check state variables:**

   ```javascript
   console.log('Debug:', {
     isLoggedIn, // Should be false
     showMainApp, // Should be true (before transition)
     showSplash, // Should be false (before transition)
     navigatingToRegister, // Should be false
   });
   ```

4. **Check useEffect dependencies:**
   - Ensure `useEffect` has correct dependencies
   - Verify it runs when `isLoggedIn` changes

### **Common Issues:**

#### **Issue 1: Logout doesn't clear user data**

**Solution:** Ensure `dispatch(logout())` is called in HomeScreen

#### **Issue 2: Shows AuthNavigator instead of Splash**

**Solution:** Check if `showMainApp` is properly set to `false` in logout detection

#### **Issue 3: Splash screen shows with animations**

**Solution:** Verify `skipAnimations` is set to `true` in logout detection

## ✅ Summary

The logout flow is properly implemented with:

1. ✅ **Clear user data** - Logout action clears all user information
2. ✅ **Detect logout** - useEffect monitors `isLoggedIn` state
3. ✅ **Show splash** - Automatically returns to splash screen
4. ✅ **Skip animations** - Login form appears immediately
5. ✅ **Debug logging** - Console logs track the flow
6. ✅ **Clean state** - All navigation flags reset

When the user clicks logout, the app:

- Clears user data from Redux
- Detects the change (user is no longer logged in)
- Switches from main app to splash screen
- Shows login form without animations
- Ready for user to login again

The entire process takes ~50ms and provides a seamless user experience! 🎉
