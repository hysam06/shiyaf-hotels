import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator, SafeAreaView, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { guestApi } from '../services/api';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Property, GuestFormData } from '../types';
import UploadBox from '../components/UploadBox';
import Avatar from '../components/Avatar';

interface Props { property: Property; onBack: () => void; onSuccess: () => void; }
type Section = 'personal' | 'stay' | 'id';

const ID_TYPES = ['Aadhaar', 'PAN Card', 'Passport', 'Driving Licence'];
const ROOM_TYPES = ['Standard', 'Deluxe', 'Suite', 'Executive'];
const PAYMENT_MODES = ['Cash', 'UPI', 'Card', 'Net Banking'];

function Field({ label, placeholder, value, onChange, keyboardType, maxLength, multiline }: any) {
  return (
    <View style={fStyles.group}>
      <Text style={fStyles.label}>{label}</Text>
      <TextInput
        style={[fStyles.input, multiline && fStyles.multiline]}
        placeholder={placeholder} placeholderTextColor={colors.textMuted}
        value={value} onChangeText={onChange} keyboardType={keyboardType || 'default'}
        maxLength={maxLength} multiline={!!multiline} numberOfLines={multiline ? 3 : 1}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
      />
    </View>
  );
}

const fStyles = StyleSheet.create({
  group: { marginBottom: spacing.md },
  label: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold as any, color: colors.textSecondary, marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: colors.card, borderRadius: borderRadius.medium, paddingHorizontal: spacing.md, paddingVertical: 14, fontSize: typography.sizes.md, color: colors.textPrimary, ...shadows.sm },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
});

