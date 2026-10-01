const { check } = require('express-validator');
const { Op } = require('sequelize');
const { User } = require('../models/UserModel');
const { Profile } = require('../models/ProfileModel');

async function correoUnico(value, { req }) {
  const where = { correo: value };
  const idActual = Number(req.params.id);

  if (Number.isInteger(idActual) && idActual > 0) {
    where.id = { [Op.ne]: idActual };
  }

  const usuario = await User.findOne({ where });
  if (usuario) {
    throw new Error('Ya existe un usuario con el mismo correo');
  }
}

async function perfilExistente(value) {
  const perfil = await Profile.findByPk(value);
  if (!perfil) {
    throw new Error('No existe un perfil con ese id');
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
    .isLength({ min: 2, max: 100 })
    .withMessage('El campo nombre debe tener entre 2 y 100 caracteres');

const apellidos = () =>
  check('apellidos')
    .notEmpty()
    .withMessage('El campo apellidos es obligatorio')
    .bail()
    .isString()
    .withMessage('El campo apellidos debe ser texto')
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El campo apellidos debe tener entre 2 y 100 caracteres');

const nick = () =>
  check('nick')
    .notEmpty()
    .withMessage('El campo nick es obligatorio')
    .bail()
    .isString()
    .withMessage('El campo nick debe ser texto')
    .bail()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('El campo nick debe tener entre 2 y 20 caracteres');

const correo = () =>
  check('correo')
    .trim()
    .notEmpty()
    .withMessage('El campo correo es obligatorio')
    .bail()
    .isEmail()
    .withMessage('El campo correo debe ser un correo válido')
    .bail()
    .normalizeEmail()
    .custom(correoUnico);

const contrasena = () =>
  check('contrasena')
    .notEmpty()
    .withMessage('El campo contrasena es obligatorio')
    .bail()
    .isString()
    .withMessage('El campo contrasena debe ser texto')
    .isLength({ min: 8 })
    .withMessage('El campo contrasena debe tener al menos 8 caracteres')
    .hide();

const perfilId = () =>
  check('perfil_id')
    .notEmpty()
    .withMessage('El campo perfil_id es obligatorio')
    .bail()
    .isInt({ min: 1 })
    .withMessage('El campo perfil_id debe ser un entero positivo')
    .bail()
    .toInt()
    .custom(perfilExistente);

const activo = () =>
  check('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe tener un valor booleano')
    .toBoolean();

const validatorUserCreate = [
  nombre(),
  apellidos(),
  nick(),
  correo(),
  contrasena(),
  perfilId(),
  activo()
];

const validatorUserUpdate = [
  nombre().optional(),
  apellidos().optional(),
  nick().optional(),
  correo().optional(),
  contrasena().optional(),
  perfilId().optional(),
  activo()
];

module.exports = { validatorUserCreate, validatorUserUpdate };
