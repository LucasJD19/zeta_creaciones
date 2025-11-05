// src/helpers/apiPedidos.js
import AppRequest from '../helpers/AppRequest';

const apiPedidos = {
  // === GET ===
  getActivos: () => AppRequest.get('/pedidos/activos'),
  getFinalizados: () => AppRequest.get('/pedidos/finalizados'),
  getById: (id) => AppRequest.get(`/pedidos/${id}`),

  // === POST ===
  create: (data) => AppRequest.post('/pedidos', data),

  // === PUT ===
  update: (id, data) => AppRequest.put(`/pedidos/${id}`, data),
  updateEstado: (id, estado) => AppRequest.put(`/pedidos/${id}/estado`, { estado }),
  updateCliente: (id, data) => AppRequest.put(`/pedidos/cliente/${id}`, data),
  updateDetalle: (id_detalle, data) => AppRequest.put(`/pedidos/detalle/${id_detalle}`, data),
  updatePago: (id_pago, data) => AppRequest.put(`/pedidos/pago/${id_pago}`, data),

  // === DELETE ===
  deletePedido: (id) => AppRequest.deleteRequest(`/pedidos/${id}`)
};

export default apiPedidos;
