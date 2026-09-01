import db from '../db.js';

export const ESTADOS_PEDIDO = ['pendiente', 'en_preparacion', 'en_camino', 'entregado'];

export function crearPedido(req, res) {
  const { fecha_entrega } = req.body;

  const carrito = db.prepare('SELECT id FROM carritos WHERE usuario_id = ?').get(req.usuarioId);
  const items = db
    .prepare(
      `SELECT ci.producto_id, ci.cantidad, p.precio, p.stock, p.nombre
       FROM carrito_items ci
       JOIN productos p ON p.id = ci.producto_id
       WHERE ci.carrito_id = ?`
    )
    .all(carrito.id);

  if (items.length === 0) {
    return res.status(400).json({ error: 'El carrito está vacío' });
  }
  for (const item of items) {
    if (item.cantidad > item.stock) {
      return res.status(400).json({ error: `Sin stock suficiente de "${item.nombre}"` });
    }
  }

  const total = items.reduce((acc, item) => acc + item.cantidad * item.precio, 0);

  const crear = db.transaction(() => {
    const pedidoInfo = db
      .prepare('INSERT INTO pedidos (usuario_id, estado, fecha_entrega, total) VALUES (?, ?, ?, ?)')
      .run(req.usuarioId, 'pendiente', fecha_entrega || null, total);
    const pedidoId = pedidoInfo.lastInsertRowid;

    const insertItem = db.prepare(
      'INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)'
    );
    const descontarStock = db.prepare('UPDATE productos SET stock = stock - ? WHERE id = ?');

    for (const item of items) {
      insertItem.run(pedidoId, item.producto_id, item.cantidad, item.precio);
      descontarStock.run(item.cantidad, item.producto_id);
    }

    db.prepare('DELETE FROM carrito_items WHERE carrito_id = ?').run(carrito.id);
    return pedidoId;
  });

  const pedidoId = crear();
  res.status(201).json({ pedido_id: pedidoId, total, estado: 'pendiente' });
}

export function listarPedidos(req, res) {
  const pedidos = db
    .prepare('SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY creado_en DESC')
    .all(req.usuarioId);
  res.json(pedidos);
}

export function obtenerPedido(req, res) {
  const pedido = db
    .prepare('SELECT * FROM pedidos WHERE id = ? AND usuario_id = ?')
    .get(req.params.id, req.usuarioId);
  if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });

  const items = db
    .prepare(
      `SELECT pi.cantidad, pi.precio_unitario, p.nombre
       FROM pedido_items pi
       JOIN productos p ON p.id = pi.producto_id
       WHERE pi.pedido_id = ?`
    )
    .all(pedido.id);

  res.json({ ...pedido, items });
}

// Simplificación pensada para demo/curso: no existe rol de administrador, así que el
// seguimiento se actualiza llamando este endpoint manualmente (ej. desde una pantalla de
// pruebas) para simular el avance pendiente -> en_preparacion -> en_camino -> entregado.
export function actualizarEstadoPedido(req, res) {
  const { estado } = req.body;
  if (!ESTADOS_PEDIDO.includes(estado)) {
    return res.status(400).json({ error: `estado debe ser uno de: ${ESTADOS_PEDIDO.join(', ')}` });
  }

  const info = db
    .prepare('UPDATE pedidos SET estado = ? WHERE id = ? AND usuario_id = ?')
    .run(estado, req.params.id, req.usuarioId);

  if (info.changes === 0) return res.status(404).json({ error: 'Pedido no encontrado' });
  res.json({ ok: true });
}
