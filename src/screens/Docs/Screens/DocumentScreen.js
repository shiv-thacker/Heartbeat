import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import CustomHeader from '../../../components/CustomHeader/CustomHeader';
import colors from '../../../theme/colors';
import { fontSizes, fontWeights } from '../../../theme/fonts';
import metrics from '../../../theme/metrics';

const DocumentScreen = () => {
  const user = useSelector((state) => state.user.info);

  const config = {
    title: 'Docs',
    rightIcon: <Ionicons name="notifications" size={24} color={colors.text} />,
    rightIcon2: <Ionicons name="search" size={24} color={colors.text} />,
    onRightPress: () => console.log('Search pressed'),
    onRightPress2: () => console.log('Notifications pressed'),
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
      <View style={styles.emptyState}>
        <Ionicons name="document-text-outline" size={64} color={colors.border} />
        <Text style={styles.emptyStateText}>No documents found</Text>
        <Text style={styles.emptyStateSubtext}>Check back later for new documents</Text>
      </View>
    </View>
  );
};

export default DocumentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
});
