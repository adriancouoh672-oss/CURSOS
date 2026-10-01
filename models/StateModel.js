const { DataTypes } = require('sequelize');
const { connection } = require('../config.db');
const auditFields = require('./auditFields');

const State = connection.define(
  'state',
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
    abreviacion: {
      type: DataTypes.STRING(5),
      allowNull: false,
      unique: true
    },
    ...auditFields
  },
  {
    tableName: 'states'
  }
);

module.exports = { State };
