import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
// import fetchClient from '../api/fetchClient'; // <-- DESCOMENTAR AL CONECTAR API

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sesionExistente = localStorage.getItem('sesion_deportes');
    if (sesionExistente) {
      navigate('/inventario', { replace: true });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Por favor complete los campos obligatorios');
      return;
    }

    setError('');
    setLoading(true);

    /* =========================================================================
       CÓDIGO REAL PARA CUANDO EL PROFESOR PASE LA API (DESCOMENTAR ESTE BLOQUE):
       =========================================================================
    try {
      const data = await fetchClient.post('/auth/login', formData);
      const payload = {
        email: formData.email,
        role: data.user?.role || 'USER',
        accessToken: data.accessToken, // Ajustar a data.token si su API lo llama así
        refreshToken: data.refreshToken || '',
        fechaIngreso: new Date().toLocaleTimeString(),
      };
      localStorage.setItem('sesion_deportes', JSON.stringify(payload));
      navigate('/inventario', { replace: true });
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
    return;
    ========================================================================= */

    // SIMULACIÓN TEMPORAL SIN BACKEND (Borrar al activar el bloque de arriba)
    setTimeout(() => {
      const payload = {
        email: formData.email,
        role: 'USER',
        accessToken: 'mock-jwt-access-token',
        refreshToken: 'mock-jwt-refresh-token',
        fechaIngreso: new Date().toLocaleTimeString(),
      };

      localStorage.setItem('sesion_deportes', JSON.stringify(payload));
      setLoading(false);
      navigate('/inventario', { replace: true });
    }, 500);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-brand-panel">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <Trophy size={48} color="#FFFFFF" strokeWidth={1.8} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2.5 12h19" />
              <path d="M12 2v20" />
              <path d="M4.9 4.9c4.2 3.8 4.2 10.4 0 14.2" />
              <path d="M19.1 4.9c-4.2 3.8-4.2 10.4 0 14.2" />
            </svg>

            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="12 7.5 16.2 10.6 14.6 15.5 9.4 15.5 7.8 10.6" />
              <path d="M12 2v5.5" />
              <path d="M16.2 10.6l5-2.1" />
              <path d="M14.6 15.5l3.2 4.3" />
              <path d="M9.4 15.5l-3.2 4.3" />
              <path d="M7.8 10.6l-5-2.1" />
            </svg>
          </div>
        </div>

        <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Coordinación Deportiva</h1>
        <p style={{ fontSize: 15, opacity: 0.92 }}>
          Gestión de material y espacios deportivos.
        </p>
      </div>

      <div className="auth-form-panel">
        <form onSubmit={handleSubmit} className="auth-card">
          <h2 style={{ textAlign: 'center', fontSize: 22, marginBottom: 4 }}>Iniciar Sesión</h2>
          <p style={{ textAlign: 'center', fontSize: 12, color: '#8C8C8C', marginBottom: 22 }}>
            Ingresa tus datos para acceder al sistema
          </p>

          {error && <p className="error-text" style={{ marginBottom: 12 }}>{error}</p>}

          <div className="input-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-control"
              placeholder="correo@universidad.edu.mx"
            />
          </div>

          <div className="input-group" style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Contraseña</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8C8C8C',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
              {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-control"
              placeholder="••••••••"
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: 22 }}>
            <a
              href="#recuperar"
              onClick={(e) => e.preventDefault()}
              style={{ fontSize: 12, color: '#8C8C8C', textDecoration: 'underline' }}
            >
              Olvidé mi contraseña
            </a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: 210, borderRadius: 24, padding: '12px 24px' }}
            >
              {loading ? 'Validando...' : 'Iniciar Sesión'}
            </button>
          </div>

          <p style={{ marginTop: 22, fontSize: 13, textAlign: 'center', color: '#8C8C8C' }}>
            ¿No tienes cuenta?{' '}
            <Link to="/registro" style={{ color: '#7BB2D0', fontWeight: 700, textDecoration: 'none' }}>
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;