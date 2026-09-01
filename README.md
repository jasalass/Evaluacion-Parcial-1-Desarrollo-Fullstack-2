# HuertoHogar — Tienda Online

Evaluación Parcial 1 — Desarrollo Fullstack 2 (DSY1104)
Equipo: [Nombre 1] y [Nombre 2]

## 1. Descripción del proyecto

Tienda online para HuertoHogar según el caso entregado por el docente: registro/autenticación de usuarios, gestión de perfil, catálogo de productos con filtros, carrito de compras, procesamiento y seguimiento de pedidos, y reseñas/calificaciones. El diseño visual (colores, tipografías, categorías y los 9 productos) está definido en el enunciado (`docs/DSY1104 - Forma A tienda HUERTO HOGAR.pdf`).

Además de la aplicación, el proyecto entrega:
- `docs/` — Anexo 2/3 (Planilla de Requerimientos) y Anexo 4 (ERS, estándar IEEE 830), completados por el equipo.

---

## 2. Arquitectura general

Arquitectura cliente-servidor de dos capas, comunicadas por una API REST sobre JSON:

```
┌─────────────────────┐        HTTP / fetch (JSON)        ┌──────────────────────┐
│   client/            │  ───────────────────────────────▶ │   server/             │
│   HTML + CSS + JS     │                                    │   Node.js + Express    │
│   (sin framework)      │  ◀─────────────────────────────── │   API REST             │
└─────────────────────┘                                    └──────────┬───────────┘
                                                                          │
                                                                          ▼
                                                              ┌──────────────────────┐
                                                              │   SQLite (archivo)     │
                                                              │   huertohogar.db       │
                                                              └──────────────────────┘
```

- El **frontend** no tiene lógica de negocio ni acceso a datos: solo arma la interfaz y llama a la API vía `fetch`.
- El **backend** concentra toda la lógica (validaciones, autenticación, reglas de negocio) y es el único que habla con la base de datos.
- La **base de datos** es un único archivo SQLite local, sin servidor externo que instalar.
- La autenticación se maneja con **JWT**: el backend entrega un token al hacer login, el frontend lo guarda y lo envía en el header `Authorization` en cada request a rutas protegidas (perfil, carrito, pedidos, reseñas).

---

## 3. Stack tecnológico

**Backend**
- Node.js + Express — servidor y ruteo de la API REST.
- SQLite (`better-sqlite3` o el módulo nativo `node:sqlite`) — base de datos local en un solo archivo.
- `bcrypt` — hash de contraseñas.
- `jsonwebtoken` — generación y verificación de tokens de sesión.
- `dotenv` — variables de entorno (puerto, secreto JWT).

**Frontend**
- HTML5, CSS3 y JavaScript puro (ES modules), sin frameworks.
- `fetch` para consumir la API.

**Herramientas de desarrollo**
- `nodemon` para recarga automática del servidor en desarrollo.

---

## 4. Estructura del proyecto

```
/
├── server/
│   ├── src/
│   │   ├── index.js               # arranque del servidor Express
│   │   ├── db/
│   │   │   ├── schema.sql         # definición de tablas
│   │   │   └── seed.js            # carga inicial: 9 productos del enunciado
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── categorias.routes.js
│   │   │   ├── productos.routes.js    # incluye /:id/resenas
│   │   │   ├── carrito.routes.js
│   │   │   └── pedidos.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── categorias.controller.js
│   │   │   ├── productos.controller.js
│   │   │   ├── resenas.controller.js
│   │   │   ├── carrito.controller.js
│   │   │   └── pedidos.controller.js
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js     # verifica JWT en rutas protegidas
│   │   └── db.js                      # conexión a SQLite
│   ├── huertohogar.db             # generado localmente (gitignored)
│   ├── .env                       # copiar desde .env.example (gitignored)
│   ├── .env.example
│   └── package.json
│
├── client/
│   ├── index.html
│   ├── catalogo.html
│   ├── producto.html
│   ├── carrito.html
│   ├── perfil.html
│   ├── pedidos.html
│   ├── css/
│   │   └── styles.css             # paleta y tipografías del enunciado
│   ├── js/
│   │   ├── api.js                 # wrapper de fetch + manejo de token
│   │   ├── auth.js
│   │   ├── catalogo.js
│   │   ├── carrito.js
│   │   └── pedidos.js
│   └── assets/
│       └── img/
│
├── docs/                          # material del curso + ERS + planilla
└── README.md
```

---

## 5. Modelo de datos (SQLite)

Tablas principales y sus relaciones:

- **categorias** (`id`, `nombre`, `descripcion`) — las 4 categorías y descripciones oficiales del enunciado (Frutas Frescas, Verduras Orgánicas, Productos Orgánicos, Productos Lácteos).
- **usuarios** (`id`, `email`, `password_hash`, `nombre`, `direccion`, `telefono`, `creado_en`)
- **productos** (`id`, `codigo`, `nombre`, `categoria_id` → `categorias.id`, `precio`, `stock`, `unidad`, `descripcion`, `origen`)
- **carritos** (`id`, `usuario_id`) → **carrito_items** (`id`, `carrito_id`, `producto_id`, `cantidad`)
- **pedidos** (`id`, `usuario_id`, `estado`, `fecha_entrega`, `total`, `creado_en`) → **pedido_items** (`id`, `pedido_id`, `producto_id`, `cantidad`, `precio_unitario`)
- **resenas** (`id`, `producto_id`, `usuario_id`, `calificacion`, `comentario`, `creado_en`)

Notas de diseño:
- Cada usuario tiene un único carrito, creado automáticamente al registrarse.
- `pedido_items` guarda copia del precio al momento de la compra (no referencia el precio actual del producto), para que el historial de pedidos no cambie si el precio del producto se actualiza después.
- Al confirmar un pedido, el stock del producto se descuenta dentro de la misma transacción que crea el pedido; si algún ítem no tiene stock suficiente, no se crea nada.
- `estado` del pedido es uno de: `pendiente`, `en_preparacion`, `en_camino`, `entregado`.
- El esquema completo está en [`server/src/db/schema.sql`](server/src/db/schema.sql).

---

## 6. Backend — cómo levantarlo

Requisito: Node.js 18 o superior.

```bash
cd server
npm install
cp .env.example .env      # y editar JWT_SECRET
npm run seed               # crea las tablas y carga categorías + los 9 productos del enunciado
npm run dev                 # servidor con recarga automática (nodemon)
# o: npm start
```

El servidor queda escuchando en `http://localhost:3000` (configurable con `PORT` en `.env`). Todas las rutas están bajo el prefijo `/api`.

**Nota sobre los datos:** las 4 categorías (con su descripción) y 7 de los 9 productos vienen tal cual del enunciado. `PO003 - Quinua Orgánica` y `PL001 - Leche Entera` solo aparecían listadas por nombre en el PDF, sin precio/stock/descripción oficial — esos dos productos usan datos definidos por el equipo (mismo formato y rango de precios que el resto del catálogo). Si el docente entrega el dato real, se actualiza en `server/src/db/seed.js` y se corre `npm run seed` de nuevo.

---

## 7. Documentación de la API

Todas las respuestas son JSON. Las rutas marcadas 🔒 requieren header `Authorization: Bearer <token>` (token obtenido en registro/login).

### Auth — `/api/auth`

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| POST | `/registro` | `{ email, password, nombre }` | Crea usuario + carrito vacío. Devuelve `{ token, usuario }`. `password` mínimo 6 caracteres. `409` si el email ya existe. |
| POST | `/login` | `{ email, password }` | Devuelve `{ token, usuario }`. `401` si las credenciales no coinciden. |
| GET | `/perfil` 🔒 | — | Devuelve el usuario autenticado (`id, email, nombre, direccion, telefono`). |
| PUT | `/perfil` 🔒 | `{ nombre?, direccion?, telefono? }` | Actualiza solo los campos enviados. |

### Categorías — `/api/categorias`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Lista las 4 categorías con su `descripcion` (texto oficial del enunciado). |
| GET | `/:id` | Detalle de una categoría. `404` si no existe. |

### Productos — `/api/productos`

