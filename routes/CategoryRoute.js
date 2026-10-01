const express = require('express');
const controller = require('../controllers/CategoryController');
const {
  validatorCategoryCreate,
  validatorCategoryUpdate
} = require('../validators/CategoryValidator');
const { validarSolicitud } = require('../validators/ValidationMiddleware');
const { authenticateAdmin } = require('../middlewares/jwt');

const router = express.Router();

router.get('/categorias', controller.get);
router.get('/categorias/:id', controller.getById);
router.post('/categorias', authenticateAdmin, validatorCategoryCreate, validarSolicitud, controller.create);
router.put('/categorias/:id', authenticateAdmin, validatorCategoryUpdate, validarSolicitud, controller.update);
router.delete('/categorias/:id', authenticateAdmin, controller.destroy);

module.exports = router;
