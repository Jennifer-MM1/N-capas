import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const { usuario } = useContext(AuthContext);
  const [stats, setStats] = useState({
    citasPendientes: 0,
    citasConfirmadas: 0,
    proximaCita: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const { data } = await api.get('/citas');
      const citas = data.data;
      
      const pendientes = citas.filter(c => c.estado === 'pendiente').length;
      const confirmadas = citas.filter(c => c.estado === 'confirmada').length;
      
      // Encontrar próxima cita
      const citasFuturas = citas
        .filter(c => new Date(c.fecha) >= new Date() && c.estado !== 'cancelada')
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      
      setStats({
        citasPendientes: pendientes,
        citasConfirmadas: confirmadas,
        proximaCita: citasFuturas[0] || null
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Bienvenido, {usuario?.nombre}! 👋</h1>
        <p>Gestiona tus citas médicas de forma fácil y rápida</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-pendiente">
          <div className="stat-icon">⏰</div>
          <div className="stat-info">
            <h3>{stats.citasPendientes}</h3>
            <p>Citas Pendientes</p>
          </div>
        </div>

        <div className="stat-card stat-confirmada">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.citasConfirmadas}</h3>
            <p>Citas Confirmadas</p>
          </div>
        </div>

        <div className="stat-card stat-proxima">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{stats.proximaCita ? 'Próxima Cita' : 'Sin Citas'}</h3>
            <p>
              {stats.proximaCita 
                ? `${formatearFecha(stats.proximaCita.fecha)} - ${stats.proximaCita.hora}`
                : 'No tienes citas programadas'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="actions-grid">
          <Link to="/nueva-cita" className="action-card">
            <div className="action-icon">➕</div>
            <h3>Agendar Nueva Cita</h3>
            <p>Programa tu próxima consulta médica</p>
          </Link>

          <Link to="/mis-citas" className="action-card">
            <div className="action-icon">📋</div>
            <h3>Mis Citas</h3>
            <p>Ver todas tus citas programadas</p>
          </Link>

          <Link to="/doctores" className="action-card">
            <div className="action-icon">👨‍⚕️</div>
            <h3>Ver Doctores</h3>
            <p>Explora nuestro equipo médico</p>
          </Link>
        </div>
      </div>

      {stats.proximaCita && (
        <div className="card proxima-cita-detalle">
          <h2>Tu Próxima Cita</h2>
          <div className="cita-detalle">
            <div className="cita-info">
              <p><strong>Doctor:</strong> {stats.proximaCita.doctor?.nombre}</p>
              <p><strong>Especialidad:</strong> {stats.proximaCita.doctor?.especialidad?.nombre}</p>
              <p><strong>Fecha:</strong> {formatearFecha(stats.proximaCita.fecha)}</p>
              <p><strong>Hora:</strong> {stats.proximaCita.hora}</p>
              <p><strong>Consultorio:</strong> {stats.proximaCita.doctor?.consultorio}</p>
              {stats.proximaCita.motivo && (
                <p><strong>Motivo:</strong> {stats.proximaCita.motivo}</p>
              )}
            </div>
            <span className={`badge badge-${stats.proximaCita.estado === 'confirmada' ? 'success' : 'warning'}`}>
              {stats.proximaCita.estado.toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard