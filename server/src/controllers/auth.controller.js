import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

function generarToken(usuarioId) {
  return jwt.sign({ sub: usuarioId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export function registrar(req, res) {
  const { email, password, nombre } = req.body;
  if (!email || !password || !nombre) {
    return res.status(400).json({ error: 'email, password y nombre son obligatorios' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'password debe tener al menos 6 caracteres' });
  }

  const existente = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
  if (existente) {
    return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare('INSERT INTO usuarios (email, password_hash, nombre) VALUES (?, ?, ?)')
    .run(email, passwordHash, nombre);

  db.prepare('INSERT INTO carritos (usuario_id) VALUES (?)').run(info.lastInsertRowid);

  const token = generarToken(info.lastInsertRowid);
  res.status(201).json({
    token,
    usuario: { id: info.lastInsertRowid, email, nombre },
  });
}

export function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email y password son obligatorios' });
  }

  const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
  if (!usuario || !bcrypt.compareSync(password, usuario.password_hash)) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = generarToken(usuario.id);
  res.json({
    token,
    usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre },
  });
}

export function obtenerPerfil(req, res) {
  const usuario = db
    .prepare('SELECT id, email, nombre, direccion, telefono FROM usuarios WHERE id = ?')
    .get(req.usuarioId);
  res.json(usuario);
}

export function actualizarPerfil(req, res) {
  const { nombre, direccion, telefono } = req.body;
  db.prepare(
    `UPDATE usuarios
     SET nombre = COALESCE(?, nombre), direccion = COALESCE(?, direccion), telefono = COALESCE(?, telefono)
     WHERE id = ?`
  ).run(nombre, direccion, telefono, req.usuarioId);

  const usuario = db
    .prepare('SELECT id, email, nombre, direccion, telefono FROM usuarios WHERE id = ?')
    .get(req.usuarioId);
  res.json(usuario);
}
