// src/helpers/apiPedidos.js
import AppRequest from '../helpers/AppRequest';

const apiPedidos = {
  // Traer todos los pedidos (si agregas la ruta GET /pedidos en backend)
  getAll: () => AppRequest.get('/pedidos'),

  // Traer pedidos activos
  getActivos: () => AppRequest.get('/pedidos/activos'),

  // Traer pedidos finalizados
  getFinalizados: () => AppRequest.get('/pedidos/finalizados'),

  // Traer un pedido por ID
  getById: (id) => AppRequest.get(`/pedidos/${id}`),

  // Traer pedidos por cliente
  getByCliente: (id_cliente) => AppRequest.get(`/pedidos/cliente/${id_cliente}`),

  // Traer pedidos por estado
  getByEstado: (estado) => AppRequest.get(`/pedidos/estado/${estado}`),

  // Crear un pedido
  create: (data) => AppRequest.post('/pedidos', data),

  // Actualizar un pedido
  update: (id, data) => AppRequest.put(`/pedidos/${id}`, data),

  // Eliminar un pedido
  deletePedido: (id) => AppRequest.deleteRequest(`/pedidos/${id}`)
};

export default apiPedidos;
