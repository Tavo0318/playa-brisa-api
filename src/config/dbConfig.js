const mysql = require('mysql');
require('dotenv').config();
// Los datos de conexion se leen de las variables de entorno (archivo .env),
// asi las credenciales NO quedan escritas en el codigo ni en GitHub.

// Se usa un "pool" (grupo de conexiones) porque en la nube las conexiones
// sueltas se cierran por inactividad. Funciona igual que createConnection:
// db.query(sql, valores, callback)
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tienda_playa',
    port: Number(process.env.DB_PORT) || 3306,
    // Clever Cloud (plan gratis) permite pocas conexiones simultaneas
    connectionLimit: Number(process.env.DB_CONN_LIMIT) || 4,
    charset: 'utf8mb4'
});

// Prueba de conexion al arrancar
db.getConnection((err, connection)=>{
    if(err){
        console.log("Error de conexion MYSQL: " + err.message);
        return;
    }
    console.log("Conexion MYSQL exitosa ");
    connection.release();
});

module.exports = db;
