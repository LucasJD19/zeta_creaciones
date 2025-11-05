const { DataTypes } = require('sequelize');
const sequelize = require('../db/db');
const Rol = require('./Rol');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  apellido: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  usuario: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  id_rol: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Rol,
      key: 'id_rol'
    }
  }
}, {
  tableName: 'usuarios',
  timestamps: false
});

Usuario.belongsTo(Rol, { foreignKey: 'id_rol' });
Rol.hasMany(Usuario, { foreignKey: 'id_rol' });

module.exports = Usuario;