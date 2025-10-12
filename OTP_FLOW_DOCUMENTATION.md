# OTP Authentication Flow Documentation

## Overview

The app now uses OTP (One-Time Password) authentication instead of traditional email/password login.

## 🎯 User Flow

### **1. Splash Screen - Email Input**

```
User opens app
     ↓
Splash screen animation (heart pop-up)
     ↓
Login form appears with EMAIL field only
     ↓
User enters email address
     ↓
Clicks "Send OTP" button
```

### **2. OTP Screen - Verification**

```
Navigates to OTP Screen
     ↓
Shows 6 input boxes for OTP digits
     ↓
User enters OTP: 9-9-9-9-9-9
     ↓
Auto-validates when all 6 digits entered
     ↓
If OTP = "999999" → Login Success
     ↓
If OTP ≠ "999999" → Error message + Reset
```

### **3. After Validation**

```
Valid OTP (999999)
     ↓
User logged in automatically
     ↓
Redirects to MainNavigator (HomeScreen)
```

## 📱 Features

### **OTP Screen Features:**

- ✅ **6 separate input boxes** for each digit
- ✅ **Auto-focus next box** when digit is entered
- ✅ **Auto-focus previous box** on backspace
- ✅ **Auto-validation** when all 6 digits filled (no login button needed)
- ✅ **Validation code**: `999999`
- ✅ **Resend OTP** functionality
- ✅ **Back to Login** button
- ✅ **Visual feedback** during validation (green border)
- ✅ **Error handling** with alert and auto-reset

### **User Experience:**

- 🎨 **Beautiful UI** matching splash screen design
- 🚀 **Fast validation** (500ms delay)
- ✨ **Smooth animations** for validation state
- 💡 **Hint displayed** showing the valid code
- 📧 **Email display** in header for confirmation

## 🔧 Technical Implementation

### **Redux State Management:**

#### **userSlice.js:**

```javascript
{
  info: null | UserObject,        // Logged in user data
  loading: false,                 // Loading state
  returnToSplash: false,          // Navigation flag
  tempEmail: null,                // Email stored during OTP flow
}
```

#### **Actions:**

- `setTempEmail(email)` - Store email when "Send OTP" clicked
- `setUser(userData)` - Set logged-in user after OTP validation
- `triggerReturnToSplash()` - Return to splash login from OTP screen

### **Navigation Flow:**

#### **SplashScreen.js:**

```javascript
handleSendOtp()
  ↓
dispatch(setTempEmail(email))  // Store email in Redux
  ↓
onNavigateToOtp(email)  // Navigate to OTP screen
```

#### **OtpScreen.js:**

```javascript
const email = useSelector(state => state.user.tempEmail)  // Get email from Redux

useEffect(() => {
  const otpValue = otp.join('');
  if (otpValue.length === 6) {
    validateOtp(otpValue);  // Auto-validate
  }
}, [otp]);

validateOtp(otpValue)
  ↓
if (otpValue === '999999')
    dispatch(setUser({...}))  // Login success
  else
    Alert + Reset OTP
```

### **Auto-Validation Logic:**

```javascript
// Monitors OTP array for changes
useEffect(() => {
  const otpValue = otp.join('');
  if (otpValue.length === 6 && !isValidating) {
    validateOtp(otpValue); // Triggers automatically
  }
}, [otp]);

// Handles validation
const validateOtp = (otpValue) => {
  setIsValidating(true);

  if (otpValue === '999999') {
    // Success - dispatch setUser
    // Auto-redirects to HomeScreen
  } else {
    // Error - show alert
    // Reset OTP inputs
  }
};
```

### **Auto-Focus Logic:**

```javascript
const handleOtpChange = (value, index) => {
  // Update OTP array
  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  // Auto-focus next input
  if (value && index < 5) {
    inputRefs.current[index + 1]?.focus();
  }
};

const handleKeyPress = (e, index) => {
  // Handle backspace - focus previous
  if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
    inputRefs.current[index - 1]?.focus();
  }
};
```

## 🎨 UI/UX Details

### **OTP Input Styling:**

