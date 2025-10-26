import { Ionicons } from '@expo/vector-icons';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/slices/userSlice';
import colors from '../../../theme/colors';
import { fontSizes, fontWeights } from '../../../theme/fonts';
import { metrics } from '../../../theme/metrics';

const MenuScreen = ({ navigation, slideAnim, setShowMenu }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.info);
  const { top } = useSafeAreaInsets();
  const ios = Platform.OS === 'ios';
  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setShowMenu(false);
    });
  };

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
    // Navigation will handle redirecting to auth screens based on Redux state
  };

  const config = {
    title: 'Menu',
    rightIcon: <Ionicons name="close" size={24} color={colors.borderDark} />,
    onRightPress: () => navigation.goBack(),
  };

  return (
    <View style={[styles.overlay]}>
      <TouchableOpacity style={styles.overlayBackground} onPress={closeMenu} activeOpacity={1} />
      <Animated.View
        style={[
          styles.menuContainer,
          { paddingTop: ios ? top + 10 : top + 20 },
          {
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0], // Slide in from right
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.menuHeader}>
          <TouchableOpacity style={styles.backButton} onPress={closeMenu}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.menuTitle}>Menu</Text>
          <View style={styles.spacer} />
        </View>
        <View style={styles.menuContent}>
          <TouchableOpacity style={styles.menuItemContainer}>
            <Text style={styles.menuItem}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItemContainer}>
            <Text style={styles.menuItem}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItemContainer}>
            <Text style={styles.menuItem}>Help</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItemContainer} onPress={handleLogout}>
            <Text style={[styles.menuItem, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    flexDirection: 'row',
    backgroundColor: colors.transparent,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    paddingTop: 60, // Space for status bar
    paddingBottom: 100, // Space for tab bar
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: metrics.Hspacing.sm,
  },
  backButton: {
    paddingVertical: 10,
    borderRadius: 20,
  },
  spacer: {
    width: 40, // Same width as back button to center the title
  },
  menuTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    color: colors.text,
    textAlign: 'center',
    fontFamily: 'Georgia',
  },
  menuContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  menuItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItem: {
    fontSize: 16,
    color: colors.text,
    paddingVertical: 15,
  },
  logoutText: {
    color: colors.danger,
  },
});
