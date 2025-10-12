import { StyleSheet, View } from 'react-native';
import colors from '../../theme/colors';

export default function GradientBackground({ children, style }) {
  return <View style={[styles.gradient, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: colors.gradientStart, // Fallback color
    // Note: For a true gradient effect, you would need expo-linear-gradient
    // Install with: expo install expo-linear-gradient
    // Then uncomment the LinearGradient import and component above
  },
});
