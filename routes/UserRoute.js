const express = require('express');
const controller = require('../controllers/UserController');
const {
  validatorUserCreate,
  validatorUserUpdate
} = require('../validators/UserValidator');
const { validarSolicitud } = require('../validators/ValidationMiddleware');
const { authenticateAdmin } = require('../middlewares/jwt');

const router = express.Router();

router.get('/usuarios', authenticateAdmin, controller.get);
router.get('/usuarios/:id', authenticateAdmin, controller.getById);
router.post('/usuarios', authenticateAdmin, validatorUserCreate, validarSolicitud, controller.create);
router.put('/usuarios/:id', authenticateAdmin, validatorUserUpdate, validarSolicitud, controller.update);
router.delete('/usuarios/:id', authenticateAdmin, controller.destroy);

module.exports = router;
