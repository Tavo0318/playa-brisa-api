const db = require('../config/dbConfig');
// se llama a la configuracion de la bd

class categoria{

    // filtros: objeto opcional con condiciones, ej. { genero: 'Hombre' }
    getCategorias(filtros, callback){
        let sql = "select c.id_categoria, c.nombre, c.descripcion from categoria c";
        const valores = [];
        const permitidos = [];
        const condiciones = [];
        permitidos.forEach((campo) => {
            if (filtros && filtros[campo] !== undefined){
                condiciones.push("c." + campo + " = ?");
                valores.push(String(filtros[campo]));
            }
        });
        if (condiciones.length > 0){
            sql += " where " + condiciones.join(" and ");
        }
        sql += " order by c.id_categoria";
        db.query(sql, valores, callback);
    }

    getCategoriaById(id, callback){
        const sql = "select c.id_categoria, c.nombre, c.descripcion from categoria c where c.id_categoria = ?";
        db.query(sql, [id], callback);
    }

    postCategoria(d, callback){
        const sql = 'insert into categoria(nombre, descripcion) values (?, ?)';
        db.query(sql, [d.nombre, d.descripcion], (err, result)=>{
            if(err){
                return callback(err, null);
            }

            callback(null, result.insertId);
        });
    }

    putCategoria(id, d, callback){
        const sql = 'update categoria set nombre = ?, descripcion = COALESCE(?, descripcion) where id_categoria = ?';
        db.query(sql, [d.nombre, d.descripcion, id], callback);
    }

    deleteCategoria(id, callback){
        const sql = 'delete from categoria where id_categoria = ?';
        db.query(sql, [id], callback);
    }

}

module.exports = new categoria();
