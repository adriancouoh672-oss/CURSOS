const { check } = require('express-validator');

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
    .withMessage('El campo nombre debe tener entre 2 y 50 caracteres');

const validatorProfileCreate = [nombre()];
const validatorProfileUpdate = [nombre().optional()];

module.exports = { validatorProfileCreate, validatorProfileUpdate };
