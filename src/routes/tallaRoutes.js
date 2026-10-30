const express = require('express');
const router = express.Router();

const tallaController = require('../controllers/tallaController');

// CRUD de talla
router.get('/', tallaController.getTallas);
router.get('/:id', tallaController.getTallaById);
router.post('/', tallaController.postTalla);
router.put('/:id', tallaController.putTalla);
router.delete('/:id', tallaController.deleteTalla);

module.exports = router;
