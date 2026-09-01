import db from '../db.js';

export function listarCategorias(req, res) {
  res.json(db.prepare('SELECT id, nombre, descripcion FROM categorias ORDER BY nombre').all());
}

export function obtenerCategoria(req, res) {
  const categoria = db.prepare('SELECT id, nombre, descripcion FROM categorias WHERE id = ?').get(req.params.id);
  if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
  res.json(categoria);
}
