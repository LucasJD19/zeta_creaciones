const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const Cliente = require('./Cliente');

const Pedido = sequelize.define('Pedido', {
  id_pedido: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_cliente: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cliente,
      key: 'id_cliente'
    }
  },
  fecha_estimada: {
    type: DataTypes.DATE,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'iniciado', 'finalizado', 'entregado'),
    defaultValue: 'pendiente'
  },
  prioridad: {
    type: DataTypes.ENUM('alta', 'media', 'baja'),
    allowNull: false
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'pedido',
  timestamps: false
});

Pedido.belongsTo(Cliente, { foreignKey: 'id_cliente' });
Cliente.hasMany(Pedido, { foreignKey: 'id_cliente' });

module.exports = Pedido;