const { check } = require('express-validator');
const { Op } = require('sequelize');
const { State } = require('../models/StateModel');

async function valorUnico(campo, valor, request) {
  const where = { [campo]: valor };
  const idActual = Number(request.params.id);

  if (Number.isInteger(idActual) && idActual > 0) {
    where.id = { [Op.ne]: idActual };
  }

  const estado = await State.findOne({ where });
  if (estado) {
    throw new Error(`Ya existe un estado con el mismo valor en ${campo}`);
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
    .isLength({ min: 2, max: 50 })
    .withMessage('El campo nombre debe tener entre 2 y 50 caracteres')
    .bail()
    .custom((value, { req }) => valorUnico('nombre', value, req));

const abreviacion = () =>
  check('abreviacion')
    .notEmpty()
    .withMessage('El campo abreviacion es obligatorio')
    .bail()
    .isString()
    .withMessage('El campo abreviacion debe ser texto')
    .bail()
    .trim()
    .isLength({ min: 2, max: 5 })
    .withMessage('El campo abreviacion debe tener entre 2 y 5 caracteres')
    .bail()
    .custom((value, { req }) => valorUnico('abreviacion', value, req));

const activo = () =>
  check('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe tener un valor booleano')
    .toBoolean();

const validatorStateCreate = [nombre(), abreviacion(), activo()];
const validatorStateUpdate = [nombre().optional(), abreviacion().optional(), activo()];

module.exports = { validatorStateCreate, validatorStateUpdate };
