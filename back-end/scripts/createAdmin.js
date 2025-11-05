import bcrypt from 'bcrypt';
import db from '../db/db.js';

const createAdmin = async () => {
  try {
    // Datos del usuario admin
    const adminData = {
      nombre: 'Lucas',
      apellido: 'Diaz',
      usuario: 'admin',
      email: 'admin@zeta.com',
      password: 'admin123',
      id_rol: 1
    };

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Query para actualizar el usuario existente
    const sql = `UPDATE usuarios 
                 SET nombre = ?, 
                     apellido = ?, 
                     email = ?, 
                     password = ?, 
                     id_rol = ?
                 WHERE usuario = ?`;

    const values = [
      adminData.nombre,
      adminData.apellido,
      adminData.email,
      hashedPassword,
      adminData.id_rol,
      adminData.usuario
    ];

    // Ejecutar el query
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error al actualizar usuario admin:', err);
        process.exit(1);
      }
      console.log('Usuario admin actualizado exitosamente');
      console.log('Credenciales de acceso:');
      console.log('Usuario: admin');
      console.log('Contraseña: admin123');
      process.exit(0);
    });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// Ejecutar la función
createAdmin();