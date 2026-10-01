const express = require('express');
const controller = require('../controllers/NewController');
const {
  validatorNewCreate,
  validatorNewUpdate
} = require('../validators/NewValidator');
const { validarSolicitud } = require('../validators/ValidationMiddleware');
const { authenticateAny } = require('../middlewares/jwt');

const router = express.Router();

router.get('/noticias', controller.get);
router.get('/noticias/:id', controller.getById);
router.post('/noticias', authenticateAny, validatorNewCreate, validarSolicitud, controller.create);
router.put('/noticias/:id', authenticateAny, validatorNewUpdate, validarSolicitud, controller.update);
router.delete('/noticias/:id', authenticateAny, controller.destroy);

module.exports = router;
