import AgoraUIKit from 'agora-rn-uikit';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const VideoCallScreen = ({ route, navigation }) => {
  const { user, channelName } = route.params;
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

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
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

