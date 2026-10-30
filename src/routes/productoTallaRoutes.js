const express = require('express');
const router = express.Router();

const productoTallaController = require('../controllers/productoTallaController');

// CRUD de producto_talla
router.get('/', productoTallaController.getProductoTallas);
router.get('/:id', productoTallaController.getProductoTallaById);
router.post('/', productoTallaController.postProductoTalla);
router.put('/:id', productoTallaController.putProductoTalla);
router.delete('/:id', productoTallaController.deleteProductoTalla);

module.exports = router;
