import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { usuario, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-logo">
          🏥 Hospital Citas
        </Link>
        
        <div className="navbar-menu">
          <Link to="/dashboard" className="navbar-link">Dashboard</Link>
          <Link to="/doctores" className="navbar-link">Doctores</Link>
          <Link to="/mis-citas" className="navbar-link">Mis Citas</Link>
          <Link to="/nueva-cita" className="navbar-link">Nueva Cita</Link>
        </div>
        
        <div className="navbar-user">
          <span className="navbar-username">👤 {usuario?.nombre}</span>
          <button onClick={logout} className="btn btn-secondary btn-sm">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;