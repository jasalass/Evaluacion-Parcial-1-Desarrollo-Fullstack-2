# HuertoHogar — Mi primera tienda web

Evaluación Formativa N.° 1 — Desarrollo Fullstack 2 (DSY1104)
Equipo: [Nombre 1] y [Nombre 2]

## 1. Descripción del proyecto

Sitio de tienda en línea desarrollado con **HTML, CSS y JavaScript puro, sin servidor** (Experiencia de Aprendizaje 1: HTML semántico, hoja de estilos externa, validación de formularios y persistencia en `localStorage`).

Se optó por la **Vía B** del enunciado (caso adjunto como guía): el caso **HuertoHogar** (`docs/DSY1104 - Forma A tienda HUERTO HOGAR.pdf`), del cual se toman marca, paleta de colores, tipografías y catálogo de productos.

Documentos de referencia en `docs/`:
- `DSY1104 - Forma A tienda HUERTO HOGAR.pdf` — caso de negocio, paleta, tipografía y catálogo.
- `DSY1104 Evaluación Formativa 1 - Estudiante.pdf` — pauta de evaluación (indicadores de logro y criterios).
- `DSY1104 Evaluación Formativa 1 - Alcance Entrega (1).pdf` — alcance detallado, wireframes de las 4 vistas y reglas de validación.

La ERS (Especificación de Requisitos de Software) forma parte de la entrega y debe completarse en `docs/` antes de implementar, tal como pide el enunciado.

---

## 2. Alcance (resumen del enunciado)

Cuatro páginas HTML como mínimo, todas enlazadas entre sí y a la misma hoja de estilos:

| Archivo | Vista | Propósito |
|---|---|---|
| `index.html` | Inicio | Encabezado + hero + catálogo (8 productos) + video embebido + footer |
| `registro.html` | Registro | Formulario de cuenta nueva, validado en JS, persistido en `localStorage` |
| `login.html` | Inicio de sesión | Autenticación contra los usuarios guardados en `localStorage` |
| `carrito.html` | Carrito | Ver/modificar cantidades, cupón, total, botón Pagar (simulado) |

Reglas clave a no perder de vista (detalle completo en el PDF de alcance):
- HTML semántico: `header`, `nav`, `main`, `section`, `article`, `footer` — no `div` genéricos.
- Una sola hoja de estilos, en `assets/css/estilos.css` (no en la raíz, no estilos en línea).
- Catálogo con **8 productos** (no 9 — el caso HuertoHogar trae 9, hay que dejar fuera 1).
- Indicador `Cart (n)` visible y actualizado en las 4 páginas.
- Validaciones de formulario en JS con mensaje de error específico junto a cada campo (no un aviso genérico), y sugerencia de formato bajo cada campo.
- Sin pasarela de pago real: `Pagar` con carrito vacío muestra error; con ítems, confirma de forma simulada.
- Commits en español, descriptivos; repositorio público en GitHub.

---

## 3. Estructura del proyecto propuesta

```
/
├── index.html
├── registro.html
├── login.html
├── carrito.html
├── assets/
│   ├── css/
│   │   └── estilos.css        # única hoja de estilos, enlazada en las 4 páginas
│   └── js/
│       ├── storage.js         # helpers de localStorage (usuarios, sesión, carrito)
│       ├── productos.js       # catálogo estático de 8 productos + cupones
│       ├── layout.js          # actualiza el indicador Cart(n) en las 4 páginas
│       ├── index.js           # pinta el catálogo en index.html + "agregar al carrito"
│       ├── registro.js        # validación del formulario de registro
│       ├── login.js           # validación del formulario de login
│       └── carrito.js         # render del carrito, cantidades, cupón, pagar
├── docs/                      # material del curso + ERS completada
└── README.md
```

## 4. Estructura de datos en `localStorage`

Todo el estado de la app vive en tres claves de `localStorage`. El catálogo de productos **no** se guarda en `localStorage`: es una lista estática definida en `assets/js/productos.js` (no cambia en tiempo de ejecución), y el carrito solo guarda una referencia liviana a cada producto (`codigo` + `cantidad`).

### `huertohogar_usuarios` — array de cuentas registradas

```json
[
  {
    "nombre": "Ana Pérez",
    "email": "ana@correo.com",
    "password": "Clave123!",
    "telefono": "+56912345678",
    "region": "Región Metropolitana de Santiago",
    "comuna": "Santiago",
    "creadoEn": "2026-09-01T12:00:00.000Z"
  }
]
```

- `email` es la clave de unicidad (se guarda en minúsculas; el registro rechaza un email ya existente en el array).
- `password` se guarda en texto plano — **es una simplificación esperada en esta etapa**: no hay servidor ni librería de hash, y el enunciado solo pide persistir en `localStorage`. Se documenta como limitación conocida, no como práctica a replicar con un backend real.
- `telefono` puede ser `null` (campo opcional).

### `huertohogar_sesion` — usuario actualmente autenticado (o `null`)

```json
{
  "email": "ana@correo.com",
  "inicioEn": "2026-09-01T12:05:00.000Z"
}
```

- La ausencia de esta clave (o valor `null`) significa "sin sesión iniciada".
- Al hacer login válido se escribe; no hay logout explícito en el alcance mínimo, pero la clave se puede limpiar del mismo modo si se agrega.

### `huertohogar_carrito` — array de líneas del carrito

```json
[
  { "codigo": "FR001", "cantidad": 5 },
  { "codigo": "PO001", "cantidad": 1 }
]
```

- `codigo` referencia al `codigo` del producto en `productos.js` (ej. `FR001`); el nombre, precio e imagen se resuelven en tiempo de render buscando ese código en el catálogo estático, no se duplican en `localStorage`.
- Una `cantidad` que llega a `0` elimina la línea del array (no se guardan líneas en cero).
- El indicador `Cart (n)` de todas las páginas se calcula sumando las `cantidad` de este array (criterio: unidades totales, no cantidad de líneas) — se aplica igual en las 4 páginas vía `layout.js`.

### Claves resumen

| Clave | Tipo | Vacío / sin datos |
|---|---|---|
| `huertohogar_usuarios` | `Array<Usuario>` | `[]` |
| `huertohogar_sesion` | `Sesion \| null` | `null` |
| `huertohogar_carrito` | `Array<{codigo, cantidad}>` | `[]` |

---

## 5. División de tareas

Reparto por vista, para que cada uno controle su propio HTML/JS y toquen `estilos.css` en momentos distintos:

**Juntos (día 1, antes de dividir):**
- `assets/css/estilos.css` — identidad visual base (paleta, tipografía, header/footer/botones comunes a las 4 vistas).
- `assets/js/storage.js` y `assets/js/productos.js` — la estructura de datos de la sección 4, para que ambos programen contra el mismo contrato.

**Persona A — Inicio y Registro**
- `index.html` + `index.js`: header, hero, catálogo de 8 productos, video embebido, footer con newsletter.
- `registro.html` + `registro.js`: formulario y validaciones de registro.

**Persona B — Login y Carrito**
- `login.html` + `login.js`: formulario y validación de inicio de sesión.
- `carrito.html` + `carrito.js`: listado de ítems, cantidades, cupón, total y botón Pagar.

**Conjunto**
- `layout.js` (indicador `Cart (n)` en las 4 páginas) — se toca desde ambos lados, revisar junto con el compañero.
- Completar la ERS en `docs/` con lo realmente implementado.
- Probar el flujo completo cruzado (cada uno navega el sitio del otro) antes de la entrega.
