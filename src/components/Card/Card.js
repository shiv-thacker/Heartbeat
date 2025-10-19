import { StyleSheet, View } from 'react-native';
import colors from '../../theme/colors';
import metrics from '../../theme/metrics';

export default function Card({ children, style, elevated = true }) {
  return <View style={[styles.card, elevated && styles.elevated, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: metrics.borderRadius.lg,
    padding: metrics.Hspacing.lg,
    marginBottom: metrics.Hspacing.md,
  },
  elevated: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
