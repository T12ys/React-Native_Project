import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

const STATUS_LABELS = {
  confirmed: { text: 'Подтверждена', color: colors.primary },
  completed: { text: 'Завершена', color: colors.textMuted },
  cancelled: { text: 'Отменена', color: colors.danger },
};

export default function BookingCard({ booking, onCancel }) {
  const status = STATUS_LABELS[booking.status] || { text: booking.status, color: colors.textMuted };
  const canCancel = booking.status === 'confirmed';

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.seats}>Мест: {booking.seatsBooked}</Text>
        <Text style={[styles.status, { color: status.color }]}>{status.text}</Text>
      </View>
      <Text style={styles.price}>Оплачено: {booking.totalPrice} AZN</Text>
      <Text style={styles.meta}>Комиссия: {booking.commissionAmount} AZN · Водителю: {booking.payoutAmount} AZN</Text>
      <Text style={styles.meta}>Сэкономлено CO₂: {booking.co2SavedKg} кг</Text>

      {canCancel && (
        <TouchableOpacity style={styles.cancelBtn} onPress={() => onCancel(booking)} activeOpacity={0.8}>
          <Text style={styles.cancelText}>Отменить бронь</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  seats: { fontSize: 16, fontWeight: '600', color: colors.text },
  status: { fontSize: 14, fontWeight: '600' },
  price: { fontSize: 15, color: colors.text, marginBottom: 2 },
  meta: { fontSize: 13, color: colors.textMuted },
  cancelBtn: { marginTop: 12, borderWidth: 1, borderColor: colors.danger, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  cancelText: { color: colors.danger, fontWeight: '600' },
});