import db from '../db/db.js';

// Pedidos activos (no finalizados)
export const getPedidosActivos = (req, res) => {
  const sql = `
    SELECT 
      p.id_pedido, p.fecha_estimada, p.estado, p.prioridad, p.fecha_creacion,
      c.nombre AS cliente_nombre, c.direccion AS cliente_direccion, c.telefono AS cliente_telefono, c.dni AS cliente_dni,
      dp.id_detalle, dp.cantidad, dp.precio_unitario, dp.precio_venta, dp.subtotal, dp.descripcion,
      pr.nombre AS producto_nombre
    FROM pedido p
    INNER JOIN cliente c ON p.id_cliente = c.id_cliente
    LEFT JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
    LEFT JOIN productos pr ON dp.id_producto = pr.id_producto
    WHERE p.finalizado = 0
    ORDER BY p.fecha_creacion DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener pedidos activos:', err);
      return res.status(500).json({ error: 'Error al obtener pedidos activos' });
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
          precio_venta: row.precio_venta,
          subtotal: row.subtotal,
          descripcion: row.descripcion
        });
      }
    });

    res.json(Array.from(pedidosMap.values()));
  });
};

//  Pedidos finalizados (historial)
export const getPedidosFinalizados = (req, res) => {
  const sql = `
    SELECT 
      p.id_pedido, p.fecha_estimada, p.estado, p.prioridad, p.fecha_creacion,
      c.nombre AS cliente_nombre, c.direccion AS cliente_direccion, c.telefono AS cliente_telefono, c.dni AS cliente_dni,
      dp.id_detalle, dp.cantidad, dp.precio_unitario, dp.precio_venta, dp.subtotal, dp.descripcion,
      pr.nombre AS producto_nombre
    FROM pedido p
    INNER JOIN cliente c ON p.id_cliente = c.id_cliente
    LEFT JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
    LEFT JOIN productos pr ON dp.id_producto = pr.id_producto
    WHERE p.finalizado = 1
    ORDER BY p.fecha_creacion DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener pedidos finalizados:', err);
      return res.status(500).json({ error: 'Error al obtener pedidos finalizados' });
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
          precio_venta: row.precio_venta,
          subtotal: row.subtotal,
          descripcion: row.descripcion
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
      c.nombre AS cliente_nombre,
      c.direccion AS cliente_direccion,
      c.telefono AS cliente_telefono,
      c.dni AS cliente_dni,
      dp.id_detalle,
      dp.cantidad,
      dp.precio_unitario,
      dp.precio_venta,
      dp.subtotal,
      dp.descripcion,
      pr.nombre AS producto_nombre
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
        precio_venta: row.precio_venta,
        subtotal: row.subtotal,
        descripcion: row.descripcion
      })) : []
    };

    res.json(pedido);
  });
};


export const createPedido = (req, res) => {
  const { nombreCliente, dni, direccion, telefono, id_producto, cantidad, precio_unitario, precio_venta, descripcion, fecha_estimada, prioridad, estado } = req.body;

  if (!nombreCliente || !dni || !id_producto || !cantidad || !precio_venta || !fecha_estimada || !prioridad) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: 'Error al iniciar transacción' });

    // Buscar o crear cliente
    const sqlCliente = `SELECT id_cliente FROM cliente WHERE nombre = ? AND dni = ? LIMIT 1`;
    db.query(sqlCliente, [nombreCliente, dni], (err, resultCliente) => {
      if (err) return db.rollback(() => res.status(500).json({ error: 'Error al buscar cliente' }));

      let id_cliente;
      if (resultCliente.length > 0) {
        id_cliente = resultCliente[0].id_cliente;
        insertarPedido();
      } else {
        const sqlInsertCliente = `INSERT INTO cliente (nombre, direccion, telefono, dni) VALUES (?, ?, ?, ?)`;
        db.query(sqlInsertCliente, [nombreCliente, direccion, telefono, dni], (err, resultNewClient) => {
          if (err) return db.rollback(() => res.status(500).json({ error: 'Error al crear cliente' }));
          id_cliente = resultNewClient.insertId;
          insertarPedido();
        });
      }

      function insertarPedido() {
        const sqlPedido = `INSERT INTO pedido (id_cliente, fecha_estimada, estado, prioridad) VALUES (?, ?, ?, ?)`;
        db.query(sqlPedido, [id_cliente, fecha_estimada, estado || 'pendiente', prioridad], (err, resultPedido) => {
          if (err) return db.rollback(() => res.status(500).json({ error: 'Error al crear pedido' }));

          const id_pedido = resultPedido.insertId;
          const subtotal = cantidad * precio_venta;

          // Verificar stock actual del producto
          const sqlStock = `SELECT stock FROM productos WHERE id_producto = ?`;
          db.query(sqlStock, [id_producto], (err, resultStock) => {
            if (err) return db.rollback(() => res.status(500).json({ error: 'Error al consultar stock' }));
            if (resultStock.length === 0) return db.rollback(() => res.status(404).json({ error: 'Producto no encontrado' }));

            const stockActual = resultStock[0].stock;

            if (stockActual < cantidad) {
              return db.rollback(() => res.status(400).json({ error: 'Stock insuficiente para este producto' }));
            }

            // Descontar el stock
            const sqlUpdateStock = `UPDATE productos SET stock = stock - ? WHERE id_producto = ?`;
            db.query(sqlUpdateStock, [cantidad, id_producto], (err) => {
              if (err) return db.rollback(() => res.status(500).json({ error: 'Error al actualizar stock' }));

              // Insertar el detalle del pedido
              const sqlDetalle = `
                INSERT INTO detalle_pedido 
                (id_pedido, id_producto, descripcion, cantidad, precio_unitario, precio_venta, subtotal)
                VALUES (?, ?, ?, ?, ?, ?, ?)
              `;
              db.query(sqlDetalle, [id_pedido, id_producto, descripcion || '', cantidad, precio_unitario || 0, precio_venta, subtotal], err => {
                if (err) return db.rollback(() => res.status(500).json({ error: 'Error al crear detalle del pedido' }));

                db.commit(err => {
                  if (err) return db.rollback(() => res.status(500).json({ error: 'Error al finalizar transacción' }));

                  res.status(201).json({
                    message: 'Pedido creado correctamente y stock actualizado',
                    id_pedido,
                    cliente: nombreCliente,
                    id_producto,
                    cantidad,
                    subtotal
                  });
                });
              });
            });
          });
        });
      }
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
  const id = req.params.id;

  const sqlDeleteDetalles = 'DELETE FROM detalle_pedido WHERE id_pedido = ?';
  const sqlDeletePedido = 'DELETE FROM pedido WHERE id_pedido = ?';

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ error: 'Error al iniciar transacción' });

    db.query(sqlDeleteDetalles, [id], err => {
      if (err) return db.rollback(() => res.status(500).json({ error: 'Error al eliminar detalles del pedido' }));

      db.query(sqlDeletePedido, [id], (err) => {
        if (err) return db.rollback(() => res.status(500).json({ error: 'Error al eliminar pedido' }));

        db.commit(err => {
          if (err) return db.rollback(() => res.status(500).json({ error: 'Error al confirmar eliminación' }));

          res.status(200).json({ message: 'Pedido y sus detalles eliminados correctamente' });
        });
      });
    });
  });
};