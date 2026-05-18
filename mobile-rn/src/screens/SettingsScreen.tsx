import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Switch } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import SectionHeader from '../components/SectionHeader';
import Icon from '../components/Icon';

interface Props { onBack: () => void; }

export default function SettingsScreen({ onBack }: Props) {
  const { user, logout, hasPermission } = useAuth();
  const [notifications, setNotifications] = useState({ checkout: true, payment: true, overstay: true, dailySummary: true });

  const notificationItems = [
    { key: 'checkout', title: 'Checkout Reminders', sub: 'Alert when guests are due to check out', icon: 'clock' as const },
    { key: 'payment', title: 'Payment Alerts', sub: 'Pending payments and dues', icon: 'money' as const },
    { key: 'overstay', title: 'Overstay Alerts', sub: 'Guests past their departure date', icon: 'alert' as const },
    ...(hasPermission('daily_notifications') ? [{ key: 'dailySummary', title: 'Daily Summary', sub: 'Morning report to management', icon: 'chart' as const }] : []),
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.profileCard}>
          <Avatar name={user?.name || 'User'} size={60} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <Badge type={user?.role || 'manager'} />
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={() => {
            Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Out', style: 'destructive', onPress: logout },
            ]);
          }}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <SectionHeader title="Notification Preferences" />
        <View style={styles.card}>
          {notificationItems.map((item) => (
            <View key={item.key} style={styles.notifRow}>
              <View style={styles.notifIcon}><Icon name={item.icon} size={18} color={colors.primary} /></View>
              <View style={styles.notifInfo}>
                <Text style={styles.notifLabel}>{item.title}</Text>
                <Text style={styles.notifSub}>{item.sub}</Text>
              </View>
              <Switch
                value={notifications[item.key as keyof typeof notifications]}
                onValueChange={(val) => setNotifications((prev) => ({ ...prev, [item.key]: val }))}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={notifications[item.key as keyof typeof notifications] ? colors.primary : colors.textMuted}
              />
            </View>
          ))}
        </View>

        <SectionHeader title="About" />
        <View style={styles.card}>
          {[
            { label: 'App Version', value: '2.0.0' },
            { label: 'Platform', value: 'Expo React Native' },
            { label: 'Backend', value: 'Vercel + Supabase' },
            { label: 'Properties', value: 'Plaza Residency · Century Residency' },
          ].map((item) => (
            <View key={item.label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
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
  headerTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold as any, color: colors.textPrimary },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: borderRadius.large, padding: spacing.md, marginBottom: spacing.lg, ...shadows.md, gap: spacing.md },
  profileInfo: { flex: 1, gap: spacing.xs },
  profileName: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold as any, color: colors.textPrimary },
  profileEmail: { fontSize: typography.sizes.xs, color: colors.textSecondary },
  logoutBtn: { backgroundColor: colors.errorLight, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.circle },
  logoutText: { fontSize: typography.sizes.xs, color: colors.error, fontWeight: typography.weights.bold as any },
  card: { backgroundColor: colors.card, borderRadius: borderRadius.large, padding: spacing.md, marginBottom: spacing.lg, ...shadows.sm },
  notifRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  notifIcon: { width: 34, height: 34, borderRadius: borderRadius.medium, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm },
  notifInfo: { flex: 1, marginRight: spacing.md },
  notifLabel: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold as any, color: colors.textPrimary },
  notifSub: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: { fontSize: typography.sizes.sm, color: colors.textSecondary },
  infoValue: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold as any, color: colors.textPrimary, maxWidth: '55%', textAlign: 'right' },
});
