// Forced rebuild for API URL update
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://full-stack-java---hostel-management.onrender.com/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hostel_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
