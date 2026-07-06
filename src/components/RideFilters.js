import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export default function RideFilters({ values, onChange, onApply, onReset }) {
  const set = (key) => (text) => onChange({ ...values, [key]: text });

  return (
    <View style={styles.box}>
      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Откуда</Text>
          <TextInput style={styles.input} value={values.origin} onChangeText={set('origin')} placeholder="город/точка" placeholderTextColor={colors.textMuted} autoCapitalize="none" />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Куда</Text>
          <TextInput style={styles.input} value={values.destination} onChangeText={set('destination')} placeholder="город/точка" placeholderTextColor={colors.textMuted} autoCapitalize="none" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Дата (ГГГГ-ММ-ДД)</Text>
          <TextInput style={styles.input} value={values.date} onChangeText={set('date')} placeholder="2026-07-10" placeholderTextColor={colors.textMuted} autoCapitalize="none" />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Мин. мест</Text>
          <TextInput style={styles.input} value={values.seatsAvailable} onChangeText={set('seatsAvailable')} placeholder="1" placeholderTextColor={colors.textMuted} keyboardType="number-pad" />
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.applyBtn} onPress={onApply} activeOpacity={0.8}>
          <Text style={styles.applyText}>Применить</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetBtn} onPress={onReset} activeOpacity={0.8}>
          <Text style={styles.resetText}>Сбросить</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.card, padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  half: { width: '48%', marginBottom: 8 },
  label: { fontSize: 12, color: colors.textMuted, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 14, color: colors.text, backgroundColor: colors.background },
  actions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  applyBtn: { flex: 1, backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  applyText: { color: '#fff', fontWeight: '600' },
  resetBtn: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  resetText: { color: colors.text, fontWeight: '600' },
});