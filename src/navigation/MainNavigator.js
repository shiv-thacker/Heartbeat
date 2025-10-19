import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import colors from '../theme/colors';
import { fontSizes, fontWeights } from '../theme/fonts';

// Import your screens
import CoursesScreen from '../screens/Courses/Screens/CoursesScreen';
import DocumentScreen from '../screens/Docs/Screens/DocumentScreen';
import EventsScreen from '../screens/Events/Screens/EventsScreen';
import FeedScreen from '../screens/Home/Screens/FeedScreen';
import MessageScreen from '../screens/Messages/Screens/MessageScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Custom Tab Icon Component with Press Effect
const TabIcon = ({
  focused,
  activeImage,
  inactiveImage,
  activeSize,
  inactiveSize,
  activeTintColor,
  inactiveTintColor,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View
      style={[styles.tabButtonContainer, isPressed && styles.tabButtonPressed]}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      <View style={styles.tabIconContainer}>
        {focused ? (
          <Image
            source={activeImage}
            tintColor={activeTintColor}
            style={activeSize ? [styles.tabIcon, activeSize] : styles.tabIcon}
          />
        ) : (
          <Image
            source={inactiveImage}
            style={inactiveSize ? [styles.tabIcon, inactiveSize] : styles.tabIcon}
            tintColor={inactiveTintColor}
          />
        )}
      </View>
    </View>
  );
};

// Tab Navigator with 5 tabs
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: styles.tabLabel,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="FeedScreen"
        component={FeedScreen}
        options={{
          tabBarShowLabel: false,
          tabBarLabel: 'FeedScreen',

          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              focused={focused}
              activeImage={require('../assets/images/bottomnavigation/home_active.png')}
              inactiveImage={require('../assets/images/bottomnavigation/home.png')}
              activeTintColor={colors.primary}
              inactiveTintColor={colors.textSecondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CoursesScreen"
        component={CoursesScreen} // Replace with your Explore screen
        options={{
          tabBarLabel: 'CoursesScreen',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              focused={focused}
              activeImage={require('../assets/images/bottomnavigation/learning_active.png')}
              inactiveImage={require('../assets/images/bottomnavigation/learning.png')}
              activeSize={{ height: 30, width: 30 }}
              inactiveSize={{ height: 30, width: 30 }}
              activeTintColor={colors.primary}
              inactiveTintColor={colors.textSecondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name="EventsScreen"
        component={EventsScreen} // Replace with your Favorites screen
        options={{
          tabBarLabel: 'EventsScreen',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              focused={focused}
              activeImage={require('../assets/images/bottomnavigation/calendar_active.png')}
              inactiveImage={require('../assets/images/bottomnavigation/calendar.png')}
              activeSize={{ height: 28, width: 28 }}
              inactiveSize={{ height: 22, width: 22 }}
              activeTintColor={colors.primary}
              inactiveTintColor={colors.textSecondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name="DocumentsScreen"
        component={DocumentScreen} // Replace with your Favorites screen
        options={{
          tabBarLabel: 'DocumentsScreen',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              focused={focused}
              activeImage={require('../assets/images/bottomnavigation/docs_active.png')}
              inactiveImage={require('../assets/images/bottomnavigation/docs.png')}
              activeTintColor={colors.primary}
              inactiveTintColor={colors.textSecondary}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MessageScreen"
        component={MessageScreen}
        options={{
          tabBarLabel: 'MessageScreen',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              focused={focused}
              activeImage={require('../assets/images/bottomnavigation/messages_active.png')}
              inactiveImage={require('../assets/images/bottomnavigation/messages.png')}
              activeTintColor={colors.primary}
              inactiveTintColor={colors.textSecondary}
            />
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
        headersShown: false,
      }}
    >
      <Stack.Screen
        name="BottomTabNavigator"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  // Custom Header Styles

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
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabLabel: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    marginTop: 4,
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
  tabButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderRadius: 16,
  },
  tabButtonPressed: {
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 8,
    // Light primary color background
  },
  tabIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
