import AgoraUIKit from 'agora-rn-uikit';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const VoiceCallScreen = ({ route, navigation }) => {
  const { user, channelName } = route.params;
  const [videoCall, setVideoCall] = useState(false);
  const { bottom } = useSafeAreaInsets();
  const connectionData = {
    appId: '55094c1fad654ceb9aabdfed8467eeaa',
    channel: channelName || 'test-channel',
  };

  const rtcCallbacks = {
    EndCall: () => {
      console.log('Call ended');
      navigation.goBack();
    },
  };

  const settings = {
    mode: 1, // 1 for audio only, 0 for video
  };

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
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

