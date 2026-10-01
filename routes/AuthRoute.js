const express = require('express');
const { login, register } = require('../controllers/AuthController');
const {
  validatorLogin,
  validatorRegister
} = require('../validators/AuthValidator');
const { validarSolicitud } = require('../validators/ValidationMiddleware');

const router = express.Router();

router.post('/auth/login', validatorLogin, validarSolicitud, login);
router.post('/auth/registro', validatorRegister, validarSolicitud, register);

module.exports = router;
