const productoTallaModel = require('../models/productoTallaModel');
// se realiza llamado al modelo
const { validar, validarId, responderError } = require('../config/utilidades');

// reglas de validacion de los datos que llegan en el body
const campos = [
    { n: "id_producto", tipo: "int", req: true, min: 1 },
    { n: "id_talla", tipo: "int", req: true, min: 1 },
    { n: "stock", tipo: "int", min: 0, def: 0 }
];

module.exports = {

    getProductoTallas: (req, res)=>{
        productoTallaModel.getProductoTallas(req.query, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            res.status(200).json({ok: true, total: result.length, data: result});
        });
    },

    getProductoTallaById: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        productoTallaModel.getProductoTallaById(id, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.length === 0){
                return res.status(404).json({ok: false, error: 'ProductoTalla no encontrado'});
            }

            res.status(200).json({ok: true, data: result[0]});
        });
    },

    postProductoTalla: (req, res)=>{
        const {errores, datos} = validar(campos, req.body, true);
        if(errores.length > 0){
            return res.status(400).json({ok: false, error: 'Datos invalidos', detalles: errores});
        }

        productoTallaModel.postProductoTalla(datos, (err, insertId)=>{
            if(err){
                return responderError(res, err);
            }

            res.status(201).json({ok: true, message: 'ProductoTalla creado correctamente', id_producto_talla: insertId});
        });
    },

    putProductoTalla: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        const {errores, datos} = validar(campos, req.body, false);
        if(errores.length > 0){
            return res.status(400).json({ok: false, error: 'Datos invalidos', detalles: errores});
        }

        productoTallaModel.putProductoTalla(id, datos, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.affectedRows === 0){
                return res.status(404).json({ok: false, error: 'ProductoTalla no encontrado'});
            }

            res.status(200).json({ok: true, message: 'ProductoTalla actualizado correctamente'});
        });
    },

    deleteProductoTalla: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        productoTallaModel.deleteProductoTalla(id, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.affectedRows === 0){
                return res.status(404).json({ok: false, error: 'ProductoTalla no encontrado'});
            }

            res.status(200).json({ok: true, message: 'ProductoTalla eliminado correctamente'});
        });
    }

}
