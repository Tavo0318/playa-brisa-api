const db = require('../config/dbConfig');
// se llama a la configuracion de la bd

class detallePedido{

    // filtros: objeto opcional con condiciones, ej. { genero: 'Hombre' }
    getDetallePedidos(filtros, callback){
        let sql = "select d.id_detalle, d.id_pedido, d.id_producto, pr.nombre as producto, d.id_talla, t.nombre as talla, d.cantidad, d.precio_unitario from detalle_pedido d inner join producto pr on pr.id_producto = d.id_producto inner join talla t on t.id_talla = d.id_talla";
        const valores = [];
        const permitidos = ['id_pedido'];
        const condiciones = [];
        permitidos.forEach((campo) => {
            if (filtros && filtros[campo] !== undefined){
                condiciones.push("d." + campo + " = ?");
                valores.push(String(filtros[campo]));
            }
        });
        if (condiciones.length > 0){
            sql += " where " + condiciones.join(" and ");
        }
        sql += " order by d.id_detalle";
        db.query(sql, valores, callback);
    }

    getDetallePedidoById(id, callback){
        const sql = "select d.id_detalle, d.id_pedido, d.id_producto, pr.nombre as producto, d.id_talla, t.nombre as talla, d.cantidad, d.precio_unitario from detalle_pedido d inner join producto pr on pr.id_producto = d.id_producto inner join talla t on t.id_talla = d.id_talla where d.id_detalle = ?";
        db.query(sql, [id], callback);
    }

    postDetallePedido(d, callback){
        const sql = 'insert into detalle_pedido(id_pedido, id_producto, id_talla, cantidad, precio_unitario) values (?, ?, ?, ?, ?)';
        db.query(sql, [d.id_pedido, d.id_producto, d.id_talla, d.cantidad, d.precio_unitario], (err, result)=>{
            if(err){
                return callback(err, null);
            }

            callback(null, result.insertId);
        });
    }

    putDetallePedido(id, d, callback){
        const sql = 'update detalle_pedido set id_pedido = ?, id_producto = ?, id_talla = ?, cantidad = COALESCE(?, cantidad), precio_unitario = ? where id_detalle = ?';
        db.query(sql, [d.id_pedido, d.id_producto, d.id_talla, d.cantidad, d.precio_unitario, id], callback);
    }

    deleteDetallePedido(id, callback){
        const sql = 'delete from detalle_pedido where id_detalle = ?';
        db.query(sql, [id], callback);
    }

}

module.exports = new detallePedido();
