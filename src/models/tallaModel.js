const db = require('../config/dbConfig');
// se llama a la configuracion de la bd

class talla{

    // filtros: objeto opcional con condiciones, ej. { genero: 'Hombre' }
    getTallas(filtros, callback){
        let sql = "select t.id_talla, t.nombre, t.tipo from talla t";
        const valores = [];
        const permitidos = [];
        const condiciones = [];
        permitidos.forEach((campo) => {
            if (filtros && filtros[campo] !== undefined){
                condiciones.push("t." + campo + " = ?");
                valores.push(String(filtros[campo]));
            }
        });
        if (condiciones.length > 0){
            sql += " where " + condiciones.join(" and ");
        }
        sql += " order by t.id_talla";
        db.query(sql, valores, callback);
    }

    getTallaById(id, callback){
        const sql = "select t.id_talla, t.nombre, t.tipo from talla t where t.id_talla = ?";
        db.query(sql, [id], callback);
    }

    postTalla(d, callback){
        const sql = 'insert into talla(nombre, tipo) values (?, ?)';
        db.query(sql, [d.nombre, d.tipo], (err, result)=>{
            if(err){
                return callback(err, null);
            }

            callback(null, result.insertId);
        });
    }

    putTalla(id, d, callback){
        const sql = 'update talla set nombre = ?, tipo = COALESCE(?, tipo) where id_talla = ?';
        db.query(sql, [d.nombre, d.tipo, id], callback);
    }

    deleteTalla(id, callback){
        const sql = 'delete from talla where id_talla = ?';
        db.query(sql, [id], callback);
    }

}

module.exports = new talla();
