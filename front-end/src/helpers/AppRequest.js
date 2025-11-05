// src/helpers/AppRequest.js
import axios from 'axios';

const API_BASE = 'http://localhost:3001';

// Crear instancia base
const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: agrega token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor: manejo de errores
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Métodos normalizados
const AppRequest = {
  get: (endpoint) => axiosInstance.get(endpoint).then((res) => res.data),
  post: (endpoint, data) => axiosInstance.post(endpoint, data).then((res) => res.data),
  put: (endpoint, data) => axiosInstance.put(endpoint, data).then((res) => res.data),
  deleteRequest: (endpoint) => axiosInstance.delete(endpoint).then((res) => res.data),

  setAuthToken: (token) => {
    if (token) axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axiosInstance.defaults.headers.common['Authorization'];
  },

  login: async (credentials) => {
    const res = await axiosInstance.post('/auth/login', credentials);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
      AppRequest.setAuthToken(res.data.token);
    }
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    AppRequest.setAuthToken(null);
  },

  verificarAuth: () => {
    const token = localStorage.getItem('token');
    if (token) {
      AppRequest.setAuthToken(token);
      return true;
    }
    return false;
  },
};

export default AppRequest;
