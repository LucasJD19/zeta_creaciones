import express from 'express';
import db from '../db/db.js'; // necesario para la query
import { getUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario } from '../controllers/usuarioController.js';
import { verificarToken } from '../middleware/auth.js'; // importar el middleware

const router = express.Router();

// Ruta para obtener datos del usuario logueado
router.get('/me', verificarToken, (req, res) => {
  const sql = 'SELECT id, nombre, apellido, usuario, email, id_rol FROM usuarios WHERE id = ?';
  db.query(sql, [req.usuario.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener usuario' });
    if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(results[0]);
  });
});

router.get('/', getUsuarios);
router.get('/:id', getUsuario);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);


export default router;
