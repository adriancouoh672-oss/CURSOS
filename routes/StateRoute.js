const express = require('express');
const controller = require('../controllers/StateController');
const {
  validatorStateCreate,
  validatorStateUpdate
} = require('../validators/StateValidator');
const { validarSolicitud } = require('../validators/ValidationMiddleware');
const { authenticateAdmin } = require('../middlewares/jwt');

const router = express.Router();

router.get('/estados', controller.get);
router.get('/estados/:id', controller.getById);
router.post('/estados', authenticateAdmin, validatorStateCreate, validarSolicitud, controller.create);
router.put('/estados/:id', authenticateAdmin, validatorStateUpdate, validarSolicitud, controller.update);
router.delete('/estados/:id', authenticateAdmin, controller.destroy);

module.exports = router;
