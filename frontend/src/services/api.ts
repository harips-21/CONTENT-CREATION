import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add Auth Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ai_studio_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on 401 unauth response
      localStorage.removeItem('ai_studio_token');
      localStorage.removeItem('ai_studio_user');
    }
    return Promise.reject(error);
  }
);

export default api;
