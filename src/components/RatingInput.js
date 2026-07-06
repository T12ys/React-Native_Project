import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export default function RatingInput({ value, onChange }) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => onChange(star)} activeOpacity={0.7}>
          <Text style={[styles.star, star <= value ? styles.active : styles.inactive]}>★</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.value}>{value}/5</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  star: { fontSize: 30, marginRight: 4 },
  active: { color: colors.warning },
  inactive: { color: colors.border },
  value: { marginLeft: 8, fontSize: 14, color: colors.textMuted },
});