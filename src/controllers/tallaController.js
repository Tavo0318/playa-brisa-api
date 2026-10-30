const tallaModel = require('../models/tallaModel');
// se realiza llamado al modelo
const { validar, validarId, responderError } = require('../config/utilidades');

// reglas de validacion de los datos que llegan en el body
const campos = [
    { n: "nombre", tipo: "str", req: true, max: 10 },
    { n: "tipo", tipo: "enum", values: ["LETRA", "NUMERO", "UNICA"], def: "LETRA" }
];

module.exports = {

    getTallas: (req, res)=>{
        tallaModel.getTallas(req.query, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            res.status(200).json({ok: true, total: result.length, data: result});
        });
    },

    getTallaById: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        tallaModel.getTallaById(id, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.length === 0){
                return res.status(404).json({ok: false, error: 'Talla no encontrado'});
            }

            res.status(200).json({ok: true, data: result[0]});
        });
    },

    postTalla: (req, res)=>{
        const {errores, datos} = validar(campos, req.body, true);
        if(errores.length > 0){
            return res.status(400).json({ok: false, error: 'Datos invalidos', detalles: errores});
        }

        tallaModel.postTalla(datos, (err, insertId)=>{
            if(err){
                return responderError(res, err);
            }

            res.status(201).json({ok: true, message: 'Talla creado correctamente', id_talla: insertId});
        });
    },

    putTalla: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        const {errores, datos} = validar(campos, req.body, false);
        if(errores.length > 0){
            return res.status(400).json({ok: false, error: 'Datos invalidos', detalles: errores});
        }

        tallaModel.putTalla(id, datos, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.affectedRows === 0){
                return res.status(404).json({ok: false, error: 'Talla no encontrado'});
            }

            res.status(200).json({ok: true, message: 'Talla actualizado correctamente'});
        });
    },

    deleteTalla: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        tallaModel.deleteTalla(id, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.affectedRows === 0){
                return res.status(404).json({ok: false, error: 'Talla no encontrado'});
            }

            res.status(200).json({ok: true, message: 'Talla eliminado correctamente'});
        });
    }

}
