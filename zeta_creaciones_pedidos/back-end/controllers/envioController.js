import db from '../db/db.js';

export const getEnvios = (req, res) => {
  const sql = `
    SELECT e.*, p.fecha_estimada as fecha_pedido, c.nombre as cliente_nombre
    FROM envios e
    INNER JOIN pedido p ON e.id_pedido = p.id_pedido
    INNER JOIN cliente c ON p.id_cliente = c.id_cliente
    ORDER BY e.fecha_envio DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener envíos:', err);
      return res.status(500).json({ error: 'Error al obtener envíos' });
    }
    res.json(results);
  });
};

export const getEnvio = (req, res) => {
  const sql = `
    SELECT e.*, p.fecha_estimada as fecha_pedido, c.nombre as cliente_nombre
    FROM envios e
    INNER JOIN pedido p ON e.id_pedido = p.id_pedido
    INNER JOIN cliente c ON p.id_cliente = c.id_cliente
    WHERE e.id_envio = ?
  `;
  
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error al obtener envío:', err);
      return res.status(500).json({ error: 'Error al obtener envío' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Envío no encontrado' });
    }
    res.json(results[0]);
  });
};

export const createEnvio = (req, res) => {
  const { id_pedido, direccion_envio, fecha_envio, estado } = req.body;

  if (!id_pedido || !direccion_envio) {
    return res.status(400).json({ error: 'id_pedido y direccion_envio son obligatorios' });
  }

  const sql = 'INSERT INTO envios (id_pedido, direccion_envio, fecha_envio, estado) VALUES (?, ?, ?, ?)';
  
  db.query(sql, [id_pedido, direccion_envio, fecha_envio, estado || 'pendiente'], (err, result) => {
    if (err) {
      console.error('Error al crear envío:', err);
      return res.status(500).json({ error: 'Error al crear envío' });
    }
    
    res.status(201).json({
      id_envio: result.insertId,
      id_pedido,
      direccion_envio,
      fecha_envio,
      estado: estado || 'pendiente'
    });
  });
};

export const updateEnvio = (req, res) => {
  const { direccion_envio, fecha_envio, estado } = req.body;
  const updates = [];
  const values = [];

  if (direccion_envio) {
    updates.push('direccion_envio = ?');
    values.push(direccion_envio);
  }
  if (fecha_envio) {
    updates.push('fecha_envio = ?');
    values.push(fecha_envio);
  }
  if (estado) {
    updates.push('estado = ?');
    values.push(estado);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No hay datos para actualizar' });
  }

  values.push(req.params.id);
  const sql = `UPDATE envios SET ${updates.join(', ')} WHERE id_envio = ?`;

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al actualizar envío:', err);
      return res.status(500).json({ error: 'Error al actualizar envío' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Envío no encontrado' });
    }
    res.json({ message: 'Envío actualizado correctamente' });
  });
};

export const deleteEnvio = (req, res) => {
  const sql = 'DELETE FROM envios WHERE id_envio = ?';
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error al eliminar envío:', err);
      return res.status(500).json({ error: 'Error al eliminar envío' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Envío no encontrado' });
    }
    res.status(204).send();
  });
};