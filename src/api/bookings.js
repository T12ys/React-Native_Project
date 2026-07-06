import client from './client';

export async function getBookings(filters = {}) {
  const { data } = await client.get('/bookings', { params: filters });
  return data;
}

export async function updateBookingStatus(id, status) {
  const { data } = await client.patch(`/bookings/${id}/status`, { status });
  return data;
}