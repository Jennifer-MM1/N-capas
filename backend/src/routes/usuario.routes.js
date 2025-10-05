// ========== usuario.routes.js ==========
import express from 'express';
import { protegerRuta, autorizarRoles } from '../middleware/auth.middleware.js';
import Usuario from '../models/Usuario.model.js';

const router = express.Router();

// Solo admin puede ver todos los usuarios
router.get('/', protegerRuta, autorizarRoles('admin'), async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json({
      success: true,
      count: usuarios.length,
      data: usuarios
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
});

export default router;
