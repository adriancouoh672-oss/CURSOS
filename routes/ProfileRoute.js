const express = require('express');
const controller = require('../controllers/ProfileController');
const {
  validatorProfileCreate,
  validatorProfileUpdate
} = require('../validators/ProfileValidator');
const { validarSolicitud } = require('../validators/ValidationMiddleware');
const { authenticateAdmin } = require('../middlewares/jwt');

const router = express.Router();

router.get('/perfiles', controller.get);
router.get('/perfiles/:id', controller.getById);
router.post('/perfiles', authenticateAdmin, validatorProfileCreate, validarSolicitud, controller.create);
router.put('/perfiles/:id', authenticateAdmin, validatorProfileUpdate, validarSolicitud, controller.update);
router.delete('/perfiles/:id', authenticateAdmin, controller.destroy);

module.exports = router;
