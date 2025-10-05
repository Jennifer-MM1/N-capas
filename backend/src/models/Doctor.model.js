import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del doctor es requerido'],
    trim: true
  },
  especialidad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Especialidad',
    required: [true, 'La especialidad es requerida']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true
  },
  telefono: {
    type: String,
    trim: true
  },
  consultorio: {
    type: String,
    trim: true
  },
  horariosDisponibles: [{
    dia: {
      type: String,
      enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'],
      required: true
    },
    horaInicio: {
      type: String,
      required: true
    },
    horaFin: {
      type: String,
      required: true
    }
  }],
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Doctor', doctorSchema);