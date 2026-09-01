import db from '../db.js';

export function listarResenas(req, res) {
  const producto = db.prepare('SELECT id FROM productos WHERE id = ?').get(req.params.id);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

  const resenas = db
    .prepare(
      `SELECT r.id, r.calificacion, r.comentario, r.creado_en, u.nombre AS usuario
       FROM resenas r
       JOIN usuarios u ON u.id = r.usuario_id
       WHERE r.producto_id = ?
       ORDER BY r.creado_en DESC`
    )
    .all(req.params.id);

  res.json(resenas);
}

export function crearResena(req, res) {
  const { calificacion, comentario } = req.body;
  if (!Number.isInteger(calificacion) || calificacion < 1 || calificacion > 5) {
    return res.status(400).json({ error: 'calificacion debe ser un entero entre 1 y 5' });
  }

  const producto = db.prepare('SELECT id FROM productos WHERE id = ?').get(req.params.id);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

  const info = db
    .prepare(
      'INSERT INTO resenas (producto_id, usuario_id, calificacion, comentario) VALUES (?, ?, ?, ?)'
    )
    .run(req.params.id, req.usuarioId, calificacion, comentario || null);

  res.status(201).json({ id: info.lastInsertRowid });
}
