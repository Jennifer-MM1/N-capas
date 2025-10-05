// ========== cita.routes.js ==========
import express from 'express';
import {
  crearCita,
  obtenerCitas,
  obtenerCitaPorId,
  actualizarCita,
  cancelarCita
} from '../controllers/cita.controller.js';
import { protegerRuta, autorizarRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protegerRuta);

router.post('/', crearCita);
router.get('/', obtenerCitas);
router.get('/:id', obtenerCitaPorId);
router.put('/:id', actualizarCita);
router.patch('/:id/cancelar', cancelarCita);

export default router