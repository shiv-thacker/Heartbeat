import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/userSlice';
import colors from '../../theme/colors';
import { fontSizes, fontWeights } from '../../theme/fonts';
import metrics from '../../theme/metrics';

const CustomHeader = ({
  title,
  rightIcon,
  rightIcon2,
  rightIcon3,
  onRightPress,
  onRightPress2,
  onRightPress3,
  user,
}) => {
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

        {/* Center Title */}
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>

        {/* Right Side */}
        <View style={styles.headerRight}>
          <View style={styles.headerRightIcons}>
            {rightIcon && (
              <TouchableOpacity onPress={onRightPress} style={styles.headerButton}>
                {rightIcon}
              </TouchableOpacity>
            )}
            {rightIcon2 && (
              <TouchableOpacity onPress={onRightPress2} style={styles.headerButton}>
                {rightIcon2}
              </TouchableOpacity>
            )}
            {rightIcon3 && (
              <TouchableOpacity onPress={onRightPress3} style={styles.headerButton}>
                {rightIcon3}
              </TouchableOpacity>
            )}
            {!rightIcon && !rightIcon2 && !rightIcon3 && (
              <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  headerContainer: {
    shadowColor: colors.black,

    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
  },

  headerContent: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: metrics.Hspacing.sm,
    height: 60,
  },
  headerLeft: {
    alignItems: 'flex-start',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: metrics.Hspacing.sm,
    borderRadius: metrics.borderRadius.sm,
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    color: colors.text,
    textAlign: 'center',
    fontFamily: 'Georgia',
  },
  headerIcon: {
    fontSize: 20,
    color: colors.primary,
  },
});
