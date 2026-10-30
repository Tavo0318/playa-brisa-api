const clienteModel = require('../models/clienteModel');
// se realiza llamado al modelo
const { validar, validarId, responderError } = require('../config/utilidades');

// reglas de validacion de los datos que llegan en el body
const campos = [
    { n: "documento", tipo: "str", req: true, max: 15 },
    { n: "nombre", tipo: "str", req: true, max: 60 },
    { n: "apellido", tipo: "str", req: true, max: 60 },
    { n: "email", tipo: "email", req: true, max: 100 },
    { n: "telefono", tipo: "str", max: 15 },
    { n: "ciudad", tipo: "str", max: 60 }
];

module.exports = {

    getClientes: (req, res)=>{
        clienteModel.getClientes(req.query, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            res.status(200).json({ok: true, total: result.length, data: result});
        });
    },

    getClienteById: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        clienteModel.getClienteById(id, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.length === 0){
                return res.status(404).json({ok: false, error: 'Cliente no encontrado'});
            }

            res.status(200).json({ok: true, data: result[0]});
        });
    },

    postCliente: (req, res)=>{
        const {errores, datos} = validar(campos, req.body, true);
        if(errores.length > 0){
            return res.status(400).json({ok: false, error: 'Datos invalidos', detalles: errores});
        }

        clienteModel.postCliente(datos, (err, insertId)=>{
            if(err){
                return responderError(res, err);
            }

            res.status(201).json({ok: true, message: 'Cliente creado correctamente', id_cliente: insertId});
        });
    },

    putCliente: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        const {errores, datos} = validar(campos, req.body, false);
        if(errores.length > 0){
            return res.status(400).json({ok: false, error: 'Datos invalidos', detalles: errores});
        }

        clienteModel.putCliente(id, datos, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.affectedRows === 0){
                return res.status(404).json({ok: false, error: 'Cliente no encontrado'});
            }

            res.status(200).json({ok: true, message: 'Cliente actualizado correctamente'});
        });
    },

    deleteCliente: (req, res)=>{
        const id = validarId(req.params.id);
        if(!id){
            return res.status(400).json({ok: false, error: 'El id debe ser un numero entero positivo'});
        }

        clienteModel.deleteCliente(id, (err, result)=>{
            if(err){
                return responderError(res, err);
            }

            if(result.affectedRows === 0){
                return res.status(404).json({ok: false, error: 'Cliente no encontrado'});
            }

            res.status(200).json({ok: true, message: 'Cliente eliminado correctamente'});
        });
    }

}
