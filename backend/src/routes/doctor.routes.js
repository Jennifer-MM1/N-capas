// ========== doctor.routes.js ==========
import express from 'express';
import {
  crearDoctor,
  obtenerDoctores,
  obtenerDoctorPorId,
  actualizarDoctor,
  eliminarDoctor
} from '../controllers/doctor.controller.js';
import { protegerRuta, autorizarRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', obtenerDoctores);
router.get('/:id', obtenerDoctorPorId);

// Solo admin puede crear, actualizar y eliminar doctores
router.post('/', protegerRuta, autorizarRoles('admin'), crearDoctor);
router.put('/:id', protegerRuta, autorizarRoles('admin'), actualizarDoctor);
router.delete('/:id', protegerRuta, autorizarRoles('admin'), eliminarDoctor);

export default router;