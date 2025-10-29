// src/api/apiProveedores.js
import AppRequest from '../helpers/AppRequest';

const apiProveedores = {
  getAll: () => AppRequest.get('/proveedores'),
  getById: (id) => AppRequest.get(`/proveedores/${id}`),
  create: (data) => AppRequest.post('/proveedores', data),
  update: (id, data) => AppRequest.put(`/proveedores/${id}`, data),
  delete: (id) => AppRequest.deleteRequest(`/proveedores/${id}`),
};

export default apiProveedores;
