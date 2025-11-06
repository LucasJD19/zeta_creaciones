import express from 'express';
import db from '../db/db.js';
import { 
   getPedidosActivos,
   getPedidosFinalizados,
   getPedido,
   createPedido,
   deletePedido,
   updatePedido,
   updateEstadoPedido,
   updateCliente,
   updateDetallePedido,
   updatePago
} from '../controllers/pedidoController.js';

const router = express.Router();

/* ===========================
   RUTAS PRINCIPALES CONTROLADAS
=========================== */

// Obtener pedidos activos
router.get('/activos', getPedidosActivos);

// Obtener pedidos finalizados
router.get('/finalizados', getPedidosFinalizados);


// Crear un nuevo pedido
router.post('/', createPedido);

// Eliminar un pedido
router.delete('/:id', deletePedido);

/* ===========================
   RUTAS ESPECÍFICAS CON CONSULTAS DIRECTAS
=========================== */


/* ===========================
   ÚLTIMO: Obtener pedido por ID
=========================== */
router.get('/:id', getPedido);

// Actualizar pedido (fecha, estado, prioridad)
router.put('/:id', updatePedido);

// Actualizar estado del pedido
router.put('/:id/estado', updateEstadoPedido);

// Actualizar cliente del pedido
router.put('/cliente/:id', updateCliente);

// Actualizar detalle del pedido
router.put('/detalle/:id_detalle', updateDetallePedido);

// Actualizar pago del pedido
router.put('/pago/:id_pago', updatePago);


export default router;
