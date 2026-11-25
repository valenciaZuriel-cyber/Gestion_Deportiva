import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Inventory from './pages/Inventory';
import MyLoans from './pages/MyLoans';

function leerSesionValida() {
  try {
    const raw = localStorage.getItem('sesion_deportes');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const token = parsed?.token || parsed?.accessToken;
    if (!token || typeof token !== 'string') return null;
    return parsed;
  } catch {
    localStorage.removeItem('sesion_deportes');
    return null;
  }
}

export default function App() {
  const [sesion, setSesion] = useState(() => leerSesionValida());
  const location = useLocation();

  const sincronizarSesion = useCallback(() => {
    setSesion(leerSesionValida());
  }, []);

  useEffect(() => {
    sincronizarSesion();
  }, [location.pathname, sincronizarSesion]);

  const estaAutenticado = Boolean(sesion?.token || sesion?.accessToken);

  return (
    <Routes>
      <Route
        path="/"
        element={
          estaAutenticado ? (
            <Navigate to="/inventario" replace />
          ) : (
            <Login onLoginSuccess={sincronizarSesion} />
          )
        }
      />
      <Route
        path="/login"
        element={
          estaAutenticado ? (
            <Navigate to="/inventario" replace />
          ) : (
            <Login onLoginSuccess={sincronizarSesion} />
          )
        }
      />
      <Route
        path="/registro"
        element={
          estaAutenticado ? <Navigate to="/inventario" replace /> : <Register />
        }
      />

      <Route
        path="/inventario"
        element={
          estaAutenticado ? <Inventory /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/mis-solicitudes"
        element={
          estaAutenticado ? <MyLoans /> : <Navigate to="/login" replace />
        }
      />

      <Route
        path="*"
        element={
          <Navigate to={estaAutenticado ? '/inventario' : '/login'} replace />
        }
      />
    </Routes>
  );
}