import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './NuevaCita.css';

function NuevaCita() {
  const navigate = useNavigate();
  const [especialidades, setEspecialidades] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [doctoresFiltrados, setDoctoresFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  const [formData, setFormData] = useState({
    especialidad: '',
    doctor: '',
    fecha: '',
    hora: '',
    motivo: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (formData.especialidad) {
      const filtrados = doctores.filter(
        d => d.especialidad._id === formData.especialidad
      );
      setDoctoresFiltrados(filtrados);
      setFormData(prev => ({ ...prev, doctor: '' }));
    } else {
      setDoctoresFiltrados([]);
    }
  }, [formData.especialidad, doctores]);

  const cargarDatos = async () => {
    try {
      const [especialidadesRes, doctoresRes] = await Promise.all([
        api.get('/especialidades'),
        api.get('/doctores')
      ]);
      
      setEspecialidades(especialidadesRes.data.data);
      setDoctores(doctoresRes.data.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });
    setLoading(true);

    try {
      const { data } = await api.post('/citas', {
        doctor: formData.doctor,
        fecha: formData.fecha,
        hora: formData.hora,
        motivo: formData.motivo
      });

      setMensaje({ tipo: 'success', texto: 'Cita agendada exitosamente!' });
      
      setTimeout(() => {
        navigate('/mis-citas');
      }, 2000);
    } catch (error) {
      setMensaje({ 
        tipo: 'error', 
        texto: error.response?.data?.message || 'Error al agendar la cita' 
      });
    } finally {
      setLoading(false);
    }
  };

  const doctorSeleccionado = doctoresFiltrados.find(d => d._id === formData.doctor);

  const horasDisponibles = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  return (
    <div className="container">
      <div className="page-header">
        <h1>Agendar Nueva Cita 📅</h1>
        <p>Completa el formulario para programar tu consulta</p>
      </div>

      <div className="form-container">
        {mensaje.texto && (
          <div className={`alert alert-${mensaje.tipo}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="cita-form">
          <div className="form-group">
            <label>Especialidad *</label>
            <select
              name="especialidad"
              value={formData.especialidad}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una especialidad</option>
              {especialidades.map(esp => (
                <option key={esp._id} value={esp._id}>
                  {esp.nombre}
                </option>
              ))}
            </select>
          </div>

          {formData.especialidad && (
            <div className="form-group">
              <label>Doctor *</label>
              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un doctor</option>
                {doctoresFiltrados.map(doc => (
                  <option key={doc._id} value={doc._id}>
                    {doc.nombre} - Consultorio {doc.consultorio}
                  </option>
                ))}
              </select>
            </div>
          )}

          {doctorSeleccionado && (
            <div className="doctor-info-box">
              <h3>👨‍⚕️ {doctorSeleccionado.nombre}</h3>
              <p><strong>Consultorio:</strong> {doctorSeleccionado.consultorio}</p>
              <p><strong>Email:</strong> {doctorSeleccionado.email}</p>
              {doctorSeleccionado.telefono && (
                <p><strong>Teléfono:</strong> {doctorSeleccionado.telefono}</p>
              )}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Fecha *</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>Hora *</label>
              <select
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una hora</option>
                {horasDisponibles.map(hora => (
                  <option key={hora} value={hora}>
                    {hora}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Motivo de la consulta</label>
            <textarea
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              rows="4"
              placeholder="Describe brevemente el motivo de tu consulta..."
            ></textarea>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Agendando...' : 'Agendar Cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevaCita;