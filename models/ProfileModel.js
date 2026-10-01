const { DataTypes } = require('sequelize');
const { connection } = require('../config.db');

const Profile = connection.define(
  'profile',
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  },
  {
    tableName: 'profiles'
  }
);

module.exports = { Profile };
