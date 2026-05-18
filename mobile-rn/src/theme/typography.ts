// Design System - Typography Hierarchy
import { TextStyle } from 'react-native';

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    light: '300' as TextStyle['fontWeight'],
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    black: '900' as TextStyle['fontWeight'],
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Ready-to-use premium text styles
export const textPresets = {
  h1: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    lineHeight: typography.sizes.xxxl * typography.lineHeights.tight,
  } as TextStyle,
  h2: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.sizes.xxl * typography.lineHeights.tight,
  } as TextStyle,
  h3: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.sizes.xl * typography.lineHeights.tight,
  } as TextStyle,
  subtitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    lineHeight: typography.sizes.md * typography.lineHeights.normal,
  } as TextStyle,
  body: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
    lineHeight: typography.sizes.sm * typography.lineHeights.relaxed,
  } as TextStyle,
  bodySemibold: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.sizes.sm * typography.lineHeights.relaxed,
  } as TextStyle,
  caption: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    lineHeight: typography.sizes.xs * typography.lineHeights.normal,
  } as TextStyle,
  button: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.sizes.md * typography.lineHeights.tight,
  } as TextStyle,
};
