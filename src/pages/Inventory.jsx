import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import apiFetch from '../api/fetchClient';

const DEPORTES = ['Todo', 'Fútbol', 'Básquetbol', 'Voleibol', 'Otros'];
const DEPORTES_PRINCIPALES = ['fútbol', 'futbol', 'básquetbol', 'basquetbol', 'voleibol'];

function normalizarTexto(texto) {
  return String(texto || '').trim().toLowerCase();
}

function normalizarItem(raw, index) {
  const disponible = Number(
    raw?.cantidadDisponible ?? raw?.disponibles ?? raw?.stockDisponible ?? raw?.cantidad ?? 0
  );
  const total = Number(
    raw?.cantidadTotal ?? raw?.total ?? raw?.stockTotal ?? Math.max(disponible, 0)
  );
  const estado = String(raw?.estadoFisico ?? raw?.estado_fisico ?? raw?.estado ?? 'BUENO').toUpperCase();

  return {
    id: raw?.id ?? raw?._id ?? index + 1,
    codigo: raw?.codigo ?? raw?.sku ?? `MAT-${index + 1}`,
    nombre: raw?.nombre ?? raw?.name ?? raw?.titulo ?? 'Artículo deportivo',
    deporte: raw?.deporte ?? raw?.disciplina ?? raw?.categoria ?? 'Otros',
    estadoFisico: estado,
    cantidadDisponible: disponible,
    cantidadTotal: total,
  };
}

function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem('sesion_deportes') || '{}');
  } catch {
    return {};
  }
}

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [deporte, setDeporte] = useState('Todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [soloDisponibles, setSoloDisponibles] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [cancha, setCancha] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const sesion = leerSesion();
  const isAdmin = sesion.role === 'ADMIN';

  const cargarInventario = useCallback(async () => {
    setLoadingItems(true);
    setErrorMsg('');
    try {
      const data = await apiFetch.get('/api/sports/items');
      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.data)
            ? data.data
            : [];
      setItems(lista.map(normalizarItem));
    } catch (error) {
      setErrorMsg(error.message || 'No se pudo cargar el inventario.');
    } finally {
      setLoadingItems(false);
    }
  }, []);

  useEffect(() => {
    cargarInventario();
  }, [cargarInventario]);

  const filteredItems = items.filter((item) => {
    const depItem = normalizarTexto(item.deporte);
    const depFiltro = normalizarTexto(deporte);

    let matchDeporte = true;
    if (depFiltro === 'otros') {
      matchDeporte =
        depItem === 'otros' ||
        depItem === 'otro' ||
        !DEPORTES_PRINCIPALES.some((principal) => depItem.includes(principal));
    } else if (depFiltro !== 'todo' && depFiltro !== 'todos') {
      matchDeporte = depItem.includes(depFiltro);
    }

    const matchDisp = !soloDisponibles || item.cantidadDisponible > 0;
    const matchSearch =
      item.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchQuery.toLowerCase());

    return matchDeporte && matchDisp && matchSearch;
  });

  const handleRequestLoan = async (e) => {
    e.preventDefault();
    if (!cancha.trim() || cantidad < 1 || cantidad > selectedItem.cantidadDisponible) return;

    setSubmitting(true);
    try {
      await apiFetch.post('/api/sports/loans', {
        itemId: selectedItem.id,
        cantidad: Number(cantidad),
        canchaOActividad: cancha.trim(),
      });
      await cargarInventario();
      setSelectedItem(null);
      setCancha('');
      setCantidad(1);
    } catch (error) {
      alert(error.message || 'No se pudo solicitar el préstamo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <h1>Material Deportivo</h1>

          <div style={{ position: 'relative', width: 260 }}>
            <input
              id="buscar-inventario"
              name="buscarInventario"
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

        <div className="filters-bar">
          {DEPORTES.map((dep) => (
            <button
              key={dep}
              type="button"
              className={`chip ${deporte === dep ? 'active' : ''}`}
              style={deporte === dep ? { backgroundColor: '#D07B7B', color: '#FFFFFF' } : {}}
              onClick={() => setDeporte(dep)}
            >
              {dep}
            </button>
          ))}

          <label
            htmlFor="solo-disponibles-check"
            style={{ marginLeft: 'auto', fontSize: 13, display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}
          >
            Solo disponibles
            <input
              id="solo-disponibles-check"
              name="soloDisponibles"
              type="checkbox"
              checked={soloDisponibles}
              onChange={(e) => setSoloDisponibles(e.target.checked)}
            />
          </label>
        </div>

        {loadingItems && <p>Cargando material deportivo...</p>}
        {errorMsg && <p className="error-text">{errorMsg}</p>}

        {!loadingItems && !errorMsg && (
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

                {!isAdmin && (
                  <button
                    type="button"
                    className="btn btn-primary btn-full"
                    disabled={item.cantidadDisponible === 0}
                    onClick={() => {
                      setSelectedItem(item);
                      setCantidad(1);
                    }}
                  >
                    {item.cantidadDisponible === 0 ? 'Agotado' : 'Solicitar préstamo'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

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

              <div className="input-group">
                <label htmlFor="cantidad-prestamo">Cantidad</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ width: 36, height: 36, padding: 0, border: '1px solid #D1D1D1' }}
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  >
                    -
                  </button>
                  <span id="cantidad-prestamo" style={{ fontWeight: 700, fontSize: 16, minWidth: 24, textAlign: 'center' }}>
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
                <label htmlFor="cancha-actividad">Cancha o Actividad</label>
                <input
                  id="cancha-actividad"
                  name="canchaOActividad"
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
                <button type="submit" className="btn btn-success" disabled={submitting}>
                  {submitting ? 'Enviando...' : 'Confirmar Préstamo'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}