import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { addThread } from '../../../redux/slices/threadSlice';
import colors from '../../../theme/colors';
import { fontSizes, fontWeights } from '../../../theme/fonts';
import metrics from '../../../theme/metrics';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const CreateThread = ({ visible, onClose, slideAnim, navigation }) => {
  const dispatch = useDispatch();
  const { top, bottom } = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(0)).current;
  const [threadText, setThreadText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [playingRecordingId, setPlayingRecordingId] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [playbackTime, setPlaybackTime] = useState({});
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const recordingAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const textInputRef = useRef(null);
  const playbackIntervals = useRef({});
  const recordingRef = useRef(null);
  const soundObjects = useRef({});
  const progressAnims = useRef({});
  
  const modalHeight = screenHeight * 0.9;
  
  // Request camera and media permissions only
  useEffect(() => {
    (async () => {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraPermission.status !== 'granted') {
        console.log('Camera permission not granted');
      }
      if (mediaLibraryPermission.status !== 'granted') {
        console.log('Media library permission not granted');
      }
    })();
  }, []);

  // Track keyboard visibility
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
      Object.values(soundObjects.current).forEach(sound => {
        sound.unloadAsync();
      });
    };
  }, []);
  
  // Simplified animation - just use the slideAnim directly
  const modalTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });

  const handleSend = () => {
    if (threadText.trim() || recordings.length > 0 || selectedImages.length > 0 || selectedVideos.length > 0) {
      // Store thread in Redux
      const thread = {
        text: threadText.trim(),
        recordings: recordings,
        images: selectedImages,
        videos: selectedVideos,
      };
      
      dispatch(addThread(thread));
      
      // Reset form
      setThreadText('');
      setRecordings([]);
      setSelectedImages([]);
      setSelectedVideos([]);
      
      Keyboard.dismiss();
      onClose();
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleCamera = () => {
    // Short tap - directly open camera for photo
    openCameraForPhoto();
  };

  const openCameraForPhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newImage = {
          id: Date.now(),
          uri: asset.uri,
          type: 'camera',
        };
        setSelectedImages(prev => [...prev, newImage]);
      }
    } catch (err) {
      console.error('Failed to open camera for photo:', err);
    }
  };

  const openCameraForVideo = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false, // No editing for video notes - like WhatsApp
        videoMaxDuration: 60,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newVideo = {
          id: Date.now(),
          uri: asset.uri,
          type: 'camera-video',
          duration: asset.duration,
        };
        setSelectedVideos(prev => [...prev, newVideo]);
      }
    } catch (err) {
      console.error('Failed to open camera for video:', err);
    }
  };

  const handleCameraLongPress = async () => {
    // Automatically start video recording on long press
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false, // No editing for quick video notes
        videoMaxDuration: 60,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newVideo = {
          id: Date.now(),
          uri: asset.uri,
          type: 'camera-video',
          duration: asset.duration,
        };
        setSelectedVideos(prev => [...prev, newVideo]);
      }
    } catch (err) {
      console.error('Failed to record video:', err);
    }
  };

  const handleGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImage = {
          id: Date.now(),
          uri: result.assets[0].uri,
          type: 'gallery',
        };
        setSelectedImages(prev => [...prev, newImage]);
      }
    } catch (err) {
      console.error('Failed to open gallery:', err);
    }
  };

  const removeImage = (id) => {
    setSelectedImages(prev => prev.filter(img => img.id !== id));
  };

  const removeVideo = (id) => {
    setSelectedVideos(prev => prev.filter(video => video.id !== id));
    if (playingVideoId === id) {
      setPlayingVideoId(null);
    }
  };

  const openVideoPlayer = (videoId) => {
    const video = selectedVideos.find(v => v.id === videoId);
    if (video && navigation) {
      navigation.navigate('VideoImageViewer', { media: video });
    }
  };

  const openImageViewer = (image) => {
    if (image && navigation) {
      navigation.navigate('VideoImageViewer', { media: image });
    }
  };

  const removeRecording = (id) => {
    // Stop playback if this recording is playing
    if (playingRecordingId === id) {
      stopPlayback(id);
    }
    // Clean up progress animation
    if (progressAnims.current[id]) {
      delete progressAnims.current[id];
    }
    setRecordings(prev => prev.filter(rec => rec.id !== id));
  };

  const togglePlayback = (recordingId, duration) => {
    if (playingRecordingId === recordingId) {
      // Pause
      stopPlayback(recordingId);
    } else {
      // Stop any other playing recording
      if (playingRecordingId) {
        stopPlayback(playingRecordingId);
      }
      // Start playing
      startPlayback(recordingId, duration);
    }
  };

  const getProgressAnim = (recordingId) => {
    if (!progressAnims.current[recordingId]) {
      progressAnims.current[recordingId] = new Animated.Value(0);
    }
    return progressAnims.current[recordingId];
  };

  const startPlayback = async (recordingId, duration) => {
    try {
      const recording = recordings.find(r => r.id === recordingId);
      if (!recording || !recording.uri) return;

      setPlayingRecordingId(recordingId);
      setPlaybackTime(prev => ({ ...prev, [recordingId]: 0 }));
      
      // Reset and animate progress bar continuously
      const progressAnim = getProgressAnim(recordingId);
      progressAnim.setValue(0);

      // Create and play sound
      const { sound } = await Audio.Sound.createAsync(
        { uri: recording.uri },
        { shouldPlay: true }
      );
      
      soundObjects.current[recordingId] = sound;

      // Start continuous smooth animation for the entire duration
      Animated.timing(progressAnim, {
        toValue: 100,
        duration: duration * 1000, // Convert seconds to milliseconds
        useNativeDriver: false,
        easing: (t) => t, // Linear easing for consistent progress
      }).start(({ finished }) => {
        if (finished) {
          stopPlayback(recordingId);
        }
      });

      // Update time display only (doesn't affect animation)
      const interval = setInterval(() => {
        setPlaybackTime(prev => {
          const currentTime = (prev[recordingId] || 0) + 1;
          if (currentTime >= duration) {
            clearInterval(interval);
            return prev;
          }
          return { ...prev, [recordingId]: currentTime };
        });
      }, 1000);

      playbackIntervals.current[recordingId] = interval;

      // Handle playback completion
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          stopPlayback(recordingId);
        }
      });
    } catch (err) {
      console.error('Failed to play recording', err);
    }
  };

  const stopPlayback = async (recordingId) => {
    if (playbackIntervals.current[recordingId]) {
      clearInterval(playbackIntervals.current[recordingId]);
      delete playbackIntervals.current[recordingId];
    }
    
    if (soundObjects.current[recordingId]) {
      await soundObjects.current[recordingId].stopAsync();
      await soundObjects.current[recordingId].unloadAsync();
      delete soundObjects.current[recordingId];
    }
    
    // Stop and reset progress animation
    if (progressAnims.current[recordingId]) {
      progressAnims.current[recordingId].stopAnimation();
      progressAnims.current[recordingId].setValue(0);
    }
    
    // Reset playback time for this recording to show full duration
    setPlaybackTime(prev => ({ ...prev, [recordingId]: 0 }));
    setPlayingRecordingId(null);
  };

  const startRecording = async () => {
    try {
      console.log('Starting recording...');
      
      // Request audio permissions first
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Audio permission not granted');
        Alert.alert(
          'Permission Required',
          'Microphone permission is required to record audio. Please enable it in settings.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      // Set audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      // Clean up any existing recording first
      if (recordingRef.current) {
        try {
          await recordingRef.current.stopAndUnloadAsync();
          recordingRef.current = null;
        } catch (e) {
          console.log('Error cleaning up previous recording:', e);
        }
      }
      
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      
      // Slide animation for recording UI
      Animated.spring(recordingAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

      // Pulse animation for mic icon
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      recordingAnim._pulseAnimation = pulseAnimation;

      // Start actual recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;

      // Timer
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Store interval ID
      recordingAnim._intervalId = interval;
      
      console.log('Recording started successfully');
    } catch (err) {
      console.error('Failed to start recording', err);
      setIsRecording(false);
      
      // Reset animations on error
      Animated.spring(recordingAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const pauseRecording = async () => {
    try {
      if (recordingRef.current && !isPaused) {
        await recordingRef.current.pauseAsync();
        setIsPaused(true);
        
        // Pause timer
        if (recordingAnim._intervalId) {
          clearInterval(recordingAnim._intervalId);
          delete recordingAnim._intervalId;
        }
        
        // Stop pulse animation
        if (recordingAnim._pulseAnimation) {
          recordingAnim._pulseAnimation.stop();
          delete recordingAnim._pulseAnimation;
        }
        
        console.log('Recording paused');
      }
    } catch (err) {
      console.error('Failed to pause recording', err);
    }
  };

  const resumeRecording = async () => {
    try {
      if (recordingRef.current && isPaused) {
        await recordingRef.current.startAsync();
        setIsPaused(false);
        
        // Resume pulse animation
        const pulseAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.2,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        );
        pulseAnimation.start();
        recordingAnim._pulseAnimation = pulseAnimation;
        
        // Resume timer
        const interval = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
        recordingAnim._intervalId = interval;
        
        console.log('Recording resumed');
      }
    } catch (err) {
      console.error('Failed to resume recording', err);
    }
  };

  const deleteRecording = async () => {
    try {
      console.log('Deleting recording...');
      
      // Clear interval
      if (recordingAnim._intervalId) {
        clearInterval(recordingAnim._intervalId);
        delete recordingAnim._intervalId;
      }

      // Stop pulse animation
      if (recordingAnim._pulseAnimation) {
        recordingAnim._pulseAnimation.stop();
        delete recordingAnim._pulseAnimation;
      }

      // Reset animations
      Animated.parallel([
        Animated.spring(recordingAnim, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Stop and discard recording
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;
      }

      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
      
      console.log('Recording deleted');
    } catch (err) {
      console.error('Failed to delete recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      console.log('Stopping recording...');
      setIsRecording(false);
      
      // Clear interval
      if (recordingAnim._intervalId) {
        clearInterval(recordingAnim._intervalId);
        delete recordingAnim._intervalId;
      }

      // Stop pulse animation
      if (recordingAnim._pulseAnimation) {
        recordingAnim._pulseAnimation.stop();
        delete recordingAnim._pulseAnimation;
      }

      // Reset animations
      Animated.parallel([
        Animated.spring(recordingAnim, {
          toValue: 0,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Stop and save recording
      if (recordingRef.current) {
        const currentRecordingTime = recordingTime;
        
        if (currentRecordingTime > 0) {
          await recordingRef.current.stopAndUnloadAsync();
          const uri = recordingRef.current.getURI();
          
          const newRecording = {
            id: Date.now(),
            duration: currentRecordingTime,
            timestamp: new Date().toISOString(),
            uri: uri,
          };
          setRecordings(prev => [...prev, newRecording]);
          
          console.log('Recording saved:', uri);
        } else {
          // If recording time is 0, just clean up
          await recordingRef.current.stopAndUnloadAsync();
        }
        
        recordingRef.current = null;
      }

      setRecordingTime(0);
    } catch (err) {
      console.error('Failed to stop recording', err);
      // Make sure to clean up even on error
      recordingRef.current = null;
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const insertNewLine = () => {
    setThreadText(prev => prev + '\n');
  };

  const scrollToBottom = () => {
    if (textInputRef.current) {
      textInputRef.current.blur();
      setTimeout(() => {
        textInputRef.current.focus();
      }, 100);
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      translateY.setOffset(translateY._value);
      translateY.setValue(0);
    },
    onPanResponderMove: (_, gestureState) => {
      // Only allow dragging down
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      translateY.flattenOffset();
      const { dy, vy } = gestureState;
      
      if (vy > 0.5 || dy > 100) {
        // Close the modal
        onClose();
      } else {
        // Return to original position
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <>
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                { translateY: Animated.add(modalTranslateY, translateY) },
              ],
            },
          ]}
        >
          <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={isKeyboardVisible ? (Platform.OS === 'ios' ? 90 : 30) : 0}
            enabled={true}
          >
            {/* Draggable Handle */}
            <View style={styles.dragHandle} {...panResponder.panHandlers}>
              <View style={styles.dragLine} />
            </View>

            {/* Content */}
            <ScrollView 
              style={styles.content}
              // keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.titleText}>
                Create Thread
              </Text>
              
              {/* Text Input Area - Full Page Editor */}
              <TextInput
                ref={textInputRef}
                style={styles.textInput}
                placeholder="What's on your mind?"
                placeholderTextColor={colors.textSecondary}
                multiline={true}
                textAlignVertical="top"
                value={threadText}
                onChangeText={setThreadText}
                returnKeyType="default"
                blurOnSubmit={false}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                selectionColor={colors.primary}
                cursorColor={colors.primary}
              />

              {/* Recordings Display */}
              {recordings.length > 0 && (
                <View style={styles.attachmentsContainer}>
                  {/* <Text style={styles.attachmentLabel}>Voice Recordings:</Text> */}
                  {recordings.map((recording) => {
                    const isPlaying = playingRecordingId === recording.id;
                    const currentTime = playbackTime[recording.id] || 0;
                    const progressAnim = getProgressAnim(recording.id);
                    
                    return (
                      <View key={recording.id} style={styles.recordingItem}>
                        {/* Play/Pause Button */}
                        <TouchableOpacity 
                          onPress={() => togglePlayback(recording.id, recording.duration)}
                          style={styles.playButton}
                        >
                          <Ionicons 
                            name={isPlaying ? "pause" : "play"} 
                            size={20} 
                            color={colors.primary} 
                          />
                        </TouchableOpacity>

                        {/* Recording Info */}
                        <View style={styles.recordingInfo}>
                          {/* Progress Bar */}
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
                          {/* Time Display */}
                          <Text style={styles.recordingDuration}>
                            {formatTime(currentTime)} / {formatTime(recording.duration)}
                          </Text>
                        </View>

                        {/* Remove Button */}
                        <TouchableOpacity onPress={() => removeRecording(recording.id)}>
                          <Ionicons name="close-circle" size={24} color={colors.danger} />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Images Display */}
              {selectedImages.length > 0 && (
                <View style={styles.attachmentsContainer}>
                  {/* <Text style={styles.attachmentLabel}>Images:</Text> */}
                  <View style={styles.imagesGrid}>
                    {selectedImages.map((image) => (
                      <View key={image.id} style={styles.imageItem}>
                        <TouchableOpacity 
                          onPress={() => openImageViewer(image)}
                          activeOpacity={0.9}
                        >
                          <Image 
                            source={{ uri: image.uri }} 
                            style={styles.imageThumbnail}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.removeImageButton}
                          onPress={() => removeImage(image.id)}
                        >
                          <Ionicons name="close-circle" size={20} color={colors.danger} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Videos Display */}
              {selectedVideos.length > 0 && (
                <View style={styles.attachmentsContainer}>
                  <Text style={styles.attachmentLabel}>Video Notes:</Text>
                  <View style={styles.imagesGrid}>
                    {selectedVideos.map((video) => (
                      <View key={video.id} style={styles.imageItem}>
                        <TouchableOpacity 
                          style={styles.videoThumbnailContainer}
                          onPress={() => openVideoPlayer(video.id)}
                          activeOpacity={0.8}
                        >
                          <Image 
                            source={{ uri: video.uri }} 
                            style={styles.videoThumbnail}
                            resizeMode="cover"
                          />
                          {/* Play Icon Overlay */}
                          <View style={styles.playButtonOverlay}>
                            <View style={styles.playButtonCircle}>
                              <Ionicons name="play" size={24} color={colors.white} />
                            </View>
                          </View>
                          {/* Duration Badge */}
                          {video.duration && (
                            <View style={styles.durationBadge}>
                              <Text style={styles.durationText}>
                                {Math.round(video.duration)}s
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.removeImageButton}
                          onPress={() => removeVideo(video.id)}
                        >
                          <Ionicons name="close-circle" size={20} color={colors.danger} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={[styles.sendButtonContainer, { paddingBottom: bottom + (isKeyboardVisible ? 20 : 0) }]}>
              {isRecording ? (
                /* Recording UI */
                <Animated.View 
                  style={[
                    styles.recordingFullContainer,
                    {
                      opacity: recordingAnim,
                    },
                  ]}
                >
                  {/* Delete Button */}
                  <TouchableOpacity 
                    style={styles.recordingDeleteButton}
                    onPress={deleteRecording}
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.primary} />
                  </TouchableOpacity>

                  {/* Recording Time */}
                  <View style={styles.recordingWaveformContainer}>
                    <Text style={styles.recordingTimeText}>{formatTime(recordingTime)}</Text>
                  </View>

                  {/* Pause/Play Button */}
                  <TouchableOpacity 
                    style={styles.recordingActionButton}
                    onPress={isPaused ? resumeRecording : pauseRecording}
                  >
                    <Ionicons 
                      name={isPaused ? "play" : "pause"} 
                      size={20} 
                      color={colors.primary} 
                    />
                  </TouchableOpacity>

                  {/* Done Button */}
                  <TouchableOpacity 
                    style={styles.recordingDoneButton}
                    onPress={stopRecording}
                  >
                    <Ionicons name="checkmark" size={20} color={colors.white} />
                  </TouchableOpacity>
                </Animated.View>
              ) : (
                <>
                  {/* Media Buttons */}
                  <View style={styles.mediaButtons}>
                    <TouchableOpacity 
                      style={styles.mediaButton} 
                      onPress={handleCamera}
                      onLongPress={handleCameraLongPress}
                    >
                      <Ionicons name="camera" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.mediaButton} onPress={handleGallery}>
                      <Ionicons name="image" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.mediaButton} 
                      onPress={startRecording}
                    >
                      <Ionicons 
                        name="mic" 
                        size={24} 
                        color={colors.textSecondary} 
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Send Button */}
                  <TouchableOpacity 
                    style={[
                      styles.sendButton,
                      !(threadText.trim() || recordings.length > 0 || selectedImages.length > 0 || selectedVideos.length > 0) && styles.sendButtonDisabled
                    ]} 
                    onPress={handleSend}
                    disabled={!(threadText.trim() || recordings.length > 0 || selectedImages.length > 0 || selectedVideos.length > 0)}
                  >
                    <Ionicons 
                      name="send" 
                      size={20} 
                      color={colors.white} 
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>

    </>
  );
};

export default CreateThread;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: metrics.borderRadius.lg,
    borderTopRightRadius: metrics.borderRadius.lg,
    height: screenHeight * 0.9,
  },
  container: {
    flex: 1,
  },
  dragHandle: {
    alignItems: 'center',
    paddingVertical: metrics.Vspacing.sm,
    paddingHorizontal: metrics.Hspacing.md,
   
  },
  dragLine: {
    width: 90,
    height: 2,
    backgroundColor: colors.border,
    borderRadius: metrics.borderRadius.sm,
  },
  content: {
  
    paddingHorizontal: metrics.Hspacing.sm,
paddingBottom: metrics.Vspacing.sm,
  
  },
  titleText: {
    fontSize: fontSizes.lg,
    color: colors.text,
    fontWeight: fontWeights.semibold,
    marginBottom: metrics.Vspacing.xxs,
  },
  textInput: {

    fontSize: fontSizes.md,
    color: colors.text,
    // backgroundColor: 'red',
    textAlignVertical: 'top',
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: metrics.Vspacing.sm,
    minHeight: 100,
  },

 
 
  sendButtonContainer: {
    paddingHorizontal: metrics.Hspacing.sm,
    paddingTop: metrics.Vspacing.xs,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',

  },
  mediaButtons: {
    flexDirection: 'row',
    gap: metrics.spacing.md,
    flex: 1,
  },
  mediaButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.5,
  },
  recordingFullContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: metrics.spacing.md,
  },
  recordingActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingDeleteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingWaveformContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: metrics.spacing.md,
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: metrics.Hspacing.md,
    paddingVertical: metrics.Vspacing.xs,
    borderRadius: metrics.borderRadius.lg,
  },
  recordingTimeText: {
    fontSize: fontSizes.md,
    color: colors.text,
    fontWeight: fontWeights.medium,
    minWidth: 35,
  },
  recordingDoneButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingTime: {
    fontSize: fontSizes.md,
    color: colors.danger,
    fontWeight: fontWeights.semibold,
  },
  recordingText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  attachmentsContainer: {
    // marginTop: metrics.Vspacing.md,
    paddingTop: metrics.Vspacing.sm,
  },
  attachmentLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
    marginBottom: metrics.Vspacing.xs,
  },
  recordingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundSecondary,
    padding: metrics.spacing.md,
    borderRadius: metrics.borderRadius.md,
    paddingVertical: metrics.Vspacing.xs,
    marginTop: metrics.Vspacing.xs,
   
    gap: metrics.spacing.md,
  },
  playButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,

  },
  recordingInfo: {
    flex: 1,
    paddingTop: metrics.Vspacing.xs,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: metrics.spacing.xs,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,

  },
  recordingDuration: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
    textAlign: 'right',
    marginTop: metrics.Vspacing.xxs,
  },
  recordingLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: metrics.spacing.md,
  },
  imageItem: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  imageThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: metrics.borderRadius.md,
    resizeMode: 'cover',
  },
  videoThumbnailContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: metrics.borderRadius.md,
    overflow: 'hidden',
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: metrics.borderRadius.sm,
  },
  durationText: {
    fontSize: fontSizes.xs,
    color: colors.white,
    fontWeight: fontWeights.semibold,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.white,
    borderRadius: 10,
  },
});
