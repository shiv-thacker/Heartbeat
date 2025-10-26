import { Ionicons } from '@expo/vector-icons';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import CustomHeader from '../../../components/CustomHeader/CustomHeader';
import colors from '../../../theme/colors';
import { fontSizes, fontWeights } from '../../../theme/fonts';
import metrics from '../../../theme/metrics';

// Dummy users data
const DUMMY_USERS = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    lastMessage: 'Hey! How are you?',
    time: '10:30 AM',
    unread: 2,
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?img=2',
    lastMessage: 'See you tomorrow!',
    time: '9:15 AM',
    unread: 0,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    avatar: 'https://i.pravatar.cc/150?img=3',
    lastMessage: 'Thanks for your help',
    time: 'Yesterday',
    unread: 1,
  },
  {
    id: '4',
    name: 'Sarah Williams',
    avatar: 'https://i.pravatar.cc/150?img=4',
    lastMessage: 'Let me know when you are free',
    time: 'Yesterday',
    unread: 0,
  },
];

const MessageScreen = ({ navigation }) => {
  const user = useSelector((state) => state.user.info);

  const config = {
    title: 'Direct Messages',
    rightIcon: <Ionicons name="notifications" size={24} color={colors.text} />,
    rightIcon2: <Ionicons name="search" size={24} color={colors.text} />,
    onRightPress: () => console.log('Search pressed'),
    onRightPress2: () => console.log('Notifications pressed'),
  };

  const handleUserPress = (selectedUser) => {
    navigation.navigate('ChatScreen', { user: selectedUser });
  };

  const renderUserCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.userCard}
      onPress={() => handleUserPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

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
      
      <FlatList
        data={DUMMY_USERS}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContainer: {
    paddingVertical: metrics.Vspacing.xs,
  },
  userCard: {
    flexDirection: 'row',
    padding: metrics.Hspacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: metrics.Hspacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.backgroundSecondary,
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: colors.white,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  timeText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  lastMessage: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
});
