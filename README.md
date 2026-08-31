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
│   │   │   ├── productos.routes.js
│   │   │   ├── carrito.routes.js
│   │   │   ├── pedidos.routes.js
│   │   │   └── resenas.routes.js
│   │   ├── controllers/           # lógica de cada endpoint
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js # verifica JWT en rutas protegidas
│   │   └── db.js                  # conexión a SQLite
│   ├── huertohogar.db             # generado localmente (gitignored)
│   ├── .env
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

- **usuarios** (`id`, `email`, `password_hash`, `nombre`, `direccion`, `telefono`)
- **productos** (`id`, `codigo`, `nombre`, `categoria`, `precio`, `stock`, `descripcion`, `origen`)
- **carritos** (`id`, `usuario_id`) → **carrito_items** (`id`, `carrito_id`, `producto_id`, `cantidad`)
- **pedidos** (`id`, `usuario_id`, `estado`, `fecha_entrega`, `total`) → **pedido_items** (`id`, `pedido_id`, `producto_id`, `cantidad`, `precio_unitario`)
- **resenas** (`id`, `producto_id`, `usuario_id`, `calificacion`, `comentario`)

`pedido_items` guarda copia del precio al momento de la compra (no referencia el precio actual del producto), para que el historial de pedidos no cambie si el precio del producto se actualiza después.

---

## 6. Flujo de trabajo con Git

- **GitHub Flow simplificado:** `main` protegida (sin commits directos), una rama por tarea (`feature/carrito-compras`, `feature/catalogo-filtros`, `docs/ers`, `fix/login-validacion`).
- **Conventional Commits:** `feat:`, `fix:`, `docs:`, `style:`, `refactor:`.

### Reglas prácticas
1. `git pull` antes de empezar a trabajar cada sesión.
2. Nunca `git push --force` a `main`.
3. Si hay que tocar un archivo compartido (rutas del servidor, esquema de la base de datos), avisar antes en el chat del equipo.
5. El archivo `huertohogar.db` va en `.gitignore` — cada integrante lo genera localmente corriendo `npm run seed`, así se evitan conflictos de merge en un archivo binario compartido.

---

## 7. División de tareas

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

