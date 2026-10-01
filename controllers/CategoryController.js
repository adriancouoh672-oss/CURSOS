const { Category } = require('../models/CategoryModel');
const crearControladorCrud = require('./crudController');

module.exports = crearControladorCrud({
  Model: Category,
  filtros: {
    nombre: 'nombre',
    descripcion: 'descripcion',
    activo: 'activo',
    useralta: 'UserAlta'
  },
  filtrosBooleanos: ['activo']
});
