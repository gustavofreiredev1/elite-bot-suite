import { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { getDeliveries, createDelivery, deleteDelivery } from '@/lib/modules';

export default function EntregaTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', delivery_type: 'link', content: '' });

  useEffect(() => {
    getDeliveries().then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!form.name || !form.content) return;
    setSaving(true);
    try {
      const d = await createDelivery(form);
      setItems(prev => [d, ...prev]);
      setShowDialog(false);
      setForm({ name: '', delivery_type: 'link', content: '' });
      toast.success('Entrega configurada!');
    } catch (err: any) { toast.error(err.message || 'Erro'); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try { await deleteDelivery(id); setItems(prev => prev.filter(x => x.id !== id)); toast.success('Removido'); } catch { toast.error('Erro'); }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Entrega Digital</h3>
          <p className="text-muted-foreground mt-1">Entregue arquivos, links e cursos automaticamente</p>
        </div>
        <Button onClick={() => setShowDialog(true)}><Plus className="mr-2 h-4 w-4" />Nova Entrega</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">{items.length}</div><p className="text-sm text-muted-foreground">Entregas Configuradas</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{items.filter(i => i.is_active).length}</div><p className="text-sm text-muted-foreground">Ativas</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{items.reduce((s, i) => s + (i.total_delivered || 0), 0)}</div><p className="text-sm text-muted-foreground">Total Entregues</p></CardContent></Card>
      </div>

      {items.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center py-16 space-y-4"><Package className="h-16 w-16 text-muted-foreground/30" /><p className="text-muted-foreground">Nenhuma entrega configurada.</p></CardContent></Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader><TableRow><TableHead>Produto</TableHead><TableHead>Tipo</TableHead><TableHead>Entregas</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
              <TableBody>
                {items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell><Badge variant="outline">{item.delivery_type}</Badge></TableCell>
                    <TableCell>{item.total_delivered || 0}</TableCell>
                    <TableCell><Badge variant={item.is_active ? 'default' : 'secondary'}>{item.is_active ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                    <TableCell><Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)}><Trash2 className="h-3 w-3" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Configurar Entrega</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Nome do Produto</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Curso Premium" /></div>
            <div className="space-y-2">
              <Label>Tipo de Entrega</Label>
              <Select value={form.delivery_type} onValueChange={v => setForm(f => ({ ...f, delivery_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="link">Link</SelectItem>
                  <SelectItem value="file">Arquivo</SelectItem>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="group">Grupo VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Conteúdo</Label><Input value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="URL, texto ou nome do arquivo" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={saving || !form.name || !form.content}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
