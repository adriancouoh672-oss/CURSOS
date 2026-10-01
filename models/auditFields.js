const { DataTypes } = require('sequelize');

const fechaInicial = '1990-01-01 00:00:00';

const auditFields = {
  activo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  UserAlta: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: 'Admin'
  },
  FechaAlta: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: fechaInicial
  },
  UserMod: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: ''
  },
  FechaMod: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: fechaInicial
  },
  UserBaja: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: ''
  },
  FechaBaja: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: fechaInicial
  }
};

module.exports = auditFields;
