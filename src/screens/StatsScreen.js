import { useState, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getStats } from '../api/stats';
import StateView from '../components/StateView';
import { colors } from '../theme/colors';

function StatCard({ label, value, hint }) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export default function StatsScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await getStats();
      setStats(data);
    } catch (e) {
      setError('Не удалось загрузить статистику.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  if (loading || error || !stats) {
    return <StateView loading={loading} error={error} empty={!stats} emptyText="Нет данных" />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.hero}>
        <Text style={styles.heroValue}>{stats.totalCo2SavedKg} кг</Text>
        <Text style={styles.heroLabel}>CO₂ сэкономлено сообществом</Text>
      </View>

      <View style={styles.grid}>
        <StatCard label="Всего поездок" value={stats.totalRides} />
        <StatCard label="Всего броней" value={stats.totalBookings} />
        <StatCard label="Водителей" value={stats.totalDrivers} />
        <StatCard label="Проверенных" value={stats.verifiedDrivers} hint="водителей" />
      </View>

      <Text style={styles.note}>
        Совместные поездки снижают углеродный след. Каждое забронированное место — это меньше машин на дороге.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  hero: { backgroundColor: colors.primary, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 16 },
  heroValue: { fontSize: 36, fontWeight: '800', color: '#fff' },
  heroLabel: { fontSize: 14, color: '#eaf5ee', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border, width: '48%', alignItems: 'center' },
  value: { fontSize: 26, fontWeight: '700', color: colors.primary },
  label: { fontSize: 13, color: colors.text, marginTop: 4, textAlign: 'center' },
  hint: { fontSize: 12, color: colors.textMuted },
  note: { fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: 8, lineHeight: 18 },
});