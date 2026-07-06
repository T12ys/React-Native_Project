import { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getBookings, updateBookingStatus } from '../api/bookings';
import { getRiderEmail, saveRiderEmail } from '../storage/userStorage';
import FormField from '../components/FormField';
import BookingCard from '../components/BookingCard';
import StateView from '../components/StateView';
import { colors } from '../theme/colors';

export default function MyBookingsScreen() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loaded, setLoaded] = useState(false); 

  const fetchBookings = useCallback(async (targetEmail) => {
    const mail = (targetEmail ?? '').trim();
    if (!mail) {
      setError('Укажите email, под которым бронировали.');
      setBookings([]);
      setLoaded(true);
      return;
    }
    try {
      setError(null);
      setLoading(true);
      const data = await getBookings({ riderEmail: mail });
      const sorted = [...data].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      setBookings(sorted);
      setLoaded(true);
    } catch (e) {
      setError('Не удалось загрузить брони.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);


  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        const saved = await getRiderEmail();
        if (!active) return;
        if (saved) {
          setEmail(saved);
          fetchBookings(saved);
        } else {
          setLoaded(true);
        }
      })();
      return () => { active = false; };
    }, [fetchBookings])
  );

  const onSearch = async () => {
    await saveRiderEmail(email.trim()); 
    fetchBookings(email);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings(email);
  };

  const handleCancel = (booking) => {
    Alert.alert(
      'Отменить бронь?',
      `Мест: ${booking.seatsBooked}, на сумму ${booking.totalPrice} AZN.`,
      [
        { text: 'Нет', style: 'cancel' },
        {
          text: 'Да, отменить',
          style: 'destructive',
          onPress: async () => {
            try {
              await updateBookingStatus(booking.id, 'cancelled');
              fetchBookings(email); 
            } catch (e) {
              Alert.alert('Ошибка', e.response?.data?.error || 'Не удалось отменить бронь.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <FormField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="ваш email при бронировании"
          keyboardType="email-address"
        />
        <TouchableOpacity style={styles.button} onPress={onSearch} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Показать брони</Text>
        </TouchableOpacity>
      </View>

      {(loading || error || (loaded && bookings.length === 0)) ? (
        <StateView
          loading={loading}
          error={error}
          empty={loaded && bookings.length === 0}
          emptyText="Броней по этому email не найдено"
        />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <BookingCard booking={item} onCancel={handleCancel} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchBox: { padding: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
  button: { backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  list: { padding: 16 },
});