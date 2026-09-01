import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { listarProductos, obtenerProducto } from '../controllers/productos.controller.js';
import { listarResenas, crearResena } from '../controllers/resenas.controller.js';

const router = Router();

router.get('/', listarProductos);
router.get('/:id', obtenerProducto);
router.get('/:id/resenas', listarResenas);
router.post('/:id/resenas', requireAuth, crearResena);

export default router;
