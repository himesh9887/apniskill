import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 6000,
});

api.interceptors.request.use((config) => {
  const rawSession = localStorage.getItem('apniskill_session');

  if (!rawSession) {
    return config;
  }

  try {
    const session = JSON.parse(rawSession);

    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
  } catch (error) {
    console.error('Unable to parse session for API request:', error);
  }

  return config;
});

export function getApiErrorMessage(error, fallbackMessage) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage ||
    'Something went wrong.'
  );
}

export default api;
