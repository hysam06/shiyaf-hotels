import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { guestApi } from '../services/api';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Property, DashboardStats, Guest } from '../types';
import KPICard from '../components/KPICard';
import MiniChart from '../components/MiniChart';
import SectionHeader from '../components/SectionHeader';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import NotificationBell from '../components/NotificationBell';
import { PROPERTIES } from '../config/api';

interface Props {
  property: Property;
  onNavigate: (screen: 'register' | 'guests' | 'search' | 'reports' | 'settings') => void;
  onBack: () => void;
}

const PROPERTY_NAMES: Record<Property, string> = {
  plaza: 'Plaza Residency',
  century: 'Century Residency',
};

export default function DashboardScreen({ property, onNavigate, onBack }: Props) {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    total_guests_today: 0, rooms_occupied: 0, departures_today: 0,
    new_check_ins_today: 0, available_rooms: 0, revenue_today: 0,
  });
  const [recentGuests, setRecentGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [dueCheckouts, setDueCheckouts] = useState<Guest[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const freshStats = await guestApi.getStats(property);
      // Map API stats to our extended type
      setStats({
        ...freshStats,
        available_rooms: Math.max(0, 30 - (freshStats.rooms_occupied || 0)),
        revenue_today: (freshStats.rooms_occupied || 0) * 2500,
      });

      const guestData = await guestApi.getGuests(property);
      // Recent 5 checked-in guests
      const checkedIn = guestData.filter((g) => g.status === 'checked_in');
      setRecentGuests(checkedIn.slice(0, 5));

      // Due checkouts today
      const today = new Date().toISOString().split('T')[0];
      const due = checkedIn.filter((g) => g.departure_date === today);
      setDueCheckouts(due);
    } catch (err) {
      // Silently fail, show cached data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [property]);

  const quickActions = [
    { icon: '➕', label: 'Add Guest', screen: 'register' as const, color: colors.primary },
    { icon: '📋', label: 'Guest List', screen: 'guests' as const, color: '#10B981' },
    { icon: '📊', label: 'Reports', screen: 'reports' as const, color: '#3B82F6' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor={colors.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <TouchableOpacity onPress={onBack} style={styles.propertyChip}>
              <Text style={styles.propertyChipText}>⟵ {PROPERTY_NAMES[property]}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerDate}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
          </View>
          <NotificationBell count={dueCheckouts.length} onPress={() => {
            if (dueCheckouts.length > 0) {
              Alert.alert('⚠️ Checkout Alerts', `${dueCheckouts.length} guest(s) are due to check out today:\n\n` + dueCheckouts.map((g) => `• ${g.guest_name} (Room ${g.room_number})`).join('\n'));
            } else {
              Alert.alert('No Alerts', 'No pending checkouts for today.');
            }
          }} />
        </View>

        {/* KPI Grid */}
        <View style={styles.kpiGrid}>
          <KPICard label="Today's Revenue" value={`₹${(stats.revenue_today || 0).toLocaleString('en-IN')}`} icon="💰" color={colors.primary} />
          <KPICard label="Occupancy" value={`${stats.rooms_occupied > 0 ? Math.round((stats.rooms_occupied / 30) * 100) : 0}%`} icon="🏨" color="#10B981" />
          <KPICard label="Available Rooms" value={stats.available_rooms} icon="🚪" color="#3B82F6" />
          <KPICard label="Due Checkouts" value={stats.departures_today} icon="⏰" color={stats.departures_today > 0 ? '#F59E0B' : '#64748B'} />
        </View>

        {/* Revenue Chart */}
        <MiniChart />

        {/* Quick Actions */}
        <SectionHeader title="Quick Actions" />
        <View style={styles.quickActions}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.screen}
              style={styles.actionBtn}
              onPress={() => onNavigate(action.screen)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[action.color, action.color + 'CC']}
                style={styles.actionBtnGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              >
                <Text style={styles.actionBtnIcon}>{action.icon}</Text>
                <Text style={styles.actionBtnLabel}>{action.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Checkout Alerts */}
        {dueCheckouts.length > 0 && (
          <View style={styles.alertBox}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertIcon}>⚠️</Text>
              <Text style={styles.alertTitle}>{dueCheckouts.length} Checkout{dueCheckouts.length > 1 ? 's' : ''} Due Today</Text>
            </View>
            {dueCheckouts.slice(0, 3).map((g) => (
              <View key={g.id} style={styles.alertRow}>
                <Avatar name={g.guest_name} size={32} />
                <View style={styles.alertInfo}>
                  <Text style={styles.alertName}>{g.guest_name}</Text>
                  <Text style={styles.alertRoom}>Room {g.room_number}</Text>
                </View>
                <Badge type="warning" label="Due" />
              </View>
            ))}
          </View>
        )}

        {/* Recent Guests */}
        <SectionHeader title="Recent Guests" actionLabel="View All" onActionPress={() => onNavigate('guests')} />
        {recentGuests.length === 0 ? (
          <View style={styles.emptyGuests}>
            <Text style={styles.emptyIcon}>🏨</Text>
            <Text style={styles.emptyText}>No guests checked in yet</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.guestStrip}>
            {recentGuests.map((guest) => (
              <View key={guest.id} style={styles.guestChip}>
                <Avatar name={guest.guest_name} size={44} />
                <Text style={styles.guestChipName} numberOfLines={1}>{guest.guest_name.split(' ')[0]}</Text>
                <Text style={styles.guestChipRoom}>Rm {guest.room_number}</Text>
              </View>
            ))}
          </ScrollView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg },
  propertyChip: {
    backgroundColor: colors.primaryLight, paddingHorizontal: spacing.sm,
    paddingVertical: 4, borderRadius: borderRadius.circle, alignSelf: 'flex-start', marginBottom: 4,
  },
  propertyChipText: { fontSize: typography.sizes.xs, color: colors.primary, fontWeight: typography.weights.semibold as any },
  headerTitle: { fontSize: typography.sizes.xxxl, fontWeight: typography.weights.black as any, color: colors.textPrimary },
  headerDate: { fontSize: typography.sizes.sm, color: colors.textSecondary },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  quickActions: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  actionBtn: { flex: 1, borderRadius: borderRadius.large, overflow: 'hidden', ...shadows.md },
  actionBtnGradient: { padding: spacing.md, alignItems: 'center', minHeight: 80, justifyContent: 'center' },
  actionBtnIcon: { fontSize: 24, marginBottom: 4 },
  actionBtnLabel: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold as any, color: colors.textOnDark, textAlign: 'center' },
  alertBox: {
    backgroundColor: colors.warningLight, borderRadius: borderRadius.large,
    padding: spacing.md, marginBottom: spacing.lg,
    borderLeftWidth: 3, borderLeftColor: colors.warning,
  },
  alertHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.xs },
  alertIcon: { fontSize: 16 },
  alertTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold as any, color: colors.warning },
  alertRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  alertInfo: { flex: 1 },
  alertName: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold as any, color: colors.textPrimary },
  alertRoom: { fontSize: typography.sizes.xs, color: colors.textSecondary },
  guestStrip: { marginBottom: spacing.lg },
  guestChip: {
    alignItems: 'center', marginRight: spacing.md, backgroundColor: colors.card,
    borderRadius: borderRadius.large, padding: spacing.md, width: 80, ...shadows.sm,
  },
  guestChipName: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold as any, color: colors.textPrimary, marginTop: 4, textAlign: 'center' },
  guestChipRoom: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  emptyGuests: {
    backgroundColor: colors.card, borderRadius: borderRadius.large,
    padding: spacing.lg, alignItems: 'center', ...shadows.sm, marginBottom: spacing.lg,
  },
  emptyIcon: { fontSize: 32, marginBottom: spacing.sm },
  emptyText: { fontSize: typography.sizes.sm, color: colors.textSecondary },
});
