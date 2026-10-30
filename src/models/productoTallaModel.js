const db = require('../config/dbConfig');
// se llama a la configuracion de la bd

class productoTalla{

    // filtros: objeto opcional con condiciones, ej. { genero: 'Hombre' }
    getProductoTallas(filtros, callback){
        let sql = "select pt.id_producto_talla, pt.id_producto, pr.nombre as producto, pt.id_talla, t.nombre as talla, pt.stock from producto_talla pt inner join producto pr on pr.id_producto = pt.id_producto inner join talla t on t.id_talla = pt.id_talla";
        const valores = [];
        const permitidos = ['id_producto','id_talla'];
        const condiciones = [];
        permitidos.forEach((campo) => {
            if (filtros && filtros[campo] !== undefined){
                condiciones.push("pt." + campo + " = ?");
                valores.push(String(filtros[campo]));
            }
        });
        if (condiciones.length > 0){
            sql += " where " + condiciones.join(" and ");
        }
        sql += " order by pt.id_producto_talla";
        db.query(sql, valores, callback);
    }

    getProductoTallaById(id, callback){
        const sql = "select pt.id_producto_talla, pt.id_producto, pr.nombre as producto, pt.id_talla, t.nombre as talla, pt.stock from producto_talla pt inner join producto pr on pr.id_producto = pt.id_producto inner join talla t on t.id_talla = pt.id_talla where pt.id_producto_talla = ?";
        db.query(sql, [id], callback);
    }

    postProductoTalla(d, callback){
        const sql = 'insert into producto_talla(id_producto, id_talla, stock) values (?, ?, ?)';
        db.query(sql, [d.id_producto, d.id_talla, d.stock], (err, result)=>{
            if(err){
                return callback(err, null);
            }

            callback(null, result.insertId);
        });
    }

    putProductoTalla(id, d, callback){
        const sql = 'update producto_talla set id_producto = ?, id_talla = ?, stock = COALESCE(?, stock) where id_producto_talla = ?';
        db.query(sql, [d.id_producto, d.id_talla, d.stock, id], callback);
    }

    deleteProductoTalla(id, callback){
        const sql = 'delete from producto_talla where id_producto_talla = ?';
        db.query(sql, [id], callback);
    }

}

module.exports = new productoTalla();
