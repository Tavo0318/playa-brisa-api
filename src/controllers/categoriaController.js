const categoriaModel = require('../models/categoriaModel');
// se realiza llamado al modelo
const { validar, validarId, responderError } = require('../config/utilidades');

// reglas de validacion de los datos que llegan en el body
const campos = [
    { n: "nombre", tipo: "str", req: true, max: 60 },
    { n: "descripcion", tipo: "str", max: 200 }
];

module.exports = {

    getCategorias: (req, res)=>{
        categoriaModel.getCategorias(req.query, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            res.status(200).json({ok: true, total: result.length, data: result});
        });
    },

    getCategoriaById: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        categoriaModel.getCategoriaById(id, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.length === 0){
                return res.status(404).json({ok: false, error: 'Categoria no encontrado'});
            }

            res.status(200).json({ok: true, data: result[0]});
        });
    },

    postCategoria: (req, res)=>{
        const {errores, datos} = validar(campos, req.body, true);
        if(errores.length > 0){
            return res.status(400).json({ok: false, error: 'Datos invalidos', detalles: errores});
        }

        categoriaModel.postCategoria(datos, (err, insertId)=>{
            if(err){
                return responderError(res, err);
            }

            res.status(201).json({ok: true, message: 'Categoria creado correctamente', id_categoria: insertId});
        });
    },

    putCategoria: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        const {errores, datos} = validar(campos, req.body, false);
        if(errores.length > 0){
            return res.status(400).json({ok: false, error: 'Datos invalidos', detalles: errores});
        }

        categoriaModel.putCategoria(id, datos, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.affectedRows === 0){
                return res.status(404).json({ok: false, error: 'Categoria no encontrado'});
            }

            res.status(200).json({ok: true, message: 'Categoria actualizado correctamente'});
        });
    },

    deleteCategoria: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        categoriaModel.deleteCategoria(id, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.affectedRows === 0){
                return res.status(404).json({ok: false, error: 'Categoria no encontrado'});
            }

            res.status(200).json({ok: true, message: 'Categoria eliminado correctamente'});
        });
    }

}
