# Agora Voice & Video Call Integration Guide

This guide explains how to integrate Agora SDK for real-time voice and video calling in the Heartbeat app.

## Current Implementation

✅ **MessageScreen** - Displays a list of dummy users with profile pictures
✅ **ChatScreen** - Chat interface with voice and video call buttons in the header
✅ **Navigation** - Proper routing from MessageScreen to ChatScreen

## Next Steps: Agora Integration

### 1. Install Dependencies

```bash
# Install Agora SDK
npm install react-native-agora

# Install Agora UI Kit (optional, provides pre-built UI)
npm install agora-rn-uikit

# Run Expo Prebuild (required for native modules)
npx expo prebuild
```

### 2. Get Agora Credentials

1. Sign up at [Agora.io](https://www.agora.io)
2. Create a new project
3. Get your **App ID** from the dashboard
4. For production, you'll need to implement token generation (backend required)

### 3. Create Call Screens

#### Voice Call Screen (`src/screens/Messages/Screens/VoiceCallScreen.js`)

```javascript
import React, { useState } from 'react';
import AgoraUIKit from 'agora-rn-uikit';
import { View, StyleSheet } from 'react-native';

const VoiceCallScreen = ({ route, navigation }) => {
  const { user, channelName } = route.params;
  const [videoCall, setVideoCall] = useState(false);

  const connectionData = {
    appId: 'YOUR_AGORA_APP_ID',
    channel: channelName || `voice_${user.id}`,
  };

  const rtcCallbacks = {
    EndCall: () => navigation.goBack(),
  };

  const settings = {
    mode: 1, // 0 for video, 1 for audio only
  };

  return (
    <View style={styles.container}>
      <AgoraUIKit
        connectionData={connectionData}
        rtcCallbacks={rtcCallbacks}
        settings={settings}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default VoiceCallScreen;
```

#### Video Call Screen (`src/screens/Messages/Screens/VideoCallScreen.js`)

```javascript
import React from 'react';
import AgoraUIKit from 'agora-rn-uikit';
import { View, StyleSheet } from 'react-native';

const VideoCallScreen = ({ route, navigation }) => {
  const { user, channelName } = route.params;

  const connectionData = {
    appId: 'YOUR_AGORA_APP_ID',
    channel: channelName || `video_${user.id}`,
  };

  const rtcCallbacks = {
    EndCall: () => navigation.goBack(),
  };

  return (
    <View style={styles.container}>
      <AgoraUIKit
        connectionData={connectionData}
        rtcCallbacks={rtcCallbacks}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default VideoCallScreen;
```

### 4. Update Navigation

Add the call screens to `MainNavigator.js`:

```javascript
import VoiceCallScreen from '../screens/Messages/Screens/VoiceCallScreen';
import VideoCallScreen from '../screens/Messages/Screens/VideoCallScreen';

// Inside TabNavigator Stack.Navigator:
<Stack.Screen
  name="VoiceCallScreen"
  component={VoiceCallScreen}
  options={{
    headerShown: false,
    presentation: 'fullScreenModal',
  }}
/>
<Stack.Screen
  name="VideoCallScreen"
  component={VideoCallScreen}
  options={{
    headerShown: false,
    presentation: 'fullScreenModal',
  }}
/>
```

### 5. Update ChatScreen Call Handlers

Update the call handlers in `ChatScreen.js`:

```javascript
const handleVoiceCall = () => {
  navigation.navigate('VoiceCallScreen', {
    user: user,
    channelName: `voice_${user.id}_${Date.now()}`,
  });
};

const handleVideoCall = () => {
  navigation.navigate('VideoCallScreen', {
    user: user,
    channelName: `video_${user.id}_${Date.now()}`,
  });
};
```

### 6. Permissions

Add permissions to `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "extraMavenRepos": [
              "https://jitpack.io"
            ]
          }
        }
      ]
    ],
    "android": {
      "permissions": [
        "CAMERA",
        "RECORD_AUDIO",
        "MODIFY_AUDIO_SETTINGS"
      ]
    },
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "This app needs camera access for video calls",
        "NSMicrophoneUsageDescription": "This app needs microphone access for voice and video calls"
      }
    }
  }
}
```

### 7. Request Permissions at Runtime

```javascript
import { PermissionsAndroid, Platform } from 'react-native';

const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
  }
};

// Call this before initiating a call
```

## Testing Without Backend

For testing purposes, both users can join the same channel:

- **Device A**: Opens VoiceCallScreen with channel "test-channel"
- **Device B**: Opens VoiceCallScreen with channel "test-channel"
- **Result**: They connect in a voice call

Same applies for video calls.

## Production Setup

For production, you need:

1. **Backend Server** to generate Agora tokens
2. **Push Notifications** for incoming call alerts
3. **Call Signaling** to notify the other user
4. **CallKit (iOS)** and **ConnectionService (Android)** for native call UI

### Backend Token Generation (Node.js Example)

```javascript
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

app.post('/generate-token', (req, res) => {
  const { channelName, uid } = req.body;
  const appId = 'YOUR_APP_ID';
  const appCertificate = 'YOUR_APP_CERTIFICATE';
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  res.json({ token });
});
```

## Advanced Features

### Incoming Call UI (WhatsApp-style)

Create a full-screen incoming call overlay with:
- Caller's name and avatar
- Accept button (green)
- Reject button (red)
- Ringtone

### Call Notifications

Use Firebase Cloud Messaging (FCM) to send push notifications when a call is initiated.

### CallKit Integration (iOS)

Use `react-native-callkit` for native iOS call UI.

### Connection Service (Android)

Use `react-native-android-connection-service` for native Android call UI.

## Resources

- [Agora React Native SDK](https://docs.agora.io/en/video-calling/get-started/get-started-sdk?platform=react-native)
- [Agora UI Kit](https://github.com/AgoraIO-Community/ReactNative-UIKit)
- [Token Generation](https://docs.agora.io/en/video-calling/develop/authentication-workflow)

## Current Status

✅ UI is ready with call buttons
✅ Navigation is set up
⏳ Agora SDK integration pending
⏳ Call screens need to be created
⏳ Permissions need to be configured

---

**Note**: The current implementation has placeholder call handlers that log to console. Follow this guide to implement actual calling functionality.

