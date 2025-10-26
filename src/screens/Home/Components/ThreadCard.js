import { Ionicons } from '@expo/vector-icons';
import { Audio, Video } from 'expo-av';
import { useRef, useState } from 'react';
import { Animated, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { removeThread } from '../../../redux/slices/threadSlice';
import colors from '../../../theme/colors';
import { fontSizes, fontWeights } from '../../../theme/fonts';
import metrics from '../../../theme/metrics';

const ThreadCard = ({ thread }) => {
  const dispatch = useDispatch();
  const [playingRecordingId, setPlayingRecordingId] = useState(null);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [videoPlayerVisible, setVideoPlayerVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const recordingRef = useRef(null);
  const videoPlayerRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const handleDelete = () => {
    dispatch(removeThread(thread.id));
    setShowMenu(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayback = async (recording) => {
    if (playingRecordingId === recording.id) {
      // Pause
      if (recordingRef.current) {
        await recordingRef.current.pauseAsync();
        setPlayingRecordingId(null);
      }
    } else {
      // Stop any other playing recording
      if (recordingRef.current) {
        await recordingRef.current.stopAsync();
        await recordingRef.current.unloadAsync();
      }
      
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: recording.uri },
          { shouldPlay: true }
        );
        recordingRef.current = sound;
        setPlayingRecordingId(recording.id);
        setPlaybackTime(0);

        // Start animation
        progressAnim.setValue(0);
        Animated.timing(progressAnim, {
          toValue: 100,
          duration: recording.duration * 1000,
          useNativeDriver: false,
          easing: (t) => t,
        }).start();

        // Update time
        const interval = setInterval(() => {
          setPlaybackTime(prev => {
            if (prev >= recording.duration) {
              clearInterval(interval);
              return recording.duration;
            }
            return prev + 1;
          });
        }, 1000);

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            clearInterval(interval);
            setPlayingRecordingId(null);
            setPlaybackTime(0); // Reset to 0 so it shows as "0:00 / 0:30" (example)
            progressAnim.setValue(0);
          }
        });
      } catch (err) {
        console.error('Failed to play recording', err);
      }
    }
  };

  const openVideoPlayer = (videoId) => {
    setPlayingVideoId(videoId);
    setVideoPlayerVisible(true);
  };

  const closeVideoPlayer = () => {
    setPlayingVideoId(null);
    setVideoPlayerVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={20} color={colors.primary} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.username}>Shivang Thacker</Text>
            <Text style={styles.timestamp}>{new Date(thread.timestamp).toLocaleTimeString()}</Text>
          </View>
          
          {/* Menu Button */}
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setShowMenu(!showMenu)}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Menu Dropdown */}
        <Modal
          visible={showMenu}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowMenu(false)}
        >
          <TouchableOpacity 
            style={styles.menuBackdrop}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          >
            <TouchableOpacity 
              style={styles.menuDropdown}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={handleDelete}
              >
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
                <Text style={styles.menuItemText}>Delete Thread</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Text Content */}
        {thread.text && thread.text.trim() && (
          <Text style={styles.text}>{thread.text}</Text>
        )}

        {/* Recordings */}
        {thread.recordings && thread.recordings.length > 0 && (
          <View style={styles.recordingsContainer}>
            {thread.recordings.map((recording) => {
              const isPlaying = playingRecordingId === recording.id;
              return (
                <View key={recording.id} style={styles.recordingItem}>
                  <TouchableOpacity 
                    onPress={() => togglePlayback(recording)}
                    style={styles.playButton}
                  >
                    <Ionicons 
                      name={isPlaying ? "pause" : "play"} 
                      size={16} 
                      color={colors.primary} 
                    />
                  </TouchableOpacity>
                  <View style={styles.recordingInfo}>
                    <View style={styles.progressBarContainer}>
                      <Animated.View 
                        style={[
                          styles.progressBar, 
                          { 
                            width: progressAnim.interpolate({
                              inputRange: [0, 100],
                              outputRange: ['0%', '100%'],
                            })
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.recordingDuration}>
                      {formatTime(playbackTime)} / {formatTime(recording.duration)}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Images */}
        {thread.images && thread.images.length > 0 && (
          <View style={styles.mediaContainer}>
            {thread.images.map((image, index) => (
              <Image 
                key={image.id || index} 
                source={{ uri: image.uri }} 
                style={styles.mediaImage}
              />
            ))}
          </View>
        )}

        {/* Videos */}
        {thread.videos && thread.videos.length > 0 && (
          <View style={styles.mediaContainer}>
            {thread.videos.map((video, index) => (
              <TouchableOpacity 
                key={video.id || index}
                style={styles.videoThumbnailContainer}
                onPress={() => openVideoPlayer(video.id || index)}
                activeOpacity={0.8}
              >
                <Image 
                  source={{ uri: video.uri }} 
                  style={styles.videoThumbnail}
                  resizeMode="cover"
                />
                <View style={styles.playButtonOverlay}>
                  <View style={styles.playButtonCircle}>
                    <Ionicons name="play" size={20} color={colors.white} />
                  </View>
                </View>
                {video.duration && (
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{Math.round(video.duration)}s</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Video Player Modal */}
      {videoPlayerVisible && playingVideoId !== null && (
        <TouchableOpacity
          style={styles.videoPlayerOverlay}
          activeOpacity={1}
          onPress={closeVideoPlayer}
        >
          <View style={styles.videoPlayerContainer}>
            <TouchableOpacity 
              style={styles.videoCloseButton}
              onPress={closeVideoPlayer}
            >
              <Ionicons name="close" size={24} color={colors.white} />
            </TouchableOpacity>

            {thread.videos && thread.videos.find(v => (v.id || thread.videos.indexOf(v)) === playingVideoId) && (
              <Video
                ref={videoPlayerRef}
                source={{ uri: thread.videos.find(v => (v.id || thread.videos.indexOf(v)) === playingVideoId).uri }}
                style={styles.videoPlayer}
                useNativeControls
                shouldPlay
                isLooping={true}
                resizeMode="contain"
                onPlaybackStatusUpdate={(status) => {
                  if (!status.isLoaded) return;
                  if (status.didJustFinish && videoPlayerRef.current) {
                    videoPlayerRef.current.pauseAsync();
                    videoPlayerRef.current.setPositionAsync(0);
                  }
                }}
              />
            )}
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

export default ThreadCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: metrics.borderRadius.lg,
    padding: metrics.spacing.md,
    marginBottom: metrics.spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: metrics.Vspacing.sm,
    position: 'relative',
  },
  menuButton: {
    padding: metrics.spacing.xs,
  },
  menuBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuDropdown: {
    backgroundColor: colors.white,
    borderRadius: metrics.borderRadius.md,
    padding: metrics.spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 160,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: metrics.spacing.sm,
    gap: metrics.spacing.sm,
  },
  menuItemText: {
    fontSize: fontSizes.md,
    color: colors.danger,
    fontWeight: fontWeights.medium,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: metrics.spacing.sm,
  },
  headerInfo: {
    flex: 1,
  },
  username: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  timestamp: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  text: {
    fontSize: fontSizes.md,
    color: colors.text,
    lineHeight: 22,
    marginBottom: metrics.Vspacing.sm,
  },
  recordingsContainer: {
    marginBottom: metrics.Vspacing.sm,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    padding: metrics.spacing.sm,
    borderRadius: metrics.borderRadius.md,
    gap: metrics.spacing.sm,
    marginTop: metrics.spacing.sm,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingInfo: {
    flex: 1,
  },
  progressBarContainer: {
    height: 3,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: metrics.spacing.xxs,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  recordingDuration: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.sm,
    marginBottom: metrics.Vspacing.sm,
  },
  mediaImage: {
    width: 100,
    height: 100,
    borderRadius: metrics.borderRadius.md,
    resizeMode: 'cover',
  },
  videoThumbnailContainer: {
    width: 100,
    height: 100,
    borderRadius: metrics.borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: metrics.borderRadius.md,
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: metrics.borderRadius.sm,
  },
  durationText: {
    fontSize: fontSizes.xs,
    color: colors.white,
    fontWeight: fontWeights.semibold,
  },
  videoPlayerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayerContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoCloseButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
  },
});
