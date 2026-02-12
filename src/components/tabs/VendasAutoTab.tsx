import { useState } from 'react';
import { ShoppingCart, Plus, Play, Pause, Edit, Trash2, DollarSign, Package, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface Funnel {
  id: string;
  name: string;
  productName: string;
  price: number;
  deliveryType: string;
  isActive: boolean;
  totalSales: number;
  conversions: number;
}

export default function VendasAutoTab() {
  const [funnels, setFunnels] = useState<Funnel[]>([
    { id: '1', name: 'Funil Premium', productName: 'Curso Completo', price: 197, deliveryType: 'link', isActive: true, totalSales: 45, conversions: 32 },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', productName: '', price: '', deliveryType: 'link', deliveryContent: '' });

  const handleCreate = () => {
    if (!form.name || !form.productName || !form.price) return;
    setFunnels(prev => [...prev, {
      id: Date.now().toString(),
      name: form.name,
      productName: form.productName,
      price: parseFloat(form.price),
      deliveryType: form.deliveryType,
      isActive: false,
      totalSales: 0,
      conversions: 0,
    }]);
    setForm({ name: '', productName: '', price: '', deliveryType: 'link', deliveryContent: '' });
    setIsOpen(false);
    toast.success('Funil de vendas criado!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Vendas Automáticas</h3>
          <p className="text-muted-foreground mt-1">Funil completo: captura → checkout → pagamento → entrega</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Novo Funil</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Criar Funil de Vendas</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Funil</Label>
                <Input placeholder="Ex: Funil Premium" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Nome do Produto</Label>
                <Input placeholder="Ex: Curso de Marketing" value={form.productName} onChange={e => setForm(f => ({ ...f, productName: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Preço (R$)</Label>
                <Input type="number" step="0.01" placeholder="197.00" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Entrega</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.deliveryType} onChange={e => setForm(f => ({ ...f, deliveryType: e.target.value }))}>
                  <option value="link">Link</option>
                  <option value="file">Arquivo</option>
                  <option value="group">Grupo VIP</option>
                  <option value="text">Texto</option>
                </select>
              </div>
              <Button onClick={handleCreate} className="w-full">Criar Funil</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-primary">R$ {funnels.reduce((a, f) => a + f.totalSales * f.price, 0).toFixed(2)}</div><p className="text-sm text-muted-foreground">Receita Total</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{funnels.reduce((a, f) => a + f.totalSales, 0)}</div><p className="text-sm text-muted-foreground">Total de Vendas</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{funnels.filter(f => f.isActive).length}</div><p className="text-sm text-muted-foreground">Funis Ativos</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Funis de Vendas</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funil</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Vendas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {funnels.map(f => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.name}</TableCell>
                  <TableCell>{f.productName}</TableCell>
                  <TableCell>R$ {f.price.toFixed(2)}</TableCell>
                  <TableCell>{f.totalSales}</TableCell>
                  <TableCell><Badge variant={f.isActive ? 'default' : 'secondary'}>{f.isActive ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setFunnels(prev => prev.map(x => x.id === f.id ? { ...x, isActive: !x.isActive } : x)); toast.success('Status atualizado'); }}>
                        {f.isActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      </Button>
                      <Button size="sm" variant="outline" className="hover:bg-destructive/10" onClick={() => { setFunnels(prev => prev.filter(x => x.id !== f.id)); toast.success('Funil removido'); }}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
