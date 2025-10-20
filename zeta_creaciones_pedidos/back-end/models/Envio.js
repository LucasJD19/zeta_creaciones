const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const Pedido = require('./Pedido');

const Envio = sequelize.define('Envio', {
  id_envio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_pedido: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Pedido,
      key: 'id_pedido'
    }
  },
  direccion_envio: {
    type: DataTypes.STRING(150)
  },
  fecha_envio: {
    type: DataTypes.DATE
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'en camino', 'entregado'),
    defaultValue: 'pendiente'
  }
}, {
  tableName: 'envios',
  timestamps: false
});

Envio.belongsTo(Pedido, { foreignKey: 'id_pedido' });
Pedido.hasOne(Envio, { foreignKey: 'id_pedido' });

module.exports = Envio;