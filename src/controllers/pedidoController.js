const pedidoModel = require('../models/pedidoModel');
// se realiza llamado al modelo
const { validar, validarId, responderError } = require('../config/utilidades');

// reglas de validacion de los datos que llegan en el body
const campos = [
    { n: "id_cliente", tipo: "int", req: true, min: 1 },
    { n: "fecha_pedido", tipo: "fecha", def: "NOW" },
    { n: "estado", tipo: "enum", values: ["Pendiente", "Pagado", "Enviado", "Entregado", "Cancelado"], def: "Pendiente" }
];

module.exports = {

    getPedidos: (req, res)=>{
        pedidoModel.getPedidos(req.query, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            res.status(200).json({ok: true, total: result.length, data: result});
        });
    },

    getPedidoById: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        pedidoModel.getPedidoById(id, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.length === 0){
                return res.status(404).json({ok: false, error: 'Pedido no encontrado'});
            }

            res.status(200).json({ok: true, data: result[0]});
        });
    },

    postPedido: (req, res)=>{
        const {errores, datos} = validar(campos, req.body, true);
        if(errores.length > 0){
            return res.status(400).json({ok: false, error: 'Datos invalidos', detalles: errores});
        }

        pedidoModel.postPedido(datos, (err, insertId)=>{
            if(err){
                return responderError(res, err);
            }

            res.status(201).json({ok: true, message: 'Pedido creado correctamente', id_pedido: insertId});
        });
    },

    putPedido: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        const {errores, datos} = validar(campos, req.body, false);
        if(errores.length > 0){
            return res.status(400).json({ok: false, error: 'Datos invalidos', detalles: errores});
        }

        pedidoModel.putPedido(id, datos, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.affectedRows === 0){
                return res.status(404).json({ok: false, error: 'Pedido no encontrado'});
            }

            res.status(200).json({ok: true, message: 'Pedido actualizado correctamente'});
        });
    },

    deletePedido: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        pedidoModel.deletePedido(id, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.affectedRows === 0){
                return res.status(404).json({ok: false, error: 'Pedido no encontrado'});
            }

            res.status(200).json({ok: true, message: 'Pedido eliminado correctamente'});
        });
    }

}
