import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, Alert, Switch, Modal, TextInput,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { authService, DEMO_USERS } from '../services/auth.service';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';
import { StaffUser, UserRole, Property } from '../types';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import SectionHeader from '../components/SectionHeader';

interface Props { onBack: () => void; }

const ROLE_LABELS: Record<UserRole, string> = { admin: 'Admin', manager: 'Manager', staff: 'Staff' };

export default function SettingsScreen({ onBack }: Props) {
  const { user, logout, hasPermission } = useAuth();
  const [staffList, setStaffList] = useState<StaffUser[]>(DEMO_USERS);
  const [notifications, setNotifications] = useState({ checkout: true, payment: true, overstay: true, dailySummary: true });
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '', phone: '', role: 'staff' as UserRole, property: '' });

  useEffect(() => {
    authService.getStaffList().then(setStaffList);
  }, []);

  const toggleStaffStatus = async (id: string) => {
    const updated = staffList.map((s) => s.id === id ? { ...s, isActive: !s.isActive } : s);
    setStaffList(updated);
    await authService.saveStaffList(updated);
    Alert.alert('Updated', 'Staff status has been changed.');
  };

  const handleAddStaff = async () => {
    if (!newStaff.name.trim() || !newStaff.email.trim()) {
      return Alert.alert('Required', 'Name and email are required.');
    }
    const added: StaffUser = {
      id: 'user_' + Date.now(),
      name: newStaff.name.trim(),
      email: newStaff.email.trim(),
      phone: newStaff.phone.trim(),
      role: newStaff.role,
      property: newStaff.property as Property || undefined,
      isActive: true,
    };
    const updated = [...staffList, added];
    setStaffList(updated);
    await authService.saveStaffList(updated);
    setAddModalVisible(false);
    setNewStaff({ name: '', email: '', phone: '', role: 'staff', property: '' });
    Alert.alert('✅ Staff Added', `${added.name} has been added as ${added.role}.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>⟵</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <Avatar name={user?.name || 'User'} size={60} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <Badge type={user?.role || 'staff'} />
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

        {/* Staff Management (Admin Only) */}
        {hasPermission('manage_staff') && (
          <>
            <SectionHeader title="Staff Management" actionLabel="+ Add Staff" onActionPress={() => setAddModalVisible(true)} />
            <View style={styles.staffList}>
              {staffList.map((s) => (
                <View key={s.id} style={styles.staffCard}>
                  <Avatar name={s.name} size={42} backgroundColor={s.isActive ? colors.primaryLight : colors.lightGray} />
                  <View style={styles.staffInfo}>
                    <Text style={[styles.staffName, !s.isActive && styles.staffNameInactive]}>{s.name}</Text>
                    <Text style={styles.staffEmail} numberOfLines={1}>{s.email}</Text>
                    <Badge type={s.role} />
                  </View>
                  <TouchableOpacity
                    style={[styles.statusToggle, s.isActive ? styles.statusActive : styles.statusInactive]}
                    onPress={() => s.id !== user?.id ? toggleStaffStatus(s.id) : Alert.alert('Cannot Deactivate', 'You cannot deactivate your own account.')}
                  >
                    <Text style={[styles.statusText, s.isActive ? styles.statusTextActive : styles.statusTextInactive]}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Notifications */}
        <SectionHeader title="Notification Preferences" />
        <View style={styles.card}>
          {[
            { key: 'checkout', label: '⏰ Checkout Reminders', sub: 'Alert when guests are due to check out' },
            { key: 'payment', label: '💳 Payment Alerts', sub: 'Pending payments and dues' },
            { key: 'overstay', label: '🚨 Overstay Alerts', sub: 'Guests past their departure date' },
            ...(hasPermission('daily_notifications') ? [{ key: 'dailySummary', label: '📊 Daily Summary', sub: 'Morning report to management' }] : []),
          ].map((n) => (
            <View key={n.key} style={styles.notifRow}>
              <View style={styles.notifInfo}>
                <Text style={styles.notifLabel}>{n.label}</Text>
                <Text style={styles.notifSub}>{n.sub}</Text>
              </View>
              <Switch
                value={notifications[n.key as keyof typeof notifications]}
                onValueChange={(val) => setNotifications((p) => ({ ...p, [n.key]: val }))}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={notifications[n.key as keyof typeof notifications] ? colors.primary : colors.textMuted}
              />
            </View>
          ))}
        </View>

        {/* App Info */}
        <SectionHeader title="About" />
        <View style={styles.card}>
          {[
            { label: 'App Version', value: '2.0.0 SaaS Edition' },
            { label: 'Platform', value: 'Expo React Native' },
            { label: 'Backend', value: 'Vercel + Supabase PostgreSQL' },
            { label: 'Properties', value: 'Plaza Residency · Century Residency' },
          ].map((item) => (
            <View key={item.label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Staff Modal */}
      <Modal visible={addModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Staff</Text>
            <TouchableOpacity onPress={() => setAddModalVisible(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalScroll}>
            {[
              { label: 'Full Name *', key: 'name', placeholder: 'e.g. Ajay Kumar' },
              { label: 'Email *', key: 'email', placeholder: 'staff@shiyaf.com' },
              { label: 'Phone', key: 'phone', placeholder: '10-digit mobile' },
            ].map((f) => (
              <View key={f.key} style={styles.mField}>
                <Text style={styles.mLabel}>{f.label}</Text>
                <TextInput
                  style={styles.mInput}
                  placeholder={f.placeholder}
                  placeholderTextColor={colors.textMuted}
                  value={newStaff[f.key as 'name' | 'email' | 'phone']}
                  onChangeText={(v) => setNewStaff((p) => ({ ...p, [f.key]: v }))}
                  autoCapitalize={f.key === 'email' ? 'none' : 'words'}
                  keyboardType={f.key === 'email' ? 'email-address' : f.key === 'phone' ? 'phone-pad' : 'default'}
                />
              </View>
            ))}

            <Text style={styles.mLabel}>Role</Text>
            <View style={styles.pillRow}>
              {(['admin', 'manager', 'staff'] as UserRole[]).map((r) => (
                <TouchableOpacity key={r} style={[styles.pill, newStaff.role === r && styles.pillActive]} onPress={() => setNewStaff((p) => ({ ...p, role: r }))}>
                  <Text style={[styles.pillText, newStaff.role === r && styles.pillTextActive]}>{ROLE_LABELS[r]}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.addBtn} onPress={handleAddStaff}>
              <Text style={styles.addBtnText}>✅ Add Staff Member</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.md, backgroundColor: colors.card, ...shadows.sm },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backArrow: { fontSize: 22, color: colors.primary, fontWeight: typography.weights.bold as any },
  headerTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold as any, color: colors.textPrimary },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: borderRadius.large, padding: spacing.md, marginBottom: spacing.lg, ...shadows.md, gap: spacing.md },
  profileInfo: { flex: 1, gap: spacing.xs },
  profileName: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold as any, color: colors.textPrimary },
  profileEmail: { fontSize: typography.sizes.xs, color: colors.textSecondary },
  logoutBtn: { backgroundColor: colors.errorLight, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.circle },
  logoutText: { fontSize: typography.sizes.xs, color: colors.error, fontWeight: typography.weights.bold as any },
  staffList: { gap: spacing.sm, marginBottom: spacing.lg },
  staffCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: borderRadius.large, padding: spacing.md, ...shadows.sm, gap: spacing.md },
  staffInfo: { flex: 1, gap: 3 },
  staffName: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold as any, color: colors.textPrimary },
  staffNameInactive: { color: colors.textMuted, textDecorationLine: 'line-through' },
  staffEmail: { fontSize: typography.sizes.xs, color: colors.textSecondary },
  statusToggle: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: borderRadius.circle },
  statusActive: { backgroundColor: colors.successLight },
  statusInactive: { backgroundColor: '#F1F5F9' },
  statusText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold as any },
  statusTextActive: { color: colors.success },
  statusTextInactive: { color: colors.textMuted },
  card: { backgroundColor: colors.card, borderRadius: borderRadius.large, padding: spacing.md, marginBottom: spacing.lg, ...shadows.sm },
  notifRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  notifInfo: { flex: 1, marginRight: spacing.md },
  notifLabel: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold as any, color: colors.textPrimary },
  notifSub: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: { fontSize: typography.sizes.sm, color: colors.textSecondary },
  infoValue: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold as any, color: colors.textPrimary, maxWidth: '55%', textAlign: 'right' },
  modal: { flex: 1, backgroundColor: colors.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, backgroundColor: colors.card, ...shadows.sm },
  modalTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold as any, color: colors.textPrimary },
  modalClose: { fontSize: 20, color: colors.textSecondary, padding: spacing.sm },
  modalScroll: { padding: spacing.md },
  mField: { marginBottom: spacing.md },
  mLabel: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold as any, color: colors.textSecondary, marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  mInput: { backgroundColor: colors.card, borderRadius: borderRadius.medium, paddingHorizontal: spacing.md, paddingVertical: 14, fontSize: typography.sizes.md, color: colors.textPrimary, ...shadows.sm },
  pillRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  pill: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.circle, backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.border },
  pillActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  pillText: { fontSize: typography.sizes.xs, color: colors.textSecondary, fontWeight: typography.weights.semibold as any },
  pillTextActive: { color: colors.primary },
  addBtn: { backgroundColor: colors.primary, borderRadius: borderRadius.large, padding: spacing.md, alignItems: 'center', marginTop: spacing.md },
  addBtnText: { color: colors.textOnDark, fontSize: typography.sizes.md, fontWeight: typography.weights.black as any },
});
