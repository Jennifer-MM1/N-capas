import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Páginas
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Doctores from './pages/Doctores';
import MisCitas from './pages/MisCitas';
import NuevaCita from './pages/NuevaCita';
import Navbar from './components/Navbar';

// Componente para rutas protegidas
const RutaProtegida = ({ children }) => {
  const { usuario, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return usuario ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  const { usuario } = useContext(AuthContext);

  return (
    <Router>
      {usuario && <Navbar />}
      <Routes>
        <Route path="/login" element={!usuario ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/registro" element={!usuario ? <Registro /> : <Navigate to="/dashboard" />} />
        
        <Route path="/dashboard" element={
          <RutaProtegida>
            <Dashboard />
          </RutaProtegida>
        } />
        
        <Route path="/doctores" element={
          <RutaProtegida>
            <Doctores />
          </RutaProtegida>
        } />
        
        <Route path="/mis-citas" element={
          <RutaProtegida>
            <MisCitas />
          </RutaProtegida>
        } />
        
        <Route path="/nueva-cita" element={
          <RutaProtegida>
            <NuevaCita />
          </RutaProtegida>
        } />
        
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;