const { DataTypes } = require('sequelize');
const { connection } = require('../config.db');
const auditFields = require('./auditFields');

const User = connection.define(
  'user',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    perfil_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellidos: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    nick: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    contrasena: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'contraseña'
    },
    ...auditFields
  },
  {
    tableName: 'users'
  }
);

module.exports = { User };
