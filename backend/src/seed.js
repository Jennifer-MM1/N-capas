import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from './models/Usuario.model.js';
import Especialidad from './models/Especialidad.model.js';
import Doctor from './models/Doctor.model.js';
import Cita from './models/Cita.model.js';
import connectDB from './config/database.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Limpiar colecciones
    console.log('🗑️  Limpiando base de datos...');
    await Usuario.deleteMany();
    await Especialidad.deleteMany();
    await Doctor.deleteMany();
    await Cita.deleteMany();

    // Crear usuarios
    console.log('👤 Creando usuarios...');
    const admin = await Usuario.create({
      nombre: 'Admin Hospital',
      email: 'admin@hospital.com',
      password: 'admin123',
      telefono: '5551111111',
      rol: 'admin'
    });

    const paciente1 = await Usuario.create({
      nombre: 'María González',
      email: 'maria@example.com',
      password: '123456',
      telefono: '5552222222',
      fechaNacimiento: '1985-03-20'
    });

    const paciente2 = await Usuario.create({
      nombre: 'Pedro Martínez',
      email: 'pedro@example.com',
      password: '123456',
      telefono: '5553333333',
      fechaNacimiento: '1992-08-15'
    });

    console.log('✅ Usuarios creados');

    // Crear especialidades
    console.log('🏥 Creando especialidades...');
    const cardiologia = await Especialidad.create({
      nombre: 'Cardiología',
      descripcion: 'Especialidad médica dedicada al estudio, diagnóstico y tratamiento de enfermedades del corazón'
    });

    const pediatria = await Especialidad.create({
      nombre: 'Pediatría',
      descripcion: 'Especialidad médica que se ocupa de la salud y enfermedades de los niños'
    });

    const dermatologia = await Especialidad.create({
      nombre: 'Dermatología',
      descripcion: 'Especialidad médica que se ocupa de las enfermedades de la piel'
    });

    const traumatologia = await Especialidad.create({
      nombre: 'Traumatología',
      descripcion: 'Especialidad médica que se dedica al estudio de las lesiones del aparato locomotor'
    });

    const medicina_general = await Especialidad.create({
      nombre: 'Medicina General',
      descripcion: 'Atención médica integral y continua para pacientes de todas las edades'
    });

    console.log('✅ Especialidades creadas');

    // Crear doctores
    console.log('👨‍⚕️ Creando doctores...');
    const doctor1 = await Doctor.create({
      nombre: 'Dr. Carlos Ramírez',
      especialidad: cardiologia._id,
      email: 'carlos.ramirez@hospital.com',
      telefono: '5554444444',
      consultorio: '201',
      horariosDisponibles: [
        { dia: 'lunes', horaInicio: '09:00', horaFin: '13:00' },
        { dia: 'miercoles', horaInicio: '09:00', horaFin: '13:00' },
        { dia: 'viernes', horaInicio: '14:00', horaFin: '18:00' }
      ]
    });

    const doctor2 = await Doctor.create({
      nombre: 'Dra. Ana Rodríguez',
      especialidad: pediatria._id,
      email: 'ana.rodriguez@hospital.com',
      telefono: '5555555555',
      consultorio: '105',
      horariosDisponibles: [
        { dia: 'lunes', horaInicio: '14:00', horaFin: '18:00' },
        { dia: 'martes', horaInicio: '09:00', horaFin: '13:00' },
        { dia: 'jueves', horaInicio: '09:00', horaFin: '13:00' }
      ]
    });

    const doctor3 = await Doctor.create({
      nombre: 'Dr. Luis Fernández',
      especialidad: dermatologia._id,
      email: 'luis.fernandez@hospital.com',
      telefono: '5556666666',
      consultorio: '302',
      horariosDisponibles: [
        { dia: 'martes', horaInicio: '14:00', horaFin: '18:00' },
        { dia: 'jueves', horaInicio: '14:00', horaFin: '18:00' },
        { dia: 'sabado', horaInicio: '09:00', horaFin: '13:00' }
      ]
    });

    const doctor4 = await Doctor.create({
      nombre: 'Dra. Patricia López',
      especialidad: medicina_general._id,
      email: 'patricia.lopez@hospital.com',
      telefono: '5557777777',
      consultorio: '101',
      horariosDisponibles: [
        { dia: 'lunes', horaInicio: '08:00', horaFin: '14:00' },
        { dia: 'martes', horaInicio: '08:00', horaFin: '14:00' },
        { dia: 'miercoles', horaInicio: '08:00', horaFin: '14:00' },
        { dia: 'jueves', horaInicio: '08:00', horaFin: '14:00' },
        { dia: 'viernes', horaInicio: '08:00', horaFin: '14:00' }
      ]
    });

    console.log('✅ Doctores creados');

    // Crear citas de ejemplo
    console.log('📅 Creando citas de ejemplo...');
    
    // Fecha futura para las citas
    const fechaFutura1 = new Date();
    fechaFutura1.setDate(fechaFutura1.getDate() + 3);
    
    const fechaFutura2 = new Date();
    fechaFutura2.setDate(fechaFutura2.getDate() + 7);

    await Cita.create({
      paciente: paciente1._id,
      doctor: doctor1._id,
      fecha: fechaFutura1,
      hora: '10:00',
      motivo: 'Consulta de rutina - Revisión cardiológica',
      estado: 'confirmada'
    });

    await Cita.create({
      paciente: paciente2._id,
      doctor: doctor4._id,
      fecha: fechaFutura1,
      hora: '09:00',
      motivo: 'Consulta general - Dolor de cabeza persistente',
      estado: 'pendiente'
    });

    await Cita.create({
      paciente: paciente1._id,
      doctor: doctor3._id,
      fecha: fechaFutura2,
      hora: '15:00',
      motivo: 'Revisión dermatológica - Manchas en la piel',
      estado: 'pendiente'
    });

    console.log('✅ Citas creadas');

    // Mostrar resumen
    console.log('\n📊 RESUMEN DE DATOS CREADOS:');
    console.log('================================');
    console.log('👤 Usuarios:');
    console.log(`   - Admin: ${admin.email} / admin123`);
    console.log(`   - Paciente 1: ${paciente1.email} / 123456`);
    console.log(`   - Paciente 2: ${paciente2.email} / 123456`);
    console.log('\n🏥 Especialidades: 5');
    console.log('👨‍⚕️ Doctores: 4');
    console.log('📅 Citas: 3');
    console.log('\n✅ Base de datos inicializada correctamente');
    console.log('🚀 Puedes iniciar el servidor con: npm run dev');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

seedData();