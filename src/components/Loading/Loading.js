import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes } from '../../theme/fonts';
import metrics from '../../theme/metrics';

export default function Loading({ text = 'Loading...', fullScreen = false }) {
  if (fullScreen) {
    return (
      <View style={styles.fullScreenContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={colors.primary} />
      {text && <Text style={styles.smallText}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: metrics.Hspacing.md,
  },
  text: {
    marginTop: metrics.Hspacing.md,
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  smallText: {
    marginLeft: metrics.Hspacing.sm,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
});
