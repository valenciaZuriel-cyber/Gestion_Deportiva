import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { getItems, saveItems, getLoans, saveLoans } from '../api/mockData';

const DEPORTES = ['Todo', 'Fútbol', 'Básquetbol', 'Voleibol', 'Otros'];

export default function Inventory() {
  const [items, setItems] = useState(getItems());
  const [deporte, setDeporte] = useState('Todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [soloDisponibles, setSoloDisponibles] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [cancha, setCancha] = useState('');

  const sesion = JSON.parse(sessionStorage.getItem('sesion_deportes') || '{}');

  const filteredItems = items.filter((item) => {
    const matchDeporte = deporte === 'Todo' || item.deporte === deporte;
    const matchDisp = !soloDisponibles || item.cantidadDisponible > 0;
    const matchSearch =
      item.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchDeporte && matchDisp && matchSearch;
  });

  const handleRequestLoan = (e) => {
    e.preventDefault();
    if (!cancha.trim() || cantidad < 1 || cantidad > selectedItem.cantidadDisponible) return;

    const updatedItems = items.map((it) =>
      it.id === selectedItem.id
        ? { ...it, cantidadDisponible: it.cantidadDisponible - cantidad }
        : it
    );
    saveItems(updatedItems);
    setItems(updatedItems);

    const loans = getLoans();
    const newLoan = {
      id: Date.now(),
      itemId: selectedItem.id,
      itemNombre: selectedItem.nombre,
      usuarioNombre: sesion.email || 'Estudiante',
      matricula: 'A01987654',
      cantidad,
      canchaOActividad: cancha,
      fechaSalida: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estatus: 'ACTIVO',
    };
    saveLoans([newLoan, ...loans]);

    setSelectedItem(null);
    setCancha('');
    setCantidad(1);
  };

  return (
    <div>
      {/* Cabecera: Título + Buscador a la derecha (como en Figma) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <h1>Material Deportivo</h1>

        <div style={{ position: 'relative', width: 260 }}>
          <input
            type="text"
            className="input-control"
            style={{ width: '100%', paddingRight: 36, borderRadius: 20 }}
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={16} style={{ position: 'absolute', right: 14, top: 12, color: '#8C8C8C' }} />
        </div>
      </div>

      {/* Filtros de disciplina + Checkbox Solo disponibles a la derecha */}
      <div className="filters-bar">
        {DEPORTES.map((dep) => (
          <button
            key={dep}
            className={`chip ${deporte === dep ? 'active' : ''}`}
            style={deporte === dep ? { backgroundColor: '#D07B7B', color: '#FFFFFF' } : {}}
            onClick={() => setDeporte(dep)}
          >
            {dep}
          </button>
        ))}

        <label style={{ marginLeft: 'auto', fontSize: 13, display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
          Solo disponibles
          <input
            type="checkbox"
            checked={soloDisponibles}
            onChange={(e) => setSoloDisponibles(e.target.checked)}
          />
        </label>
      </div>

      {/* Grid de tarjetas idéntico a Inicio/Usuario de Figma */}
      <div className="cards-grid">
        {filteredItems.map((item) => (
          <div className="item-card" key={item.id}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>{item.nombre}</h3>
              <span className="item-code">{item.codigo}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0' }}>
              <span style={{ fontSize: 13 }}>
                <strong>{item.cantidadDisponible}/{item.cantidadTotal}</strong> Disponibles
              </span>
              <span className={`badge badge-${item.estadoFisico.toLowerCase()}`}>
                {item.estadoFisico}
              </span>
            </div>

            <button
              className="btn btn-primary btn-full"
              disabled={item.cantidadDisponible === 0}
              onClick={() => {
                setSelectedItem(item);
                setCantidad(1);
              }}
            >
              {item.cantidadDisponible === 0 ? 'Agotado' : 'Solicitar préstamo'}
            </button>
          </div>
        ))}
      </div>

      {/* Modal Solicitud Préstamo (100% fiel a Solicitud/Usuario de Figma) */}
      {selectedItem && (
        <div className="modal-backdrop">
          <form className="modal-box" onSubmit={handleRequestLoan} style={{ maxWidth: 410 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ fontSize: 18 }}>Solicitud Préstamo</h3>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3C3737' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: 14, fontWeight: 600 }}>
              {selectedItem.nombre} ({selectedItem.codigo})
            </p>

            <span className="badge badge-bueno" style={{ margin: '8px 0 18px', padding: '4px 12px' }}>
              {selectedItem.cantidadDisponible} Disponibles
            </span>

            {/* Stepper [- 1 +] de Figma */}
            <div className="input-group">
              <label>Cantidad</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ width: 36, height: 36, padding: 0, border: '1px solid #D1D1D1' }}
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                >
                  -
                </button>
                <span style={{ fontWeight: 700, fontSize: 16, minWidth: 24, textAlign: 'center' }}>
                  {cantidad}
                </span>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ width: 36, height: 36, padding: 0, border: '1px solid #D1D1D1' }}
                  onClick={() => setCantidad(Math.min(selectedItem.cantidadDisponible, cantidad + 1))}
                >
                  +
                </button>
              </div>
            </div>

            <div className="input-group">
              <label>Cancha o Actividad</label>
              <input
                type="text"
                required
                placeholder="Ej. Cancha 2 - Torneo Interno"
                className="input-control"
                value={cancha}
                onChange={(e) => setCancha(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setSelectedItem(null)}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-success">
                Confirmar Préstamo
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}