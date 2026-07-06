import client from './client';

export async function getStats() {
  const { data } = await client.get('/stats');
  return data;
}