import db from '../db.js';

function obtenerCarritoId(usuarioId) {
  const carrito = db.prepare('SELECT id FROM carritos WHERE usuario_id = ?').get(usuarioId);
  return carrito.id;
}

export function verCarrito(req, res) {
  const carritoId = obtenerCarritoId(req.usuarioId);
  const items = db
    .prepare(
      `SELECT ci.id, ci.cantidad, p.id AS producto_id, p.nombre, p.precio, p.unidad,
              (ci.cantidad * p.precio) AS subtotal
       FROM carrito_items ci
       JOIN productos p ON p.id = ci.producto_id
       WHERE ci.carrito_id = ?`
    )
    .all(carritoId);

  const total = items.reduce((acc, item) => acc + item.subtotal, 0);
  res.json({ items, total });
}

export function agregarItem(req, res) {
  const { producto_id, cantidad } = req.body;
  if (!producto_id || !Number.isInteger(cantidad) || cantidad <= 0) {
    return res.status(400).json({ error: 'producto_id y cantidad (entero > 0) son obligatorios' });
  }

  const producto = db.prepare('SELECT id, stock FROM productos WHERE id = ?').get(producto_id);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  if (cantidad > producto.stock) {
    return res.status(400).json({ error: 'Cantidad supera el stock disponible' });
  }

  const carritoId = obtenerCarritoId(req.usuarioId);
  db.prepare(
    `INSERT INTO carrito_items (carrito_id, producto_id, cantidad)
     VALUES (?, ?, ?)
     ON CONFLICT(carrito_id, producto_id) DO UPDATE SET cantidad = cantidad + excluded.cantidad`
  ).run(carritoId, producto_id, cantidad);

  res.status(201).json({ ok: true });
}

export function actualizarItem(req, res) {
  const { cantidad } = req.body;
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    return res.status(400).json({ error: 'cantidad debe ser un entero mayor a 0' });
  }

  const carritoId = obtenerCarritoId(req.usuarioId);
  const info = db
    .prepare('UPDATE carrito_items SET cantidad = ? WHERE id = ? AND carrito_id = ?')
    .run(cantidad, req.params.itemId, carritoId);

  if (info.changes === 0) return res.status(404).json({ error: 'Item no encontrado en tu carrito' });
  res.json({ ok: true });
}

export function eliminarItem(req, res) {
  const carritoId = obtenerCarritoId(req.usuarioId);
  const info = db
    .prepare('DELETE FROM carrito_items WHERE id = ? AND carrito_id = ?')
    .run(req.params.itemId, carritoId);

  if (info.changes === 0) return res.status(404).json({ error: 'Item no encontrado en tu carrito' });
  res.json({ ok: true });
}
