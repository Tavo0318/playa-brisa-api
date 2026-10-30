const db = require('../config/dbConfig');
// se llama a la configuracion de la bd

class producto{

    // filtros: objeto opcional con condiciones, ej. { genero: 'Hombre' }
    getProductos(filtros, callback){
        let sql = "select p.id_producto, p.codigo, p.nombre, p.descripcion, p.precio, p.genero, p.imagen_url, p.activo, p.id_categoria, c.nombre as categoria from producto p inner join categoria c on c.id_categoria = p.id_categoria";
        const valores = [];
        const permitidos = ['genero','id_categoria','activo'];
        const condiciones = [];
        permitidos.forEach((campo) => {
            if (filtros && filtros[campo] !== undefined){
                condiciones.push("p." + campo + " = ?");
                valores.push(String(filtros[campo]));
            }
        });
        if (condiciones.length > 0){
            sql += " where " + condiciones.join(" and ");
        }
        sql += " order by p.id_producto";
        db.query(sql, valores, callback);
    }

    getProductoById(id, callback){
        const sql = "select p.id_producto, p.codigo, p.nombre, p.descripcion, p.precio, p.genero, p.imagen_url, p.activo, p.id_categoria, c.nombre as categoria from producto p inner join categoria c on c.id_categoria = p.id_categoria where p.id_producto = ?";
        db.query(sql, [id], callback);
    }

    postProducto(d, callback){
        const sql = 'insert into producto(codigo, nombre, descripcion, precio, genero, imagen_url, activo, id_categoria) values (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [d.codigo, d.nombre, d.descripcion, d.precio, d.genero, d.imagen_url, d.activo, d.id_categoria], (err, result)=>{
            if(err){
                return callback(err, null);
            }

            callback(null, result.insertId);
        });
    }

    putProducto(id, d, callback){
        const sql = 'update producto set codigo = ?, nombre = ?, descripcion = COALESCE(?, descripcion), precio = ?, genero = COALESCE(?, genero), imagen_url = COALESCE(?, imagen_url), activo = COALESCE(?, activo), id_categoria = ? where id_producto = ?';
        db.query(sql, [d.codigo, d.nombre, d.descripcion, d.precio, d.genero, d.imagen_url, d.activo, d.id_categoria, id], callback);
    }

    deleteProducto(id, callback){
        const sql = 'delete from producto where id_producto = ?';
        db.query(sql, [id], callback);
    }

}

module.exports = new producto();
