import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function StateView({ loading, error, empty, emptyText = 'Ничего не найдено' }) {
  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color={colors.primary} />}
      {!loading && error && <Text style={styles.error}>{error}</Text>}
      {!loading && !error && empty && <Text style={styles.muted}>{emptyText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  error: { color: colors.danger, textAlign: 'center', fontSize: 15 },
  muted: { color: colors.textMuted, textAlign: 'center', fontSize: 15 },
});