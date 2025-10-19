import { StyleSheet, Text } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, fontWeights } from '../../theme/fonts';

const CommonText = ({
  children,
  type = 'body',
  color = colors.text,
  style,
  numberOfLines,
  ...props
}) => {
  const getTextStyle = () => {
    const baseStyle = styles[type] || styles.body;
    return [baseStyle, { color }, style];
  };

  return (
    <Text style={getTextStyle()} numberOfLines={numberOfLines} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  // Headers
  h1: {
    fontSize: fontSizes.xxxl,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.xxxl * 1.2,
  },
  h2: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.xxl * 1.2,
  },
  h3: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.xl * 1.2,
  },
  h4: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.lg * 1.2,
  },
  h5: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.md * 1.2,
  },
  h6: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.sm * 1.2,
  },

  // Body text
  body: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.md * 1.4,
  },
  bodyLarge: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.lg * 1.4,
  },
  bodySmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.sm * 1.4,
  },

  // Caption and small text
  caption: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.regular,
    lineHeight: fontSizes.xs * 1.3,
  },
  captionBold: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.xs * 1.3,
  },

  // Labels
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.sm * 1.2,
  },
  labelLarge: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.md * 1.2,
  },

  // Button text
  button: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.md * 1.2,
  },
  buttonLarge: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.lg * 1.2,
  },
  buttonSmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    lineHeight: fontSizes.sm * 1.2,
  },

  // Special text types
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.xl * 1.2,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.lg * 1.3,
  },
  overline: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    letterSpacing: 1,
    lineHeight: fontSizes.xs * 1.2,
    textTransform: 'uppercase',
  },

  // Error and success text
  error: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    color: colors.danger,
    lineHeight: fontSizes.sm * 1.3,
  },
  success: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    color: colors.success,
    lineHeight: fontSizes.sm * 1.3,
  },
  warning: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.regular,
    color: colors.warning,
    lineHeight: fontSizes.sm * 1.3,
  },

  // Light text variants
  light: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.light,
    lineHeight: fontSizes.md * 1.4,
  },
  lightSmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.light,
    lineHeight: fontSizes.sm * 1.4,
  },

  // Bold text variants
  bold: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.md * 1.3,
  },
  boldLarge: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.lg * 1.3,
  },
  boldSmall: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.sm * 1.3,
  },
});

export default CommonText;
