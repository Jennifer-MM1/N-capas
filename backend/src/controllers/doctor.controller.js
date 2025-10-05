// ========== doctor.controller.js ==========
import Doctor from '../models/Doctor.model.js';

export const crearDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    const doctorPopulado = await Doctor.findById(doctor._id).populate('especialidad');

    res.status(201).json({
      success: true,
      message: 'Doctor creado exitosamente',
      data: doctorPopulado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el doctor',
      error: error.message
    });
  }
};

export const obtenerDoctores = async (req, res) => {
  try {
    const { especialidad } = req.query;
    const filtro = especialidad ? { especialidad, activo: true } : { activo: true };

    const doctores = await Doctor.find(filtro).populate('especialidad');

    res.json({
      success: true,
      count: doctores.length,
      data: doctores
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener doctores',
      error: error.message
    });
  }
};

export const obtenerDoctorPorId = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('especialidad');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor no encontrado'
      });
    }

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el doctor',
      error: error.message
    });
  }
};

export const actualizarDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('especialidad');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Doctor actualizado exitosamente',
      data: doctor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el doctor',
      error: error.message
    });
  }
};

export const eliminarDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Doctor desactivado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el doctor',
      error: error.message
    });
  }
};