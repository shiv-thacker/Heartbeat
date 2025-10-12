import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/userSlice';
import colors from '../theme/colors';
import { fontSizes, fontWeights } from '../theme/fonts';
import metrics from '../theme/metrics';

// Import your screens
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Home/ProfileScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Common Custom Header Component
function CustomHeader({ title, leftIcon, rightIcon, onLeftPress, onRightPress, user }) {
  const dispatch = useDispatch();
  const { top } = useSafeAreaInsets();
  const ios = Platform.OS === 'ios';

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View style={styles.headerContainer} paddingTop={ios ? top : top + 10}>
      {/* Status Bar Space */}
      <View style={styles.statusBar} />

      {/* Header Content */}
      <View style={styles.headerContent}>
        {/* Left Side */}
        <View style={styles.headerLeft}>
          {leftIcon && (
            <TouchableOpacity onPress={onLeftPress} style={styles.headerButton}>
              {leftIcon}
            </TouchableOpacity>
          )}
        </View>

        {/* Center Title */}
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        {/* Right Side */}
        <View style={styles.headerRight}>
          {rightIcon ? (
            <TouchableOpacity onPress={onRightPress} style={styles.headerButton}>
              {rightIcon}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

// Tab Navigator with 5 tabs
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Text style={[styles.tabIcon, { color, fontSize: size }]}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={HomeScreen} // Replace with your Explore screen
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Text style={[styles.tabIcon, { color, fontSize: size }]}>🔍</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={ProfileScreen} // Replace with your Favorites screen
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Text style={[styles.tabIcon, { color, fontSize: size }]}>❤️</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Text style={[styles.tabIcon, { color, fontSize: size }]}>👤</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Text style={[styles.tabIcon, { color, fontSize: size }]}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main Navigator with Stack and Custom Headers
export default function MainNavigator() {
  const user = useSelector((state) => state.user.info);

  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ route, navigation }) => {
          // Define header configs for each screen
          const headerConfigs = {
            HomeTab: {
              title: 'Heartbeat',
              leftIcon: <Text style={styles.headerIcon}>💓</Text>,
              rightIcon: <Text style={styles.headerIcon}>🔔</Text>,
              onLeftPress: () => console.log('Menu pressed'),
              onRightPress: () => console.log('Notifications pressed'),
            },
            ExploreTab: {
              title: 'Explore',
              leftIcon: <Text style={styles.headerIcon}>🔍</Text>,
              rightIcon: <Text style={styles.headerIcon}>🎯</Text>,
              onLeftPress: () => console.log('Search pressed'),
              onRightPress: () => console.log('Filter pressed'),
            },
            FavoritesTab: {
              title: 'My Favorites',
              leftIcon: <Text style={styles.headerIcon}>❤️</Text>,
              rightIcon: <Text style={styles.headerIcon}>📝</Text>,
              onLeftPress: () => console.log('Heart pressed'),
              onRightPress: () => console.log('Edit pressed'),
            },
            ProfileTab: {
              title: user?.name || 'Profile',
              leftIcon: <Text style={styles.headerIcon}>👤</Text>,
              rightIcon: <Text style={styles.headerIcon}>✏️</Text>,
              onLeftPress: () => console.log('Profile pressed'),
              onRightPress: () => console.log('Edit profile pressed'),
            },
            SettingsTab: {
              title: 'Settings',
              leftIcon: <Text style={styles.headerIcon}>⚙️</Text>,
              // No rightIcon - will show Logout button
            },
          };

          const config = headerConfigs[route.name] || { title: route.name };

          return (
            <CustomHeader
              title={config.title}
              leftIcon={config.leftIcon}
              rightIcon={config.rightIcon}
              onLeftPress={config.onLeftPress}
              onRightPress={config.onRightPress}
              user={user}
            />
          );
        },
      }}
    >
      <Stack.Screen name="HomeTab" component={TabNavigator} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  // Custom Header Styles
  headerContainer: {
    shadowColor: colors.black,

    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: metrics.spacing.lg,
    height: 60,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerButton: {
    padding: metrics.spacing.sm,
    borderRadius: metrics.borderRadius.sm,
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.text,
    textAlign: 'center',
  },
  headerIcon: {
    fontSize: 20,
    color: colors.primary,
  },
  logoutText: {
    fontSize: fontSizes.sm,
    color: colors.error,
    fontWeight: fontWeights.medium,
  },

  // Tab Bar Styles
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: 80,
    paddingBottom: 20,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    marginTop: 4,
  },
  tabIcon: {
    fontSize: 24,
  },
});
