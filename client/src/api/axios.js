import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor: dynamically inject stored JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('timetrade_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized / expired tokens centrally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If 401 is returned on a protected route, remove token and dispatch custom event
      localStorage.removeItem('timetrade_token');
      localStorage.removeItem('timetrade_user');
      window.dispatchEvent(new Event('timetrade_auth_logout'));
    }
    return Promise.reject(error);
  }
);

export default api;
