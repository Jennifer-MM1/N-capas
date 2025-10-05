import { useState, useEffect } from 'react';
import api from '../services/api';
import './Doctores.css';

function Doctores() {
  const [doctores, setDoctores] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [doctoresRes, especialidadesRes] = await Promise.all([
        api.get('/doctores'),
        api.get('/especialidades')
      ]);
      
      setDoctores(doctoresRes.data.data);
      setEspecialidades(especialidadesRes.data.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const doctoresFiltrados = filtroEspecialidad
    ? doctores.filter(d => d.especialidad._id === filtroEspecialidad)
    : doctores;

  const diasSemana = {
    lunes: 'Lunes',
    martes: 'Martes',
    miercoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sabado: 'Sábado'
  };

  if (loading) {
    return <div className="loading">Cargando doctores...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Nuestros Doctores 👨‍⚕️</h1>
        <p>Conoce a nuestro equipo médico especializado</p>
      </div>

      <div className="filtros">
        <label>Filtrar por especialidad:</label>
        <select 
          value={filtroEspecialidad} 
          onChange={(e) => setFiltroEspecialidad(e.target.value)}
          className="filtro-select"
        >
          <option value="">Todas las especialidades</option>
          {especialidades.map(esp => (
            <option key={esp._id} value={esp._id}>
              {esp.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="grid">
        {doctoresFiltrados.map(doctor => (
          <div key={doctor._id} className="card doctor-card">
            <div className="doctor-avatar">👨‍⚕️</div>
            
            <h3>{doctor.nombre}</h3>
            
            <div className="doctor-especialidad">
              <span className="badge badge-info">
                {doctor.especialidad?.nombre}
              </span>
            </div>

            <div className="doctor-info">
              <p>📧 {doctor.email}</p>
              {doctor.telefono && <p>📱 {doctor.telefono}</p>}
              <p>🏥 Consultorio {doctor.consultorio}</p>
            </div>

            <div className="doctor-horarios">
              <h4>Horarios de atención:</h4>
              {doctor.horariosDisponibles && doctor.horariosDisponibles.length > 0 ? (
                <ul>
                  {doctor.horariosDisponibles.map((horario, index) => (
                    <li key={index}>
                      <strong>{diasSemana[horario.dia]}:</strong> {horario.horaInicio} - {horario.horaFin}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay horarios disponibles</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {doctoresFiltrados.length === 0 && (
        <div className="card text-center">
          <p>No se encontraron doctores para esta especialidad.</p>
        </div>
      )}
    </div>
  );
}

export default Doctores;