const detallePedidoModel = require('../models/detallePedidoModel');
// se realiza llamado al modelo
const { validar, validarId, responderError } = require('../config/utilidades');

// reglas de validacion de los datos que llegan en el body
const campos = [
    { n: "id_pedido", tipo: "int", req: true, min: 1 },
    { n: "id_producto", tipo: "int", req: true, min: 1 },
    { n: "id_talla", tipo: "int", req: true, min: 1 },
    { n: "cantidad", tipo: "int", min: 1, def: 1 },
    { n: "precio_unitario", tipo: "num", req: true, min: 1 }
];

module.exports = {

    getDetallePedidos: (req, res)=>{
        detallePedidoModel.getDetallePedidos(req.query, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            res.status(200).json({ok: true, total: result.length, data: result});
        });
    },

    getDetallePedidoById: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        detallePedidoModel.getDetallePedidoById(id, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.length === 0){
                return res.status(404).json({ok: false, error: 'DetallePedido no encontrado'});
            }

            res.status(200).json({ok: true, data: result[0]});
        });
    },

    postDetallePedido: (req, res)=>{
        const {errores, datos} = validar(campos, req.body, true);
        if(errores.length > 0){
            return res.status(400).json({ok: false, error: 'Datos invalidos', detalles: errores});
        }

        detallePedidoModel.postDetallePedido(datos, (err, insertId)=>{
            if(err){
                return responderError(res, err);
            }

            res.status(201).json({ok: true, message: 'DetallePedido creado correctamente', id_detalle: insertId});
        });
    },

    putDetallePedido: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        const {errores, datos} = validar(campos, req.body, false);
        if(errores.length > 0){
            return res.status(400).json({ok: false, error: 'Datos invalidos', detalles: errores});
        }

        detallePedidoModel.putDetallePedido(id, datos, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.affectedRows === 0){
                return res.status(404).json({ok: false, error: 'DetallePedido no encontrado'});
            }

            res.status(200).json({ok: true, message: 'DetallePedido actualizado correctamente'});
        });
    },

    deleteDetallePedido: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        detallePedidoModel.deleteDetallePedido(id, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.affectedRows === 0){
                return res.status(404).json({ok: false, error: 'DetallePedido no encontrado'});
            }

            res.status(200).json({ok: true, message: 'DetallePedido eliminado correctamente'});
        });
    }

}
