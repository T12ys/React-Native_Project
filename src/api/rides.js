import client from './client';

export async function getRides(filters = {}) {
  const { data } = await client.get('/rides', { params: filters });
  return data;
}

export async function getRideById(id) {
  const { data } = await client.get(`/rides/${id}`);
  return data;
}

export async function createRide(payload) {
  const { data } = await client.post('/rides', payload);
  return data;
}

export async function bookRide(id, payload) {
  const { data } = await client.post(`/rides/${id}/book`, payload);
  return data;
}

export async function getRideReviews(id) {
  const { data } = await client.get(`/rides/${id}/reviews`);
  return data;
}

export async function addRideReview(id, payload) {
  const { data } = await client.post(`/rides/${id}/reviews`, payload);
  return data;
}