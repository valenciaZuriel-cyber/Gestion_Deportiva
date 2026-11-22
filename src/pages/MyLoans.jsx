import { getLoans } from '../api/mockData';

export default function MyLoans() {
  const loans = getLoans();

  return (
    <div>
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
                <td><strong>{loan.itemNombre}</strong></td>
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
    </div>
  );
}