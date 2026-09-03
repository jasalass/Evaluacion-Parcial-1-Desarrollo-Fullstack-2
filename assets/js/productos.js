// Catálogo estático de HuertoHogar (8 productos, tomados del caso Forma A).
const PRODUCTOS = [
  {
    codigo: "FR001",
    nombre: "Manzanas Fuji",
    categoria: "Frutas Frescas",
    atributo: "Origen: Valle del Maule",
    precio: 1200,
    unidad: "kilo",
    descripcion: "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule.",
    imagen: "https://freshmate.cl/cdn/shop/files/manzanas_fuji_en_bowl_de_madera_21_11zon.webp?v=1724716431",
  },
  {
    codigo: "FR002",
    nombre: "Naranjas Valencia",
    categoria: "Frutas Frescas",
    atributo: "Rico en vitamina C",
    precio: 1000,
    unidad: "kilo",
    descripcion: "Jugosas y dulces, ideales para zumos frescos.",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEERn_QEqcdw8rb-Pr-NHCS6gfr0xgb9p_lAkcOQycDzpqRBdiar16yZk&s=10",
  },
  {
    codigo: "FR003",
    nombre: "Plátanos Cavendish",
    categoria: "Frutas Frescas",
    atributo: "Rico en potasio",
    precio: 800,
    unidad: "kilo",
    descripcion: "Plátanos maduros, perfectos para el desayuno.",
    imagen: "https://cdn.tasteatlas.com/images/ingredients/9c0c4471200241dca531e49994960eaf.jpg?w=600",
  },
  {
    codigo: "VR001",
    nombre: "Zanahorias Orgánicas",
    categoria: "Verduras Orgánicas",
    atributo: "Origen: Región de O'Higgins",
    precio: 900,
    unidad: "kilo",
    descripcion: "Zanahorias crujientes cultivadas sin pesticidas.",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLSUgAU50K1nkeIKtKl2_sBRndaZdvnZ5yaR3MZsnpHuTB7n-I6DJNNVrG&s=10",
  },
  {
    codigo: "VR002",
    nombre: "Espinacas Frescas",
    categoria: "Verduras Orgánicas",
    atributo: "Cultivo orgánico",
    precio: 700,
    unidad: "bolsa 500g",
    descripcion: "Espinacas frescas, ideales para ensaladas y batidos verdes.",
    imagen: "https://borges1896.com/app/uploads//2021/06/WW-MI-TRUC-20180605-1.jpg",
  },
  {
    codigo: "VR003",
    nombre: "Pimientos Tricolores",
    categoria: "Verduras Orgánicas",
    atributo: "Ricos en antioxidantes",
    precio: 1500,
    unidad: "kilo",
    descripcion: "Pimientos rojos, amarillos y verdes para platos coloridos.",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7o-h_-AVgcQqHUD7XX9jpgGxB8laCQG-WwcmkRNL1Dwya-Qenk0e-PN8&s=10",
  },
  {
    codigo: "PO001",
    nombre: "Miel Orgánica",
    categoria: "Productos Orgánicos",
    atributo: "100% natural",
    precio: 5000,
    unidad: "frasco 500g",
    descripcion: "Miel pura producida por apicultores locales.",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6kYFiUGawvF0F12WBl9DUzqQsVtypd8ePWXQGBXa76qHJCOQtNLNoV8WQ&s=10",
  },
  {
    codigo: "PL001",
    nombre: "Leche Entera",
    categoria: "Productos Lácteos",
    atributo: "Rica en calcio",
    precio: 1200,
    unidad: "litro",
    descripcion: "Leche entera fresca de granjas locales.",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuV6cWewbL3ffJPnqSDezv0vG_8nxmaqKCjPehN0V2XD34CQcrUsVCzKWP&s=10",
  },
];

// Único cupón válido para esta entrega: 10% de descuento sobre el subtotal.
const CUPONES = {
  HUERTO10: 0.1,
};

function buscarProducto(codigo) {
  return PRODUCTOS.find((p) => p.codigo === codigo);
}
