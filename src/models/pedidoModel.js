const db = require('../config/dbConfig');
// se llama a la configuracion de la bd

class pedido{

    // filtros: objeto opcional con condiciones, ej. { genero: 'Hombre' }
    getPedidos(filtros, callback){
        let sql = "select pe.id_pedido, pe.id_cliente, concat(cl.nombre, ' ', cl.apellido) as cliente, pe.fecha_pedido, pe.estado from pedido pe inner join cliente cl on cl.id_cliente = pe.id_cliente";
        const valores = [];
        const permitidos = ['id_cliente','estado'];
        const condiciones = [];
        permitidos.forEach((campo) => {
            if (filtros && filtros[campo] !== undefined){
                condiciones.push("pe." + campo + " = ?");
                valores.push(String(filtros[campo]));
            }
        });
        if (condiciones.length > 0){
            sql += " where " + condiciones.join(" and ");
        }
        sql += " order by pe.id_pedido";
        db.query(sql, valores, callback);
    }

    getPedidoById(id, callback){
        const sql = "select pe.id_pedido, pe.id_cliente, concat(cl.nombre, ' ', cl.apellido) as cliente, pe.fecha_pedido, pe.estado from pedido pe inner join cliente cl on cl.id_cliente = pe.id_cliente where pe.id_pedido = ?";
        db.query(sql, [id], callback);
    }

    postPedido(d, callback){
        const sql = 'insert into pedido(id_cliente, fecha_pedido, estado) values (?, ?, ?)';
        db.query(sql, [d.id_cliente, d.fecha_pedido, d.estado], (err, result)=>{
            if(err){
                return callback(err, null);
            }

            callback(null, result.insertId);
        });
    }

    putPedido(id, d, callback){
        const sql = 'update pedido set id_cliente = ?, fecha_pedido = COALESCE(?, fecha_pedido), estado = COALESCE(?, estado) where id_pedido = ?';
        db.query(sql, [d.id_cliente, d.fecha_pedido, d.estado, id], callback);
    }

    deletePedido(id, callback){
        const sql = 'delete from pedido where id_pedido = ?';
        db.query(sql, [id], callback);
    }

}

module.exports = new pedido();
