// Funciones de apoyo compartidas por todos los controladores:
//   validar()        -> valida los datos de entrada (body)
//   validarId()      -> valida el id que llega por la URL
//   responderError() -> traduce errores de MySQL a respuestas HTTP claras

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_FECHA = /^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2}(:\d{2})?)?$/;

function fechaActual(){
    const f = new Date();
    const dos = (n) => String(n).padStart(2, '0');
    return f.getFullYear() + '-' + dos(f.getMonth() + 1) + '-' + dos(f.getDate()) + ' ' +
           dos(f.getHours()) + ':' + dos(f.getMinutes()) + ':' + dos(f.getSeconds());
}

// crear = true  (POST): los campos opcionales toman su valor por defecto
// crear = false (PUT) : los campos opcionales que no se envian quedan en null
//                       y el modelo los deja sin cambios (COALESCE)
function validar(campos, body, crear){
    const errores = [];
    const datos = {};
    body = body || {};

    campos.forEach((c) => {
        let v = body[c.n];
        const vacio = (v === undefined || v === null || v === '');

        if(vacio){
            if(c.req){
                errores.push('El campo "' + c.n + '" es obligatorio');
            }
            else if(crear && c.def !== undefined){
                datos[c.n] = (c.def === 'NOW') ? fechaActual() : c.def;
            }
            else{
                datos[c.n] = null;
            }
            return;
        }

        switch(c.tipo){
            case 'str':
            case 'email':
                if(typeof v !== 'string'){
                    errores.push('El campo "' + c.n + '" debe ser texto');
                    return;
                }
                v = v.trim();
                if(v.length === 0){
                    errores.push('El campo "' + c.n + '" no puede estar vacio');
                    return;
                }
                if(c.max && v.length > c.max){
                    errores.push('El campo "' + c.n + '" admite maximo ' + c.max + ' caracteres');
                    return;
                }
                if(c.tipo === 'email' && !REGEX_EMAIL.test(v)){
                    errores.push('El campo "' + c.n + '" no es un correo valido');
                    return;
                }
                break;

            case 'int':
            case 'num':
                v = Number(v);
                if(!Number.isFinite(v) || (c.tipo === 'int' && !Number.isInteger(v))){
                    errores.push('El campo "' + c.n + '" debe ser un numero' + (c.tipo === 'int' ? ' entero' : ''));
                    return;
                }
                if(c.min !== undefined && v < c.min){
                    errores.push('El campo "' + c.n + '" debe ser mayor o igual a ' + c.min);
                    return;
                }
                break;

            case 'enum':
                if(!c.values.includes(v)){
                    errores.push('El campo "' + c.n + '" debe ser uno de: ' + c.values.join(', '));
                    return;
                }
                break;

            case 'bool':
                if(v === true || v === 1 || v === '1' || v === 'true'){
                    v = 1;
                }
                else if(v === false || v === 0 || v === '0' || v === 'false'){
                    v = 0;
                }
                else{
                    errores.push('El campo "' + c.n + '" debe ser 0 o 1');
                    return;
                }
                break;

            case 'fecha':
                if(typeof v !== 'string' || !REGEX_FECHA.test(v)){
                    errores.push('El campo "' + c.n + '" debe tener formato AAAA-MM-DD HH:MM:SS');
                    return;
                }
                v = v.replace('T', ' ');
                break;
        }

        datos[c.n] = v;
    });

    return { errores, datos };
}

function validarId(valor){
    const id = Number(valor);
    return (Number.isInteger(id) && id > 0) ? id : null;
}

function responderError(res, err){
    switch(err.code){
        case 'ER_DUP_ENTRY':
            return res.status(409).json({ok: false, error: 'Ya existe un registro con ese valor unico (codigo, correo, documento o nombre repetido)'});
        case 'ER_NO_REFERENCED_ROW_2':
        case 'ER_NO_REFERENCED_ROW':
            return res.status(400).json({ok: false, error: 'Una llave foranea no existe: el registro relacionado no se encontro'});
        case 'ER_ROW_IS_REFERENCED_2':
        case 'ER_ROW_IS_REFERENCED':
            return res.status(409).json({ok: false, error: 'No se puede eliminar o modificar: otros registros dependen de este'});
        case 'ER_BAD_NULL_ERROR':
        case 'ER_DATA_TOO_LONG':
        case 'ER_TRUNCATED_WRONG_VALUE':
        case 'ER_WRONG_VALUE_COUNT_ON_ROW':
            return res.status(400).json({ok: false, error: 'Datos invalidos para la base de datos'});
        default:
            console.error(err);
            return res.status(500).json({ok: false, error: 'Error interno del servidor'});
    }
}

module.exports = { validar, validarId, responderError };
