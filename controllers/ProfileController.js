const { Profile } = require('../models/ProfileModel');
const crearControladorCrud = require('./crudController');

module.exports = crearControladorCrud({
  Model: Profile,
  filtros: {
    nombre: 'nombre'
  }
});
