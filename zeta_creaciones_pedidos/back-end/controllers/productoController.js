import db from '../db/db.js';

// Obtener productos con categoría y proveedor
export const getProductosConCategorias = (req, res) => {
  const sql = `
    SELECT 
       p.id_producto,
       p.nombre,
       p.precio_unitario,
       p.precio_venta,
       p.stock,
       c.id_categoria,
       c.nombre AS categoria_nombre,
       pr.id_proveedor,
       pr.nombre AS proveedor_nombre
     FROM productos p
     LEFT JOIN categorias_productos c ON p.id_categoria = c.id_categoria
     LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
     ORDER BY p.precio_unitario ASC;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener productos con categorías:', err);
      return res.status(500).json({ error: 'Error al obtener productos' });
    }
    res.json(results);
  });
};

// Obtener un producto por ID
export const getProducto = (req, res) => {
  const sql = `
    SELECT 
      p.id_producto,
      p.nombre,
      p.precio_unitario,
      p.precio_venta,
      p.stock,
      c.nombre AS categoria_nombre,
      pr.nombre AS proveedor_nombre
    FROM productos p
    LEFT JOIN categorias_productos c ON p.id_categoria = c.id_categoria
    LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
    WHERE p.id_producto = ?
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error al obtener producto:', err);
      return res.status(500).json({ error: 'Error al obtener producto' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(results[0]);
  });
};

// Crear producto
export const createProducto = (req, res) => {
  const { id_proveedor, id_categoria, nombre, precio_unitario, precio_venta, stock } = req.body;

  if (!nombre || precio_unitario === undefined || precio_venta === undefined) {
    return res.status(400).json({ error: 'Nombre, precio unitario y precio de venta son obligatorios' });
  }

  const sql = `
    INSERT INTO productos (id_proveedor, id_categoria, nombre, precio_unitario, precio_venta, stock)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [id_proveedor || null, id_categoria || null, nombre, precio_unitario, precio_venta, stock || 0], (err, result) => {
    if (err) {
      console.error('Error al crear producto:', err);
      return res.status(500).json({ error: 'Error al crear producto' });
    }

    res.status(201).json({
      id_producto: result.insertId,
      id_proveedor: id_proveedor || null,
      id_categoria: id_categoria || null,
      nombre,
      precio_unitario,
      precio_venta,
      stock: stock || 0
    });
  });
};

// Actualizar producto
export const updateProducto = (req, res) => {
  const { id_proveedor, id_categoria, nombre, precio_unitario, precio_venta, stock } = req.body;
  const updates = [];
  const values = [];

  if (id_proveedor !== undefined) {
    updates.push('id_proveedor = ?');
    values.push(id_proveedor);
  }
  if (id_categoria !== undefined) {
    updates.push('id_categoria = ?');
    values.push(id_categoria);
  }
  if (nombre) {
    updates.push('nombre = ?');
    values.push(nombre);
  }
  if (precio_unitario !== undefined) {
    updates.push('precio_unitario = ?');
    values.push(precio_unitario);
  }
  if (precio_venta !== undefined) {
    updates.push('precio_venta = ?');
    values.push(precio_venta);
  }
  if (stock !== undefined) {
    updates.push('stock = ?');
    values.push(stock);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No hay datos para actualizar' });
  }

  values.push(req.params.id);
  const sql = `UPDATE productos SET ${updates.join(', ')} WHERE id_producto = ?`;

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al actualizar producto:', err);
      return res.status(500).json({ error: 'Error al actualizar producto' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto actualizado correctamente' });
  });
};

// Eliminar producto
export const deleteProducto = (req, res) => {
  const sql = 'DELETE FROM productos WHERE id_producto = ?';

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error al eliminar producto:', err);
      return res.status(500).json({ error: 'Error al eliminar producto' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(204).send();
  });
};

// Obtener todas las categorías
export const getCategorias = (req, res) => {
  const sql = 'SELECT id_categoria, nombre FROM categorias_productos ORDER BY nombre ASC';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener categorías:', err);
      return res.status(500).json({ error: 'Error al obtener categorías' });
    }
    res.json(results);
  });
};

