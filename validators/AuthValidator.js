const { check } = require('express-validator');
const { User } = require('../models/UserModel');

const validatorLogin = [
  check('correo')
    .trim()
    .notEmpty()
    .withMessage('El campo correo es obligatorio')
    .bail()
    .isEmail()
    .withMessage('El campo correo debe ser un correo válido')
    .normalizeEmail(),
  check('contrasena')
    .notEmpty()
    .withMessage('El campo contrasena es obligatorio')
    .hide()
];

const validatorRegister = [
  check('nombre')
    .isString()
    .withMessage('El campo nombre debe ser texto')
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El campo nombre debe tener entre 2 y 100 caracteres'),
  check('apellidos')
    .isString()
    .withMessage('El campo apellidos debe ser texto')
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El campo apellidos debe tener entre 2 y 100 caracteres'),
  check('nick')
    .isString()
    .withMessage('El campo nick debe ser texto')
    .bail()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('El campo nick debe tener entre 2 y 20 caracteres'),
  check('correo')
    .trim()
    .notEmpty()
    .withMessage('El campo correo es obligatorio')
    .bail()
    .isEmail()
    .withMessage('El campo correo debe ser un correo válido')
    .bail()
    .normalizeEmail()
    .custom(async (correo) => {
      const usuario = await User.findOne({ where: { correo } });
      if (usuario) {
        throw new Error('Ya existe un usuario con el mismo correo');
      }
    }),
  check('contrasena')
    .isString()
    .withMessage('El campo contrasena debe ser texto')
    .bail()
    .isLength({ min: 8, max: 72 })
    .withMessage('El campo contrasena debe tener entre 8 y 72 caracteres')
    .hide()
];

module.exports = { validatorLogin, validatorRegister };
