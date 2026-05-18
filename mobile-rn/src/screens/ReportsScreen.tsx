import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Property } from '../types';
import MiniChart from '../components/MiniChart';
import SectionHeader from '../components/SectionHeader';
import KPICard from '../components/KPICard';

interface Props { property: Property; onBack: () => void; }

const WEEK_DATA = [
  { label: 'Mon', value: 18500 }, { label: 'Tue', value: 22000 },
  { label: 'Wed', value: 16000 }, { label: 'Thu', value: 31000 },
  { label: 'Fri', value: 28000 }, { label: 'Sat', value: 47500 },
  { label: 'Sun', value: 39000 },
];
const MONTH_DATA = [
  { label: 'W1', value: 120000 }, { label: 'W2', value: 98000 },
  { label: 'W3', value: 145000 }, { label: 'W4', value: 162000 },
];

const TOP_ROOMS = [
  { room: '301', type: 'Suite', revenue: 84000, nights: 24, occupancy: 80 },
  { room: '201', type: 'Deluxe', revenue: 67200, nights: 28, occupancy: 93 },
  { room: '105', type: 'Standard', revenue: 44100, nights: 21, occupancy: 70 },
  { room: '402', type: 'Executive', revenue: 92400, nights: 22, occupancy: 73 },
];

export default function ReportsScreen({ property, onBack }: Props) {
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const chartData = period === 'week' ? WEEK_DATA : MONTH_DATA;
  const totalRevenue = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>⟵</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Revenue Reports</Text>
          <Text style={styles.headerSub}>{property === 'plaza' ? 'Plaza Residency' : 'Century Residency'}</Text>
        </View>
        <TouchableOpacity style={styles.exportBtn} onPress={() => Alert.alert('Export', 'PDF report generation coming soon.')}>
          <Text style={styles.exportText}>📤 Export</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Period Toggle */}
        <View style={styles.periodToggle}>
          <TouchableOpacity
            style={[styles.periodBtn, period === 'week' && styles.periodBtnActive]}
            onPress={() => setPeriod('week')}>
            <Text style={[styles.periodText, period === 'week' && styles.periodTextActive]}>7 Days</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodBtn, period === 'month' && styles.periodBtnActive]}
            onPress={() => setPeriod('month')}>
            <Text style={[styles.periodText, period === 'month' && styles.periodTextActive]}>30 Days</Text>
          </TouchableOpacity>
        </View>

        {/* Summary KPIs */}
        <View style={styles.kpiGrid}>
          <KPICard label="Total Revenue" value={`₹${(totalRevenue / 1000).toFixed(1)}K`} icon="💰" color={colors.primary} trend={{ value: '12%', isPositive: true }} />
          <KPICard label="Avg Tariff / Night" value={`₹${Math.round(totalRevenue / 28)}`} icon="🏷️" color="#10B981" trend={{ value: '5%', isPositive: true }} />
          <KPICard label="Total Guests" value={period === 'week' ? 42 : 178} icon="👥" color="#3B82F6" />
          <KPICard label="Avg Occupancy" value="78%" icon="📊" color="#8B5CF6" trend={{ value: '3%', isPositive: false }} />
        </View>

        {/* Chart */}
        <MiniChart data={chartData} />

        {/* Top Rooms */}
        <SectionHeader title="Top Performing Rooms" actionLabel="View All" onActionPress={() => Alert.alert('Room Calendar', 'Full room calendar view coming soon.')} />
        <View style={styles.roomTable}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 1 }]}>Room</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 1.5 }]}>Type</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 2 }]}>Revenue</Text>
            <Text style={[styles.tableCell, styles.tableHeaderText, { flex: 1 }]}>Occ.</Text>
          </View>
          {TOP_ROOMS.map((r, i) => (
            <View key={r.room} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
              <Text style={[styles.tableCell, styles.tableRoomNum, { flex: 1 }]}>#{r.room}</Text>
              <Text style={[styles.tableCell, { flex: 1.5, color: colors.textSecondary }]}>{r.type}</Text>
              <Text style={[styles.tableCell, styles.tableRevenue, { flex: 2 }]}>₹{r.revenue.toLocaleString('en-IN')}</Text>
              <View style={[{ flex: 1 }, styles.tableCellOcc]}>
                <View style={[styles.occBar, { width: `${r.occupancy}%` as any }]} />
                <Text style={styles.occText}>{r.occupancy}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Actions */}
        <SectionHeader title="Generate Reports" />
        <View style={styles.actionGrid}>
          {[
            { icon: '🧾', label: 'GST Report', sub: 'Monthly tax summary' },
            { icon: '✈️', label: 'C-Form Report', sub: 'Foreign nationals log' },
            { icon: '📆', label: 'Room Calendar', sub: 'Availability view' },
            { icon: '📩', label: 'Daily Summary', sub: 'Email to management' },
          ].map((a) => (
            <TouchableOpacity
              key={a.label} style={styles.actionCard}
              onPress={() => Alert.alert(a.label, `${a.sub} — coming in Phase 2.`)}>
              <Text style={styles.actionIcon}>{a.icon}</Text>
              <Text style={styles.actionLabel}>{a.label}</Text>
              <Text style={styles.actionSub}>{a.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    backgroundColor: colors.card, ...shadows.sm,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backArrow: { fontSize: 22, color: colors.primary, fontWeight: typography.weights.bold as any },
  headerTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold as any, color: colors.textPrimary },
  headerSub: { fontSize: typography.sizes.xs, color: colors.textSecondary },
  exportBtn: { backgroundColor: colors.primaryLight, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.circle },
  exportText: { fontSize: typography.sizes.xs, color: colors.primary, fontWeight: typography.weights.semibold as any },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  periodToggle: {
    flexDirection: 'row', backgroundColor: colors.card, borderRadius: borderRadius.large,
    padding: 4, marginBottom: spacing.lg, ...shadows.sm,
  },
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
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  actionCard: { width: '47%', backgroundColor: colors.card, borderRadius: borderRadius.large, padding: spacing.md, ...shadows.sm },
  actionIcon: { fontSize: 28, marginBottom: spacing.xs },
  actionLabel: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold as any, color: colors.textPrimary },
  actionSub: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
});
