const { Sequelize } = require('sequelize');
const config = require('./config');

const connection = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    logging: config.db.logging ? console.log : false,
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci'
    }
  }
);

async function probarConexion() {
  await connection.authenticate();
  console.log('Se ha establecido conexión con la base de datos');
}

module.exports = { connection, probarConexion };
