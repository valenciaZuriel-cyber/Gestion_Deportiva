import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Inventory from './pages/Inventory';
import MyLoans from './pages/MyLoans';
// import AdminPanel from './pages/AdminPanel'; 
import SidebarLayout from './components/Sidebar';

function PrivateRoute({ children, allowedRoles }) {
  const sesionRaw = sessionStorage.getItem('sesion_deportes');
  if (!sesionRaw) return <Navigate to="/login" replace />;

  const sesion = JSON.parse(sesionRaw);
  if (allowedRoles && !allowedRoles.includes(sesion.role)) {
    return <Navigate to="/inventario" replace />;
  }

  return <SidebarLayout>{children}</SidebarLayout>;
}

export default function App() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />

      {/* Inventario / Catálogo */}
      <Route
        path="/inventario"
        element={
          <PrivateRoute allowedRoles={['USER', 'ADMIN']}>
            <Inventory />
          </PrivateRoute>
        }
      />

      {/* Mis Solicitudes */}
      <Route
        path="/mis-solicitudes"
        element={
          <PrivateRoute allowedRoles={['USER']}>
            <MyLoans />
          </PrivateRoute>
        }
      />

      {/* Ruta de Administrador
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <AdminPanel />
          </PrivateRoute>
        }
      />
      */}

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}