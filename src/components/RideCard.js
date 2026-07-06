import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export default function RideCard({ ride, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.row}>
        <Text style={styles.route}>{ride.origin} → {ride.destination}</Text>
        <Text style={styles.price}>{ride.pricePerSeat} {ride.currency}</Text>
      </View>
      <Text style={styles.meta}>{ride.date} · {ride.time}</Text>
      <View style={styles.row}>
        <Text style={styles.driver}>Водитель: {ride.driverName}</Text>
        <Text style={styles.seats}>Свободно мест: {ride.seatsAvailable}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  route: { fontSize: 16, fontWeight: '600', color: colors.text, flex: 1 },
  price: { fontSize: 16, fontWeight: '700', color: colors.primary },
  meta: { fontSize: 14, color: colors.textMuted, marginVertical: 6 },
  driver: { fontSize: 14, color: colors.text },
  seats: { fontSize: 14, color: colors.textMuted },
});