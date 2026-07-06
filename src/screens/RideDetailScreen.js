import { useEffect, useState, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { getRideById, getRideReviews, bookRide, addRideReview } from '../api/rides';
import { getDriverById } from '../api/drivers';
import { saveRiderEmail } from '../storage/userStorage';
import InfoRow from '../components/InfoRow';
import ReviewItem from '../components/ReviewItem';
import StateView from '../components/StateView';
import FormField from '../components/FormField';
import PriceBreakdown from '../components/PriceBreakdown';
import { colors } from '../theme/colors';
import RatingInput from '../components/RatingInput';

export default function RideDetailScreen({ route }) {
  const { rideId } = route.params;

  const [ride, setRide] = useState(null);
  const [driver, setDriver] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // состояние формы бронирования
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [seats, setSeats] = useState('1');
  const [booking, setBooking] = useState(false);
  const [result, setResult] = useState(null); 

  // состояние формы отзыва
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const [rideData, reviewsData] = await Promise.all([
        getRideById(rideId),
        getRideReviews(rideId),
      ]);
      setRide(rideData);
      setReviews(reviewsData);
      if (rideData.driverId) {
        const driverData = await getDriverById(rideData.driverId);
        setDriver(driverData);
      }
    } catch (e) {
      setError('Не удалось загрузить детали поездки.');
    } finally {
      setLoading(false);
    }
  }, [rideId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBook = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Заполните поля', 'Имя и email обязательны.');
      return;
    }
    const seatsNum = Number(seats);
    if (!seatsNum || seatsNum < 1) {
      Alert.alert('Проверьте мест', 'Число мест должно быть больше нуля.');
      return;
    }
    if (seatsNum > ride.seatsAvailable) {
      Alert.alert('Недостаточно мест', `Свободно только ${ride.seatsAvailable}.`);
      return;
    }

    try {
      setBooking(true);
      const created = await bookRide(rideId, {
        riderName: name.trim(),
        riderEmail: email.trim(),
        riderPhone: phone.trim(),
        seatsBooked: seatsNum,
      });
      setResult(created);

      try {
        await saveRiderEmail(email.trim());
        const freshRide = await getRideById(rideId);
        setRide(freshRide);
      } catch (sideErr) {
        console.log('после брони (не критично):', sideErr?.message);
      }
    } catch (e) {
      const msg = e.response?.data?.error || 'Не удалось забронировать. Попробуйте ещё раз.';
      Alert.alert('Ошибка', msg);
    } finally {
      setBooking(false);
    }
  };

  const handleAddReview = async () => {
    if (!reviewName.trim()) {
      Alert.alert('Укажите имя', 'Введите имя для отзыва.');
      return;
    }
    try {
      setReviewSubmitting(true);
      await addRideReview(rideId, {
        riderName: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      const [freshReviews, freshRide] = await Promise.all([
        getRideReviews(rideId),
        getRideById(rideId),
      ]);
      setReviews(freshReviews);
      setRide(freshRide);
      if (freshRide.driverId) {
        const freshDriver = await getDriverById(freshRide.driverId);
        setDriver(freshDriver);
      }
      setReviewName('');
      setReviewRating(5);
      setReviewComment('');
      Alert.alert('Спасибо!', 'Ваш отзыв добавлен.');
    } catch (e) {
      Alert.alert('Ошибка', e.response?.data?.error || 'Не удалось отправить отзыв.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading || error || !ride) {
    return <StateView loading={loading} error={error} empty={!ride} emptyText="Поездка не найдена" />;
  }

  const soldOut = ride.seatsAvailable < 1 || ride.status !== 'scheduled';

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.route}>{ride.origin} → {ride.destination}</Text>
          <InfoRow label="Дата" value={`${ride.date} · ${ride.time}`} />
          <InfoRow label="Цена за место" value={`${ride.pricePerSeat} ${ride.currency}`} />
          <InfoRow label="Свободно мест" value={`${ride.seatsAvailable} из ${ride.seatsTotal}`} />
          <InfoRow label="Статус" value={ride.status} />
        </View>

        <Text style={styles.sectionTitle}>Водитель</Text>
        <View style={styles.card}>
          {driver ? (
            <>
              <InfoRow label="Имя" value={driver.name} />
              <InfoRow label="Авто" value={driver.vehicleModel} />
              {driver.vehiclePlate ? <InfoRow label="Номер" value={driver.vehiclePlate} /> : null}
              <InfoRow label="Город" value={driver.city} />
              <InfoRow label="Рейтинг" value={driver.reviewsCount > 0 ? `★ ${driver.rating} (${driver.reviewsCount})` : 'Пока нет оценок'} />
              <InfoRow label="Верифицирован" value={driver.isVerified ? 'Да' : 'Нет'} />
            </>
          ) : (
            <Text style={styles.muted}>Данные водителя недоступны</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Бронирование</Text>
        <View style={styles.card}>
          {result ? (
            <View>
              <Text style={styles.successTitle}>Место забронировано!</Text>
              <Text style={styles.muted}>Статус брони: {result.status}</Text>
              <PriceBreakdown booking={result} currency={ride.currency} />
            </View>
          ) : soldOut ? (
            <Text style={styles.muted}>Мест нет или поездка недоступна для брони.</Text>
          ) : (
            <View>
              <FormField label="Ваше имя" value={name} onChangeText={setName} placeholder="Иван" />
              <FormField label="Email" value={email} onChangeText={setEmail} placeholder="ivan@mail.com" keyboardType="email-address" />
              <FormField label="Телефон" value={phone} onChangeText={setPhone} placeholder="+994..." keyboardType="phone-pad" />
              <FormField label="Количество мест" value={seats} onChangeText={setSeats} placeholder="1" keyboardType="number-pad" />
              <Text style={styles.total}>К оплате: {(ride.pricePerSeat * (Number(seats) || 0)).toFixed(2)} {ride.currency}</Text>
              <TouchableOpacity style={[styles.button, booking && styles.buttonDisabled]} onPress={handleBook} disabled={booking} activeOpacity={0.8}>
                <Text style={styles.buttonText}>{booking ? 'Бронируем...' : 'Забронировать'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Отзывы ({reviews.length})</Text>
        {reviews.length > 0 ? (
          reviews.map((r) => <ReviewItem key={r.id} review={r} />)
        ) : (
          <Text style={styles.muted}>Отзывов пока нет</Text>
        )}

        <Text style={styles.sectionTitle}>Оставить отзыв</Text>
        <View style={styles.card}>
          <FormField label="Ваше имя" value={reviewName} onChangeText={setReviewName} placeholder="Иван" />
          <Text style={styles.fieldLabel}>Оценка</Text>
          <RatingInput value={reviewRating} onChange={setReviewRating} />
          <FormField label="Комментарий" value={reviewComment} onChangeText={setReviewComment} placeholder="Как прошла поездка?" />
          <TouchableOpacity style={[styles.button, reviewSubmitting && styles.buttonDisabled]} onPress={handleAddReview} disabled={reviewSubmitting} activeOpacity={0.8}>
            <Text style={styles.buttonText}>{reviewSubmitting ? 'Отправляем...' : 'Отправить отзыв'}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fieldLabel: { fontSize: 14, color: colors.text, marginBottom: 6, fontWeight: '500' },
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  route: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 },
  muted: { color: colors.textMuted, fontSize: 14, marginBottom: 8 },
  total: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 12 },
  button: { backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  successTitle: { fontSize: 16, fontWeight: '700', color: colors.primary, marginBottom: 4 },
});