// src/api/apiClientes.js
import AppRequest from "../helpers/AppRequest";


const apiClientes = {
  getAll: () => AppRequest.get('/clientes'),
  getById: (id) => AppRequest.get(`/clientes/${id}`),
  create: (data) => AppRequest.post('/clientes', data),
  update: (id, data) => AppRequest.put(`/clientes/${id}`, data),
  delete: (id) => AppRequest.deleteRequest(`/clientes/${id}`)
};

export default apiClientes;