export default function RegistrationScreen({ property, onBack, onSuccess }: Props) {
  const [activeSection, setActiveSection] = useState<Section>('personal');
  const [loading, setLoading] = useState(false);
  const [profilePhotoUri, setProfilePhotoUri] = useState<string | undefined>();
  const [idFrontUri, setIdFrontUri] = useState<string | undefined>();
  const [idBackUri, setIdBackUri] = useState<string | undefined>();
  const [whatsappReceipt, setWhatsappReceipt] = useState(false);
  const [selectedIdType, setSelectedIdType] = useState('Aadhaar');
  const [selectedRoomType, setSelectedRoomType] = useState('Standard');
  const [selectedPayment, setSelectedPayment] = useState('Cash');
  const [form, setForm] = useState<Partial<GuestFormData>>({
    property, nationality: 'Indian',
    arrival_date: new Date().toISOString().split('T')[0],
  });

  const updateField = (key: keyof GuestFormData, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validateAndSubmit = async () => {
    if (!form.guest_name?.trim()) return Alert.alert('Required', 'Guest name is required.');
    if (!/^[6-9]\d{9}$/.test(form.contact_number || '')) return Alert.alert('Invalid', 'Enter a valid 10-digit mobile number.');
    if (!form.room_number?.trim()) return Alert.alert('Required', 'Room number is required.');
    setLoading(true);
    try {
      await guestApi.registerGuest({
        property, guest_name: form.guest_name!.trim(), contact_number: form.contact_number!.trim(),
        email: form.email?.trim(), nationality: form.nationality || 'Indian',
        address: form.address?.trim(), city: form.city?.trim(), pin: form.pin?.trim(),
        room_number: form.room_number!.trim(), room_type: selectedRoomType,
        arrival_date: form.arrival_date || new Date().toISOString().split('T')[0],
        departure_date: form.departure_date, purpose_of_visit: form.purpose_of_visit?.trim(),
        mode_of_payment: selectedPayment,
        advance_payment: parseFloat(String(form.advance_payment || 0)),
        tariff: parseFloat(String(form.tariff || 0)),
        profile_photo_url: profilePhotoUri, id_photo_front_url: idFrontUri,
        id_photo_back_url: idBackUri, id_type: selectedIdType.toLowerCase().replace(' ', '_') as any,
        whatsapp_receipt_sent: whatsappReceipt,
      });
      Alert.alert('✅ Registered!', `${form.guest_name} checked in to Room ${form.room_number}.`, [{ text: 'Done', onPress: onSuccess }]);
    } catch (err: any) {
      Alert.alert('Failed', err.message || 'Please try again.');
    } finally { setLoading(false); }
  };

  const Pills = ({ items, selected, onSelect }: { items: string[]; selected: string; onSelect: (v: string) => void }) => (
    <View style={styles.pillRow}>
      {items.map((it) => (
        <TouchableOpacity key={it} style={[styles.pill, selected === it && styles.pillActive]} onPress={() => onSelect(it)}>
          <Text style={[styles.pillText, selected === it && styles.pillTextActive]}>{it}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const NextBtn = ({ label, next }: { label: string; next: Section }) => (
    <TouchableOpacity style={styles.nextBtn} onPress={() => setActiveSection(next)}>
      <LinearGradient colors={['#FF6B35', '#FF8E53']} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <Text style={styles.btnText}>{label} →</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#FF6B35', '#FF8E53']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backText}>⟵</Text></TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>New Guest Registration</Text>
          <Text style={styles.headerSub}>{property === 'plaza' ? 'Plaza Residency' : 'Century Residency'}</Text>
        </View>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {/* Section Tabs */}
      <View style={styles.tabs}>
        {(['personal', 'stay', 'id'] as Section[]).map((s) => (
          <TouchableOpacity key={s} style={[styles.tab, activeSection === s && styles.tabActive]} onPress={() => setActiveSection(s)}>
            <Text style={[styles.tabText, activeSection === s && styles.tabTextActive]}>
              {s === 'personal' ? '1 · Personal' : s === 'stay' ? '2 · Stay' : '3 · ID Docs'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {activeSection === 'personal' && (
          <>
            <View style={styles.photoRow}>
              <Avatar name={form.guest_name || 'Guest'} uri={profilePhotoUri} size={72} />
              <View style={styles.photoInfo}>
                <Text style={styles.photoTitle}>Profile Photo</Text>
                <TouchableOpacity style={styles.photoBtn} onPress={() => {
                  setProfilePhotoUri('https://ui-avatars.com/api/?name=' + (form.guest_name || 'Guest') + '&background=FF6B35&color=fff&size=200');
                  Alert.alert('Demo', 'Camera launches in production. Avatar placeholder set.');
                }}>
                  <Text style={styles.photoBtnText}>📷 Capture</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Field label="Full Name *" placeholder="e.g. Rahul Sharma" value={form.guest_name || ''} onChange={(v: string) => updateField('guest_name', v)} />
            <Field label="Mobile Number *" placeholder="10-digit number" value={form.contact_number || ''} onChange={(v: string) => updateField('contact_number', v)} keyboardType="phone-pad" maxLength={10} />
            <Field label="Email" placeholder="guest@email.com" value={form.email || ''} onChange={(v: string) => updateField('email', v)} keyboardType="email-address" />
            <Field label="Nationality" placeholder="Indian" value={form.nationality || ''} onChange={(v: string) => updateField('nationality', v)} />
            <Field label="Address" placeholder="House, Street, Area..." value={form.address || ''} onChange={(v: string) => updateField('address', v)} multiline />
            <Field label="City" placeholder="City" value={form.city || ''} onChange={(v: string) => updateField('city', v)} />
            <Field label="PIN Code" placeholder="6-digit PIN" value={form.pin || ''} onChange={(v: string) => updateField('pin', v)} keyboardType="numeric" maxLength={6} />
            <NextBtn label="Continue to Stay Details" next="stay" />
          </>
        )}

        {activeSection === 'stay' && (
          <>
            <Field label="Room Number *" placeholder="e.g. 201" value={form.room_number || ''} onChange={(v: string) => updateField('room_number', v)} />
            <Text style={fStyles.label}>Room Type</Text>
            <Pills items={ROOM_TYPES} selected={selectedRoomType} onSelect={setSelectedRoomType} />
            <Field label="Check-in Date" placeholder="YYYY-MM-DD" value={form.arrival_date || ''} onChange={(v: string) => updateField('arrival_date', v)} />
            <Field label="Expected Checkout" placeholder="YYYY-MM-DD" value={form.departure_date || ''} onChange={(v: string) => updateField('departure_date', v)} />
            <Field label="Daily Tariff (₹)" placeholder="0.00" value={String(form.tariff || '')} onChange={(v: string) => updateField('tariff', v)} keyboardType="decimal-pad" />
            <Field label="Advance Paid (₹)" placeholder="0.00" value={String(form.advance_payment || '')} onChange={(v: string) => updateField('advance_payment', v)} keyboardType="decimal-pad" />
            <Text style={fStyles.label}>Payment Mode</Text>
            <Pills items={PAYMENT_MODES} selected={selectedPayment} onSelect={setSelectedPayment} />
            <Field label="Purpose of Visit" placeholder="Business / Leisure / Medical..." value={form.purpose_of_visit || ''} onChange={(v: string) => updateField('purpose_of_visit', v)} />
            <View style={styles.toggleRow}>
              <View style={{ flex: 1, marginRight: spacing.md }}>
                <Text style={styles.toggleTitle}>💬 WhatsApp Receipt</Text>
                <Text style={styles.toggleSub}>Send booking details to guest's WhatsApp</Text>
              </View>
              <Switch value={whatsappReceipt} onValueChange={setWhatsappReceipt}
                trackColor={{ false: colors.border, true: colors.primaryLight }}
                thumbColor={whatsappReceipt ? colors.primary : colors.textMuted} />
            </View>
            <NextBtn label="Continue to ID Documents" next="id" />
          </>
        )}

        {activeSection === 'id' && (
          <>
            <Text style={fStyles.label}>ID Document Type</Text>
            <Pills items={ID_TYPES} selected={selectedIdType} onSelect={setSelectedIdType} />
            <UploadBox label={`${selectedIdType} — Front`} uri={idFrontUri} onImagePicked={setIdFrontUri} aspect={[4, 3]} />
            <UploadBox label={`${selectedIdType} — Back`} uri={idBackUri} onImagePicked={setIdBackUri} aspect={[4, 3]} />

            <TouchableOpacity style={styles.ocrBtn} onPress={() => Alert.alert('OCR Scanner', '🤖 Auto-scan coming in Phase 2. Will auto-fill guest details from ID photo.')}>
              <Text style={{ fontSize: 28 }}>🤖</Text>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.ocrTitle}>Auto-Scan ID with OCR</Text>
                <Text style={styles.ocrSub}>Coming Soon · Phase 2</Text>
              </View>
              <Text style={{ fontSize: 20, color: colors.primary }}>›</Text>
            </TouchableOpacity>

            {form.nationality && form.nationality.toLowerCase() !== 'indian' && (
              <View style={styles.cForm}>
                <Text style={{ fontSize: 20 }}>✈️</Text>
                <Text style={styles.cFormText}>Foreign national — C-Form will be auto-generated on check-in.</Text>
              </View>
            )}

            <TouchableOpacity style={styles.submitBtn} onPress={validateAndSubmit} disabled={loading}>
              <LinearGradient colors={['#FF6B35', '#FF8E53']} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {loading ? <ActivityIndicator color={colors.textOnDark} /> : <Text style={styles.btnText}>✅ Register Guest</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backText: { fontSize: 20, color: colors.textOnDark, fontWeight: typography.weights.bold as any },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold as any, color: colors.textOnDark },
  headerSub: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.8)' },
  tabs: { flexDirection: 'row', backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: { flex: 1, paddingVertical: spacing.md, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { fontSize: typography.sizes.xs, fontWeight: typography.weights.semibold as any, color: colors.textSecondary },
  tabTextActive: { color: colors.primary, fontWeight: typography.weights.bold as any },
  scroll: { padding: spacing.md, paddingBottom: 60 },
  photoRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: borderRadius.large, padding: spacing.md, marginBottom: spacing.md, ...shadows.sm, gap: spacing.md },
  photoInfo: { flex: 1 },
  photoTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold as any, color: colors.textPrimary, marginBottom: 4 },
  photoBtn: { backgroundColor: colors.primaryLight, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.circle, alignSelf: 'flex-start' },
  photoBtnText: { fontSize: typography.sizes.xs, color: colors.primary, fontWeight: typography.weights.semibold as any },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  pill: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.circle, backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.border },
  pillActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  pillText: { fontSize: typography.sizes.xs, color: colors.textSecondary, fontWeight: typography.weights.semibold as any },
  pillTextActive: { color: colors.primary },
  toggleRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: borderRadius.large, padding: spacing.md, marginBottom: spacing.md, ...shadows.sm },
  toggleTitle: { fontSize: typography.sizes.sm, fontWeight: typography.weights.semibold as any, color: colors.textPrimary },
  toggleSub: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginTop: 2 },
  nextBtn: { borderRadius: borderRadius.large, overflow: 'hidden', marginTop: spacing.md },
  submitBtn: { borderRadius: borderRadius.large, overflow: 'hidden', marginTop: spacing.md },
  btnGradient: { paddingVertical: spacing.md + 2, alignItems: 'center' },
  btnText: { color: colors.textOnDark, fontSize: typography.sizes.md, fontWeight: typography.weights.black as any },
  ocrBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF2EC', borderRadius: borderRadius.large, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.primaryLight },
  ocrTitle: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold as any, color: colors.primary },
  ocrSub: { fontSize: typography.sizes.xs, color: colors.textMuted },
  cForm: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#F0FAFE', borderRadius: borderRadius.large, padding: spacing.md, marginBottom: spacing.md, gap: spacing.sm },
  cFormText: { flex: 1, fontSize: typography.sizes.xs, color: '#0369A1', lineHeight: 18 },
});
