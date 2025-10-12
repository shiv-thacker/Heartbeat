import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

export const metrics = {
  screenWidth: width,
  screenHeight: height,

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
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
  headerHeight: Platform.OS === "ios" ? 44 : 56,
  tabBarHeight: 50,

  // Gutters
  gutterHorizontal: 16,
  gutterVertical: 16,
};

export default metrics;
