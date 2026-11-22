const INITIAL_ITEMS = [
  { id: 1, codigo: 'FUT-001', nombre: 'Balón de Fútbol #5', deporte: 'Fútbol', estadoFisico: 'NUEVO', cantidadTotal: 10, cantidadDisponible: 8 },
  { id: 2, codigo: 'BASQ-002', nombre: 'Balón de Básquetbol Oficial', deporte: 'Básquetbol', estadoFisico: 'BUENO', cantidadTotal: 6, cantidadDisponible: 2 },
  { id: 3, codigo: 'VOL-003', nombre: 'Red de Voleibol Profesional', deporte: 'Voleibol', estadoFisico: 'DESGASTADO', cantidadTotal: 3, cantidadDisponible: 1 },
  { id: 4, codigo: 'FUT-004', nombre: 'Conos de Entrenamiento (Set)', deporte: 'Fútbol', estadoFisico: 'BUENO', cantidadTotal: 5, cantidadDisponible: 0 },
  { id: 5, codigo: 'OTR-005', nombre: 'Raquetas de Bádminton (Par)', deporte: 'Otros', estadoFisico: 'NUEVO', cantidadTotal: 4, cantidadDisponible: 4 },
];

const INITIAL_LOANS = [
  {
    id: 101,
    itemId: 1,
    itemNombre: 'Balón de Fútbol #5',
    usuarioNombre: 'Carlos Ruiz',
    matricula: 'A01234567',
    cantidad: 2,
    canchaOActividad: 'Cancha 2 - Torneo Interno',
    fechaSalida: '2026-11-22 10:00',
    estatus: 'ACTIVO',
  },
  {
    id: 102,
    itemId: 2,
    itemNombre: 'Balón de Básquetbol Oficial',
    usuarioNombre: 'Zuri García',
    matricula: 'A01987654',
    cantidad: 1,
    canchaOActividad: 'Gimnasio Principal',
    fechaSalida: '2026-11-20 14:30',
    estatus: 'FINALIZADO',
  },
];

const INITIAL_USERS = [
  { id: 1, nombre: 'Zuri García', matricula: 'A01987654', email: 'zuri@universidad.edu.mx', activo: true, role: 'USER' },
  { id: 2, nombre: 'Carlos Ruiz', matricula: 'A01234567', email: 'carlos@universidad.edu.mx', activo: true, role: 'USER' },
  { id: 3, nombre: 'Coord. Deportes', matricula: 'ADM-001', email: 'admin@universidad.edu.mx', activo: true, role: 'ADMIN' },
];

export function getItems() {
  const saved = sessionStorage.getItem('mock_items');
  if (!saved) {
    sessionStorage.setItem('mock_items', JSON.stringify(INITIAL_ITEMS));
    return INITIAL_ITEMS;
  }
  return JSON.parse(saved);
}

export function saveItems(items) {
  sessionStorage.setItem('mock_items', JSON.stringify(items));
}

export function getLoans() {
  const saved = sessionStorage.getItem('mock_loans');
  if (!saved) {
    sessionStorage.setItem('mock_loans', JSON.stringify(INITIAL_LOANS));
    return INITIAL_LOANS;
  }
  return JSON.parse(saved);
}

export function saveLoans(loans) {
  sessionStorage.setItem('mock_loans', JSON.stringify(loans));
}

export function getUsers() {
  const saved = sessionStorage.getItem('mock_users');
  if (!saved) {
    sessionStorage.setItem('mock_users', JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(saved);
}

export function saveUsers(users) {
  sessionStorage.setItem('mock_users', JSON.stringify(users));
}