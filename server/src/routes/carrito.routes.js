import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { verCarrito, agregarItem, actualizarItem, eliminarItem } from '../controllers/carrito.controller.js';

const router = Router();
router.use(requireAuth);

router.get('/', verCarrito);
router.post('/items', agregarItem);
router.put('/items/:itemId', actualizarItem);
router.delete('/items/:itemId', eliminarItem);

export default router;
