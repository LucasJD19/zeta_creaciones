import db from '../db/db.js';

export const getClientes = (req, res) => {
  const sql = 'SELECT * FROM cliente';
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener clientes:', err);
      return res.status(500).json({ error: 'Error al obtener clientes' });
    }
    res.json(results);
  });
};

export const getCliente = (req, res) => {
  const sql = 'SELECT * FROM cliente WHERE id_cliente = ?';
  
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error al obtener cliente:', err);
      return res.status(500).json({ error: 'Error al obtener cliente' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(results[0]);
  });
};

export const createCliente = (req, res) => {
  const { nombre, direccion, telefono, dni } = req.body;

  if (!nombre || !dni) {
    return res.status(400).json({ error: 'Nombre y DNI son obligatorios' });
  }

  const sql = 'INSERT INTO cliente (nombre, direccion, telefono, dni) VALUES (?, ?, ?, ?)';
  
  db.query(sql, [nombre, direccion, telefono, dni], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Ya existe un cliente con ese DNI' });
      }
      console.error('Error al crear cliente:', err);
      return res.status(500).json({ error: 'Error al crear cliente' });
    }
    
    res.status(201).json({
      id_cliente: result.insertId,
      nombre,
      direccion,
      telefono,
      dni
    });
  });
};

export const updateCliente = (req, res) => {
  const { nombre, direccion, telefono, dni } = req.body;
  const updates = [];
  const values = [];

  if (nombre) {
    updates.push('nombre = ?');
    values.push(nombre);
  }
  if (direccion !== undefined) {
    updates.push('direccion = ?');
    values.push(direccion);
  }
  if (telefono !== undefined) {
    updates.push('telefono = ?');
    values.push(telefono);
  }
  if (dni) {
    updates.push('dni = ?');
    values.push(dni);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No hay datos para actualizar' });
  }

  values.push(req.params.id);
  const sql = `UPDATE cliente SET ${updates.join(', ')} WHERE id_cliente = ?`;

  db.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Ya existe un cliente con ese DNI' });
      }
      console.error('Error al actualizar cliente:', err);
      return res.status(500).json({ error: 'Error al actualizar cliente' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente actualizado correctamente' });
  });
};

export const deleteCliente = (req, res) => {
  const sql = 'DELETE FROM cliente WHERE id_cliente = ?';
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error al eliminar cliente:', err);
      return res.status(500).json({ error: 'Error al eliminar cliente' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.status(204).send();
  });
};