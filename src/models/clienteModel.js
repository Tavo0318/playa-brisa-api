const db = require('../config/dbConfig');
// se llama a la configuracion de la bd

class cliente{

    // filtros: objeto opcional con condiciones, ej. { genero: 'Hombre' }
    getClientes(filtros, callback){
        let sql = "select cl.id_cliente, cl.documento, cl.nombre, cl.apellido, cl.email, cl.telefono, cl.ciudad from cliente cl";
        const valores = [];
        const permitidos = ['ciudad'];
        const condiciones = [];
        permitidos.forEach((campo) => {
            if (filtros && filtros[campo] !== undefined){
                condiciones.push("cl." + campo + " = ?");
                valores.push(String(filtros[campo]));
            }
        });
        if (condiciones.length > 0){
            sql += " where " + condiciones.join(" and ");
        }
        sql += " order by cl.id_cliente";
        db.query(sql, valores, callback);
    }

    getClienteById(id, callback){
        const sql = "select cl.id_cliente, cl.documento, cl.nombre, cl.apellido, cl.email, cl.telefono, cl.ciudad from cliente cl where cl.id_cliente = ?";
        db.query(sql, [id], callback);
    }

    postCliente(d, callback){
        const sql = 'insert into cliente(documento, nombre, apellido, email, telefono, ciudad) values (?, ?, ?, ?, ?, ?)';
        db.query(sql, [d.documento, d.nombre, d.apellido, d.email, d.telefono, d.ciudad], (err, result)=>{
            if(err){
                return callback(err, null);
            }

            callback(null, result.insertId);
        });
    }

    putCliente(id, d, callback){
        const sql = 'update cliente set documento = ?, nombre = ?, apellido = ?, email = ?, telefono = COALESCE(?, telefono), ciudad = COALESCE(?, ciudad) where id_cliente = ?';
        db.query(sql, [d.documento, d.nombre, d.apellido, d.email, d.telefono, d.ciudad, id], callback);
    }

    deleteCliente(id, callback){
        const sql = 'delete from cliente where id_cliente = ?';
        db.query(sql, [id], callback);
    }

}

module.exports = new cliente();
