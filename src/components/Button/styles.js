import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, fontWeights } from '../../theme/fonts';
import metrics from '../../theme/metrics';

export default StyleSheet.create({
  button: {
    height: metrics.buttonHeight,
    backgroundColor: colors.primary,
    borderRadius: metrics.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: metrics.Hspacing.lg,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
});
