import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes } from '../../theme/fonts';
import metrics from '../../theme/metrics';

export default StyleSheet.create({
  container: {
    marginBottom: metrics.Hspacing.md,
  },
  input: {
    height: metrics.inputHeight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: metrics.borderRadius.md,
    paddingHorizontal: metrics.Hspacing.md,
    fontSize: fontSizes.md,
    backgroundColor: colors.white,
  },
});
