import { useState } from 'react';
import { useAppStore, TipoSiniestro } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ConfigPage() {
  const tipos = useAppStore((s) => s.tiposSiniestro);
  const addTipo = useAppStore((s) => s.addTipoSiniestro);
  const updateTipo = useAppStore((s) => s.updateTipoSiniestro);
  const deleteTipo = useAppStore((s) => s.deleteTipoSiniestro);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TipoSiniestro | null>(null);
  const [nombre, setNombre] = useState('');
  const [dias, setDias] = useState(10);
  const [honorario, setHonorario] = useState(0);

  const openNew = () => { setEditing(null); setNombre(''); setDias(10); setHonorario(0); setOpen(true); };
  const openEdit = (t: TipoSiniestro) => { setEditing(t); setNombre(t.nombre); setDias(t.diasLimite); setHonorario(t.honorario); setOpen(true); };

  const handleSave = () => {
    if (!nombre.trim()) { toast.error('El nombre es obligatorio'); return; }
    if (editing) {
      updateTipo(editing.id, { nombre, diasLimite: dias, honorario });
      toast.success('Tipo actualizado');
    } else {
      addTipo({ nombre, diasLimite: dias, honorario });
      toast.success('Tipo creado');
    }
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteTipo(id);
    toast.success('Tipo eliminado');
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tipos de Siniestro</h1>
        <Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-1" /> Nuevo Tipo</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-center">Días Límite</TableHead>
                <TableHead className="text-right">Honorario ($)</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tipos.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.nombre}</TableCell>
                  <TableCell className="text-center">{t.diasLimite}</TableCell>
                  <TableCell className="text-right">${t.honorario.toLocaleString('es-AR')}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Editar Tipo' : 'Nuevo Tipo'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nombre</label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Automotores" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Días Límite</label>
              <Input type="number" value={dias} onChange={(e) => setDias(Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Honorario ($)</label>
              <Input type="number" value={honorario} onChange={(e) => setHonorario(Number(e.target.value))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
