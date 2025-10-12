import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, fontWeights } from '../../theme/fonts';
import metrics from '../../theme/metrics';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) {
  const getButtonStyle = () => {
    const styles = [buttonStyles.base];

    // Variant styles
    switch (variant) {
      case 'primary':
        styles.push(buttonStyles.primary);
        break;
      case 'secondary':
        styles.push(buttonStyles.secondary);
        break;
      case 'danger':
        styles.push(buttonStyles.danger);
        break;
      case 'outline':
        styles.push(buttonStyles.outline);
        break;
      default:
        styles.push(buttonStyles.primary);
    }

    // Size styles
    switch (size) {
      case 'small':
        styles.push(buttonStyles.small);
        break;
      case 'large':
        styles.push(buttonStyles.large);
        break;
      default:
        styles.push(buttonStyles.medium);
    }

    if (disabled) {
      styles.push(buttonStyles.disabled);
    }

    if (style) {
      styles.push(style);
    }

    return styles;
  };

  const getTextStyle = () => {
    const styles = [buttonStyles.text];

    switch (variant) {
      case 'outline':
        styles.push(buttonStyles.outlineText);
        break;
      default:
        styles.push(buttonStyles.primaryText);
    }

    if (disabled) {
      styles.push(buttonStyles.disabledText);
    }

    if (textStyle) {
      styles.push(textStyle);
    }

    return styles;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.white} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const buttonStyles = StyleSheet.create({
  base: {
    borderRadius: metrics.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  outline: {
    backgroundColor: colors.transparent,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  small: {
    height: 36,
    paddingHorizontal: metrics.spacing.md,
  },
  medium: {
    height: metrics.buttonHeight,
    paddingHorizontal: metrics.spacing.lg,
  },
  large: {
    height: 56,
    paddingHorizontal: metrics.spacing.xl,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
  primaryText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.primary,
  },
  disabledText: {
    opacity: 0.7,
  },
});
