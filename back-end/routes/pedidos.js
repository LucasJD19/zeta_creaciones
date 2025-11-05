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

// Obtener pedidos por cliente
router.get('/cliente/:id_cliente', (req, res) => {
  const sql = `
    SELECT 
      p.id_pedido,
      p.fecha_estimada,
      p.estado,
      p.prioridad,
      p.fecha_creacion,
      c.nombre AS cliente_nombre,
      c.direccion AS cliente_direccion,
      c.telefono AS cliente_telefono,
      c.dni AS cliente_dni,
      dp.id_detalle,
      dp.cantidad,
      dp.precio_unitario,
      dp.subtotal,
      pr.nombre AS producto_nombre
    FROM pedido p
    INNER JOIN cliente c ON p.id_cliente = c.id_cliente
    LEFT JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
    LEFT JOIN productos pr ON dp.id_producto = pr.id_producto
    WHERE p.id_cliente = ?
    ORDER BY p.fecha_creacion DESC
  `;

  db.query(sql, [req.params.id_cliente], (err, results) => {
    if (err) {
      console.error('Error al obtener pedidos del cliente:', err);
      return res.status(500).json({ error: 'Error al obtener pedidos del cliente' });
    }

    const pedidosMap = new Map();
    results.forEach(row => {
      if (!pedidosMap.has(row.id_pedido)) {
        pedidosMap.set(row.id_pedido, {
          id_pedido: row.id_pedido,
          fecha_estimada: row.fecha_estimada,
          estado: row.estado,
          prioridad: row.prioridad,
          fecha_creacion: row.fecha_creacion,
          cliente: {
            nombre: row.cliente_nombre,
            direccion: row.cliente_direccion,
            telefono: row.cliente_telefono,
            dni: row.cliente_dni
          },
          detalles: []
        });
      }
      if (row.id_detalle) {
        pedidosMap.get(row.id_pedido).detalles.push({
          id_detalle: row.id_detalle,
          producto_nombre: row.producto_nombre,
          cantidad: row.cantidad,
          precio_unitario: row.precio_unitario,
          subtotal: row.subtotal
        });
      }
    });

    res.json(Array.from(pedidosMap.values()));
  });
});

// Buscar pedidos por estado
router.get('/estado/:estado', (req, res) => {
  const sql = `
    SELECT 
      p.id_pedido,
      p.fecha_estimada,
      p.estado,
      p.prioridad,
      p.fecha_creacion,
      c.nombre AS cliente_nombre,
      c.direccion AS cliente_direccion,
      c.telefono AS cliente_telefono,
      c.dni AS cliente_dni,
      dp.id_detalle,
      dp.cantidad,
      dp.precio_unitario,
      dp.subtotal,
      pr.nombre AS producto_nombre
    FROM pedido p
    INNER JOIN cliente c ON p.id_cliente = c.id_cliente
    LEFT JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
    LEFT JOIN productos pr ON dp.id_producto = pr.id_producto
    WHERE p.estado = ?
    ORDER BY p.fecha_creacion DESC
  `;

  db.query(sql, [req.params.estado], (err, results) => {
    if (err) {
      console.error('Error al obtener pedidos por estado:', err);
      return res.status(500).json({ error: 'Error al obtener pedidos por estado' });
    }

    const pedidosMap = new Map();
    results.forEach(row => {
      if (!pedidosMap.has(row.id_pedido)) {
        pedidosMap.set(row.id_pedido, {
          id_pedido: row.id_pedido,
          fecha_estimada: row.fecha_estimada,
          estado: row.estado,
          prioridad: row.prioridad,
          fecha_creacion: row.fecha_creacion,
          cliente: {
            nombre: row.cliente_nombre,
            direccion: row.cliente_direccion,
            telefono: row.cliente_telefono,
            dni: row.cliente_dni
          },
          detalles: []
        });
      }
      if (row.id_detalle) {
        pedidosMap.get(row.id_pedido).detalles.push({
          id_detalle: row.id_detalle,
          producto_nombre: row.producto_nombre,
          cantidad: row.cantidad,
          precio_unitario: row.precio_unitario,
          subtotal: row.subtotal
        });
      }
    });

    res.json(Array.from(pedidosMap.values()));
  });
});

/* ===========================
   ÚLTIMO: Obtener pedido por ID
=========================== */
router.get('/:id', getPedido);

// Actualizar solo el estado del pedido
router.put('/:id/estado', updateEstadoPedido);

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
