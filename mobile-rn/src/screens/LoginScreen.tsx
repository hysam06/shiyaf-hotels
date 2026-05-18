import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';
import { UserRole } from '../types';

export default function LoginScreen() {
  const { login } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailOrPhone.trim()) {
      Alert.alert('Required', 'Please enter your email or phone number.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Required', 'Please enter your password.');
      return;
    }
    setLoading(true);
    try {
      await login(emailOrPhone.trim(), password.trim());
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: UserRole) => {
    const creds: Record<UserRole, { email: string; pass: string }> = {
      admin: { email: 'admin@shiyaf.com', pass: 'admin123' },
      manager: { email: 'manager.plaza@shiyaf.com', pass: 'manager123' },
      staff: { email: 'staff@shiyaf.com', pass: 'staff123' },
    };
    setEmailOrPhone(creds[role].email);
    setPassword(creds[role].pass);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Hero Header */}
        <LinearGradient colors={['#FF6B35', '#FF8E53']} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.heroContent}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🏨</Text>
            </View>
            <Text style={styles.brandName}>Shiyaf Hotels</Text>
            <Text style={styles.tagline}>Premium Property Management Suite</Text>
          </View>
          {/* Decorative circles */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
        </LinearGradient>

        {/* Login Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSubtitle}>Sign in to manage your properties</Text>

          {/* Email / Phone */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email or Phone</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="admin@shiyaf.com or 98765..."
                placeholderTextColor={colors.textMuted}
                value={emailOrPhone}
                onChangeText={setEmailOrPhone}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                <Text style={styles.inputIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity style={styles.signInButton} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
            <LinearGradient colors={['#FF6B35', '#FF8E53']} style={styles.signInGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              {loading ? (
                <ActivityIndicator color={colors.textOnDark} size="small" />
              ) : (
                <Text style={styles.signInText}>Sign In →</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Quick Demo Access</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Demo Quick-fill Pills */}
          <View style={styles.demoPills}>
            <TouchableOpacity style={[styles.demoPill, { borderColor: '#FF6B35' }]} onPress={() => fillDemo('admin')}>
              <Text style={styles.demoPillEmoji}>👑</Text>
              <Text style={[styles.demoPillText, { color: '#FF6B35' }]}>Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.demoPill, { borderColor: '#0284C7' }]} onPress={() => fillDemo('manager')}>
              <Text style={styles.demoPillEmoji}>🏢</Text>
              <Text style={[styles.demoPillText, { color: '#0284C7' }]}>Manager</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.demoPill, { borderColor: '#64748B' }]} onPress={() => fillDemo('staff')}>
              <Text style={styles.demoPillEmoji}>👷</Text>
              <Text style={[styles.demoPillText, { color: '#64748B' }]}>Staff</Text>
            </TouchableOpacity>
          </View>

          {/* Permission Info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 Passwords: <Text style={{ fontWeight: '700' }}>admin123 / manager123 / staff123</Text>
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>© 2026 Shiyaf Hotels · Secure SaaS Platform</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1 },
  hero: {
    paddingTop: 70,
    paddingBottom: 60,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  heroContent: { alignItems: 'center', zIndex: 2 },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  logoEmoji: { fontSize: 36 },
  brandName: { fontSize: typography.sizes.xxxl, fontWeight: typography.weights.black as any, color: colors.textOnDark, letterSpacing: -0.5 },
  tagline: { fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  decorCircle1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.07)', top: -60, right: -60, zIndex: 1,
  },
  decorCircle2: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.05)', bottom: -40, left: -40, zIndex: 1,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.extraLarge,
    margin: spacing.md,
    marginTop: -30,
    padding: spacing.lg,
    ...shadows.lg,
  },
  cardTitle: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold as any, color: colors.textPrimary, marginBottom: 4 },
  cardSubtitle: { fontSize: typography.sizes.sm, color: colors.textSecondary, marginBottom: spacing.lg },
  fieldGroup: { marginBottom: spacing.md },
  fieldLabel: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold as any, color: colors.textSecondary, marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.md,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: { fontSize: 16, marginRight: spacing.sm },
  input: { flex: 1, fontSize: typography.sizes.md, color: colors.textPrimary },
  eyeButton: { padding: spacing.xs },
  signInButton: { borderRadius: borderRadius.large, overflow: 'hidden', marginTop: spacing.sm },
  signInGradient: { paddingVertical: spacing.md + 2, alignItems: 'center', justifyContent: 'center' },
  signInText: { color: colors.textOnDark, fontSize: typography.sizes.md, fontWeight: typography.weights.bold as any },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: typography.sizes.xs, color: colors.textMuted, marginHorizontal: spacing.sm },
  demoPills: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  demoPill: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderRadius: borderRadius.circle, paddingVertical: spacing.sm, gap: 4,
  },
  demoPillEmoji: { fontSize: 14 },
  demoPillText: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold as any },
  infoBox: {
    backgroundColor: colors.primaryLight, borderRadius: borderRadius.medium,
    padding: spacing.md, marginTop: spacing.md,
  },
  infoText: { fontSize: typography.sizes.xs, color: colors.primary, lineHeight: 18 },
  footer: { textAlign: 'center', fontSize: typography.sizes.xs, color: colors.textMuted, padding: spacing.lg },
});
