const productoModel = require('../models/productoModel');
// se realiza llamado al modelo
const { validar, validarId, responderError } = require('../config/utilidades');

// reglas de validacion de los datos que llegan en el body
const campos = [
    { n: "codigo", tipo: "str", req: true, max: 20 },
    { n: "nombre", tipo: "str", req: true, max: 120 },
    { n: "descripcion", tipo: "str", max: 300 },
    { n: "precio", tipo: "num", req: true, min: 1 },
    { n: "genero", tipo: "enum", values: ["Hombre", "Mujer", "Ninos", "Unisex"], def: "Unisex" },
    { n: "imagen_url", tipo: "str", max: 255 },
    { n: "activo", tipo: "bool", def: 1 },
    { n: "id_categoria", tipo: "int", req: true, min: 1 }
];

module.exports = {

    getProductos: (req, res)=>{
        productoModel.getProductos(req.query, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            res.status(200).json({ok: true, total: result.length, data: result});
        });
    },

    getProductoById: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        productoModel.getProductoById(id, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.length === 0){
                return res.status(404).json({ok: false, error: 'Producto no encontrado'});
            }

            res.status(200).json({ok: true, data: result[0]});
        });
    },

    postProducto: (req, res)=>{
        const {errores, datos} = validar(campos, req.body, true);
        if(errores.length > 0){
            return res.status(400).json({ok: false, error: 'Datos invalidos', detalles: errores});
        }

        productoModel.postProducto(datos, (err, insertId)=>{
            if(err){
                return responderError(res, err);
            }

            res.status(201).json({ok: true, message: 'Producto creado correctamente', id_producto: insertId});
        });
    },

    putProducto: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        const {errores, datos} = validar(campos, req.body, false);
        if(errores.length > 0){
            return res.status(400).json({ok: false, error: 'Datos invalidos', detalles: errores});
        }

        productoModel.putProducto(id, datos, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.affectedRows === 0){
                return res.status(404).json({ok: false, error: 'Producto no encontrado'});
            }

            res.status(200).json({ok: true, message: 'Producto actualizado correctamente'});
        });
    },

    deleteProducto: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        productoModel.deleteProducto(id, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.affectedRows === 0){
                return res.status(404).json({ok: false, error: 'Producto no encontrado'});
            }

            res.status(200).json({ok: true, message: 'Producto eliminado correctamente'});
        });
    }

}
