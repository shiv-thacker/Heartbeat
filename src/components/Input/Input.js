import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../../theme/colors';
import { fontSizes, fontWeights } from '../../theme/fonts';
import metrics from '../../theme/metrics';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  leftIcon,
  rightIcon,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  editable = true,
  style,
  inputStyle,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          !editable && styles.inputContainerDisabled,
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, multiline && styles.multilineInput, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={secureTextEntry && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity style={styles.rightIcon} onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.passwordToggle}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: metrics.Hspacing.md,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.text,
    marginBottom: metrics.Hspacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: metrics.inputHeight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: metrics.borderRadius.md,
    backgroundColor: colors.white,
    paddingHorizontal: metrics.Hspacing.md,
  },
  inputContainerFocused: {
    borderColor: colors.primary,
  },
  inputContainerError: {
    borderColor: colors.danger,
  },
  inputContainerDisabled: {
    backgroundColor: colors.backgroundSecondary,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: fontSizes.md,
    color: colors.text,
    padding: 0,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: metrics.Hspacing.sm,
  },
  leftIcon: {
    marginRight: metrics.Hspacing.sm,
  },
  rightIcon: {
    marginLeft: metrics.Hspacing.sm,
  },
  passwordToggle: {
    fontSize: fontSizes.lg,
  },
  errorText: {
    fontSize: fontSizes.xs,
    color: colors.danger,
    marginTop: metrics.Hspacing.xs,
  },
});
