// src/api/apiUsuarios.js
import AppRequest from '../helpers/AppRequest';

const apiUsuarios = {
  // Traer datos del usuario logueado
  getMe: async () => {
    return AppRequest.get('/usuarios/me'); // 🔹 apunta al endpoint /usuarios/me
  },

  // Traer todos los usuarios (si necesitas)
  getAll: async () => {
    return AppRequest.get('/usuarios');
  },

  // Traer un usuario por id
  getById: async (id) => {
    return AppRequest.get(`/usuarios/${id}`);
  },

  // Crear usuario
  create: async (data) => {
    return AppRequest.post('/usuarios', data);
  },

  // Actualizar usuario
  update: async (id, data) => {
    return AppRequest.put(`/usuarios/${id}`, data);
  },

  // Eliminar usuario
  delete: async (id) => {
    return AppRequest.deleteRequest(`/usuarios/${id}`);
  },
};

export default apiUsuarios;
