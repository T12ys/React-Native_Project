import { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getRides } from '../api/rides';
import RideCard from '../components/RideCard';
import RideFilters from '../components/RideFilters';
import StateView from '../components/StateView';
import { colors } from '../theme/colors';

const EMPTY_FILTERS = { origin: '', destination: '', date: '', seatsAvailable: '' };

export default function RidesListScreen({ navigation }) {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [filters, setFilters] = useState(EMPTY_FILTERS);       // что сейчас в полях
  const [applied, setApplied] = useState(EMPTY_FILTERS);       // что реально применено к запросу

  const loadRides = useCallback(async (activeFilters) => {
    try {
      setError(null);

      const params = {};
      Object.entries(activeFilters).forEach(([k, v]) => {
        if (v !== '' && v != null) params[k] = v.trim ? v.trim() : v;
      });
      const data = await getRides(params);
      setRides(data);
    } catch (e) {
      setError('Не удалось загрузить поездки. Проверь, что бэкенд запущен.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);


  useFocusEffect(
    useCallback(() => {
      loadRides(applied);
    }, [loadRides, applied])
  );

  const onApply = () => {
    setLoading(true);
    setApplied(filters);     
    loadRides(filters);
  };

  const onReset = () => {
    setFilters(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    setLoading(true);
    loadRides(EMPTY_FILTERS);
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRides(applied);
  };

  const header = (
    <RideFilters values={filters} onChange={setFilters} onApply={onApply} onReset={onReset} />
  );

  return (
    <View style={styles.container}>
      {(loading || error || rides.length === 0) ? (
        <>
          {header}
          <StateView
            loading={loading}
            error={error}
            empty={rides.length === 0}
            emptyText="Поездок по заданным фильтрам нет"
          />
        </>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={header}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <RideCard ride={item} onPress={() => navigation.navigate('RideDetail', { rideId: item.id })} />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16 },
});