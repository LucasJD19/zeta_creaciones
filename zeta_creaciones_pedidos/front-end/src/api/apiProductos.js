import AppRequest from '../helpers/AppRequest';

const apiProductos = {
  getAll: () => AppRequest.get('/productos'),
  getById: (id) => AppRequest.get(`/productos/${id}`),
  create: (data) => AppRequest.post('/productos', data),
  update: (id, data) => AppRequest.put(`/productos/${id}`, data),
  delete: (id) => AppRequest.deleteRequest(`/productos/${id}`),

  // Nuevos métodos
  getCategorias: () => AppRequest.get('/productos/categorias'),
  getByCategoria: (id_categoria) => AppRequest.get(`/productos/categoria/${id_categoria}`)
};

export default apiProductos;
