import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { guestApi } from '../services/api';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Property, Guest, GuestStatus } from '../types';
import FilterChip from '../components/FilterChip';
import ExpandableGuestCard from '../components/ExpandableGuestCard';
import Icon from '../components/Icon';

interface Props {
  property: Property;
  onBack: () => void;
}

type Filter = 'all' | 'checked_in' | 'checked_out' | 'cancelled';

export default function GuestsListScreen({ property, onBack }: Props) {
  const { hasPermission } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  const loadGuests = async () => {
    setLoading(true);
    try {
      const data = await guestApi.getGuests(property);
      setGuests(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load guests. Pull to retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadGuests(); }, [property]);

  const handleCheckout = async (id: string) => {
    await guestApi.checkoutGuest(id);
    setGuests((prev) =>
      prev.map((g) => g.id === id ? { ...g, status: 'checked_out' as GuestStatus } : g)
    );
  };

  const filtered = guests.filter((g) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      g.guest_name.toLowerCase().includes(q) ||
      g.room_number.toLowerCase().includes(q) ||
      g.contact_number.includes(q) ||
      g.registration_number.toLowerCase().includes(q);
    const matchesFilter = activeFilter === 'all' || g.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const countByStatus = (status: GuestStatus) => guests.filter((g) => g.status === status).length;

  const filters: { key: Filter; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: guests.length },
    { key: 'checked_in', label: 'Checked In', count: countByStatus('checked_in') },
    { key: 'checked_out', label: 'Checked Out', count: countByStatus('checked_out') },
    { key: 'cancelled', label: 'Cancelled', count: countByStatus('cancelled') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Icon name="back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Guest Ledger</Text>
          <Text style={styles.headerSub}>{guests.length} total records</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Icon name="search" size={17} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Name, room, phone, reg ID..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
        {filters.map((f) => (
          <FilterChip
            key={f.key}
            label={f.label}
            active={activeFilter === f.key}
            onPress={() => setActiveFilter(f.key)}
            count={f.count}
          />
        ))}
      </ScrollView>

      {/* Guest List */}
      <ScrollView
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadGuests} tintColor={colors.primary} />}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Icon name={search ? 'search' : 'clipboard'} size={45} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>{search ? 'No results found' : 'No guests yet'}</Text>
            <Text style={styles.emptySubtitle}>{search ? `Try a different search term` : 'Start by registering a new guest'}</Text>
          </View>
        ) : (
          filtered.map((guest) => (
            <ExpandableGuestCard
              key={guest.id}
              guest={guest}
              onCheckout={handleCheckout}
              canCheckout={hasPermission('checkout_guest')}
              onEdit={hasPermission('edit_guest') ? (g) => Alert.alert('Edit Guest', `Editing is not enabled for ${g.guest_name}.`) : undefined}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md, backgroundColor: colors.card, ...shadows.sm,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold as any, color: colors.textPrimary, textAlign: 'center' },
  headerSub: { fontSize: typography.sizes.xs, color: colors.textSecondary, textAlign: 'center' },
  placeholder: { width: 40 },
  searchContainer: { padding: spacing.md, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background,
    borderRadius: borderRadius.large, paddingHorizontal: spacing.md, height: 46,
  },
  searchInput: { flex: 1, fontSize: typography.sizes.sm, color: colors.textPrimary, marginLeft: spacing.sm },
  filterRow: { maxHeight: 56, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
  filterContent: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, alignItems: 'center' },
  list: { padding: spacing.md, paddingBottom: spacing.xxl },
  empty: { alignItems: 'center', paddingTop: spacing.xxl * 2 },
  emptyTitle: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold as any, color: colors.textPrimary, marginBottom: 4 },
  emptySubtitle: { fontSize: typography.sizes.sm, color: colors.textSecondary },
});
