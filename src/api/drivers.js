import client from './client';

export async function createDriver(payload) {
  const { data } = await client.post('/drivers', payload);
  return data;
}

export async function getDriverById(id) {
  const { data } = await client.get(`/drivers/${id}`);
  return data;
}