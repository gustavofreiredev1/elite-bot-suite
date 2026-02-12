import { useState } from 'react';
import { Package, Plus, Link, FileText, Shield, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface Delivery {
  id: string;
  name: string;
  type: 'link' | 'file' | 'text' | 'group';
  content: string;
  deliveries: number;
  isActive: boolean;
}

export default function EntregaTab() {
  const [items, setItems] = useState<Delivery[]>([
    { id: '1', name: 'Curso Premium', type: 'link', content: 'https://curso.com/acesso', deliveries: 45, isActive: true },
    { id: '2', name: 'eBook Marketing', type: 'file', content: 'ebook.pdf', deliveries: 123, isActive: true },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'link' as string, content: '' });

  const handleCreate = () => {
    if (!form.name || !form.content) return;
    setItems(prev => [...prev, { id: Date.now().toString(), name: form.name, type: form.type as any, content: form.content, deliveries: 0, isActive: true }]);
    setForm({ name: '', type: 'link', content: '' });
    setIsOpen(false);
    toast.success('Entrega configurada!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Entrega Digital</h3>
          <p className="text-muted-foreground mt-1">Entregue arquivos, links e cursos automaticamente</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Nova Entrega</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Configurar Entrega</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nome do Produto</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Curso Premium" /></div>
              <div className="space-y-2">
                <Label>Tipo de Entrega</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="link">Link</option>
                  <option value="file">Arquivo</option>
                  <option value="text">Texto</option>
                  <option value="group">Grupo VIP</option>
                </select>
              </div>
              <div className="space-y-2"><Label>Conteúdo</Label><Input value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="URL, texto ou nome do arquivo" /></div>
              <Button onClick={handleCreate} className="w-full">Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" />Entregas Configuradas</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Produto</TableHead><TableHead>Tipo</TableHead><TableHead>Entregas</TableHead><TableHead>Status</TableHead><TableHead>Ações</TableHead></TableRow></TableHeader>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell><Badge variant="outline">{item.type}</Badge></TableCell>
                  <TableCell>{item.deliveries}</TableCell>
                  <TableCell><Badge variant={item.isActive ? 'default' : 'secondary'}>{item.isActive ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                  <TableCell><Button size="sm" variant="outline" onClick={() => { setItems(prev => prev.filter(x => x.id !== item.id)); toast.success('Removido'); }}><Trash2 className="h-3 w-3" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
