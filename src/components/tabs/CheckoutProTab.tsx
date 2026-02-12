import { useState } from 'react';
import { CreditCard, Plus, Copy, ExternalLink, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface CheckoutPage {
  id: string;
  name: string;
  slug: string;
  price: number;
  views: number;
  conversions: number;
  isActive: boolean;
}

export default function CheckoutProTab() {
  const [pages, setPages] = useState<CheckoutPage[]>([
    { id: '1', name: 'Checkout Premium', slug: 'premium', price: 197, views: 1250, conversions: 89, isActive: true },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '', price: '' });

  const handleCreate = () => {
    if (!form.name || !form.slug || !form.price) return;
    setPages(prev => [...prev, { id: Date.now().toString(), name: form.name, slug: form.slug, price: parseFloat(form.price), views: 0, conversions: 0, isActive: true }]);
    setForm({ name: '', slug: '', price: '' });
    setIsOpen(false);
    toast.success('Página de checkout criada!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Checkout Pro</h3>
          <p className="text-muted-foreground mt-1">Páginas de venda de alta conversão estilo Kiwify/Cakto</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Nova Página</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Criar Página de Checkout</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Nome</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Checkout Premium" /></div>
              <div className="space-y-2"><Label>Slug (URL)</Label><Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="meu-produto" /></div>
              <div className="space-y-2"><Label>Preço (R$)</Label><Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="197.00" /></div>
              <Button onClick={handleCreate} className="w-full">Criar Checkout</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{pages.reduce((a, p) => a + p.views, 0)}</div><p className="text-sm text-muted-foreground">Visualizações</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{pages.reduce((a, p) => a + p.conversions, 0)}</div><p className="text-sm text-muted-foreground">Conversões</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{pages.length > 0 ? ((pages.reduce((a, p) => a + p.conversions, 0) / Math.max(pages.reduce((a, p) => a + p.views, 0), 1)) * 100).toFixed(1) : 0}%</div><p className="text-sm text-muted-foreground">Taxa de Conversão</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Páginas de Checkout</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Conversões</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs">/checkout/{p.slug}</TableCell>
                  <TableCell>R$ {p.price.toFixed(2)}</TableCell>
                  <TableCell>{p.views}</TableCell>
                  <TableCell>{p.conversions}</TableCell>
                  <TableCell><Badge variant={p.isActive ? 'default' : 'secondary'}>{p.isActive ? 'Ativo' : 'Inativo'}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/checkout/${p.slug}`); toast.success('Link copiado!'); }}><Copy className="h-3 w-3" /></Button>
                      <Button size="sm" variant="outline" onClick={() => window.open(`/checkout/${p.slug}`, '_blank')}><ExternalLink className="h-3 w-3" /></Button>
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
