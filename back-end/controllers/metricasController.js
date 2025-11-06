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

// Total de pedidos, ingresos y egresos
export const getTotalesGenerales = (req, res) => {
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM pedido) AS total_pedidos,
      (SELECT SUM(monto) FROM pagos) AS total_ingresos,
      (SELECT SUM(precio_unitario * cantidad) FROM detalle_pedido) AS total_egresos
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener totales generales:", err);
      return res.status(500).json({ error: "Error al obtener totales" });
    }
    res.json(results[0]);
  });
};


// Egresos por proveedor
export const getEgresosPorProveedor = (req, res) => {
  const sql = `
    SELECT 
      pr.nombre AS proveedor,
      SUM(dp.precio_unitario * dp.cantidad) AS total_egreso
    FROM detalle_pedido dp
    INNER JOIN productos p ON dp.id_producto = p.id_producto
    INNER JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
    GROUP BY pr.nombre
    ORDER BY total_egreso DESC;
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener egresos por proveedor:", err);
      return res.status(500).json({ error: "Error al obtener egresos" });
    }
    res.json(results);
  });
};


// Ingresos por producto
export const getIngresosPorProducto = (req, res) => {
  const sql = `
    SELECT 
      p.nombre AS nombre_producto,
      SUM(dp.precio_venta * dp.cantidad) AS total_ingreso
    FROM detalle_pedido dp
    INNER JOIN productos p ON dp.id_producto = p.id_producto
    GROUP BY p.nombre
    ORDER BY total_ingreso DESC;
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener ingresos por producto:", err);
      return res.status(500).json({ error: "Error al obtener ingresos" });
    }
    res.json(results);
  });
};
