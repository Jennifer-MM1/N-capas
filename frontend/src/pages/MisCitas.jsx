import { useState, useEffect } from 'react';
import api from '../services/api';
import './MisCitas.css';

function MisCitas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      const { data } = await api.get('/citas');
      setCitas(data.data);
    } catch (error) {
      console.error('Error al cargar citas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelarCita = async (citaId) => {
    if (!window.confirm('¿Estás seguro de cancelar esta cita?')) return;

    try {
      await api.patch(`/citas/${citaId}/cancelar`, {
        motivo: 'Cancelada por el paciente'
      });
      
      setMensaje({ tipo: 'success', texto: 'Cita cancelada exitosamente' });
      cargarCitas();
      
      setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
    } catch (error) {
      setMensaje({ 
        tipo: 'error', 
        texto: error.response?.data?.message || 'Error al cancelar la cita' 
      });
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      pendiente: 'badge-warning',
      confirmada: 'badge-success',
      cancelada: 'badge-danger',
      completada: 'badge-info'
    };
    return badges[estado] || 'badge-info';
  };

  if (loading) {
    return <div className="loading">Cargando citas...</div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Mis Citas 📅</h1>
        <p>Gestiona tus citas médicas programadas</p>
      </div>

      {mensaje.texto && (
        <div className={`alert alert-${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      {citas.length === 0 ? (
        <div className="card text-center">
          <h3>No tienes citas programadas</h3>
          <p>Agenda tu primera cita para comenzar</p>
          <a href="/nueva-cita" className="btn btn-primary">Agendar Cita</a>
        </div>
      ) : (
        <div className="citas-lista">
          {citas.map(cita => (
            <div key={cita._id} className="card cita-item">
              <div className="cita-header">
                <h3>{cita.doctor?.nombre}</h3>
                <span className={`badge ${getEstadoBadge(cita.estado)}`}>
                  {cita.estado.toUpperCase()}
                </span>
              </div>

              <div className="cita-body">
                <div className="cita-detalle-grid">
                  <div className="cita-detalle-item">
                    <strong>🏥 Especialidad:</strong>
                    <span>{cita.doctor?.especialidad?.nombre}</span>
                  </div>

                  <div className="cita-detalle-item">
                    <strong>📅 Fecha:</strong>
                    <span>{formatearFecha(cita.fecha)}</span>
                  </div>

                  <div className="cita-detalle-item">
                    <strong>🕐 Hora:</strong>
                    <span>{cita.hora}</span>
                  </div>

                  <div className="cita-detalle-item">
                    <strong>🚪 Consultorio:</strong>
                    <span>{cita.doctor?.consultorio}</span>
                  </div>
                </div>

                {cita.motivo && (
                  <div className="cita-motivo">
                    <strong>Motivo:</strong> {cita.motivo}
                  </div>
                )}

                {cita.notasCancelacion && (
                  <div className="cita-notas">
                    <strong>Notas de cancelación:</strong> {cita.notasCancelacion}
                  </div>
                )}
              </div>

              {cita.estado !== 'cancelada' && cita.estado !== 'completada' && (
                <div className="cita-footer">
                  <button 
                    onClick={() => cancelarCita(cita._id)}
                    className="btn btn-danger"
                  >
                    Cancelar Cita
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MisCitas;