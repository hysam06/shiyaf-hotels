import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, SafeAreaView, Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Property } from '../types';
import DashboardScreen from '../screens/DashboardScreen';
import GuestsListScreen from '../screens/GuestsListScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import ReportsScreen from '../screens/ReportsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Icon, { IconName } from '../components/Icon';

type Tab = 'dashboard' | 'guests' | 'register' | 'reports' | 'settings';

interface Props {
  property: Property;
  onBackToPropertySelect: () => void;
}

const TABS: { key: Tab; icon: IconName; label: string; permission?: string }[] = [
  { key: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
  { key: 'guests', icon: 'users', label: 'Guests' },
  { key: 'register', icon: 'plus', label: 'Register' },
  { key: 'reports', icon: 'chart', label: 'Reports', permission: 'view_reports' },
  { key: 'settings', icon: 'settings', label: 'Settings', permission: 'view_settings' },
];

export default function MainNavigator({ property, onBackToPropertySelect }: Props) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const navigateTo = (tab: Tab) => {
    if (tab === 'reports' && !hasPermission('view_reports')) return;
    if (tab === 'settings' && !hasPermission('view_settings')) return;
    setActiveTab(tab);
  };

  const visibleTabs = TABS.filter(
    (t) => !t.permission || hasPermission(t.permission as any)
  );

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardScreen
            property={property}
            onNavigate={(screen) => {
              if (screen === 'reports') navigateTo('reports');
              else if (screen === 'settings') navigateTo('settings');
              else navigateTo(screen as Tab);
            }}
            onBack={onBackToPropertySelect}
          />
        );
      case 'guests':
        return <GuestsListScreen property={property} onBack={() => navigateTo('dashboard')} />;
      case 'register':
        return (
          <RegistrationScreen
            property={property}
            onBack={() => navigateTo('dashboard')}
            onSuccess={() => navigateTo('guests')}
          />
        );
      case 'reports':
        return <ReportsScreen property={property} onBack={() => navigateTo('dashboard')} />;
      case 'settings':
        return <SettingsScreen onBack={() => navigateTo('dashboard')} />;
      default:
        return null;
    }
  };

  // ── Tablet: Sidebar Layout ──────────────────────────────────────────────
  if (isTablet) {
    return (
      <View style={styles.tabletContainer}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <View style={styles.sidebarLogo}>
              <Icon name="hotel" size={25} color={colors.primary} />
            </View>
            <Text style={styles.sidebarBrand}>Shiyaf Hotels</Text>
            <Text style={styles.sidebarProperty}>
              {property === 'plaza' ? 'Plaza Residency' : 'Century Residency'}
            </Text>
          </View>

          <View style={styles.sidebarNav}>
            {visibleTabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.sidebarItem, activeTab === tab.key && styles.sidebarItemActive]}
                onPress={() => navigateTo(tab.key)}
                activeOpacity={0.8}
              >
                <Icon name={tab.icon} size={19} color={activeTab === tab.key ? colors.primary : colors.textSecondary} />
                <Text style={[styles.sidebarItemLabel, activeTab === tab.key && styles.sidebarItemLabelActive]}>
                  {tab.label}
                </Text>
                {activeTab === tab.key && <View style={styles.sidebarActiveIndicator} />}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.sidebarPropertySwitch} onPress={onBackToPropertySelect}>
            <Icon name="refresh" size={17} color={colors.textSecondary} />
            <Text style={styles.sidebarSwitchText}>Switch Property</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.tabletContent}>{renderScreen()}</View>
      </View>
    );
  }

  // ── Mobile: Bottom Tab Bar ──────────────────────────────────────────────
  return (
    <View style={styles.mobileContainer}>
      <View style={styles.mobileContent}>{renderScreen()}</View>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        {visibleTabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => navigateTo(tab.key)}
              activeOpacity={0.8}
            >
              {/* Special center Register tab styling */}
              {tab.key === 'register' ? (
                <View style={styles.tabCenterBtn}>
                  <Icon name={tab.icon} size={25} color={colors.textOnDark} />
                </View>
              ) : (
                <>
                  <View style={[styles.tabIconWrapper, isActive && styles.tabIconWrapperActive]}>
                    <Icon name={tab.icon} size={20} color={isActive ? colors.primary : colors.textMuted} />
                  </View>
                  <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Tablet
  tabletContainer: { flex: 1, flexDirection: 'row', backgroundColor: colors.background },
  sidebar: {
    width: 240, backgroundColor: colors.card, borderRightWidth: 1,
    borderRightColor: colors.border, paddingTop: Platform.OS === 'ios' ? 50 : spacing.lg,
    ...shadows.md,
  },
  sidebarHeader: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  sidebarLogo: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm,
  },
  sidebarBrand: { fontSize: typography.sizes.md, fontWeight: typography.weights.black as any, color: colors.textPrimary },
  sidebarProperty: { fontSize: typography.sizes.xs, color: colors.primary, fontWeight: typography.weights.semibold as any },
  sidebarNav: { paddingTop: spacing.md, flex: 1 },
  sidebarItem: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md, borderRadius: 0, position: 'relative', marginBottom: 2,
  },
  sidebarItemActive: { backgroundColor: colors.primaryLight },
  sidebarItemIcon: { marginRight: spacing.md },
  sidebarItemLabel: { fontSize: typography.sizes.sm, fontWeight: typography.weights.medium as any, color: colors.textSecondary },
  sidebarItemLabelActive: { color: colors.primary, fontWeight: typography.weights.bold as any },
  sidebarActiveIndicator: {
    position: 'absolute', right: 0, top: '20%', bottom: '20%',
    width: 3, backgroundColor: colors.primary, borderRadius: borderRadius.circle,
  },
  sidebarPropertySwitch: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.border,
  },
  sidebarSwitchIcon: { marginRight: spacing.sm },
  sidebarSwitchText: { fontSize: typography.sizes.sm, color: colors.textSecondary, fontWeight: typography.weights.medium as any },
  tabletContent: { flex: 1 },

  // Mobile
  mobileContainer: { flex: 1, backgroundColor: colors.background },
  mobileContent: { flex: 1 },
  tabBar: {
    flexDirection: 'row', backgroundColor: colors.card, borderTopWidth: 1,
    borderTopColor: colors.border, paddingBottom: Platform.OS === 'ios' ? 24 : spacing.sm,
    paddingTop: spacing.sm, paddingHorizontal: spacing.xs,
    ...shadows.md,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabIconWrapper: { width: 36, height: 26, justifyContent: 'center', alignItems: 'center', borderRadius: borderRadius.small },
  tabIconWrapperActive: { backgroundColor: colors.primaryLight },
  tabLabel: { fontSize: 10, color: colors.textMuted, fontWeight: typography.weights.medium as any, marginTop: 2 },
  tabLabelActive: { color: colors.primary, fontWeight: typography.weights.bold as any },
  tabCenterBtn: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center', marginTop: -20,
    ...shadows.lg,
  },
});
