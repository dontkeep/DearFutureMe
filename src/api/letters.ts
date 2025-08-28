import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export function sendLetter(payload: { email: string; body: string; deliverAt: string }) {
  return api.post('/letters', payload);
}