import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUsers, saveUsers } from '../api/mockData';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    matricula: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).some((v) => !v.trim())) {
      setError('Por favor complete todos los campos obligatorios');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      const users = getUsers();
      const newUser = {
        id: Date.now(),
        nombre: formData.nombre,
        matricula: formData.matricula,
        email: formData.email,
        activo: true,
        role: 'USER',
      };
      saveUsers([...users, newUser]);
      setLoading(false);
      navigate('/login');
    }, 500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <form onSubmit={handleSubmit} className="auth-card" style={{ maxWidth: 400 }}>
        <h2 style={{ textAlign: 'center', fontSize: 22 }}>¡REGÍSTRATE!</h2>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#8C8C8C', marginBottom: 18 }}>
          Regístrate para acceder al sistema
        </p>

        {error && <p className="error-text" style={{ marginBottom: 12 }}>{error}</p>}

        <div className="input-group">
          <label>Nombre Completo</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="input-control" />
        </div>

        <div className="input-group">
          <label>Matrícula / ID</label>
          <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} className="input-control" />
        </div>

        <div className="input-group">
          <label>Correo Electrónico</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-control" />
        </div>

        <div className="input-group">
          <label>Contraseña</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-control" />
        </div>

        <div className="input-group">
          <label>Confirmar Contraseña</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-control" />
        </div>

        <div style={{ textAlign: 'center', margin: '10px 0 14px' }}>
          <span className="badge badge-user" style={{ padding: '5px 14px', fontSize: 11 }}>
            Rol por defecto: Estudiante
          </span>
        </div>

        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

        <p style={{ marginTop: 14, fontSize: 13, textAlign: 'center', color: '#8C8C8C' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: '#7BB2D0', fontWeight: 700, textDecoration: 'none' }}>
            Inicia Sesión
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;