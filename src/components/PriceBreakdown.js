import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function PriceBreakdown({ booking, currency }) {
  const rows = [
    { label: 'Итого к оплате', value: `${booking.totalPrice} ${currency}`, strong: true },
    { label: 'Комиссия платформы (12%)', value: `${booking.commissionAmount} ${currency}` },
    { label: 'Выплата водителю', value: `${booking.payoutAmount} ${currency}` },
    { label: 'Сэкономлено CO₂', value: `${booking.co2SavedKg} кг` },
  ];
  return (
    <View style={styles.box}>
      {rows.map((r) => (
        <View key={r.label} style={styles.row}>
          <Text style={[styles.label, r.strong && styles.strong]}>{r.label}</Text>
          <Text style={[styles.value, r.strong && styles.strong]}>{r.value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: '#eef6f0', borderRadius: 10, padding: 12, marginTop: 8, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  label: { fontSize: 14, color: colors.textMuted },
  value: { fontSize: 14, color: colors.text, fontWeight: '500' },
  strong: { color: colors.primary, fontWeight: '700', fontSize: 15 },
});