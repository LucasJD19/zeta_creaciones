import db from '../db/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'tu_clave_secreta_aqui';

export const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
     console.log('Error JWT:', err); 
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.usuario = decoded;
    next();
  });
};

export const login = (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }

  const sql = 'SELECT * FROM usuarios WHERE usuario = ?';
  
  db.query(sql, [usuario], async (err, results) => {
    if (err) {
      console.error('Error al buscar usuario:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = results[0];
    const passwordValido = await bcrypt.compare(password, user.password);

    if (!passwordValido) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        usuario: user.usuario,
        rol: user.id_rol 
      },
      secretKey,
      { expiresIn: '24h' }
    );
    console.log('Usuario logueado:', {
       id: user.id,
       nombre: user.nombre,
       apellido: user.apellido,
       usuario: user.usuario,
       email: user.email,
       rol: user.id_rol,
       token
     });
    res.json({
      token,
      usuario: {
       id: results[0].id,
         nombre: results[0].nombre,
         apellido: results[0].apellido,
         usuario: results[0].usuario,
         email: results[0].email,
         rol: results[0].id_rol // renombramos id_rol a rol
      }
      
    });
  });
};

