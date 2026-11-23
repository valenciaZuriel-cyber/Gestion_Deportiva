import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getLoans } from '../api/mockData';
// import fetchClient from '../api/fetchClient'; // <-- DESCOMENTAR AL CONECTAR API

export default function MyLoans() {
  const [loans, setLoans] = useState(getLoans());

  /* =========================================================================
     CÓDIGO REAL PARA TRAER MIS PRÉSTAMOS DE LA API (DESCOMENTAR ESTE BLOQUE):
     =========================================================================
  useEffect(() => {
    fetchClient
      .get('/sports/loans/my')
      .then((data) => setLoans(data))
      .catch((error) => console.error('Error al cargar préstamos:', error.message));
  }, []);
  ========================================================================= */

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <h1 style={{ marginBottom: 20 }}>Mis Préstamos Deportivos</h1>

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
              {loans.map((loan) => (
                <tr key={loan.id}>
                  <td><strong>{loan.item?.nombre || loan.itemNombre}</strong></td>
                  <td>{loan.cantidad}</td>
                  <td>{loan.canchaOActividad}</td>
                  <td>{loan.fechaSalida}</td>
                  <td>
                    <span className={`badge badge-${loan.estatus.toLowerCase()}`}>
                      {loan.estatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}