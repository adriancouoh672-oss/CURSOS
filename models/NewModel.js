const { DataTypes } = require('sequelize');
const { connection } = require('../config.db');
const auditFields = require('./auditFields');

const New = connection.define(
  'new',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    categoria_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    estado_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    fecha_publicacion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    imagen: {
      type: DataTypes.TEXT('medium'),
      allowNull: false
    },
    ...auditFields
  },
  {
    tableName: 'news'
  }
);

module.exports = { New };
