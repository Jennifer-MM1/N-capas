import mongoose from 'mongoose';

const especialidadSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la especialidad es requerido'],
    unique: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Especialidad', especialidadSchema);