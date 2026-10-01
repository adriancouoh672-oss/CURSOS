const { New } = require('../models/NewModel');
const crearControladorCrud = require('./crudController');

module.exports = crearControladorCrud({
  Model: New,
  filtros: {
    titulo: 'titulo',
    activo: 'activo',
    categoria_id: 'categoria_id',
    estado_id: 'estado_id',
    usuario_id: 'usuario_id'
  },
  filtrosBooleanos: ['activo']
});
