import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

type BadgeType = 'checked_in' | 'checked_out' | 'cancelled' | 'admin' | 'manager' | 'staff' | 'warning';

interface BadgeProps {
  type: BadgeType;
  label?: string;
}

export default function Badge({ type, label }: BadgeProps) {
  const getBadgeStyle = () => {
    switch (type) {
      case 'checked_in':
        return {
          bg: colors.successLight,
          text: colors.success,
          lbl: label || 'Checked In',
        };
      case 'checked_out':
        return {
          bg: '#F1F5F9', // light slate grey
          text: colors.textSecondary,
          lbl: label || 'Checked Out',
        };
      case 'cancelled':
        return {
          bg: colors.errorLight,
          text: colors.error,
          lbl: label || 'Cancelled',
        };
      case 'admin':
        return {
          bg: colors.primaryLight,
          text: colors.primary,
          lbl: label || 'Admin',
        };
      case 'manager':
        return {
          bg: '#E0F2FE', // light sky blue
          text: '#0284C7',
          lbl: label || 'Manager',
        };
      case 'staff':
        return {
          bg: '#EEF2F6', // soft cool gray
          text: '#475569',
          lbl: label || 'Staff',
        };
      case 'warning':
        return {
          bg: colors.warningLight,
          text: colors.warning,
          lbl: label || 'Alert',
        };
      default:
        return {
          bg: '#F1F5F9',
          text: '#475569',
          lbl: label || 'Unknown',
        };
    }
  };

  const styleConfig = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: styleConfig.bg }]}>
      {/* Dynamic Status Micro-Dot */}
      <View style={[styles.dot, { backgroundColor: styleConfig.text }]} />
      <Text style={[styles.text, { color: styleConfig.text }]}>{styleConfig.lbl}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.circle,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold as any,
    textTransform: 'capitalize',
  },
});
