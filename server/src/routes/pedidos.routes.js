import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import {
  crearPedido,
  listarPedidos,
  obtenerPedido,
  actualizarEstadoPedido,
} from '../controllers/pedidos.controller.js';

const router = Router();
router.use(requireAuth);

router.post('/', crearPedido);
router.get('/', listarPedidos);
router.get('/:id', obtenerPedido);
router.put('/:id/estado', actualizarEstadoPedido);

export default router;
