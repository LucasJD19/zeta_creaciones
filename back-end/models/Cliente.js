const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');

const Cliente = sequelize.define('Cliente', {
  id_cliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING(150)
  },
  telefono: {
    type: DataTypes.STRING(20)
  },
  dni: {
    type: DataTypes.STRING(45),
    unique: true
  }
}, {
  tableName: 'cliente',
  timestamps: false
});

module.exports = Cliente;