| Método | Ruta | Query / Body | Descripción |
|---|---|---|---|
| GET | `/` | `?categoria=`, `?q=` | Lista productos (con `categoria_id` y nombre de `categoria` incluidos). `categoria` filtra por nombre exacto (ej. `Frutas Frescas`), `q` busca por nombre (`LIKE`). |
| GET | `/:id` | — | Detalle de un producto. `404` si no existe. |
| GET | `/:id/resenas` | — | Lista reseñas del producto (incluye nombre del autor). |
| POST | `/:id/resenas` 🔒 | `{ calificacion, comentario? }` | Crea una reseña. `calificacion` entero 1-5. |

### Carrito — `/api/carrito` (todas 🔒, es el carrito del usuario del token)

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| GET | `/` | — | `{ items: [...], total }`, con subtotal por línea. |
| POST | `/items` | `{ producto_id, cantidad }` | Agrega el producto; si ya estaba en el carrito, suma la cantidad. Valida stock disponible. |
| PUT | `/items/:itemId` | `{ cantidad }` | Modifica la cantidad de una línea del carrito. |
| DELETE | `/items/:itemId` | — | Elimina una línea del carrito. |

### Pedidos — `/api/pedidos` (todas 🔒)

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| POST | `/` | `{ fecha_entrega? }` | Confirma el pedido con el contenido actual del carrito: valida stock, descuenta stock, crea `pedido` + `pedido_items`, vacía el carrito. `400` si el carrito está vacío o si falta stock. |
| GET | `/` | — | Lista los pedidos del usuario (sin detalle de ítems). |
| GET | `/:id` | — | Detalle de un pedido, incluyendo sus ítems. |
| PUT | `/:id/estado` | `{ estado }` | Actualiza el estado (`pendiente`\|`en_preparacion`\|`en_camino`\|`entregado`) — simula el seguimiento del envío. |

> No existe rol de administrador en este modelo simplificado: `PUT /:id/estado` lo llama el propio dueño del pedido para simular el avance del envío (pensado para poder demostrar el flujo de seguimiento sin construir un panel de administración aparte). Si el alcance del proyecto termina incluyendo un actor "Administrador" real, este endpoint es el que hay que mover detrás de una verificación de rol.

### Códigos de error comunes

- `400` — body inválido o regla de negocio no cumplida (stock insuficiente, carrito vacío, etc.), body: `{ error: "..." }`.
- `401` — falta el token, es inválido/expiró, o credenciales de login incorrectas.
- `404` — recurso no encontrado (o no pertenece al usuario autenticado, en carrito/pedidos).
- `409` — conflicto (email ya registrado).

---

## 8. Flujo de trabajo con Git

- **GitHub Flow simplificado:** `main` protegida (sin commits directos), una rama por tarea (`feature/carrito-compras`, `feature/catalogo-filtros`, `docs/ers`, `fix/login-validacion`).
- **Conventional Commits:** `feat:`, `fix:`, `docs:`, `style:`, `refactor:`.

### Reglas prácticas
1. `git pull` antes de empezar a trabajar cada sesión.
2. Nunca `git push --force` a `main`.
3. Si hay que tocar un archivo compartido (rutas del servidor, esquema de la base de datos), avisar antes en el chat del equipo.
4. El archivo `huertohogar.db` y `.env` van en `.gitignore` — cada integrante genera el suyo localmente (`npm run seed`), así se evitan conflictos de merge en un archivo binario compartido y no se sube el secreto JWT.

---

## 9. División de tareas

Reparto vertical por bloque de funcionalidad (cada uno hace su parte de backend + frontend), para minimizar que ambos toquen los mismos archivos al mismo tiempo:

**Persona A — Cuenta y catálogo**
- Registro y autenticación de usuarios
- Gestión de perfil (dirección, contacto)
- Catálogo de productos + filtros por categoría + búsqueda avanzada

**Persona B — Compra y postventa**
- Carrito de compras (agregar/quitar/modificar, totales)
- Confirmación de pedido + boleta
- Seguimiento de envío + fecha de entrega preferida
- Reseñas y calificaciones

Los "deseos" del enunciado (blog, fidelización, redes sociales, mapa de tiendas) quedan como extras, solo si el core ya está listo — el propio caso indica que el docente valida el alcance final.

---

