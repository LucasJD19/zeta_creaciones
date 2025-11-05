const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Proveedor = sequelize.define('Proveedor', {
  id_proveedor: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  contacto: {
    type: DataTypes.STRING(100)
  },
  telefono: {
    type: DataTypes.STRING(20)
  },
  email: {
    type: DataTypes.STRING(100)
  },
  direccion: {
    type: DataTypes.STRING(150)
  }
}, {
  tableName: 'proveedores',
  timestamps: false
});

module.exports = Proveedor;