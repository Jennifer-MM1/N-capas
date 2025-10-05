import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.model.js';

export const protegerRuta = async (req, res, next) => {
  try {
    let token;

    // Verificar si el token viene en el header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado, token no proporcionado'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Obtener usuario del token
    req.usuario = await Usuario.findById(decoded.id).select('-password');

    if (!req.usuario) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (!req.usuario.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'No autorizado, token inválido',
      error: error.message
    });
  }
};

export const autorizarRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        message: `El rol ${req.usuario.rol} no tiene permiso para acceder a este recurso`
      });
    }
    next();
  };
};