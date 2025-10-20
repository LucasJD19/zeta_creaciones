const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const Proveedor = require('./Proveedor');

const Producto = sequelize.define('Producto', {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_proveedor: {
    type: DataTypes.INTEGER,
    references: {
      model: Proveedor,
      key: 'id_proveedor'
    }
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING(255)
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'productos',
  timestamps: false
});

Producto.belongsTo(Proveedor, { foreignKey: 'id_proveedor' });
Proveedor.hasMany(Producto, { foreignKey: 'id_proveedor' });

module.exports = Producto;