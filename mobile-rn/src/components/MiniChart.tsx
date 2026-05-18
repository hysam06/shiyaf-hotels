import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';

interface MiniChartProps {
  data?: Array<{ label: string; value: number }>;
}

const DEFAULT_DATA = [
  { label: 'Mon', value: 12000 },
  { label: 'Tue', value: 19000 },
  { label: 'Wed', value: 15000 },
  { label: 'Thu', value: 24000 },
  { label: 'Fri', value: 32000 },
  { label: 'Sat', value: 45000 },
  { label: 'Sun', value: 38000 },
];

export default function MiniChart({ data = DEFAULT_DATA }: MiniChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Weekly Revenue Analytics</Text>
          <Text style={styles.subtitle}>Last 7 days performance</Text>
        </View>
        <View style={styles.legend}>
          <View style={styles.legendDot} />
          <Text style={styles.legendText}>Revenue (₹)</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        {/* Y-Axis Guideline Indicators */}
        <View style={styles.gridLines}>
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
        </View>

        {/* Bars Container */}
        <View style={styles.barsContainer}>
          {data.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            const isHigh = item.value === maxValue;

            return (
              <View key={index} style={styles.barColumn}>
                <View style={styles.barTrack}>
                  {/* Dynamic Height Orange Bar */}
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: `${percentage}%`,
                        backgroundColor: isHigh ? colors.primary : '#FF9F76',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{item.label}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.large,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold as any,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.small,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  legendText: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.semibold as any,
  },
  chartContainer: {
    height: 160,
    position: 'relative',
    justifyContent: 'flex-end',
    paddingTop: 10,
  },
  gridLines: {
    position: 'absolute',
    top: 10,
    bottom: 25,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: '#EEF2F6',
    width: '100%',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    zIndex: 1,
  },
  barColumn: {
    alignItems: 'center',
    width: '12%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    height: '80%',
    width: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: borderRadius.circle,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  barFill: {
    width: '100%',
    borderRadius: borderRadius.circle,
  },
  barLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium as any,
  },
});
