import db from '../db/db.js';
import bcrypt from 'bcrypt';

export const getUsuarios = (req, res) => {
  const sql = 'SELECT id, nombre, apellido, usuario, email, id_rol FROM usuarios';
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener usuarios:', err);
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }
    res.json(results);
  });
};

export const getUsuario = (req, res) => {
  const sql = 'SELECT id, nombre, apellido, usuario, email, id_rol FROM usuarios WHERE id = ?';
  
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error al obtener usuario:', err);
      return res.status(500).json({ error: 'Error al obtener usuario' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(results[0]);
  });
};

export const createUsuario = async (req, res) => {
  const { nombre, apellido, usuario, email, password, id_rol } = req.body;

  if (!nombre || !apellido || !usuario || !email || !password || !id_rol) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO usuarios (nombre, apellido, usuario, email, password, id_rol) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [nombre, apellido, usuario, email, hashedPassword, id_rol], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'El usuario o email ya existe' });
        }
        console.error('Error al crear usuario:', err);
        return res.status(500).json({ error: 'Error al crear usuario' });
      }
      
      const usuarioCreado = {
        id: result.insertId,
        nombre,
        apellido,
        usuario,
        email,
        id_rol
      };
      
      res.status(201).json(usuarioCreado);
    });
  } catch (error) {
    console.error('Error al hashear password:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

export const updateUsuario = async (req, res) => {
  const { nombre, apellido, usuario, email, password, id_rol } = req.body;
  const updates = [];
  const values = [];

  if (nombre) {
    updates.push('nombre = ?');
    values.push(nombre);
  }
  if (apellido) {
    updates.push('apellido = ?');
    values.push(apellido);
  }
  if (usuario) {
    updates.push('usuario = ?');
    values.push(usuario);
  }
  if (email) {
    updates.push('email = ?');
    values.push(email);
  }
  if (password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push('password = ?');
      values.push(hashedPassword);
    } catch (error) {
      console.error('Error al hashear password:', error);
      return res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  }
  if (id_rol) {
    updates.push('id_rol = ?');
    values.push(id_rol);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No hay datos para actualizar' });
  }

  values.push(req.params.id);
  const sql = `UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`;

  db.query(sql, values, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'El usuario o email ya existe' });
      }
      console.error('Error al actualizar usuario:', err);
      return res.status(500).json({ error: 'Error al actualizar usuario' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario actualizado correctamente' });
  });
};

export const deleteUsuario = (req, res) => {
  const sql = 'DELETE FROM usuarios WHERE id = ?';
  
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      console.error('Error al eliminar usuario:', err);
      return res.status(500).json({ error: 'Error al eliminar usuario' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.status(204).send();
  });
};