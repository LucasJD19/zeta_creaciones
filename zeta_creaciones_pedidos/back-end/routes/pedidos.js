import express from 'express';
import db from '../db/db.js';
import { 
  getPedidos, 
  getPedido, 
  createPedido, 
  updatePedido, 
  deletePedido 
} from '../controllers/pedidoController.js';

const router = express.Router();

// Obtener todos los pedidos
router.get('/', getPedidos);

// Obtener un pedido específico
router.get('/:id', getPedido);

// Crear nuevo pedido
router.post('/', createPedido);

// Actualizar pedido existente
router.put('/:id', updatePedido);

// Eliminar pedido
router.delete('/:id', deletePedido);

// Obtener pedidos por cliente
router.get('/cliente/:id_cliente', (req, res) => {
  const sql = `
    SELECT 
      p.id_pedido,
      p.fecha_estimada,
      p.estado,
      p.prioridad,
      p.fecha_creacion,
      c.nombre as cliente_nombre,
      c.direccion as cliente_direccion,
      c.telefono as cliente_telefono,
      c.dni as cliente_dni,
      dp.id_detalle,
      dp.cantidad,
      dp.precio_unitario,
      dp.subtotal,
      pr.nombre as producto_nombre
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

    // Organizamos los resultados para agrupar los detalles por pedido
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
      c.nombre as cliente_nombre,
      c.direccion as cliente_direccion,
      c.telefono as cliente_telefono,
      c.dni as cliente_dni,
      dp.id_detalle,
      dp.cantidad,
      dp.precio_unitario,
      dp.subtotal,
      pr.nombre as producto_nombre
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

export default router;
