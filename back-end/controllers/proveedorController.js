import db from '../db/db.js';

export const getProveedores = (req, res) => {
  const sql = 'SELECT * FROM proveedores';
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener proveedores:', err);
      return res.status(500).json({ error: 'Error al obtener proveedores' });
    }
    res.json(results);
  });
};

export const getProveedor = (req, res) => {
  const sql = 'SELECT * FROM proveedores WHERE id_proveedor = ?';
  
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error al obtener proveedor:', err);
      return res.status(500).json({ error: 'Error al obtener proveedor' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.json(results[0]);
  });
};

export const createProveedor = (req, res) => {
  const { nombre, contacto, telefono, email, direccion } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre es obligatorio' });
  }

  const sql = 'INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)';
  
  db.query(sql, [nombre, contacto, telefono, email, direccion], (err, result) => {
    if (err) {
      console.error('Error al crear proveedor:', err);
      return res.status(500).json({ error: 'Error al crear proveedor' });
    }
    
    res.status(201).json({
      id_proveedor: result.insertId,
      nombre,
      contacto,
      telefono,
      email,
      direccion
    });
  });
};

export const updateProveedor = (req, res) => {
  const { nombre, contacto, telefono, email, direccion } = req.body;
  const updates = [];
  const values = [];

  if (nombre) {
    updates.push('nombre = ?');
    values.push(nombre);
  }
  if (contacto !== undefined) {
    updates.push('contacto = ?');
    values.push(contacto);
  }
  if (telefono !== undefined) {
    updates.push('telefono = ?');
    values.push(telefono);
  }
  if (email !== undefined) {
    updates.push('email = ?');
    values.push(email);
  }
  if (direccion !== undefined) {
    updates.push('direccion = ?');
    values.push(direccion);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No hay datos para actualizar' });
  }

  values.push(req.params.id);
  const sql = `UPDATE proveedores SET ${updates.join(', ')} WHERE id_proveedor = ?`;

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al actualizar proveedor:', err);
      return res.status(500).json({ error: 'Error al actualizar proveedor' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.json({ message: 'Proveedor actualizado correctamente' });
  });
};

export const deleteProveedor = (req, res) => {
  const sql = 'DELETE FROM proveedores WHERE id_proveedor = ?';
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error al eliminar proveedor:', err);
      return res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.status(204).send();
  });
};