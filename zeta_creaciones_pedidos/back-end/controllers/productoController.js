import db from '../db/db.js';

export const getProductos = (req, res) => {
  const sql = `
    SELECT p.*, pr.nombre as nombre_proveedor 
    FROM productos p
    LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener productos:', err);
      return res.status(500).json({ error: 'Error al obtener productos' });
    }
    res.json(results);
  });
};

export const getProducto = (req, res) => {
  const sql = `
    SELECT p.*, pr.nombre as nombre_proveedor 
    FROM productos p
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

export const createProducto = (req, res) => {
  const { id_proveedor, nombre, descripcion, precio, stock } = req.body;

  if (!nombre || !precio) {
    return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
  }

  const sql = 'INSERT INTO productos (id_proveedor, nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?, ?)';
  
  db.query(sql, [id_proveedor, nombre, descripcion, precio, stock || 0], (err, result) => {
    if (err) {
      console.error('Error al crear producto:', err);
      return res.status(500).json({ error: 'Error al crear producto' });
    }
    
    res.status(201).json({
      id_producto: result.insertId,
      id_proveedor,
      nombre,
      descripcion,
      precio,
      stock: stock || 0
    });
  });
};

export const updateProducto = (req, res) => {
  const { id_proveedor, nombre, descripcion, precio, stock } = req.body;
  const updates = [];
  const values = [];

  if (id_proveedor !== undefined) {
    updates.push('id_proveedor = ?');
    values.push(id_proveedor);
  }
  if (nombre) {
    updates.push('nombre = ?');
    values.push(nombre);
  }
  if (descripcion !== undefined) {
    updates.push('descripcion = ?');
    values.push(descripcion);
  }
  if (precio !== undefined) {
    updates.push('precio = ?');
    values.push(precio);
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