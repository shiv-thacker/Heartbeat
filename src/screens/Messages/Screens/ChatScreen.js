import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../../theme/colors';
import { fontSizes, fontWeights } from '../../../theme/fonts';
import metrics from '../../../theme/metrics';

const ChatScreen = ({ navigation }) => {
  const route = useRoute();
  const { user } = route.params || {};
  const { top, bottom } = useSafeAreaInsets();
  const scaleAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    // Zoom in animation on mount
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleVoiceCall = () => {
    console.log('Starting voice call with:', user.name);
    navigation.navigate('VoiceCallScreen', {
      user: user,
      channelName: 'test-channel',
    });
  };

  const handleVideoCall = () => {
    console.log('Starting video call with:', user.name);
    navigation.navigate('VideoCallScreen', {
      user: user,
      channelName: 'test-channel',
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      {/* Custom Header */}
      <View style={[styles.header, { paddingTop: top + 12 }]}>
        {/* Back Button */}
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </TouchableOpacity>

        {/* User Info */}
        <TouchableOpacity style={styles.userInfo} activeOpacity={0.7}>
          <Image source={{ uri: user?.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{user?.name}</Text>
        </TouchableOpacity>

        {/* Call Buttons */}
        <View style={styles.callButtons}>
          {/* Voice Call Button */}
          <TouchableOpacity 
            style={styles.callButton}
            onPress={handleVoiceCall}
          >
            <Ionicons name="call" size={24} color={colors.text} />
          </TouchableOpacity>

          {/* Video Call Button */}
          <TouchableOpacity 
            style={styles.callButton}
            onPress={handleVideoCall}
          >
            <Ionicons name="videocam" size={26} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Messages Area */}
      <View style={styles.chatArea}>
        <Text style={styles.placeholderText}>
          Start chatting with {user?.name}
        </Text>
      </View>

      {/* Message Input Area */}
      <View style={[styles.inputContainer, { paddingBottom: bottom + 12 }]}>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="add-circle" size={28} color={colors.primary} />
        </TouchableOpacity>
        
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          multiline
        />

        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="send" size={18} color={colors.white} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.xl,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundSecondary,
    marginRight: 12,
  },
  userName: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  callButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: metrics.Hspacing.md,
    backgroundColor: colors.background,
  },
  placeholderText: {
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: metrics.spacing.xl,
    paddingTop: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  attachButton: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 8,
    fontSize: fontSizes.md,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

