const { User } = require('../models/UserModel');
const crearControladorCrud = require('./crudController');

module.exports = crearControladorCrud({
  Model: User,
  filtros: {
    nombre: 'nombre',
    apellidos: 'apellidos',
    nick: 'nick',
    correo: 'correo',
    activo: 'activo'
  },
  filtrosBooleanos: ['activo'],
  camposOcultos: ['contrasena']
});
