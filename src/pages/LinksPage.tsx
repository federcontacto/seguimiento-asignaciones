import { useState } from 'react';
import { useAppStore, LinkConsulta } from '@/store/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Search, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function LinksPage() {
  const links = useAppStore((s) => s.links);
  const addLink = useAppStore((s) => s.addLink);
  const updateLink = useAppStore((s) => s.updateLink);
  const deleteLink = useAppStore((s) => s.deleteLink);

  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LinkConsulta | null>(null);
  const [provincia, setProvincia] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [linkFoto, setLinkFoto] = useState('');
  const [contacto, setContacto] = useState('');

  const filtered = links.filter((l) => {
    const q = search.toLowerCase();
    return l.provincia.toLowerCase().includes(q) || l.municipio.toLowerCase().includes(q) || l.linkFotomultas.toLowerCase().includes(q);
  });

  const openNew = () => { setEditing(null); setProvincia(''); setMunicipio(''); setLinkFoto(''); setContacto(''); setOpen(true); };
  const openEdit = (l: LinkConsulta) => { setEditing(l); setProvincia(l.provincia); setMunicipio(l.municipio); setLinkFoto(l.linkFotomultas); setContacto(l.contacto); setOpen(true); };

  const handleSave = () => {
    if (!provincia.trim()) { toast.error('Provincia obligatoria'); return; }
    if (editing) {
      updateLink(editing.id, { provincia, municipio, linkFotomultas: linkFoto, contacto });
      toast.success('Enlace actualizado');
    } else {
      addLink({ provincia, municipio, linkFotomultas: linkFoto, contacto });
      toast.success('Enlace creado');
    }
    setOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Consultas e Infracciones</h1>
        <Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-1" /> Nuevo Enlace</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar provincia, municipio..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provincia</TableHead>
                <TableHead>Municipio</TableHead>
                <TableHead>Link Fotomultas</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.provincia}</TableCell>
                  <TableCell>{l.municipio}</TableCell>
                  <TableCell>
                    <a href={`https://${l.linkFotomultas}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline text-sm">
                      {l.linkFotomultas} <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                  <TableCell className="text-sm">{l.contacto || '—'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(l)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { deleteLink(l.id); toast.success('Eliminado'); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Sin resultados</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Editar Enlace' : 'Nuevo Enlace'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5"><label className="text-sm font-medium">Provincia</label><Input value={provincia} onChange={(e) => setProvincia(e.target.value)} /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Municipio</label><Input value={municipio} onChange={(e) => setMunicipio(e.target.value)} /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Link Fotomultas</label><Input value={linkFoto} onChange={(e) => setLinkFoto(e.target.value)} placeholder="ejemplo.gob.ar" /></div>
            <div className="space-y-1.5"><label className="text-sm font-medium">Contacto</label><Input value={contacto} onChange={(e) => setContacto(e.target.value)} /></div>
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
