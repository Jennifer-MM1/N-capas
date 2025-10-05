import mongoose from 'mongoose';

const citaSchema = new mongoose.Schema({
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El paciente es requerido']
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'El doctor es requerido']
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha es requerida']
  },
  hora: {
    type: String,
    required: [true, 'La hora es requerida']
  },
  motivo: {
    type: String,
    trim: true
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmada', 'cancelada', 'completada'],
    default: 'pendiente'
  },
  notasCancelacion: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

citaSchema.index({ doctor: 1, fecha: 1, hora: 1 }, { unique: true });

export default mongoose.model('Cita', citaSchema);