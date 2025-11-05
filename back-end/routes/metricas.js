// routes/metricas.js
import express from 'express';
import { 
  getPorcentajeGananciaProductos,
  getStockPorCategoria,
  getPedidosPorEstado,
  getVentasPorProducto,
  getClientesConMasPedidos,
  getGananciasPorMes
} from '../controllers/metricasController.js';

const router = express.Router();

router.get('/ganancia-productos', getPorcentajeGananciaProductos);
router.get('/stock-categoria', getStockPorCategoria);
router.get('/pedidos-estado', getPedidosPorEstado);
router.get('/ventas-producto', getVentasPorProducto);
router.get('/clientes-top', getClientesConMasPedidos);
router.get('/ganancias-mes', getGananciasPorMes);


export default router;
