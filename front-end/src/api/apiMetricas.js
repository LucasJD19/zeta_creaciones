// src/helpers/apiMetricas.js
import AppRequest from "../helpers/AppRequest";

const MetricAPI = {
  // Porcentaje de ganancia por producto
  getGananciaProductos: () => AppRequest.get('/metricas/ganancia-productos'),

  // Pedidos por estado
  getPedidosEstado: () => AppRequest.get('/metricas/pedidos-estado'),

  // Ventas totales por producto
  getVentasProducto: () => AppRequest.get('/metricas/ventas-producto'),

  // Clientes con más pedidos
  getClientesTop: () => AppRequest.get('/metricas/clientes-top'),

  // Ganancias obtenidas por mes
  getGananciasMes: () => AppRequest.get('/metricas/ganancias-mes'),

  getTotales: () => AppRequest.get('/metricas/totales'),

  getIngresos: () => AppRequest.get('/metricas/ingresos'),

  getEgresos: () => AppRequest.get('/metricas/egresos'),
};
export default MetricAPI;
