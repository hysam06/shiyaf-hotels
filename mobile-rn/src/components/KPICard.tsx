import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';
import Icon, { IconName } from './Icon';

interface KPICardProps {
  label: string;
  value: string | number;
  icon: IconName;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: string;
}

export default function KPICard({ label, value, icon, trend, color = colors.primary }: KPICardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.label} numberOfLines={1}>{label}</Text>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}> 
          <Icon name={icon} size={17} color={color} />
        </View>
      </View>
      <Text style={styles.value}>{value}</Text>
      {trend && (
        <View style={styles.trendRow}>
          <Text style={[styles.trendValue, { color: trend.isPositive ? colors.success : colors.error }]}>
            {trend.isPositive ? '+' : '-'} {trend.value}
          </Text>
          <Text style={styles.trendText}> vs last week</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.large,
    padding: spacing.md,
    width: '47%', // responsive two-column grid card
    ...shadows.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold as any,
    color: colors.textSecondary,
    flex: 1,
    marginRight: spacing.xs,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendValue: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold as any,
  },
  trendText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
});
