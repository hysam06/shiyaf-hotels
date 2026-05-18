import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Property } from '../types';
import Avatar from '../components/Avatar';

interface Props {
  onSelectProperty: (property: Property) => void;
}

const PROPERTIES = [
  {
    key: 'plaza' as Property,
    name: 'Plaza Residency',
    location: 'Main City Center, Bengaluru',
    rooms: 32,
    emoji: '🏛️',
    gradient: ['#FF6B35', '#FF8E53'] as const,
    tagline: 'Flagship Property',
  },
  {
    key: 'century' as Property,
    name: 'Century Residency',
    location: 'Commercial Hub, Bengaluru',
    rooms: 28,
    emoji: '🏢',
    gradient: ['#1E293B', '#334155'] as const,
    tagline: 'Premium Business Hotel',
  },
];

export default function PropertySelectionScreen({ onSelectProperty }: Props) {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good {getTimeOfDay()},</Text>
            <Text style={styles.userName}>{user?.name?.split(' ')[0] || 'Staff'} 👋</Text>
          </View>
          <View style={styles.headerRight}>
            <Avatar name={user?.name || 'S'} size={44} />
            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Select a property to manage</Text>

        {/* Property Cards */}
        <View style={styles.cardsContainer}>
          {PROPERTIES.map((prop) => (
            <TouchableOpacity
              key={prop.key}
              activeOpacity={0.9}
              onPress={() => onSelectProperty(prop.key)}
            >
              <LinearGradient
                colors={prop.gradient}
                style={styles.propertyCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {/* Background Decoration */}
                <View style={styles.cardDecor1} />
                <View style={styles.cardDecor2} />

                <View style={styles.cardContent}>
                  <View style={styles.cardTop}>
                    <View style={styles.hotelIconCircle}>
                      <Text style={styles.hotelEmoji}>{prop.emoji}</Text>
                    </View>
                    <View style={styles.taglinePill}>
                      <Text style={styles.taglineText}>{prop.tagline}</Text>
                    </View>
                  </View>

                  <Text style={styles.propertyName}>{prop.name}</Text>
                  <Text style={styles.propertyLocation}>📍 {prop.location}</Text>

                  <View style={styles.cardFooter}>
                    <View style={styles.roomCount}>
                      <Text style={styles.roomCountNum}>{prop.rooms}</Text>
                      <Text style={styles.roomCountLabel}>Rooms</Text>
                    </View>
                    <View style={styles.manageBtn}>
                      <Text style={styles.manageBtnText}>Manage →</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Role Badge */}
        <View style={styles.roleBanner}>
          <Text style={styles.roleBannerText}>
            Logged in as {' '}
            <Text style={styles.roleBannerRole}>{user?.role?.toUpperCase()}</Text>
            {user?.role !== 'admin' ? ` · Access scoped to assigned properties` : ' · Full system access'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginTop: spacing.md, marginBottom: spacing.lg,
  },
  greeting: { fontSize: typography.sizes.sm, color: colors.textSecondary },
  userName: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold as any, color: colors.textPrimary },
  headerRight: { alignItems: 'flex-end', gap: spacing.xs },
  logoutBtn: {
    backgroundColor: colors.errorLight, paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs, borderRadius: borderRadius.circle,
  },
  logoutText: { fontSize: typography.sizes.xs, color: colors.error, fontWeight: typography.weights.semibold as any },
  subtitle: { fontSize: typography.sizes.md, color: colors.textSecondary, marginBottom: spacing.lg },
  cardsContainer: { gap: spacing.md, marginBottom: spacing.lg },
  propertyCard: {
    borderRadius: borderRadius.extraLarge,
    padding: spacing.lg,
    minHeight: 200,
    overflow: 'hidden',
    position: 'relative',
    ...shadows.lg,
  },
  cardDecor1: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.06)', top: -60, right: -40,
  },
  cardDecor2: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.04)', bottom: -30, left: -20,
  },
  cardContent: { zIndex: 2 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  hotelIconCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center',
  },
  hotelEmoji: { fontSize: 28 },
  taglinePill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: borderRadius.circle,
  },
  taglineText: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.9)', fontWeight: typography.weights.semibold as any },
  propertyName: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold as any, color: colors.textOnDark, marginBottom: 4 },
  propertyLocation: { fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.75)', marginBottom: spacing.lg },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  roomCount: {},
  roomCountNum: { fontSize: typography.sizes.xxxl, fontWeight: typography.weights.black as any, color: colors.textOnDark },
  roomCountLabel: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.7)' },
  manageBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm, borderRadius: borderRadius.large,
  },
  manageBtnText: { color: colors.textOnDark, fontSize: typography.sizes.sm, fontWeight: typography.weights.bold as any },
  roleBanner: {
    backgroundColor: colors.primaryLight, borderRadius: borderRadius.large,
    padding: spacing.md, alignItems: 'center',
  },
  roleBannerText: { fontSize: typography.sizes.xs, color: colors.primary, textAlign: 'center' },
  roleBannerRole: { fontWeight: typography.weights.black as any },
});
