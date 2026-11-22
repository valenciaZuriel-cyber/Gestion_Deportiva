import { NavLink, useNavigate } from 'react-router-dom';
import { Home, HandHelping, User, LogOut } from 'lucide-react';

export default function SidebarLayout({ children }) {
  const navigate = useNavigate();
  const sesion = JSON.parse(sessionStorage.getItem('sesion_deportes') || '{}');
  const displayName = sesion.nombre || sesion.email || 'Estudiante Universitario';

  const handleLogout = () => {
    sessionStorage.removeItem('sesion_deportes');
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div>
          {/* Logo Silbato Deportivo Verde (#97D07B) + Gestión Deportiva */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, paddingLeft: 4 }}>
            <svg
              width="38"
              height="38"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Cuerpo circular del silbato y boquilla inclinada */}
              <path
                d="M21 15C13.8203 15 8 20.8203 8 28C8 35.1797 13.8203 41 21 41C27.5 41 32.88 36.23 33.84 30H35V22L42 18.5L39.5 13L25.5 19.5C24.1 16.8 22.65 15 21 15Z"
                stroke="#97D07B"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Ranura superior del silbato */}
              <path
                d="M28 18.3L30.5 23.2"
                stroke="#97D07B"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              {/* Aro trasero del silbato */}
              <circle
                cx="19.5"
                cy="28"
                r="4.5"
                stroke="#97D07B"
                strokeWidth="2.5"
              />
            </svg>

            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#FFFFFF' }}>Gestión</div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#FFFFFF' }}>Deportiva</div>
            </div>
          </div>

          {/* Enlaces de navegación idénticos a Figma */}
          <nav>
            <NavLink to="/inventario" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Home size={19} />
              Inicio
            </NavLink>

            <NavLink to="/mis-solicitudes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <HandHelping size={19} />
              Mis solicitudes
            </NavLink>
          </nav>
        </div>

        {/* Pie del Sidebar (Usuario + Cerrar Sesión) */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', marginBottom: 8 }}>
            <User size={18} color="#E4E4E4" />
            <span style={{ fontSize: 13, color: '#E4E4E4', wordBreak: 'break-word' }}>{displayName}</span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#E4E4E4',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              width: '100%',
            }}
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}