const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const Pedido = require('./Pedido');

const Pago = sequelize.define('Pago', {
  id_pago: {
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
  metodo: {
    type: DataTypes.ENUM('efectivo', 'transferencia', 'tarjeta'),
    allowNull: false
  },
  monto: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  fecha_pago: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'pagos',
  timestamps: false
});

Pago.belongsTo(Pedido, { foreignKey: 'id_pedido' });
Pedido.hasMany(Pago, { foreignKey: 'id_pedido' });

module.exports = Pago;