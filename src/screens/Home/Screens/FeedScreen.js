import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import CustomHeader from '../../../components/CustomHeader/CustomHeader';
import colors from '../../../theme/colors';
import { fontSizes, fontWeights } from '../../../theme/fonts';
import metrics from '../../../theme/metrics';
import CreateThread from '../Components/CreateThread';
import ThreadCard from '../Components/ThreadCard';
import MenuScreen from './MenuScreen';

const FeedScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user.info);
  const threads = useSelector((state) => state.threads.threads);
  const [showMenu, setShowMenu] = useState(false);
  const [showCreateThread, setShowCreateThread] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));
  const [createThreadAnim] = useState(new Animated.Value(0));

  const openCreateThread = () => {
    console.log('Opening CreateThread modal...');
    setShowCreateThread(true);
    Animated.timing(createThreadAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const closeCreateThread = () => {
    Animated.timing(createThreadAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      setShowCreateThread(false);
    });
  };

  const openMenu = () => {
    setShowMenu(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const config = {
    title: 'Feed Screen',
    rightIcon: <Ionicons name="notifications" size={24} color={colors.borderDark} />,
    rightIcon2: <Ionicons name="search" size={24} color={colors.borderDark} />,
    rightIcon3: <Ionicons name="menu" size={24} color={colors.borderDark} />,
    onRightPress: () => console.log('Search pressed'),
    onRightPress2: () => console.log('Notifications pressed'),
    onRightPress3: openMenu,
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title={config.title}
        rightIcon={config.rightIcon}
        rightIcon2={config.rightIcon2}
        rightIcon3={config.rightIcon3}
        onRightPress={config.onRightPress}
        onRightPress2={config.onRightPress2}
        onRightPress3={config.onRightPress3}
        user={user}
      />
      {/* Threads List */}
      <ScrollView 
        style={styles.threadsList}
        contentContainerStyle={styles.threadsListContent}
        showsVerticalScrollIndicator={false}
      >
        {threads.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color={colors.border} />
            <Text style={styles.emptyStateText}>No threads yet</Text>
            <Text style={styles.emptyStateSubtext}>Create your first thread to get started</Text>
          </View>
        ) : (
          threads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))
        )}
      </ScrollView>

      {/* Floating Edit Icon */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={openCreateThread}
        activeOpacity={0.8}
      >
        <Ionicons name="create" size={24} color={colors.white} />
      </TouchableOpacity>

      {/* Menu Overlay */}
      {showMenu && (
        <MenuScreen navigation={navigation} slideAnim={slideAnim} setShowMenu={setShowMenu} />
      )}

      {/* CreateThread Modal */}
      {showCreateThread && (
        <CreateThread 
          visible={showCreateThread}
          onClose={closeCreateThread}
          slideAnim={createThreadAnim}
        />
      )}
    </View>
  );
};

export default FeedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  threadsList: {
    flex: 1,
  },
  threadsListContent: {
    padding: metrics.spacing.md,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: metrics.Vspacing.xxl,
  },
  emptyStateText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginTop: metrics.Vspacing.md,
  },
  emptyStateSubtext: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: metrics.Vspacing.xs,
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: metrics.Vspacing.lg,
    right: metrics.Hspacing.sm,
    width: metrics.buttonHeight + 8, // 56px (48 + 8)
    height: metrics.buttonHeight + 8, // 56px (48 + 8)
    borderRadius: metrics.borderRadius.round,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
   
    shadowOpacity: 0.3,
    shadowRadius: metrics.spacing.sm,
    elevation: 6,
  },
});
