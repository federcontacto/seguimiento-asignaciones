import { create } from 'zustand';

export interface TipoSiniestro {
  id: string;
  nombre: string;
  diasLimite: number;
  honorario: number;
}

export type EstadoSiniestro = 'Asignado' | 'En gestión' | 'Inspeccionado' | 'Informe enviado' | 'Pagado';

export interface Siniestro {
  id: string;
  idAsignacion: string;
  numeroSiniestro: string;
  asegurado: string;
  patente: string;
  tipoSiniestroId: string;
  estado: EstadoSiniestro;
  fechaAsignacion: string;
  fechaLimite: string;
  honorario: number;
}

export interface LinkConsulta {
  id: string;
  provincia: string;
  municipio: string;
  linkFotomultas: string;
  contacto: string;
}

interface AppState {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;

  tiposSiniestro: TipoSiniestro[];
  addTipoSiniestro: (t: Omit<TipoSiniestro, 'id'>) => void;
  updateTipoSiniestro: (id: string, t: Partial<TipoSiniestro>) => void;
  deleteTipoSiniestro: (id: string) => void;

  siniestros: Siniestro[];
  addSiniestro: (s: Omit<Siniestro, 'id'>) => void;
  updateSiniestro: (id: string, s: Partial<Siniestro>) => void;
  deleteSiniestro: (id: string) => void;

  links: LinkConsulta[];
  addLink: (l: Omit<LinkConsulta, 'id'>) => void;
  updateLink: (id: string, l: Partial<LinkConsulta>) => void;
  deleteLink: (id: string) => void;
}

const uid = () => crypto.randomUUID();

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

const initialTipos: TipoSiniestro[] = [
  { id: uid(), nombre: 'Automotores', diasLimite: 10, honorario: 45000 },
  { id: uid(), nombre: 'Motos', diasLimite: 7, honorario: 30000 },
  { id: uid(), nombre: 'Combinado', diasLimite: 15, honorario: 65000 },
];

const initialSiniestros: Siniestro[] = [
  {
    id: uid(), idAsignacion: 'ASG-001', numeroSiniestro: 'SIN-2025-0012',
    asegurado: 'Juan Carlos Pérez', patente: 'AB 123 CD',
    tipoSiniestroId: initialTipos[0].id, estado: 'Asignado',
    fechaAsignacion: fmt(addDays(today, -5)), fechaLimite: fmt(addDays(today, 5)),
    honorario: 45000,
  },
  {
    id: uid(), idAsignacion: 'ASG-002', numeroSiniestro: 'SIN-2025-0034',
    asegurado: 'María Laura González', patente: 'XY 456 ZW',
    tipoSiniestroId: initialTipos[1].id, estado: 'En gestión',
    fechaAsignacion: fmt(addDays(today, -3)), fechaLimite: fmt(addDays(today, 1)),
    honorario: 30000,
  },
  {
    id: uid(), idAsignacion: 'ASG-003', numeroSiniestro: 'SIN-2025-0056',
    asegurado: 'Roberto Díaz', patente: 'MN 789 OP',
    tipoSiniestroId: initialTipos[2].id, estado: 'Informe enviado',
    fechaAsignacion: fmt(addDays(today, -12)), fechaLimite: fmt(addDays(today, -2)),
    honorario: 65000,
  },
  {
    id: uid(), idAsignacion: 'ASG-004', numeroSiniestro: 'SIN-2025-0078',
    asegurado: 'Ana Martínez', patente: 'QR 321 ST',
    tipoSiniestroId: initialTipos[0].id, estado: 'Asignado',
    fechaAsignacion: fmt(addDays(today, -4)), fechaLimite: fmt(addDays(today, 6)),
    honorario: 45000,
  },
];

const initialLinks: LinkConsulta[] = [
  { id: uid(), provincia: 'Buenos Aires', municipio: 'La Plata', linkFotomultas: 'infraccionesba.gba.gob.ar', contacto: '0800-222-0024' },
  { id: uid(), provincia: 'CABA', municipio: 'CABA', linkFotomultas: 'buenosaires.gob.ar/licenciasdeconducir', contacto: 'infracciones@buenosaires.gob.ar' },
  { id: uid(), provincia: 'Córdoba', municipio: 'Córdoba', linkFotomultas: 'rentascordoba.gob.ar', contacto: '' },
  { id: uid(), provincia: 'Santa Fe', municipio: 'Rosario', linkFotomultas: 'rosario.gob.ar', contacto: '' },
];

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),

  tiposSiniestro: initialTipos,
  addTipoSiniestro: (t) => set((s) => ({ tiposSiniestro: [...s.tiposSiniestro, { ...t, id: uid() }] })),
  updateTipoSiniestro: (id, t) => set((s) => ({ tiposSiniestro: s.tiposSiniestro.map((x) => x.id === id ? { ...x, ...t } : x) })),
  deleteTipoSiniestro: (id) => set((s) => ({ tiposSiniestro: s.tiposSiniestro.filter((x) => x.id !== id) })),

  siniestros: initialSiniestros,
  addSiniestro: (s2) => set((s) => ({ siniestros: [...s.siniestros, { ...s2, id: uid() }] })),
  updateSiniestro: (id, s2) => set((s) => ({ siniestros: s.siniestros.map((x) => x.id === id ? { ...x, ...s2 } : x) })),
  deleteSiniestro: (id) => set((s) => ({ siniestros: s.siniestros.filter((x) => x.id !== id) })),

  links: initialLinks,
  addLink: (l) => set((s) => ({ links: [...s.links, { ...l, id: uid() }] })),
  updateLink: (id, l) => set((s) => ({ links: s.links.map((x) => x.id === id ? { ...x, ...l } : x) })),
  deleteLink: (id) => set((s) => ({ links: s.links.filter((x) => x.id !== id) })),
}));
