import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { Guest } from '../types';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';
import Avatar from './Avatar';
import Badge from './Badge';
import Icon from './Icon';

interface ExpandableGuestCardProps {
  guest: Guest;
  onCheckout: (id: string) => Promise<void>;
  onEdit?: (guest: Guest) => void;
  canCheckout?: boolean;
}

export default function ExpandableGuestCard({
  guest,
  onCheckout,
  onEdit,
  canCheckout = true,
}: ExpandableGuestCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = () => {
    Alert.alert(
      'Confirm Checkout',
      `Are you sure you want to check out ${guest.guest_name} from Room ${guest.room_number}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Checkout',
          style: 'destructive',
          onPress: async () => {
            setCheckoutLoading(true);
            try {
              await onCheckout(guest.id);
            } catch (err) {
              Alert.alert('Checkout Failed', (err as Error).message);
            } finally {
              setCheckoutLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleInvoicePreview = () => {
    const tariff = guest.tariff || 0;
    const cgst = tariff * 0.06;
    const sgst = tariff * 0.06;
    const totalTax = cgst + sgst;
    const totalAmount = tariff + totalTax;

    Alert.alert(
      'Invoice Breakdown (GST Ready)',
      `Guest: ${guest.guest_name}\nRoom: ${guest.room_number}\n\n` +
      `Base Tariff: ₹${tariff.toFixed(2)}\n` +
      `CGST (6%): ₹${cgst.toFixed(2)}\n` +
      `SGST (6%): ₹${sgst.toFixed(2)}\n` +
      `Total Tax: ₹${totalTax.toFixed(2)}\n\n` +
      `--------------------------------------\n` +
      `Grand Total: ₹${totalAmount.toFixed(2)}\n` +
      `Advance Paid: ₹${(guest.advance_payment || 0).toFixed(2)}\n` +
      `Due Balance: ₹${(totalAmount - (guest.advance_payment || 0)).toFixed(2)}`,
      [
        { text: 'Close', style: 'cancel' }
      ]
    );
  };

  return (
    <View style={[styles.card, expanded && styles.cardExpanded]}>
      {/* Tap to Toggle Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.9}
      >
        <View style={styles.headerLeft}>
          <Avatar name={guest.guest_name} uri={guest.profile_photo_url} size={46} />
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{guest.guest_name}</Text>
            <View style={styles.roomRow}>
              <Text style={styles.roomLabel}>Room {guest.room_number}</Text>
              <Text style={styles.bullet}>/</Text>
              <Text style={styles.tariffText}>₹{guest.tariff}/day</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Badge type={guest.status} />
          <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={colors.textMuted} />
        </View>
      </TouchableOpacity>

      {/* Expandable Section */}
      {expanded && (
        <View style={styles.expandedContent}>
          <View style={styles.divider} />

          {/* Details Grid */}
          <View style={styles.grid}>
            <View style={styles.gridCol}>
              <Text style={styles.metaLabel}>Reg ID</Text>
              <Text style={styles.metaValue} numberOfLines={1}>{guest.registration_number}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.metaLabel}>Dates</Text>
              <Text style={styles.metaValue}>{guest.arrival_date} - {guest.departure_date || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.grid}>
            <View style={styles.gridCol}>
              <Text style={styles.metaLabel}>Contact</Text>
              <Text style={styles.metaValue}>+91 {guest.contact_number}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.metaLabel}>Advance Paid</Text>
              <Text style={styles.metaValue}>₹{guest.advance_payment || 0}</Text>
            </View>
          </View>

          <View style={styles.grid}>
            <View style={styles.gridCol}>
              <Text style={styles.metaLabel}>Nationality</Text>
              <Text style={styles.metaValue}>{guest.nationality}</Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.metaLabel}>Purpose of Visit</Text>
              <Text style={styles.metaValue}>{guest.purpose_of_visit || 'Business'}</Text>
            </View>
          </View>

          {/* Document Section */}
          <Text style={styles.sectionTitle}>Uploaded Identification</Text>
          <View style={styles.idThumbnails}>
            {guest.id_photo_front_url ? (
              <View style={styles.thumbnailWrapper}>
                <Image source={{ uri: guest.id_photo_front_url }} style={styles.thumbnail} />
                <Text style={styles.thumbnailLabel}>ID Front</Text>
              </View>
            ) : (
              <View style={[styles.thumbnailPlaceholder, styles.thumbnailWrapper]}>
                <Icon name="id-card" size={18} color={colors.textMuted} />
                <Text style={styles.thumbnailLabel}>No Front ID</Text>
              </View>
            )}

            {guest.id_photo_back_url ? (
              <View style={styles.thumbnailWrapper}>
                <Image source={{ uri: guest.id_photo_back_url }} style={styles.thumbnail} />
                <Text style={styles.thumbnailLabel}>ID Back</Text>
              </View>
            ) : (
              <View style={[styles.thumbnailPlaceholder, styles.thumbnailWrapper]}>
                <Icon name="id-card" size={18} color={colors.textMuted} />
                <Text style={styles.thumbnailLabel}>No Back ID</Text>
              </View>
            )}

            <View style={styles.ocrStatusBox}>
              <Icon name="scan" size={18} color={colors.primary} />
              <Text style={styles.ocrTitle}>Document</Text>
              <Text style={styles.ocrBadge}>{guest.id_photo_front_url || guest.id_photo_back_url ? 'Stored' : 'Missing'}</Text>
            </View>
          </View>

          {/* Advanced Action Matrix */}
          <Text style={styles.sectionTitle}>Advanced Operations</Text>
          <View style={styles.actionsMatrix}>
            <TouchableOpacity style={styles.matrixButton} onPress={handleInvoicePreview}>
              <Icon name="receipt" size={15} color={colors.textPrimary} />
              <Text style={styles.matrixText}>GST Invoice</Text>
            </TouchableOpacity>

            {onEdit && (
              <TouchableOpacity style={styles.matrixButton} onPress={() => onEdit(guest)}>
                <Icon name="edit" size={15} color={colors.textPrimary} />
                <Text style={styles.matrixText}>Edit Guest</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Checkout Button */}
          {guest.status === 'checked_in' && canCheckout && (
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? (
                <ActivityIndicator color={colors.textOnDark} size="small" />
              ) : (
                <Text style={styles.checkoutBtnText}>Check-out Guest</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.large,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardExpanded: {
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  name: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold as any,
    color: colors.textPrimary,
  },
  roomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  roomLabel: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontWeight: typography.weights.semibold as any,
  },
  bullet: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginHorizontal: 6,
  },
  tariffText: {
    fontSize: typography.sizes.xs,
    color: colors.primary,
    fontWeight: typography.weights.bold as any,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  expandedContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEF2F6',
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  gridCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: typography.weights.semibold as any,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  metaValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold as any,
    color: colors.textPrimary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold as any,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  idThumbnails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  thumbnailWrapper: {
    width: '31%',
    height: 70,
    borderRadius: borderRadius.medium,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  thumbnailPlaceholder: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    color: colors.textOnDark,
    fontSize: 8,
    textAlign: 'center',
    paddingVertical: 2,
    fontWeight: typography.weights.medium as any,
  },
  ocrStatusBox: {
    width: '31%',
    height: 70,
    backgroundColor: '#FFF2EC',
    borderRadius: borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ocrTitle: {
    fontSize: 9,
    fontWeight: typography.weights.semibold as any,
    color: colors.primary,
    marginTop: 2,
  },
  ocrBadge: {
    fontSize: 8,
    fontWeight: typography.weights.bold as any,
    color: colors.success,
    backgroundColor: colors.successLight,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: borderRadius.small,
    marginTop: 2,
  },
  actionsMatrix: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  matrixButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.medium,
    width: '48%',
    gap: spacing.sm,
  },
  matrixText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold as any,
    color: colors.textPrimary,
  },
  checkoutBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.large,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
    ...shadows.md,
  },
  checkoutBtnText: {
    color: colors.textOnDark,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold as any,
  },
});
