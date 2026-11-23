import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Inventory from './pages/Inventory';
import MyLoans from './pages/MyLoans';
// import AdminPanel from './pages/AdminPanel'; // Descomentar cuando actives Admin

function App() {
  const estaAutenticado = () => {
    return localStorage.getItem('sesion_deportes') !== null;
  };

  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />

      {/* Rutas Protegidas directas sin children */}
      <Route
        path="/inventario"
        element={estaAutenticado() ? <Inventory /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/mis-solicitudes"
        element={estaAutenticado() ? <MyLoans /> : <Navigate to="/login" replace />}
      />

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;