import db from '../db/db.js';

export const getPedidos = (req, res) => {
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
    ORDER BY p.fecha_creacion DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener pedidos:', err);
      return res.status(500).json({ error: 'Error al obtener pedidos' });
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
};

export const getPedido = (req, res) => {
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
    WHERE p.id_pedido = ?
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error al obtener pedido:', err);
      return res.status(500).json({ error: 'Error al obtener pedido' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // Organizamos el resultado
    const pedido = {
      id_pedido: results[0].id_pedido,
      fecha_estimada: results[0].fecha_estimada,
      estado: results[0].estado,
      prioridad: results[0].prioridad,
      fecha_creacion: results[0].fecha_creacion,
      cliente: {
        nombre: results[0].cliente_nombre,
        direccion: results[0].cliente_direccion,
        telefono: results[0].cliente_telefono,
        dni: results[0].cliente_dni
      },
      detalles: results[0].id_detalle ? results.map(row => ({
        id_detalle: row.id_detalle,
        producto_nombre: row.producto_nombre,
        cantidad: row.cantidad,
        precio_unitario: row.precio_unitario,
        subtotal: row.subtotal
      })) : []
    };

    res.json(pedido);
  });
};

export const createPedido = (req, res) => {
  const { id_cliente, fecha_estimada, estado, prioridad, detalles } = req.body;

  if (!id_cliente || !fecha_estimada || !prioridad || !detalles || !detalles.length) {
    return res.status(400).json({ 
      error: 'id_cliente, fecha_estimada, prioridad y detalles son obligatorios' 
    });
  }

  // Iniciamos una transacción
  db.beginTransaction(err => {
    if (err) {
      console.error('Error al iniciar transacción:', err);
      return res.status(500).json({ error: 'Error al crear pedido' });
    }

    // 1. Insertar el pedido
    const sqlPedido = `
      INSERT INTO pedido (id_cliente, fecha_estimada, estado, prioridad)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sqlPedido, [
      id_cliente, 
      fecha_estimada, 
      estado || 'pendiente', 
      prioridad
    ], (err, resultPedido) => {
      if (err) {
        return db.rollback(() => {
          console.error('Error al crear pedido:', err);
          res.status(500).json({ error: 'Error al crear pedido' });
        });
      }

      const id_pedido = resultPedido.insertId;

      // 2. Insertar los detalles
      const sqlDetalle = `
        INSERT INTO detalle_pedido 
        (id_pedido, id_producto, cantidad, precio_unitario, subtotal)
        VALUES ?
      `;

      const detallesValues = detalles.map(d => [
        id_pedido,
        d.id_producto,
        d.cantidad,
        d.precio_unitario,
        d.cantidad * d.precio_unitario
      ]);

      db.query(sqlDetalle, [detallesValues], (err) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error al crear detalles del pedido:', err);
            res.status(500).json({ error: 'Error al crear detalles del pedido' });
          });
        }

        // Commit de la transacción
        db.commit(err => {
          if (err) {
            return db.rollback(() => {
              console.error('Error al finalizar la transacción:', err);
              res.status(500).json({ error: 'Error al crear pedido' });
            });
          }

          res.status(201).json({
            message: 'Pedido creado correctamente',
            id_pedido,
            detalles: detalles.length
          });
        });
      });
    });
  });
};

export const updatePedido = (req, res) => {
  const { fecha_estimada, estado, prioridad, detalles } = req.body;
  const updates = [];
  const values = [];

  if (fecha_estimada) {
    updates.push('fecha_estimada = ?');
    values.push(fecha_estimada);
  }
  if (estado) {
    updates.push('estado = ?');
    values.push(estado);
  }
  if (prioridad) {
    updates.push('prioridad = ?');
    values.push(prioridad);
  }

  if (updates.length === 0 && !detalles) {
    return res.status(400).json({ error: 'No hay datos para actualizar' });
  }

  // Iniciamos una transacción si hay que actualizar detalles
  const updatePedidoAndDetails = (callback) => {
    if (updates.length > 0) {
      values.push(req.params.id);
      const sql = `UPDATE pedido SET ${updates.join(', ')} WHERE id_pedido = ?`;

      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Error al actualizar pedido:', err);
          return callback(err);
        }
        if (result.affectedRows === 0) {
          return callback(new Error('Pedido no encontrado'));
        }
        callback(null);
      });
    } else {
      callback(null);
    }
  };

  const updateDetails = (callback) => {
    if (!detalles) return callback(null);

    // Eliminar detalles existentes
    const sqlDelete = 'DELETE FROM detalle_pedido WHERE id_pedido = ?';
    db.query(sqlDelete, [req.params.id], (err) => {
      if (err) return callback(err);

      // Insertar nuevos detalles
      const sqlDetalle = `
        INSERT INTO detalle_pedido 
        (id_pedido, id_producto, cantidad, precio_unitario, subtotal)
        VALUES ?
      `;

      const detallesValues = detalles.map(d => [
        req.params.id,
        d.id_producto,
        d.cantidad,
        d.precio_unitario,
        d.cantidad * d.precio_unitario
      ]);

      db.query(sqlDetalle, [detallesValues], callback);
    });
  };

  if (detalles) {
    db.beginTransaction(err => {
      if (err) {
        console.error('Error al iniciar transacción:', err);
        return res.status(500).json({ error: 'Error al actualizar pedido' });
      }

      updatePedidoAndDetails(err => {
        if (err) {
          return db.rollback(() => {
            if (err.message === 'Pedido no encontrado') {
              res.status(404).json({ message: 'Pedido no encontrado' });
            } else {
              res.status(500).json({ error: 'Error al actualizar pedido' });
            }
          });
        }

        updateDetails(err => {
          if (err) {
            return db.rollback(() => {
              console.error('Error al actualizar detalles:', err);
              res.status(500).json({ error: 'Error al actualizar detalles del pedido' });
            });
          }

          db.commit(err => {
            if (err) {
              return db.rollback(() => {
                console.error('Error al finalizar la transacción:', err);
                res.status(500).json({ error: 'Error al actualizar pedido' });
              });
            }

            res.json({ message: 'Pedido actualizado correctamente' });
          });
        });
      });
    });
  } else {
    updatePedidoAndDetails(err => {
      if (err) {
        if (err.message === 'Pedido no encontrado') {
          res.status(404).json({ message: 'Pedido no encontrado' });
        } else {
          res.status(500).json({ error: 'Error al actualizar pedido' });
        }
      } else {
        res.json({ message: 'Pedido actualizado correctamente' });
      }
    });
  }
};

export const deletePedido = (req, res) => {
  // Iniciamos una transacción
  db.beginTransaction(err => {
    if (err) {
      console.error('Error al iniciar transacción:', err);
      return res.status(500).json({ error: 'Error al eliminar pedido' });
    }

    // Primero eliminamos los detalles
    const sqlDetalles = 'DELETE FROM detalle_pedido WHERE id_pedido = ?';
    db.query(sqlDetalles, [req.params.id], (err) => {
      if (err) {
        return db.rollback(() => {
          console.error('Error al eliminar detalles del pedido:', err);
          res.status(500).json({ error: 'Error al eliminar pedido' });
        });
      }

      // Luego eliminamos el pedido
      const sqlPedido = 'DELETE FROM pedido WHERE id_pedido = ?';
      db.query(sqlPedido, [req.params.id], (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error al eliminar pedido:', err);
            res.status(500).json({ error: 'Error al eliminar pedido' });
          });
        }

        if (result.affectedRows === 0) {
          return db.rollback(() => {
            res.status(404).json({ message: 'Pedido no encontrado' });
          });
        }

        // Commit de la transacción
        db.commit(err => {
          if (err) {
            return db.rollback(() => {
              console.error('Error al finalizar la transacción:', err);
              res.status(500).json({ error: 'Error al eliminar pedido' });
            });
          }

          res.status(204).send();
        });
      });
    });
  });
};