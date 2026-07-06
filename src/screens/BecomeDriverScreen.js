import { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { createDriver, getDriverById } from '../api/drivers';
import { createRide } from '../api/rides';
import { getDriverId, saveDriverId, clearDriverId } from '../storage/userStorage';
import FormField from '../components/FormField';
import { colors } from '../theme/colors';

export default function BecomeDriverScreen() {
  const [driver, setDriver] = useState(null);
  const [initLoading, setInitLoading] = useState(true);

  // форма регистрации водителя
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [registering, setRegistering] = useState(false);

  // форма публикации поездки
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seatsTotal, setSeatsTotal] = useState('');
  const [pricePerSeat, setPricePerSeat] = useState('');
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const id = await getDriverId();
        if (id) {
          const data = await getDriverById(id);
          setDriver(data);
        }
      } catch (e) {
        await clearDriverId();
      } finally {
        setInitLoading(false);
      }
    })();
  }, []);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !city.trim() || !vehicleModel.trim()) {
      Alert.alert('Заполните поля', 'Имя, email, город и модель авто обязательны.');
      return;
    }
    try {
      setRegistering(true);
      const created = await createDriver({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        vehicleModel: vehicleModel.trim(),
        vehiclePlate: vehiclePlate.trim(),
      });
      await saveDriverId(created.id);
      setDriver(created);
    } catch (e) {
      Alert.alert('Ошибка', e.response?.data?.error || 'Не удалось зарегистрироваться.');
    } finally {
      setRegistering(false);
    }
  };

  const handlePublish = async () => {
    if (!origin.trim() || !destination.trim() || !date.trim() || !time.trim() || !seatsTotal.trim() || !pricePerSeat.trim()) {
      Alert.alert('Заполните поля', 'Все поля поездки обязательны.');
      return;
    }
    const seats = Number(seatsTotal);
    const price = Number(pricePerSeat);
    if (!seats || seats < 1) {
      Alert.alert('Проверьте мест', 'Число мест должно быть больше нуля.');
      return;
    }
    if (Number.isNaN(price) || price < 0) {
      Alert.alert('Проверьте цену', 'Цена должна быть числом.');
      return;
    }
    try {
      setPublishing(true);
      await createRide({
        driverId: driver.id,
        origin: origin.trim(),
        destination: destination.trim(),
        date: date.trim(),
        time: time.trim(),
        seatsTotal: seats,
        pricePerSeat: price,
      });
      Alert.alert('Готово', 'Поездка опубликована! Она появилась в списке «Поиск».');
      setOrigin(''); setDestination(''); setDate(''); setTime(''); setSeatsTotal(''); setPricePerSeat('');
    } catch (e) {
      Alert.alert('Ошибка', e.response?.data?.error || 'Не удалось опубликовать поездку.');
    } finally {
      setPublishing(false);
    }
  };

  const handleSwitchDriver = () => {
    Alert.alert('Сменить водителя?', 'Текущий профиль будет забыт на этом устройстве (в базе он останется).', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Сменить', style: 'destructive', onPress: async () => { await clearDriverId(); setDriver(null); } },
    ]);
  };

  if (initLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {!driver ? (
          // регистрация водителя
          <View>
            <Text style={styles.title}>Регистрация водителя</Text>
            <Text style={styles.subtitle}>Зарегистрируйтесь, чтобы публиковать поездки.</Text>
            <FormField label="Имя" value={name} onChangeText={setName} placeholder="Иван" />
            <FormField label="Email" value={email} onChangeText={setEmail} placeholder="ivan@mail.com" keyboardType="email-address" />
            <FormField label="Телефон" value={phone} onChangeText={setPhone} placeholder="+994..." keyboardType="phone-pad" />
            <FormField label="Город" value={city} onChangeText={setCity} placeholder="Baku" />
            <FormField label="Модель авто" value={vehicleModel} onChangeText={setVehicleModel} placeholder="Hyundai Elantra" />
            <FormField label="Гос. номер" value={vehiclePlate} onChangeText={setVehiclePlate} placeholder="10-AA-101" />
            <TouchableOpacity style={[styles.button, registering && styles.disabled]} onPress={handleRegister} disabled={registering} activeOpacity={0.8}>
              <Text style={styles.buttonText}>{registering ? 'Регистрируем...' : 'Зарегистрироваться'}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          //публикация поездки
          <View>
            <View style={styles.driverBar}>
              <Text style={styles.driverName}>Вы водитель: {driver.name}</Text>
              <TouchableOpacity onPress={handleSwitchDriver}>
                <Text style={styles.switch}>Сменить</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>Опубликовать поездку</Text>
            <FormField label="Откуда" value={origin} onChangeText={setOrigin} placeholder="28 May" />
            <FormField label="Куда" value={destination} onChangeText={setDestination} placeholder="Nizami Metro" />
            <FormField label="Дата (ГГГГ-ММ-ДД)" value={date} onChangeText={setDate} placeholder="2026-07-10" />
            <FormField label="Время (ЧЧ:ММ)" value={time} onChangeText={setTime} placeholder="08:30" />
            <FormField label="Всего мест" value={seatsTotal} onChangeText={setSeatsTotal} placeholder="3" keyboardType="number-pad" />
            <FormField label="Цена за место (AZN)" value={pricePerSeat} onChangeText={setPricePerSeat} placeholder="5" keyboardType="decimal-pad" />
            <TouchableOpacity style={[styles.button, publishing && styles.disabled]} onPress={handlePublish} disabled={publishing} activeOpacity={0.8}>
              <Text style={styles.buttonText}>{publishing ? 'Публикуем...' : 'Опубликовать поездку'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 16 },
  button: { backgroundColor: colors.primary, borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  disabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  driverBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#eef6f0', borderRadius: 10, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  driverName: { fontSize: 15, fontWeight: '600', color: colors.primaryDark },
  switch: { fontSize: 14, color: colors.danger, fontWeight: '600' },
});