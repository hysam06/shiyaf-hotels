import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  count?: number;
}

export default function FilterChip({ label, active, onPress, count }: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        active ? styles.chipActive : styles.chipInactive,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.text,
          active ? styles.textActive : styles.textInactive,
        ]}
      >
        {label}
      </Text>
      {count !== undefined && (
        <View
          style={[
            styles.countBadge,
            active ? styles.countBadgeActive : styles.countBadgeInactive,
          ]}
        >
          <Text
            style={[
              styles.countText,
              active ? styles.countTextActive : styles.countTextInactive,
            ]}
          >
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.circle,
    marginRight: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipInactive: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold as any,
  },
  textActive: {
    color: colors.textOnDark,
  },
  textInactive: {
    color: colors.textSecondary,
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.circle,
    marginLeft: 6,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countBadgeInactive: {
    backgroundColor: colors.background,
  },
  countText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold as any,
  },
  countTextActive: {
    color: colors.textOnDark,
  },
  countTextInactive: {
    color: colors.textSecondary,
  },
});
