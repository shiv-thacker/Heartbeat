import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../../../theme/colors';

const VideoImageViewer = ({ route, navigation }) => {
  const { bottom, top } = useSafeAreaInsets();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isImage, setIsImage] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  
  const media = route?.params?.media;

  useEffect(() => {
    if (media) {
      setIsImage(!media.duration); // If no duration, it's an image
    }
  }, [media]);

  useEffect(() => {
    // Zoom in animation on mount
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (!isImage && videoRef.current) {
      // Hide controls after 3 seconds of inactivity
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, isImage]);

  const toggleControls = () => {
    if (!isImage) {
      setShowControls(true);
    }
  };

  const togglePlayPause = async () => {
    if (isImage) return;
    
    setShowControls(true);
    
    if (isPlaying) {
      await videoRef.current?.pauseAsync();
    } else {
      await videoRef.current?.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    if (!isImage) {
      videoRef.current?.pauseAsync();
      setIsPlaying(false);
    }
    navigation.goBack();
  };

  if (!media) return null;

  return (
    <Animated.View 
      style={[
        styles.overlay,
        { transform: [{ scale: scaleAnim }] }
      ]}
    >
      {/* Close Button */}
      <TouchableOpacity 
        style={[styles.closeButton, { top: top + 20 }]}
        onPress={handleClose}
      >
        <Ionicons name="close" size={24} color={colors.white} />
      </TouchableOpacity>

      {/* Content */}
      {isImage ? (
        <Image 
          source={{ uri: media.uri }} 
          style={styles.media}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: media.uri }}
            style={styles.media}
            resizeMode="contain"
            shouldPlay={isPlaying}
            isLooping={true}
            useNativeControls={false}
            onPlaybackStatusUpdate={(status) => {
              if (status.isLoaded) {
                setPlaybackPosition(status.positionMillis / 1000);
                setPlaybackDuration(status.durationMillis / 1000);
                
                if (status.didJustFinish) {
                  videoRef.current?.replayAsync();
                }
              }
            }}
          />
          
          {/* Tap overlay to show controls when hidden */}
          {!showControls && (
            <TouchableOpacity 
              style={styles.controlsContainer}
              activeOpacity={1}
              onPress={toggleControls}
            />
          )}

          {/* Controls Overlay */}
          {showControls && (
            <View style={styles.controlsContainer}>
              {/* Bottom Controls */}
              <View style={[styles.bottomControls, { bottom: bottom + 20 }]}>
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={togglePlayPause}
                >
                  <Ionicons 
                    name={isPlaying ? "pause" : "play"} 
                    size={28} 
                    color={colors.white} 
                  />
                </TouchableOpacity>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${(playbackPosition / playbackDuration) * 100}%` }
                      ]} 
                    />
                  </View>
                </View>

                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>
                    {formatTime(playbackPosition)} / {formatTime(playbackDuration)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  controlsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomControls: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  progressContainer: {
    flex: 1,
    marginRight: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
  },
});

export default VideoImageViewer;

