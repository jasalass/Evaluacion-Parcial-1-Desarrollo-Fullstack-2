import { Router } from 'express';
import { listarCategorias, obtenerCategoria } from '../controllers/categorias.controller.js';

const router = Router();

router.get('/', listarCategorias);
router.get('/:id', obtenerCategoria);

export default router;
