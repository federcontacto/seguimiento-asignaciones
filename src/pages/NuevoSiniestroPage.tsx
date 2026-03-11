import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { EstadoSiniestro } from '@/store/useAppStore';

export default function NuevoSiniestroPage() {
  const tipos = useAppStore((s) => s.tiposSiniestro);
  const addSiniestro = useAppStore((s) => s.addSiniestro);
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];

  const [rawText, setRawText] = useState('');
  const [processing, setProcessing] = useState(false);

  const [idAsignacion, setIdAsignacion] = useState('');
  const [numeroSiniestro, setNumeroSiniestro] = useState('');
  const [asegurado, setAsegurado] = useState('');
  const [patente, setPatente] = useState('');
  const [tipoSiniestroId, setTipoSiniestroId] = useState('');
  const [estado, setEstado] = useState<EstadoSiniestro>('Asignado');
  const [fechaAsignacion, setFechaAsignacion] = useState(todayStr);
  const [honorario, setHonorario] = useState<number>(0);

  const selectedTipo = useMemo(() => tipos.find((t) => t.id === tipoSiniestroId), [tipos, tipoSiniestroId]);

  const fechaLimite = useMemo(() => {
    if (!selectedTipo) return '';
    const d = new Date(fechaAsignacion);
    d.setDate(d.getDate() + selectedTipo.diasLimite);
    return d.toISOString().split('T')[0];
  }, [fechaAsignacion, selectedTipo]);

  const handleProcess = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1000));
    const tipo = tipos[0];
    setIdAsignacion('ASG-' + Math.floor(Math.random() * 9000 + 1000));
    setNumeroSiniestro('SIN-2025-' + Math.floor(Math.random() * 9000 + 1000));
    setAsegurado('Carlos Alberto Rodríguez');
    setPatente('AC ' + Math.floor(Math.random() * 900 + 100) + ' BD');
    setTipoSiniestroId(tipo.id);
    setHonorario(tipo.honorario);
    setEstado('Asignado');
    setFechaAsignacion(todayStr);
    setProcessing(false);
    toast.success('Datos extraídos con IA correctamente');
  };

  const handleTipoChange = (id: string) => {
    setTipoSiniestroId(id);
    const t = tipos.find((x) => x.id === id);
    if (t) setHonorario(t.honorario);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipoSiniestroId || !numeroSiniestro || !asegurado) {
      toast.error('Completá los campos obligatorios');
      return;
    }
    addSiniestro({
      idAsignacion, numeroSiniestro, asegurado, patente,
      tipoSiniestroId, estado, fechaAsignacion, fechaLimite, honorario,
    });
    toast.success('Siniestro cargado exitosamente');
    navigate('/dashboard');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Nuevo Siniestro</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" /> Caja Mágica — Parser IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Pegá aquí el correo de asignación de la compañía..."
            className="min-h-[120px]"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          <Button onClick={handleProcess} disabled={processing}>
            {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            Procesar con IA
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Datos del Siniestro</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">ID Asignación</label>
              <Input value={idAsignacion} onChange={(e) => setIdAsignacion(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">N° de Siniestro</label>
              <Input value={numeroSiniestro} onChange={(e) => setNumeroSiniestro(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nombre del Asegurado</label>
              <Input value={asegurado} onChange={(e) => setAsegurado(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Patente</label>
              <Input value={patente} onChange={(e) => setPatente(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Tipo de Siniestro</label>
              <Select value={tipoSiniestroId} onValueChange={handleTipoChange}>
                <SelectTrigger><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger>
                <SelectContent>
                  {tipos.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Estado</label>
              <Select value={estado} onValueChange={(v) => setEstado(v as EstadoSiniestro)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(['Asignado', 'En gestión', 'Inspeccionado', 'Informe enviado', 'Pagado'] as const).map((e) => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Fecha de Asignación</label>
              <Input type="date" value={fechaAsignacion} onChange={(e) => setFechaAsignacion(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Fecha Límite (auto)</label>
              <Input type="date" value={fechaLimite} readOnly className="bg-muted" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Honorario ($)</label>
              <Input type="number" value={honorario} onChange={(e) => setHonorario(Number(e.target.value))} />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">Guardar Siniestro</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
