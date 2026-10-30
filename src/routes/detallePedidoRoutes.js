const express = require('express');
const router = express.Router();

const detallePedidoController = require('../controllers/detallePedidoController');

// CRUD de detalle_pedido
router.get('/', detallePedidoController.getDetallePedidos);
router.get('/:id', detallePedidoController.getDetallePedidoById);
router.post('/', detallePedidoController.postDetallePedido);
router.put('/:id', detallePedidoController.putDetallePedido);
router.delete('/:id', detallePedidoController.deleteDetallePedido);

module.exports = router;
