// controllers/metricasController.js
import db from '../db/db.js';

// 1. Porcentaje de ganancia por producto
export const getPorcentajeGananciaProductos = (req, res) => {
  const sql = `
    SELECT id_producto, nombre, 
           precio_unitario, precio_venta, 
           ROUND(((precio_venta - precio_unitario) / precio_unitario) * 100, 2) AS porcentaje_ganancia
    FROM productos
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener porcentaje de ganancia:', err);
      return res.status(500).json({ error: 'Error al obtener porcentaje de ganancia' });
    }
    res.json(results);
  });
};

// 2. Stock total por categoría
export const getStockPorCategoria = (req, res) => {
  const sql = `
    SELECT c.nombre AS categoria, SUM(p.stock) AS stock_total
    FROM productos p
    JOIN categorias_productos c ON p.id_categoria = c.id_categoria
    GROUP BY c.nombre
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener stock por categoría:', err);
      return res.status(500).json({ error: 'Error al obtener stock por categoría' });
    }
    res.json(results);
  });
};

// 3. Pedidos por estado
export const getPedidosPorEstado = (req, res) => {
  const sql = `
    SELECT estado, COUNT(*) AS cantidad
    FROM pedido
    GROUP BY estado
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener pedidos por estado:', err);
      return res.status(500).json({ error: 'Error al obtener pedidos por estado' });
    }
    res.json(results);
  });
};

// 4. Monto total vendido por producto
export const getVentasPorProducto = (req, res) => {
  const sql = `
    SELECT p.id_producto, p.nombre, SUM(d.subtotal) AS total_vendido
    FROM detalle_pedido d
    JOIN productos p ON d.id_producto = p.id_producto
    GROUP BY p.id_producto, p.nombre
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener ventas por producto:', err);
      return res.status(500).json({ error: 'Error al obtener ventas por producto' });
    }
    res.json(results);
  });
};

// 5. Clientes con más pedidos
export const getClientesConMasPedidos = (req, res) => {
  const sql = `
    SELECT c.id_cliente, c.nombre, COUNT(p.id_pedido) AS total_pedidos
    FROM cliente c
    LEFT JOIN pedido p ON c.id_cliente = p.id_cliente
    GROUP BY c.id_cliente, c.nombre
    ORDER BY total_pedidos DESC
    LIMIT 10
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener clientes con más pedidos:', err);
      return res.status(500).json({ error: 'Error al obtener clientes con más pedidos' });
    }
    res.json(results);
  });
};

// 6. Ganancias obtenidas por mes
export const getGananciasPorMes = (req, res) => {
  const sql = `
    SELECT 
      DATE_FORMAT(p.fecha_creacion, '%Y-%m') AS mes,
      SUM((d.precio_venta - d.precio_unitario) * d.cantidad) AS ganancias
    FROM detalle_pedido d
    JOIN pedido p ON d.id_pedido = p.id_pedido
    WHERE p.estado IN ('finalizado', 'entregado') -- solo considerar pedidos completados
    GROUP BY mes
    ORDER BY mes
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener ganancias por mes:', err);
      return res.status(500).json({ error: 'Error al obtener ganancias por mes' });
    }
    res.json(results);
  });
};
