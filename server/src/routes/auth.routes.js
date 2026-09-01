import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { registrar, login, obtenerPerfil, actualizarPerfil } from '../controllers/auth.controller.js';

const router = Router();

router.post('/registro', registrar);
router.post('/login', login);
router.get('/perfil', requireAuth, obtenerPerfil);
router.put('/perfil', requireAuth, actualizarPerfil);

export default router;
