import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Inventory from './pages/Inventory';
import MyLoans from './pages/MyLoans';

function obtenerSesion() {
  try {
    const raw = localStorage.getItem('sesion_deportes');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.token && !parsed?.accessToken) return null;
    return parsed;
  } catch {
    localStorage.removeItem('sesion_deportes');
    return null;
  }
}

function App() {
  const sesion = obtenerSesion();
  const destinoAutenticado = sesion?.role === 'ADMIN' ? '/admin' : '/inventario';

  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route
        path="/"
        element={sesion ? <Navigate to={destinoAutenticado} replace /> : <Login />}
      />
      <Route
        path="/login"
        element={sesion ? <Navigate to={destinoAutenticado} replace /> : <Login />}
      />
      <Route
        path="/registro"
        element={sesion ? <Navigate to={destinoAutenticado} replace /> : <Register />}
      />

      {/* Rutas Protegidas */}
      <Route
        path="/inventario"
        element={sesion ? <Inventory /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/mis-solicitudes"
        element={sesion ? <MyLoans /> : <Navigate to="/login" replace />}
      />

      {/* Ruta por defecto */}
      <Route
        path="*"
        element={<Navigate to={sesion ? destinoAutenticado : '/login'} replace />}
      />
    </Routes>
  );
}

export default App;