```
Default State:    Gray border, white background
Filled State:     Pink border, light pink background
Validating State: Green border, light green background
```

### **Visual Feedback:**

- **Entering OTP**: Boxes turn pink as user types
- **Validating**: All boxes turn green with "Validating OTP..." text
- **Success**: Immediate redirect to HomeScreen
- **Error**: Alert dialog + inputs reset + refocus first box

### **Responsive Design:**

- Works on all screen sizes
- Keyboard avoiding view for better UX
- Scroll view for smaller screens
- Touch-friendly input boxes (50x60)

## 📋 Testing Instructions

### **Test Valid OTP:**

1. Open app → Splash screen appears
2. Enter email: `test@example.com`
3. Click "Send OTP"
4. OTP screen appears
5. Enter: `9-9-9-9-9-9`
6. Auto-validates after 6th digit
7. ✅ Should login and go to HomeScreen

### **Test Invalid OTP:**

1. Open app → Splash screen appears
2. Enter email: `test@example.com`
3. Click "Send OTP"
4. Enter: `1-2-3-4-5-6`
5. Shows error alert
6. ❌ OTP resets, focus returns to first box

### **Test Back Button:**

1. From OTP screen
2. Click "← Back to Login"
3. ✅ Returns to Splash with login form (no animations)

### **Test Resend OTP:**

1. From OTP screen
2. Click "Resend OTP"
3. ✅ Shows success alert
4. ✅ OTP inputs reset

## 🔐 Security Notes

### **Current Implementation (Demo):**

- ✅ Valid OTP: `999999` (hardcoded for testing)
- ⚠️ **For Production**: Replace with actual API calls

### **Production Implementation:**

#### **Step 1: Send OTP (SplashScreen.js)**

```javascript
const handleSendOtp = async () => {
  try {
    const response = await fetch('https://your-api.com/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      dispatch(setTempEmail(email));
      onNavigateToOtp(email);
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to send OTP');
  }
};
```

#### **Step 2: Validate OTP (OtpScreen.js)**

```javascript
const validateOtp = async (otpValue) => {
  try {
    const response = await fetch('https://your-api.com/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: otpValue }),
    });

    const data = await response.json();

    if (response.ok) {
      dispatch(setUser(data.user));
    } else {
      Alert.alert('Invalid OTP', data.message);
      resetOtp();
    }
  } catch (error) {
    Alert.alert('Error', 'Validation failed');
  }
};
```

## 🎯 Key Benefits

### **User Experience:**

- ✅ **No password to remember** - Email only
- ✅ **Faster login** - Just 6 digits
- ✅ **Auto-validation** - No button press needed
- ✅ **Clear feedback** - Visual state changes
- ✅ **Error recovery** - Auto-reset on wrong OTP

### **Developer Experience:**

- ✅ **Clean code** - Separated concerns
- ✅ **Redux managed** - Centralized state
- ✅ **Easy to test** - Single valid code
- ✅ **Production ready** - Easy to add API calls

### **Security:**

- ✅ **No password storage** - More secure
- ✅ **Time-based OTP** (in production)
- ✅ **Single use codes** (in production)

## 🚀 Future Enhancements

### **Planned Features:**

- [ ] OTP expiration timer (e.g., "Valid for 5 minutes")
- [ ] Rate limiting for resend OTP
- [ ] SMS OTP in addition to email
- [ ] Biometric authentication after first login
- [ ] Remember device option

## 📝 File Structure

```
src/
├── components/
│   └── SplashScreen/
│       └── SplashScreen.js       # Email input + Send OTP
├── screens/
│   └── Auth/
│       ├── OtpScreen.js           # 6-digit OTP input + validation
│       └── RegisterScreen.js      # User registration
├── redux/
│   └── slices/
│       └── userSlice.js           # User state + tempEmail
└── navigation/
    └── AuthNavigator.js           # OtpScreen routing
```

## 🎉 Summary

The OTP authentication flow provides a modern, secure, and user-friendly login experience. The auto-validation feature eliminates the need for a login button, making the process seamless. The valid OTP code `999999` makes testing easy during development, and the system is designed to easily integrate with a real OTP service in production.
