# API Playa Brisa – Tienda de ropa de playa

API REST desarrollada con **Node.js + Express** y base de datos **MySQL** alojada en **Clever Cloud**. Incluye CRUD completo para las 7 tablas del sistema de la tienda.

- **URL pública (Render):** https://playa-brisa-api.onrender.com/
- **Repositorio:** https://github.com/Tavo0318/playa-brisa-api
- **Proyecto:** Taller individual – Corte 3 (40%)
- **Estudiante:** Gustavo Piña Beltran

> Nota: el plan gratuito de Render "duerme" el servicio tras un rato sin uso. La primera petición puede tardar hasta un minuto en responder.

## Tecnologías

- Node.js y Express
- MySQL (mysql2) en Clever Cloud
- dotenv para las variables de entorno
- Render para el despliegue

## Base de datos

7 tablas: `categoria`, `talla`, `producto`, `producto_talla`, `cliente`, `pedido` y `detalle_pedido`.

## Endpoints

Todas las tablas tienen las mismas 5 operaciones:

| Método | Ruta | Acción |
|--------|------|--------|
| GET | `/api/<recurso>` | Listar todos |
| GET | `/api/<recurso>/:id` | Consultar uno por id |
| POST | `/api/<recurso>` | Crear |
| PUT | `/api/<recurso>/:id` | Actualizar |
| DELETE | `/api/<recurso>/:id` | Eliminar |

Recursos disponibles:

| Recurso | Tabla |
|---------|-------|
| `/api/categorias` | categoria |
| `/api/tallas` | talla |
| `/api/productos` | producto |
| `/api/producto-tallas` | producto_talla |
| `/api/clientes` | cliente |
| `/api/pedidos` | pedido |
| `/api/detalle-pedidos` | detalle_pedido |

### Ejemplo: listar productos

```
GET https://playa-brisa-api.onrender.com/api/productos
```

### Ejemplo: crear un producto

```
POST https://playa-brisa-api.onrender.com/api/productos
Content-Type: application/json

{
  "codigo": "PB-TST-013",
  "nombre": "Bikini Palmeras Verde",
  "descripcion": "Bikini de dos piezas con estampado de palmeras",
  "precio": 175000,
  "genero": "Mujer",
  "imagen_url": "https://picsum.photos/seed/pb013/600/750",
  "activo": 1,
  "id_categoria": 2
}
```

### Respuestas y códigos de estado

| Código | Significado |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Registro creado |
| 404 | Registro no encontrado |
| 409 | Valor único repetido (por ejemplo, un código de producto duplicado) |

## Instalación local

1. Clonar el repositorio:

   ```
   git clone https://github.com/Tavo0318/playa-brisa-api.git
   cd playa-brisa-api
   ```

2. Instalar las dependencias:

   ```
   npm install
   ```

3. Crear un archivo `.env` en la raíz (puedes copiar `.env.example`) con estas variables:

   ```
   DB_HOST=
   DB_USER=
   DB_PASSWORD=
   DB_NAME=
   DB_PORT=3306
   ```

4. Iniciar el servidor:

   ```
   node index.js
   ```

   La API queda disponible en http://localhost:3000

## Despliegue en Render

- **Build Command:** `npm install`
- **Start Command:** `node index.js`
- Las variables `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` y `DB_PORT` se configuran en la sección *Environment Variables* de Render. El archivo `.env` no se sube a GitHub.

## Estructura del proyecto

```
02_api/
├── index.js
├── package.json
├── .env.example
└── src/
    ├── config/        (conexión a la base de datos)
    ├── models/
    ├── controllers/
    └── routes/
```

## Pruebas

Las pruebas del CRUD de la tabla `producto` se hicieron con Insomnia y están documentadas en la carpeta `03_postman` de la entrega.
