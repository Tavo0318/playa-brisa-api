# API REST - Tienda de ropa de playa "Playa Brisa"

API construida con **Node.js + Express + MySQL** (base de datos en la nube).
Sigue la estructura del docente: `config` -> `models` -> `controllers` -> `routes` -> `index.js`.

## Estructura del proyecto

```
api/
├── index.js                  # servidor Express, body-parser, CORS y montaje de rutas
├── package.json
├── .env.example              # plantilla de variables de entorno (el .env real NO se sube)
└── src/
    ├── config/
    │   ├── dbConfig.js       # conexion MySQL (lee variables de entorno)
    │   └── utilidades.js     # validacion de datos y manejo de errores
    ├── models/               # consultas SQL (un archivo por tabla)
    ├── controllers/          # logica + respuestas JSON + codigos HTTP
    └── routes/               # endpoints de cada tabla
```

## Requisitos

- Node.js 18 o superior (LTS)
- Una base de datos MySQL creada con el script `tienda_playa.sql`

## Instalacion y ejecucion

```bash
npm install                 # instala express, mysql, body-parser y dotenv
cp .env.example .env        # (Windows: copy .env.example .env) y edita los datos
npm start                   # servidor en http://localhost:3000
```

## Variables de entorno

| Variable | Descripcion |
|---|---|
| `DB_HOST` | Host del servidor MySQL en la nube |
| `DB_PORT` | Puerto (3306 por defecto) |
| `DB_USER` | Usuario |
| `DB_PASSWORD` | Contrasena |
| `DB_NAME` | Nombre de la base de datos |
| `DB_CONN_LIMIT` | Conexiones simultaneas (4 en el plan gratis de Clever Cloud) |
| `PORT` | Puerto del servidor (lo define Render automaticamente) |

## Formato de las respuestas (siempre JSON)

```json
{ "ok": true,  "total": 12, "data": [ ... ] }                  // listas
{ "ok": true,  "data": { ... } }                                // un registro
{ "ok": true,  "message": "Producto creado correctamente", "id_producto": 13 }
{ "ok": false, "error": "Producto no encontrado" }              // errores
{ "ok": false, "error": "Datos invalidos", "detalles": ["..."] }
```

| Codigo | Cuando |
|---|---|
| 200 | Consulta, actualizacion o eliminacion correcta |
| 201 | Registro creado |
| 400 | Datos invalidos, id mal formado o llave foranea inexistente |
| 404 | Registro o ruta no encontrados |
| 409 | Valor UNIQUE repetido, o no se puede borrar porque otros registros dependen de el |
| 500 | Error interno |

## Endpoints (CRUD completo en cada tabla)

Cada recurso tiene los mismos 5 endpoints:

| Metodo | Ruta | Accion |
|---|---|---|
| GET | `/api/{recurso}` | Listar todos (acepta filtros por query string) |
| GET | `/api/{recurso}/:id` | Obtener uno por id |
| POST | `/api/{recurso}` | Crear (body JSON) |
| PUT | `/api/{recurso}/:id` | Actualizar (body JSON) |
| DELETE | `/api/{recurso}/:id` | Eliminar |

| Recurso | Tabla | Campos del body (* obligatorio) | Filtros GET |
|---|---|---|---|
| `categorias` | categoria | nombre*, descripcion | - |
| `tallas` | talla | nombre*, tipo (LETRA/NUMERO/UNICA) | - |
| `productos` | producto | codigo*, nombre*, precio*, id_categoria*, descripcion, genero (Hombre/Mujer/Ninos/Unisex), imagen_url, activo (0/1) | genero, id_categoria, activo |
| `producto-tallas` | producto_talla | id_producto*, id_talla*, stock | id_producto, id_talla |
| `clientes` | cliente | documento*, nombre*, apellido*, email*, telefono, ciudad | ciudad |
| `pedidos` | pedido | id_cliente*, fecha_pedido (AAAA-MM-DD HH:MM:SS), estado (Pendiente/Pagado/Enviado/Entregado/Cancelado) | id_cliente, estado |
| `detalle-pedidos` | detalle_pedido | id_pedido*, id_producto*, id_talla*, precio_unitario*, cantidad | id_pedido |

Ejemplos:

```
GET    /api/productos
GET    /api/productos?genero=Hombre
GET    /api/productos/3
POST   /api/productos      {"codigo":"PB-BKN-013","nombre":"Bikini Menta","precio":175000,"id_categoria":2,"genero":"Mujer"}
PUT    /api/productos/13   {"codigo":"PB-BKN-013","nombre":"Bikini Menta Pro","precio":180000,"id_categoria":2}
DELETE /api/productos/13
```

En `PUT`, los campos obligatorios deben enviarse; los opcionales que no se envien quedan sin cambios.

## Despliegue (Render)

1. Subir el codigo a GitHub (sin `.env` ni `node_modules`).
2. En Render: **New > Web Service** > conectar el repositorio.
3. Build Command: `npm install` - Start Command: `npm start`.
4. En **Environment** crear las variables `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_CONN_LIMIT`.
5. Probar `https://TU-API.onrender.com/api/productos`.

URL publica de la API: **https://TU-API.onrender.com** (completar al desplegar)
