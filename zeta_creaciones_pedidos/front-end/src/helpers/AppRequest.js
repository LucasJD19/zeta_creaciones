import axios from 'axios';

const API_BASE = 'http://localhost:3001';

// Crear instancia de axios con configuración base
const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const AppRequest = {
  // Método para establecer el token de autenticación
  setAuthToken: (token) => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common['Authorization'];
    }
  },
  
  // Métodos HTTP básicos
  get: async (endpoint) => {
    try {
      const res = await axiosInstance.get(endpoint);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  put: async (endpoint, data) => {
    try {
      const res = await axiosInstance.put(endpoint, data);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  post: async (endpoint, data) => {
    try {
      const res = await axiosInstance.post(endpoint, data);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  deleteRequest: async (endpoint) => {
    try {
      const res = await axiosInstance.delete(endpoint);
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  updateEstadoPedido: async (id, estado) => {
    return await AppRequest.put(`/pedidos/${id}`, { estado });
  },

  // Autenticación
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
        AppRequest.setAuthToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    AppRequest.setAuthToken(null);
  },

  // Verificar el estado de autenticación
  verificarAuth: () => {
    const token = localStorage.getItem('token');
    if (token) {
      AppRequest.setAuthToken(token);
      return true;
    }
    return false;
  },

  // Read all orders
  getPedidos: async () => {
    try {
      const response = await axiosInstance.get('/pedidos');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new order
  crearPedido: async (pedidoData) => {
    try {
      const response = await axiosInstance.post('/pedidos', pedidoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete an order
  deletePedido: async (id) => {
    try {
      const response = await axiosInstance.delete(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update an order
  updatePedido: async (id, pedidoData) => {
    try {
      const response = await axiosInstance.put(`/pedidos/${id}`, pedidoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default AppRequest;
