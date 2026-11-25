import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import apiFetch from '../api/fetchClient';

function formatearHoraSalida(valor) {
  if (!valor) return '-';
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return String(valor);
  return fecha.toLocaleString('es-MX', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export default function MyLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    apiFetch
      .get('/api/sports/loans')
      .then((data) => {
        const lista = Array.isArray(data)
          ? data
          : Array.isArray(data?.loans)
            ? data.loans
            : Array.isArray(data?.data)
              ? data.data
              : [];
        setLoans(lista);
      })
      .catch((error) => setErrorMsg(error.message || 'Error al cargar préstamos.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <h1 style={{ marginBottom: 20 }}>Mis Préstamos Deportivos</h1>

        {loading && <p>Cargando préstamos...</p>}
        {errorMsg && <p className="error-text">{errorMsg}</p>}

        {!loading && !errorMsg && (
          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Artículo</th>
                  <th>Cantidad</th>
                  <th>Cancha / Actividad</th>
                  <th>Hora de Salida</th>
                  <th>Estatus</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan, idx) => {
                  const nombreArticulo =
                    typeof loan.item === 'string'
                      ? loan.item
                      : loan.item?.nombre || loan.itemNombre || 'Artículo';
                  const estatus = String(loan.estatus ?? loan.estado ?? 'ACTIVO').toUpperCase();

                  return (
                    <tr key={loan.loanId ?? loan.id ?? loan._id ?? idx}>
                      <td>
                        <strong>{nombreArticulo}</strong>
                        {loan.codigo ? ` (${loan.codigo})` : ''}
                      </td>
                      <td>{loan.cantidad ?? 1}</td>
                      <td>{loan.canchaOActividad || '-'}</td>
                      <td>{formatearHoraSalida(loan.horaSalida || loan.fechaSalida)}</td>
                      <td>
                        <span className={`badge badge-${estatus.toLowerCase()}`}>
                          {estatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}