const { DataTypes } = require('sequelize');
const { connection } = require('../config.db');
const auditFields = require('./auditFields');

const Category = connection.define(
  'category',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ...auditFields
  },
  {
    tableName: 'categories'
  }
);

module.exports = { Category };
