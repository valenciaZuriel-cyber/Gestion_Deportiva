import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sesionExistente = sessionStorage.getItem('sesion_deportes');
    if (sesionExistente) navigate('/inventario');
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Por favor complete los campos obligatorios');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      const payload = {
        email: formData.email,
        role: 'USER',
        accessToken: 'mock-jwt-access-token',
        refreshToken: 'mock-jwt-refresh-token',
        fechaIngreso: new Date().toLocaleTimeString(),
      };
      sessionStorage.setItem('sesion_deportes', JSON.stringify(payload));
      setLoading(false);
      navigate('/inventario');
    }, 500);
  };

  return (
    <div className="auth-wrapper">
      {/* Panel Izquierdo Rojo Terracota con Trofeo y Balones en líneas blancas */}
      <div className="auth-brand-panel">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 14 }}>
          <Trophy size={54} color="#FFFFFF" strokeWidth={2} />

          {/* Dos balones en trazo blanco idénticos a tu Figma */}
          <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
            {/* Balón de Básquetbol blanco */}
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2.2 12h19.6" />
              <path d="M12 2.2v19.6" />
              <path d="M4.9 4.9a14 14 0 0 1 0 14.2" />
              <path d="M19.1 4.9a14 14 0 0 0 0 14.2" />
            </svg>

            {/* Balón de Fútbol blanco */}
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="12 7 16.5 10.3 14.8 15.5 9.2 15.5 7.5 10.3" />
              <path d="M12 2v5" />
              <path d="M21.5 9l-5 1.3" />
              <path d="M18 20l-3.2-4.5" />
              <path d="M6 20l3.2-4.5" />
              <path d="M2.5 9l5 1.3" />
            </svg>
          </div>
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.15 }}>
          Coordinación
          <br />
          Deportiva
        </h1>
        <p style={{ fontSize: 13, opacity: 0.9, marginTop: 10 }}>
          Gestión de material y espacios deportivos.
        </p>
      </div>

      {/* Panel Derecho Formulario */}
      <div className="auth-form-panel">
        <div style={{ width: '100%', maxWidth: 400 }}>
          <form onSubmit={handleSubmit} className="auth-card" style={{ borderRadius: 22 }}>
            <h2 style={{ textAlign: 'center', fontSize: 20, fontWeight: 700 }}>Iniciar Sesión</h2>
            <p style={{ textAlign: 'center', fontSize: 12, color: '#3C3737', marginBottom: 26 }}>
              Ingresa tus datos para acceder al sistema
            </p>

            {error && <p className="error-text" style={{ marginBottom: 12 }}>{error}</p>}

            <div className="input-group">
              <label style={{ fontSize: 12, fontWeight: 500 }}>Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-control"
              />
            </div>

            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: 12, fontWeight: 500 }}>Contraseña</label>
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ fontSize: 11, color: '#8C8C8C', cursor: 'pointer' }}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </span>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-control"
                  style={{ width: '100%', paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: 10,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#8C8C8C',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div style={{ textAlign: 'right', marginTop: 2 }}>
                <span style={{ fontSize: 11, color: '#8C8C8C', textDecoration: 'underline', cursor: 'pointer' }}>
                  Olvidé mi contraseña
                </span>
              </div>
            </div>

            {/* Botón centrado en forma de píldora idéntico a Figma */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: 210, borderRadius: 24, padding: '12px 24px' }}
              >
                {loading ? 'Validando...' : 'Iniciar Sesión'}
              </button>
            </div>
          </form>

          <p style={{ marginTop: 20, fontSize: 13, textAlign: 'center', color: '#7BB2D0' }}>
            ¿No tienes cuenta?{' '}
            <Link to="/registro" style={{ color: '#7BB2D0', fontWeight: 700, textDecoration: 'underline' }}>
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;