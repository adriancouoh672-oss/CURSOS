const { check } = require('express-validator');
const { Category } = require('../models/CategoryModel');
const { User } = require('../models/UserModel');
const { State } = require('../models/StateModel');

function relacionActiva(Model, etiqueta) {
  return async (value) => {
    const registro = await Model.findOne({ where: { id: value, activo: true } });
    if (!registro) {
      throw new Error(`No existe ${etiqueta} activo con ese id`);
    }
  };
}

const idRelacionado = (campo, etiqueta, Model) =>
  check(campo)
    .notEmpty()
    .withMessage(`El campo ${campo} es obligatorio`)
    .bail()
    .isInt({ min: 1 })
    .withMessage(`El campo ${campo} debe ser un entero positivo`)
    .bail()
    .toInt()
    .custom(relacionActiva(Model, etiqueta));

const titulo = () =>
  check('titulo')
    .notEmpty()
    .withMessage('El campo titulo es obligatorio')
    .bail()
    .isString()
    .withMessage('El campo titulo debe ser texto')
    .bail()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El campo titulo debe tener entre 2 y 50 caracteres');

const fechaPublicacion = () =>
  check('fecha_publicacion')
    .notEmpty()
    .withMessage('El campo fecha_publicacion es obligatorio')
    .bail()
    .isISO8601()
    .withMessage('El campo fecha_publicacion debe ser una fecha válida')
    .toDate();

const descripcion = () =>
  check('descripcion')
    .notEmpty()
    .withMessage('El campo descripcion es obligatorio')
    .bail()
    .isString()
    .withMessage('El campo descripcion debe ser texto')
    .bail()
    .trim()
    .isLength({ min: 2, max: 1000 })
    .withMessage('El campo descripcion debe tener entre 2 y 1000 caracteres');

const imagen = () =>
  check('imagen')
    .notEmpty()
    .withMessage('El campo imagen es obligatorio')
    .bail()
    .isBase64()
    .withMessage('El campo imagen debe estar codificado en Base64');

const activo = () =>
  check('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe tener un valor booleano')
    .toBoolean();

const categoriaId = () => idRelacionado('categoria_id', 'una categoría', Category);
const usuarioId = () => idRelacionado('usuario_id', 'un usuario', User);
const estadoId = () => idRelacionado('estado_id', 'un estado', State);

const validatorNewCreate = [
  categoriaId(),
  usuarioId(),
  estadoId(),
  titulo(),
  fechaPublicacion(),
  descripcion(),
  imagen(),
  activo()
];

const validatorNewUpdate = [
  categoriaId().optional(),
  usuarioId().optional(),
  estadoId().optional(),
  titulo().optional(),
  fechaPublicacion().optional(),
  descripcion().optional(),
  imagen().optional(),
  activo()
];

module.exports = { validatorNewCreate, validatorNewUpdate };
