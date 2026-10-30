require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const categoriaRoutes = require('./src/routes/categoriaRoutes');
const tallaRoutes = require('./src/routes/tallaRoutes');
const productoRoutes = require('./src/routes/productoRoutes');
const productoTallaRoutes = require('./src/routes/productoTallaRoutes');
const clienteRoutes = require('./src/routes/clienteRoutes');
const pedidoRoutes = require('./src/routes/pedidoRoutes');
const detallePedidoRoutes = require('./src/routes/detallePedidoRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// CORS: permite que el sitio WordPress (otro dominio) consuma esta API
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(204);
    }
    next();
});

// Ruta raiz: sirve para comprobar que la API esta viva
app.get('/', (req, res)=>{
    res.status(200).json({
        ok: true,
        api: 'API Tienda de ropa de playa - Playa Brisa',
        endpoints: ['/api/categorias', '/api/tallas', '/api/productos', '/api/producto-tallas', '/api/clientes', '/api/pedidos', '/api/detalle-pedidos']
    });
});

//Rutas
app.use('/api/categorias', categoriaRoutes);
app.use('/api/tallas', tallaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/producto-tallas', productoTallaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/detalle-pedidos', detallePedidoRoutes);

// Ruta no encontrada
app.use((req, res)=>{
    res.status(404).json({ok: false, error: 'Ruta no encontrada'});
});

// JSON mal formado u otros errores no controlados
app.use((err, req, res, next)=>{
    if(err.type === 'entity.parse.failed'){
        return res.status(400).json({ok: false, error: 'El JSON enviado esta mal formado'});
    }
    res.status(500).json({ok: false, error: 'Error interno del servidor'});
});

//iniciar el servidor
app.listen(port, ()=>{
    console.log("Servidor iniciado en http://localhost:" + port);
});
