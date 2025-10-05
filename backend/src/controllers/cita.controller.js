// ========== cita.controller.js ==========
import Cita from '../models/Cita.model.js';

export const crearCita = async (req, res) => {
  try {
    const { doctor, fecha, hora, motivo } = req.body;
    const paciente = req.usuario.id;

    // Verificar si ya existe una cita en ese horario
    const citaExiste = await Cita.findOne({ doctor, fecha, hora, estado: { $ne: 'cancelada' } });
    if (citaExiste) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una cita en ese horario'
      });
    }

    const cita = await Cita.create({
      paciente,
      doctor,
      fecha,
      hora,
      motivo
    });

    const citaPopulada = await Cita.findById(cita._id)
      .populate('paciente', 'nombre email telefono')
      .populate({
        path: 'doctor',
        select: 'nombre especialidad consultorio',
        populate: { path: 'especialidad', select: 'nombre' }
      });

    res.status(201).json({
      success: true,
      message: 'Cita creada exitosamente',
      data: citaPopulada
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear la cita',
      error: error.message
    });
  }
};

export const obtenerCitas = async (req, res) => {
  try {
    const filtro = req.usuario.rol === 'admin' ? {} : { paciente: req.usuario.id };

    const citas = await Cita.find(filtro)
      .populate('paciente', 'nombre email telefono')
      .populate({
        path: 'doctor',
        select: 'nombre especialidad consultorio',
        populate: { path: 'especialidad', select: 'nombre' }
      })
      .sort({ fecha: -1, hora: -1 });

    res.json({
      success: true,
      count: citas.length,
      data: citas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las citas',
      error: error.message
    });
  }
};

export const obtenerCitaPorId = async (req, res) => {
  try {
    const cita = await Cita.findById(req.params.id)
      .populate('paciente', 'nombre email telefono')
      .populate({
        path: 'doctor',
        select: 'nombre especialidad consultorio',
        populate: { path: 'especialidad', select: 'nombre' }
      });

    if (!cita) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }

    // Verificar que el paciente solo vea sus propias citas
    if (req.usuario.rol !== 'admin' && cita.paciente._id.toString() !== req.usuario.id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver esta cita'
      });
    }

    res.json({
      success: true,
      data: cita
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la cita',
      error: error.message
    });
  }
};

export const actualizarCita = async (req, res) => {
  try {
    let cita = await Cita.findById(req.params.id);

    if (!cita) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }

    // Verificar permisos
    if (req.usuario.rol !== 'admin' && cita.paciente.toString() !== req.usuario.id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para modificar esta cita'
      });
    }

    cita = await Cita.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('paciente', 'nombre email telefono')
      .populate({
        path: 'doctor',
        select: 'nombre especialidad consultorio',
        populate: { path: 'especialidad', select: 'nombre' }
      });

    res.json({
      success: true,
      message: 'Cita actualizada exitosamente',
      data: cita
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la cita',
      error: error.message
    });
  }
};

export const cancelarCita = async (req, res) => {
  try {
    const cita = await Cita.findById(req.params.id);

    if (!cita) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }

    if (req.usuario.rol !== 'admin' && cita.paciente.toString() !== req.usuario.id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para cancelar esta cita'
      });
    }

    cita.estado = 'cancelada';
    cita.notasCancelacion = req.body.motivo || 'Sin motivo especificado';
    await cita.save();

    res.json({
      success: true,
      message: 'Cita cancelada exitosamente',
      data: cita
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cancelar la cita',
      error: error.message
    });
  }
};
