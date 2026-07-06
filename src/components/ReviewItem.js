import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function ReviewItem({ review }) {
  return (
    <View style={styles.item}>
      <View style={styles.row}>
        <Text style={styles.name}>{review.riderName}</Text>
        <Text style={styles.rating}>★ {review.rating}</Text>
      </View>
      {review.comment ? <Text style={styles.comment}>{review.comment}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  item: { backgroundColor: colors.card, borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 14, fontWeight: '600', color: colors.text },
  rating: { fontSize: 14, color: colors.warning, fontWeight: '600' },
  comment: { marginTop: 4, fontSize: 14, color: colors.textMuted },
});