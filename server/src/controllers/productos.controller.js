import db from '../db.js';

const SELECT_PRODUCTO = `
  SELECT p.id, p.codigo, p.nombre, p.precio, p.stock, p.unidad, p.descripcion, p.origen,
         c.id AS categoria_id, c.nombre AS categoria
  FROM productos p
  JOIN categorias c ON c.id = p.categoria_id
`;

export function listarProductos(req, res) {
  const { categoria, q } = req.query;

  let sql = `${SELECT_PRODUCTO} WHERE 1 = 1`;
  const params = [];

  if (categoria) {
    sql += ' AND c.nombre = ?';
    params.push(categoria);
  }
  if (q) {
    sql += ' AND p.nombre LIKE ?';
    params.push(`%${q}%`);
  }
  sql += ' ORDER BY c.nombre, p.nombre';

  res.json(db.prepare(sql).all(...params));
}

export function obtenerProducto(req, res) {
  const producto = db.prepare(`${SELECT_PRODUCTO} WHERE p.id = ?`).get(req.params.id);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(producto);
}
