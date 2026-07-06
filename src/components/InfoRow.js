import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function InfoRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { fontSize: 14, color: colors.textMuted },
  value: { fontSize: 14, color: colors.text, fontWeight: '500', flexShrink: 1, textAlign: 'right', marginLeft: 12 },
});