import db from '../db/db.js';


export const getPedidosActivos = (req, res) => {
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
      dp.id_producto,
      dp.cantidad,
      dp.precio_unitario,
      dp.precio_venta,
      dp.subtotal,
      dp.descripcion,
      dp.monto_pago,
      dp.estado_pago,
      pr.nombre AS producto_nombre,
      pg.metodo AS metodo_pago,
      pg.monto AS monto_pago_total,
      pg.fecha_pago
    FROM pedido p
    INNER JOIN cliente c ON p.id_cliente = c.id_cliente
    LEFT JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
    LEFT JOIN productos pr ON dp.id_producto = pr.id_producto
    LEFT JOIN pagos pg ON p.id_pedido = pg.id_pedido
    WHERE p.finalizado = 0
    ORDER BY p.fecha_creacion DESC;
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
          metodo_pago: row.metodo_pago || null,
          monto_pago_total: row.monto_pago_total || 0,
          fecha_pago: row.fecha_pago || null,
          detalles: []
        });
      }

      // Si existe detalle del pedido, lo agregamos
      if (row.id_detalle) {
        pedidosMap.get(row.id_pedido).detalles.push({
          id_detalle: row.id_detalle,
          id_producto: row.id_producto,
          producto_nombre: row.producto_nombre,
          cantidad: row.cantidad,
          precio_unitario: row.precio_unitario,
          precio_venta: row.precio_venta,
          subtotal: row.subtotal,
          descripcion: row.descripcion,
          monto_pago: row.monto_pago,
          estado_pago: row.estado_pago
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
  const { id } = req.params;

  const sql = `
    SELECT 
      p.id_pedido, p.fecha_estimada, p.estado, p.prioridad, p.fecha_creacion, p.finalizado,

      -- Cliente
      c.id_cliente, c.nombre AS cliente_nombre, c.dni AS cliente_dni, 
      c.telefono AS cliente_telefono, c.direccion AS cliente_direccion,

      -- Pagos
      pa.id_pago, pa.metodo AS pago_metodo, pa.monto AS pago_monto, pa.fecha_pago,

      -- Detalle pedido
      dp.id_detalle, dp.descripcion AS detalle_descripcion, dp.cantidad, 
      dp.precio_unitario AS detalle_precio_unitario, dp.precio_venta AS detalle_precio_venta, dp.subtotal,
      dp.estado_pago, dp.monto_pago,

      -- Producto
      pr.id_producto, pr.nombre AS producto_nombre, pr.precio_unitario AS producto_precio_unitario,
      pr.precio_venta AS producto_precio_venta, pr.stock, pr.id_categoria, pr.id_proveedor

    FROM pedido p
    INNER JOIN cliente c ON p.id_cliente = c.id_cliente
    LEFT JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
    LEFT JOIN productos pr ON dp.id_producto = pr.id_producto
    LEFT JOIN pagos pa ON p.id_pedido = pa.id_pedido
    WHERE p.id_pedido = ?
    ORDER BY dp.id_detalle;
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener pedido completo:", err);
      return res.status(500).json({ error: "Error al obtener pedido completo" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    const base = results[0];
    const pedido = {
      id_pedido: base.id_pedido,
      fecha_estimada: base.fecha_estimada,
      estado: base.estado,
      prioridad: base.prioridad,
      fecha_creacion: base.fecha_creacion,
      finalizado: !!base.finalizado,
      cliente: {
        id_cliente: base.id_cliente,
        nombre: base.cliente_nombre,
        dni: base.cliente_dni,
        telefono: base.cliente_telefono,
        direccion: base.cliente_direccion,
      },
      detalles: [],
      pagos: [],
    };

    const detallesSet = new Set();
    const pagosSet = new Set();

    results.forEach((r) => {
      // Agregar detalle (evitando duplicados)
      if (r.id_detalle && !detallesSet.has(r.id_detalle)) {
        detallesSet.add(r.id_detalle);
        pedido.detalles.push({
          id_detalle: r.id_detalle,
          descripcion: r.detalle_descripcion,
          cantidad: r.cantidad,
          precio_unitario: r.detalle_precio_unitario,
          precio_venta: r.detalle_precio_venta,
          subtotal: r.subtotal,
          estado_pago: r.estado_pago,
          monto_pago: r.monto_pago,
          producto: {
            id_producto: r.id_producto,
            nombre: r.producto_nombre,
            precio_unitario: r.producto_precio_unitario,
            precio_venta: r.producto_precio_venta,
            stock: r.stock,
            id_categoria: r.id_categoria,
            id_proveedor: r.id_proveedor,
          },
        });
      }

      // Agregar pago (evitando duplicados)
      if (r.id_pago && !pagosSet.has(r.id_pago)) {
        pagosSet.add(r.id_pago);
        pedido.pagos.push({
          id_pago: r.id_pago,
          metodo: r.pago_metodo,
          monto: r.pago_monto,
          fecha_pago: r.fecha_pago,
        });
      }
    });

    console.log("Pedido completo enviado al frontend:", JSON.stringify(pedido, null, 2));
    res.status(200).json(pedido);
  });
};

export const createPedido = (req, res) => {
  const { nombreCliente, dni, direccion, telefono, id_producto, cantidad, precio_unitario, precio_venta, descripcion, estado_pago, fecha_estimada, prioridad, estado } = req.body;

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
                (id_pedido, id_producto, descripcion, estado_pago, cantidad, precio_unitario, precio_venta, subtotal)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              `;
              db.query(sqlDetalle, [id_pedido, id_producto, descripcion || '', estado_pago || 'pendiente', cantidad, precio_unitario || 0, precio_venta, subtotal], err => {
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

// Cambiar estado del pedido
export const updateEstadoPedido = (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!estado) {
    return res.status(400).json({ error: "El campo 'estado' es obligatorio" });
  }

  const sql = "UPDATE pedido SET estado=? WHERE id_pedido=?";
  db.query(sql, [estado, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar estado del pedido:", err);
      return res.status(500).json({ error: "Error al actualizar estado del pedido" });
    }

    res.status(200).json({ message: "Estado del pedido actualizado correctamente" });
  });
};

// Cambiar datos del Pedido
export const updatePedido = (req, res) => {
  const { id } = req.params;
  const { fecha_estimada, estado, prioridad } = req.body || {}; // ← evita el error si body no existe

  const sql = `
    UPDATE pedido
    SET 
      fecha_estimada = COALESCE(?, fecha_estimada),
      estado = COALESCE(?, estado),
      prioridad = COALESCE(?, prioridad)
    WHERE id_pedido = ?
  `;

  db.query(sql, [fecha_estimada, estado, prioridad, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar pedido:", err);
      return res.status(500).json({ error: "Error al actualizar pedido" });
    }
    console.log(`Pedido ${id} actualizado correctamente`);
    res.status(200).json({ message: "Pedido actualizado correctamente" });
  });
};



// Cambiar datos del cliente
export const updateCliente = (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, telefono, dni } = req.body;

  const sql = `
    UPDATE cliente
    SET 
      nombre = COALESCE(?, nombre),
      direccion = COALESCE(?, direccion),
      telefono = COALESCE(?, telefono),
      dni = COALESCE(?, dni)
    WHERE id_cliente = ?
  `;

  db.query(sql, [nombre, direccion, telefono, dni, id], (err, result) => {
    if (err) {
      console.error("Error al actualizar cliente:", err);
      return res.status(500).json({ error: "Error al actualizar cliente" });
    }
    console.log(`Cliente ${id} actualizado correctamente`);
    res.status(200).json({ message: "Cliente actualizado correctamente" });
  });
};


// Cambiar datos del detalle del pedido
export const updateDetallePedido = (req, res) => {
  const { id_detalle } = req.params;
  const {
    id_producto,
    cantidad,
    precio_unitario,
    precio_venta,
    subtotal,
    descripcion,
    estado_pago,
    monto_pago,
  } = req.body;

  const sql = `
    UPDATE detalle_pedido
    SET 
      id_producto = COALESCE(?, id_producto),
      cantidad = COALESCE(?, cantidad),
      precio_unitario = COALESCE(?, precio_unitario),
      precio_venta = COALESCE(?, precio_venta),
      subtotal = COALESCE(?, subtotal),
      descripcion = COALESCE(?, descripcion),
      estado_pago = COALESCE(?, estado_pago),
      monto_pago = COALESCE(?, monto_pago)
    WHERE id_detalle = ?
  `;

  db.query(
    sql,
    [id_producto, cantidad, precio_unitario, precio_venta, subtotal, descripcion, estado_pago, monto_pago, id_detalle],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar detalle de pedido:", err);
        return res.status(500).json({ error: "Error al actualizar detalle de pedido" });
      }
      console.log(`Detalle ${id_detalle} actualizado correctamente`);
      res.status(200).json({ message: "Detalle de pedido actualizado correctamente" });
    }
  );
};


//Cambiar datos del pago
export const updatePago = (req, res) => {
  const { id_pago } = req.params;
  const { metodo, monto, fecha_pago } = req.body;

  const sql = `
    UPDATE pagos
    SET 
      metodo = COALESCE(?, metodo),
      monto = COALESCE(?, monto),
      fecha_pago = COALESCE(?, fecha_pago)
    WHERE id_pago = ?
  `;

  db.query(sql, [metodo, monto, fecha_pago, id_pago], (err, result) => {
    if (err) {
      console.error("Error al actualizar pago:", err);
      return res.status(500).json({ error: "Error al actualizar pago" });
    }
    console.log(`Pago ${id_pago} actualizado correctamente`);
    res.status(200).json({ message: "Pago actualizado correctamente" });
  });
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