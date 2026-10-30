const express = require('express');
const router = express.Router();

const categoriaController = require('../controllers/categoriaController');

// CRUD de categoria
router.get('/', categoriaController.getCategorias);
router.get('/:id', categoriaController.getCategoriaById);
router.post('/', categoriaController.postCategoria);
router.put('/:id', categoriaController.putCategoria);
router.delete('/:id', categoriaController.deleteCategoria);

module.exports = router;
