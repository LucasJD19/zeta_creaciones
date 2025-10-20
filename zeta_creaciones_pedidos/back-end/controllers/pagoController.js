import db from '../db/db.js';

export const getPagos = (req, res) => {
  const sql = `
    SELECT p.*, pe.fecha_estimada as fecha_pedido
    FROM pagos p
    INNER JOIN pedido pe ON p.id_pedido = pe.id_pedido
    ORDER BY p.fecha_pago DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener pagos:', err);
      return res.status(500).json({ error: 'Error al obtener pagos' });
    }
    res.json(results);
  });
};

export const getPago = (req, res) => {
  const sql = `
    SELECT p.*, pe.fecha_estimada as fecha_pedido
    FROM pagos p
    INNER JOIN pedido pe ON p.id_pedido = pe.id_pedido
    WHERE p.id_pago = ?
  `;
  
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error al obtener pago:', err);
      return res.status(500).json({ error: 'Error al obtener pago' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }
    res.json(results[0]);
  });
};

export const createPago = (req, res) => {
  const { id_pedido, metodo, monto } = req.body;

  if (!id_pedido || !metodo || !monto) {
    return res.status(400).json({ error: 'id_pedido, metodo y monto son obligatorios' });
  }

  const sql = 'INSERT INTO pagos (id_pedido, metodo, monto) VALUES (?, ?, ?)';
  
  db.query(sql, [id_pedido, metodo, monto], (err, result) => {
    if (err) {
      console.error('Error al crear pago:', err);
      return res.status(500).json({ error: 'Error al crear pago' });
    }
    
    res.status(201).json({
      id_pago: result.insertId,
      id_pedido,
      metodo,
      monto,
      fecha_pago: new Date()
    });
  });
};

export const updatePago = (req, res) => {
  const { metodo, monto } = req.body;
  const updates = [];
  const values = [];

  if (metodo) {
    updates.push('metodo = ?');
    values.push(metodo);
  }
  if (monto !== undefined) {
    updates.push('monto = ?');
    values.push(monto);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No hay datos para actualizar' });
  }

  values.push(req.params.id);
  const sql = `UPDATE pagos SET ${updates.join(', ')} WHERE id_pago = ?`;

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al actualizar pago:', err);
      return res.status(500).json({ error: 'Error al actualizar pago' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }
    res.json({ message: 'Pago actualizado correctamente' });
  });
};

export const deletePago = (req, res) => {
  const sql = 'DELETE FROM pagos WHERE id_pago = ?';
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error al eliminar pago:', err);
      return res.status(500).json({ error: 'Error al eliminar pago' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }
    res.status(204).send();
  });
};