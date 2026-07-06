import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function Placeholder({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
      <Text style={styles.muted}>Этот экран сделаем на следующих шагах</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: 24 },
  text: { fontSize: 18, fontWeight: '600', color: colors.text },
  muted: { marginTop: 8, color: colors.textMuted, textAlign: 'center' },
});