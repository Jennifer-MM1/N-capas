// ========== especialidad.routes.js ==========
import express from 'express';
import { 
  crearEspecialidad, 
  obtenerEspecialidades 
} from '../controllers/especialidad.controller.js';
import { protegerRuta, autorizarRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', obtenerEspecialidades);
router.post('/', protegerRuta, autorizarRoles('admin'), crearEspecialidad);

export default router;
