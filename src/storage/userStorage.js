import AsyncStorage from '@react-native-async-storage/async-storage';

const RIDER_EMAIL_KEY = 'rider_email';
const DRIVER_ID_KEY = 'driver_id';

export async function saveRiderEmail(email) {
  await AsyncStorage.setItem(RIDER_EMAIL_KEY, email);
}

export async function getRiderEmail() {
  return AsyncStorage.getItem(RIDER_EMAIL_KEY);
}

export async function saveDriverId(id) {
  await AsyncStorage.setItem(DRIVER_ID_KEY, id);
}

export async function getDriverId() {
  return AsyncStorage.getItem(DRIVER_ID_KEY);
}

export async function clearDriverId() {
  await AsyncStorage.removeItem(DRIVER_ID_KEY);
}