const { State } = require('../models/StateModel');
const crearControladorCrud = require('./crudController');

module.exports = crearControladorCrud({
  Model: State,
  filtros: {
    nombre: 'nombre',
    abreviacion: 'abreviacion',
    activo: 'activo'
  },
  filtrosBooleanos: ['activo']
});
