import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import db from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
db.exec(schema);

// Categorías y descripciones tal como aparecen en "DSY1104 - Forma A tienda HUERTO HOGAR.pdf".
const categorias = [
  {
    nombre: 'Frutas Frescas',
    descripcion:
      'Nuestra selección de frutas frescas ofrece una experiencia directa del campo a tu hogar. ' +
      'Estas frutas se cultivan y cosechan en el punto óptimo de madurez para asegurar su sabor y frescura. ' +
      'Disfruta de una variedad de frutas de temporada que aportan vitaminas y nutrientes esenciales a tu dieta diaria. ' +
      'Perfectas para consumir solas, en ensaladas o como ingrediente principal en postres y smoothies.',
  },
  {
    nombre: 'Verduras Orgánicas',
    descripcion:
      'Descubre nuestra gama de verduras orgánicas, cultivadas sin el uso de pesticidas ni químicos, ' +
      'garantizando un sabor auténtico y natural. Cada verdura es seleccionada por su calidad y valor nutricional, ' +
      'ofreciendo una excelente fuente de vitaminas, minerales y fibra. Ideales para ensaladas, guisos y platos saludables, ' +
      'nuestras verduras orgánicas promueven una alimentación consciente y sostenible.',
  },
  {
    nombre: 'Productos Orgánicos',
    descripcion:
      'Nuestros productos orgánicos están elaborados con ingredientes naturales y procesados de manera responsable ' +
      'para mantener sus beneficios saludables. Desde aceites y miel hasta granos y semillas, ofrecemos una selección ' +
      'que apoya un estilo de vida saludable y respetuoso con el medio ambiente. Estos productos son perfectos para ' +
      'quienes buscan opciones alimenticias que aporten bienestar sin comprometer el sabor ni la calidad.',
  },
  {
    nombre: 'Productos Lácteos',
    descripcion:
      'Los productos lácteos de HuertoHogar provienen de granjas locales que se dedican a la producción responsable ' +
      'y de calidad. Ofrecemos una gama de leches, yogures y otros derivados que conservan su frescura y sabor auténtico. ' +
      'Ricos en calcio y nutrientes esenciales, nuestros lácteos son perfectos para complementar una dieta equilibrada, ' +
      'proporcionando el mejor sabor y nutrición para toda la familia.',
  },
];

const insertCategoria = db.prepare(`
  INSERT INTO categorias (nombre, descripcion)
  VALUES (@nombre, @descripcion)
  ON CONFLICT(nombre) DO UPDATE SET descripcion = excluded.descripcion
`);
db.transaction((filas) => filas.forEach((fila) => insertCategoria.run(fila)))(categorias);

const idCategoria = (nombre) =>
  db.prepare('SELECT id FROM categorias WHERE nombre = ?').get(nombre).id;

// Precio, stock y descripción de FR001-FR003, VR001-VR003 y PO001 son los oficiales del enunciado.
// PO003 (Quinua Orgánica) y PL001 (Leche Entera) solo aparecían listadas por nombre en el PDF,
// sin precio/stock/descripción oficial: los datos de esas dos fueron definidos por el equipo,
// siguiendo el mismo formato y rango de precios que el resto del catálogo.
const productos = [
  {
    codigo: 'FR001',
    nombre: 'Manzanas Fuji',
    categoria: 'Frutas Frescas',
    precio: 1200,
    stock: 150,
    unidad: 'kilo',
    origen: 'Valle del Maule',
    descripcion: 'Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres.',
  },
  {
    codigo: 'FR002',
    nombre: 'Naranjas Valencia',
    categoria: 'Frutas Frescas',
    precio: 1000,
    stock: 200,
    unidad: 'kilo',
    origen: null,
    descripcion: 'Jugosas y ricas en vitamina C, ideales para zumos frescos y refrescantes.',
  },
  {
    codigo: 'FR003',
    nombre: 'Plátanos Cavendish',
    categoria: 'Frutas Frescas',
    precio: 800,
    stock: 250,
    unidad: 'kilo',
    origen: null,
    descripcion: 'Plátanos maduros y dulces, perfectos para el desayuno o como snack energético.',
  },
  {
    codigo: 'VR001',
    nombre: 'Zanahorias Orgánicas',
    categoria: 'Verduras Orgánicas',
    precio: 900,
    stock: 100,
    unidad: 'kilo',
    origen: "Región de O'Higgins",
    descripcion: 'Zanahorias crujientes cultivadas sin pesticidas. Excelente fuente de vitamina A y fibra.',
  },
  {
    codigo: 'VR002',
    nombre: 'Espinacas Frescas',
    categoria: 'Verduras Orgánicas',
    precio: 700,
    stock: 80,
    unidad: 'bolsa 500g',
    origen: null,
    descripcion: 'Espinacas frescas y nutritivas, cultivadas bajo prácticas orgánicas, perfectas para ensaladas y batidos verdes.',
  },
  {
    codigo: 'VR003',
    nombre: 'Pimientos Tricolores',
    categoria: 'Verduras Orgánicas',
    precio: 1500,
    stock: 120,
    unidad: 'kilo',
    origen: null,
    descripcion: 'Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos. Ricos en antioxidantes.',
  },
  {
    codigo: 'PO001',
    nombre: 'Miel Orgánica',
    categoria: 'Productos Orgánicos',
    precio: 5000,
    stock: 50,
    unidad: 'frasco 500g',
    origen: null,
    descripcion: 'Miel pura y orgánica producida por apicultores locales, rica en antioxidantes.',
  },
  {
    codigo: 'PO003',
    nombre: 'Quinua Orgánica',
    categoria: 'Productos Orgánicos',
    precio: 3500,
    stock: 60,
    unidad: 'bolsa 500g',
    origen: 'Altiplano de la Región de Arica y Parinacota',
    descripcion: 'Quinua orgánica cultivada sin pesticidas, rica en proteínas y aminoácidos esenciales. Libre de gluten, ideal como sustituto de cereales en ensaladas, guisos o como acompañamiento saludable.',
  },
  {
    codigo: 'PL001',
    nombre: 'Leche Entera',
    categoria: 'Productos Lácteos',
    precio: 1200,
    stock: 100,
    unidad: 'litro',
    origen: 'Región de Los Lagos',
    descripcion: 'Leche entera fresca de granjas locales, rica en calcio y proteínas. Pasteurizada para garantizar su calidad, ideal para el consumo diario de toda la familia.',
  },
];

const insertProducto = db.prepare(`
  INSERT INTO productos (codigo, nombre, categoria_id, precio, stock, unidad, descripcion, origen)
  VALUES (@codigo, @nombre, @categoria_id, @precio, @stock, @unidad, @descripcion, @origen)
  ON CONFLICT(codigo) DO UPDATE SET
    nombre = excluded.nombre,
    categoria_id = excluded.categoria_id,
    precio = excluded.precio,
    stock = excluded.stock,
    unidad = excluded.unidad,
    descripcion = excluded.descripcion,
    origen = excluded.origen
`);

db.transaction((filas) => {
  for (const fila of filas) {
    insertProducto.run({ ...fila, categoria_id: idCategoria(fila.categoria) });
  }
})(productos);

console.log(`Seed completo: ${categorias.length} categorías y ${productos.length} productos cargados en ${path.join('server', 'huertohogar.db')}`);
