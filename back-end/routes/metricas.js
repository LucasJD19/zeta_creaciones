// routes/metricas.js
import express from 'express';
import { 
  getPorcentajeGananciaProductos,
  getPedidosPorEstado,
  getVentasPorProducto,
  getTotalesGenerales,
  getEgresosPorProveedor,
  getIngresosPorProducto,
  getClientesConMasPedidos,
  getGananciasPorMes
} from '../controllers/metricasController.js';

const router = express.Router();

router.get('/ganancia-productos', getPorcentajeGananciaProductos);
router.get('/pedidos-estado', getPedidosPorEstado);
router.get('/ventas-producto', getVentasPorProducto);
router.get('/clientes-top', getClientesConMasPedidos);
router.get('/ganancias-mes', getGananciasPorMes);
router.get('/totales', getTotalesGenerales);
router.get('/egresos', getEgresosPorProveedor);
router.get('/ingresos', getIngresosPorProducto);


export default router;
