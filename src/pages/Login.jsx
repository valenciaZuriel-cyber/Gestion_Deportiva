import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Eye, EyeOff } from 'lucide-react';
import apiFetch from '../api/fetchClient';

function obtenerSesionActiva() {
  try {
    const raw = localStorage.getItem('sesion_deportes');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const token = parsed?.token || parsed?.accessToken;
    if (!token) return null;
    return {
      ...parsed,
      role: String(parsed?.role || parsed?.rol || 'USER').toUpperCase(),
    };
  } catch {
    localStorage.removeItem('sesion_deportes');
    return null;
  }
}

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sesion = obtenerSesionActiva();
    if (sesion) {
      navigate(sesion.role === 'ADMIN' ? '/admin' : '/inventario', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Por favor complete los campos obligatorios.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await apiFetch.post('/api/auth/login', {
        email: formData.email.trim(),
        password: formData.password,
      });

      const token =
        data?.token ||
        data?.accessToken ||
        data?.data?.token ||
        data?.data?.accessToken ||
        '';

      if (!token) {
        throw new Error('La respuesta del servidor no incluyó un token de sesión.');
      }

      const usuario = data?.user || data?.data?.user || {};
      const role = String(
        usuario?.rol || usuario?.role || data?.rol || data?.role || 'USER'
      ).toUpperCase();

      const payload = {
        id: usuario?.id ?? null,
        email: usuario?.email || formData.email.trim(),
        nombre: usuario?.nombre || usuario?.name || '',
        matricula: usuario?.matricula || '',
        role,
        token,
        accessToken: token,
        fechaIngreso: new Date().toLocaleTimeString(),
      };

      localStorage.setItem('sesion_deportes', JSON.stringify(payload));
      navigate(role === 'ADMIN' ? '/admin' : '/inventario', { replace: true });
    } catch (err) {
      setError(err?.message || 'Credenciales incorrectas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-brand-panel">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            marginBottom: 20,
          }}
        >
          <Trophy size={48} color="#FFFFFF" strokeWidth={1.8} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <svg
              width="46"
              height="46"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M2.5 12h19" />
              <path d="M12 2v20" />
              <path d="M4.9 4.9c4.2 3.8 4.2 10.4 0 14.2" />
              <path d="M19.1 4.9c-4.2 3.8-4.2 10.4 0 14.2" />
            </svg>

            <svg
              width="46"
              height="46"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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

        <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 8 }}>
          Coordinación Deportiva
        </h1>
        <p style={{ fontSize: 15, opacity: 0.92 }}>
          Gestión de material y espacios deportivos.
        </p>
      </div>

      <div className="auth-form-panel">
        <div style={{ width: '100%', maxWidth: 400 }}>
          <form onSubmit={handleSubmit} className="auth-card" style={{ borderRadius: 22 }}>
            <h2 style={{ textAlign: 'center', fontSize: 20, fontWeight: 700 }}>
              Iniciar Sesión
            </h2>
            <p
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: '#8C8C8C',
                marginBottom: 22,
              }}
            >
              Ingresa tus datos para acceder al sistema
            </p>

            {error && (
              <p className="error-text" style={{ marginBottom: 12 }}>
                {error}
              </p>
            )}

            <div className="input-group">
              <label htmlFor="login-email" style={{ fontSize: 12, fontWeight: 500 }}>
                Correo Electrónico
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-control"
                placeholder="alumno@equipo-b2.utr"
                autoComplete="email"
              />
            </div>

            <div className="input-group" style={{ marginBottom: 6 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <label htmlFor="login-password" style={{ fontSize: 12, fontWeight: 500 }}>
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8C8C8C',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-control"
                  style={{ width: '100%', paddingRight: 40 }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
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

              <div style={{ textAlign: 'right', marginTop: 4 }}>
                <span
                  onClick={() =>
                    setError('Contacta a la Coordinación Deportiva para restablecer tu contraseña.')
                  }
                  style={{
                    fontSize: 11,
                    color: '#8C8C8C',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Olvidé mi contraseña
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
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

          <p
            style={{
              marginTop: 20,
              fontSize: 13,
              textAlign: 'center',
              color: '#8C8C8C',
            }}
          >
            ¿No tienes cuenta?{' '}
            <Link
              to="/registro"
              style={{ color: '#7BB2D0', fontWeight: 700, textDecoration: 'none' }}
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}