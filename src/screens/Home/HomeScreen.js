import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/userSlice';
import colors from '../../theme/colors';
import { fontSizes, fontWeights } from '../../theme/fonts';
import metrics from '../../theme/metrics';

export default function HomeScreen({ navigation }) {
  const user = useSelector((state) => state.user.info);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name || 'User'}!</Text>
        <Text style={styles.subtitle}>Welcome to Heartbeat</Text>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dashboard</Text>
          <Text style={styles.cardText}>View your activity and statistics</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile</Text>
          <Text style={styles.cardText}>Manage your account settings</Text>
        </View>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.cardTitle}>Settings</Text>
          <Text style={styles.cardText}>Configure your preferences</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    padding: metrics.Hspacing.lg,
  },
  header: {
    backgroundColor: colors.background,
    padding: metrics.Hspacing.xl,
    paddingTop: metrics.Hspacing.xxl,
  },
  greeting: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: metrics.Hspacing.xs,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  cardContainer: {
    paddingVertical: metrics.Hspacing.md,
  },
  card: {
    backgroundColor: colors.background,
    padding: metrics.Hspacing.lg,
    borderRadius: metrics.borderRadius.lg,
    marginBottom: metrics.Hspacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    marginBottom: metrics.Hspacing.xs,
  },
  cardText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  logoutButton: {
    margin: metrics.Hspacing.md,
    height: metrics.buttonHeight,
    backgroundColor: colors.danger,
    borderRadius: metrics.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
});
