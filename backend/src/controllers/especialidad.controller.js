// ========== especialidad.controller.js ==========
import Especialidad from '../models/Especialidad.model.js';

export const crearEspecialidad = async (req, res) => {
  try {
    const especialidad = await Especialidad.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Especialidad creada exitosamente',
      data: especialidad
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear la especialidad',
      error: error.message
    });
  }
};

export const obtenerEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidad.find({ activo: true });

    res.json({
      success: true,
      count: especialidades.length,
      data: especialidades
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener especialidades',
      error: error.message
    });
  }
};