const express = require('express');
const cors = require('cors');
const config = require('./config');
const { probarConexion } = require('./config.db');
const profileRoutes = require('./routes/ProfileRoute');
const categoryRoutes = require('./routes/CategoryRoute');
const stateRoutes = require('./routes/StateRoute');
const userRoutes = require('./routes/UserRoute');
const newRoutes = require('./routes/NewRoute');
const authRoutes = require('./routes/AuthRoute');

// Carga los modelos y registra todas sus relaciones.
require('./models');

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API News funcionando',
    baseDeDatos: config.db.name,
    orm: 'Sequelize'
  });
});

app.use('/api', profileRoutes);
app.use('/api', categoryRoutes);
app.use('/api', stateRoutes);
app.use('/api', userRoutes);
app.use('/api', newRoutes);
app.use('/api', authRoutes);

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

async function iniciarServidor() {
  await probarConexion();

  return app.listen(config.port, () => {
    console.log(`Servidor escuchando en http://localhost:${config.port}`);
  });
}

if (require.main === module) {
  iniciarServidor().catch((error) => {
    console.error('No se pudo iniciar la aplicación:', error.message);
    process.exitCode = 1;
  });
}

module.exports = { app, iniciarServidor };
