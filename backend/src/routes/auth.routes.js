
// ========== auth.routes.js ==========
import express from 'express';
import { registro, login, obtenerPerfil } from '../controllers/auth.controller.js';
import { protegerRuta } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/registro', registro);
router.post('/login', login);
router.get('/perfil', protegerRuta, obtenerPerfil);

export default router;