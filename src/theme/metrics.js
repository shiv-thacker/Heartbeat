import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const metrics = {
  screenWidth: width,
  screenHeight: height,

  // Hspacing
  Hspacing: {
    xs: width * 0.02,
    sm: width * 0.04,
    md: width * 0.08,
    lg: width * 0.12,
    xl: width * 0.16,
    xxl: width * 0.24,
  },

  // Vspacing
  Vspacing: {
    xs: height * 0.02,
    sm: height * 0.04,
    md: height * 0.08,
    lg: height * 0.12,
    xl: height * 0.16,
    xxl: height * 0.24,
    xxxl: height * 0.32,
  },
  VspacingFonts: {
    xs: height * 0.005,
    sm: height * 0.01,
    md: height * 0.02,
    lg: height * 0.03,
    xl: height * 0.04,
    xxl: height * 0.06,
    xxxl: height * 0.08,
  },

  spacing: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
  },

  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },

  // Component dimensions
  buttonHeight: 48,
  inputHeight: 48,
  headerHeight: Platform.OS === 'ios' ? height * 0.05 : height * 0.06,
  tabBarHeight: height * 0.06,

  // Gutters
  gutterHorizontal: 16,
  gutterVertical: 16,
};

export default metrics;
