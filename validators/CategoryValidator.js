const { check } = require('express-validator');
const { Op } = require('sequelize');
const { Category } = require('../models/CategoryModel');

async function valorUnico(campo, valor, request) {
  const where = { [campo]: valor };
  const idActual = Number(request.params.id);

  if (Number.isInteger(idActual) && idActual > 0) {
    where.id = { [Op.ne]: idActual };
  }

  const categoria = await Category.findOne({ where });
  if (categoria) {
    throw new Error(`Ya existe una categoría con el mismo ${campo}`);
  }
}

const nombre = () =>
  check('nombre')
    .notEmpty()
    .withMessage('El campo nombre es obligatorio')
    .bail()
    .isString()
    .withMessage('El campo nombre debe ser texto')
    .bail()
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('El campo nombre debe tener entre 5 y 50 caracteres')
    .bail()
    .custom((value, { req }) => valorUnico('nombre', value, req));

const descripcion = () =>
  check('descripcion')
    .notEmpty()
    .withMessage('El campo descripcion es obligatorio')
    .bail()
    .isString()
    .withMessage('El campo descripcion debe ser texto')
    .bail()
    .trim()
    .isLength({ min: 5, max: 255 })
    .withMessage('El campo descripcion debe tener entre 5 y 255 caracteres')
    .bail()
    .custom((value, { req }) => valorUnico('descripcion', value, req));

const activo = () =>
  check('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe tener un valor booleano')
    .toBoolean();

const validatorCategoryCreate = [nombre(), descripcion(), activo()];
const validatorCategoryUpdate = [
  nombre().optional(),
  descripcion().optional(),
  activo()
];

module.exports = { validatorCategoryCreate, validatorCategoryUpdate };
