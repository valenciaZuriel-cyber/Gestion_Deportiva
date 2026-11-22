import { useState } from 'react';
import { Plus, Pencil, Search, CheckCircle } from 'lucide-react';
import { getItems, saveItems, getLoans, saveLoans, getUsers, saveUsers } from '../api/mockData';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('items');
  const [items, setItems] = useState(getItems());
  const [loans, setLoans] = useState(getLoans());
  const [users, setUsers] = useState(getUsers());

  const [itemModal, setItemModal] = useState(null);
  const [returnForm, setReturnForm] = useState({});
  const [searchUser, setSearchUser] = useState('');

  const handleSaveItem = (e) => {
    e.preventDefault();
    const { mode, data } = itemModal;
    let updated;
    if (mode === 'create') {
      const newItem = {
        ...data,
        id: Date.now(),
        cantidadTotal: Number(data.cantidadTotal),
        cantidadDisponible: Number(data.cantidadTotal),
      };
      updated = [newItem, ...items];
    } else {
      updated = items.map((it) =>
        it.id === data.id
          ? {
              ...it,
              nombre: data.nombre,
              deporte: data.deporte,
              estadoFisico: data.estadoFisico,
              cantidadTotal: Number(data.cantidadTotal),
              cantidadDisponible: Math.min(it.cantidadDisponible, Number(data.cantidadTotal)),
            }
          : it
      );
    }
    saveItems(updated);
    setItems(updated);
    setItemModal(null);
  };

  const handleReceiveMaterial = (loan) => {
    const updatedLoans = loans.map((l) =>
      l.id === loan.id ? { ...l, estatus: 'FINALIZADO' } : l
    );
    saveLoans(updatedLoans);
    setLoans(updatedLoans);

    const updatedItems = items.map((it) =>
      it.id === loan.itemId
        ? { ...it, cantidadDisponible: Math.min(it.cantidadTotal, it.cantidadDisponible + loan.cantidad) }
        : it
    );
    saveItems(updatedItems);
    setItems(updatedItems);
  };

  const handleRoleChange = (userId, newRole) => {
    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    saveUsers(updatedUsers);
    setUsers(updatedUsers);
  };

  const activeLoans = loans.filter((l) => l.estatus === 'ACTIVO');
  const filteredUsers = users.filter(
    (u) =>
      u.nombre.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.matricula.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div>
      <h1>Panel de Coordinación Deportiva</h1>

      <div className="tabs-header">
        <button className={`tab-btn ${activeTab === 'items' ? 'active' : ''}`} onClick={() => setActiveTab('items')}>
          1. Alta y Edición de Ítems
        </button>
        <button className={`tab-btn ${activeTab === 'loans' ? 'active' : ''}`} onClick={() => setActiveTab('loans')}>
          2. Recepción de Material ({activeLoans.length})
        </button>
        <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          3. Gestión de Usuarios
        </button>
      </div>

      {activeTab === 'items' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button
              className="btn btn-primary"
              onClick={() =>
                setItemModal({
                  mode: 'create',
                  data: { codigo: '', nombre: '', deporte: 'Fútbol', estadoFisico: 'NUEVO', cantidadTotal: 1 },
                })
              }
            >
              <Plus size={16} /> Nuevo Ítem
            </button>
          </div>

          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Artículo</th>
                  <th>Deporte</th>
                  <th>Estado Físico</th>
                  <th>Disponibles / Total</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td><span className="item-code">{item.codigo}</span></td>
                    <td><strong>{item.nombre}</strong></td>
                    <td>{item.deporte}</td>
                    <td>
                      <span className={`badge badge-${item.estadoFisico.toLowerCase()}`}>
                        {item.estadoFisico}
                      </span>
                    </td>
                    <td>{item.cantidadDisponible} / {item.cantidadTotal}</td>
                    <td>
                      <button className="btn btn-ghost" onClick={() => setItemModal({ mode: 'edit', data: { ...item } })}>
                        <Pencil size={15} /> Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'loans' && (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Material (Cant.)</th>
                <th>Cancha / Actividad</th>
                <th>Estado Devolución</th>
                <th>Notas</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {activeLoans.map((loan) => {
                const current = returnForm[loan.id] || { estadoDevolucion: 'BUENO', notas: '' };
                return (
                  <tr key={loan.id}>
                    <td>
                      <strong>{loan.usuarioNombre}</strong>
                      <br />
                      <small style={{ color: '#8C8C8C' }}>{loan.matricula}</small>
                    </td>
                    <td>{loan.itemNombre} <strong>(x{loan.cantidad})</strong></td>
                    <td>{loan.canchaOActividad}</td>
                    <td>
                      <select
                        className="input-control"
                        value={current.estadoDevolucion}
                        onChange={(e) =>
                          setReturnForm({ ...returnForm, [loan.id]: { ...current, estadoDevolucion: e.target.value } })
                        }
                      >
                        <option value="BUENO">BUENO</option>
                        <option value="DAÑADO">DAÑADO</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-control"
                        placeholder="Observaciones..."
                        value={current.notas}
                        onChange={(e) =>
                          setReturnForm({ ...returnForm, [loan.id]: { ...current, notas: e.target.value } })
                        }
                      />
                    </td>
                    <td>
                      <button className="btn btn-success" onClick={() => handleReceiveMaterial(loan)}>
                        <CheckCircle size={15} /> Recibir Material
                      </button>
                    </td>
                  </tr>
                );
              })}
              {activeLoans.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#8C8C8C', padding: 24 }}>
                    No hay préstamos activos pendientes de recepción.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div>
          <div className="input-group" style={{ maxWidth: 340 }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="input-control"
                style={{ width: '100%', paddingLeft: 36 }}
                placeholder="Buscar por nombre o matrícula..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
              <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#8C8C8C' }} />
            </div>
          </div>

          <div className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Matrícula</th>
                  <th>Correo</th>
                  <th>Estatus</th>
                  <th>Rol (USER / ADMIN)</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.nombre}</strong></td>
                    <td><span className="item-code">{u.matricula}</span></td>
                    <td>{u.email}</td>
                    <td><span className="badge badge-activo-user">Activo</span></td>
                    <td>
                      <select
                        className="input-control"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        style={{
                          backgroundColor: u.role === 'ADMIN' ? '#D07B7B' : '#7BB2D0',
                          color: u.role === 'ADMIN' ? '#FFFFFF' : '#3C3737',
                          fontWeight: 700,
                        }}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {itemModal && (
        <div className="modal-backdrop">
          <form className="modal-box" onSubmit={handleSaveItem}>
            <h3 style={{ marginBottom: 16 }}>
              {itemModal.mode === 'create' ? 'Nuevo Material Deportivo' : 'Editar Material Deportivo'}
            </h3>

            <div className="input-group">
              <label>Código (ej. FUT-001)</label>
              <input
                required
                disabled={itemModal.mode === 'edit'}
                className="input-control"
                value={itemModal.data.codigo}
                onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, codigo: e.target.value } })}
              />
            </div>

            <div className="input-group">
              <label>Nombre del Artículo</label>
              <input
                required
                className="input-control"
                value={itemModal.data.nombre}
                onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, nombre: e.target.value } })}
              />
            </div>

            <div className="input-group">
              <label>Deporte</label>
              <select
                className="input-control"
                value={itemModal.data.deporte}
                onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, deporte: e.target.value } })}
              >
                <option value="Fútbol">Fútbol</option>
                <option value="Básquetbol">Básquetbol</option>
                <option value="Voleibol">Voleibol</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div className="input-group">
              <label>Estado Físico</label>
              <select
                className="input-control"
                value={itemModal.data.estadoFisico}
                onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, estadoFisico: e.target.value } })}
              >
                <option value="NUEVO">NUEVO</option>
                <option value="BUENO">BUENO</option>
                <option value="DESGASTADO">DESGASTADO</option>
              </select>
            </div>

            <div className="input-group">
              <label>Cantidad Total</label>
              <input
                type="number"
                min="1"
                required
                className="input-control"
                value={itemModal.data.cantidadTotal}
                onChange={(e) => setItemModal({ ...itemModal, data: { ...itemModal.data, cantidadTotal: e.target.value } })}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setItemModal(null)}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                {itemModal.mode === 'create' ? 'Guardar Ítem' : 'Actualizar Ítem'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}