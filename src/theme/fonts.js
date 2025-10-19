import metrics from './metrics';

export const fonts = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const fontSizes = {
  xs: metrics.VspacingFonts.xs,
  sm: metrics.VspacingFonts.sm,
  md: metrics.VspacingFonts.md,
  lg: metrics.VspacingFonts.lg,
  xl: metrics.VspacingFonts.xl,
  xxl: metrics.VspacingFonts.xxl,
  xxxl: metrics.VspacingFonts.xxxl,
};

export const fontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export default {
  fonts,
  fontSizes,
  fontWeights,
};
