import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Guest, Property } from '../types';
import { guestApi } from '../services/api';
import MiniChart from '../components/MiniChart';
import SectionHeader from '../components/SectionHeader';
import KPICard from '../components/KPICard';
import Icon from '../components/Icon';

interface Props { property: Property; onBack: () => void; }

const formatDateLabel = (date: Date) => date.toLocaleDateString('en-IN', { weekday: 'short' });

export default function ReportsScreen({ property, onBack }: Props) {
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);

  const loadGuests = async () => {
    setLoading(true);
    try {
      setGuests(await guestApi.getGuests(property, 200));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadGuests(); }, [property]);

  const days = period === 'week' ? 7 : 30;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  const periodGuests = guests.filter((guest) => {
    const rawDate = guest.created_at || guest.arrival_date;
    if (!rawDate) return false;
    const date = new Date(rawDate);
    return date >= start;
  });

  const totalRevenue = periodGuests.reduce((sum, guest) => sum + (Number(guest.tariff) || 0), 0);
  const occupiedRoomCount = new Set(periodGuests.filter((g) => g.status === 'checked_in').map((g) => g.room_number)).size;
  const avgTariff = periodGuests.length ? Math.round(totalRevenue / periodGuests.length) : 0;
  const avgOccupancy = Math.round((occupiedRoomCount / 30) * 100);

  const chartData = Array.from({ length: period === 'week' ? 7 : 4 }).map((_, index) => {
    if (period === 'week') {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const key = date.toISOString().split('T')[0];
      return {
        label: formatDateLabel(date),
        value: guests
          .filter((guest) => (guest.created_at || guest.arrival_date || '').startsWith(key))
          .reduce((sum, guest) => sum + (Number(guest.tariff) || 0), 0),
      };
    }

    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() + index * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return {
      label: `W${index + 1}`,
      value: guests
        .filter((guest) => {
          const date = new Date(guest.created_at || guest.arrival_date);
          return date >= weekStart && date <= weekEnd;
        })
        .reduce((sum, guest) => sum + (Number(guest.tariff) || 0), 0),
    };
  });

  const topRooms = Object.values(periodGuests.reduce<Record<string, { room: string; type: string; revenue: number; nights: number; occupancy: number }>>((acc, guest) => {
    const room = guest.room_number;
    if (!acc[room]) acc[room] = { room, type: guest.room_type || 'Room', revenue: 0, nights: 0, occupancy: 0 };
    acc[room].revenue += Number(guest.tariff) || 0;
    acc[room].nights += 1;
    acc[room].occupancy = Math.min(100, Math.round((acc[room].nights / days) * 100));
    return acc;
  }, {})).sort((a, b) => b.revenue - a.revenue).slice(0, 4);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Revenue Reports</Text>
          <Text style={styles.headerSub}>{property === 'plaza' ? 'Plaza Residency' : 'Century Residency'}</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} refreshControl={<RefreshControl refreshing={loading} onRefresh={loadGuests} tintColor={colors.primary} />}>
        <View style={styles.periodToggle}>
          <TouchableOpacity style={[styles.periodBtn, period === 'week' && styles.periodBtnActive]} onPress={() => setPeriod('week')}>
            <Text style={[styles.periodText, period === 'week' && styles.periodTextActive]}>7 Days</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.periodBtn, period === 'month' && styles.periodBtnActive]} onPress={() => setPeriod('month')}>
            <Text style={[styles.periodText, period === 'month' && styles.periodTextActive]}>30 Days</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.kpiGrid}>
          <KPICard label="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon="money" color={colors.primary} />
          <KPICard label="Avg Tariff" value={`₹${avgTariff.toLocaleString('en-IN')}`} icon="tag" color="#10B981" />
          <KPICard label="Total Guests" value={periodGuests.length} icon="users" color="#3B82F6" />
          <KPICard label="Avg Occupancy" value={`${avgOccupancy}%`} icon="chart" color="#8B5CF6" />
        </View>

        <MiniChart data={chartData} />

        <SectionHeader title="Top Performing Rooms" />
        <View style={styles.roomTable}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 1 }]}>Room</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 1.5 }]}>Type</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 2 }]}>Revenue</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 1 }]}>Occ.</Text>
          </View>
          {topRooms.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="chart" size={28} color={colors.textMuted} />
              <Text style={styles.emptyText}>No revenue data for this period</Text>
            </View>
          ) : topRooms.map((room, index) => (
            <View key={room.room} style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}>
              <Text style={[styles.tableCell, styles.tableRoomNum, { flex: 1 }]}>#{room.room}</Text>
              <Text style={[styles.tableCell, { flex: 1.5, color: colors.textSecondary }]}>{room.type}</Text>
              <Text style={[styles.tableCell, styles.tableRevenue, { flex: 2 }]}>₹{room.revenue.toLocaleString('en-IN')}</Text>
              <View style={[{ flex: 1 }, styles.tableCellOcc]}>
                <View style={[styles.occBar, { width: `${room.occupancy}%` as any }]} />
                <Text style={styles.occText}>{room.occupancy}%</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.md, backgroundColor: colors.card, ...shadows.sm },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold as any, color: colors.textPrimary, textAlign: 'center' },
  headerSub: { fontSize: typography.sizes.xs, color: colors.textSecondary, textAlign: 'center' },
  headerSpacer: { width: 40 },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  periodToggle: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: borderRadius.large, padding: 4, marginBottom: spacing.lg, ...shadows.sm },
  periodBtn: { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRadius: borderRadius.medium },
  periodBtnActive: { backgroundColor: colors.primary },
  periodText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold as any, color: colors.textSecondary },
  periodTextActive: { color: colors.textOnDark },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  roomTable: { backgroundColor: colors.card, borderRadius: borderRadius.large, overflow: 'hidden', marginBottom: spacing.lg, ...shadows.sm },
  tableHeader: { flexDirection: 'row', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.background },
  tableHeaderText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold as any, color: colors.textMuted, textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', paddingHorizontal: spacing.md, paddingVertical: spacing.md, alignItems: 'center' },
  tableRowAlt: { backgroundColor: '#FAFBFC' },
  tableCell: { fontSize: typography.sizes.sm },
  tableRoomNum: { fontWeight: typography.weights.bold as any, color: colors.textPrimary },
  tableRevenue: { fontWeight: typography.weights.semibold as any, color: colors.success },
  tableCellOcc: { position: 'relative', height: 20, backgroundColor: '#F1F5F9', borderRadius: borderRadius.circle, overflow: 'hidden', justifyContent: 'center' },
  occBar: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: colors.primaryLight },
  occText: { fontSize: 10, fontWeight: typography.weights.bold as any, color: colors.primary, textAlign: 'center', zIndex: 1 },
  emptyState: { alignItems: 'center', padding: spacing.xl, gap: spacing.sm },
  emptyText: { fontSize: typography.sizes.sm, color: colors.textSecondary },
});
