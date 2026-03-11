import { useMemo, useState } from 'react';
import { useAppStore, Siniestro } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LayoutGrid, List, AlertTriangle, Clock, FileText, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

function getAlertLevel(s: Siniestro): 'red' | 'orange' | 'yellow' | 'green' | null {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const limite = new Date(s.fechaLimite);
  limite.setHours(0, 0, 0, 0);
  const diffMs = limite.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return 'red';
  if (diffDays <= 2) return 'orange';

  const asignacion = new Date(s.fechaAsignacion);
  asignacion.setHours(0, 0, 0, 0);
  const diasDesdeAsignacion = (now.getTime() - asignacion.getTime()) / (1000 * 60 * 60 * 24);
  if (s.estado === 'Asignado' && diasDesdeAsignacion > 3) return 'yellow';

  return 'green';
}

const alertConfig = {
  red: { label: 'Vencido', class: 'status-badge-red', icon: AlertTriangle },
  orange: { label: 'Próximo a vencer', class: 'status-badge-orange', icon: Clock },
  yellow: { label: 'Sin gestión (+3d)', class: 'status-badge-yellow', icon: AlertTriangle },
  green: { label: 'En plazo', class: 'status-badge-green', icon: CheckCircle },
};

const estadoColumns: Siniestro['estado'][] = ['Asignado', 'En gestión', 'Inspeccionado', 'Informe enviado', 'Pagado'];

export default function DashboardPage() {
  const siniestros = useAppStore((s) => s.siniestros);
  const tipos = useAppStore((s) => s.tiposSiniestro);
  const [view, setView] = useState<'table' | 'kanban'>('table');

  const tipoMap = useMemo(() => Object.fromEntries(tipos.map((t) => [t.id, t.nombre])), [tipos]);

  const stats = useMemo(() => {
    let vencidos = 0, proximos = 0, total = siniestros.length;
    siniestros.forEach((s) => {
      const a = getAlertLevel(s);
      if (a === 'red') vencidos++;
      if (a === 'orange') proximos++;
    });
    return { total, vencidos, proximos };
  }, [siniestros]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant={view === 'table' ? 'default' : 'outline'} size="sm" onClick={() => setView('table')}>
            <List className="h-4 w-4 mr-1" /> Tabla
          </Button>
          <Button variant={view === 'kanban' ? 'default' : 'outline'} size="sm" onClick={() => setView('kanban')}>
            <LayoutGrid className="h-4 w-4 mr-1" /> Kanban
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Siniestros</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-destructive">Vencidos</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-destructive">{stats.vencidos}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-alert-orange">Próximos a Vencer</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold text-alert-orange">{stats.proximos}</div></CardContent>
        </Card>
      </div>

      {view === 'table' ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alerta</TableHead>
                  <TableHead>N° Siniestro</TableHead>
                  <TableHead>Asegurado</TableHead>
                  <TableHead>Patente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>F. Asignación</TableHead>
                  <TableHead>F. Límite</TableHead>
                  <TableHead className="text-right">Honorario</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {siniestros.map((s) => {
                  const alert = getAlertLevel(s);
                  const cfg = alert ? alertConfig[alert] : null;
                  return (
                    <TableRow key={s.id}>
                      <TableCell>
                        {cfg && (
                          <Badge className={cn('text-xs gap-1', cfg.class)}>
                            <cfg.icon className="h-3 w-3" />
                            {cfg.label}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{s.numeroSiniestro}</TableCell>
                      <TableCell>{s.asegurado}</TableCell>
                      <TableCell>{s.patente}</TableCell>
                      <TableCell>{tipoMap[s.tipoSiniestroId] || '—'}</TableCell>
                      <TableCell><Badge variant="outline">{s.estado}</Badge></TableCell>
                      <TableCell>{s.fechaAsignacion}</TableCell>
                      <TableCell>{s.fechaLimite}</TableCell>
                      <TableCell className="text-right">${s.honorario.toLocaleString('es-AR')}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {estadoColumns.map((estado) => {
            const items = siniestros.filter((s) => s.estado === estado);
            return (
              <div key={estado} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">{estado}</h3>
                  <Badge variant="secondary" className="text-xs">{items.length}</Badge>
                </div>
                <div className="space-y-2">
                  {items.map((s) => {
                    const alert = getAlertLevel(s);
                    const cfg = alert ? alertConfig[alert] : null;
                    return (
                      <Card key={s.id} className="shadow-sm">
                        <CardContent className="p-3 space-y-2">
                          {cfg && (
                            <Badge className={cn('text-xs gap-1', cfg.class)}>
                              <cfg.icon className="h-3 w-3" />
                              {cfg.label}
                            </Badge>
                          )}
                          <p className="text-sm font-medium">{s.asegurado}</p>
                          <p className="text-xs text-muted-foreground">{s.numeroSiniestro}</p>
                          <p className="text-xs text-muted-foreground">Límite: {s.fechaLimite}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {items.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">Sin siniestros</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
